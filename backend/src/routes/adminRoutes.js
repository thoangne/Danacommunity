const express = require("express");
const adminController = require("../controllers/adminController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/requireRole");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Tất cả các tuyến đường /api/admin đều yêu cầu đăng nhập trước
router.use(authenticateUser);

// 1. Dashboard Metrics (Admin & Editor)
router.get("/dashboard", requireRole(["admin", "editor"]), adminController.getDashboard);

// 2. Articles & News Management
router.get("/articles", requireRole(["admin", "editor"]), adminController.getArticles);
router.get("/articles/:id", requireRole(["admin", "editor"]), adminController.getArticleById);
router.post("/articles", requireRole(["admin", "editor"]), adminController.createArticle);
router.put("/articles/:id", requireRole(["admin", "editor"]), adminController.updateArticle);
router.patch("/articles/:id/publish", requireRole(["admin", "editor"]), adminController.toggleArticlePublish);
router.delete("/articles/:id", requireRole(["admin"]), adminController.deleteArticle);

// 3. User Management (Chỉ Admin / Super Admin)
router.get("/users", requireRole(["admin"]), adminController.getUsers);
router.put("/users/:id", requireRole(["admin"]), adminController.updateUser);

// 4. Media Management
router.get("/media", requireRole(["admin", "editor"]), adminController.getMediaFiles);
router.post("/media/upload", requireRole(["admin", "editor"]), upload.single("file"), adminController.uploadMedia);
router.delete("/media/:id", requireRole(["admin"]), adminController.deleteMediaFile);

// 5. Categories & Tags Management
router.get("/categories", requireRole(["admin", "editor"]), adminController.getCategories);
router.post("/categories", requireRole(["admin", "editor"]), adminController.createCategory);
router.put("/categories/:id", requireRole(["admin", "editor"]), adminController.updateCategory);
router.delete("/categories/:id", requireRole(["admin"]), adminController.deleteCategory);

router.get("/tags", requireRole(["admin", "editor"]), adminController.getTags);
router.post("/tags", requireRole(["admin", "editor"]), adminController.createTag);
router.put("/tags/:id", requireRole(["admin", "editor"]), adminController.updateTag);
router.delete("/tags/:id", requireRole(["admin"]), adminController.deleteTag);

// 6. Site Settings (Chỉ Admin)
router.get("/settings", requireRole(["admin"]), adminController.getSettings);
router.put("/settings", requireRole(["admin"]), adminController.updateSettings);

// 7. Activity Logs (Chỉ Admin)
router.get("/activity-logs", requireRole(["admin"]), adminController.getActivityLogs);

// 8. Artisans Management (Nghệ nhân Chăm - Admin & Editor tạo/sửa, Admin xóa)
router.get("/artisans", requireRole(["admin", "editor"]), adminController.getArtisans);
router.get("/artisans/:id", requireRole(["admin", "editor"]), adminController.getArtisanById);
router.post("/artisans", requireRole(["admin", "editor"]), adminController.createArtisan);
router.put("/artisans/:id", requireRole(["admin", "editor"]), adminController.updateArtisan);
router.delete("/artisans/:id", requireRole(["admin"]), adminController.deleteArtisan);

// 9. Craft Products Management (Tác phẩm làng nghề - Admin & Editor tạo/sửa, Admin xóa)
router.get("/products", requireRole(["admin", "editor"]), adminController.getProducts);
router.get("/products/:id", requireRole(["admin", "editor"]), adminController.getProductById);
router.post("/products", requireRole(["admin", "editor"]), adminController.createProduct);
router.put("/products/:id", requireRole(["admin", "editor"]), adminController.updateProduct);
router.delete("/products/:id", requireRole(["admin"]), adminController.deleteProduct);

// 10. Craft Categories
router.get("/craft-categories", requireRole(["admin", "editor"]), adminController.getCraftCategories);

module.exports = router;

