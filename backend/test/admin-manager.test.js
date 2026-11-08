/**
 * Automated Test Suite for Manager / CMS Admin Module
 * Tests Security, RBAC, Role Hierarchy, Data Integrity, and Storage Service
 */

const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_super_secret_jwt_key_for_testing_1234567890";
process.env.FRONTEND_URL = "http://localhost:5173";
process.env.BACKEND_URL = "http://localhost:5000";

const authService = require("../src/services/authService");
const adminService = require("../src/services/adminService");
const storageService = require("../src/services/storageService");
const { requireRole } = require("../src/middlewares/requireRole");
const { requireAdmin } = require("../src/middlewares/requireAdmin");

describe("Manager & CMS Admin Security and Business Logic Test Suite", () => {
  beforeEach(() => {
    // Reset mock in-memory stores
    authService.mockUsers.clear();
    authService.mockUsers.set("admin@champaweb.vn", {
      id: "usr-admin-001",
      email: "admin@champaweb.vn",
      fullName: "Quản Trị Viên Di Sản",
      role: "admin",
      status: "active",
      emailVerified: true,
      createdAt: new Date().toISOString(),
    });

    authService.mockUsers.set("editor@champaweb.vn", {
      id: "usr-editor-001",
      email: "editor@champaweb.vn",
      fullName: "Biên Tập Viên Di Sản",
      role: "editor",
      status: "active",
      emailVerified: true,
      createdAt: new Date().toISOString(),
    });

    authService.mockUsers.set("customer@champaweb.vn", {
      id: "usr-customer-001",
      email: "customer@champaweb.vn",
      fullName: "Khách Du Lịch",
      role: "customer",
      status: "active",
      emailVerified: true,
      createdAt: new Date().toISOString(),
    });
  });

  // =========================================================================
  // 1. AUTHENTICATION & TOKEN VERIFICATION (NO BYPASS)
  // =========================================================================
  it("1. Should reject arbitrary tokens containing 'usr-admin-001' as substring (No Auth Bypass)", async () => {
    const maliciousTokens = [
      "usr-admin-001",
      "Bearer usr-admin-001",
      "random-prefix-usr-admin-001-suffix",
      "eyJhbGciOi.usr-admin-001.fake",
    ];

    for (const token of maliciousTokens) {
      const user = await authService.verifyToken(token);
      assert.strictEqual(
        user,
        null,
        `Token "${token}" must not authenticate as admin`
      );
    }
  });

  it("2. Should successfully verify genuine cryptographically signed JWT tokens", async () => {
    const validJwt = authService.generateJwt({
      id: "usr-admin-001",
      email: "admin@champaweb.vn",
      role: "admin",
      status: "active",
    });

    const user = await authService.verifyToken(validJwt);
    assert.ok(user, "Valid JWT must be accepted");
    assert.strictEqual(user.id, "usr-admin-001");
    assert.strictEqual(user.role, "admin");
    assert.strictEqual(user.email, "admin@champaweb.vn");
  });

  // =========================================================================
  // 2. RBAC & PERMISSION ENFORCEMENT
  // =========================================================================
  it("3. requireRole middleware should reject unauthenticated requests with 401", () => {
    const middleware = requireRole(["admin", "editor"]);
    let statusCode = null;
    let jsonResponse = null;

    const req = { user: null };
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            jsonResponse = data;
          },
        };
      },
    };
    let nextCalled = false;

    middleware(req, res, () => {
      nextCalled = true;
    });

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(statusCode, 401);
    assert.strictEqual(jsonResponse?.success, false);
    assert.strictEqual(jsonResponse?.errorCode, "UNAUTHORIZED");
  });

  it("4. requireRole middleware should reject customer role with 403 on admin routes", () => {
    const middleware = requireRole(["admin", "editor"]);
    let statusCode = null;
    let jsonResponse = null;

    const req = { user: { id: "u1", role: "customer", email: "cust@gmail.com" } };
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            jsonResponse = data;
          },
        };
      },
    };
    let nextCalled = false;

    middleware(req, res, () => {
      nextCalled = true;
    });

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(statusCode, 403);
    assert.strictEqual(jsonResponse?.errorCode, "FORBIDDEN_INSUFFICIENT_PERMISSIONS");
  });

  it("5. requireRole middleware should allow editor role on editor routes", () => {
    const middleware = requireRole(["admin", "editor"]);
    const req = { user: { id: "u2", role: "editor", email: "editor@champaweb.vn" } };
    let nextCalled = false;

    middleware(req, {}, () => {
      nextCalled = true;
    });

    assert.strictEqual(nextCalled, true, "Editor must be granted access");
  });

  it("6. requireRole middleware must NOT grant admin access to customer even if email is admin@champaweb.vn", () => {
    const middleware = requireRole(["admin"]);
    let statusCode = null;

    const req = { user: { id: "u3", role: "customer", email: "admin@champaweb.vn" } };
    const res = {
      status: (code) => {
        statusCode = code;
        return { json: () => {} };
      },
    };
    let nextCalled = false;

    middleware(req, res, () => {
      nextCalled = true;
    });

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(statusCode, 403, "Hardcoded email bypass must be rejected when role is customer");
  });

  it("7. requireAdmin middleware should allow super_admin and admin roles", () => {
    let adminPassed = false;
    let superAdminPassed = false;

    requireAdmin({ user: { id: "a1", role: "admin" } }, {}, () => {
      adminPassed = true;
    });

    requireAdmin({ user: { id: "sa1", role: "super_admin" } }, {}, () => {
      superAdminPassed = true;
    });

    assert.strictEqual(adminPassed, true, "Admin role must pass requireAdmin");
    assert.strictEqual(superAdminPassed, true, "Super admin role must pass requireAdmin");
  });

  // =========================================================================
  // 3. ADMIN SERVICE & BUSINESS LOGIC
  // =========================================================================
  it("8. adminService.createArticle should validate empty title", async () => {
    await assert.rejects(
      async () => {
        await adminService.createArticle({ title: "   " }, { id: "usr-admin-001" });
      },
      { message: "Tiêu đề bài viết không được để trống!" }
    );
  });

  it("9. adminService._slugify should create clean, url-safe slugs", () => {
    const slug1 = adminService._slugify("Kỹ thuật nung gốm Bàu Trúc: Ngọn lửa 800 năm");
    assert.strictEqual(slug1, "ky-thuat-nung-gom-bau-truc-ngon-lua-800-nam");

    const slug2 = adminService._slugify("Đền tháp Po Klong Garai & Đồi Trầu @ Ninh Thuận!");
    assert.strictEqual(slug2, "den-thap-po-klong-garai-doi-trau-ninh-thuan");
  });

  it("10. adminService.getDashboardMetrics should return complete dashboard structure", async () => {
    const metrics = await adminService.getDashboardMetrics();
    assert.ok(metrics, "Dashboard metrics must be returned");
    assert.ok(metrics.articles, "Articles metric must exist");
    assert.ok(metrics.news, "News metric must exist");
    assert.ok(metrics.users, "Users metric must exist");
    assert.ok(metrics.media, "Media metric must exist");
  });

  // =========================================================================
  // 4. STORAGE SERVICE (SECURE UPLOAD & DELETION)
  // =========================================================================
  it("11. storageService.saveFile should generate URL and persist metadata", async () => {
    const mockFile = {
      originalname: "test-heritage-tower.jpg",
      mimetype: "image/jpeg",
      size: 102400,
      buffer: Buffer.from("fake-image-bytes-data"),
    };

    const saved = await storageService.saveFile(mockFile);
    assert.ok(saved.url, "Must return file url");
    assert.strictEqual(saved.mimeType, "image/jpeg");
    assert.ok(saved.filename.includes("test-heritage-tower"));
  });

  it("12. storageService.deleteFile should handle null or empty URL safely", async () => {
    await assert.doesNotReject(async () => {
      await storageService.deleteFile(null);
      await storageService.deleteFile("");
    });
  });
});
