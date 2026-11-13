import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthModal from "./components/auth/AuthModal";
import { Toaster } from "./components/ui/sonner";
import { AudioProvider } from "./lib/AudioContext";
import { AuthProvider } from "./context/AuthContext";
import { Loader2 } from "lucide-react";

// Public Pages (Nạp lười Lazy Load giúp giảm kích thước bundle ban đầu cho người dùng)
const DanaHome = lazy(() => import("./pages/DanaHome"));
const TourListPage = lazy(() => import("./pages/TourListPage"));
const TourDetailPage = lazy(() => import("./pages/TourDetailPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const DigitalHeritagePage = lazy(() => import("./pages/DigitalHeritagePage"));
const ProductListPage = lazy(() => import("./pages/ProductListPage"));
const ArtisansPage = lazy(() => import("./pages/ArtisansPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const OAuthCallbackPage = lazy(() => import("./pages/OAuthCallbackPage"));

// Admin CMS Modules (Tách chunk Lazy Load giúp giảm kích thước bundle trang người dùng)
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminArticlesPage = lazy(() => import("./pages/admin/AdminArticlesPage"));
const AdminArticleCreatePage = lazy(() => import("./pages/admin/AdminArticleCreatePage"));
const AdminArticleEditPage = lazy(() => import("./pages/admin/AdminArticleEditPage"));
const AdminNewsPage = lazy(() => import("./pages/admin/AdminNewsPage"));
const AdminNewsCreatePage = lazy(() => import("./pages/admin/AdminNewsCreatePage"));
const AdminNewsEditPage = lazy(() => import("./pages/admin/AdminNewsEditPage"));
const AdminCategoriesPage = lazy(() => import("./pages/admin/AdminCategoriesPage"));
const AdminProductsPage = lazy(() => import("./pages/admin/AdminProductsPage"));
const AdminArtisansPage = lazy(() => import("./pages/admin/AdminArtisansPage"));
const AdminMediaPage = lazy(() => import("./pages/admin/AdminMediaPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminActivityLogsPage = lazy(() => import("./pages/admin/AdminActivityLogsPage"));
const AdminSettingsPage = lazy(() => import("./pages/admin/AdminSettingsPage"));

function PageLoader({ message = "Đang nạp dữ liệu di sản..." }: { message?: string }) {
  return (
    <div className="min-h-[70vh] bg-surface flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <span className="font-serif text-xs text-on-surface-variant tracking-wider">
        {message}
      </span>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Trang chủ */}
              <Route path="/" element={<DanaHome />} />

              {/* Xác thực tài khoản */}
              <Route path="/dang-nhap" element={<AuthPage initialMode="login" />} />
              <Route path="/login" element={<AuthPage initialMode="login" />} />
              <Route path="/dang-ky" element={<AuthPage initialMode="register" />} />
              <Route path="/register" element={<AuthPage initialMode="register" />} />
              <Route path="/auth/callback" element={<OAuthCallbackPage />} />

              {/* Danh sách các tour */}
              <Route path="/tour" element={<TourListPage />} />

              {/* Chi tiết từng tour: /tour/:tourSlug */}
              <Route path="/tour/:tourSlug" element={<TourDetailPage />} />

              {/* Phân hệ Sản phẩm & Chân dung nghệ nhân */}
              <Route path="/san-pham" element={<ProductListPage />} />
              <Route path="/nghe-nhan" element={<ArtisansPage />} />

              {/* Phân hệ Bài Viết (Tin tức, Lịch sử, Văn hóa) */}
              <Route path="/bai-viet" element={<BlogPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/di-san" element={<BlogPage />} />

              {/* Hệ thống Quản trị Nội dung Toàn diện (CMS Admin Management - Code Splitted) */}
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/articles" element={<AdminArticlesPage />} />
              <Route path="/admin/articles/create" element={<AdminArticleCreatePage />} />
              <Route path="/admin/articles/edit/:id" element={<AdminArticleEditPage />} />
              <Route path="/admin/news" element={<AdminNewsPage />} />
              <Route path="/admin/news/create" element={<AdminNewsCreatePage />} />
              <Route path="/admin/news/edit/:id" element={<AdminNewsEditPage />} />
              <Route path="/admin/categories" element={<AdminCategoriesPage />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/artisans" element={<AdminArtisansPage />} />
              <Route path="/admin/media" element={<AdminMediaPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/activity-logs" element={<AdminActivityLogsPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />

              {/* Tương thích ngược các tuyến đường quản trị cũ */}
              <Route path="/admin/blog" element={<Navigate to="/admin/articles" replace />} />
              <Route path="/admin/blog/quan-ly" element={<Navigate to="/admin/articles" replace />} />
              <Route path="/admin/blog/editor" element={<Navigate to="/admin/articles/create" replace />} />
              <Route path="/admin/blog/editor/:id" element={<Navigate to="/admin/articles" replace />} />

              {/* Chi tiết bài viết khảo cứu: /blog/:articleSlug hoặc /bai-viet/:articleSlug */}
              <Route path="/blog/:articleSlug" element={<BlogDetailPage />} />
              <Route path="/bai-viet/:articleSlug" element={<BlogDetailPage />} />

              {/* Chuyển hướng các đường dẫn cũ vào phân hệ Số hoá di sản */}
              <Route path="/ngon-ngu" element={<Navigate to="/so-hoa-di-san?tab=ngon-ngu" replace />} />
              <Route path="/hinh-anh" element={<Navigate to="/so-hoa-di-san?tab=hinh-anh" replace />} />

              {/* Phân hệ Số hoá di sản (Hình ảnh Văn hoá, Ngôn ngữ Chăm, Giải mã Văn bia) */}
              <Route path="/so-hoa-di-san" element={<DigitalHeritagePage />} />
              <Route path="/ban-do" element={<Navigate to="/#ban-do" replace />} />
            </Routes>
          </Suspense>
          <AuthModal />
          <Toaster />
        </BrowserRouter>
      </AudioProvider>
    </AuthProvider>
  );
}
