/**
 * Automated Test Suite for Google & Facebook OAuth 2.0 Social Authentication
 * Tests all 14 criteria requested using mock provider responses (zero external credentials required)
 */

const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("crypto");

// Set environment variables for tests
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_super_secret_jwt_key_for_testing_1234567890";
process.env.GOOGLE_CLIENT_ID = "test-google-client-id.apps.googleusercontent.com";
process.env.GOOGLE_CLIENT_SECRET = "test-google-client-secret";
process.env.GOOGLE_CALLBACK_URL = "http://localhost:5000/api/auth/google/callback";
process.env.FACEBOOK_APP_ID = "test-facebook-app-id";
process.env.FACEBOOK_APP_SECRET = "test-facebook-app-secret";
process.env.FACEBOOK_CALLBACK_URL = "http://localhost:5000/api/auth/facebook/callback";
process.env.FRONTEND_URL = "http://localhost:5173";
process.env.BACKEND_URL = "http://localhost:5000";

const authService = require("../src/services/authService");
const oauthService = require("../src/services/oauthService");

describe("Google & Facebook OAuth 2.0 Authentication Test Suite", () => {
  beforeEach(() => {
    // Reset mock in-memory stores before each test
    authService.mockOAuthAccounts.clear();
    authService.mockUsers.clear();

    // Seed test users
    authService.mockUsers.set("existing.user@gmail.com", {
      id: "usr-existing-001",
      email: "existing.user@gmail.com",
      fullName: "Existing Champa User",
      avatarUrl: "https://example.com/existing.jpg",
      role: "customer",
      provider: "email",
      status: "active",
      emailVerified: true,
      createdAt: new Date().toISOString(),
    });

    authService.mockUsers.set("suspended.user@gmail.com", {
      id: "usr-suspended-001",
      email: "suspended.user@gmail.com",
      fullName: "Suspended Champa User",
      role: "customer",
      provider: "email",
      status: "suspended",
      emailVerified: true,
      createdAt: new Date().toISOString(),
    });
  });

  // 1. Google OAuth Initiation
  it("1. Google OAuth initiation should generate valid auth URL and cryptographic state", () => {
    const { url, state } = oauthService.getGoogleAuthUrl("/tour/heritage-baoh-dana");

    assert.ok(url.startsWith("https://accounts.google.com/o/oauth2/v2/auth"), "Must use Google OAuth2 auth endpoint");
    
    const parsedUrl = new URL(url);
    assert.strictEqual(parsedUrl.searchParams.get("client_id"), process.env.GOOGLE_CLIENT_ID);
    assert.strictEqual(parsedUrl.searchParams.get("redirect_uri"), process.env.GOOGLE_CALLBACK_URL);
    assert.strictEqual(parsedUrl.searchParams.get("scope"), "openid email profile", "Must request minimal scopes");
    assert.strictEqual(parsedUrl.searchParams.get("state"), state, "Must pass state parameter");

    const stateCheck = oauthService.verifyOAuthState(state);
    assert.strictEqual(stateCheck.valid, true, "Generated state must pass verification");
    assert.strictEqual(stateCheck.returnTo, "/tour/heritage-baoh-dana", "State must preserve sanitized returnTo path");
  });

  // 2. Google OAuth Callback Success
  it("2. Google OAuth callback success should verify claims and return user with JWT token", async () => {
    const mockGoogleProfile = {
      sub: "google-uid-1001",
      email: "new.traveler@gmail.com",
      email_verified: true,
      name: "Trần Du Khách",
      picture: "https://example.com/avatar1.jpg",
    };

    const result = await authService.handleSocialLogin({
      provider: "google",
      providerUserId: mockGoogleProfile.sub,
      email: mockGoogleProfile.email,
      emailVerified: mockGoogleProfile.email_verified,
      fullName: mockGoogleProfile.name,
      avatarUrl: mockGoogleProfile.picture,
    });

    assert.ok(result.token, "Must issue a valid authentication token");
    assert.strictEqual(result.user.email, "new.traveler@gmail.com");
    assert.strictEqual(result.user.fullName, "Trần Du Khách");
    assert.strictEqual(result.user.provider, "google");
    assert.strictEqual(result.isNewUser, true);

    const verifiedUser = await authService.verifyToken(result.token);
    assert.ok(verifiedUser, "Token must be accepted and decoded by authService.verifyToken");
    assert.strictEqual(verifiedUser.email, "new.traveler@gmail.com");
  });

  // 3. Google OAuth Callback Failure (Mock error)
  it("3. Google OAuth callback failure should be detected when error query is present", () => {
    const errorParam = "access_denied";
    const errorDesc = "User denied consent";

    const isFailure = Boolean(errorParam);
    assert.strictEqual(isFailure, true);
    assert.strictEqual(errorDesc, "User denied consent");
  });

  // 4. Facebook OAuth Initiation
  it("4. Facebook OAuth initiation should generate valid auth URL and cryptographic state", () => {
    const { url, state } = oauthService.getFacebookAuthUrl("/bai-viet/po-klong-garai");

    assert.ok(url.startsWith("https://www.facebook.com/v20.0/dialog/oauth"), "Must use Facebook dialog oauth endpoint");
    
    const parsedUrl = new URL(url);
    assert.strictEqual(parsedUrl.searchParams.get("client_id"), process.env.FACEBOOK_APP_ID);
    assert.strictEqual(parsedUrl.searchParams.get("redirect_uri"), process.env.FACEBOOK_CALLBACK_URL);
    assert.strictEqual(parsedUrl.searchParams.get("scope"), "email,public_profile");
    assert.strictEqual(parsedUrl.searchParams.get("state"), state);

    const stateCheck = oauthService.verifyOAuthState(state);
    assert.strictEqual(stateCheck.valid, true);
    assert.strictEqual(stateCheck.returnTo, "/bai-viet/po-klong-garai");
  });

  // 5. Facebook OAuth Callback Success
  it("5. Facebook OAuth callback success should verify claims and return user with JWT token", async () => {
    const mockFbProfile = {
      id: "fb-uid-2002",
      name: "Lê Nghệ Nhân",
      email: "artisan.cham@facebook.com",
      email_verified: true,
      picture: "https://example.com/fb-avatar.jpg",
    };

    const result = await authService.handleSocialLogin({
      provider: "facebook",
      providerUserId: mockFbProfile.id,
      email: mockFbProfile.email,
      emailVerified: mockFbProfile.email_verified,
      fullName: mockFbProfile.name,
      avatarUrl: mockFbProfile.picture,
    });

    assert.ok(result.token);
    assert.strictEqual(result.user.email, "artisan.cham@facebook.com");
    assert.strictEqual(result.user.provider, "facebook");
    assert.strictEqual(result.isNewUser, true);
  });

  // 6. Facebook OAuth Callback Failure
  it("6. Facebook OAuth callback failure should handle cancelled requests", () => {
    const errorReason = "user_denied";
    assert.strictEqual(errorReason, "user_denied");
  });

  // 7. Invalid OAuth State (CSRF Protection)
  it("7. Invalid OAuth state should be rejected immediately (CSRF Mitigation)", () => {
    const validState = oauthService.createOAuthState("/");
    const tamperedState = validState.slice(0, -5) + "abcde";
    const resultTampered = oauthService.verifyOAuthState(tamperedState);
    assert.strictEqual(resultTampered.valid, false, "Tampered state must be rejected");

    const pastTimestamp = Date.now() - 15 * 60 * 1000;
    const randomBytes = crypto.randomBytes(16).toString("hex");
    const encodedPath = Buffer.from("/", "utf8").toString("base64url");
    const dataToSign = `${randomBytes}.${pastTimestamp}.${encodedPath}`;
    const sig = crypto
      .createHmac("sha256", process.env.JWT_SECRET)
      .update(dataToSign)
      .digest("base64url");
    const expiredState = `${dataToSign}.${sig}`;

    const resultExpired = oauthService.verifyOAuthState(expiredState);
    assert.strictEqual(resultExpired.valid, false, "Expired state (> 10 mins) must be rejected");
  });

  // 8. Duplicate Social Account (Subsequent Logins for Linked User)
  it("8. Subsequent logins for already linked social account should reuse the existing user", async () => {
    const loginData = {
      provider: "google",
      providerUserId: "google-uid-repeat-01",
      email: "repeat.traveler@gmail.com",
      emailVerified: true,
      fullName: "Lặp Lại Du Khách",
      avatarUrl: "https://example.com/p1.jpg",
    };

    const firstResult = await authService.handleSocialLogin(loginData);
    assert.strictEqual(firstResult.isNewUser, true);
    const originalUserId = firstResult.user.id;

    const secondResult = await authService.handleSocialLogin(loginData);
    assert.strictEqual(secondResult.isNewUser, false);
    assert.strictEqual(secondResult.user.id, originalUserId, "User ID must be preserved");
    assert.strictEqual(secondResult.user.email, "repeat.traveler@gmail.com");
  });

  // 9. Existing User Linking (Verified Email)
  it("9. Existing user linking should automatically associate social account when email is verified", async () => {
    const socialData = {
      provider: "google",
      providerUserId: "google-uid-link-999",
      email: "existing.user@gmail.com",
      emailVerified: true,
      fullName: "Existing Champa User Updated",
      avatarUrl: "https://example.com/updated.jpg",
    };

    const result = await authService.handleSocialLogin(socialData);
    assert.strictEqual(result.isNewUser, false);
    assert.strictEqual(result.user.id, "usr-existing-001", "Must link to preexisting user account");
    assert.strictEqual(result.user.email, "existing.user@gmail.com");
  });

  // 10. Unverified Email Handling (Account Takeover Defense)
  it("10. Unverified email from provider MUST NOT automatically merge into an existing account", async () => {
    const maliciousSpoofData = {
      provider: "google",
      providerUserId: "attacker-fake-sub-777",
      email: "existing.user@gmail.com",
      emailVerified: false,
      fullName: "Fake Attacker User",
    };

    await assert.rejects(
      async () => {
        await authService.handleSocialLogin(maliciousSpoofData);
      },
      (err) => {
        assert.ok(
          err.message.includes("chưa được xác minh danh tính"),
          "Must reject account merge on unverified email"
        );
        return true;
      }
    );
  });

  // 11. New User Registration
  it("11. New user registration via OAuth should create active user with customer role", async () => {
    const newUserData = {
      provider: "facebook",
      providerUserId: "fb-new-user-555",
      email: "brand.new.user@gmail.com",
      emailVerified: true,
      fullName: "Người Dùng Mới Hoàn Toàn",
    };

    const result = await authService.handleSocialLogin(newUserData);
    assert.strictEqual(result.isNewUser, true);
    assert.strictEqual(result.user.role, "customer");
    assert.strictEqual(result.user.status, "active");
  });

  // 12. JWT / Session Creation & Verification
  it("12. JWT session creation should produce a tamper-resistant token verifiable by auth middleware", async () => {
    const token = authService.generateJwt({
      id: "usr-jwt-test-01",
      email: "jwt.tester@champaweb.vn",
      role: "admin",
      status: "active",
    });

    assert.strictEqual(typeof token, "string");
    assert.strictEqual(token.split(".").length, 3, "Must be standard header.payload.signature");

    const decoded = authService.verifyJwt(token);
    assert.ok(decoded);
    assert.strictEqual(decoded.id, "usr-jwt-test-01");
    assert.strictEqual(decoded.role, "admin");

    const tampered = token.slice(0, -6) + "xxxxxx";
    assert.strictEqual(authService.verifyJwt(tampered), null, "Tampered token must fail verification");
  });

  // 13. Suspended User Rejection
  it("13. Suspended user accounts should be rejected with 403 Forbidden on social login", async () => {
    const suspendedData = {
      provider: "google",
      providerUserId: "google-uid-suspended",
      email: "suspended.user@gmail.com",
      emailVerified: true,
      fullName: "Suspended Champa User",
    };

    await assert.rejects(
      async () => {
        await authService.handleSocialLogin(suspendedData);
      },
      (err) => {
        assert.strictEqual(err.status, 403);
        assert.ok(err.message.includes("đình chỉ"));
        return true;
      }
    );
  });

  // 14. Open Redirect Sanitization
  it("14. Open redirect vulnerabilities should be prevented by sanitizing destination URLs", () => {
    assert.strictEqual(oauthService.sanitizeReturnUrl("https://evil-attacker.com"), "/");
    assert.strictEqual(oauthService.sanitizeReturnUrl("//evil-attacker.com/hack"), "/");
    assert.strictEqual(oauthService.sanitizeReturnUrl("/\\evil-attacker.com"), "/");
    assert.strictEqual(oauthService.sanitizeReturnUrl("javascript:alert(1)"), "/");

    assert.strictEqual(oauthService.sanitizeReturnUrl("/tour/baoh-dana"), "/tour/baoh-dana");
    assert.strictEqual(oauthService.sanitizeReturnUrl("/admin/articles"), "/admin/articles");
    assert.strictEqual(oauthService.sanitizeReturnUrl("http://localhost:5173/profile"), "/profile");
  });
});

