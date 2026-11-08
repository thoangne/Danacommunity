const authService = require("../services/authService");
const oauthService = require("../services/oauthService");
const { FRONTEND_URL } = require("../config/env");

class AuthController {
  // =========================================================================
  // STANDARD LOCAL AUTHENTICATION
  // =========================================================================

  async register(req, res, next) {
    try {
      const { email, password, fullName } = req.body;
      const result = await authService.registerUser({ email, password, fullName });
      return res.status(201).json({
        success: true,
        message: "Đăng ký tài khoản thành công!",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginUser({ email, password });
      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công!",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================================
  // GOOGLE OAUTH 2.0 / OPENID CONNECT
  // =========================================================================

  /**
   * GET /api/auth/google
   * Initiates Google OAuth 2.0 flow: creates CSRF state and redirects to Google.
   */
  async initiateGoogleAuth(req, res, next) {
    try {
      const returnTo = req.query.returnTo || "/";
      const { url } = oauthService.getGoogleAuthUrl(returnTo);

      if (req.query.format === "json") {
        return res.status(200).json({
          success: true,
          data: { redirectUrl: url },
        });
      }

      return res.redirect(url);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/google/callback
   * Handles Google OAuth callback: validates state, exchanges code, retrieves profile,
   * creates/links user, and redirects to frontend with authentication token.
   */
  async handleGoogleCallback(req, res, next) {
    const { code, state, error, error_description } = req.query;
    const isJsonFormat = req.query.format === "json";

    try {
      if (error) {
        const errorMsg = error_description || error || "Đăng nhập Google bị hủy hoặc bị từ chối quyền truy cập.";
        if (isJsonFormat) {
          return res.status(400).json({ success: false, message: errorMsg });
        }
        return res.redirect(`${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(errorMsg)}`);
      }

      if (!code) {
        const errorMsg = "Thiếu mã xác thực (authorization code) từ Google.";
        if (isJsonFormat) {
          return res.status(400).json({ success: false, message: errorMsg });
        }
        return res.redirect(`${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(errorMsg)}`);
      }

      const stateVerification = oauthService.verifyOAuthState(state);
      if (!stateVerification.valid) {
        const errorMsg = stateVerification.error || "Xác thực OAuth state thất bại (nguy cơ tấn công CSRF).";
        if (isJsonFormat) {
          return res.status(403).json({ success: false, message: errorMsg });
        }
        return res.redirect(`${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(errorMsg)}`);
      }

      const tokenData = await oauthService.exchangeGoogleCode(code);
      const profile = await oauthService.getGoogleUserProfile(tokenData.access_token);

      const authResult = await authService.handleSocialLogin({
        provider: "google",
        providerUserId: profile.sub,
        email: profile.email,
        emailVerified: profile.email_verified,
        fullName: profile.name,
        avatarUrl: profile.picture,
      });

      if (isJsonFormat) {
        return res.status(200).json({
          success: true,
          message: "Đăng nhập Google thành công!",
          data: authResult,
          returnTo: stateVerification.returnTo,
        });
      }

      const redirectParams = new URLSearchParams({
        token: authResult.token,
        status: "success",
        returnTo: stateVerification.returnTo,
      });

      return res.redirect(`${FRONTEND_URL}/auth/callback?${redirectParams.toString()}`);
    } catch (err) {
      const errorMsg = err.message || "Đã xảy ra lỗi trong quá trình xác thực Google OAuth.";
      if (isJsonFormat) {
        return res.status(err.status || 500).json({ success: false, message: errorMsg });
      }
      return res.redirect(`${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(errorMsg)}`);
    }
  }

  // =========================================================================
  // FACEBOOK OAUTH 2.0
  // =========================================================================

  /**
   * GET /api/auth/facebook
   * Initiates Facebook OAuth 2.0 flow: creates CSRF state and redirects to Facebook.
   */
  async initiateFacebookAuth(req, res, next) {
    try {
      const returnTo = req.query.returnTo || "/";
      const { url } = oauthService.getFacebookAuthUrl(returnTo);

      if (req.query.format === "json") {
        return res.status(200).json({
          success: true,
          data: { redirectUrl: url },
        });
      }

      return res.redirect(url);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/facebook/callback
   * Handles Facebook OAuth callback: validates state, exchanges code, retrieves profile,
   * creates/links user, and redirects to frontend with authentication token.
   */
  async handleFacebookCallback(req, res, next) {
    const { code, state, error, error_description, error_message } = req.query;
    const isJsonFormat = req.query.format === "json";

    try {
      if (error) {
        const errorMsg = error_description || error_message || error || "Đăng nhập Facebook bị hủy.";
        if (isJsonFormat) {
          return res.status(400).json({ success: false, message: errorMsg });
        }
        return res.redirect(`${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(errorMsg)}`);
      }

      if (!code) {
        const errorMsg = "Thiếu mã xác thực (authorization code) từ Facebook.";
        if (isJsonFormat) {
          return res.status(400).json({ success: false, message: errorMsg });
        }
        return res.redirect(`${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(errorMsg)}`);
      }

      const stateVerification = oauthService.verifyOAuthState(state);
      if (!stateVerification.valid) {
        const errorMsg = stateVerification.error || "Xác thực OAuth state thất bại (nguy cơ tấn công CSRF).";
        if (isJsonFormat) {
          return res.status(403).json({ success: false, message: errorMsg });
        }
        return res.redirect(`${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(errorMsg)}`);
      }

      const tokenData = await oauthService.exchangeFacebookCode(code);
      const profile = await oauthService.getFacebookUserProfile(tokenData.access_token);

      const authResult = await authService.handleSocialLogin({
        provider: "facebook",
        providerUserId: profile.id,
        email: profile.email,
        emailVerified: profile.email_verified,
        fullName: profile.name,
        avatarUrl: profile.picture,
      });

      if (isJsonFormat) {
        return res.status(200).json({
          success: true,
          message: "Đăng nhập Facebook thành công!",
          data: authResult,
          returnTo: stateVerification.returnTo,
        });
      }

      const redirectParams = new URLSearchParams({
        token: authResult.token,
        status: "success",
        returnTo: stateVerification.returnTo,
      });

      return res.redirect(`${FRONTEND_URL}/auth/callback?${redirectParams.toString()}`);
    } catch (err) {
      const errorMsg = err.message || "Đã xảy ra lỗi trong quá trình xác thực Facebook OAuth.";
      if (isJsonFormat) {
        return res.status(err.status || 500).json({ success: false, message: errorMsg });
      }
      return res.redirect(`${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(errorMsg)}`);
    }
  }

  // =========================================================================
  // USER PROFILE & SESSION MANAGEMENT
  // =========================================================================

  /**
   * Tương thích ngược với endpoint POST /api/auth/oauth-callback cũ
   */
  async oauthCallback(req, res, next) {
    try {
      const { provider, token, user } = req.body;
      const result = await authService.handleOAuthCallback({ provider, token, user });
      return res.status(200).json({
        success: true,
        message: `Đăng nhập qua ${provider === "google" ? "Google" : "Facebook"} thành công!`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   */
  async getMe(req, res, next) {
    try {
      if (req.user) {
        return res.status(200).json({
          success: true,
          data: { user: req.user },
        });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy token xác thực hoặc phiên đăng nhập đã hết hạn.",
        });
      }

      const token = authHeader.split(" ")[1];
      const user = await authService.verifyToken(token);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
        });
      }

      return res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(req, res, next) {
    try {
      return res.status(200).json({
        success: true,
        message: "Đăng xuất thành công!",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
