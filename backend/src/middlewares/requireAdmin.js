const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      errorCode: "UNAUTHORIZED",
      message: "Yêu cầu đăng nhập trước khi tiếp tục.",
    });
  }

  if (req.user.role !== "admin" && req.user.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      errorCode: "FORBIDDEN_ADMIN_ONLY",
      message: "Quyền truy cập bị từ chối: Chỉ tài khoản Quản trị viên (Admin) mới có quyền tạo, sửa hoặc xóa bài viết.",
    });
  }

  next();
};

module.exports = {
  requireAdmin,
};

