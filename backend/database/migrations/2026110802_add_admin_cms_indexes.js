/**
 * Knex Migration: 2026110802_add_admin_cms_indexes.js
 * Bổ sung chỉ mục (Index) cho các khóa ngoại trong phân hệ CMS Quản trị để tối ưu hóa hiệu năng truy vấn
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // 1. Chỉ mục cho blog_articles.category_id
  const hasArticlesTable = await knex.schema.hasTable("blog_articles");
  if (hasArticlesTable) {
    await knex.schema.alterTable("blog_articles", (table) => {
      table.index(["category_id"], "idx_blog_articles_category_id");
    });
  }

  // 2. Chỉ mục cho article_tags.tag_id
  const hasArticleTagsTable = await knex.schema.hasTable("article_tags");
  if (hasArticleTagsTable) {
    await knex.schema.alterTable("article_tags", (table) => {
      table.index(["tag_id"], "idx_article_tags_tag_id");
    });
  }

  // 3. Chỉ mục cho media_files.uploader_id
  const hasMediaFilesTable = await knex.schema.hasTable("media_files");
  if (hasMediaFilesTable) {
    await knex.schema.alterTable("media_files", (table) => {
      table.index(["uploader_id"], "idx_media_files_uploader_id");
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const hasArticlesTable = await knex.schema.hasTable("blog_articles");
  if (hasArticlesTable) {
    await knex.schema.alterTable("blog_articles", (table) => {
      table.dropIndex(["category_id"], "idx_blog_articles_category_id");
    });
  }

  const hasArticleTagsTable = await knex.schema.hasTable("article_tags");
  if (hasArticleTagsTable) {
    await knex.schema.alterTable("article_tags", (table) => {
      table.dropIndex(["tag_id"], "idx_article_tags_tag_id");
    });
  }

  const hasMediaFilesTable = await knex.schema.hasTable("media_files");
  if (hasMediaFilesTable) {
    await knex.schema.alterTable("media_files", (table) => {
      table.dropIndex(["uploader_id"], "idx_media_files_uploader_id");
    });
  }
};
