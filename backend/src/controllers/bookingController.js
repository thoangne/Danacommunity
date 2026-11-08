const bookingService = require("../services/bookingService");

exports.createBooking = async (req, res, next) => {
  try {
    const customerId = req.user?.id || null;
    const result = await bookingService.createTourBooking(req.body, customerId);
    return res.status(201).json({
      success: true,
      message: "Đặt tour thành công!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const { code } = req.params;
    const customerPhone = req.query.phone || req.headers["x-customer-phone"] || "";
    const booking = await bookingService.getBookingByCode(code, {
      customerPhone,
      currentUser: req.user || null,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn đặt tour hoặc thông tin xác thực số điện thoại không khớp.",
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

exports.createInquiry = async (req, res, next) => {
  try {
    const inquiry = await bookingService.createTripInquiry(req.body);
    return res.status(201).json({
      success: true,
      message: "Tiếp nhận yêu cầu tư vấn thành công!",
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};
