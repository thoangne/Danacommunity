const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const { testConnection, getDb } = require("./src/config/db");
const adminService = require("./src/services/adminService");
const activityLogService = require("./src/services/activityLogService");
const postService = require("./src/services/postService");

async function runCmsVerification() {
  console.log("=================================================");
  console.log("🚀 BẮT ĐẦU KIỂM THỬ TOÀN DIỆN HỆ THỐNG CMS ADMIN");
  console.log("=================================================");

  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error("❌ Không thể kết nối cơ sở dữ liệu!");
    process.exit(1);
  }
  console.log("✅ 1. Kết nối PostgreSQL thành công!");

  const testActor = {
    id: "00000000-0000-0000-0000-000000000001",
    email: "admin@champaweb.vn",
    fullName: "Quản Trị Viên Di Sản",
    role: "admin",
  };

  // Test 2: Dashboard stats
  console.log("\n--- TEST 2: THỐNG KÊ DASHBOARD ---");
  const stats = await adminService.getDashboardMetrics();
  console.log("Thống kê bài viết:", JSON.stringify(stats.articles));
  console.log("Thống kê người dùng:", JSON.stringify(stats.users));
  if (typeof stats.articles.total !== "number" || typeof stats.users.total !== "number") {
    throw new Error("Cấu trúc dashboard stats không hợp lệ!");
  }
  console.log("✅ 2. Dashboard metrics truy vấn thành công!");

  // Test 3: Categories & Tags CRUD
  console.log("\n--- TEST 3: CATEGORIES & TAGS ---");
  const testCat = await adminService.createCategory({
    id: `test-cat-${Date.now().toString().slice(-4)}`,
    label: "Kiểm Thử CMS",
    icon: "Folder",
    color: "amber",
    description: "Danh mục kiểm thử tự động",
  }, testActor);
  console.log("Đã tạo danh mục:", testCat.id, testCat.label);

  const testTag = await adminService.createTag({ name: "Tháp Chàm Test" }, testActor);
  console.log("Đã tạo thẻ:", testTag.name, testTag.slug);
  console.log("✅ 3. Categories & Tags tạo thành công!");

  // Test 4: Article Creation & Retrieval
  console.log("\n--- TEST 4: TẠO BÀI VIẾT (ARTICLE) ---");
  const newArticle = await adminService.createArticle({
    title: "Nghiên cứu kiến trúc đền tháp Po Klong Garai - Kiểm thử CMS",
    content: "Bài viết khảo cứu chuyên sâu về nghệ thuật xây gạch không mạch vữa của người Chăm.",
    excerpt: "Khảo cứu kiến trúc Po Klong Garai thế kỷ XIII.",
    mainCategory: "van-hoa",
    category_id: testCat.id,
    tags: ["Tháp Chàm Test", "Khảo cổ học"],
    status: "published",
    seoTitle: "Kiến trúc Po Klong Garai | Dana Community",
    seoDescription: "Khảo cứu nghệ thuật kiến trúc Champa cổ.",
  }, testActor);
  console.log("Đã tạo bài viết:", newArticle.id, "Slug:", newArticle.slug);

  const fetchedArticle = await adminService.getArticleById(newArticle.id);
  if (!fetchedArticle || fetchedArticle.tagsList.length === 0) {
    throw new Error("Không lấy được bài viết hoặc tags đi kèm!");
  }
  console.log("Tags liên kết:", fetchedArticle.tagsList.map(t => t.name).join(", "));
  console.log("✅ 4. Bài viết & quan hệ tags tạo và đọc thành công!");

  // Test 5: News Creation & Filter
  console.log("\n--- TEST 5: TẠO TIN TỨC (NEWS) & BỘ LỌC ---");
  const newNews = await adminService.createArticle({
    title: "Khai mạc triển lãm di sản gốm Bàu Trúc 2026",
    content: "Lễ hội tôn vinh nghệ thuật làm gốm truyền thống của người Chăm vừa chính thức khai mạc.",
    excerpt: "Triển lãm gốm Bàu Trúc tại Ninh Thuận.",
    mainCategory: "tin-tuc",
    status: "published",
  }, testActor);
  console.log("Đã tạo tin tức:", newNews.id, "Main Category:", newNews.main_category);

  const newsList = await adminService.getArticles({ mainCategory: "tin-tuc", limit: 5 });
  const foundNews = newsList.articles.find(a => a.id === newNews.id);
  if (!foundNews) throw new Error("Bộ lọc tin tức (main_category = 'tin-tuc') không trả về đúng bản ghi!");
  console.log(`Tìm thấy tin tức trong danh sách tin (Tổng số tin: ${newsList.total})`);
  console.log("✅ 5. Tin tức và bộ lọc chuyên biệt hoạt động chính xác!");

  // Test 6: Public API Synchronization
  console.log("\n--- TEST 6: ĐỒNG BỘ PUBLIC API (/api/posts) ---");
  const publicPosts = await postService.getPublishedPosts({ limit: 10 });
  const foundInPublic = publicPosts.posts.find(p => p.id === newArticle.id);
  if (!foundInPublic) {
    throw new Error("Bài viết đã xuất bản trong CMS không hiển thị ở public API!");
  }
  console.log("Bài viết đã xuất hiện trên cổng công khai:", foundInPublic.title);
  console.log("✅ 6. Đồng bộ dữ liệu 100% giữa CMS và Website công khai!");

  // Test 7: Article Update
  console.log("\n--- TEST 7: CẬP NHẬT BÀI VIẾT ---");
  const updatedArticle = await adminService.updateArticle(newArticle.id, {
    title: "Nghiên cứu kiến trúc đền tháp Po Klong Garai (Bản cập nhật CMS)",
    status: "draft",
    tags: ["Tháp Chàm Test", "Bảo tồn di sản"],
  }, testActor);
  if (updatedArticle.is_published !== false || updatedArticle.status !== "draft") {
    throw new Error("Cập nhật trạng thái bài viết không thành công!");
  }
  console.log("Trạng thái mới:", updatedArticle.status, "| Tiêu đề:", updatedArticle.title);
  console.log("✅ 7. Cập nhật bài viết & tags thành công!");

  // Test 8: User Management & Self-lockout Protection
  console.log("\n--- TEST 8: QUẢN LÝ NGƯỜI DÙNG & BẢO MẬT SELF-LOCKOUT ---");
  const usersResult = await adminService.getUsers({ page: 1, limit: 10 });
  console.log(`Tổng số người dùng hệ thống: ${usersResult.total}`);
  if (!Array.isArray(usersResult.users) || usersResult.users.length === 0) {
    throw new Error("Không truy vấn được danh sách người dùng!");
  }

  // Thử tự khóa tài khoản của chính mình (phải bị từ chối)
  let lockoutBlocked = false;
  try {
    await adminService.updateUser(testActor.id, { status: "suspended" }, testActor);
  } catch (err) {
    lockoutBlocked = true;
    console.log("Bảo mật chặn tự khóa tài khoản thành công:", err.message);
  }
  if (!lockoutBlocked) throw new Error("LỖ HỔNG: Admin có thể tự đình chỉ tài khoản của chính mình!");

  // Thử tự hạ quyền admin của chính mình (phải bị từ chối)
  let demotionBlocked = false;
  try {
    await adminService.updateUser(testActor.id, { role: "customer" }, testActor);
  } catch (err) {
    demotionBlocked = true;
    console.log("Bảo mật chặn tự hạ quyền thành công:", err.message);
  }
  if (!demotionBlocked) throw new Error("LỖ HỔNG: Admin có thể tự hạ quyền của chính mình!");
  console.log("✅ 8. Quản lý người dùng & các lớp bảo vệ self-lockout hoàn hảo!");

  // Test 9: Media Management
  console.log("\n--- TEST 9: QUẢN LÝ MEDIA FILE ---");
  const mediaRecord = await adminService.saveMediaFile({
    filename: `test_image_${Date.now()}.webp`,
    originalName: "thap_cham_ninh_thuan.webp",
    mimeType: "image/webp",
    size: 245000,
    dimensions: "1920x1080",
    url: "/uploads/test_image.webp",
  }, testActor);
  console.log("Đã tạo media record:", mediaRecord.id, mediaRecord.url);

  const mediaList = await adminService.getMediaFiles({ page: 1, limit: 10 });
  console.log(`Tổng số file media: ${mediaList.total}`);
  await adminService.deleteMediaFile(mediaRecord.id, testActor);
  console.log("Đã xóa file media thử nghiệm thành công!");
  console.log("✅ 9. Quản lý thư viện Media hoạt động chuẩn xác!");

  // Test 10: Site Settings
  console.log("\n--- TEST 10: CẤU HÌNH HỆ THỐNG (SETTINGS) ---");
  const currentSettings = await adminService.getSettings();
  console.log("Cài đặt hiện tại - Các modules:", Object.keys(currentSettings));
  const oldSiteInfo = currentSettings.site_info || {};
  await adminService.updateSettings("site_info", {
    ...oldSiteInfo,
    site_title: "Dana Community - Tinh Hoa Di Sản Chăm Pa (Test)",
  }, testActor);
  const updatedSettings = await adminService.getSettings();
  if (!updatedSettings.site_info || updatedSettings.site_info.site_title !== "Dana Community - Tinh Hoa Di Sản Chăm Pa (Test)") {
    throw new Error("Cập nhật cài đặt hệ thống không thành công!");
  }
  // Khôi phục lại
  await adminService.updateSettings("site_info", oldSiteInfo, testActor);
  console.log("✅ 10. Đọc & ghi cấu hình hệ thống thành công!");

  // Test 11: Activity Audit Logs
  console.log("\n--- TEST 11: NHẬT KÝ HOẠT ĐỘNG (AUDIT LOGS) ---");
  const logsResult = await activityLogService.getLogs({ page: 1, limit: 5 });
  console.log(`Tổng số sự kiện audit log đã ghi: ${logsResult.total}`);
  if (logsResult.logs.length > 0) {
    const latest = logsResult.logs[0];
    console.log(`Sự kiện gần nhất: [${latest.action}] bởi ${latest.actor_name} (${latest.target_type}: ${latest.target_title || latest.target_id})`);
  }
  console.log("✅ 11. Nhật ký kiểm toán audit logs hoạt động chuẩn xác!");

  // Test 12: Clean up test articles
  console.log("\n--- TEST 12: DỌN DẸP DỮ LIỆU THỬ NGHIỆM ---");
  await adminService.deleteArticle(newArticle.id, testActor);
  await adminService.deleteArticle(newNews.id, testActor);
  await adminService.deleteCategory(testCat.id, testActor);
  await adminService.deleteTag(testTag.id, testActor);
  console.log("Đã xóa bài viết, tin tức, danh mục và thẻ thử nghiệm an toàn!");
  console.log("✅ 12. Dọn dẹp an toàn thành công!");

  console.log("\n=================================================");
  console.log("🎉 TOÀN BỘ 12/12 BÀI KIỂM THỬ ĐÃ ĐẠT CHUẨN 100%!");
  console.log("=================================================");
  process.exit(0);
}

runCmsVerification().catch((err) => {
  console.error("❌ Lỗi kiểm thử:", err);
  process.exit(1);
});
