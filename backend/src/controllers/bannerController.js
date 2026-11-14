const adminService = require("../services/adminService");

class BannerController {
  /**
   * GET /api/banners
   * Lấy danh sách các slide banner đang kích hoạt (is_active = true) cho trang chủ
   */
  async getActiveBanners(req, res, next) {
    try {
      const { position = "home_hero" } = req.query;
      const banners = await adminService.getActiveBanners(position);
      res.status(200).json({
        success: true,
        message: "Lấy danh sách banner trình chiếu thành công",
        data: banners,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BannerController();
