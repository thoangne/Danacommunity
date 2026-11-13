require("dotenv").config();
const { validateEnv, PORT, NODE_ENV } = require("./src/config/env");
const { testConnection, closeConnection } = require("./src/config/db");
const { runDatabaseMigrations } = require("./src/config/migrationRunner");
const app = require("./app");

async function startServer() {
  try {
    // 1. Kiểm tra tính hợp lệ của biến môi trường (Fail fast nếu thiếu trong Production)
    validateEnv();

    // 2. Kiểm tra kết nối PostgreSQL khi khởi động
    console.log(`⏳ Đang kiểm tra kết nối PostgreSQL cho môi trường [${NODE_ENV}]...`);
    const dbStatus = await testConnection();

    if (dbStatus.connected) {
      console.log(`✅ Kết nối PostgreSQL thành công! Cơ sở dữ liệu: "${dbStatus.database}" lúc ${dbStatus.timestamp}`);
      // Tự động kiểm tra và chạy migration với cơ chế Distributed Lock chống race-condition
      await runDatabaseMigrations();
    } else {
      if (NODE_ENV === "production") {
        console.error(`❌ [FATAL] Không thể kết nối cơ sở dữ liệu Production: ${dbStatus.error}`);
        process.exit(1);
      } else {
        console.warn(`⚠️ [WARNING] Chưa thể kết nối PostgreSQL local: ${dbStatus.error}`);
        console.warn(`ℹ️ Chạy lệnh "npm run db:up" hoặc "docker compose up -d postgres" để khởi chạy PostgreSQL.`);
      }
    }

    // 3. Khởi chạy HTTP server
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Dana Champa Server đang chạy tại cổng ${PORT} [${NODE_ENV}]`);
      console.log(`📡 API Endpoints sẵn sàng tại /api (Health check: http://localhost:${PORT}/api/health)`);
    });

    // 4. Cơ chế Graceful Shutdown an toàn
    const handleShutdown = async (signal) => {
      console.log(`\n🛑 Nhận tín hiệu ${signal}. Bắt đầu quy trình tắt server an toàn...`);

      server.close(async () => {
        console.log("🔒 HTTP Server đã ngừng tiếp nhận yêu cầu mới.");
        try {
          await closeConnection();
          console.log("🔒 Đã giải phóng toàn bộ PostgreSQL connection pool an toàn.");
        } catch (poolErr) {
          console.error("⚠️ Lỗi khi giải phóng connection pool:", poolErr.message);
        }
        process.exit(0);
      });

      // Buộc dừng nếu timeout vượt quá 10 giây
      setTimeout(() => {
        console.error("⚠️ Quá thời gian chờ shutdown an toàn (10s), buộc dừng tiến trình.");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => handleShutdown("SIGTERM"));
    process.on("SIGINT", () => handleShutdown("SIGINT"));

  } catch (error) {
    console.error("❌ Lỗi nghiêm trọng khi khởi động server:", error.message);
    process.exit(1);
  }
}

startServer();
