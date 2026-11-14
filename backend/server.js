require("dotenv").config();
const { validateEnv, PORT, NODE_ENV } = require("./src/config/env");
const { testConnection, closeConnection } = require("./src/config/db");
const { runDatabaseMigrations } = require("./src/config/migrationRunner");
const app = require("./app");

async function startServer() {
  let server;

  try {
    // 1. KHỞI CHẠY HTTP SERVER NGAY LẬP TỨC
    // Cloud Run yêu cầu container phải bind vào cổng PORT (mặc định 8080) tức thì
    // để vượt qua bước dò cổng khởi động (startup probe / port detection).
    server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Dana Champa Server đang lắng nghe tại 0.0.0.0:${PORT} [${NODE_ENV}]`);
      console.log(`📡 API Endpoints sẵn sàng tại /api (Health check: http://localhost:${PORT}/api/health)`);
    });
  } catch (listenErr) {
    console.error(`❌ [FATAL] Không thể lắng nghe trên cổng ${PORT}:`, listenErr.message);
    process.exit(1);
  }

  // 2. Cơ chế Graceful Shutdown an toàn
  const handleShutdown = async (signal) => {
    console.log(`\n🛑 Nhận tín hiệu ${signal}. Bắt đầu quy trình tắt server an toàn...`);
    if (server) {
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
    } else {
      process.exit(0);
    }

    setTimeout(() => {
      console.error("⚠️ Quá thời gian chờ shutdown an toàn (10s), buộc dừng tiến trình.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
  process.on("SIGINT", () => handleShutdown("SIGINT"));

  // 3. Kiểm tra tính hợp lệ của biến môi trường
  try {
    validateEnv();
  } catch (envErr) {
    console.error("⚠️ [CONFIG VALIDATION ERROR]:", envErr.message);
  }

  // 4. Kiểm tra kết nối cơ sở dữ liệu và tự động chạy migration
  try {
    console.log(`⏳ Đang kiểm tra kết nối PostgreSQL cho môi trường [${NODE_ENV}]...`);
    const dbStatus = await testConnection();

    if (dbStatus.connected) {
      console.log(`✅ Kết nối PostgreSQL thành công! Cơ sở dữ liệu: "${dbStatus.database}" lúc ${dbStatus.timestamp}`);
      // Tự động kiểm tra và chạy migration với cơ chế Distributed Lock chống race-condition
      await runDatabaseMigrations();
    } else {
      console.error(`❌ [DATABASE ERROR] Chưa thể kết nối cơ sở dữ liệu: ${dbStatus.error}`);
      if (NODE_ENV === "production") {
        console.warn("⚠️ Server vẫn tiếp tục hoạt động phục vụ Frontend và Health Check, nhưng các API truy vấn Database sẽ thông báo lỗi.");
      }
    }
  } catch (dbErr) {
    console.error("❌ [DATABASE EXCEPTION] Lỗi khi kết nối hoặc chạy migration:", dbErr.message);
  }
}

startServer();
