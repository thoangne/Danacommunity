/**
 * Knex Migration: 2026110801_create_oauth_accounts.js
 * Quản lý liên kết tài khoản mạng xã hội OAuth (Google, Facebook) và xác minh email
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // 1. Thêm cột email_verified vào bảng profiles nếu chưa tồn tại
  const hasEmailVerified = await knex.schema.hasColumn("profiles", "email_verified");
  if (!hasEmailVerified) {
    await knex.schema.alterTable("profiles", (table) => {
      table.boolean("email_verified").defaultTo(false).index();
    });
  }

  // 2. Tạo bảng oauth_accounts lưu trữ các liên kết mạng xã hội
  const hasOAuthAccounts = await knex.schema.hasTable("oauth_accounts");
  if (!hasOAuthAccounts) {
    await knex.schema.createTable("oauth_accounts", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table
        .uuid("user_id")
        .notNullable()
        .references("id")
        .inTable("profiles")
        .onDelete("CASCADE");
      table.string("provider", 50).notNullable(); // 'google' | 'facebook'
      table.string("provider_user_id", 255).notNullable();
      table.string("provider_email", 255).nullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());

      // Ràng buộc duy nhất: Mỗi tài khoản provider_user_id chỉ liên kết 1 lần với 1 provider
      table.unique(["provider", "provider_user_id"], {
        indexName: "uq_oauth_accounts_provider_uid",
      });

      // Chỉ mục tăng tốc truy vấn tìm kiếm
      table.index(["user_id"], "idx_oauth_accounts_user_id");
      table.index(["provider", "provider_user_id"], "idx_oauth_accounts_provider_uid");
    });

    // 3. Thiết lập Row Level Security (RLS) tương thích với Supabase PostgreSQL
    try {
      await knex.raw(`
        ALTER TABLE public.oauth_accounts ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Users can view their own oauth accounts" ON public.oauth_accounts;
        CREATE POLICY "Users can view their own oauth accounts"
          ON public.oauth_accounts FOR SELECT
          USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Service role full access on oauth accounts" ON public.oauth_accounts;
        CREATE POLICY "Service role full access on oauth accounts"
          ON public.oauth_accounts FOR ALL
          USING (true)
          WITH CHECK (true);
      `);
    } catch (err) {
      console.warn("⚠️ Bỏ qua cấu hình RLS trên oauth_accounts (do môi trường local DB không có auth.uid()):", err.message);
    }
  }
};

/**
 * Reversible Rollback Migration
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // 1. Xóa policies và bảng oauth_accounts
  try {
    await knex.raw(`
      DROP POLICY IF EXISTS "Users can view their own oauth accounts" ON public.oauth_accounts;
      DROP POLICY IF EXISTS "Service role full access on oauth accounts" ON public.oauth_accounts;
    `);
  } catch {
    // Ignore error if RLS policies did not exist
  }

  await knex.schema.dropTableIfExists("oauth_accounts");

  // 2. Xóa cột email_verified nếu tồn tại
  const hasEmailVerified = await knex.schema.hasColumn("profiles", "email_verified");
  if (hasEmailVerified) {
    await knex.schema.alterTable("profiles", (table) => {
      table.dropColumn("email_verified");
    });
  }
};

