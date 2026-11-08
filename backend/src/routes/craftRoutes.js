const express = require("express");
const adminService = require("../services/adminService");

const router = express.Router();

// 1. Tác phẩm làng nghề công khai
router.get("/products", async (req, res, next) => {
  try {
    const { search, category, village, artisanId, isFeatured, page, limit } = req.query;
    const result = await adminService.getProducts({
      search: search || "",
      category: category || "all",
      village: village || "all",
      artisanId: artisanId || "all",
      isFeatured: isFeatured !== undefined ? isFeatured : "all",
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
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
  } catch (err) {
    next(err);
  }
});

router.get("/products/:id", async (req, res, next) => {
  try {
    const product = await adminService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Không tìm thấy tác phẩm." });
    }
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
});

// 2. Nghệ nhân Chăm công khai
router.get("/artisans", async (req, res, next) => {
  try {
    const { search, village, page, limit } = req.query;
    const result = await adminService.getArtisans({
      search: search || "",
      village: village || "all",
      isActive: true,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
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
  } catch (err) {
    next(err);
  }
});

router.get("/artisans/:id", async (req, res, next) => {
  try {
    const artisan = await adminService.getArtisanById(req.params.id);
    if (!artisan) {
      return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ nghệ nhân." });
    }
    res.status(200).json({ success: true, data: artisan });
  } catch (err) {
    next(err);
  }
});

// 3. Danh mục làng nghề
router.get("/categories", async (req, res, next) => {
  try {
    const categories = await adminService.getCraftCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
