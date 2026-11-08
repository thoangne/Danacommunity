# Kế hoạch Triển khai: Hệ thống Quản trị Sản phẩm Làng nghề & Hồ sơ Nghệ nhân Chăm (CMS Admin CRUD)

> **Mã công việc**: `FEATURE-ADMIN-PRODUCTS-ARTISANS`  
> **Người thực hiện**: Antigravity AI Engineering  
> **Phân loại**: Feature Development / Large Risk Tier  
> **Tuân thủ**: OpenAI Codex Engineering Protocol — ChampaWeb (`AGENTS.md`)

---

## 1. Mục tiêu & Phạm vi (Requirements & Scope)
Cung cấp giao diện và API quản trị toàn diện (CRUD) cho Ban Quản trị nền tảng Di sản ChampaWeb nhằm:
1. Quản lý tác phẩm gốm Bàu Trúc, thổ cẩm Mỹ Nghiệp, nhạc cụ Hữu Đức (`craft_products`).
2. Quản lý hồ sơ các Nghệ nhân Chăm giữ lửa di sản (`artisans`).
3. Tích hợp quản trị phân loại làng nghề (`craft_categories`) và liên kết nghệ nhân với tác phẩm.
4. Tích hợp thư viện Media Picker, kiểm soát quyền hạn RBAC (`admin`, `editor`), ghi log kiểm toán (`activity_logs`).

---

## 2. Tiêu chí Chấp thuận (Acceptance Criteria)
1. **API Backend**:
   - `GET /api/admin/products`: Phân trang, tìm kiếm theo tên/chất liệu, lọc theo danh mục, làng nghề, nghệ nhân, nổi bật.
   - `GET /api/admin/products/:id`: Chi tiết sản phẩm.
   - `POST /api/admin/products`: Tạo mới sản phẩm với kiểm tra hợp lệ dữ liệu, tự động tạo slug, lưu danh sách ảnh và chất liệu.
   - `PUT /api/admin/products/:id`: Cập nhật thông tin sản phẩm.
   - `DELETE /api/admin/products/:id`: Xoá sản phẩm (chỉ vai trò `admin`).
   - `GET /api/admin/artisans`: Phân trang, tìm kiếm theo tên, lọc theo làng nghề, trạng thái hoạt động.
   - `GET /api/admin/artisans/:id`: Chi tiết nghệ nhân kèm danh sách tác phẩm liên kết.
   - `POST /api/admin/artisans`: Tạo hồ sơ nghệ nhân mới.
   - `PUT /api/admin/artisans/:id`: Cập nhật thông tin nghệ nhân.
   - `DELETE /api/admin/artisans/:id`: Xoá nghệ nhân (chỉ vai trò `admin`), xử lý liên kết khóa ngoại.
   - `GET /api/admin/craft-categories`: Lấy danh sách chuyên mục thủ công phục vụ dropdown chọn.
   - Tất cả các thao tác ghi dữ liệu đều ghi log kiểm toán tương ứng (`PRODUCT_CREATE`, `PRODUCT_UPDATE`, `PRODUCT_DELETE`, `ARTISAN_CREATE`, `ARTISAN_UPDATE`, `ARTISAN_DELETE`).
2. **Frontend UI CMS**:
   - Màn hình `/admin/products`: Bảng danh sách, bộ lọc, xem trước ảnh, huy hiệu, modal Form thêm/sửa tác phẩm có Media Picker.
   - Màn hình `/admin/artisans`: Bảng danh sách, avatar, số năm cống hiến, sở trường, modal Form thêm/sửa nghệ nhân.
   - Bổ sung nhóm điều hướng "LÀNG NGHỀ & NGHỆ NHÂN" trong Sidebar.
   - Bổ sung thẻ thống kê sản phẩm & nghệ nhân trên Dashboard.
3. **Chất lượng mã & Kiểm thử**:
   - `npm test --prefix backend` vượt qua toàn bộ kiểm thử bảo mật và logic nghiệp vụ.
   - `npm run build --prefix frontend` biên dịch thành công 0 lỗi TypeScript.
   - `npm run lint --prefix frontend` không phát sinh lỗi linting mới.
   - `node -c` xác minh cú pháp toàn bộ file backend mới/sửa đổi.

---

## 3. Thiết kế Kỹ thuật (Technical Design)

### 3.1. Cơ sở dữ liệu (PostgreSQL)
Sử dụng 3 bảng đã có trong migration `2026110703_create_products_and_artisans.js` và `schema_all.sql`:
- `artisans`: Lưu danh tính, kinh nghiệm, làng nghề, trích dẫn triết lý, hình ảnh đại diện và bàn tay.
- `craft_categories`: Lưu danh mục làng nghề ("gom-bau-truc", "tho-cam-my-nghiep", "nhac-cu-huu-duc", "dieu-khac-my-nghe").
- `craft_products`: Lưu tác phẩm, giá, chất liệu, kích thước, ảnh, ý nghĩa văn hóa và khóa ngoại `artisan_id`.

### 3.2. Cấu trúc Tệp tin Triển khai
```
backend/
├── src/services/adminService.js       # Thêm phương thức CRUD Products & Artisans & Categories
├── src/controllers/adminController.js # Thêm controller handlers
├── src/routes/adminRoutes.js          # Khai báo các endpoints quản trị
└── test/admin-products-artisans.test.js # Bộ kiểm thử tự động toàn diện

frontend/
├── src/pages/admin/AdminProductsPage.tsx # Màn hình quản lý tác phẩm làng nghề
├── src/pages/admin/AdminArtisansPage.tsx # Màn hình quản lý hồ sơ nghệ nhân
├── src/components/admin/AdminSidebar.tsx # Cập nhật thanh điều hướng
├── src/pages/admin/AdminDashboardPage.tsx # Cập nhật thẻ thống kê tổng quan
└── src/App.tsx                          # Đăng ký lazy route mới
```

---

## 4. Kế hoạch Thực hiện Từng bước (Step-by-Step Execution Plan)
- [x] Giai đoạn 1: Phân tích yêu cầu & khảo sát schema hiện hữu.
- [ ] Giai đoạn 2: Cập nhật `adminService.js` với đầy đủ nghiệp vụ CRUD Sản phẩm & Nghệ nhân (hỗ trợ DB + In-memory Fallback).
- [ ] Giai đoạn 3: Cập nhật `adminController.js` và `adminRoutes.js`.
- [ ] Giai đoạn 4: Viết bài kiểm thử tự động `backend/test/admin-products-artisans.test.js` và chạy xác minh.
- [ ] Giai đoạn 5: Xây dựng UI `AdminProductsPage.tsx` (Bảng, Bộ lọc, Modal Form, Media Picker, Xóa xác nhận).
- [ ] Giai đoạn 6: Xây dựng UI `AdminArtisansPage.tsx` (Bảng, Bộ lọc, Modal Form, Media Picker, Xóa xác nhận).
- [ ] Giai đoạn 7: Cập nhật `AdminSidebar.tsx`, `AdminDashboardPage.tsx`, và `App.tsx`.
- [ ] Giai đoạn 8: Chạy kiểm tra Typecheck, Build, Lint toàn dự án.
- [ ] Giai đoạn 9: Đánh giá tự kiểm tra (Code Review) và Báo cáo Hoàn tất.
