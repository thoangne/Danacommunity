import { ArrowLeft } from "lucide-react";
import type { AuthMode } from "./types";

export interface AuthHeaderProps {
  mode: AuthMode;
  onBackToLogin?: () => void;
}

export function AuthHeader({ mode, onBackToLogin }: AuthHeaderProps) {
  if (mode === "forgot") {
    return (
      <div className="text-left mb-6">
        {onBackToLogin && (
          <button
            type="button"
            onClick={onBackToLogin}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại đăng nhập</span>
          </button>
        )}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Khôi phục mật khẩu
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-relaxed">
          Nhập địa chỉ email đã đăng ký của bạn để nhận liên kết thiết lập lại mật khẩu an toàn.
        </p>
      </div>
    );
  }

  return (
    <div className="text-left mb-6">
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
        {mode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản mới"}
      </h2>
      <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-relaxed">
        {mode === "login"
          ? "Đăng nhập để tiếp tục trải nghiệm và quản lý hành trình di sản."
          : "Tham gia cùng cộng đồng bảo tồn và du lịch trải nghiệm Panduranga."}
      </p>
    </div>
  );
}
export default AuthHeader;
