import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
} from "lucide-react";
import { LOGO_URL } from "../data/champaData";
import {
  type AuthMode,
  type SocialProvider,
  AuthBrandHero,
  SocialAuthButtons,
  PasswordStrengthIndicator,
  AuthHeader,
  AuthInputField,
  AuthAlert,
  AuthLegalNotice,
  AuthModeSwitcher,
  AuthSubmitButton,
} from "../components/auth";

export interface AuthPageProps {
  initialMode?: AuthMode;
}

export default function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegisterRoute = location.pathname.includes("dang-ky") || initialMode === "register";

  const [mode, setMode] = useState<AuthMode>(
    isRegisterRoute ? "register" : initialMode
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);

  const { login, register, loginWithGoogle, loginWithFacebook, resetPassword, isLoading } = useAuth();

  const handleModeChange = (targetMode: AuthMode) => {
    setMode(targetMode);
    setErrorMessage("");
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    if (socialLoading || isLoading) return;
    setSocialLoading(provider);
    try {
      if (provider === "google") {
        await loginWithGoogle("/");
      } else {
        await loginWithFacebook("/");
      }
    } finally {
      setSocialLoading(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Vui lòng cung cấp địa chỉ email hợp lệ.");
      return;
    }

    if (mode === "forgot") {
      const ok = await resetPassword(email.trim());
      if (ok) setForgotSent(true);
      return;
    }

    if (!password) {
      setErrorMessage("Vui lòng cung cấp mật khẩu.");
      return;
    }

    if (mode === "register") {
      if (!fullName.trim()) {
        setErrorMessage("Vui lòng nhập họ và tên của bạn.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Mật khẩu phải chứa ít nhất 6 ký tự.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Mật khẩu xác nhận không trùng khớp.");
        return;
      }

      const ok = await register(email.trim(), password, fullName.trim());
      if (ok) navigate("/");
      return;
    }

    // Login mode
    const ok = await login(email.trim(), password);
    if (ok) navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* ========================================================
          LEFT SECTION – BRAND EXPERIENCE (45–50% DESKTOP)
      ======================================================== */}
      <AuthBrandHero />

      {/* ========================================================
          RIGHT SECTION – LOGIN / AUTH FORM (50–55%)
      ======================================================== */}
      <section className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-16 xl:p-20 min-h-screen bg-white">
        {/* Top Bar for Mobile & Back link */}
        <div className="flex items-center justify-between w-full max-w-[420px] mx-auto">
          {/* Logo on Mobile */}
          <Link to="/" className="lg:hidden flex items-center gap-2.5">
            <img src={LOGO_URL} alt="Logo Dana" className="h-8 w-auto object-contain" />
            <span className="font-serif font-bold text-sm text-stone-900">Dana Heritage</span>
          </Link>

          <Link
            to="/"
            className="lg:hidden ml-auto inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors py-1 px-2.5 rounded-lg hover:bg-stone-100"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
        </div>

        {/* Center: Main Form Container */}
        <div className="w-full max-w-[420px] mx-auto my-auto py-8">
          {/* Header Lockup */}
          <AuthHeader mode={mode} onBackToLogin={() => handleModeChange("login")} />

          {/* Social Auth Buttons */}
          {mode !== "forgot" && (
            <SocialAuthButtons
              onGoogleClick={() => handleSocialLogin("google")}
              onFacebookClick={() => handleSocialLogin("facebook")}
              isLoading={isLoading}
              socialLoading={socialLoading}
            />
          )}

          {/* Alert Error Message */}
          {errorMessage && <AuthAlert type="error" message={errorMessage} />}

          {/* Forgot Password Success Message */}
          {mode === "forgot" && forgotSent && (
            <AuthAlert
              type="success"
              title="Yêu cầu khôi phục đã được tiếp nhận!"
              message={
                <>
                  Vui lòng kiểm tra hộp thư email <strong className="text-emerald-900">{email}</strong> để hoàn tất việc đặt lại mật khẩu mới.
                </>
              }
            />
          )}

          {/* Main Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field: Full Name (Register Mode) */}
            {mode === "register" && (
              <AuthInputField
                label="Họ và tên"
                icon={<User className="w-4 h-4" />}
                type="text"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn Chăm"
                required
              />
            )}

            {/* Field: Email Address */}
            <AuthInputField
              label="Địa chỉ Email"
              icon={<Mail className="w-4 h-4" />}
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              rightElement={
                email.includes("@") && email.includes(".") ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : undefined
              }
            />

            {/* Field: Password */}
            {mode !== "forgot" && (
              <div>
                <AuthInputField
                  label="Mật khẩu"
                  icon={<Lock className="w-4 h-4" />}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                {/* Remember Me & Forgot Password link */}
                {mode === "login" && (
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600 select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-stone-300 text-amber-800 focus:ring-amber-800/20 cursor-pointer"
                      />
                      <span>Ghi nhớ đăng nhập</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleModeChange("forgot")}
                      className="text-xs text-amber-800 hover:text-amber-950 font-medium hover:underline cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                )}

                {/* Password Strength Indicator (Register Mode) */}
                {mode === "register" && <PasswordStrengthIndicator password={password} />}
              </div>
            )}

            {/* Field: Confirm Password (Register Mode) */}
            {mode === "register" && (
              <AuthInputField
                label="Xác nhận lại mật khẩu"
                icon={<Lock className="w-4 h-4" />}
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                rightElement={
                  confirmPassword && password === confirmPassword ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : undefined
                }
              />
            )}

            {/* Primary Action Button */}
            <AuthSubmitButton mode={mode} isLoading={isLoading} />
          </form>

          {/* Bottom Switcher: Register / Login Toggle */}
          <AuthModeSwitcher mode={mode} onSwitchMode={handleModeChange} />
        </div>

        {/* Form Footer */}
        <AuthLegalNotice />
      </section>
    </div>
  );
}
