import type { ButtonHTMLAttributes } from "react";
import { Loader2, ArrowRight, CheckCircle2, KeyRound } from "lucide-react";
import type { AuthMode } from "./types";

export interface AuthSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode: AuthMode;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
}

export function AuthSubmitButton({
  mode,
  isLoading = false,
  loadingText = "Đang xử lý xác thực...",
  className = "",
  disabled,
  ...props
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-800 via-stone-900 to-amber-900 hover:from-amber-900 hover:to-black text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60 mt-3 ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : mode === "login" ? (
        <>
          <span>Đăng nhập</span>
          <ArrowRight className="w-4 h-4" />
        </>
      ) : mode === "register" ? (
        <>
          <CheckCircle2 className="w-4 h-4" />
          <span>Hoàn tất đăng ký</span>
        </>
      ) : (
        <>
          <KeyRound className="w-4 h-4" />
          <span>Gửi liên kết khôi phục</span>
        </>
      )}
    </button>
  );
}
export default AuthSubmitButton;
