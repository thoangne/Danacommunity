import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { Loader2, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleAuthSuccess } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasProcessed = useRef<boolean>(false);

  useEffect(() => {
    // Ngăn chặn chạy lặp 2 lần do React 19 StrictMode trong môi trường dev
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processOAuthCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get("token");
        const error = searchParams.get("error");
        const returnTo = searchParams.get("returnTo") || "/";

        // 1. Nếu có lỗi từ nhà cung cấp OAuth hoặc máy chủ
        if (error) {
          const decodedError = decodeURIComponent(error);
          setErrorMessage(decodedError);
          toast.error("Xác thực mạng xã hội thất bại", {
            description: decodedError,
          });
          return;
        }

        // 2. Nếu có JWT token trả về từ Backend OAuth flow
        if (token) {
          const user = await handleAuthSuccess(token);
          toast.success("Đăng nhập thành công!", {
            description: `Chào mừng ${user?.fullName || "bạn"} đến với ChampaWeb.`,
          });

          setTimeout(() => {
            navigate(returnTo, { replace: true });
          }, 600);
          return;
        }

        // 3. Fallback Supabase session nếu người dùng cấu hình trực tiếp Supabase
        if (isSupabaseConfigured()) {
          const { data, error: sbError } = await supabase.auth.getSession();
          if (sbError) {
            setErrorMessage(sbError.message);
            toast.error(`Xác thực mạng xã hội thất bại: ${sbError.message}`);
            return;
          }

          if (data?.session) {
            await handleAuthSuccess(data.session.access_token);
            toast.success("Đăng nhập tài khoản thành công!");
            setTimeout(() => {
              navigate(returnTo, { replace: true });
            }, 600);
            return;
          }
        }

        // 4. Nếu không có token hay error
        setErrorMessage("Không nhận được phản hồi xác thực hợp lệ từ máy chủ.");
      } catch (err: unknown) {
        console.error("OAuth callback processing error:", err);
        setErrorMessage(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định trong quá trình xác thực.");
      }
    };

    processOAuthCallback();
  }, [location.search, navigate, handleAuthSuccess]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf4ef] via-[#f6ebe1] to-[#eeddd2] flex flex-col items-center justify-center p-4 selection:bg-amber-100 selection:text-amber-900">
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#dfc0b8]/80 max-w-md w-full text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {errorMessage ? (
          <>
            <div className="w-16 h-16 bg-red-100 text-red-700 rounded-2xl mx-auto flex items-center justify-center shadow-xs">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Đăng nhập không thành công
              </h2>
              <p className="text-xs text-red-600 leading-relaxed bg-red-50 p-3 rounded-xl border border-red-200/80">
                {errorMessage}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate("/dang-nhap")}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại trang đăng nhập</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl mx-auto flex items-center justify-center shadow-xs animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
                Đang hoàn tất xác thực...
              </h2>
              <p className="text-xs text-stone-500 leading-relaxed">
                Hệ thống đang đồng bộ phiên đăng nhập an toàn và khởi tạo hành trình di sản của bạn.
              </p>
            </div>

            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-8 h-8 animate-spin text-amber-800" />
            </div>

            <p className="text-[11px] text-stone-400">
              Vui lòng không đóng trình duyệt trong khi quá trình xử lý đang diễn ra...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
