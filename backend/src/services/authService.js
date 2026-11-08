const crypto = require("crypto");
const supabase = require("../config/supabaseClient");
const db = require("../config/db");
const { JWT_SECRET } = require("../config/env");

class AuthService {
  constructor() {
    this.jwtSecret = JWT_SECRET || "champaweb_dev_jwt_secret_fallback_key";
    this.jwtExpiresInDays = 7;

    this.isSupabaseConfigured =
      Boolean(process.env.SUPABASE_URL) &&
      !process.env.SUPABASE_URL.includes("placeholder-project") &&
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY) &&
      !String(process.env.SUPABASE_ANON_KEY).includes("placeholder");

    // In-memory dev/mock stores when live DB is unavailable or in mock test mode
    this.mockUsers = new Map([
      [
        "admin@champaweb.vn",
        {
          id: "usr-admin-001",
          email: "admin@champaweb.vn",
          password: "Admin@123456",
          fullName: "Quản Trị Viên Di Sản",
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
          provider: "email",
          role: "admin",
          status: "active",
          emailVerified: true,
          createdAt: new Date().toISOString(),
        },
      ],
      [
        "demo@champaweb.vn",
        {
          id: "usr-demo-001",
          email: "demo@champaweb.vn",
          password: "Password123@",
          fullName: "Nguyễn Chăm Demo",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          provider: "email",
          role: "customer",
          status: "active",
          emailVerified: false,
          createdAt: new Date().toISOString(),
        },
      ],
    ]);

    // Mock OAuth Accounts map: key = `${provider}:${providerUserId}`
    this.mockOAuthAccounts = new Map();
  }

  // =========================================================================
  // JWT TOKEN GENERATION & VERIFICATION (HMAC-SHA256)
  // =========================================================================

  /**
   * Generates a signed, URL-safe JWT token.
   * Format: header.payload.signature
   *
   * @param {object} payload
   * @returns {string} Signed JWT token
   */
  generateJwt(payload) {
    const header = { alg: "HS256", typ: "JWT" };
    const nowSec = Math.floor(Date.now() / 1000);
    const expSec = nowSec + this.jwtExpiresInDays * 24 * 60 * 60;

    const fullPayload = {
      ...payload,
      iat: nowSec,
      exp: expSec,
    };

    const encodedHeader = Buffer.from(JSON.stringify(header), "utf8").toString("base64url");
    const encodedPayload = Buffer.from(JSON.stringify(fullPayload), "utf8").toString("base64url");
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const signature = crypto
      .createHmac("sha256", this.jwtSecret)
      .update(dataToSign)
      .digest("base64url");

    return `${dataToSign}.${signature}`;
  }

  /**
   * Verifies and decodes a signed JWT token.
   *
   * @param {string} token
   * @returns {object|null} Decoded payload if valid, null otherwise
   */
  verifyJwt(token) {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = crypto
      .createHmac("sha256", this.jwtSecret)
      .update(dataToSign)
      .digest("base64url");

    const sigBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    try {
      const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
      const nowSec = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < nowSec) {
        return null; // Expired token
      }
      return payload;
    } catch {
      return null;
    }
  }

  // =========================================================================
  // SOCIAL OAUTH 2.0 ATOMIC LOGIN & ACCOUNT LINKING (DATABASE TRANSACTION)
  // =========================================================================

  /**
   * Handles social authentication with strict atomicity and account takeover prevention.
   *
   * @param {object} params
   * @param {string} params.provider - 'google' | 'facebook'
   * @param {string} params.providerUserId - External user ID from provider
   * @param {string} params.email - Email returned by provider
   * @param {boolean} params.emailVerified - Verification claim from provider
   * @param {string} params.fullName - Full name
   * @param {string} params.avatarUrl - Avatar image URL
   * @returns {Promise<{ user: object, token: string, isNewUser: boolean }>}
   */
  async handleSocialLogin({
    provider,
    providerUserId,
    email,
    emailVerified = false,
    fullName = "",
    avatarUrl = "",
  }) {
    if (!provider || !["google", "facebook"].includes(provider)) {
      throw new Error(`Nhà cung cấp OAuth "${provider}" không được hỗ trợ.`);
    }

    if (!providerUserId) {
      throw new Error("Không thể xác định danh tính (providerUserId) từ nhà cung cấp OAuth.");
    }

    const cleanEmail = email ? email.toLowerCase().trim() : "";
    const cleanName = fullName.trim() || (cleanEmail ? cleanEmail.split("@")[0] : `Người dùng ${provider}`);

    // Kiểm tra xem database PostgreSQL có đang kết nối không
    let isDbConnected = false;
    if (process.env.NODE_ENV !== "test" && db) {
      try {
        await db.raw("SELECT 1");
        isDbConnected = true;
      } catch {
        isDbConnected = false;
      }
    }

    // =======================================================================
    // 1. LIVE POSTGRESQL DATABASE FLOW (WITH ATOMIC TRANSACTIONS)
    // =======================================================================
    if (isDbConnected) {
      return await db.transaction(async (trx) => {
        // 1.1 Kiểm tra liên kết OAuth sẵn có: (provider, provider_user_id)
        const existingOAuth = await trx("oauth_accounts")
          .where({
            provider,
            provider_user_id: String(providerUserId),
          })
          .first();

        if (existingOAuth) {
          const user = await trx("profiles").where({ id: existingOAuth.user_id }).first();
          if (!user) {
            const err = new Error("Tài khoản người dùng liên kết không tồn tại hoặc đã bị xóa.");
            err.status = 404;
            throw err;
          }

          if (user.status === "suspended") {
            const err = new Error("Tài khoản của bạn hiện đang bị đình chỉ hoạt động. Vui lòng liên hệ ban quản trị.");
            err.status = 403;
            throw err;
          }

          const updatePayload = { updated_at: new Date() };
          if (!user.avatar_url && avatarUrl) updatePayload.avatar_url = avatarUrl;
          if (emailVerified && !user.email_verified) updatePayload.email_verified = true;

          await trx("profiles").where({ id: user.id }).update(updatePayload);
          await trx("oauth_accounts").where({ id: existingOAuth.id }).update({
            provider_email: cleanEmail || existingOAuth.provider_email,
            updated_at: new Date(),
          });

          const token = this.generateJwt({
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status || "active",
            provider,
          });

          return {
            user: {
              id: user.id,
              email: user.email,
              fullName: user.full_name || cleanName,
              avatarUrl: user.avatar_url || avatarUrl,
              role: user.role || "customer",
              provider: user.provider || provider,
              emailVerified: Boolean(user.email_verified || emailVerified),
              status: user.status || "active",
              createdAt: user.created_at,
            },
            token,
            isNewUser: false,
          };
        }

        // 1.2 Chưa có liên kết OAuth này. Kiểm tra xem email có trùng với tài khoản đã tồn tại không
        let existingUser = null;
        if (cleanEmail) {
          existingUser = await trx("profiles").where({ email: cleanEmail }).first();
        }

        if (existingUser) {
          // BẢO VỆ CHỐNG ACCOUNT TAKEOVER:
          if (!emailVerified) {
            const err = new Error(
              `Địa chỉ email (${cleanEmail}) từ ${provider === "google" ? "Google" : "Facebook"} chưa được xác minh danh tính. Để bảo mật tài khoản, không thể tự động liên kết.`
            );
            err.status = 400;
            throw err;
          }

          if (existingUser.status === "suspended") {
            const err = new Error("Tài khoản của bạn hiện đang bị đình chỉ. Không thể liên kết mạng xã hội.");
            err.status = 403;
            throw err;
          }

          await trx("oauth_accounts").insert({
            id: crypto.randomUUID(),
            user_id: existingUser.id,
            provider,
            provider_user_id: String(providerUserId),
            provider_email: cleanEmail,
            created_at: new Date(),
            updated_at: new Date(),
          });

          const updatePayload = { updated_at: new Date() };
          if (!existingUser.avatar_url && avatarUrl) updatePayload.avatar_url = avatarUrl;
          if (!existingUser.email_verified) updatePayload.email_verified = true;

          await trx("profiles").where({ id: existingUser.id }).update(updatePayload);

          const token = this.generateJwt({
            id: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
            status: existingUser.status || "active",
            provider,
          });

          return {
            user: {
              id: existingUser.id,
              email: existingUser.email,
              fullName: existingUser.full_name || cleanName,
              avatarUrl: existingUser.avatar_url || avatarUrl,
              role: existingUser.role || "customer",
              provider: existingUser.provider || "email",
              emailVerified: true,
              status: existingUser.status || "active",
              createdAt: existingUser.created_at,
            },
            token,
            isNewUser: false,
          };
        }

        // 1.3 Tạo người dùng hoàn toàn mới
        const newUserId = crypto.randomUUID();
        const finalEmail = cleanEmail || `oauth_${provider}_${providerUserId}@champaweb.vn`;

        try {
          await trx.raw(
            `INSERT INTO auth.users (id, email, raw_user_meta_data, raw_app_meta_data, created_at, updated_at)
             VALUES (?, ?, ?, ?, NOW(), NOW())
             ON CONFLICT (id) DO NOTHING`,
            [
              newUserId,
              finalEmail,
              JSON.stringify({ full_name: cleanName, avatar_url: avatarUrl }),
              JSON.stringify({ provider }),
            ]
          );
        } catch {
          // Bỏ qua nếu môi trường DB không có auth.users schema
        }

        const newUserPayload = {
          id: newUserId,
          email: finalEmail,
          full_name: cleanName,
          avatar_url: avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
          role: "customer",
          provider,
          status: "active",
          email_verified: Boolean(emailVerified),
          created_at: new Date(),
          updated_at: new Date(),
        };

        const [createdUser] = await trx("profiles").insert(newUserPayload).returning("*");

        await trx("oauth_accounts").insert({
          id: crypto.randomUUID(),
          user_id: newUserId,
          provider,
          provider_user_id: String(providerUserId),
          provider_email: cleanEmail || null,
          created_at: new Date(),
          updated_at: new Date(),
        });

        const token = this.generateJwt({
          id: newUserId,
          email: finalEmail,
          role: "customer",
          status: "active",
          provider,
        });

        return {
          user: {
            id: createdUser ? createdUser.id : newUserId,
            email: createdUser ? createdUser.email : finalEmail,
            fullName: createdUser ? createdUser.full_name : cleanName,
            avatarUrl: createdUser ? createdUser.avatar_url : avatarUrl,
            role: "customer",
            provider,
            emailVerified: Boolean(emailVerified),
            status: "active",
            createdAt: createdUser ? createdUser.created_at : new Date().toISOString(),
          },
          token,
          isNewUser: true,
        };
      });
    }

    // =======================================================================
    // 2. FALLBACK DEV / MOCK IN-MEMORY FLOW (Same Validation & Safety Rules)
    // =======================================================================
    const oauthKey = `${provider}:${providerUserId}`;
    const linkedUserId = this.mockOAuthAccounts.get(oauthKey);

    if (linkedUserId) {
      let foundUser = null;
      for (const u of this.mockUsers.values()) {
        if (u.id === linkedUserId) {
          foundUser = u;
          break;
        }
      }

      if (foundUser) {
        if (foundUser.status === "suspended") {
          const err = new Error("Tài khoản của bạn hiện đang bị đình chỉ.");
          err.status = 403;
          throw err;
        }

        const token = this.generateJwt({
          id: foundUser.id,
          email: foundUser.email,
          role: foundUser.role,
          status: foundUser.status || "active",
          provider,
        });

        return {
          user: {
            id: foundUser.id,
            email: foundUser.email,
            fullName: foundUser.fullName,
            avatarUrl: foundUser.avatarUrl,
            role: foundUser.role,
            provider: foundUser.provider,
            emailVerified: Boolean(foundUser.emailVerified),
            status: foundUser.status || "active",
            createdAt: foundUser.createdAt,
          },
          token,
          isNewUser: false,
        };
      }
    }

    // Kiểm tra trùng email trong mock users
    if (cleanEmail && this.mockUsers.has(cleanEmail)) {
      const existingUser = this.mockUsers.get(cleanEmail);

      // Chống account takeover: Từ chối nếu email chưa xác minh
      if (!emailVerified) {
        const err = new Error(
          `Địa chỉ email (${cleanEmail}) từ ${provider === "google" ? "Google" : "Facebook"} chưa được xác minh danh tính. Để bảo mật tài khoản, không thể tự động liên kết.`
        );
        err.status = 400;
        throw err;
      }

      if (existingUser.status === "suspended") {
        const err = new Error("Tài khoản hiện đang bị đình chỉ.");
        err.status = 403;
        throw err;
      }

      this.mockOAuthAccounts.set(oauthKey, existingUser.id);
      existingUser.emailVerified = true;
      if (!existingUser.avatarUrl && avatarUrl) existingUser.avatarUrl = avatarUrl;

      const token = this.generateJwt({
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        status: existingUser.status || "active",
        provider,
      });

      return {
        user: {
          id: existingUser.id,
          email: existingUser.email,
          fullName: existingUser.fullName,
          avatarUrl: existingUser.avatarUrl,
          role: existingUser.role,
          provider: existingUser.provider,
          emailVerified: true,
          status: existingUser.status || "active",
          createdAt: existingUser.createdAt,
        },
        token,
        isNewUser: false,
      };
    }

    // Tạo người dùng mới trong mock store
    const newUserId = `usr-oauth-${Date.now()}`;
    const finalEmail = cleanEmail || `oauth_${provider}_${providerUserId}@champaweb.vn`;

    const newUser = {
      id: newUserId,
      email: finalEmail,
      fullName: cleanName,
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
      role: "customer",
      provider,
      status: "active",
      emailVerified: Boolean(emailVerified),
      createdAt: new Date().toISOString(),
    };

    this.mockUsers.set(finalEmail, newUser);
    this.mockOAuthAccounts.set(oauthKey, newUserId);

    const token = this.generateJwt({
      id: newUserId,
      email: finalEmail,
      role: "customer",
      status: "active",
      provider,
    });

    return {
      user: newUser,
      token,
      isNewUser: true,
    };
  }

  // =========================================================================
  // STANDARD EMAIL / PASSWORD AUTHENTICATION METHODS
  // =========================================================================

  // 1. Đăng ký bằng Email & Mật khẩu
  async registerUser({ email, password, fullName }) {
    if (!email || !password) {
      throw new Error("Vui lòng cung cấp đầy đủ email và mật khẩu!");
    }

    const cleanEmail = email.toLowerCase().trim();

    if (this.isSupabaseConfigured) {
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
        throw new Error(error.message);
      }

      const user = data.user;
      const token = data.session?.access_token || this.generateJwt({ id: user.id, email: user.email, role: "customer" });

      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.user_metadata?.full_name || fullName || "",
          avatarUrl: user.user_metadata?.avatar_url || "",
          provider: "email",
        },
        token,
      };
    }

    // Live PostgreSQL Fallback
    try {
      if (process.env.NODE_ENV !== "test" && db) {
        const existing = await db("profiles").where({ email: cleanEmail }).first();
        if (existing) {
          const error = new Error("Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.");
          error.status = 409;
          throw error;
        }

        const newId = crypto.randomUUID();
        const newUserPayload = {
          id: newId,
          email: cleanEmail,
          full_name: fullName || cleanEmail.split("@")[0],
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || cleanEmail)}`,
          provider: "email",
          role: "customer",
          status: "active",
          email_verified: false,
          created_at: new Date(),
          updated_at: new Date(),
        };

        const [created] = await db("profiles").insert(newUserPayload).returning("*");
        const token = this.generateJwt({ id: newId, email: cleanEmail, role: "customer", status: "active" });

        return {
          user: created,
          token,
        };
      }
    } catch (err) {
      if (err.status) throw err;
    }

    // Dev Mock Mode
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
      status: "active",
      emailVerified: false,
      createdAt: new Date().toISOString(),
    };

    this.mockUsers.set(cleanEmail, newUser);
    const token = this.generateJwt({ id: newUser.id, email: cleanEmail, role: "customer", status: "active" });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        avatarUrl: newUser.avatarUrl,
        provider: newUser.provider,
        role: newUser.role,
      },
      token,
    };
  }

  // 2. Đăng nhập bằng Email & Mật khẩu
  async loginUser({ email, password }) {
    if (!email || !password) {
      throw new Error("Vui lòng nhập email và mật khẩu!");
    }

    const cleanEmail = email.toLowerCase().trim();

    if (this.isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) {
        throw new Error("Email hoặc mật khẩu không chính xác.");
      }

      const user = data.user;
      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.user_metadata?.full_name || user.email.split("@")[0],
          avatarUrl: user.user_metadata?.avatar_url || "",
          provider: "email",
        },
        token: data.session.access_token,
      };
    }

    // Live DB Check
    try {
      if (process.env.NODE_ENV !== "test" && db) {
        const user = await db("profiles").where({ email: cleanEmail }).first();
        if (user) {
          if (user.status === "suspended") {
            const err = new Error("Tài khoản của bạn hiện đang bị đình chỉ hoạt động.");
            err.status = 403;
            throw err;
          }

          const token = this.generateJwt({
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status || "active",
          });

          return {
            user: {
              id: user.id,
              email: user.email,
              fullName: user.full_name,
              avatarUrl: user.avatar_url,
              provider: user.provider,
              role: user.role,
            },
            token,
          };
        }
      }
    } catch (err) {
      if (err.status) throw err;
    }

    // Dev Mock Mode
    const user = this.mockUsers.get(cleanEmail);
    if (!user || user.password !== password) {
      const error = new Error("Email hoặc mật khẩu không chính xác.");
      error.status = 401;
      throw error;
    }

    if (user.status === "suspended") {
      const err = new Error("Tài khoản của bạn hiện đang bị đình chỉ.");
      err.status = 403;
      throw err;
    }

    const token = this.generateJwt({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status || "active",
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        provider: user.provider,
        role: user.role,
      },
      token,
    };
  }

  // 3. Tương thích ngược với endpoint POST /oauth-callback cũ
  async handleOAuthCallback({ provider, token, user }) {
    if (!provider || !["google", "facebook"].includes(provider)) {
      throw new Error("Nhà cung cấp OAuth không hợp lệ!");
    }

    return await this.handleSocialLogin({
      provider,
      providerUserId: user?.id || `usr-${provider}-${Date.now()}`,
      email: user?.email || "",
      emailVerified: true,
      fullName: user?.fullName || (provider === "google" ? "Google User" : "Facebook User"),
      avatarUrl: user?.avatarUrl || "",
    });
  }

  // 4. Xác minh Token và Lấy User chi tiết (kèm tài khoản mạng xã hội liên kết)
  async verifyToken(token) {
    if (!token) return null;

    // 4.1 Thử giải mã Token định dạng JWT do hệ thống ký
    const jwtPayload = this.verifyJwt(token);
    if (jwtPayload && jwtPayload.id) {
      try {
        if (process.env.NODE_ENV !== "test" && db) {
          const user = await db("profiles").where({ id: jwtPayload.id }).first();
          if (user) {
            if (user.status === "suspended") return null;

            let oauthAccounts = [];
            try {
              oauthAccounts = await db("oauth_accounts")
                .select("provider", "provider_email", "created_at")
                .where({ user_id: user.id });
            } catch {
              oauthAccounts = [];
            }

            return {
              id: user.id,
              email: user.email,
              fullName: user.full_name || "",
              avatarUrl: user.avatar_url || "",
              provider: user.provider || "email",
              role: user.role || "customer",
              status: user.status || "active",
              emailVerified: Boolean(user.email_verified),
              oauthAccounts,
            };
          }
        }
      } catch {
        // Fallback to payload data if DB check fails
      }

      // Mock user lookup
      for (const user of this.mockUsers.values()) {
        if (user.id === jwtPayload.id) {
          if (user.status === "suspended") return null;
          return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            avatarUrl: user.avatarUrl,
            provider: user.provider,
            role: user.role,
            status: user.status || "active",
            emailVerified: Boolean(user.emailVerified),
            oauthAccounts: [],
          };
        }
      }

      return {
        id: jwtPayload.id,
        email: jwtPayload.email || "",
        fullName: jwtPayload.email ? jwtPayload.email.split("@")[0] : "Người dùng",
        avatarUrl: "",
        provider: jwtPayload.provider || "email",
        role: jwtPayload.role || "customer",
        status: jwtPayload.status || "active",
        emailVerified: true,
        oauthAccounts: [],
      };
    }

    // 4.2 Thử xác minh qua Supabase Auth nếu cấu hình
    if (this.isSupabaseConfigured) {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser(token);
        if (!error && user) {
          return {
            id: user.id,
            email: user.email,
            fullName: user.user_metadata?.full_name || "",
            avatarUrl: user.user_metadata?.avatar_url || "",
            provider: user.app_metadata?.provider || "email",
            role: user.app_metadata?.role || user.user_metadata?.role || "customer",
            emailVerified: Boolean(user.email_confirmed_at),
            oauthAccounts: [],
          };
        }
      } catch {
        // Continue fallback
      }
    }

    // 4.3 Fallback chỉ dành riêng cho môi trường kiểm thử tự động (NODE_ENV === "test")
    if (process.env.NODE_ENV === "test") {
      for (const user of this.mockUsers.values()) {
        if (token === `mock-test-token-${user.id}`) {
          return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            avatarUrl: user.avatarUrl,
            provider: user.provider,
            role: user.role,
            status: user.status || "active",
            emailVerified: Boolean(user.emailVerified),
            oauthAccounts: [],
          };
        }
      }
    }

    return null;
  }
}

module.exports = new AuthService();
