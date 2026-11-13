/**
 * Knex Migration: 2026110706_create_admin_cms_tables.js
 * Quản lý phiên bản bảng CMS Quản trị: Media, Tags, Cài đặt Hệ thống và Nhật ký Hoạt động (Activity Logs)
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // 1. Mở rộng bảng profiles nếu chưa có cột status
  const hasStatusInProfiles = await knex.schema.hasColumn("profiles", "status");
  if (!hasStatusInProfiles) {
    await knex.schema.alterTable("profiles", (table) => {
      table.string("status", 20).defaultTo("active").index();
    });
  }

  // 2. Mở rộng bảng blog_articles các trường SEO, scheduling và tags
  const hasSeoTitle = await knex.schema.hasColumn("blog_articles", "seo_title");
  if (!hasSeoTitle) {
    await knex.schema.alterTable("blog_articles", (table) => {
      table.string("seo_title", 255).nullable();
      table.text("seo_description").nullable();
      table.timestamp("scheduled_at").nullable();
      table.specificType("tags", "text[]").defaultTo("{}");
      table.string("status", 20).defaultTo("published").index();
    });
  }

  // 3. Bảng media_files (Kho tài nguyên Media CMS)
  const hasMediaFiles = await knex.schema.hasTable("media_files");
  if (!hasMediaFiles) {
    await knex.schema.createTable("media_files", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.string("filename", 255).notNullable();
      table.string("original_name", 255).notNullable();
      table.string("mime_type", 100).notNullable();
      table.bigInteger("size").notNullable();
      table.string("dimensions", 50).nullable();
      table.text("url").notNullable();
      table.uuid("uploader_id").references("id").inTable("profiles").onDelete("SET NULL");
      table.timestamp("created_at").defaultTo(knex.fn.now()).index();
    });
  }

  // 4. Bảng tags (Thẻ bài viết & tin tức)
  const hasTags = await knex.schema.hasTable("tags");
  if (!hasTags) {
    await knex.schema.createTable("tags", (table) => {
      table.increments("id").primary();
      table.string("name", 100).notNullable().unique();
      table.string("slug", 100).notNullable().unique().index();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }

  // 5. Bảng article_tags (Bảng liên kết Nhiều - Nhiều)
  const hasArticleTags = await knex.schema.hasTable("article_tags");
  if (!hasArticleTags) {
    await knex.schema.createTable("article_tags", (table) => {
      table.uuid("article_id").references("id").inTable("blog_articles").onDelete("CASCADE");
      table.integer("tag_id").references("id").inTable("tags").onDelete("CASCADE");
      table.primary(["article_id", "tag_id"]);
    });
  }

  // 6. Bảng site_settings (Cài đặt hệ thống & SEO toàn trang)
  const hasSettings = await knex.schema.hasTable("site_settings");
  if (!hasSettings) {
    await knex.schema.createTable("site_settings", (table) => {
      table.string("key", 100).primary().notNullable();
      table.jsonb("value").notNullable().defaultTo("{}");
      table.text("description").nullable();
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.uuid("updated_by").references("id").inTable("profiles").onDelete("SET NULL");
    });

    // Thêm các cài đặt mặc định ban đầu
    await knex("site_settings").insert([
      {
        key: "site_info",
        value: JSON.stringify({
          siteName: "ChampaWeb • Dana Community",
          tagline: "Bảo tồn & phát huy giá trị di sản văn hóa Champa",
          description: "Cổng thông tin chuyên sâu về khảo cứu lịch sử, kiến trúc đền tháp Kalan, làng nghề gốm cổ Bàu Trúc, dệt thổ cẩm Mỹ Nghiệp và du lịch di sản cộng đồng Chăm.",
          contactEmail: "admin@danacommunity.vn",
          contactPhone: "0976 029 004",
          address: "Thôn Chất Thường, Xã Phước Hậu, Huyện Ninh Phước, Tỉnh Ninh Thuận",
        }),
        description: "Thông tin cơ bản website và liên hệ thực tế",
      },
      {
        key: "seo_defaults",
        value: JSON.stringify({
          metaTitle: "ChampaWeb | Di sản & Văn hóa Champa",
          metaDescription: "Khám phá chiều sâu văn hóa Champa qua khảo cứu lịch sử, đền tháp Kalan và du lịch di sản cộng đồng.",
          ogImage: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80",
          keywords: "Champa, Panduranga, Tháp Chàm, Gốm Bàu Trúc, Dệt Mỹ Nghiệp, Baoh Dana, Po Klong Garai",
        }),
        description: "Cấu hình SEO mặc định toàn trang",
      },
      {
        key: "social_links",
        value: JSON.stringify({
          facebook: "https://facebook.com/champaheritage",
          youtube: "https://youtube.com/@champaheritage",
          zalo: "https://zalo.me/champaweb",
          instagram: "https://instagram.com/champaheritage",
        }),
        description: "Kênh mạng xã hội chính thức",
      },
    ]);
  }

  // 7. Bảng activity_logs (Nhật ký kiểm toán hoạt động Quản trị viên)
  const hasActivityLogs = await knex.schema.hasTable("activity_logs");
  if (!hasActivityLogs) {
    await knex.schema.createTable("activity_logs", (table) => {
      table.bigIncrements("id").primary();
      table.uuid("actor_id").references("id").inTable("profiles").onDelete("SET NULL");
      table.string("actor_name", 150).notNullable();
      table.string("actor_email", 255).notNullable();
      table.string("action", 100).notNullable().index();
      table.string("target_type", 50).notNullable().index();
      table.string("target_id", 100).nullable();
      table.string("target_title", 255).nullable();
      table.jsonb("details").defaultTo("{}");
      table.string("ip_address", 45).nullable();
      table.timestamp("created_at").defaultTo(knex.fn.now()).index();
    });

    // Seed log ban đầu
    await knex("activity_logs").insert({
      actor_name: "Hệ Thống",
      actor_email: "system@champaweb.vn",
      action: "SYSTEM_INIT",
      target_type: "system",
      target_id: "cms-core",
      target_title: "Khởi tạo hệ thống Admin CMS",
      details: JSON.stringify({ note: "Khởi tạo thành công schema CMS bảng media, tags, settings, logs." }),
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("activity_logs");
  await knex.schema.dropTableIfExists("site_settings");
  await knex.schema.dropTableIfExists("article_tags");
  await knex.schema.dropTableIfExists("tags");
  await knex.schema.dropTableIfExists("media_files");

  const hasSeoTitle = await knex.schema.hasColumn("blog_articles", "seo_title");
  if (hasSeoTitle) {
    await knex.schema.alterTable("blog_articles", (table) => {
      table.dropColumns("seo_title", "seo_description", "scheduled_at", "tags", "status");
    });
  }

  const hasStatusInProfiles = await knex.schema.hasColumn("profiles", "status");
  if (hasStatusInProfiles) {
    await knex.schema.alterTable("profiles", (table) => {
      table.dropColumn("status");
    });
  }
};

