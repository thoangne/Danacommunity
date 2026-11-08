import { useState, type FormEvent, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Check,
  AlertCircle,
  KeyRound,
  Sparkles,
  Quote,
} from "lucide-react";
import { LOGO_URL } from "../data/champaData";

interface AuthPageProps {
  initialMode?: "login" | "register" | "forgot";
}

export default function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegisterRoute = location.pathname.includes("dang-ky") || initialMode === "register";

  const [mode, setMode] = useState<"login" | "register" | "forgot">(
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
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | null>(null);

  const { login, register, loginWithGoogle, loginWithFacebook, resetPassword, isLoading } = useAuth();

  // Kiểm tra độ mạnh mật khẩu (Password Strength)
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const strengthLabel = useMemo(() => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return { text: "Yếu", color: "bg-red-500", textCol: "text-red-500" };
      case 2:
        return { text: "Trung bình", color: "bg-amber-500", textCol: "text-amber-500" };
      case 3:
        return { text: "Khá", color: "bg-lime-500", textCol: "text-lime-600" };
      case 4:
        return { text: "Rất mạnh", color: "bg-emerald-600", textCol: "text-emerald-600" };
      default:
        return { text: "", color: "bg-stone-200", textCol: "" };
    }
  }, [passwordStrength]);

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
          Bảng màu Refined Warm Sandstone & Heritage Terracotta
          Tươi sáng, ấm cúng, hài hòa với form đăng nhập bên phải
      ======================================================== */}
      <section className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-[#faf4ef] via-[#f6ebe1] to-[#eeddd2] text-stone-900 flex-col justify-between p-10 xl:p-14 relative overflow-hidden select-none border-r border-[#e8d5cb]/80">
        {/* Subtle Ambient Radial Glow ở góc dưới phải (xa logo) */}
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

        {/* Delicate Dot Matrix Pattern */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#8f4e00_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Top Header: Brand Identity (z-20 không bị che lấp) */}
        <div className="relative z-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={LOGO_URL}
              alt="Dana Community Tourism"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col text-left">
              <span className="text-[11px] uppercase tracking-wider text-primary font-bold leading-tight">
                Dana Community Tourism
              </span>
              <span className="font-serif text-sm text-stone-800 leading-tight font-normal">
                Panduranga Heritage
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 transition-colors py-1.5 px-3 rounded-full hover:bg-stone-200/50 border border-stone-300/50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
        </div>

        {/* Center: Brand Manifesto & Core Value */}
        <div className="relative z-10 max-w-lg my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold tracking-wide mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Nền tảng Du lịch Di sản Bản địa</span>
          </div>

          <h1 className="font-serif text-3xl xl:text-4xl 2xl:text-5xl font-bold text-stone-900 leading-tight tracking-tight">
            Nơi trầm tích ngàn năm hòa cùng nhịp sống đương đại.
          </h1>

          <p className="mt-4 text-sm xl:text-base text-stone-600 leading-relaxed font-light">
            Kết nối trọn vẹn các tuyến tour khảo cứu Kalan Po Klong Garai, làng gốm Bàu Trúc,
            dệt thổ cẩm Mỹ Nghiệp và tri thức trao truyền từ các Nghệ nhân Ưu tú.
          </p>

          {/* SaaS-Style Glass Testimonial Card */}
          <div className="mt-8 p-5 rounded-2xl bg-white/85 backdrop-blur-xl border border-[#dfc0b8]/60 shadow-xs relative">
            <Quote className="w-6 h-6 text-primary/25 absolute top-4 right-4" />
            <p className="text-xs xl:text-sm italic text-stone-800 leading-relaxed font-serif pr-4">
              "Mỗi bước chân chạm vào đất nung là một lần lắng nghe hơi thở của tổ tiên qua ngàn năm..."
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-serif font-bold text-xs">
                M
              </div>
              <div>
                <h4 className="text-xs font-semibold text-stone-900">Muk Đàng Thị Phan</h4>
                <p className="text-[11px] text-primary font-medium">Nghệ nhân Ưu tú Làng gốm Bàu Trúc</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Meta */}
        <div className="relative z-10 text-[11px] text-stone-500 flex items-center justify-between border-t border-[#e8d5cb]/70 pt-4">
          <span>© 2026 Dana Heritage. All rights reserved.</span>
          <span className="hidden xl:inline">Bảo tồn & Phát triển Di sản Bền vững</span>
        </div>
      </section>

      {/* ========================================================
          RIGHT SECTION – LOGIN / AUTH FORM (50–55%)
          Thiết kế Clean, Minimalist, tập trung cao độ vào trải nghiệm
          đăng nhập, cân đối khoảng trắng (Whitespace), chuẩn SaaS.
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

        {/* Center: Main Form Container (Centered Vertically & Horizontally, Max 420px) */}
        <div className="w-full max-w-[420px] mx-auto my-auto py-8">
          {/* Header Lockup */}
          <div className="text-left mb-6">
            {mode === "forgot" ? (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage("");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors mb-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại đăng nhập</span>
                </button>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  Khôi phục mật khẩu
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-relaxed">
                  Nhập địa chỉ email đã đăng ký của bạn để nhận liên kết thiết lập lại mật khẩu an toàn.
                </p>
              </div>
            ) : (
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  {mode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản mới"}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-relaxed">
                  {mode === "login"
                    ? "Đăng nhập để tiếp tục trải nghiệm và quản lý hành trình di sản."
                    : "Tham gia cùng cộng đồng bảo tồn và du lịch trải nghiệm Panduranga."}
                </p>
              </div>
            )}
          </div>

          {/* Social Auth Buttons (Minimalist SaaS Style) */}
          {mode !== "forgot" && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={async () => {
                    if (socialLoading || isLoading) return;
                    setSocialLoading("google");
                    await loginWithGoogle("/");
                  }}
                  disabled={isLoading || socialLoading !== null}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-stone-200/90 bg-white hover:bg-stone-50 hover:border-stone-300 text-stone-700 text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label="Đăng nhập bằng Google"
                >
                  {socialLoading === "google" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-800 shrink-0" />
                      <span className="truncate">Google...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Google</span>
                    </>
                  )}
                </button>

                {/* Facebook Button */}
                <button
                  type="button"
                  onClick={async () => {
                    if (socialLoading || isLoading) return;
                    setSocialLoading("facebook");
                    await loginWithFacebook("/");
                  }}
                  disabled={isLoading || socialLoading !== null}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-stone-200/90 bg-white hover:bg-[#1877F2]/5 hover:border-[#1877F2]/30 text-stone-700 text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label="Đăng nhập bằng Facebook"
                >
                  {socialLoading === "facebook" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#1877F2] shrink-0" />
                      <span className="truncate">Facebook...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 fill-[#1877F2] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Facebook</span>
                    </>
                  )}
                </button>
              </div>

              {/* Clean Subtle Divider */}
              <div className="relative flex items-center justify-center my-5">
                <div className="border-t border-stone-200 w-full" />
                <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-stone-400 font-medium absolute">
                  Hoặc bằng email
                </span>
              </div>
            </>
          )}

          {/* Alert Error Message */}
          {errorMessage && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Forgot Password Success Message */}
          {mode === "forgot" && forgotSent && (
            <div className="p-4 mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Yêu cầu khôi phục đã được tiếp nhận!</p>
                <p className="text-[11px] text-emerald-700 mt-1 leading-relaxed">
                  Vui lòng kiểm tra hộp thư email <strong className="text-emerald-900">{email}</strong> để hoàn tất việc đặt lại mật khẩu mới.
                </p>
              </div>
            </div>
          )}

          {/* Main Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field: Full Name (Register Mode) */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn Chăm"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white focus:bg-white focus:outline-none focus:border-amber-800 focus:ring-4 focus:ring-amber-800/10 text-xs sm:text-sm transition-all"
                  />
                </div>
              </div>
            )}

            {/* Field: Email Address */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white focus:bg-white focus:outline-none focus:border-amber-800 focus:ring-4 focus:ring-amber-800/10 text-xs sm:text-sm transition-all"
                />
                {email.includes("@") && email.includes(".") && (
                  <Check className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>

            {/* Field: Password */}
            {mode !== "forgot" && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-stone-200 bg-white focus:bg-white focus:outline-none focus:border-amber-800 focus:ring-4 focus:ring-amber-800/10 text-xs sm:text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer p-1"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Nút Quên mật khẩu & Ghi nhớ đăng nhập đặt ngay dưới ô mật khẩu */}
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
                      onClick={() => {
                        setMode("forgot");
                        setErrorMessage("");
                      }}
                      className="text-xs text-amber-800 hover:text-amber-950 font-medium hover:underline cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                )}

                {/* Password Strength Indicator (Register Mode) */}
                {mode === "register" && password.length > 0 && (
                  <div className="mt-2 space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-500">Độ an toàn mật khẩu:</span>
                      <span className={`font-bold ${strengthLabel.textCol}`}>
                        {strengthLabel.text}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${passwordStrength >= 1 ? strengthLabel.color : "bg-transparent"
                          }`}
                      />
                      <div
                        className={`h-full transition-all ${passwordStrength >= 2 ? strengthLabel.color : "bg-transparent"
                          }`}
                      />
                      <div
                        className={`h-full transition-all ${passwordStrength >= 3 ? strengthLabel.color : "bg-transparent"
                          }`}
                      />
                      <div
                        className={`h-full transition-all ${passwordStrength >= 4 ? strengthLabel.color : "bg-transparent"
                          }`}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Field: Confirm Password (Register Mode) */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Xác nhận lại mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-stone-200 bg-white focus:bg-white focus:outline-none focus:border-amber-800 focus:ring-4 focus:ring-amber-800/10 text-xs sm:text-sm transition-all"
                  />
                  {confirmPassword && password === confirmPassword && (
                    <Check className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  )}
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-800 via-stone-900 to-amber-900 hover:from-amber-900 hover:to-black text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60 mt-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý xác thực...</span>
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
          </form>

          {/* Bottom Switcher: Register / Login Toggle */}
          <div className="mt-6 text-center text-xs text-stone-500">
            {mode === "login" ? (
              <p>
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrorMessage("");
                  }}
                  className="font-bold text-amber-800 hover:text-amber-950 underline underline-offset-2 cursor-pointer transition-colors"
                >
                  Đăng ký tài khoản mới
                </button>
              </p>
            ) : mode === "register" ? (
              <p>
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage("");
                  }}
                  className="font-bold text-amber-800 hover:text-amber-950 underline underline-offset-2 cursor-pointer transition-colors"
                >
                  Đăng nhập ngay
                </button>
              </p>
            ) : null}
          </div>
        </div>

        {/* Form Footer */}
        <div className="w-full max-w-[420px] mx-auto text-center pt-4 border-t border-stone-100">
          <p className="text-[11px] text-stone-400 leading-tight">
            Bằng việc tiếp tục, bạn đồng ý với{" "}
            <a href="#dieu-khoan" className="underline hover:text-stone-700">
              Điều khoản dịch vụ
            </a>{" "}
            và{" "}
            <a href="#chinh-sach" className="underline hover:text-stone-700">
              Chính sách bảo mật di sản
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
