const adminService = require("../services/adminService");
const activityLogService = require("../services/activityLogService");
const storageService = require("../services/storageService");

class AdminController {
  // 1. Dashboard
  async getDashboard(req, res, next) {
    try {
      const data = await adminService.getDashboardMetrics();
      res.status(200).json({
        success: true,
        message: "Lấy dữ liệu thống kê tổng quan thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // 2. Articles & News
  async getArticles(req, res, next) {
    try {
      const { mainCategory, category, status, search, page, limit } = req.query;
      const result = await adminService.getArticles({
        mainCategory: mainCategory || "all",
        category: category || "all",
        status: status || "all",
        search: search || "",
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 15,
      });

      res.status(200).json({
        success: true,
        data: result.articles,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getArticleById(req, res, next) {
    try {
      const { id } = req.params;
      const article = await adminService.getArticleById(id);
      if (!article) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy bài viết.",
        });
      }

      res.status(200).json({
        success: true,
        data: article,
      });
    } catch (error) {
      next(error);
    }
  }

  async createArticle(req, res, next) {
    try {
      const postData = req.body;
      const actor = req.user;
      const created = await adminService.createArticle(postData, actor);

      res.status(201).json({
        success: true,
        message:
          created.status === "published"
            ? "Đăng bài viết mới thành công!"
            : "Lưu bản nháp thành công!",
        data: created,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateArticle(req, res, next) {
    try {
      const { id } = req.params;
      const postData = req.body;
      const actor = req.user;
      const updated = await adminService.updateArticle(id, postData, actor);

      res.status(200).json({
        success: true,
        message: "Cập nhật bài viết thành công!",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteArticle(req, res, next) {
    try {
      const { id } = req.params;
      const actor = req.user;
      const result = await adminService.deleteArticle(id, actor);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async toggleArticlePublish(req, res, next) {
    try {
      const { id } = req.params;
      const { isPublished } = req.body;
      const actor = req.user;
      const updated = await adminService.toggleArticlePublish(id, Boolean(isPublished), actor);

      res.status(200).json({
        success: true,
        message: isPublished ? "Đã xuất bản bài viết!" : "Đã chuyển bài viết về bản nháp!",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  // 3. User Management
  async getUsers(req, res, next) {
    try {
      const { search, role, status, page, limit } = req.query;
      const result = await adminService.getUsers({
        search: search || "",
        role: role || "all",
        status: status || "all",
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 15,
      });

      res.status(200).json({
        success: true,
        data: result.users,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const actor = req.user;
      const updated = await adminService.updateUser(id, updateData, actor);

      res.status(200).json({
        success: true,
        message: "Cập nhật thông tin người dùng thành công!",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  // 4. Media Management
  async getMediaFiles(req, res, next) {
    try {
      const { search, mimeType, page, limit } = req.query;
      const result = await adminService.getMediaFiles({
        search: search || "",
        mimeType: mimeType || "all",
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 24,
      });

      res.status(200).json({
        success: true,
        data: result.files,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadMedia(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng chọn tệp hình ảnh để tải lên!",
        });
      }

      const actor = req.user;
      const uploadedInfo = await storageService.saveFile(req.file);

      const saved = await adminService.saveMediaFile(
        {
          filename: uploadedInfo.filename,
          originalName: uploadedInfo.originalName,
          mimeType: uploadedInfo.mimeType,
          size: uploadedInfo.size,
          dimensions: null,
          url: uploadedInfo.url,
        },
        actor
      );

      res.status(201).json({
        success: true,
        message: "Tải ảnh lên thành công!",
        data: saved,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMediaFile(req, res, next) {
    try {
      const { id } = req.params;
      const actor = req.user;
      const result = await adminService.deleteMediaFile(id, actor);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // 5. Categories & Tags
  async getCategories(req, res, next) {
    try {
      const categories = await adminService.getCategories();
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const data = req.body;
      const actor = req.user;
      const created = await adminService.createCategory(data, actor);

      res.status(201).json({
        success: true,
        message: "Tạo chuyên mục mới thành công!",
        data: created,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const actor = req.user;
      const updated = await adminService.updateCategory(id, data, actor);

      res.status(200).json({
        success: true,
        message: "Cập nhật chuyên mục thành công!",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      const actor = req.user;
      const result = await adminService.deleteCategory(id, actor);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getTags(req, res, next) {
    try {
      const tags = await adminService.getTags();
      res.status(200).json({
        success: true,
        data: tags,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTag(req, res, next) {
    try {
      const data = req.body;
      const actor = req.user;
      const created = await adminService.createTag(data, actor);

      res.status(201).json({
        success: true,
        message: "Tạo thẻ mới thành công!",
        data: created,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTag(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const actor = req.user;
      const updated = await adminService.updateTag(id, data, actor);

      res.status(200).json({
        success: true,
        message: "Cập nhật thẻ thành công!",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTag(req, res, next) {
    try {
      const { id } = req.params;
      const actor = req.user;
      const result = await adminService.deleteTag(id, actor);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // 6. Settings
  async getSettings(req, res, next) {
    try {
      const settings = await adminService.getSettings();
      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPublicSettings(req, res, next) {
    try {
      const settings = await adminService.getPublicSettings();
      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const { key, value } = req.body;
      if (!key) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp khóa cài đặt (key)!",
        });
      }
      const actor = req.user;
      const result = await adminService.updateSettings(key, value, actor);

      res.status(200).json({
        success: true,
        message: "Cập nhật cài đặt thành công!",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // 7. Activity Logs
  async getActivityLogs(req, res, next) {
    try {
      const { page, limit, action, targetType, search } = req.query;
      const result = await activityLogService.getLogs({
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 20,
        action: action || "all",
        targetType: targetType || "all",
        search: search || "",
      });

      res.status(200).json({
        success: true,
        data: result.logs,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================================
  // 8. ARTISANS MANAGEMENT (HỒ SƠ NGHỆ NHÂN CHĂM)
  // =========================================================================
  async getArtisans(req, res, next) {
    try {
      const { search, village, isActive, page, limit } = req.query;
      const result = await adminService.getArtisans({
        search: search || "",
        village: village || "all",
        isActive: isActive !== undefined ? isActive : "all",
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 15,
      });

      res.status(200).json({
        success: true,
        data: result.artisans,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getArtisanById(req, res, next) {
    try {
      const { id } = req.params;
      const artisan = await adminService.getArtisanById(id);
      if (!artisan) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy hồ sơ nghệ nhân.",
        });
      }

      res.status(200).json({
        success: true,
        data: artisan,
      });
    } catch (error) {
      next(error);
    }
  }

  async createArtisan(req, res, next) {
    try {
      const data = req.body;
      const actor = req.user;
      const created = await adminService.createArtisan(data, actor);

      res.status(201).json({
        success: true,
        message: "Tạo mới hồ sơ nghệ nhân thành công!",
        data: created,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateArtisan(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const actor = req.user;
      const updated = await adminService.updateArtisan(id, data, actor);

      res.status(200).json({
        success: true,
        message: "Cập nhật hồ sơ nghệ nhân thành công!",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteArtisan(req, res, next) {
    try {
      const { id } = req.params;
      const actor = req.user;
      const result = await adminService.deleteArtisan(id, actor);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // =========================================================================
  // 9. CRAFT PRODUCTS MANAGEMENT (TÁC PHẨM LÀNG NGHỀ)
  // =========================================================================
  async getProducts(req, res, next) {
    try {
      const { search, category, village, artisanId, isFeatured, page, limit } = req.query;
      const result = await adminService.getProducts({
        search: search || "",
        category: category || "all",
        village: village || "all",
        artisanId: artisanId || "all",
        isFeatured: isFeatured !== undefined ? isFeatured : "all",
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 12,
      });

      res.status(200).json({
        success: true,
        data: result.products,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await adminService.getProductById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy tác phẩm thủ công.",
        });
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const data = req.body;
      const actor = req.user;
      const created = await adminService.createProduct(data, actor);

      res.status(201).json({
        success: true,
        message: "Thêm mới tác phẩm làng nghề thành công!",
        data: created,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const actor = req.user;
      const updated = await adminService.updateProduct(id, data, actor);

      res.status(200).json({
        success: true,
        message: "Cập nhật tác phẩm làng nghề thành công!",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const actor = req.user;
      const result = await adminService.deleteProduct(id, actor);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // =========================================================================
  // 10. CRAFT CATEGORIES
  // =========================================================================
  async getCraftCategories(req, res, next) {
    try {
      const categories = await adminService.getCraftCategories();
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();

