const path = require("path");
const db = require("./db");
const { NODE_ENV } = require("./env");

// Mã định danh phân tán cho khóa migration trong PostgreSQL (32-bit Integer)
const MIGRATION_LOCK_KEY = 74291847;

/**
 * Hàm sleep hỗ trợ polling chờ khóa
 * @param {number} ms 
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Tự động chạy Knex migrations với cơ chế chống trùng lặp phân tán (Distributed Concurrency Lock)
 * Sử dụng PostgreSQL Advisory Lock cấp Session, an toàn tuyệt đối khi Cloud Run scale
 * nhiều container cùng lúc hoặc rolling update phiên bản mới.
 */
async function runDatabaseMigrations() {
  const migrationsDirectory = path.join(__dirname, "../../database/migrations");
  const knexConfig = {
    directory: migrationsDirectory,
    tableName: "knex_migrations",
  };

  console.log("🔒 [MIGRATION] Đang kiểm tra khóa phân tán (PostgreSQL Advisory Lock)...");

  let acquired = false;
  const maxWaitMs = 60000; // Chờ tối đa 60 giây nếu có container khác đang chạy migration
  const pollIntervalMs = 2000;
  const startTime = Date.now();

  try {
    // 1. Cơ chế chờ & giành khóa phân tán (Advisory Lock)
    while (!acquired && Date.now() - startTime < maxWaitMs) {
      const lockRes = await db.raw(
        "SELECT pg_try_advisory_lock(?) AS acquired",
        [MIGRATION_LOCK_KEY]
      );
      const isLocked = lockRes.rows
        ? lockRes.rows[0].acquired
        : Array.isArray(lockRes)
          ? lockRes[0].acquired
          : lockRes.acquired;

      if (isLocked) {
        acquired = true;
        break;
      }

      console.log(
        "⏳ [MIGRATION] Một container khác đang thực thi migration. Đang đợi hoàn tất..."
      );
      await sleep(pollIntervalMs);
    }

    if (!acquired) {
      console.warn(
        "⚠️ [MIGRATION] Đã quá thời gian chờ khóa migration (60s). Bỏ qua bước migration để tránh block tiến trình khởi động."
      );
      return;
    }

    console.log("🎯 [MIGRATION] Đã giữ khóa phân tán độc quyền. Kiểm tra migration tồn đọng...");

    // 2. Xử lý stale lock từ knex_migrations_lock nếu container trước đó bị tắt đột ngột
    try {
      const hasLockTable = await db.schema.hasTable("knex_migrations_lock");
      if (hasLockTable) {
        const lockRow = await db("knex_migrations_lock").first();
        if (lockRow && lockRow.is_locked) {
          console.warn("⚠️ [MIGRATION] Phát hiện stale lock trong knex_migrations_lock. Đang giải phóng an toàn...");
          await db.migrate.forceFreeMigrationsLock(knexConfig);
        }
      }
    } catch (lockCheckErr) {
      // Bỏ qua nếu bảng lock chưa được Knex khởi tạo
    }

    // 3. Thực thi migration
    const [batchNo, log] = await db.migrate.latest(knexConfig);

    if (!log || log.length === 0) {
      console.log("✨ [MIGRATION] Cơ sở dữ liệu đã ở phiên bản mới nhất (không có migration mới).");
    } else {
      console.log(`🎉 [MIGRATION] Áp dụng thành công ${log.length} migration mới (Batch #${batchNo}):`);
      log.forEach((file) => console.log(`   - ${file}`));
    }
  } catch (error) {
    console.error("❌ [MIGRATION ERROR] Lỗi nghiêm trọng khi thực thi migration:", error.message);
    if (NODE_ENV === "production") {
      throw error;
    }
  } finally {
    // 4. Giải phóng khóa phân tán an toàn
    if (acquired) {
      try {
        await db.raw("SELECT pg_advisory_unlock(?)", [MIGRATION_LOCK_KEY]);
        console.log("🔓 [MIGRATION] Đã giải phóng khóa phân tán an toàn.");
      } catch (unlockErr) {
        console.error("⚠️ [MIGRATION] Lỗi khi giải phóng advisory lock:", unlockErr.message);
      }
    }
  }
}

module.exports = {
  runDatabaseMigrations,
  MIGRATION_LOCK_KEY,
};

