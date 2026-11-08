const authService = require("../services/authService");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Yêu cầu quyền truy cập: vui lòng đăng nhập trước khi tiếp tục.",
      });
    }

    const token = authHeader.split(" ")[1];
    const user = await authService.verifyToken(token);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const authenticateOptional = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const user = await authService.verifyToken(token);
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch {
    next();
  }
};

module.exports = {
  authenticateUser,
  authenticateOptional,
};

