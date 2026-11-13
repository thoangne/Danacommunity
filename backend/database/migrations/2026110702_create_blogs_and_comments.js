/**
 * Knex Migration: 2026110702_create_blogs_and_comments.js
 * Quản lý phiên bản bảng bài viết khảo cứu và bình luận
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // 1. Bảng blog_categories
  await knex.schema.createTable("blog_categories", (table) => {
    table.string("id", 50).primary().notNullable();
    table.string("label", 100).notNullable();
    table.text("description").nullable();
    table.string("main_category", 30).notNullable();
    table.integer("display_order").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // 2. Bảng blog_articles
  await knex.schema.createTable("blog_articles", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("slug", 200).notNullable().unique().index();
    table.string("title", 255).notNullable();
    table.string("main_category", 30).notNullable().index();
    table.string("category_id", 50).references("id").inTable("blog_categories").onDelete("SET NULL");
    table.string("badge", 50).defaultTo("Khảo cứu");
    table.string("badge_class", 100).defaultTo("bg-amber-100 text-amber-800");
    table.string("field_location", 150).nullable();
    table.string("read_time", 30).defaultTo("5 phút đọc");
    table.uuid("author_id").references("id").inTable("profiles").onDelete("SET NULL");
    table.string("author_name", 100).defaultTo("Ban Nghiên cứu Di sản Dana");
    table.text("author_avatar").nullable();
    table.text("summary").nullable();
    table.text("content").notNullable();
    table.text("featured_image").nullable();
    table.specificType("gallery_images", "text[]").defaultTo("{}");
    table.boolean("is_featured").defaultTo(false);
    table.boolean("is_published").defaultTo(true).index();
    table.integer("views_count").defaultTo(0);
    table.integer("likes_count").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // 3. Bảng blog_comments
  await knex.schema.createTable("blog_comments", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("article_id").notNullable().references("id").inTable("blog_articles").onDelete("CASCADE").index();
    table.uuid("user_id").references("id").inTable("profiles").onDelete("SET NULL");
    table.uuid("parent_id").references("id").inTable("blog_comments").onDelete("CASCADE");
    table.string("author_name", 100).notNullable();
    table.string("author_email", 255).nullable();
    table.text("author_avatar").nullable();
    table.text("content").notNullable();
    table.string("status", 20).defaultTo("approved");
    table.integer("likes_count").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("blog_comments");
  await knex.schema.dropTableIfExists("blog_articles");
  await knex.schema.dropTableIfExists("blog_categories");
};

