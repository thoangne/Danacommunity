const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { authRateLimiter } = require("../middlewares/authRateLimiter");

// Giới hạn tần suất yêu cầu trên các endpoint xác thực (Rate Limiting)
router.use(authRateLimiter);

// =============================================================================
// OAUTH 2.0 SOCIAL AUTHENTICATION ROUTES (GOOGLE & FACEBOOK)
// =============================================================================

// Khởi tạo và Callback cho Google OAuth 2.0 / OpenID Connect
router.get("/google", authController.initiateGoogleAuth);
router.get("/google/callback", authController.handleGoogleCallback);

// Khởi tạo và Callback cho Facebook OAuth 2.0
router.get("/facebook", authController.initiateFacebookAuth);
router.get("/facebook/callback", authController.handleFacebookCallback);

// =============================================================================
// LOCAL CREDENTIALS & COMPATIBILITY ROUTES
// =============================================================================

// Đăng ký tài khoản email & mật khẩu
router.post("/register", authController.register);

// Đăng nhập email & mật khẩu
router.post("/login", authController.login);

// Xác thực & đồng bộ OAuth (tương thích ngược cho SDK cũ)
router.post("/oauth-callback", authController.oauthCallback);

// Lấy thông tin user hiện tại (yêu cầu token xác thực Bearer)
router.get("/me", authenticateUser, authController.getMe);

// Đăng xuất phiên làm việc
router.post("/logout", authController.logout);

module.exports = router;
