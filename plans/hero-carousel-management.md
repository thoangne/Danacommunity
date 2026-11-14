# Kế hoạch Triển khai & Thiết kế Kỹ thuật: Hệ thống Quản trị Hero Carousel / Banner Đầu Trang

> **Mã công việc**: `FEATURE-ADMIN-HERO-CAROUSEL`  
> **Người thực hiện**: Antigravity AI Engineering  
> **Phân loại**: Feature Development / Large Risk Tier  
> **Trạng thái**: `IN_PROGRESS`  
> **Tuân thủ**: OpenAI Codex Engineering Protocol — ChampaWeb (`AGENTS.md`) & `.codex/workflows/feature-development.md`

---

## 1. Mục tiêu & Phạm vi (Requirements & Scope)

### 1.1. Bối cảnh
Trang chủ (`DanaHome.tsx`) hiện sử dụng component `DanaLifeCarousel.tsx` làm banner chính ở ngay đầu trang để giới thiệu các danh thắng và làng nghề văn hóa Champa tiêu biểu (Tháp Po Klong Garai, Làng Gốm Bàu Trúc, Thổ Cẩm Mỹ Nghiệp, Đền Tháp Po Rome, Cảnh sắc Panduranga). Tuy nhiên, hiện tại dữ liệu này đang được hardcode tĩnh trong mảng `PHOTO_SLIDES` và **chưa có màn hình quản trị CMS** trong bảng điều khiển Admin (`/admin`).

### 1.2. Mục tiêu
1. Cung cấp màn hình quản trị toàn diện (`/admin/banners`) cho phép Ban Quản trị thêm, sửa, xóa, sắp xếp thứ tự và bật/tắt hiển thị các slide carousel ở đầu trang.
2. Thiết kế hệ thống dữ liệu (PostgreSQL Knex migration + In-memory Fallback) và RESTful API chuẩn mực, hỗ trợ kiểm soát quyền hạn RBAC (`admin`, `editor`) và ghi nhật ký kiểm toán (`activity_logs`).
3. Tích hợp thư viện `MediaPickerModal` giúp quản trị viên dễ dàng chọn ảnh có sẵn, tải ảnh mới lên hoặc nhập URL tùy ý.
4. Cung cấp tính năng Live Preview thời gian thực ngay trên giao diện quản trị để người dùng xem trước chính xác slide trước khi lưu.
5. Cập nhật `DanaLifeCarousel.tsx` ở trang chủ để nạp dữ liệu động từ API `/api/banners`, đồng thời duy trì fallback dữ liệu mặc định nhằm đảm bảo tính sẵn sàng cao (High Availability), không bao giờ làm gián đoạn trải nghiệm người dùng cuối.

---

## 2. Tiêu chí Chấp thuận (Acceptance Criteria)

1. **Cơ sở dữ liệu & Migrations**:
   - Migration `2026110803_create_hero_banners.js` tạo bảng `hero_banners` an toàn, có chỉ mục `display_order`, `is_active`, `position`.
   - Seed tự động 5 slide ban đầu tương đương với `PHOTO_SLIDES` hiện hữu để đảm bảo tính liên tục của dữ liệu.
   - Hỗ trợ rollback sạch qua lệnh `down()`.

2. **API Backend**:
   - `GET /api/banners`: Endpoint công khai, trả về danh sách slide đang kích hoạt (`is_active = true`), sắp xếp theo `display_order ASC`.
   - `GET /api/admin/banners`: Endpoint quản trị (yêu cầu vai trò `admin` hoặc `editor`), hỗ trợ tìm kiếm từ khóa và lọc theo trạng thái (`all`, `active`, `inactive`).
   - `GET /api/admin/banners/:id`: Chi tiết một slide.
   - `POST /api/admin/banners`: Thêm slide mới với kiểm tra tính hợp lệ (title, category, image_url bắt buộc), tự động xác định thứ tự `display_order`.
   - `PUT /api/admin/banners/:id`: Cập nhật thông tin slide.
   - `PATCH /api/admin/banners/:id/status`: Bật/tắt nhanh trạng thái hiển thị của slide.
   - `PUT /api/admin/banners/reorder`: Cập nhật đồng loạt vị trí hiển thị slide.
   - `DELETE /api/admin/banners/:id`: Xóa slide (chỉ cho phép vai trò `admin`).
   - Tất cả các tác vụ thay đổi dữ liệu đều ghi nhật ký kiểm toán vào bảng `activity_logs` (`BANNER_CREATE`, `BANNER_UPDATE`, `BANNER_STATUS_TOGGLE`, `BANNER_REORDER`, `BANNER_DELETE`).

3. **Giao diện Quản trị (Frontend CMS)**:
   - Tạo trang `frontend/src/pages/admin/AdminBannersPage.tsx` đạt chuẩn thiết kế di sản Champa:
     - Thống kê tổng quan: Tổng số slide, Số slide đang chiếu, Số slide ẩn, Tần suất phát.
     - Bảng danh sách với ảnh xem trước, tiêu đề, tiêu đề phụ, chuyên mục, địa danh, niên đại.
     - Công tắc bật/tắt (Toggle Switch) nhanh trạng thái kích hoạt với phản hồi Toast thông báo.
     - Nút tăng/giảm thứ tự hiển thị (Move Up / Down) trực tiếp trên từng dòng.
     - Modal Thêm/Sửa slide đầy đủ trường thông tin, tích hợp `MediaPickerModal` và khung Live Preview trực quan thời gian thực.
     - Modal xem trước kích thước lớn (Fullscreen Preview).
     - Xác nhận an toàn khi xóa slide.
   - Đăng ký mục "Banner & Carousel" trong `AdminSidebar.tsx` dưới nhóm `NỘI DUNG DI SẢN`.
   - Cấu hình Lazy Route `/admin/banners` và redirect `/admin/carousel` trong `App.tsx`.
   - Bổ sung thẻ thống kê Carousel trên `AdminDashboardPage.tsx`.

4. **Trang chủ Người dùng (Public Experience)**:
   - `DanaLifeCarousel.tsx` kết nối API `/api/banners`, xử lý trạng thái đang nạp (loading) mượt mà và fallback an toàn nếu mất kết nối hoặc API trả về rỗng.

5. **Chất lượng Mã nguồn & Kiểm thử**:
   - Viết bộ kiểm thử tự động `backend/test/admin-banners.test.js` kiểm tra validation, RBAC, CRUD, audit logs và batch reorder.
   - `npm test --prefix backend` vượt qua toàn bộ 100% tests.
   - `npm run build --prefix frontend` biên dịch thành công 0 lỗi TypeScript.
   - `node -c` xác nhận cú pháp toàn bộ file backend mới/sửa đổi.

---

## 3. Thiết kế Kỹ thuật (Technical Design)

### 3.1. Mô hình Dữ liệu (PostgreSQL Schema)

```sql
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    location VARCHAR(255),
    date_display VARCHAR(100),
    description TEXT,
    author VARCHAR(100),
    link_url VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    position VARCHAR(50) DEFAULT 'home_hero',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hero_banners_position_active ON public.hero_banners(position, is_active, display_order);
```

### 3.2. Cấu trúc API & Endpoints

| Tuyến đường (Route) | Phương thức | Quyền hạn | Mô tả |
|---|---|---|---|
| `/api/banners` | `GET` | Công khai | Lấy danh sách slide đang kích hoạt cho trang chủ |
| `/api/admin/banners` | `GET` | `admin`, `editor` | Lấy danh sách toàn bộ slide, hỗ trợ search/filter |
| `/api/admin/banners/:id` | `GET` | `admin`, `editor` | Chi tiết slide theo ID |
| `/api/admin/banners` | `POST` | `admin`, `editor` | Tạo mới slide banner |
| `/api/admin/banners/:id` | `PUT` | `admin`, `editor` | Cập nhật thông tin slide |
| `/api/admin/banners/:id/status` | `PATCH` | `admin`, `editor` | Bật/tắt hiển thị slide |
| `/api/admin/banners/reorder` | `PUT` | `admin`, `editor` | Cập nhật thứ tự sắp xếp hàng loạt |
| `/api/admin/banners/:id` | `DELETE` | `admin` | Xóa slide khỏi hệ thống |

---

## 4. Kế hoạch Thực hiện Từng bước (Execution Checklist)

- [x] **Giai đoạn 1**: Khảo sát hiện trạng `DanaLifeCarousel.tsx`, cơ sở dữ liệu và hệ thống quản trị hiện tại.
- [ ] **Giai đoạn 2**: Tạo migration `2026110803_create_hero_banners.js` và cập nhật `backend/database/schema_all.sql`.
- [ ] **Giai đoạn 3**: Triển khai `adminService.js` (hỗ trợ DB + in-memory store) và các phương thức CRUD, status toggle, batch reorder, audit log.
- [ ] **Giai đoạn 4**: Cập nhật `adminController.js`, viết `bannerController.js`, mount routes trong `backend/src/routes/adminRoutes.js` và `backend/src/routes/bannerRoutes.js`.
- [ ] **Giai đoạn 5**: Viết bộ kiểm thử tự động `backend/test/admin-banners.test.js` và xác minh bằng `npm test --prefix backend`.
- [ ] **Giai đoạn 6**: Xây dựng UI `AdminBannersPage.tsx` với bảng danh sách, bộ lọc, modal form, Live Preview và Media Picker.
- [ ] **Giai đoạn 7**: Cập nhật `AdminSidebar.tsx`, `AdminDashboardPage.tsx` và cấu hình route trong `App.tsx`.
- [ ] **Giai đoạn 8**: Cập nhật `DanaLifeCarousel.tsx` kết nối API với cơ chế fallback tự động.
- [ ] **Giai đoạn 9**: Kiểm tra toàn diện Typecheck, Build, Lint, Node syntax và hoàn tất báo cáo kỹ thuật.
