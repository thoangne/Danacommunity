import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  provider: "email" | "google" | "facebook";
  role?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register";
  openAuthModal: (tab?: "login" | "register") => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_URL || "/api";
const STORAGE_KEY_USER = "champa_auth_user";
const STORAGE_KEY_TOKEN = "champa_auth_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  // 1. Khởi tạo trạng thái phiên từ LocalStorage & Supabase Auth listener
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
        const savedUser = localStorage.getItem(STORAGE_KEY_USER);

        if (savedUser && savedToken) {
          try {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
          } catch {
            localStorage.removeItem(STORAGE_KEY_USER);
            localStorage.removeItem(STORAGE_KEY_TOKEN);
          }
        }

        // Nếu Supabase đã cấu hình, đồng bộ phiên từ Supabase
        if (isSupabaseConfigured()) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const mappedUser: UserProfile = {
              id: session.user.id,
              email: session.user.email || "",
              fullName:
                session.user.user_metadata?.full_name ||
                session.user.user_metadata?.name ||
                session.user.email?.split("@")[0] ||
                "Người dùng Champa",
              avatarUrl:
                session.user.user_metadata?.avatar_url ||
                session.user.user_metadata?.picture ||
                "",
              provider: (session.user.app_metadata?.provider as any) || "email",
            };
            setUser(mappedUser);
            setToken(session.access_token);
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mappedUser));
            localStorage.setItem(STORAGE_KEY_TOKEN, session.access_token);
          }

          // Lắng nghe sự kiện thay đổi phiên (OAuth redirect, logout...)
          const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event: any, session: any) => {
              if (session?.user) {
                const mappedUser: UserProfile = {
                  id: session.user.id,
                  email: session.user.email || "",
                  fullName:
                    session.user.user_metadata?.full_name ||
                    session.user.user_metadata?.name ||
                    session.user.email?.split("@")[0] ||
                    "Người dùng Champa",
                  avatarUrl:
                    session.user.user_metadata?.avatar_url ||
                    session.user.user_metadata?.picture ||
                    "",
                  provider: (session.user.app_metadata?.provider as any) || "email",
                };
                setUser(mappedUser);
                setToken(session.access_token);
                localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mappedUser));
                localStorage.setItem(STORAGE_KEY_TOKEN, session.access_token);
              } else if (_event === "SIGNED_OUT") {
                setUser(null);
                setToken(null);
                localStorage.removeItem(STORAGE_KEY_USER);
                localStorage.removeItem(STORAGE_KEY_TOKEN);
              }
            }
          );

          return () => {
            authListener?.subscription.unsubscribe();
          };
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const openAuthModal = (tab: "login" | "register" = "login") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // 2. Đăng nhập bằng Email & Mật khẩu
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error(error.message || "Email hoặc mật khẩu không chính xác.");
          return false;
        }

        const loggedUser: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || email.split("@")[0],
          avatarUrl: data.user.user_metadata?.avatar_url || "",
          provider: "email",
        };

        setUser(loggedUser);
        setToken(data.session.access_token);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(loggedUser));
        localStorage.setItem(STORAGE_KEY_TOKEN, data.session.access_token);
        toast.success(`Chào mừng trở lại, ${loggedUser.fullName}!`);
        closeAuthModal();
        return true;
      }

      // Gọi Backend API
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        toast.error(resData.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        return false;
      }

      const loggedUser = resData.data.user;
      const accessToken = resData.data.token;

      setUser(loggedUser);
      setToken(accessToken);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(loggedUser));
      localStorage.setItem(STORAGE_KEY_TOKEN, accessToken);
      toast.success(`Chào mừng trở lại, ${loggedUser.fullName}!`);
      closeAuthModal();
      return true;
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err?.message || "Đã xảy ra lỗi khi kết nối đến máy chủ.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Đăng ký tài khoản mới bằng Email & Mật khẩu
  const register = async (email: string, password: string, fullName: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });

        if (error) {
          toast.error(error.message || "Đăng ký không thành công.");
          return false;
        }

        if (data.session && data.user) {
          const registeredUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: fullName || email.split("@")[0],
            avatarUrl: "",
            provider: "email",
          };
          setUser(registeredUser);
          setToken(data.session.access_token);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(registeredUser));
          localStorage.setItem(STORAGE_KEY_TOKEN, data.session.access_token);
          toast.success("Đăng ký tài khoản thành công!");
          closeAuthModal();
          return true;
        } else {
          toast.success("Vui lòng kiểm tra hộp thư email để kích hoạt tài khoản của bạn!");
          closeAuthModal();
          return true;
        }
      }

      // Gọi Backend API
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        toast.error(resData.message || "Đăng ký không thành công.");
        return false;
      }

      const registeredUser = resData.data.user;
      const accessToken = resData.data.token;

      setUser(registeredUser);
      setToken(accessToken);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(registeredUser));
      localStorage.setItem(STORAGE_KEY_TOKEN, accessToken);
      toast.success("Đăng ký tài khoản thành công!");
      closeAuthModal();
      return true;
    } catch (err: any) {
      console.error("Register error:", err);
      toast.error(err?.message || "Đã xảy ra lỗi khi tạo tài khoản.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Đăng nhập bằng Google OAuth
  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const redirectUrl = `${window.location.origin}/auth/callback`;
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: redirectUrl,
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          },
        });

        if (error) {
          toast.error(`Lỗi Google OAuth: ${error.message}`);
          setIsLoading(false);
        }
        return;
      }

      // Demo/Dev Fallback Mode cho môi trường chưa gắn API Key Google
      const mockGoogleUser: UserProfile = {
        id: `google-${Date.now()}`,
        email: "google.chamuser@gmail.com",
        fullName: "Google Explorer Champa",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        provider: "google",
      };

      const mockToken = `mock-google-token-${Date.now()}`;
      setUser(mockGoogleUser);
      setToken(mockToken);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockGoogleUser));
      localStorage.setItem(STORAGE_KEY_TOKEN, mockToken);

      toast.success("Đăng nhập bằng Google thành công! (Chế độ mô phỏng)");
      closeAuthModal();
    } catch (err: any) {
      console.error("Google login error:", err);
      toast.error(err?.message || "Đăng nhập Google thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Đăng nhập bằng Facebook OAuth
  const loginWithFacebook = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const redirectUrl = `${window.location.origin}/auth/callback`;
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "facebook",
          options: {
            redirectTo: redirectUrl,
            scopes: "email,public_profile",
          },
        });

        if (error) {
          toast.error(`Lỗi Facebook OAuth: ${error.message}`);
          setIsLoading(false);
        }
        return;
      }

      // Demo/Dev Fallback Mode cho môi trường chưa gắn API Key Facebook
      const mockFbUser: UserProfile = {
        id: `facebook-${Date.now()}`,
        email: "fb.chamtraveler@facebook.com",
        fullName: "Facebook Traveler Dana",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        provider: "facebook",
      };

      const mockToken = `mock-fb-token-${Date.now()}`;
      setUser(mockFbUser);
      setToken(mockToken);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockFbUser));
      localStorage.setItem(STORAGE_KEY_TOKEN, mockToken);

      toast.success("Đăng nhập bằng Facebook thành công! (Chế độ mô phỏng)");
      closeAuthModal();
    } catch (err: any) {
      console.error("Facebook login error:", err);
      toast.error(err?.message || "Đăng nhập Facebook thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Đăng xuất
  const logout = async (): Promise<void> => {
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error("SignOut error:", err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      toast.info("Đã đăng xuất khỏi tài khoản.");
    }
  };

  // 7. Khôi phục mật khẩu qua Email
  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback`,
        });
        if (error) {
          toast.error(error.message || "Không thể gửi email khôi phục.");
          return false;
        }
        toast.success("Liên kết khôi phục mật khẩu đã được gửi đến email của bạn.");
        return true;
      }

      // Dev Fallback
      toast.success(`(Demo) Hướng dẫn khôi phục mật khẩu đã được gửi tới ${email}.`);
      return true;
    } catch (err: any) {
      toast.error(err?.message || "Đã xảy ra lỗi khi gửi yêu cầu.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = Boolean(user && (user.role === "admin" || user.email === "admin@champaweb.vn"));

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        loginWithGoogle,
        loginWithFacebook,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
}
