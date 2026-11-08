const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const routes = require("./src/routes");
const errorHandler = require("./src/middlewares/errorHandler");
const { FRONTEND_URL } = require("./src/config/env");

const app = express();

// Middlewares toàn cục: Cấu hình CORS an toàn hỗ trợ credentials
const allowedOrigins = [
  FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Truy cập bị từ chối bởi chính sách CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ tài nguyên tĩnh Media uploads với các tiêu chuẩn an ninh
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; sandbox");
    next();
  },
  express.static(uploadsPath)
);

// Định tuyến API chính
app.use("/api", routes);

// Phục vụ Frontend tĩnh nếu có (Dành cho Production / Cloud Run / Single Container)
const clientDistPath = path.join(__dirname, "public_client");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  
  // SPA fallback tương thích hoàn toàn với Express 5
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(clientDistPath, "index.html"));
    }
    next();
  });
}

// Bắt lỗi toàn cục
app.use(errorHandler);

module.exports = app;
