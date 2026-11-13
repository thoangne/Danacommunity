const { db } = require("../config/db");

class ActivityLogService {
  constructor() {
    this.memoryLogs = [];
  }

  /**
   * Ghi lại một hoạt động kiểm toán vào hệ thống
   */
  async logActivity({
    actor,
    action,
    targetType,
    targetId = null,
    targetTitle = null,
    details = {},
    ipAddress = null,
  }) {
    const actorId = actor?.id && actor.id.startsWith("usr-") ? null : actor?.id || null;
    const actorName = actor?.fullName || actor?.email || "Quản trị viên";
    const actorEmail = actor?.email || "admin@danacommunity.vn";

    const logEntry = {
      actor_id: actorId,
      actor_name: actorName,
      actor_email: actorEmail,
      action,
      target_type: targetType,
      target_id: String(targetId || ""),
      target_title: targetTitle || "",
      details: typeof details === "object" ? JSON.stringify(details) : details,
      ip_address: ipAddress || null,
      created_at: new Date(),
    };

    try {
      if (db) {
        await db("activity_logs").insert(logEntry);
        return;
      }
    } catch (err) {
      console.warn("⚠️ [ActivityLog] Không thể ghi vào PostgreSQL, lưu vào in-memory log:", err.message);
    }

    this.memoryLogs.unshift({
      id: Date.now(),
      ...logEntry,
      created_at: new Date().toISOString(),
    });

    if (this.memoryLogs.length > 500) {
      this.memoryLogs.pop();
    }
  }

  /**
   * Lấy danh sách nhật ký hoạt động có phân trang và bộ lọc
   */
  async getLogs({ page = 1, limit = 20, action = "all", targetType = "all", search = "" } = {}) {
    try {
      if (db) {
        let query = db("activity_logs").select("*");

        if (action && action !== "all") {
          query = query.where("action", action);
        }
        if (targetType && targetType !== "all") {
          query = query.where("target_type", targetType);
        }
        if (search && search.trim()) {
          const q = `%${search.trim()}%`;
          query = query.where(function () {
            this.where("actor_name", "ilike", q)
              .orWhere("actor_email", "ilike", q)
              .orWhere("target_title", "ilike", q)
              .orWhere("action", "ilike", q);
          });
        }

        const countResult = await query.clone().clearSelect().count("id as count").first();
        const total = parseInt(countResult?.count || "0", 10);

        const logs = await query
          .orderBy("created_at", "desc")
          .limit(limit)
          .offset((page - 1) * limit);

        return {
          logs,
          total,
          page,
          limit,
        };
      }
    } catch (err) {
      console.warn("⚠️ [ActivityLog] Lỗi đọc từ PostgreSQL, chuyển sang in-memory fallback:", err.message);
    }

    // In-memory fallback
    let list = [...this.memoryLogs];
    if (action && action !== "all") {
      list = list.filter((l) => l.action === action);
    }
    if (targetType && targetType !== "all") {
      list = list.filter((l) => l.target_type === targetType);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (l) =>
          l.actor_name.toLowerCase().includes(q) ||
          l.actor_email.toLowerCase().includes(q) ||
          (l.target_title && l.target_title.toLowerCase().includes(q))
      );
    }

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      logs: paginated,
      total,
      page,
      limit,
    };
  }
}

module.exports = new ActivityLogService();
