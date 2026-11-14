import type { InputHTMLAttributes, ReactNode } from "react";

export interface AuthInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
  rightElement?: ReactNode;
  containerClassName?: string;
}

export function AuthInputField({
  label,
  icon,
  rightElement,
  containerClassName = "",
  className = "",
  id,
  ...props
}: AuthInputFieldProps) {
  const inputId = id || (props.name ? `auth-input-${props.name}` : undefined);

  return (
    <div className={containerClassName}>
      <label htmlFor={inputId} className="block text-xs font-semibold text-stone-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
          {icon}
        </span>
        <input
          id={inputId}
          className={`w-full pl-10 ${rightElement ? "pr-11" : "pr-4"} py-2.5 rounded-xl border border-stone-200 bg-white focus:bg-white focus:outline-none focus:border-amber-800 focus:ring-4 focus:ring-amber-800/10 text-xs sm:text-sm transition-all ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}
export default AuthInputField;
