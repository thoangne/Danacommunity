# Hướng Dẫn Kỹ Thuật & Cấu Hình OAuth 2.0 (Google & Facebook) — ChampaWeb

Tài liệu này hướng dẫn chi tiết về kiến trúc xác thực mạng xã hội (Social Login) sử dụng giao thức OAuth 2.0 / OpenID Connect, mô hình dữ liệu, các bước thiết lập cấu hình trên Google Cloud Console & Meta for Developers, cũng như quy trình kiểm thử và xử lý sự cố.

---

## 1. Kiến trúc Xác thực & Luồng Dữ liệu (OAuth Flow)

ChampaWeb áp dụng **OAuth 2.0 Authorization Code Grant Flow** với xác thực CSRF State mật mã học hai chiều (Two-way Cryptographic State Verification):

```
+-------------+              +------------------------+              +-----------------------+
| Trình duyệt |              | Backend API (Express 5)|              | Google / Facebook IDP |
+------+------+              +-----------+------------+              +-----------+-----------+
       |                                 |                                       |
       |  1. Click Đăng nhập Google/FB  |                                       |
       |-------------------------------->|                                       |
       |                                 |  2. Tạo 32-byte CSRF State Token     |
       |                                 |     và ký HMAC-SHA256                 |
       |  3. Chuyển hướng (302 Redirect) |                                       |
       |<--------------------------------|                                       |
       |                                                                         |
       |  4. Chuyển tiếp tới trang đăng nhập & đồng ý quyền                      |
       |------------------------------------------------------------------------>|
       |                                                                         |
       |  5. Người dùng xác thực & cấp quyền OpenID / Email / Profile            |
       |------------------------------------------------------------------------>|
       |                                                                         |
       |  6. IDP Redirect về kèm ?code=...&state=...                             |
       |-------------------------------->|                                       |
       |                                 |  7. Xác thực chữ ký State & Expiry    |
       |                                 |  8. Gửi POST đổi code lấy Token       |
       |                                 |-------------------------------------->|
       |                                 |  9. Trả về access_token & id_token    |
       |                                 |<--------------------------------------|
       |                                 | 10. Lấy thông tin User Profile đã xác |
       |                                 |     nhận (sub/id, email, verified)    |
       |                                 | 11. Transaction Knex DB:              |
       |                                 |     - Kiểm tra oauth_accounts         |
       |                                 |     - Kiểm tra profiles.email         |
       |                                 |     - Chống Takeover (unverified email|
       |                                 |     - Gắn kết hoặc tạo mới User       |
       |                                 | 12. Ký JWT Bearer Token an toàn       |
       | 13. Redirect về Frontend:       |                                       |
       |     /auth/callback?token=...    |                                       |
       |<--------------------------------|                                       |
       |                                 |                                       |
       | 14. Frontend lưu Token, gọi     |                                       |
       |     GET /api/auth/me đồng bộ    |                                       |
       |-------------------------------->|                                       |
       | 15. Trả về Profile & điều hướng |                                       |
       |     về returnTo hoặc Trang chủ  |                                       |
       |<--------------------------------|                                       |
```

---

## 2. Thay đổi Cơ sở dữ liệu (Database Schema & Migration)

Migration file: [`backend/database/migrations/2026110801_create_oauth_accounts.js`](file:///Users/thoangnn/dev/Project/ChampaWeb/backend/database/migrations/2026110801_create_oauth_accounts.js)

### Bảng `public.profiles` (Bổ sung cột)
- `email_verified`: `BOOLEAN DEFAULT FALSE` (Đánh dấu trạng thái email đã được xác minh bởi nhà cung cấp danh tính).

### Bảng mới `public.oauth_accounts`
Lưu trữ quan hệ 1-N (Một người dùng có thể liên kết nhiều mạng xã hội):

```sql
CREATE TABLE public.oauth_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'google' | 'facebook'
    provider_user_id VARCHAR(255) NOT NULL,
    provider_email VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_oauth_accounts_provider_uid UNIQUE (provider, provider_user_id)
);

CREATE INDEX idx_oauth_accounts_user_id ON public.oauth_accounts(user_id);
CREATE INDEX idx_oauth_accounts_provider_uid ON public.oauth_accounts(provider, provider_user_id);
```

### Quy tắc An toàn Liên kết Tài khoản
1. **Chống Chiếm đoạt Tài khoản (Account Takeover)**: Nếu một người dùng đăng nhập bằng Google/Facebook có email trùng với tài khoản đã tồn tại trong hệ thống, hệ thống **CHỈ** tự động liên kết nếu `email_verified: true` từ nhà cung cấp OAuth. Nếu email chưa được xác minh, hệ thống từ chối liên kết để ngăn kẻ tấn công chiếm quyền.
2. **Ngăn chặn Nhân bản (Duplicate Accounts)**: Ràng buộc duy nhất `UNIQUE (provider, provider_user_id)` đảm bảo mỗi tài khoản mạng xã hội chỉ gắn với một thực thể duy nhất.
3. **Giao dịch Nguyên tử (Database Transaction)**: Mọi thao tác tìm kiếm, tạo tài khoản và ghi nhận liên kết đều được bọc trong Knex transaction (`db.transaction`), tự động rollback khi phát sinh lỗi.
4. **Không lưu trữ Access Token**: Hệ thống không lưu trữ token truy cập của Google/Facebook trong DB vì chỉ cần dùng cho mục đích xác thực danh tính ban đầu, loại trừ rủi ro rò rỉ dữ liệu bên ngoài.

---

## 3. Danh mục Biến môi trường Cần thiết

Cấu hình trong file `backend/.env` (hoặc Secret Manager trên Production):

```env
# ------------------------------------------------------------------------------
# Authentication & JWT Configuration
# ------------------------------------------------------------------------------
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars
JWT_EXPIRES_IN=7d

# ------------------------------------------------------------------------------
# Google OAuth 2.0 (Google Cloud Console Credentials)
# ------------------------------------------------------------------------------
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# ------------------------------------------------------------------------------
# Facebook OAuth 2.0 (Meta for Developers Credentials)
# ------------------------------------------------------------------------------
FACEBOOK_APP_ID=1234567890
FACEBOOK_APP_SECRET=abcdef123456
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# ------------------------------------------------------------------------------
# Application URLs (CORS & Redirect Whitelist)
# ------------------------------------------------------------------------------
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

---

## 4. Hướng dẫn Cấu hình Google OAuth (Google Cloud Console)

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Chọn hoặc tạo dự án mới (ví dụ: `ChampaWeb-Heritage`).
3. Đi tới **APIs & Services** > **OAuth consent screen**:
   - Chọn User Type: **External**.
   - App name: `ChampaWeb - Dana Community Tourism`.
   - User support email: Email quản trị của bạn.
   - Scopes: Chọn `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile`.
4. Đi tới **APIs & Services** > **Credentials**:
   - Nhấn **Create Credentials** > **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `ChampaWeb Web Client`.
   - **Authorized JavaScript origins**:
     - Local: `http://localhost:5000`, `http://localhost:5173`
     - Production: `https://your-domain.vn`
   - **Authorized redirect URIs**:
     - Local: `http://localhost:5000/api/auth/google/callback`
     - Production: `https://your-domain.vn/api/auth/google/callback`
5. Sao chép **Client ID** và **Client Secret** vào `backend/.env`.

---

## 5. Hướng dẫn Cấu hình Facebook OAuth (Meta for Developers)

1. Truy cập [Meta for Developers](https://developers.facebook.com/).
2. Đăng nhập và nhấn **My Apps** > **Create App**.
3. Chọn Use Case: **Authenticate and request data from users with Facebook Login**.
4. Thiết lập sản phẩm **Facebook Login for Business** hoặc **Facebook Login**:
   - Chọn Settings trong mục Facebook Login.
   - **Valid OAuth Redirect URIs**:
     - Local: `http://localhost:5000/api/auth/facebook/callback`
     - Production: `https://your-domain.vn/api/auth/facebook/callback`
   - Đảm bảo bật **Client OAuth Login** và **Web OAuth Login**.
5. Đi tới **App settings** > **Basic**:
   - Sao chép **App ID** (`FACEBOOK_APP_ID`).
   - Nhấn Show để sao chép **App Secret** (`FACEBOOK_APP_SECRET`).
   - Điền Privacy Policy URL & Terms of Service URL.
6. Chuyển App mode từ **In development** sang **Live** khi triển khai Production.

---

## 6. Hướng dẫn Chạy Thử nghiệm & Phát triển Local

```bash
# 1. Chạy di trú cơ sở dữ liệu
npm run migrate --prefix backend

# 2. Chạy bộ kiểm thử tự động xác thực OAuth (14 test cases)
npm run test --prefix backend

# 3. Khởi động môi trường dev đồng thời cả Frontend và Backend
npm run dev
```

Truy cập trình duyệt tại `http://localhost:5173/dang-nhap` hoặc click nút Đăng nhập trên thanh điều hướng để trải nghiệm các nút **Google** và **Facebook**.

---

## 7. Các Lỗi Thường Gặp & Cách Khắc Phục (Troubleshooting)

| Mã lỗi / Hiện tượng | Nguyên nhân | Cách khắc phục |
|---|---|---|
| `redirect_uri_mismatch` (Google) | Callback URL gửi lên không khớp chính xác từng ký tự với URI đã khai báo trên Google Cloud Console. | Kiểm tra `GOOGLE_CALLBACK_URL` trong `backend/.env`, đảm bảo có đầy đủ giao thức `http/https`, port và đường dẫn `/api/auth/google/callback`. |
| `URL Blocked` (Facebook) | Callback URL chưa được thêm vào mục *Valid OAuth Redirect URIs* trong Meta App Settings. | Mở Meta for Developers > Facebook Login > Settings > Thêm URI callback vào danh sách. |
| `Xác thực OAuth state thất bại (CSRF)` | Tham số `state` bị sửa đổi hoặc request callback vượt quá thời hạn 10 phút. | Thử lại quá trình đăng nhập; kiểm tra `JWT_SECRET` đã được cố định trong `.env` chưa. |
| `Địa chỉ email từ Google/Facebook chưa được xác minh` | Tài khoản mạng xã hội chưa xác minh email chính thức. | Bảo vệ chống account takeover: Yêu cầu người dùng xác minh email trên Google/Facebook hoặc đăng nhập bằng tài khoản email gốc. |
| `429 Too Many Requests` | Gửi quá nhiều yêu cầu xác thực trong thời gian ngắn (Rate Limiting). | Đợi 15 phút hoặc điều chỉnh ngưỡng giới hạn trong `backend/src/middlewares/authRateLimiter.js`. |

