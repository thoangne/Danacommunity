const fs = require("fs");
const path = require("path");
const { db } = require("../config/db");
const activityLogService = require("./activityLogService");
const storageService = require("./storageService");

class AdminService {
  // =========================================================================
  // 1. DASHBOARD METRICS (CONCURRENT FETCHING VIA PROMISE.ALL)
  // =========================================================================
  async getDashboardMetrics() {
    try {
      if (db) {
        const [
          articleCount,
          newsCount,
          userCount,
          mediaCount,
          recentContent,
          recentActivity,
          topViewed,
        ] = await Promise.all([
          // Tổng bài viết văn hóa / lịch sử
          db("blog_articles")
            .whereIn("main_category", ["van-hoa", "lich-su"])
            .select(
              db.raw("COUNT(*) as total"),
              db.raw("COUNT(CASE WHEN is_published = true THEN 1 END) as published"),
              db.raw("COUNT(CASE WHEN is_published = false OR status = 'draft' THEN 1 END) as draft"),
              db.raw("COALESCE(SUM(views_count), 0) as total_views")
            )
            .first(),

          // Tổng bài viết tin tức
          db("blog_articles")
            .where("main_category", "tin-tuc")
            .select(
              db.raw("COUNT(*) as total"),
              db.raw("COUNT(CASE WHEN is_published = true THEN 1 END) as published"),
              db.raw("COUNT(CASE WHEN is_published = false OR status = 'draft' THEN 1 END) as draft")
            )
            .first(),

          // Tổng người dùng
          db("profiles")
            .select(
              db.raw("COUNT(*) as total"),
              db.raw("COUNT(CASE WHEN role IN ('admin', 'super_admin') THEN 1 END) as admins"),
              db.raw("COUNT(CASE WHEN role = 'editor' THEN 1 END) as editors"),
              db.raw("COUNT(CASE WHEN status = 'active' OR status IS NULL THEN 1 END) as active")
            )
            .first(),

          // Tổng media
          db("media_files")
            .select(
              db.raw("COUNT(*) as total"),
              db.raw("COALESCE(SUM(size), 0) as total_size")
            )
            .first(),

          // Nội dung cập nhật gần đây
          db("blog_articles")
            .select("id", "title", "slug", "main_category", "is_published", "status", "views_count", "updated_at")
            .orderBy("updated_at", "desc")
            .limit(6),

          // Hoạt động gần đây
          db("activity_logs")
            .select("*")
            .orderBy("created_at", "desc")
            .limit(8),

          // Xu hướng xem theo thời gian (hoặc lượt xem bài viết top)
          db("blog_articles")
            .select("id", "title", "slug", "views_count", "main_category")
            .orderBy("views_count", "desc")
            .limit(5),
        ]);

        return {
          articles: {
            total: parseInt(articleCount?.total || "0", 10),
            published: parseInt(articleCount?.published || "0", 10),
            draft: parseInt(articleCount?.draft || "0", 10),
            totalViews: parseInt(articleCount?.total_views || "0", 10),
          },
          news: {
            total: parseInt(newsCount?.total || "0", 10),
            published: parseInt(newsCount?.published || "0", 10),
            draft: parseInt(newsCount?.draft || "0", 10),
          },
          users: {
            total: parseInt(userCount?.total || "0", 10),
            admins: parseInt(userCount?.admins || "0", 10),
            editors: parseInt(userCount?.editors || "0", 10),
            active: parseInt(userCount?.active || "0", 10),
          },
          media: {
            total: parseInt(mediaCount?.total || "0", 10),
            totalSize: parseInt(mediaCount?.total_size || "0", 10),
          },
          recentContent,
          recentActivity,
          topViewed,
        };
      }
    } catch (err) {
      console.warn("⚠️ [AdminService] Lỗi lấy metrics DB, dùng fallback in-memory:", err.message);
    }

    // In-memory fallback
    return {
      articles: { total: 12, published: 10, draft: 2, totalViews: 4750 },
      news: { total: 5, published: 4, draft: 1 },
      users: { total: 8, admins: 2, editors: 2, active: 8 },
      media: { total: 15, totalSize: 24500000 },
      recentContent: [],
      recentActivity: [],
      topViewed: [],
    };
  }

  // =========================================================================
  // 2. ARTICLE & NEWS MANAGEMENT
  // =========================================================================
  async getArticles({
    mainCategory = "all",
    category = "all",
    status = "all",
    search = "",
    page = 1,
    limit = 15,
  } = {}) {
    if (db) {
      let query = db("blog_articles as a")
        .leftJoin("blog_categories as c", "a.category_id", "c.id")
        .select(
          "a.id",
          "a.slug",
          "a.title",
          "a.main_category",
          "a.category_id",
          "c.label as category_label",
          "a.badge",
          "a.read_time",
          "a.author_id",
          "a.author_name",
          "a.featured_image",
          "a.is_published",
          "a.status",
          "a.views_count",
          "a.created_at",
          "a.updated_at",
          "a.scheduled_at",
          "a.seo_title",
          "a.seo_description"
        );

      if (mainCategory && mainCategory !== "all") {
        if (mainCategory === "articles") {
          query = query.whereIn("a.main_category", ["van-hoa", "lich-su"]);
        } else {
          query = query.where("a.main_category", mainCategory);
        }
      }

      if (category && category !== "all") {
        query = query.where("a.category_id", category);
      }

      if (status && status !== "all") {
        if (status === "published") {
          query = query.where("a.is_published", true);
        } else if (status === "draft") {
          query = query.where("a.is_published", false);
        } else if (status === "scheduled") {
          query = query.where("a.status", "scheduled");
        }
      }

      if (search && search.trim()) {
        const q = `%${search.trim()}%`;
        query = query.where(function () {
          this.where("a.title", "ilike", q)
            .orWhere("a.slug", "ilike", q)
            .orWhere("a.author_name", "ilike", q);
        });
      }

      const countResult = await query.clone().clearSelect().count("a.id as count").first();
      const total = parseInt(countResult?.count || "0", 10);

      const articles = await query
        .orderBy("a.updated_at", "desc")
        .limit(limit)
        .offset((page - 1) * limit);

      return {
        articles,
        total,
        page,
        limit,
      };
    }

    return { articles: [], total: 0, page, limit };
  }

  async getArticleById(id) {
    if (!db) return null;

    const article = await db("blog_articles").where("id", id).first();
    if (!article) return null;

    // Lấy tags liên kết
    const tags = await db("article_tags as at")
      .join("tags as t", "at.tag_id", "t.id")
      .where("at.article_id", id)
      .select("t.id", "t.name", "t.slug");

    return {
      ...article,
      tagsList: tags,
    };
  }

  async _syncArticleTags(trx, articleId, tagsArray) {
    if (!Array.isArray(tagsArray)) return;

    const cleanTags = tagsArray
      .filter((t) => typeof t === "string" && t.trim())
      .map((t) => ({ name: t.trim(), slug: this._slugify(t.trim()) }));

    await trx("article_tags").where("article_id", articleId).delete();

    for (const item of cleanTags) {
      let tag = await trx("tags").where("slug", item.slug).first();
      if (!tag) {
        const [newTag] = await trx("tags").insert({ name: item.name, slug: item.slug }).returning("*");
        tag = newTag;
      }
      if (tag) {
        await trx("article_tags").insert({ article_id: articleId, tag_id: tag.id }).onConflict().ignore();
      }
    }
  }

  async createArticle(data, actor) {
    if (!data.title || !data.title.trim()) {
      throw new Error("Tiêu đề bài viết không được để trống!");
    }

    const title = data.title.trim();
    const rawSlug = data.slug && data.slug.trim() ? data.slug : title;
    let slug = this._slugify(rawSlug);

    const isPublished = data.status === "published";
    const authorId = actor?.id && !actor.id.startsWith("usr-") ? actor.id : null;
    const authorName = data.authorName || actor?.fullName || "Ban Quản Trị Di Sản";

    const newRecord = {
      title,
      slug,
      summary: data.excerpt?.trim() || data.summary?.trim() || data.content?.slice(0, 160) || "",
      content: data.content || "",
      featured_image: data.coverImage || data.featured_image || null,
      main_category: data.mainCategory || data.main_category || "van-hoa",
      category_id: data.category_id || data.category || null,
      badge: data.badge || (data.mainCategory === "tin-tuc" ? "Tin Tức Mới" : "Khảo Cứu"),
      badge_class: data.badgeClass || data.badge_class || "bg-amber-100 text-amber-800",
      field_location: data.fieldLocation || data.field_location || "Ninh Thuận",
      read_time: data.readTime || data.read_time || this._calculateReadTime(data.content),
      author_id: authorId,
      author_name: authorName,
      author_avatar: actor?.avatarUrl || null,
      is_published: isPublished,
      status: data.status || (isPublished ? "published" : "draft"),
      seo_title: data.seoTitle || data.seo_title || title,
      seo_description: data.seoDescription || data.seo_description || data.excerpt || "",
      scheduled_at: data.scheduledAt || data.scheduled_at || null,
      views_count: 0,
      likes_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    let createdRecord = null;
    if (db) {
      createdRecord = await db.transaction(async (trx) => {
        const existing = await trx("blog_articles").where("slug", slug).first();
        if (existing) {
          slug = `${slug}-${Date.now().toString().slice(-4)}`;
          newRecord.slug = slug;
        }

        const [inserted] = await trx("blog_articles").insert(newRecord).returning("*");
        if (Array.isArray(data.tags) && data.tags.length > 0) {
          await this._syncArticleTags(trx, inserted.id, data.tags);
        }
        return inserted;
      });
    } else {
      createdRecord = { id: `art-${Date.now()}`, ...newRecord };
    }

    // Ghi log hoạt động
    await activityLogService.logActivity({
      actor,
      action: "ARTICLE_CREATE",
      targetType: newRecord.main_category === "tin-tuc" ? "news" : "article",
      targetId: createdRecord.id,
      targetTitle: newRecord.title,
      details: { slug: newRecord.slug, status: newRecord.status, category: newRecord.main_category },
    });

    return createdRecord;
  }

  async updateArticle(id, data, actor) {
    if (!db) throw new Error("Cơ sở dữ liệu chưa sẵn sàng!");

    return await db.transaction(async (trx) => {
      const existing = await trx("blog_articles").where("id", id).first();
      if (!existing) {
        const err = new Error("Không tìm thấy bài viết để cập nhật!");
        err.status = 404;
        throw err;
      }

      let slug = existing.slug;
      if (data.slug && data.slug.trim()) {
        const newSlug = this._slugify(data.slug);
        if (newSlug !== existing.slug) {
          const conflict = await trx("blog_articles").where("slug", newSlug).whereNot("id", id).first();
          slug = conflict ? `${newSlug}-${Date.now().toString().slice(-4)}` : newSlug;
        }
      }

      const isPublished = data.status ? data.status === "published" : existing.is_published;

      const updatePayload = {
        title: data.title ? data.title.trim() : existing.title,
        slug,
        summary: data.excerpt !== undefined ? data.excerpt.trim() : (data.summary !== undefined ? data.summary.trim() : existing.summary),
        content: data.content !== undefined ? data.content : existing.content,
        featured_image: data.coverImage !== undefined ? data.coverImage : (data.featured_image !== undefined ? data.featured_image : existing.featured_image),
        main_category: data.mainCategory || data.main_category || existing.main_category,
        category_id: data.category_id !== undefined ? data.category_id : existing.category_id,
        badge: data.badge !== undefined ? data.badge : existing.badge,
        badge_class: data.badgeClass !== undefined ? data.badgeClass : existing.badge_class,
        field_location: data.fieldLocation !== undefined ? data.fieldLocation : existing.field_location,
        read_time: data.readTime || data.read_time || (data.content ? this._calculateReadTime(data.content) : existing.read_time),
        author_name: data.authorName || existing.author_name,
        is_published: isPublished,
        status: data.status || (isPublished ? "published" : "draft"),
        seo_title: data.seoTitle !== undefined ? data.seoTitle : (data.seo_title !== undefined ? data.seo_title : existing.seo_title),
        seo_description: data.seoDescription !== undefined ? data.seoDescription : (data.seo_description !== undefined ? data.seo_description : existing.seo_description),
        scheduled_at: data.scheduledAt !== undefined ? data.scheduledAt : (data.scheduled_at !== undefined ? data.scheduled_at : existing.scheduled_at),
        updated_at: new Date(),
      };

      const [updated] = await trx("blog_articles").where("id", id).update(updatePayload).returning("*");

      if (Array.isArray(data.tags)) {
        await this._syncArticleTags(trx, id, data.tags);
      }

      // Ghi log
      await activityLogService.logActivity({
        actor,
        action: "ARTICLE_UPDATE",
        targetType: updated.main_category === "tin-tuc" ? "news" : "article",
        targetId: id,
        targetTitle: updated.title,
        details: { status: updated.status, is_published: updated.is_published },
      });

      return updated;
    });
  }

  async deleteArticle(id, actor) {
    if (!db) throw new Error("Cơ sở dữ liệu chưa sẵn sàng!");

    return await db.transaction(async (trx) => {
      const article = await trx("blog_articles").where("id", id).first();
      if (!article) {
        const err = new Error("Không tìm thấy bài viết để xóa!");
        err.status = 404;
        throw err;
      }

      await trx("article_tags").where("article_id", id).delete();
      await trx("blog_articles").where("id", id).delete();

      await activityLogService.logActivity({
        actor,
        action: "ARTICLE_DELETE",
        targetType: article.main_category === "tin-tuc" ? "news" : "article",
        targetId: id,
        targetTitle: article.title,
        details: { slug: article.slug },
      });

      return { success: true, message: `Đã xóa bài viết "${article.title}" thành công.` };
    });
  }

  async toggleArticlePublish(id, isPublished, actor) {
    if (!db) throw new Error("Cơ sở dữ liệu chưa sẵn sàng!");

    const status = isPublished ? "published" : "draft";
    const [updated] = await db("blog_articles")
      .where("id", id)
      .update({
        is_published: isPublished,
        status,
        updated_at: new Date(),
      })
      .returning("*");

    if (!updated) {
      const err = new Error("Không tìm thấy bài viết!");
      err.status = 404;
      throw err;
    }

    await activityLogService.logActivity({
      actor,
      action: isPublished ? "ARTICLE_PUBLISH" : "ARTICLE_UNPUBLISH",
      targetType: updated.main_category === "tin-tuc" ? "news" : "article",
      targetId: id,
      targetTitle: updated.title,
      details: { status },
    });

    return updated;
  }

  // =========================================================================
  // 3. USER MANAGEMENT
  // =========================================================================
  async getUsers({ search = "", role = "all", status = "all", page = 1, limit = 15 } = {}) {
    if (db) {
      let query = db("profiles").select(
        "id",
        "email",
        "full_name",
        "avatar_url",
        "phone_number",
        "role",
        "provider",
        "bio",
        "address",
        "status",
        "created_at",
        "updated_at"
      );

      if (role && role !== "all") {
        query = query.where("role", role);
      }

      if (status && status !== "all") {
        if (status === "active") {
          query = query.where(function () {
            this.where("status", "active").orWhereNull("status");
          });
        } else {
          query = query.where("status", status);
        }
      }

      if (search && search.trim()) {
        const q = `%${search.trim()}%`;
        query = query.where(function () {
          this.where("email", "ilike", q)
            .orWhere("full_name", "ilike", q)
            .orWhere("phone_number", "ilike", q);
        });
      }

      const countResult = await query.clone().clearSelect().count("id as count").first();
      const total = parseInt(countResult?.count || "0", 10);

      const users = await query
        .orderBy("created_at", "desc")
        .limit(limit)
        .offset((page - 1) * limit);

      return { users, total, page, limit };
    }

    return { users: [], total: 0, page, limit };
  }

  async updateUser(id, updateData, actor) {
    if (!db) throw new Error("Cơ sở dữ liệu chưa sẵn sàng!");

    const targetUser = await db("profiles").where("id", id).first();
    if (!targetUser) {
      const err = new Error("Không tìm thấy người dùng!");
      err.status = 404;
      throw err;
    }

    const actorRole = actor?.role || "customer";
    const isSelf = Boolean(
      (actor && actor.id === id) ||
      (actor && actor.email && targetUser.email && actor.email.toLowerCase() === targetUser.email.toLowerCase())
    );

    // 1. Bảo vệ phòng ngừa tự khóa tài khoản (Self-lockout protection)
    if (isSelf) {
      if (updateData.status && updateData.status !== "active") {
        throw new Error("Bảo mật: Bạn không thể tự đình chỉ tài khoản quản trị của chính mình!");
      }
      if (updateData.role && updateData.role !== targetUser.role && (targetUser.role === "admin" || targetUser.role === "super_admin")) {
        throw new Error("Bảo mật: Bạn không thể tự hạ quyền quản trị viên của chính mình!");
      }
    }

    // 2. Kiểm soát phân cấp đặc quyền (Role Hierarchy Enforcement)
    if (updateData.role && updateData.role !== targetUser.role) {
      // Chỉ super_admin mới có quyền chỉ định hoặc thay đổi vai trò super_admin
      if (updateData.role === "super_admin" && actorRole !== "super_admin") {
        throw new Error("Bảo mật: Chỉ Quản trị viên tối cao (Super Admin) mới có quyền chỉ định vai trò Super Admin!");
      }
      // Người không phải super_admin không thể thay đổi vai trò của một super_admin khác
      if (targetUser.role === "super_admin" && actorRole !== "super_admin") {
        throw new Error("Bảo mật: Bạn không có quyền sửa đổi thông tin của Quản trị viên tối cao!");
      }
    }

    const payload = {
      updated_at: new Date(),
    };

    if (updateData.full_name !== undefined) payload.full_name = updateData.full_name.trim();
    if (updateData.phone_number !== undefined) payload.phone_number = updateData.phone_number.trim();
    if (updateData.bio !== undefined) payload.bio = updateData.bio;
    if (updateData.address !== undefined) payload.address = updateData.address;
    if (updateData.role !== undefined) {
      const validRoles = ["super_admin", "admin", "editor", "artisan", "guide", "customer"];
      if (!validRoles.includes(updateData.role)) {
        throw new Error(`Vai trò "${updateData.role}" không hợp lệ!`);
      }
      payload.role = updateData.role;
    }
    if (updateData.status !== undefined) {
      const validStatuses = ["active", "suspended"];
      if (!validStatuses.includes(updateData.status)) {
        throw new Error(`Trạng thái "${updateData.status}" không hợp lệ!`);
      }
      payload.status = updateData.status;
    }

    const [updated] = await db("profiles").where("id", id).update(payload).returning("*");

    await activityLogService.logActivity({
      actor,
      action: "USER_UPDATE",
      targetType: "user",
      targetId: id,
      targetTitle: updated.full_name || updated.email,
      details: { role: updated.role, status: updated.status },
    });

    return updated;
  }

  // =========================================================================
  // 4. MEDIA MANAGEMENT
  // =========================================================================
  async getMediaFiles({ search = "", mimeType = "all", page = 1, limit = 24 } = {}) {
    if (db) {
      let query = db("media_files as m")
        .leftJoin("profiles as p", "m.uploader_id", "p.id")
        .select(
          "m.id",
          "m.filename",
          "m.original_name",
          "m.mime_type",
          "m.size",
          "m.dimensions",
          "m.url",
          "m.uploader_id",
          "p.full_name as uploader_name",
          "m.created_at"
        );

      if (mimeType && mimeType !== "all") {
        query = query.where("m.mime_type", "ilike", `%${mimeType}%`);
      }

      if (search && search.trim()) {
        const q = `%${search.trim()}%`;
        query = query.where(function () {
          this.where("m.filename", "ilike", q).orWhere("m.original_name", "ilike", q);
        });
      }

      const countResult = await query.clone().clearSelect().count("m.id as count").first();
      const total = parseInt(countResult?.count || "0", 10);

      const files = await query
        .orderBy("m.created_at", "desc")
        .limit(limit)
        .offset((page - 1) * limit);

      return { files, total, page, limit };
    }

    return { files: [], total: 0, page, limit };
  }

  async saveMediaFile({ filename, originalName, mimeType, size, dimensions, url }, actor) {
    if (!db) throw new Error("Cơ sở dữ liệu chưa sẵn sàng!");

    const uploaderId = actor?.id && !actor.id.startsWith("usr-") ? actor.id : null;

    const [saved] = await db("media_files")
      .insert({
        filename,
        original_name: originalName,
        mime_type: mimeType,
        size,
        dimensions: dimensions || null,
        url,
        uploader_id: uploaderId,
        created_at: new Date(),
      })
      .returning("*");

    await activityLogService.logActivity({
      actor,
      action: "MEDIA_UPLOAD",
      targetType: "media",
      targetId: saved.id,
      targetTitle: originalName,
      details: { size, mimeType, url },
    });

    return saved;
  }

  async deleteMediaFile(id, actor) {
    if (!db) throw new Error("Cơ sở dữ liệu chưa sẵn sàng!");

    const media = await db("media_files").where("id", id).first();
    if (!media) {
      const err = new Error("Không tìm thấy tệp media!");
      err.status = 404;
      throw err;
    }

    // Xóa bản ghi trong database trước
    await db("media_files").where("id", id).delete();

    // Dọn dẹp tệp vật lý hoặc đám mây qua storageService
    if (media.url) {
      await storageService.deleteFile(media.url);
    }

    await activityLogService.logActivity({
      actor,
      action: "MEDIA_DELETE",
      targetType: "media",
      targetId: id,
      targetTitle: media.original_name,
      details: { filename: media.filename },
    });

    return { success: true, message: `Đã xóa tệp "${media.original_name}" thành công.` };
  }

  // =========================================================================
  // 5. CATEGORIES & TAGS MANAGEMENT
  // =========================================================================
  async getCategories() {
    if (db) {
      const categories = await db("blog_categories as c")
        .leftJoin("blog_articles as a", "c.id", "a.category_id")
        .select(
          "c.id",
          "c.label",
          "c.description",
          "c.main_category",
          "c.display_order",
          "c.created_at",
          db.raw("COUNT(a.id) as article_count")
        )
        .groupBy("c.id", "c.label", "c.description", "c.main_category", "c.display_order", "c.created_at")
        .orderBy("c.display_order", "asc");

      return categories.map((cat) => ({
        ...cat,
        article_count: parseInt(cat.article_count || "0", 10),
      }));
    }
    return [];
  }

  async createCategory(data, actor) {
    if (!db) throw new Error("Cơ sở dữ liệu chưa sẵn sàng!");

    const label = data.label?.trim();
    if (!label) throw new Error("Tên chuyên mục không được để trống!");

    let id = data.id?.trim() ? this._slugify(data.id) : this._slugify(label);
    const mainCategory = data.main_category || "van-hoa";

    const existing = await db("blog_categories").where("id", id).first();
    if (existing) {
      id = `${id}-${Date.now().toString().slice(-4)}`;
    }

    const [created] = await db("blog_categories")
      .insert({
        id,
        label,
        description: data.description || "",
        main_category: mainCategory,
        display_order: parseInt(data.display_order || "0", 10),
        created_at: new Date(),
      })
      .returning("*");

    await activityLogService.logActivity({
      actor,
      action: "CATEGORY_CREATE",
      targetType: "category",
      targetId: id,
      targetTitle: label,
      details: { main_category: mainCategory },
    });

    return created;
  }

  async updateCategory(id, data, actor) {
    if (!db) throw new Error("Cơ sở dữ liệu chưa sẵn sàng!");

    const existing = await db("blog_categories").where("id", id).first();
    if (!existing) {
      const err = new Error("Chuyên mục không tồn tại!");
      err.status = 404;
      throw err;
    }

    const payload = {};
    if (data.label !== undefined) payload.label = data.label.trim();
    if (data.description !== undefined) payload.description = data.description;
    if (data.main_category !== undefined) payload.main_category = data.main_category;
    if (data.display_order !== undefined) payload.display_order = parseInt(data.display_order, 10);

    const [updated] = await db("blog_categories").where("id", id).update(payload).returning("*");

    await activityLogService.logActivity({
      actor,
      action: "CATEGORY_UPDATE",
      targetType: "category",
      targetId: id,
      targetTitle: updated.label,
      details: payload,
    });

    return updated;
  }

  async deleteCategory(id, actor) {
    if (!db) throw new Error("Cơ sở dữ liệu chưa sẵn sàng!");

    const category = await db("blog_categories").where("id", id).first();
    if (!category) {
      const err = new Error("Chuyên mục không tồn tại!");
      err.status = 404;
      throw err;
    }

    // Kiểm tra xem có bài viết đang trỏ đến không
    const countCheck = await db("blog_articles").where("category_id", id).count("id as count").first();
    const count = parseInt(countCheck?.count || "0", 10);
    if (count > 0) {
      throw new Error(`Không thể xóa chuyên mục "${category.label}" vì đang có ${count} bài viết liên kết. Vui lòng chuyển bài viết sang chuyên mục khác trước khi xóa.`);
    }

    await db("blog_categories").where("id", id).delete();

    await activityLogService.logActivity({
      actor,
      action: "CATEGORY_DELETE",
      targetType: "category",
      targetId: id,
      targetTitle: category.label,
    });

    return { success: true, message: `Đã xóa chuyên mục "${category.label}" thành công.` };
  }

  async getTags() {
    if (db) {
      const tags = await db("tags as t")
        .leftJoin("article_tags as at", "t.id", "at.tag_id")
        .select("t.id", "t.name", "t.slug", "t.created_at", db.raw("COUNT(at.article_id) as article_count"))
        .groupBy("t.id", "t.name", "t.slug", "t.created_at")
        .orderBy("article_count", "desc");

      return tags.map((t) => ({ ...t, article_count: parseInt(t.article_count || "0", 10) }));
    }
    return [];
  }

  async createTag(data, actor) {
    if (!db) throw new Error("Cơ sở dữ liệu chưa sẵn sàng!");

    const name = data.name?.trim();
    if (!name) throw new Error("Tên thẻ không được để trống!");
    const slug = data.slug?.trim() ? this._slugify(data.slug) : this._slugify(name);

    // Kiểm tra nếu thẻ đã tồn tại (idempotent)
    const existing = await db("tags").where("name", name).orWhere("slug", slug).first();
    if (existing) {
      return existing;
    }

    const [created] = await db("tags").insert({ name, slug }).returning("*");

    await activityLogService.logActivity({
      actor,
      action: "TAG_CREATE",
      targetType: "tag",
      targetId: String(created.id),
      targetTitle: name,
    });

    return created;
  }

  async deleteTag(id, actor) {
    if (!db) throw new Error("Cơ sở dữ liệu chưa sẵn sàng!");

    const tag = await db("tags").where("id", id).first();
    if (!tag) {
      const err = new Error("Thẻ không tồn tại!");
      err.status = 404;
      throw err;
    }

    await db("article_tags").where("tag_id", id).delete();
    await db("tags").where("id", id).delete();

    await activityLogService.logActivity({
      actor,
      action: "TAG_DELETE",
      targetType: "tag",
      targetId: String(id),
      targetTitle: tag.name,
    });

    return { success: true, message: `Đã xóa thẻ "${tag.name}" thành công.` };
  }

  // =========================================================================
  // 6. SITE SETTINGS
  // =========================================================================
  async getSettings() {
    if (db) {
      const rows = await db("site_settings").select("*");
      const settings = {};
      rows.forEach((r) => {
        settings[r.key] = typeof r.value === "string" ? JSON.parse(r.value) : r.value;
      });
      return settings;
    }
    return {};
  }

  async updateSettings(key, value, actor) {
    if (!db) throw new Error("Cơ sở dữ liệu chưa sẵn sàng!");

    const updaterId = actor?.id && !actor.id.startsWith("usr-") ? actor.id : null;

    const existing = await db("site_settings").where("key", key).first();
    let result;
    if (existing) {
      const [updated] = await db("site_settings")
        .where("key", key)
        .update({
          value: JSON.stringify(value),
          updated_at: new Date(),
          updated_by: updaterId,
        })
        .returning("*");
      result = updated;
    } else {
      const [inserted] = await db("site_settings")
        .insert({
          key,
          value: JSON.stringify(value),
          updated_at: new Date(),
          updated_by: updaterId,
        })
        .returning("*");
      result = inserted;
    }

    await activityLogService.logActivity({
      actor,
      action: "SETTINGS_UPDATE",
      targetType: "settings",
      targetId: key,
      targetTitle: `Cài đặt [${key}]`,
      details: value,
    });

    return result;
  }

  // =========================================================================
  // HELPERS
  // =========================================================================
  _slugify(str) {
    if (!str) return "";
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  _calculateReadTime(text) {
    if (!text) return "3 phút đọc";
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} phút đọc`;
  }
}

module.exports = new AdminService();
