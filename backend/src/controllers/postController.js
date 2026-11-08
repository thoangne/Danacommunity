const postService = require("../services/postService");
const activityLogService = require("../services/activityLogService");

class PostController {
  // 1. Công khai: Lấy danh sách bài viết đã xuất bản
  async getPublishedPosts(req, res, next) {
    try {
      const { mainCategory, category, search, limit, page } = req.query;
      const result = await postService.getPublishedPosts({
        mainCategory: mainCategory || "all",
        category: category || "all",
        search: search || "",
        limit: limit ? parseInt(limit, 10) : 20,
        page: page ? parseInt(page, 10) : 1,
      });

      res.status(200).json({
        success: true,
        data: result.posts,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // 2. Công khai: Lấy chi tiết bài viết theo Slug
  async getPostBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const post = await postService.getPostBySlug(slug);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy bài viết hoặc bài viết chưa được xuất bản.",
        });
      }

      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  // 3. Admin: Lấy toàn bộ danh sách bài viết (kể cả draft)
  async getAllPostsForAdmin(req, res, next) {
    try {
      const { status, search } = req.query;
      const posts = await postService.getAllPostsForAdmin({ status, search });

      res.status(200).json({
        success: true,
        data: posts,
        count: posts.length,
      });
    } catch (error) {
      next(error);
    }
  }

  // 4. Admin: Tạo bài viết mới
  async createPost(req, res, next) {
    try {
      const postData = req.body;
      const authorUser = req.user;

      const createdPost = await postService.createPost(postData, authorUser);

      await activityLogService.logActivity({
        actor: authorUser,
        action: "ARTICLE_CREATE",
        targetType: createdPost.mainCategory === "tin-tuc" ? "news" : "article",
        targetId: createdPost.id,
        targetTitle: createdPost.title,
        details: { via: "legacy_api", slug: createdPost.slug },
      });

      res.status(201).json({
        success: true,
        message:
          createdPost.status === "published"
            ? "Đăng bài viết mới thành công!"
            : "Lưu bản nháp thành công!",
        data: createdPost,
      });
    } catch (error) {
      next(error);
    }
  }

  // 5. Admin: Cập nhật bài viết
  async updatePost(req, res, next) {
    try {
      const { id } = req.params;
      const postData = req.body;
      const authorUser = req.user;

      const updated = await postService.updatePost(id, postData, authorUser);

      await activityLogService.logActivity({
        actor: authorUser,
        action: "ARTICLE_UPDATE",
        targetType: updated.mainCategory === "tin-tuc" ? "news" : "article",
        targetId: id,
        targetTitle: updated.title,
        details: { via: "legacy_api", status: updated.status },
      });

      res.status(200).json({
        success: true,
        message: "Cập nhật bài viết thành công!",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  // 6. Admin: Xóa bài viết
  async deletePost(req, res, next) {
    try {
      const { id } = req.params;
      const authorUser = req.user;
      const result = await postService.deletePost(id);

      await activityLogService.logActivity({
        actor: authorUser,
        action: "ARTICLE_DELETE",
        targetType: "article",
        targetId: id,
        targetTitle: `ID: ${id}`,
        details: { via: "legacy_api" },
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();

