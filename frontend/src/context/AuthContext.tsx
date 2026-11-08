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
  loginWithGoogle: (returnTo?: string) => Promise<void>;
  loginWithFacebook: (returnTo?: string) => Promise<void>;
  handleAuthSuccess: (token: string, initialUser?: UserProfile) => Promise<UserProfile | null>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
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

  // 4. Đăng nhập bằng Google OAuth 2.0 (Backend Authorization Code Flow)
  const loginWithGoogle = async (returnTo?: string): Promise<void> => {
    setIsLoading(true);
    try {
      const destination = returnTo || window.location.pathname;
      window.location.href = `${API_BASE}/auth/google?returnTo=${encodeURIComponent(destination)}`;
    } catch (err: unknown) {
      console.error("Google login error:", err);
      toast.error(err instanceof Error ? err.message : "Không thể khởi tạo phiên đăng nhập Google.");
      setIsLoading(false);
    }
  };

  // 5. Đăng nhập bằng Facebook OAuth 2.0 (Backend Authorization Code Flow)
  const loginWithFacebook = async (returnTo?: string): Promise<void> => {
    setIsLoading(true);
    try {
      const destination = returnTo || window.location.pathname;
      window.location.href = `${API_BASE}/auth/facebook?returnTo=${encodeURIComponent(destination)}`;
    } catch (err: unknown) {
      console.error("Facebook login error:", err);
      toast.error(err instanceof Error ? err.message : "Không thể khởi tạo phiên đăng nhập Facebook.");
      setIsLoading(false);
    }
  };

  // 5.1 Xử lý đồng bộ phiên đăng nhập thành công từ OAuth Callback
  const handleAuthSuccess = async (accessToken: string, initialUser?: UserProfile): Promise<UserProfile | null> => {
    setIsLoading(true);
    try {
      setToken(accessToken);
      localStorage.setItem(STORAGE_KEY_TOKEN, accessToken);

      if (initialUser) {
        setUser(initialUser);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(initialUser));
      }

      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.data?.user) {
          const syncedUser = resData.data.user;
          setUser(syncedUser);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(syncedUser));
          return syncedUser;
        }
      }

      return initialUser || null;
    } catch (err) {
      console.error("Failed to sync user profile after OAuth:", err);
      return initialUser || null;
    } finally {
      setIsLoading(false);
      closeAuthModal();
    }
  };

  // 6. Đăng xuất
  const logout = async (): Promise<void> => {
    try {
      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).catch(() => {});
      }

      if (isSupabaseConfigured()) {
        await supabase.auth.signOut().catch(() => {});
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
        handleAuthSuccess,
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
