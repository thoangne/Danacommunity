/**
 * Automated Test Suite for Admin Products & Artisans Management Module
 * Tests CRUD operations, validations, slug generation, relations, and activity logging
 */

const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_super_secret_jwt_key_for_testing_1234567890";
process.env.FRONTEND_URL = "http://localhost:5173";
process.env.BACKEND_URL = "http://localhost:5000";

const adminService = require("../src/services/adminService");

describe("Admin Products & Artisans Management Test Suite", () => {
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

  // =========================================================================
  // 1. ARTISANS CRUD & VALIDATION
  // =========================================================================
  it("1. getArtisans should return paginated artisans with default dataset", async () => {
    const result = await adminService.getArtisans({ page: 1, limit: 10 });
    assert.ok(result, "Result must exist");
    assert.ok(Array.isArray(result.artisans), "Artisans must be an array");
    assert.ok(result.total >= 4, "Should have at least 4 default artisans");
    assert.strictEqual(result.page, 1);
  });

  it("2. getArtisans should filter artisans by village", async () => {
    const result = await adminService.getArtisans({ village: "Bàu Trúc" });
    assert.ok(result.artisans.length >= 1, "Must find artisans in Bàu Trúc");
    for (const a of result.artisans) {
      assert.ok(
        a.village.toLowerCase().includes("bàu trúc"),
        `Artisan ${a.name} must belong to Bàu Trúc`
      );
    }
  });

  it("3. createArtisan should validate empty name or village", async () => {
    await assert.rejects(
      async () => {
        await adminService.createArtisan({ name: "", village: "Bàu Trúc" }, mockAdminActor);
      },
      { message: "Họ tên nghệ nhân không được để trống!" }
    );

    await assert.rejects(
      async () => {
        await adminService.createArtisan({ name: "Nguyễn Văn Chăm", village: "" }, mockAdminActor);
      },
      { message: "Làng nghề không được để trống!" }
    );
  });

  it("4. createArtisan should successfully create artisan and generate slug", async () => {
    const newArtisan = await adminService.createArtisan(
      {
        name: "Trương Thị Hạnh",
        title: "Nghệ nhân Dệt Chăm Trẻ",
        village: "Làng dệt Mỹ Nghiệp",
        specialty: "Phục dựng hoa văn cổ Champa",
        years_of_dedication: 15,
        quote: "Nghề dệt là nhịp thở của làng.",
        bio: "Nghệ nhân kế thừa thế hệ thứ 4 gìn giữ khung cửi.",
      },
      mockAdminActor
    );

    assert.ok(newArtisan, "Created artisan must exist");
    assert.strictEqual(newArtisan.name, "Trương Thị Hạnh");
    assert.strictEqual(newArtisan.slug, "truong-thi-hanh");
    assert.strictEqual(newArtisan.village, "Làng dệt Mỹ Nghiệp");
    assert.strictEqual(newArtisan.years_of_dedication, 15);
  });

  it("5. updateArtisan should update fields and validate existence", async () => {
    const updated = await adminService.updateArtisan(
      1,
      {
        experience: "Hơn 60 năm giữ lửa tinh hoa gốm mẹ",
        years_of_dedication: 60,
      },
      mockEditorActor
    );

    assert.ok(updated, "Must return updated artisan");
    assert.strictEqual(updated.years_of_dedication, 60);

    await assert.rejects(
      async () => {
        await adminService.updateArtisan(99999, { name: "Non-existent" }, mockAdminActor);
      },
      { message: "Không tìm thấy nghệ nhân để cập nhật!" }
    );
  });

  it("6. getArtisanById should return artisan details with products", async () => {
    const artisan = await adminService.getArtisanById(1);
    assert.ok(artisan, "Artisan 1 must exist");
    assert.strictEqual(artisan.name, "Muk Đàng Thị Phan");
    assert.ok(Array.isArray(artisan.products), "Must include linked products array");
  });

  // =========================================================================
  // 2. CRAFT PRODUCTS CRUD & VALIDATION
  // =========================================================================
  it("7. getProducts should return paginated products with category and artisan labels", async () => {
    const result = await adminService.getProducts({ page: 1, limit: 10 });
    assert.ok(result, "Result must exist");
    assert.ok(Array.isArray(result.products), "Products must be an array");
    assert.ok(result.total >= 2, "Should have default products");
  });

  it("8. getProducts should filter products by category", async () => {
    const result = await adminService.getProducts({ category: "gom-bau-truc" });
    assert.ok(result.products.length >= 1, "Must find pottery products");
    for (const p of result.products) {
      assert.strictEqual(p.category_id, "gom-bau-truc");
    }
  });

  it("9. createProduct should validate required fields", async () => {
    await assert.rejects(
      async () => {
        await adminService.createProduct({ name: "" }, mockAdminActor);
      },
      { message: "Tên tác phẩm không được để trống!" }
    );

    await assert.rejects(
      async () => {
        await adminService.createProduct({ name: "Bình gốm mới" }, mockAdminActor);
      },
      { message: "Chuyên mục làng nghề không được để trống!" }
    );
  });

  it("10. createProduct should successfully create product with materials and price", async () => {
    const created = await adminService.createProduct(
      {
        name: "Lọ Hoa Gốm Điêu Khắc Mẫu Hệ",
        category_id: "gom-bau-truc",
        village: "Làng gốm Bàu Trúc",
        artisan_id: 1,
        raw_price: 950000,
        materials: ["Đất sét sông Quao", "Vỏ trấu nung lộ thiên"],
        badge: "Độc bản",
        badge_type: "exclusive",
        is_featured: true,
        stock_quantity: 4,
      },
      mockAdminActor
    );

    assert.ok(created, "Created product must exist");
    assert.strictEqual(created.name, "Lọ Hoa Gốm Điêu Khắc Mẫu Hệ");
    assert.strictEqual(created.slug, "lo-hoa-gom-dieu-khac-mau-he");
    assert.strictEqual(created.raw_price, 950000);
    assert.strictEqual(created.is_featured, true);
    assert.ok(created.id.startsWith("sp-"));
  });

  it("11. updateProduct should update attributes and reflect in getProductById", async () => {
    const updated = await adminService.updateProduct(
      "sp-01",
      {
        stock_quantity: 8,
        price_estimate: "1.950.000 ₫",
      },
      mockEditorActor
    );

    assert.ok(updated);
    assert.strictEqual(updated.stock_quantity, 8);
    assert.strictEqual(updated.price_estimate, "1.950.000 ₫");

    const fetched = await adminService.getProductById("sp-01");
    assert.strictEqual(fetched.stock_quantity, 8);
  });

  it("12. deleteProduct should remove product safely", async () => {
    const tempProduct = await adminService.createProduct(
      {
        name: "Sản phẩm thử nghiệm xóa",
        category_id: "tho-cam-my-nghiep",
        village: "Làng dệt Mỹ Nghiệp",
      },
      mockAdminActor
    );

    const deleteRes = await adminService.deleteProduct(tempProduct.id, mockAdminActor);
    assert.strictEqual(deleteRes.success, true);

    const check = await adminService.getProductById(tempProduct.id);
    assert.strictEqual(check, null);
  });

  // =========================================================================
  // 3. CRAFT CATEGORIES
  // =========================================================================
  it("13. getCraftCategories should return categories with counts", async () => {
    const categories = await adminService.getCraftCategories();
    assert.ok(Array.isArray(categories));
    assert.ok(categories.length >= 4);
    const gomCat = categories.find((c) => c.id === "gom-bau-truc");
    assert.ok(gomCat, "Gốm Bàu Trúc category must exist");
    assert.strictEqual(gomCat.label, "Gốm Bàu Trúc");
  });
});
