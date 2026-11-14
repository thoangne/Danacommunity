import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export interface AuthAlertProps {
  type: "error" | "success";
  message?: ReactNode;
  title?: string;
  className?: string;
}

export function AuthAlert({ type, message, title, className = "" }: AuthAlertProps) {
  if (!message && !title) return null;

  if (type === "error") {
    return (
      <div
        className={`p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in ${className}`}
        role="alert"
      >
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
        <div className="leading-relaxed">
          {title && <p className="font-semibold">{title}</p>}
          {message && <span>{message}</span>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in ${className}`}
      role="status"
    >
      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
      <div>
        {title && <p className="font-bold">{title}</p>}
        {message && <div className="text-[11px] text-emerald-700 mt-1 leading-relaxed">{message}</div>}
      </div>
    </div>
  );
}
export default AuthAlert;
