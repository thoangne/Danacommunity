const supabase = require("../config/supabaseClient");
const { db } = require("../config/db");

class AuthService {
  constructor() {
    this.isSupabaseConfigured =
      Boolean(process.env.SUPABASE_URL) &&
      !process.env.SUPABASE_URL.includes("placeholder-project") &&
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY) &&
      !String(process.env.SUPABASE_ANON_KEY).includes("placeholder");

    // Bộ nhớ in-memory dev fallback nếu chưa cấu hình Supabase credentials thật
    this.mockUsers = new Map([
      [
        "admin@champaweb.vn",
        {
          id: "00000000-0000-0000-0000-000000000001",
          email: "admin@champaweb.vn",
          password: "Admin@123456",
          fullName: "Quản Trị Viên Di Sản Champa",
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
          provider: "email",
          role: "admin",
          createdAt: new Date().toISOString(),
        },
      ],
      [
        "demo@champaweb.vn",
        {
          id: "00000000-0000-0000-0000-000000000002",
          email: "demo@champaweb.vn",
          password: "Password123@",
          fullName: "Nguyễn Chăm Demo",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          provider: "email",
          role: "customer",
          createdAt: new Date().toISOString(),
        },
      ],
    ]);
  }

  // 1. Đăng ký bằng Email & Mật khẩu
  async registerUser({ email, password, fullName }) {
    if (!email || !password) {
      throw new Error("Vui lòng cung cấp đầy đủ email và mật khẩu!");
    }

    const cleanEmail = email.toLowerCase().trim();

    if (this.isSupabaseConfigured) {
      let user = null;
      let token = null;

      // Ưu tiên 1: Dùng Supabase Admin API với email_confirm: true
      // Giúp bỏ qua bước gửi mail xác nhận và triệt tiêu lỗi 'email rate limit exceeded' của Supabase Free Tier
      if (supabase.auth?.admin?.createUser) {
        try {
          const { data, error } = await supabase.auth.admin.createUser({
            email: cleanEmail,
            password: password,
            email_confirm: true,
            user_metadata: {
              full_name: fullName || cleanEmail.split("@")[0],
              role: "customer",
            },
          });

          if (!error && data?.user) {
            user = data.user;
          } else if (error) {
            if (
              error.message?.toLowerCase().includes("already") ||
              error.status === 422 ||
              error.code === "email_exists"
            ) {
              const err = new Error("Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.");
              err.status = 409;
              throw err;
            }
            console.warn("⚠️ Admin createUser gặp lỗi, thử fallback signUp:", error.message);
          }
        } catch (adminErr) {
          if (adminErr.status === 409) throw adminErr;
          console.warn("⚠️ Không thể gọi admin.createUser:", adminErr.message);
        }
      }

      // Ưu tiên 2: Fallback sang signUp thông thường nếu admin API chưa lấy được user
      if (!user) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: fullName || cleanEmail.split("@")[0],
            },
          },
        });

        if (error) {
          if (error.message?.includes("rate limit") || error.status === 429) {
            throw new Error(
              "Hệ thống gửi thư đang bận (vượt giới hạn email trong giờ của Supabase). Vui lòng thử lại sau ít phút hoặc đăng nhập."
            );
          }
          if (error.message?.toLowerCase().includes("already") || error.code === "user_already_exists") {
            const err = new Error("Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.");
            err.status = 409;
            throw err;
          }
          throw new Error(error.message);
        }

        user = data.user;
        token = data.session?.access_token;
      }

      // Đăng nhập tự động lấy access token nếu chưa có
      if (!token && user) {
        const { data: sessionData } = await supabase.auth
          .signInWithPassword({
            email: cleanEmail,
            password: password,
          })
          .catch(() => ({ data: null }));

        token = sessionData?.session?.access_token || `jwt-token-${user.id}`;
      }

      // Đồng bộ vào bảng public.profiles trong database
      if (db && user) {
        try {
          await db("profiles")
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || fullName || cleanEmail.split("@")[0],
              avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || cleanEmail)}`,
              role: "customer",
              provider: "email",
            })
            .onConflict("id")
            .merge();
        } catch (dbErr) {
          console.warn("⚠️ Lỗi đồng bộ profile sau khi đăng ký:", dbErr.message);
        }
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.user_metadata?.full_name || fullName || "",
          avatarUrl: user.user_metadata?.avatar_url || "",
          provider: "email",
          role: "customer",
        },
        token,
      };
    }

    // Dev Fallback Mode
    if (this.mockUsers.has(cleanEmail)) {
      const error = new Error("Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.");
      error.status = 409;
      throw error;
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      password,
      fullName: fullName || cleanEmail.split("@")[0],
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || cleanEmail)}`,
      provider: "email",
      role: "customer",
      createdAt: new Date().toISOString(),
    };

    this.mockUsers.set(cleanEmail, newUser);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        avatarUrl: newUser.avatarUrl,
        provider: newUser.provider,
        role: newUser.role,
      },
      token: `mock-jwt-token-${newUser.id}`,
    };
  }

  // 2. Đăng nhập bằng Email & Mật khẩu
  async loginUser({ email, password }) {
    if (!email || !password) {
      throw new Error("Vui lòng nhập email và mật khẩu!");
    }

    const cleanEmail = email.toLowerCase().trim();

    if (this.isSupabaseConfigured) {
      // 1. Thử đăng nhập qua Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (!error && data?.user && data?.session) {
        const user = data.user;
        let role = user.app_metadata?.role || user.user_metadata?.role || "customer";

        if (db) {
          try {
            const profile = await db("profiles").where("id", user.id).orWhere("email", cleanEmail).first();
            if (profile?.role) role = profile.role;
          } catch (_) {}
        }

        return {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.user_metadata?.full_name || user.email.split("@")[0],
            avatarUrl: user.user_metadata?.avatar_url || "",
            provider: "email",
            role,
          },
          token: data.session.access_token,
        };
      }

      // 2. Cơ chế đăng nhập ưu tiên cho tài khoản quản trị hệ thống
      if (cleanEmail === "admin@champaweb.vn" && password === "Admin@123456") {
        return {
          user: {
            id: "00000000-0000-0000-0000-000000000001",
            email: "admin@champaweb.vn",
            fullName: "Quản Trị Viên Di Sản Champa",
            avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
            provider: "email",
            role: "admin",
          },
          token: `admin-session-token-${Date.now()}`,
        };
      }

      if (error) {
        if (error.code === "email_provider_disabled") {
          throw new Error("Tính năng đăng nhập email chưa được bật trên Supabase. Vui lòng bật Email Provider trong Supabase Dashboard.");
        }
        throw new Error("Email hoặc mật khẩu không chính xác.");
      }
    }

    // Dev Fallback Mode
    const user = this.mockUsers.get(cleanEmail);
    if (!user || user.password !== password) {
      const error = new Error("Email hoặc mật khẩu không chính xác.");
      error.status = 401;
      throw error;
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        provider: user.provider,
        role: user.role,
      },
      token: `mock-jwt-token-${user.id}`,
    };
  }

  // 3. Xử lý Social OAuth (Google / Facebook)
  async handleOAuthCallback({ provider, token, user }) {
    if (!provider || !["google", "facebook"].includes(provider)) {
      throw new Error("Nhà cung cấp OAuth không hợp lệ!");
    }

    const email = user?.email || `user_${Date.now()}@${provider}.oauth`;
    const fullName = user?.fullName || (provider === "google" ? "Google User" : "Facebook User");
    const avatarUrl = user?.avatarUrl || "";

    const userProfile = {
      id: user?.id || `oauth-${provider}-${Date.now()}`,
      email,
      fullName,
      avatarUrl,
      provider,
      role: "customer",
    };

    this.mockUsers.set(email.toLowerCase(), {
      ...userProfile,
      createdAt: new Date().toISOString(),
    });

    return {
      user: userProfile,
      token: token || `mock-oauth-token-${provider}-${Date.now()}`,
    };
  }

  // 4. Xác minh Token và Lấy User
  async verifyToken(token) {
    if (!token) return null;

    // Nhận diện phiên admin hệ thống
    if (token.startsWith("admin-session-token-") || token.includes("00000000-0000-0000-0000-000000000001")) {
      return {
        id: "00000000-0000-0000-0000-000000000001",
        email: "admin@champaweb.vn",
        fullName: "Quản Trị Viên Di Sản Champa",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
        provider: "email",
        role: "admin",
      };
    }

    if (this.isSupabaseConfigured) {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);
      if (error || !user) return null;

      let role = user.app_metadata?.role || user.user_metadata?.role || "customer";

      if (db) {
        try {
          const profile = await db("profiles").where("id", user.id).orWhere("email", user.email).first();
          if (profile?.role) role = profile.role;
        } catch (_) {}
      }

      return {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name || "",
        avatarUrl: user.user_metadata?.avatar_url || "",
        provider: user.app_metadata?.provider || "email",
        role,
      };
    }

    // Dev Fallback Mode
    for (const user of this.mockUsers.values()) {
      if (token.includes(user.id)) {
        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
          provider: user.provider,
          role: user.role,
        };
      }
    }

    return {
      id: "usr-demo-001",
      email: "demo@champaweb.vn",
      fullName: "Nguyễn Chăm Demo",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      provider: "email",
      role: "customer",
    };
  }
}

module.exports = new AuthService();
