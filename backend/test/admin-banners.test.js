/**
 * Automated Test Suite for Hero Banners & Carousel Management Module
 * Tests CRUD operations, validations, status toggles, batch reordering, RBAC, and public API
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_super_secret_jwt_key_for_testing_1234567890";
process.env.FRONTEND_URL = "http://localhost:5173";
process.env.BACKEND_URL = "http://localhost:5000";

const adminService = require("../src/services/adminService");
const { requireRole } = require("../src/middlewares/requireRole");

describe("Hero Banners & Carousel Management Test Suite", () => {
  const mockAdminActor = {
    id: "usr-admin-001",
    email: "admin@champaweb.vn",
    fullName: "Quản Trị Viên Di Sản",
    role: "admin",
  };

  const mockEditorActor = {
    id: "usr-editor-001",
    email: "editor@champaweb.vn",
    fullName: "Biên Tập Viên Di Sản",
    role: "editor",
  };

  const mockCustomerActor = {
    id: "usr-customer-001",
    email: "khach@gmail.com",
    fullName: "Nguyễn Du Khách",
    role: "customer",
  };

  // =========================================================================
  // 1. DATA RETRIEVAL & FILTERING
  // =========================================================================
  it("1. getBanners should return default hero banners with pagination", async () => {
    const result = await adminService.getBanners({ page: 1, limit: 10 });
    assert.ok(result, "Result must exist");
    assert.ok(Array.isArray(result.banners), "Banners must be an array");
    assert.ok(result.total >= 5, "Must have at least 5 default seed banners");
    assert.strictEqual(result.page, 1);
  });

  it("2. getBanners should filter by search keyword", async () => {
    const result = await adminService.getBanners({ search: "Po Klong Garai" });
    assert.ok(result.banners.length >= 1, "Must find Po Klong Garai slide");
    assert.ok(
      result.banners[0].title.toLowerCase().includes("po klong garai"),
      "Title must match search term"
    );
  });

  it("3. getActiveBanners should only return active banners sorted by display_order", async () => {
    const activeList = await adminService.getActiveBanners("home_hero");
    assert.ok(Array.isArray(activeList), "Active list must be array");
    assert.ok(activeList.length >= 5, "Must have active slides");

    for (let i = 0; i < activeList.length; i++) {
      assert.strictEqual(activeList[i].is_active, true, "Every slide must be active");
      if (i > 0) {
        assert.ok(
          activeList[i].display_order >= activeList[i - 1].display_order,
          "Slides must be ordered by display_order ascending"
        );
      }
    }
  });

  // =========================================================================
  // 2. VALIDATION & CREATION
  // =========================================================================
  it("4. createBanner should reject empty title, category or image_url", async () => {
    await assert.rejects(
      async () => {
        await adminService.createBanner(
          { title: "", category: "Kiến trúc", image_url: "https://example.com/img.jpg" },
          mockAdminActor
        );
      },
      { message: "Tiêu đề slide không được để trống." }
    );

    await assert.rejects(
      async () => {
        await adminService.createBanner(
          { title: "Tháp Chăm", category: "", image_url: "https://example.com/img.jpg" },
          mockAdminActor
        );
      },
      { message: "Phân loại slide không được để trống." }
    );

    await assert.rejects(
      async () => {
        await adminService.createBanner(
          { title: "Tháp Chăm", category: "Kiến trúc", image_url: "" },
          mockAdminActor
        );
      },
      { message: "Hình ảnh slide không được để trống." }
    );
  });

  let createdBannerId = null;

  it("5. createBanner should successfully create a new slide with auto order", async () => {
    const newSlide = await adminService.createBanner(
      {
        title: "Lễ Hội Katê Rực Rỡ Trên Đỉnh Đồi Trầu",
        subtitle: "Ngày hội văn hóa tâm linh lớn nhất năm của đồng bào Chăm",
        category: "Lễ Hội Truyền Thống",
        image_url: "/images/dana-life/IMG_9901.JPG",
        location: "Đồi Trầu, Ninh Thuận",
        date_display: "Tháng 7 Lịch Chăm (Tháng 10 Dương lịch)",
        description: "Âm vang Saranai hòa cùng nhịp trống Ginăng trong điệu múa Apsara tôn kính.",
        author: "Nhiếp ảnh Di sản",
        link_url: "/bai-viet",
        is_active: true,
      },
      mockEditorActor
    );

    assert.ok(newSlide, "New slide must be created");
    assert.ok(newSlide.id, "New slide must have an id");
    assert.strictEqual(newSlide.title, "Lễ Hội Katê Rực Rỡ Trên Đỉnh Đồi Trầu");
    assert.strictEqual(newSlide.category, "Lễ Hội Truyền Thống");
    assert.strictEqual(newSlide.is_active, true);
    assert.ok(newSlide.display_order >= 6, "Display order should be at least 6");

    createdBannerId = newSlide.id;
  });

  // =========================================================================
  // 3. RETRIEVAL & UPDATE
  // =========================================================================
  it("6. getBannerById should return the created banner", async () => {
    assert.ok(createdBannerId, "Must have createdBannerId");
    const banner = await adminService.getBannerById(createdBannerId);
    assert.ok(banner, "Banner must be retrieved");
    assert.strictEqual(banner.title, "Lễ Hội Katê Rực Rỡ Trên Đỉnh Đồi Trầu");
  });

  it("7. updateBanner should modify slide fields correctly", async () => {
    const updated = await adminService.updateBanner(
      createdBannerId,
      {
        title: "Đại Lễ Hội Katê Linh Thiêng 2026",
        location: "Tháp Po Klong Garai, Đô Vinh",
      },
      mockAdminActor
    );

    assert.strictEqual(updated.title, "Đại Lễ Hội Katê Linh Thiêng 2026");
    assert.strictEqual(updated.location, "Tháp Po Klong Garai, Đô Vinh");
    assert.strictEqual(updated.category, "Lễ Hội Truyền Thống", "Unchanged fields must be preserved");
  });

  // =========================================================================
  // 4. STATUS TOGGLE & BATCH REORDER
  // =========================================================================
  it("8. toggleBannerStatus should toggle active state", async () => {
    const before = await adminService.getBannerById(createdBannerId);
    assert.strictEqual(before.is_active, true);

    const toggledOff = await adminService.toggleBannerStatus(createdBannerId, mockAdminActor);
    assert.strictEqual(toggledOff.is_active, false, "Must toggle to false");

    const toggledOn = await adminService.toggleBannerStatus(createdBannerId, mockAdminActor);
    assert.strictEqual(toggledOn.is_active, true, "Must toggle back to true");
  });

  it("9. reorderBanners should update display orders in batch", async () => {
    const reorderPayload = [
      { id: createdBannerId, display_order: 1 },
      { id: 1, display_order: 2 },
    ];

    const res = await adminService.reorderBanners(reorderPayload, mockAdminActor);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.count, 2);

    const slide1 = await adminService.getBannerById(createdBannerId);
    assert.strictEqual(slide1.display_order, 1);
  });

  // =========================================================================
  // 5. DELETION
  // =========================================================================
  it("10. deleteBanner should remove the slide", async () => {
    const delRes = await adminService.deleteBanner(createdBannerId, mockAdminActor);
    assert.strictEqual(delRes.id, createdBannerId);

    const check = await adminService.getBannerById(createdBannerId);
    assert.strictEqual(check, null, "Deleted slide must not exist");
  });

  // =========================================================================
  // 6. RBAC PERMISSIONS VERIFICATION
  // =========================================================================
  it("11. requireRole middleware should reject customer role on banner routes", async () => {
    const req = { user: mockCustomerActor };
    let statusSent = null;
    let jsonSent = null;
    const res = {
      status(s) {
        statusSent = s;
        return this;
      },
      json(j) {
        jsonSent = j;
        return this;
      },
    };
    let nextCalled = false;

    const middleware = requireRole(["admin", "editor"]);
    middleware(req, res, () => {
      nextCalled = true;
    });

    assert.strictEqual(nextCalled, false, "next() must not be called for customer");
    assert.strictEqual(statusSent, 403, "Must return 403 Forbidden");
    assert.strictEqual(jsonSent.success, false);
  });

  it("12. requireRole middleware should allow editor role on banner routes", async () => {
    const req = { user: mockEditorActor };
    let nextCalled = false;

    const middleware = requireRole(["admin", "editor"]);
    middleware(req, {}, () => {
      nextCalled = true;
    });

    assert.strictEqual(nextCalled, true, "next() must be called for editor");
  });
});
