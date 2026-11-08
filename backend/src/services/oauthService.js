const crypto = require("crypto");
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  FACEBOOK_CALLBACK_URL,
  JWT_SECRET,
  FRONTEND_URL,
} = require("../config/env");

class OAuthService {
  constructor() {
    this.stateTtlMs = 10 * 60 * 1000; // 10 minutes TTL for OAuth state
  }

  /**
   * Sanitizes the post-authentication redirect URL to prevent Open Redirect attacks.
   * Only allows local relative paths starting with / (excluding // or /\) or exact FRONTEND_URL matches.
   *
   * @param {string} returnTo
   * @returns {string} Sanitized destination path
   */
  sanitizeReturnUrl(returnTo) {
    if (!returnTo || typeof returnTo !== "string") {
      return "/";
    }

    const clean = returnTo.trim().replace(/[\r\n\t]/g, "");

    // Allow absolute URL only if origin exactly matches FRONTEND_URL
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      try {
        const targetUrl = new URL(clean);
        const frontendUrl = new URL(FRONTEND_URL);
        if (targetUrl.origin === frontendUrl.origin) {
          return targetUrl.pathname + targetUrl.search + targetUrl.hash;
        }
      } catch {
        return "/";
      }
      return "/";
    }

    // Must be a relative path starting with '/' and not '//' or '/\'
    if (clean.startsWith("/") && !clean.startsWith("//") && !clean.startsWith("/\\")) {
      return clean;
    }

    return "/";
  }

  /**
   * Generates a signed, tamper-proof, time-limited OAuth state token containing CSRF nonce & returnTo.
   *
   * @param {string} [returnTo="/"]
   * @returns {string} Cryptographic state token: "randomHex.timestamp.base64Path.signature"
   */
  createOAuthState(returnTo = "/") {
    const safePath = this.sanitizeReturnUrl(returnTo);
    const randomBytes = crypto.randomBytes(16).toString("hex");
    const timestamp = Date.now().toString();
    const encodedPath = Buffer.from(safePath, "utf8").toString("base64url");

    const dataToSign = `${randomBytes}.${timestamp}.${encodedPath}`;
    const signature = crypto
      .createHmac("sha256", JWT_SECRET || "champaweb_dev_jwt_secret_fallback_key")
      .update(dataToSign)
      .digest("base64url");

    return `${dataToSign}.${signature}`;
  }

  /**
   * Validates the OAuth state parameter against tampering, expiration, and CSRF manipulation.
   *
   * @param {string} state
   * @returns {{ valid: boolean, returnTo: string, error?: string }}
   */
  verifyOAuthState(state) {
    if (!state || typeof state !== "string") {
      return { valid: false, returnTo: "/", error: "Thiếu hoặc sai định dạng tham số OAuth state." };
    }

    const parts = state.split(".");
    if (parts.length !== 4) {
      return { valid: false, returnTo: "/", error: "Cấu trúc tham số OAuth state không hợp lệ." };
    }

    const [randomBytes, timestampStr, encodedPath, signature] = parts;
    const dataToSign = `${randomBytes}.${timestampStr}.${encodedPath}`;

    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET || "champaweb_dev_jwt_secret_fallback_key")
      .update(dataToSign)
      .digest("base64url");

    // Timing-safe signature comparison to protect against timing attacks
    const sigBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return { valid: false, returnTo: "/", error: "Chữ ký OAuth state không hợp lệ (nguy cơ tấn công CSRF)." };
    }

    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp) || Date.now() - timestamp > this.stateTtlMs) {
      return { valid: false, returnTo: "/", error: "Phiên xác thực OAuth đã hết hạn (quá 10 phút). Vui lòng thử lại." };
    }

    let returnTo = "/";
    try {
      const decodedPath = Buffer.from(encodedPath, "base64url").toString("utf8");
      returnTo = this.sanitizeReturnUrl(decodedPath);
    } catch {
      returnTo = "/";
    }

    return { valid: true, returnTo };
  }

  // =========================================================================
  // GOOGLE OAUTH 2.0 / OPENID CONNECT METHODS
  // =========================================================================

  /**
   * Constructs the Google OAuth authorization URL.
   *
   * @param {string} [returnTo="/"]
   * @returns {{ url: string, state: string }}
   */
  getGoogleAuthUrl(returnTo = "/") {
    if (!GOOGLE_CLIENT_ID) {
      throw new Error("GOOGLE_CLIENT_ID chưa được thiết lập trong biến môi trường.");
    }

    const state = this.createOAuthState(returnTo);
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_CALLBACK_URL,
      response_type: "code",
      scope: "openid email profile",
      state: state,
      access_type: "offline",
      prompt: "consent",
    });

    return {
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
      state,
    };
  }

  /**
   * Exchanges authorization code with Google token endpoint.
   *
   * @param {string} code
   * @returns {Promise<{ access_token: string, id_token?: string }>}
   */
  async exchangeGoogleCode(code) {
    if (!code) {
      throw new Error("Mã xác thực code từ Google không được để trống.");
    }

    const body = new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_CALLBACK_URL,
      grant_type: "authorization_code",
    });

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: body.toString(),
    });

    const data = await response.json();
    if (!response.ok) {
      const errorMsg = data.error_description || data.error || "Trao đổi authorization code với Google thất bại.";
      const error = new Error(errorMsg);
      error.status = response.status;
      throw error;
    }

    return data;
  }

  /**
   * Fetches verified profile from Google UserInfo endpoint.
   *
   * @param {string} accessToken
   * @returns {Promise<{ sub: string, email: string, email_verified: boolean, name: string, picture: string }>}
   */
  async getGoogleUserProfile(accessToken) {
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    const profile = await response.json();
    if (!response.ok) {
      const error = new Error(profile.error_description || "Lấy thông tin tài khoản Google thất bại.");
      error.status = response.status;
      throw error;
    }

    return {
      sub: profile.sub,
      email: (profile.email || "").toLowerCase().trim(),
      email_verified: Boolean(profile.email_verified),
      name: profile.name || profile.given_name || (profile.email ? profile.email.split("@")[0] : "Người dùng Google"),
      picture: profile.picture || "",
    };
  }

  // =========================================================================
  // FACEBOOK OAUTH 2.0 METHODS
  // =========================================================================

  /**
   * Constructs the Facebook OAuth authorization URL.
   *
   * @param {string} [returnTo="/"]
   * @returns {{ url: string, state: string }}
   */
  getFacebookAuthUrl(returnTo = "/") {
    if (!FACEBOOK_APP_ID) {
      throw new Error("FACEBOOK_APP_ID chưa được thiết lập trong biến môi trường.");
    }

    const state = this.createOAuthState(returnTo);
    const params = new URLSearchParams({
      client_id: FACEBOOK_APP_ID,
      redirect_uri: FACEBOOK_CALLBACK_URL,
      state: state,
      scope: "email,public_profile",
      response_type: "code",
    });

    return {
      url: `https://www.facebook.com/v20.0/dialog/oauth?${params.toString()}`,
      state,
    };
  }

  /**
   * Exchanges authorization code with Facebook token endpoint.
   *
   * @param {string} code
   * @returns {Promise<{ access_token: string }>}
   */
  async exchangeFacebookCode(code) {
    if (!code) {
      throw new Error("Mã xác thực code từ Facebook không được để trống.");
    }

    const params = new URLSearchParams({
      client_id: FACEBOOK_APP_ID,
      client_secret: FACEBOOK_APP_SECRET,
      redirect_uri: FACEBOOK_CALLBACK_URL,
      code,
    });

    const response = await fetch(`https://graph.facebook.com/v20.0/oauth/access_token?${params.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const data = await response.json();
    if (!response.ok) {
      const errorMsg = data.error?.message || "Trao đổi authorization code với Facebook thất bại.";
      const error = new Error(errorMsg);
      error.status = response.status;
      throw error;
    }

    return data;
  }

  /**
   * Fetches user profile from Facebook Graph API.
   *
   * @param {string} accessToken
   * @returns {Promise<{ id: string, name: string, email: string, email_verified: boolean, picture: string }>}
   */
  async getFacebookUserProfile(accessToken) {
    const params = new URLSearchParams({
      fields: "id,name,email,picture.type(large)",
      access_token: accessToken,
    });

    const response = await fetch(`https://graph.facebook.com/v20.0/me?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });

    const profile = await response.json();
    if (!response.ok) {
      const errorMsg = profile.error?.message || "Lấy thông tin tài khoản Facebook thất bại.";
      const error = new Error(errorMsg);
      error.status = response.status;
      throw error;
    }

    const avatarUrl = profile.picture?.data?.url || "";
    const email = profile.email ? profile.email.toLowerCase().trim() : "";

    return {
      id: profile.id,
      name: profile.name || "Người dùng Facebook",
      email,
      // Facebook does not provide an explicit email_verified boolean via Graph API.
      // If email exists, we flag true only if present; otherwise false.
      email_verified: Boolean(email),
      picture: avatarUrl,
    };
  }
}

module.exports = new OAuthService();

