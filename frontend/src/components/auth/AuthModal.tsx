import { useState, useEffect, type FormEvent, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Check,
  ArrowLeft,
  KeyRound,
  AlertCircle,
  Sparkles,
  Quote,
} from "lucide-react";
import { LOGO_URL } from "../../data/champaData";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    resetPassword,
    isLoading,
  } = useAuth();

  // Chế độ form: 'login' | 'register' | 'forgot'
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | null>(null);

  // Đồng bộ tab từ AuthContext khi modal mở ra
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalTab || "login");
      setErrorMessage("");
      setForgotSent(false);
    }
  }, [isAuthModalOpen, authModalTab]);

  // Đóng modal khi nhấn Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  // Kiểm tra độ mạnh mật khẩu (Password Strength)
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // 0 - 4
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

  // Xử lý gửi form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Vui lòng cung cấp địa chỉ email hợp lệ.");
      return;
    }

    // 1. Chế độ Quên mật khẩu
    if (mode === "forgot") {
      const ok = await resetPassword(email.trim());
      if (ok) {
        setForgotSent(true);
      }
      return;
    }

    // 2. Chế độ Đăng ký
    if (mode === "register") {
      if (!fullName.trim()) {
        setErrorMessage("Vui lòng nhập họ và tên của bạn.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Mật khẩu xác nhận không trùng khớp.");
        return;
      }
      const ok = await register(email.trim(), password, fullName.trim());
      if (ok) {
        closeAuthModal();
      }
      return;
    }

    // 3. Chế độ Đăng nhập
    if (!password) {
      setErrorMessage("Vui lòng nhập mật khẩu.");
      return;
    }

    const ok = await login(email.trim(), password);
    if (ok) {
      closeAuthModal();
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* 1. Backdrop mờ tối sang trọng */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeAuthModal}
      />

      {/* 2. Container Modal Split-Screen 2 cột chuẩn SaaS (Không viền trắng thừa, màu sắc ấm áp, logo sắc nét) */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(36,25,21,0.2)] border border-[#dfc0b8]/60 overflow-hidden z-10 transition-all transform animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row my-auto outline-none ring-0">
        {/* Nút đóng modal ở góc trên phải */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-30 p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100/90 rounded-full transition-all cursor-pointer"
          aria-label="Đóng cửa sổ"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ========================================================
            CỘT TRÁI: BRAND EXPERIENCE (45% DESKTOP & TABLET)
            Bảng màu Refined Warm Sandstone & Heritage Terracotta
            Tươi sáng, ấm cúng, hài hòa 100% với form đăng nhập bên phải
        ======================================================== */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-[#faf4ef] via-[#f6ebe1] to-[#eeddd2] text-stone-900 border-r border-[#e8d5cb]/80 p-8 lg:p-10 flex-col justify-between relative overflow-hidden select-none">
          {/* Subtle Ambient Warm Glow ở góc dưới phải (Xa khu vực Logo ở góc trên trái) */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-amber-500/10 blur-[60px] pointer-events-none" />

          {/* Delicate Dot Matrix Pattern (Độ mờ nhẹ nhàng, không gây nhiễu) */}
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#8f4e00_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          {/* Top Brand Identity: Logo được đặt ở lớp z-20 riêng biệt, không bị bất kỳ phần tử nào chồng lấn */}
          <div className="relative z-20 flex items-center gap-3">
            <img
              src={LOGO_URL}
              alt="Logo Dana"
              className="h-10 sm:h-11 w-auto object-contain shrink-0 drop-shadow-xs"
            />
            <div className="flex flex-col text-left">
              <span className="text-[11px] uppercase tracking-wider text-primary font-bold whitespace-nowrap leading-tight">
                Dana Community Tourism
              </span>
              <span className="font-serif text-sm sm:text-base text-stone-800 leading-tight font-normal whitespace-nowrap mt-0.5">
                Panduranga Heritage
              </span>
            </div>
          </div>

          {/* Center Content: Headline & Testimonial Card */}
          <div className="relative z-10 my-auto py-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-wide mb-4">
              <Sparkles className="w-3 h-3 text-primary" />
              <span>Nền tảng Du lịch Di sản Bản địa</span>
            </div>

            <h3 className="font-serif text-2xl lg:text-3xl font-bold text-stone-900 leading-snug tracking-tight">
              Nơi trầm tích ngàn năm hòa cùng nhịp sống đương đại.
            </h3>

            <p className="mt-3 text-xs text-stone-600 leading-relaxed font-light">
              Kết nối các tuyến tour điền dã, báu vật cổ vật, nghệ nhân gốm Bàu Trúc & thổ cẩm Mỹ Nghiệp.
            </p>

            {/* Testimonial Card mộc mạc cao cấp */}
            <div className="mt-6 p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-[#dfc0b8]/60 shadow-xs relative">
              <Quote className="w-5 h-5 text-primary/25 absolute top-3 right-3" />
              <p className="text-xs italic text-stone-800 leading-relaxed font-serif pr-4">
                "Mỗi bước chân chạm vào đất nung là một lần lắng nghe hơi thở ngàn năm..."
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-serif font-bold text-xs">
                  M
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Muk Đàng Thị Phan</h4>
                  <p className="text-[10px] text-primary font-medium">Nghệ nhân Ưu tú Làng gốm Bàu Trúc</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Meta */}
          <div className="relative z-10 text-[10px] text-stone-500 border-t border-[#e8d5cb]/70 pt-3 flex items-center justify-between">
            <span>© 2026 Dana Heritage.</span>
            <span>Bảo tồn bền vững</span>
          </div>
        </div>

        {/* ========================================================
            CỘT PHẢI: AUTH FORM (55% DESKTOP / 100% MOBILE)
            Clean, Minimalist, tập trung cao độ, khoảng trắng chuẩn mực
        ======================================================== */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white relative">
          <div>
            {/* Header Form */}
            <div className="text-left mb-5 pr-8">
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
                  <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
                    Khôi phục mật khẩu
                  </h2>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Nhập email đã đăng ký của bạn để nhận liên kết thiết lập lại mật khẩu an toàn.
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
                    {mode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản mới"}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {mode === "login"
                      ? "Đăng nhập để tiếp tục trải nghiệm và quản lý hành trình di sản."
                      : "Tham gia cùng cộng đồng bảo tồn và du lịch trải nghiệm Panduranga."}
                  </p>
                </div>
              )}
            </div>

            {/* Social Auth Buttons */}
            {mode !== "forgot" && (
              <>
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {/* Nút Google */}
                  <button
                    type="button"
                    onClick={async () => {
                      if (socialLoading || isLoading) return;
                      setSocialLoading("google");
                      await loginWithGoogle(window.location.pathname);
                    }}
                    disabled={isLoading || socialLoading !== null}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 text-stone-700 text-xs font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
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

                  {/* Nút Facebook */}
                  <button
                    type="button"
                    onClick={async () => {
                      if (socialLoading || isLoading) return;
                      setSocialLoading("facebook");
                      await loginWithFacebook(window.location.pathname);
                    }}
                    disabled={isLoading || socialLoading !== null}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-stone-200 bg-white hover:bg-[#1877F2]/5 hover:border-[#1877F2]/30 text-stone-700 text-xs font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
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

                {/* Subtle Divider */}
                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-stone-200 w-full" />
                  <span className="bg-white px-2.5 text-[10px] uppercase tracking-wider text-stone-400 font-medium absolute">
                    Hoặc bằng email
                  </span>
                </div>
              </>
            )}

            {/* Alert Error */}
            {errorMessage && (
              <div className="p-3 mb-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Thông báo gửi thành công quên mật khẩu */}
            {mode === "forgot" && forgotSent && (
              <div className="p-3.5 mb-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Yêu cầu đã được tiếp nhận!</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">
                    Vui lòng kiểm tra hộp thư email <strong className="text-emerald-900">{email}</strong> để đặt lại mật khẩu mới.
                  </p>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Họ và tên (khi Đăng ký) */}
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
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
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-800/10 text-xs sm:text-sm transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
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
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-800/10 text-xs sm:text-sm transition-all"
                  />
                  {email.includes("@") && email.includes(".") && (
                    <Check className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  )}
                </div>
              </div>

              {/* Mật khẩu */}
              {mode !== "forgot" && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
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
                      className="w-full pl-10 pr-11 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-800/10 text-xs sm:text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer p-0.5"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Nút Quên mật khẩu & Ghi nhớ đăng nhập đặt ngay dưới ô mật khẩu */}
                  {mode === "login" && (
                    <div className="flex items-center justify-between pt-1.5">
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-stone-600 select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-stone-300 text-amber-800 focus:ring-amber-800/20 cursor-pointer"
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

                  {/* Thanh đo độ an toàn mật khẩu khi Đăng ký */}
                  {mode === "register" && password.length > 0 && (
                    <div className="mt-1.5 space-y-1 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-stone-500">Độ an toàn:</span>
                        <span className={`font-bold ${strengthLabel.textCol}`}>
                          {strengthLabel.text}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            passwordStrength >= 1 ? strengthLabel.color : "bg-transparent"
                          }`}
                        />
                        <div
                          className={`h-full transition-all ${
                            passwordStrength >= 2 ? strengthLabel.color : "bg-transparent"
                          }`}
                        />
                        <div
                          className={`h-full transition-all ${
                            passwordStrength >= 3 ? strengthLabel.color : "bg-transparent"
                          }`}
                        />
                        <div
                          className={`h-full transition-all ${
                            passwordStrength >= 4 ? strengthLabel.color : "bg-transparent"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Xác nhận mật khẩu (khi Đăng ký) */}
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
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
                      className="w-full pl-10 pr-11 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-800/10 text-xs sm:text-sm transition-all"
                    />
                    {confirmPassword && password === confirmPassword && (
                      <Check className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>
              )}

              {/* Nút hành động Submit chính */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-800 via-stone-900 to-amber-900 hover:from-amber-900 hover:to-black text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xác thực...</span>
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

            {/* Bottom Switcher: Đăng nhập <-> Đăng ký */}
            <div className="mt-4 text-center text-xs text-stone-500">
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

          {/* Footer nhỏ cam kết bảo mật & quyền riêng tư */}
          <div className="pt-3 mt-3 border-t border-stone-100 text-center">
            <p className="text-[10px] text-stone-400 leading-tight">
              Bằng việc tiếp tục, bạn đồng ý với{" "}
              <a href="#dieu-khoan" className="underline hover:text-stone-700">
                Điều khoản dịch vụ
              </a>{" "}
              &{" "}
              <a href="#chinh-sach" className="underline hover:text-stone-700">
                Chính sách bảo mật di sản
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
