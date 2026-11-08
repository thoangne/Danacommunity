/**
 * Middleware: requireRole.js
 * Kiểm tra phân quyền truy cập theo vai trò người dùng (RBAC)
 * Hỗ trợ các vai trò: 'super_admin', 'admin', 'editor', 'artisan', 'guide', 'customer'
 */
const requireRole = (allowedRoles = []) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        errorCode: "UNAUTHORIZED",
        message: "Yêu cầu đăng nhập trước khi tiếp tục.",
      });
    }

    const userRole = req.user.role || "customer";
    const userEmail = req.user.email || "";

    // Super Admin hoặc Admin luôn có toàn quyền trong hệ thống
    const isSuperOrAdmin = userRole === "admin" || userRole === "super_admin";

    if (isSuperOrAdmin || roles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      errorCode: "FORBIDDEN_INSUFFICIENT_PERMISSIONS",
      message: `Quyền truy cập bị từ chối: Tài khoản của bạn (${userRole}) không có quyền thực hiện thao tác này. Yêu cầu vai trò: [${roles.join(", ")}].`,
    });
  };
};

module.exports = {
  requireRole,
};

