import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShieldAlert, Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAdmin, isAuthorizedCMS, isLoading, openAuthModal } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="font-serif text-sm text-on-surface-variant tracking-wider">
          Đang xác thực quyền quản trị viên...
        </span>
      </div>
    );
  }

  // 1. Chưa đăng nhập
  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-outline-variant/50 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-on-surface">
            Yêu cầu Quyền Quản trị viên
          </h2>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            Khu vực soạn thảo và quản lý bài viết Blog chỉ dành riêng cho Ban biên tập và Quản trị viên hệ thống. Vui lòng đăng nhập bằng tài khoản Quản trị để tiếp tục.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <button
              onClick={() => openAuthModal("login")}
              className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all shadow-md cursor-pointer"
              type="button"
            >
              Đăng nhập Quản trị
            </button>
            <Link
              to="/bai-viet"
              className="flex-1 py-3 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-sm transition-all text-center"
            >
              Quay lại Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Đã đăng nhập nhưng không có vai trò quản trị (chỉ super_admin, admin, editor được phép)
  const isAllowed = Boolean(isAdmin || isAuthorizedCMS);

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-error/30 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-error/10 text-error flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-on-surface">
            Từ chối Truy cập (403 Forbidden)
          </h2>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            Tài khoản <strong className="text-on-surface">{user.email}</strong> (vai trò: {user.role || "customer"}) không có quyền truy cập trung tâm quản trị. Chỉ Quản trị viên (Admin/Super Admin) và Ban biên tập (Editor) mới được phép truy cập.
          </p>
          <Link
            to="/bai-viet"
            className="w-full py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-all text-center"
          >
            Quay lại trang Blog di sản
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

