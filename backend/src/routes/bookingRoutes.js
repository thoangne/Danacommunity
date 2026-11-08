const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { validateBooking } = require("../middlewares/validateRequest");
const { authenticateOptional } = require("../middlewares/authMiddleware");

router.post("/", authenticateOptional, validateBooking, bookingController.createBooking);
router.get("/:code", authenticateOptional, bookingController.getBooking);
router.post("/inquiry", bookingController.createInquiry);

module.exports = router;
