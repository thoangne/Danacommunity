const express = require("express");
const bannerController = require("../controllers/bannerController");

const router = express.Router();

// Tuyến đường công khai cho trang chủ
router.get("/", bannerController.getActiveBanners);

module.exports = router;
