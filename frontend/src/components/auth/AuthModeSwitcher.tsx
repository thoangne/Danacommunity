import type { AuthMode } from "./types";

export interface AuthModeSwitcherProps {
  mode: AuthMode;
  onSwitchMode: (targetMode: AuthMode) => void;
}

export function AuthModeSwitcher({ mode, onSwitchMode }: AuthModeSwitcherProps) {
  if (mode === "forgot") return null;

  return (
    <div className="mt-6 text-center text-xs text-stone-500">
      {mode === "login" ? (
        <p>
          Chưa có tài khoản?{" "}
          <button
            type="button"
            onClick={() => onSwitchMode("register")}
            className="font-bold text-amber-800 hover:text-amber-950 underline underline-offset-2 cursor-pointer transition-colors"
          >
            Đăng ký tài khoản mới
          </button>
        </p>
      ) : (
        <p>
          Đã có tài khoản?{" "}
          <button
            type="button"
            onClick={() => onSwitchMode("login")}
            className="font-bold text-amber-800 hover:text-amber-950 underline underline-offset-2 cursor-pointer transition-colors"
          >
            Đăng nhập ngay
          </button>
        </p>
      )}
    </div>
  );
}
export default AuthModeSwitcher;
