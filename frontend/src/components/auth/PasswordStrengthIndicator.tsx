import { useMemo } from "react";
import { evaluatePassword } from "./passwordUtils";

export interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { score, text, color, textCol } = useMemo(
    () => evaluatePassword(password),
    [password]
  );

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-stone-500">Độ an toàn mật khẩu:</span>
        <span className={`font-bold ${textCol}`}>{text}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
        <div className={`h-full transition-all ${score >= 1 ? color : "bg-transparent"}`} />
        <div className={`h-full transition-all ${score >= 2 ? color : "bg-transparent"}`} />
        <div className={`h-full transition-all ${score >= 3 ? color : "bg-transparent"}`} />
        <div className={`h-full transition-all ${score >= 4 ? color : "bg-transparent"}`} />
      </div>
    </div>
  );
}
export default PasswordStrengthIndicator;
