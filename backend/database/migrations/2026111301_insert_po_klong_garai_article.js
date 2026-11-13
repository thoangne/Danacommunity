/**
 * Knex Migration: 2026111301_insert_po_klong_garai_article.js
 * Di chuyển nội dung bài viết khảo cứu: Đền tháp Po Klong Garai lên hệ thống Production.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const articleSlug = "thap-po-klong-garai-dinh-cao-kien-truc";

  // 1. Đảm bảo danh mục 'kalan' đã tồn tại trong blog_categories
  const hasCategoriesTable = await knex.schema.hasTable("blog_categories");
  if (hasCategoriesTable) {
    await knex("blog_categories")
      .insert({
        id: "kalan",
        label: "Kiến trúc Đền tháp Kalan",
        description: "Khảo cứu chuyên sâu về các quần thể đền tháp gạch nung Champa cổ.",
        main_category: "lich-su",
        display_order: 4,
      })
      .onConflict("id")
      .ignore();
  }

  // 2. Lấy ID tài khoản Quản trị viên để gán quyền tác giả (nếu có)
  let authorId = null;
  const hasProfiles = await knex.schema.hasTable("profiles");
  if (hasProfiles) {
    const adminUser = await knex("profiles")
      .where("role", "admin")
      .orderBy("created_at", "asc")
      .first();
    if (adminUser) {
      authorId = adminUser.id;
    }
  }

  // 3. Nội dung bài viết định dạng chuẩn Markdown chia chương (hỗ trợ phân trang/chương trên web)
  const articleContent = `Sừng sững trên đỉnh đồi Trầu lộng gió của xứ sở nắng gió Ninh Thuận, tháp Po Klong Garai không chỉ là đỉnh cao của nghệ thuật kiến trúc gạch nung Chăm cổ, mà còn là linh hồn tâm linh bền bỉ chảy suốt hơn 7 thế kỷ qua dòng thời gian.

## Dấu ấn vàng son và huyền tích về vị vua hiền Po Klong Garai

Được xây dựng vào cuối thế kỷ XIII – đầu thế kỷ XIV dưới triều vua Champa Jaya Simhavarman III (sử sách người Việt gọi là vua Chế Mân), quần thể đền tháp được dựng nên để tôn vinh và thờ phụng vua Po Klong Garai (trị vì từ năm 1167 đến 1205).

Theo truyền thuyết dân gian Chăm, Po Klong Garai xuất thân từ một chàng trai chăn dê nghèo khó mang tên Jatol, nhưng mang chí lớn và tấm lòng thương dân sâu sắc. Khi lên ngôi, ngài đã dốc lòng khai khẩn đất hoang, hướng dẫn người dân đắp đập, đào kênh dẫn thủy nhập điền (tiêu biểu như hệ thống đập Nha Trinh, đập Lâm Cấm còn giá trị tưới tiêu đến tận ngày nay). Nhờ bàn tay kiến thiết của ông, vùng đất khô hạn cằn cỗi đã hóa thành những cánh đồng phì nhiêu, xóm làng ấm no hạnh phúc.

Sau khi qua đời, ngài được người dân tôn kính như một vị thần bảo hộ (Muk Juk), trở thành biểu tượng bất tử cho sự che chở, no ấm và mùa màng tươi tốt của cả xứ sở.

## Tuyệt tác kiến trúc gạch nung: Quần thể 3 ngọn tháp trên đồi Trầu

Tọa lạc ở độ cao lý tưởng bao quát cả một vùng đồng bằng Phan Rang màu mỡ, quần thể di tích Po Klong Garai hiện lên uy nghiêm với ba công trình bằng gạch nung đỏ rực:

- **Tháp Cổng (Gopura):** Cao hơn 8 mét, nằm ở phía Đông. Đây là lối dẫn đầu tiên vào chốn tôn nghiêm, mở ra không gian chuyển tiếp giữa cõi phàm trần và thế giới thần linh.
- **Tháp Lửa (Kosagrha):** Cao hơn 9 mét, nằm ở phía Nam tháp chính. Ngôi tháp có mái cong hình thuyền độc đáo – gợi nhắc nguồn gốc hải hành và nét văn hóa Nam Đảo đặc trưng. Xưa kia, đây là nơi ngự của thần Lửa, nơi giữ ngọn lửa thiêng và chuẩn bị đồ tế lễ.
- **Tháp Chính (Kalan):** Trái tim của cả quần thể, cao hơn 20 mét. Tháp gồm nhiều tầng thu nhỏ dần lên đỉnh, đỉnh tháp là trụ đá nhọn tượng trưng cho núi thiêng Meru. Cửa chính tháp quay về hướng Đông, phía trên vòm cửa là bức phù điêu thần Shiva 6 tay uy nghi đang múa điệu múa vũ trụ. Bên trong lòng tháp thâm nghiêm là tượng Mukha-Linga – hiện thân hòa hợp giữa sinh thực khí Linga và khuôn mặt tôn kính của vua Po Klong Garai.

## Bí ẩn kỹ thuật xây dựng và nghệ thuật điêu khắc Chăm cổ

Điều khiến mọi du khách và các nhà nghiên cứu kinh ngạc suốt nhiều thế kỷ qua chính là nghệ thuật xây dựng của người Chăm cổ:

Những viên gạch nung đỏ thắm, nhẹ mà bền chắc, được mài chắp khít khao bằng nước và hợp chất thảo mộc tự nhiên đến mức mắt thường khó nhìn thấy bất kỳ vết kết dính vữa nào. Dù trải qua mưa nắng khắc nghiệt của miền duyên hải Nam Trung Bộ, sắc gạch vẫn rực rỡ như vừa mới thành hình hôm qua.

Các họa tiết hoa văn dây lá, hình tượng bò thần Nandin, chim thần Garuda, hay các vũ nữ Apsara mềm mại được nghệ nhân Chăm chạm khắc trực tiếp lên khối tường gạch đã xây xong – minh chứng cho đôi bàn tay tài hoa và trình độ mỹ thuật đạt tới độ hoàn mỹ.

## Trái tim tâm linh & Hơi thở sống động của Lễ hội Katê

Không giống như nhiều phế tích khảo cổ nằm im lìm trong quá khứ, Po Klong Garai là một "di sản sống". Nơi đây vẫn là trung tâm sinh hoạt tôn giáo, tín ngưỡng sống động của cộng đồng người Chăm Balamon.

Hằng năm, vào đầu tháng 7 lịch Chăm (khoảng tháng 9 – tháng 10 Dương lịch), đồi Trầu lại rộn ràng bước vào Đại lễ hội Katê – di sản văn hóa phi vật thể quốc gia:
- Tiếng trống Paranưng bập bùng, tiếng kèn Saranai réo rắt ngân vang giữa trời xanh.
- Các thiếu nữ Chăm trong tà áo dài truyền thống duyên dáng uyển chuyển cùng điệu múa quạt huyền ảo.
- Các chức sắc tôn giáo làm lễ mở cửa tháp, rước y trang, tắm tượng và dâng lễ vật để tạ ơn thần linh, cầu mong quốc thái dân an, mưa thuận gió hòa và mùa màng bội thu.

## Di sản vô giá sống mãi cùng thời gian

Với những giá trị đặc biệt về mặt lịch sử, kiến trúc và điêu khắc, đền tháp Po Klong Garai đã được xếp hạng là Di tích Quốc gia Đặc biệt vào năm 2016.

Đến với Po Klong Garai, du khách không chỉ được chiêm ngưỡng một công trình kiến trúc tuyệt mỹ, mà còn được bước vào hành trình lắng nghe thanh âm của quá khứ, chạm tay vào những phiến gạch nghìn năm để cảm nhận trọn vẹn bề dày văn hóa ngàn đời của vương quốc Champa cổ xưa.`;

  const tagNames = [
    "Po Klong Garai",
    "Tháp Chàm Ninh Thuận",
    "Kiến trúc Kalan",
    "Gạch nung Champa",
    "Lễ hội Katê",
    "Di tích Quốc gia đặc biệt",
  ];

  // 4. Thêm bài viết vào blog_articles
  const articlePayload = {
    slug: articleSlug,
    title: "Tháp Po Klong Garai: Đỉnh cao kiến trúc gạch nung và hơi thở nghìn năm của văn minh Champa",
    main_category: "lich-su",
    category_id: "kalan",
    badge: "Di tích Quốc gia Đặc biệt",
    badge_class: "bg-red-100 text-red-800",
    field_location: "Đồi Trầu, Đô Vinh, Phan Rang - Tháp Chàm, Ninh Thuận",
    read_time: "6 phút đọc",
    author_id: authorId,
    author_name: "Ban Nghiên Cứu Di Sản Dana",
    author_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    summary: "Sừng sững trên đỉnh đồi Trầu qua hơn 7 thế kỷ, quần thể tháp Po Klong Garai là kiệt tác kiến trúc gạch nung độc bản của người Chăm cổ, gắn liền với huyền tích vị vua trị thủy Po Klong Garai và không khí linh thiêng của Đại lễ Katê.",
    content: articleContent,
    featured_image: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
    ],
    is_featured: true,
    is_published: true,
    views_count: 320,
    likes_count: 48,
    seo_title: "Tháp Po Klong Garai - Tuyệt tác kiến trúc gạch nung Champa | Dana Heritage",
    seo_description: "Khám phá tháp Po Klong Garai trên đồi Trầu Ninh Thuận: lịch sử vua Jaya Simhavarman III, kiến trúc 3 tòa tháp gạch nung không vữa và lễ hội Katê.",
    status: "published",
    tags: tagNames,
    updated_at: knex.fn.now(),
  };

  const [insertedArticle] = await knex("blog_articles")
    .insert(articlePayload)
    .onConflict("slug")
    .merge()
    .returning(["id", "slug"]);

  const articleId = insertedArticle ? insertedArticle.id : null;

  // 5. Đồng bộ vào bảng tags và article_tags nếu có tồn tại
  const hasTagsTable = await knex.schema.hasTable("tags");
  const hasArticleTagsTable = await knex.schema.hasTable("article_tags");

  if (hasTagsTable && hasArticleTagsTable && articleId) {
    for (const tagName of tagNames) {
      const tagSlug = tagName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const [tag] = await knex("tags")
        .insert({
          name: tagName,
          slug: tagSlug,
        })
        .onConflict("slug")
        .merge()
        .returning(["id"]);

      if (tag && tag.id) {
        await knex("article_tags")
          .insert({
            article_id: articleId,
            tag_id: tag.id,
          })
          .onConflict(["article_id", "tag_id"])
          .ignore();
      }
    }
  }
};

/**
 * Rollback Migration
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const articleSlug = "thap-po-klong-garai-dinh-cao-kien-truc";

  const hasArticlesTable = await knex.schema.hasTable("blog_articles");
  if (hasArticlesTable) {
    await knex("blog_articles").where("slug", articleSlug).delete();
  }
};

