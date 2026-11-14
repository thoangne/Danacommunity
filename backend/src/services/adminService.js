const fs = require("fs");
const path = require("path");
const { db } = require("../config/db");
const activityLogService = require("./activityLogService");
const storageService = require("./storageService");

const DEFAULT_CAROUSEL_SLIDES = [
  {
    id: 1,
    title: "Nhà Cổ Chăm Baoh Dana - Dấu Ấn Trăm Năm Panduranga",
    subtitle: "Ngôi nhà cổ kết hợp kiến trúc Chăm - Pháp hơn trăm năm tuổi độc đáo tại Palei Dana (thôn Chất Thường)",
    image: "/images/dana-life/nha_co_dana.png",
    link: "#ve-dana",
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    title: "Cấu Trúc Mộc Kê Đá & Hàng Hiên Làng Cổ",
    subtitle: "Palei Dana - vùng đất 'gah praong' trù phú ngàn đời gắn liền con đập Nha Trinh huyền thoại",
    image: "/images/dana-life/nha_co_dana2.png",
    link: "#ve-dana",
    order: 2,
    isActive: true,
  },
  {
    id: 3,
    title: "Gian Nội Thất Ấm Cúng & Nếp Nhà Mẫu Hệ",
    subtitle: "Nơi hội tụ các dòng tộc lớn và là cái nôi nuôi dưỡng nhiều thế hệ trí thức Chăm ưu tú",
    image: "/images/dana-life/nha_co_dana3.png",
    link: "#ve-dana",
    order: 3,
    isActive: true,
  },
  {
    id: 4,
    title: "Vệ Tinh Khám Phá: Đền Tháp Po Klong Garai",
    subtitle: "Di tích quốc gia đặc biệt kết nối trong hành trình du lịch từ Nhà cổ Baoh Dana",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWzz5wVWN2Rre_bf3lzTZ89szZW61A19gyuIM1D6eHB2bgjSvLJ2IjqYRR2_FvWNOaiuYH_mZKTaaCYHyrAo6Y-MHZRm5QMjTQqVYlWO-UTZpP7j-38TvaXGvTC0E43MbjaK6OcYizspkYPA97vZ7ux2qQedU074FLdyFMB7zxmwJM_GGaJUJxVOmC--t3UtTdUYuMj2PhxbPFLX9SyKZLF-p5BPhi_fHZpOUSInajqnNWFka72rYwew=s0",
    link: "/tour",
    order: 4,
    isActive: true,
  },
  {
    id: 5,
    title: "Vệ Tinh Khám Phá: Làng Gốm Bàu Trúc & Dệt Mỹ Nghiệp",
    subtitle: "Di sản phi vật thể nhân loại UNESCO cách Palei Baoh Dana chỉ ít phút di chuyển",
    image: "/images/dana-life/IMG_9911.JPG",
    link: "/tour",
    order: 5,
    isActive: true,
  },
];

const DEFAULT_SITE_INFO = {
  siteName: "Dana Community Tourism",
  tagline: "Bảo tồn & phát huy giá trị di sản văn hóa Champa",
  description:
    "Cổng thông tin chuyên sâu về khảo cứu lịch sử, kiến trúc đền tháp Kalan, làng nghề gốm cổ Bàu Trúc, dệt thổ cẩm Mỹ Nghiệp và du lịch di sản cộng đồng Chăm.",
  contactEmail: "admin@danacommunity.vn",
  contactPhone: "0976 029 004",
  address: "Thôn Chất Thường, Xã Phước Hậu, Huyện Ninh Phước, Tỉnh Ninh Thuận",
};

class AdminService {
  constructor() {
    this.mockArtisans = new Map([
      [
        1,
        {
          id: 1,
          name: "Muk Đàng Thị Phan",
          slug: "muk-dang-thi-phan",
          title: "Nghệ nhân Ưu tú Bàu Trúc",
          experience: "58 năm giữ lửa • Đệ nhất bàn tay vàng gốm mẹ",
          years_of_dedication: 58,
          village: "Làng gốm Bàu Trúc",
          specialty: "Gốm đất nung lộ thiên không bàn xoay",
          achievements: [
            "Nghệ nhân Ưu tú được Chủ tịch nước phong tặng",
            "Đại diện Việt Nam trình diễn di sản tại UNESCO Paris",
            "Truyền dạy kỹ thuật làm gốm cho hơn 120 học viên trẻ",
          ],
          workshop_location: "Khu phố Bàu Trúc, Thị trấn Phước Dân, Ninh Phước",
          quote:
            "Người Chăm làm gốm bằng đôi chân đi giật lùi, xoay quanh chiếc trụ đất. Đất dẻo theo tâm người, lửa đỏ theo lòng người. Mình thương đất thì đất nuôi mình sống rạng rỡ.",
          bio: "Muk Phan là một trong những nghệ nhân tiêu biểu đại diện Việt Nam tham gia trình diễn tại trụ sở UNESCO Paris khi di sản gốm Chăm được ghi danh. Tại Bàu Trúc, bà đã truyền dạy kỹ thuật làm gốm không bàn xoay cho hơn 3 thế hệ con gái trong làng, bảo tồn trọn vẹn hồn cốt văn hóa mẫu hệ.",
          schedule: "Lớp truyền dạy & Đón khách: Thứ Bảy & Chủ Nhật hàng tuần (08:30 - 16:30)",
          avatar_image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBGoBQ0YTbgeC_aU74pGXo1oL2EIQvXidi293uM-D3IC3ytJg2Kb6n6-zQS893aL4Y-1ZeWUHgOy0CXn1RYU6Xg5ERRBTu44GX82RIfmSysT1lBGe11NxBc90UySzTISL4VfCfy2kwAwDqdhlo7-qSU4n9Wq149H7EgzP6jyN0S770xNmbtg8Bb8Sgmfn2GG91FQp1KF8UL6tZrnZDkKMgDqHyyIWjTGrAQtlhGDBIJVsnjy0rGg1nHJw",
          hands_image: "/images/dana-life/IMG_9911.JPG",
          badge_class: "bg-primary text-on-primary",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      [
        2,
        {
          id: 2,
          name: "Nghệ nhân Phú Thị Mỡ",
          slug: "nghe-nhan-phu-thi-mo",
          title: "Nghệ nhân Thổ cẩm Mỹ Nghiệp",
          experience: "45 năm dệt khung • Bậc thầy đồ án hoa văn Katê",
          years_of_dedication: 45,
          village: "Làng dệt Mỹ Nghiệp",
          specialty: "Dệt luồn hoa văn cổ hoàng cung & Thảo mộc tự nhiên",
          achievements: [
            "Phục dựng thành công 20+ mẫu hoa văn Champa thế kỷ XVII",
            "Nghệ nhân Bàn Tay Vàng Làng nghề truyền thống Việt Nam",
            "Chủ nhiệm Hợp tác xã Dệt Thổ cẩm Mỹ Nghiệp",
          ],
          workshop_location: "Hợp tác xã Thổ cẩm Mỹ Nghiệp, Ninh Phước, Ninh Thuận",
          quote:
            "Hoa văn quả trám, hình thần Shiva hay chim công không chỉ để đẹp. Đó là chữ viết không lời của phụ nữ Chăm gởi gắm cho chồng con lúc đi làm xa.",
          bio: "Bà Phú Thị Mỡ đã phục dựng thành công hơn 20 mẫu hoa văn hoàng cung Champa thế kỷ XVII tưởng chừng đã thất truyền, hoàn toàn sử dụng phẩm màu nhuộm từ thảo mộc thiên nhiên vùng đồi cát như vỏ trâm bầu, củ nâu và rễ cây rừng.",
          schedule: "Không gian dệt: Hợp tác xã Dệt Mỹ Nghiệp • Đón khách các ngày trong tuần",
          avatar_image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA9DOa0kU9XPSC4ElDUYdkw-HVXrxst6qmjl-lUQl29coyB3dJ9-vQbqfdakYBl6jppcYvq7Nih94eJY0xa602x9Lm9fSWkwUkez46Mou_js76LipE83WzU-xNC6p9A37bPiJRQnRypjtRBqPGz3udpwc7pbWEAirI405yrHUOQpBqIg_hKppN7Wr772Erm11GCx3XktevmV50KpaZjljmWw7I8dpauAhny2KblbS9-SwL6i64m5yCz0A",
          hands_image: "/images/dana-life/IMG_3237.JPG",
          badge_class: "bg-secondary text-on-secondary",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      [
        3,
        {
          id: 3,
          name: "Nghệ nhân Đàng Xem",
          slug: "nghe-nhan-dang-xem",
          title: "Bậc Thầy Chế Tác Nhạc Cụ Chăm",
          experience: "48 năm giữ nhịp • Truyền nhân thanh âm thiêng Katê",
          years_of_dedication: 48,
          village: "Làng Chăm Hữu Đức",
          specialty: "Chế tác trọn bộ nhạc khí: Kèn Saranai, Trống Paranưng & Ginăng",
          achievements: [
            "Bậc thầy chế tác nhạc cụ nghi lễ tiêu biểu vùng Panduranga",
            "Nghệ nhân diễn xướng chính các mùa lễ hội Katê tháp Po Klong Garai",
            "Đào tạo hơn 40 học trò giữ lửa nhạc khí dân tộc",
          ],
          workshop_location: "Thôn Hữu Đức, Xã Phước Hữu, Huyện Ninh Phước",
          quote:
            "Kèn Saranai làm từ gỗ mun, kẹp dăm lá buông thiêng. Tiếng kèn cất lên như ngọn gió Panduranga thổi bùng ký ức tiền nhân trong ngày hội Katê.",
          bio: "Nghệ nhân Đàng Xem là bậc thầy hiếm hoi nắm giữ bí quyết chế tác thủ công trọn vẹn bộ ba nhạc khí nghi lễ Chăm: Kèn Saranai, Trống Paranưng và Trống Ginăng. Mỗi nhạc cụ qua tay ông đều được thử âm trực tiếp tại chân tháp cổ.",
          schedule: "Không gian diễn xướng Hữu Đức • Đón khách theo lịch hẹn trước",
          avatar_image: "/images/dana-life/IMG_9901.JPG",
          hands_image: "/images/dana-life/IMG_9901.JPG",
          badge_class: "bg-primary text-on-primary",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      [
        4,
        {
          id: 4,
          name: "Nghệ nhân Đàng Năng Xoay",
          slug: "nghe-nhan-dang-nang-xoay",
          title: "Nghệ nhân Điêu Khắc Gốm Phù Điêu",
          experience: "42 năm tạo tác • Phục dựng mỹ thuật đền tháp",
          years_of_dedication: 42,
          village: "Làng gốm Bàu Trúc",
          specialty: "Điêu khắc phù điêu thần thoại Champa & Gốm mỹ nghệ cổ vật",
          achievements: [
            "Giải thưởng Tinh hoa Làng nghề Gốm Việt Nam",
            "Tác giả hơn 50 tác phẩm phù điêu Apsara cỡ lớn tại các bảo tàng di sản",
          ],
          workshop_location: "Xưởng điêu khắc gốm mỹ nghệ, Làng Bàu Trúc, Ninh Thuận",
          quote:
            "Từng thớ đất sét sông Quao qua bàn tay miết không cần bàn xoay, khi chạm khắc phù điêu Apsara là lúc linh hồn đền tháp sống lại trong từng vệt khói.",
          bio: "Nghệ nhân Đàng Năng Xoay nổi tiếng với tài nghệ kết hợp gốm Bàu Trúc nung lộ thiên cùng nghệ thuật điêu khắc tượng thần, phù điêu Champa cổ được trưng bày tại nhiều triển lãm văn hóa trong và ngoài nước.",
          schedule: "Xưởng gốm mỹ nghệ Bàu Trúc • Đón khách tham quan & học chạm khắc hàng ngày",
          avatar_image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAd_yrvnJ_UmdnGzLVXjm5HJfxWX-epAuAP73cohAxtCHVP56EKuM52m07N2hY1obT1_Wmh6lUgDS8Ye5va33Sp_Ih3JQB5vwCQfB9tHTZWaggCM2XqEUXoaNx_-AKFbm6o3Qlh0IJLDyt4WaVcS1eO4R7ER_r7FvmnriVoglYc2JHMEote5IwsaQ4KO5jEbpEvgMErIntFFp0iOdJghlh9P7kXsJrT1xrzKEBAkfFj9OWLDV8DTpPJsg",
          hands_image: "/images/dana-life/IMG_9898.JPG",
          badge_class: "bg-primary text-on-primary",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    ]);

    this.mockCraftCategories = [
      {
        id: "gom-bau-truc",
        label: "Gốm Bàu Trúc",
        village: "Làng gốm Bàu Trúc",
        description: "Gốm đất nung lộ thiên không bàn xoay độc bản.",
        display_order: 1,
      },
      {
        id: "tho-cam-my-nghiep",
        label: "Thổ Cẩm Mỹ Nghiệp",
        village: "Làng dệt Mỹ Nghiệp",
        description: "Vải dệt thủ công hoa văn di sản Champa.",
        display_order: 2,
      },
      {
        id: "nhac-cu-huu-duc",
        label: "Nhạc Khí Hữu Đức",
        village: "Làng Chăm Hữu Đức",
        description: "Nhạc cụ truyền thống nghi lễ Katê.",
        display_order: 3,
      },
      {
        id: "dieu-khac-my-nghe",
        label: "Điêu Khắc Mỹ Nghệ",
        village: "Làng gốm Bàu Trúc",
        description: "Điêu khắc phù điêu tượng thần Champa.",
        display_order: 4,
      },
    ];

    this.mockCraftProducts = new Map([
      [
        "sp-01",
        {
          id: "sp-01",
          name: "Bình Gốm Ngấn Khói Bàu Trúc Cổ Truyền",
          slug: "binh-gom-ngan-khoi-bau-truc",
          category_id: "gom-bau-truc",
          village: "Làng gốm Bàu Trúc",
          artisan_id: 1,
          price_estimate: "1.850.000 ₫",
          raw_price: 1850000,
          materials: ["Đất sét trầm tích sông Quao", "Cát mịn mỏ đất hạt thô", "Khói rơm & vỏ trấu lộ thiên"],
          dimensions: "Cao 45cm x Đường kính 28cm (Trọng lượng ~4.2kg)",
          crafting_time: "18 - 22 ngày tạo tác",
          badge: "Độc bản UNESCO",
          badge_type: "unesco",
          summary:
            "Bình gốm vuốt tay thủ công 100% không bàn xoay, vệt khói loang độc bản hình thành tự nhiên trong hỏa lò lộ thiên rực rỡ.",
          description:
            "Tác phẩm tiêu biểu của Nghệ nhân Ưu tú Muk Đàng Thị Phan. Sử dụng kỹ thuật đi giật lùi truyền thống quay quanh khối đất nguyên bản. Từng đường vuốt ngón tay miết từ đáy lên miệng bình tạo nên độ cong thanh thoát.",
          cultural_meaning:
            "Hình dáng bình tượng trưng cho bầu vú Mẹ Xứ Sở Po Ino Nagar – cội nguồn sinh dưỡng của muôn loài. Đặt trong không gian sống mang lại năng lượng tĩnh tại, mộc mạc và chở che.",
          crafting_steps: [
            {
              step: 1,
              title: "Khai thác & Ủ đất sông Quao",
              description: "Đất sét dẻo mịn lấy sâu dưới lòng sông Quao, phơi nỏ và đập nhỏ rồi ủ nước 7 ngày.",
            },
            {
              step: 2,
              title: "Đi giật lùi nắn vuốt tạo hình",
              description: "Nghệ nhân dùng chân và thân mình xoay giật lùi quanh trụ đất, miết vải ướt tạo dáng.",
            },
          ],
          images: [
            "/images/dana-life/IMG_9911.JPG",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAd_yrvnJ_UmdnGzLVXjm5HJfxWX-epAuAP73cohAxtCHVP56EKuM52m07N2hY1obT1_Wmh6lUgDS8Ye5va33Sp_Ih3JQB5vwCQfB9tHTZWaggCM2XqEUXoaNx_-AKFbm6o3Qlh0IJLDyt4WaVcS1eO4R7ER_r7FvmnriVoglYc2JHMEote5IwsaQ4KO5jEbpEvgMErIntFFp0iOdJghlh9P7kXsJrT1xrzKEBAkfFj9OWLDV8DTpPJsg",
          ],
          is_featured: true,
          preservation_status: "Di sản phi vật thể đại diện nhân loại (UNESCO)",
          stock_quantity: 3,
          views_count: 450,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      [
        "sp-02",
        {
          id: "sp-02",
          name: "Khăn Choàng Thổ Cẩm Hoa Văn Chim Công Katê",
          slug: "khan-choang-tho-cam-hoa-van-chim-cong-kate",
          category_id: "tho-cam-my-nghiep",
          village: "Làng dệt Mỹ Nghiệp",
          artisan_id: 2,
          price_estimate: "1.250.000 ₫",
          raw_price: 1250000,
          materials: ["Sợi bông thiên nhiên", "Nhuộm vỏ trâm bầu & rễ cây rừng"],
          dimensions: "Dài 185cm x Rộng 60cm",
          crafting_time: "12 ngày dệt tay",
          badge: "Hoa văn Katê cổ",
          badge_type: "traditional",
          summary:
            "Khăn choàng dệt thủ công trên khung cửi cổ, tái hiện hoa văn chim công Makara biểu trưng quý tộc Champa.",
          description:
            "Tác phẩm thủ công của Nghệ nhân Phú Thị Mỡ với họa tiết chim công hoàng gia đối xứng.",
          cultural_meaning:
            "Chim công Makara mang lại may mắn, thanh khiết và phẩm giá cao quý của người phụ nữ Chăm.",
          crafting_steps: [],
          images: ["/images/dana-life/IMG_3237.JPG"],
          is_featured: true,
          preservation_status: "Bảo tồn làng nghề truyền thống",
          stock_quantity: 5,
          views_count: 380,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    ]);
  }
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
          productCount,
          artisanCount,
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

          // Tổng tác phẩm thủ công
          db("craft_products")
            .select(
              db.raw("COUNT(*) as total"),
              db.raw("COUNT(CASE WHEN is_featured = true THEN 1 END) as featured"),
              db.raw("COUNT(CASE WHEN stock_quantity <= 0 THEN 1 END) as out_of_stock")
            )
            .first()
            .catch(() => ({ total: 8, featured: 4, out_of_stock: 0 })),

          // Tổng nghệ nhân
          db("artisans")
            .select(
              db.raw("COUNT(*) as total"),
              db.raw("COUNT(CASE WHEN is_active = true THEN 1 END) as active")
            )
            .first()
            .catch(() => ({ total: 4, active: 4 })),
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
          products: {
            total: parseInt(productCount?.total || "8", 10),
            featured: parseInt(productCount?.featured || "4", 10),
            outOfStock: parseInt(productCount?.out_of_stock || "0", 10),
          },
          artisans: {
            total: parseInt(artisanCount?.total || "4", 10),
            active: parseInt(artisanCount?.active || "4", 10),
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
      products: { total: 8, featured: 4, outOfStock: 0 },
      artisans: { total: 4, active: 4 },
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

  async updateTag(id, data, actor) {
    if (!db) throw new Error("Cơ sở dữ liệu chưa sẵn sàng!");

    const tag = await db("tags").where("id", id).first();
    if (!tag) {
      const err = new Error("Thẻ không tồn tại!");
      err.status = 404;
      throw err;
    }

    const name = data.name?.trim();
    if (!name) throw new Error("Tên thẻ không được để trống!");
    const slug = data.slug?.trim() ? this._slugify(data.slug) : this._slugify(name);

    // Kiểm tra trùng lặp với thẻ khác
    const conflict = await db("tags")
      .where((builder) => builder.where("name", name).orWhere("slug", slug))
      .whereNot("id", id)
      .first();

    if (conflict) {
      const err = new Error(`Thẻ "${name}" hoặc đường dẫn "${slug}" đã tồn tại!`);
      err.status = 400;
      throw err;
    }

    const [updated] = await db("tags")
      .where("id", id)
      .update({ name, slug })
      .returning("*");

    await activityLogService.logActivity({
      actor,
      action: "TAG_UPDATE",
      targetType: "tag",
      targetId: String(id),
      targetTitle: name,
      details: { old_name: tag.name, new_name: name, old_slug: tag.slug, new_slug: slug },
    });

    return updated;
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
      if (
        !settings.site_info ||
        settings.site_info.contactEmail === "contact@champaweb.vn" ||
        (settings.site_info.siteName && settings.site_info.siteName.includes("ChampaWeb"))
      ) {
        settings.site_info = {
          ...DEFAULT_SITE_INFO,
          ...(settings.site_info || {}),
          siteName: DEFAULT_SITE_INFO.siteName,
          tagline: DEFAULT_SITE_INFO.tagline,
          description: DEFAULT_SITE_INFO.description,
          contactEmail: DEFAULT_SITE_INFO.contactEmail,
          contactPhone: DEFAULT_SITE_INFO.contactPhone,
          address: DEFAULT_SITE_INFO.address,
        };
      }
      if (settings.seo_defaults && settings.seo_defaults.metaTitle && settings.seo_defaults.metaTitle.includes("ChampaWeb")) {
        settings.seo_defaults.metaTitle = settings.seo_defaults.metaTitle.replace(/ChampaWeb/gi, "Dana Community");
      }
      if (settings.social_links && settings.social_links.zalo && settings.social_links.zalo.includes("champaweb")) {
        settings.social_links.zalo = settings.social_links.zalo.replace(/champaweb/gi, "danacommunity");
      }
      if (!settings.home_carousel || !Array.isArray(settings.home_carousel) || settings.home_carousel.length === 0) {
        settings.home_carousel = DEFAULT_CAROUSEL_SLIDES;
      }
      return settings;
    }
    return {
      site_info: DEFAULT_SITE_INFO,
      home_carousel: DEFAULT_CAROUSEL_SLIDES,
    };
  }

  async getPublicSettings() {
    const settings = await this.getSettings();
    return {
      site_info: settings.site_info || null,
      seo_defaults: settings.seo_defaults || null,
      social_links: settings.social_links || null,
      home_carousel: Array.isArray(settings.home_carousel)
        ? settings.home_carousel.filter((s) => s.isActive !== false)
        : DEFAULT_CAROUSEL_SLIDES,
    };
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
  // 7. ARTISANS MANAGEMENT (HỒ SƠ NGHỆ NHÂN CHĂM)
  // =========================================================================
  async getArtisans({ search = "", village = "all", isActive = "all", page = 1, limit = 15 } = {}) {
    if (db) {
      try {
        let query = db("artisans as a")
          .leftJoin("craft_products as p", "a.id", "p.artisan_id")
          .select(
            "a.id",
            "a.name",
            "a.slug",
            "a.title",
            "a.experience",
            "a.years_of_dedication",
            "a.village",
            "a.specialty",
            "a.achievements",
            "a.workshop_location",
            "a.quote",
            "a.bio",
            "a.schedule",
            "a.avatar_image",
            "a.hands_image",
            "a.badge_class",
            "a.is_active",
            "a.created_at",
            "a.updated_at",
            db.raw("COUNT(p.id) as product_count")
          )
          .groupBy("a.id");

        if (village && village !== "all") {
          query = query.where("a.village", "ilike", `%${village}%`);
        }

        if (isActive !== "all") {
          query = query.where("a.is_active", isActive === "true" || isActive === true);
        }

        if (search && search.trim()) {
          const q = `%${search.trim()}%`;
          query = query.where(function () {
            this.where("a.name", "ilike", q)
              .orWhere("a.title", "ilike", q)
              .orWhere("a.specialty", "ilike", q);
          });
        }

        const countQuery = db("artisans as a");
        if (village && village !== "all") countQuery.where("a.village", "ilike", `%${village}%`);
        if (isActive !== "all") countQuery.where("a.is_active", isActive === "true" || isActive === true);
        if (search && search.trim()) {
          const q = `%${search.trim()}%`;
          countQuery.where(function () {
            this.where("a.name", "ilike", q).orWhere("a.title", "ilike", q).orWhere("a.specialty", "ilike", q);
          });
        }
        const countRes = await countQuery.count("a.id as count").first();
        const total = parseInt(countRes?.count || "0", 10);

        const artisans = await query
          .orderBy("a.years_of_dedication", "desc")
          .limit(limit)
          .offset((page - 1) * limit);

        return {
          artisans: artisans.map((a) => ({
            ...a,
            product_count: parseInt(a.product_count || "0", 10),
            achievements: typeof a.achievements === "string" ? JSON.parse(a.achievements) : a.achievements || [],
          })),
          total,
          page,
          limit,
        };
      } catch (err) {
        console.warn("⚠️ [AdminService] Lỗi lấy danh sách nghệ nhân DB, dùng fallback in-memory:", err.message);
      }
    }

    // Fallback in-memory
    let list = Array.from(this.mockArtisans.values());
    if (village && village !== "all") {
      list = list.filter((a) => a.village.toLowerCase().includes(village.toLowerCase()));
    }
    if (isActive !== "all") {
      const activeBool = isActive === "true" || isActive === true;
      list = list.filter((a) => a.is_active === activeBool);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          (a.specialty && a.specialty.toLowerCase().includes(q))
      );
    }
    const total = list.length;
    const paginated = list.slice((page - 1) * limit, page * limit);
    return { artisans: paginated, total, page, limit };
  }

  async getArtisanById(id) {
    const numId = parseInt(id, 10);
    if (db) {
      try {
        const artisan = await db("artisans").where("id", numId).first();
        if (artisan) {
          const products = await db("craft_products")
            .where("artisan_id", numId)
            .select("id", "name", "slug", "images", "price_estimate", "village", "is_featured");
          return {
            ...artisan,
            achievements: typeof artisan.achievements === "string" ? JSON.parse(artisan.achievements) : artisan.achievements || [],
            products,
          };
        }
      } catch (err) {
        console.warn("⚠️ [AdminService] getArtisanById DB error:", err.message);
      }
    }

    const artisan = this.mockArtisans.get(numId);
    if (!artisan) return null;
    const products = Array.from(this.mockCraftProducts.values()).filter((p) => p.artisan_id === numId);
    return { ...artisan, products };
  }

  async createArtisan(data, actor) {
    if (!data.name || !data.name.trim()) {
      throw new Error("Họ tên nghệ nhân không được để trống!");
    }
    if (!data.village || !data.village.trim()) {
      throw new Error("Làng nghề không được để trống!");
    }

    const name = data.name.trim();
    const slug = data.slug?.trim() ? this._slugify(data.slug) : this._slugify(name);
    const achievements = Array.isArray(data.achievements) ? data.achievements : [];

    const newRecord = {
      name,
      slug,
      title: data.title?.trim() || "Nghệ nhân Chăm",
      experience: data.experience?.trim() || "",
      years_of_dedication: data.years_of_dedication ? parseInt(data.years_of_dedication, 10) : 0,
      village: data.village.trim(),
      specialty: data.specialty?.trim() || "",
      achievements: JSON.stringify(achievements),
      workshop_location: data.workshop_location?.trim() || "",
      quote: data.quote?.trim() || "",
      bio: data.bio?.trim() || "Nghệ nhân gìn giữ di sản văn hóa Champa.",
      schedule: data.schedule?.trim() || "Đón khách các ngày trong tuần",
      avatar_image:
        data.avatar_image ||
        data.avatarUrl ||
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
      hands_image: data.hands_image || null,
      badge_class: data.badge_class || "bg-amber-100 text-amber-900 border-amber-300",
      is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    let createdRecord = null;
    if (db) {
      try {
        const [inserted] = await db("artisans").insert(newRecord).returning("*");
        createdRecord = inserted;
      } catch (err) {
        console.warn("⚠️ [AdminService] Lỗi insert artisan DB, dùng fallback:", err.message);
      }
    }

    if (!createdRecord) {
      const nextId = Math.max(0, ...Array.from(this.mockArtisans.keys())) + 1;
      createdRecord = { id: nextId, ...newRecord, achievements };
      this.mockArtisans.set(nextId, createdRecord);
    }

    await activityLogService.logActivity({
      actor,
      action: "ARTISAN_CREATE",
      targetType: "artisan",
      targetId: String(createdRecord.id),
      targetTitle: createdRecord.name,
      details: { village: createdRecord.village, title: createdRecord.title },
    });

    return createdRecord;
  }

  async updateArtisan(id, data, actor) {
    const numId = parseInt(id, 10);
    const existing = await this.getArtisanById(numId);
    if (!existing) {
      const err = new Error("Không tìm thấy nghệ nhân để cập nhật!");
      err.status = 404;
      throw err;
    }

    const payload = {
      updated_at: new Date(),
    };

    if (data.name !== undefined) {
      payload.name = data.name.trim();
      if (!payload.name) throw new Error("Họ tên nghệ nhân không được để trống!");
    }
    if (data.slug !== undefined && data.slug.trim()) payload.slug = this._slugify(data.slug);
    if (data.title !== undefined) payload.title = data.title.trim();
    if (data.experience !== undefined) payload.experience = data.experience.trim();
    if (data.years_of_dedication !== undefined) payload.years_of_dedication = parseInt(data.years_of_dedication, 10);
    if (data.village !== undefined) payload.village = data.village.trim();
    if (data.specialty !== undefined) payload.specialty = data.specialty.trim();
    if (data.achievements !== undefined) {
      payload.achievements = Array.isArray(data.achievements) ? JSON.stringify(data.achievements) : data.achievements;
    }
    if (data.workshop_location !== undefined) payload.workshop_location = data.workshop_location.trim();
    if (data.quote !== undefined) payload.quote = data.quote.trim();
    if (data.bio !== undefined) payload.bio = data.bio.trim();
    if (data.schedule !== undefined) payload.schedule = data.schedule.trim();
    if (data.avatar_image !== undefined) payload.avatar_image = data.avatar_image;
    if (data.hands_image !== undefined) payload.hands_image = data.hands_image;
    if (data.badge_class !== undefined) payload.badge_class = data.badge_class;
    if (data.is_active !== undefined) payload.is_active = Boolean(data.is_active);

    let updatedRecord = null;
    if (db) {
      try {
        const [updated] = await db("artisans").where("id", numId).update(payload).returning("*");
        updatedRecord = updated;
      } catch (err) {
        console.warn("⚠️ [AdminService] updateArtisan DB error:", err.message);
      }
    }

    if (!updatedRecord) {
      const current = this.mockArtisans.get(numId);
      updatedRecord = {
        ...current,
        ...payload,
        achievements: Array.isArray(data.achievements) ? data.achievements : current.achievements,
      };
      this.mockArtisans.set(numId, updatedRecord);
    }

    await activityLogService.logActivity({
      actor,
      action: "ARTISAN_UPDATE",
      targetType: "artisan",
      targetId: String(numId),
      targetTitle: updatedRecord.name,
      details: { village: updatedRecord.village },
    });

    return updatedRecord;
  }

  async deleteArtisan(id, actor) {
    const numId = parseInt(id, 10);
    const existing = await this.getArtisanById(numId);
    if (!existing) {
      const err = new Error("Không tìm thấy nghệ nhân để xóa!");
      err.status = 404;
      throw err;
    }

    if (db) {
      try {
        await db("craft_products").where("artisan_id", numId).update({ artisan_id: null });
        await db("artisans").where("id", numId).delete();
      } catch (err) {
        console.warn("⚠️ [AdminService] deleteArtisan DB error:", err.message);
      }
    }

    this.mockArtisans.delete(numId);
    for (const [, p] of this.mockCraftProducts.entries()) {
      if (p.artisan_id === numId) {
        p.artisan_id = null;
      }
    }

    await activityLogService.logActivity({
      actor,
      action: "ARTISAN_DELETE",
      targetType: "artisan",
      targetId: String(numId),
      targetTitle: existing.name,
      details: { village: existing.village },
    });

    return { success: true, message: `Đã xóa nghệ nhân "${existing.name}" thành công.` };
  }

  // =========================================================================
  // 8. CRAFT PRODUCTS MANAGEMENT (TÁC PHẨM LÀNG NGHỀ CHĂM)
  // =========================================================================
  async getProducts({
    search = "",
    category = "all",
    village = "all",
    artisanId = "all",
    isFeatured = "all",
    page = 1,
    limit = 12,
  } = {}) {
    if (db) {
      try {
        let query = db("craft_products as p")
          .leftJoin("craft_categories as c", "p.category_id", "c.id")
          .leftJoin("artisans as a", "p.artisan_id", "a.id")
          .select(
            "p.id",
            "p.name",
            "p.slug",
            "p.category_id",
            "c.label as category_label",
            "p.village",
            "p.artisan_id",
            "a.name as artisan_name",
            "a.title as artisan_title",
            "a.avatar_image as artisan_avatar",
            "p.price_estimate",
            "p.raw_price",
            "p.materials",
            "p.dimensions",
            "p.crafting_time",
            "p.badge",
            "p.badge_type",
            "p.summary",
            "p.description",
            "p.cultural_meaning",
            "p.crafting_steps",
            "p.images",
            "p.is_featured",
            "p.preservation_status",
            "p.stock_quantity",
            "p.views_count",
            "p.created_at",
            "p.updated_at"
          );

        if (category && category !== "all") {
          query = query.where("p.category_id", category);
        }

        if (village && village !== "all") {
          query = query.where("p.village", "ilike", `%${village}%`);
        }

        if (artisanId && artisanId !== "all") {
          query = query.where("p.artisan_id", parseInt(artisanId, 10));
        }

        if (isFeatured !== "all") {
          query = query.where("p.is_featured", isFeatured === "true" || isFeatured === true);
        }

        if (search && search.trim()) {
          const q = `%${search.trim()}%`;
          query = query.where(function () {
            this.where("p.name", "ilike", q)
              .orWhere("p.id", "ilike", q)
              .orWhere("p.slug", "ilike", q)
              .orWhere("a.name", "ilike", q);
          });
        }

        const countQuery = db("craft_products as p");
        if (category && category !== "all") countQuery.where("p.category_id", category);
        if (village && village !== "all") countQuery.where("p.village", "ilike", `%${village}%`);
        if (artisanId && artisanId !== "all") countQuery.where("p.artisan_id", parseInt(artisanId, 10));
        if (isFeatured !== "all") countQuery.where("p.is_featured", isFeatured === "true" || isFeatured === true);
        if (search && search.trim()) {
          const q = `%${search.trim()}%`;
          countQuery.where(function () {
            this.where("p.name", "ilike", q).orWhere("p.id", "ilike", q).orWhere("p.slug", "ilike", q);
          });
        }
        const countRes = await countQuery.count("p.id as count").first();
        const total = parseInt(countRes?.count || "0", 10);

        const products = await query
          .orderBy("p.updated_at", "desc")
          .limit(limit)
          .offset((page - 1) * limit);

        return {
          products,
          total,
          page,
          limit,
        };
      } catch (err) {
        console.warn("⚠️ [AdminService] Lỗi lấy danh sách sản phẩm DB, dùng fallback in-memory:", err.message);
      }
    }

    // Fallback in-memory
    let list = Array.from(this.mockCraftProducts.values()).map((p) => {
      const cat = this.mockCraftCategories.find((c) => c.id === p.category_id);
      const art = p.artisan_id ? this.mockArtisans.get(p.artisan_id) : null;
      return {
        ...p,
        category_label: cat?.label || p.category_id,
        artisan_name: art?.name || "Nghệ nhân Làng nghề",
        artisan_title: art?.title || "",
        artisan_avatar: art?.avatar_image || "",
      };
    });

    if (category && category !== "all") {
      list = list.filter((p) => p.category_id === category);
    }
    if (village && village !== "all") {
      list = list.filter((p) => p.village.toLowerCase().includes(village.toLowerCase()));
    }
    if (artisanId && artisanId !== "all") {
      list = list.filter((p) => p.artisan_id === parseInt(artisanId, 10));
    }
    if (isFeatured !== "all") {
      const featBool = isFeatured === "true" || isFeatured === true;
      list = list.filter((p) => p.is_featured === featBool);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          (p.artisan_name && p.artisan_name.toLowerCase().includes(q))
      );
    }

    const total = list.length;
    const paginated = list.slice((page - 1) * limit, page * limit);
    return { products: paginated, total, page, limit };
  }

  async getProductById(id) {
    if (db) {
      try {
        const product = await db("craft_products as p")
          .leftJoin("craft_categories as c", "p.category_id", "c.id")
          .leftJoin("artisans as a", "p.artisan_id", "a.id")
          .select(
            "p.*",
            "c.label as category_label",
            "a.name as artisan_name",
            "a.title as artisan_title",
            "a.avatar_image as artisan_avatar"
          )
          .where("p.id", id)
          .first();

        if (product) return product;
      } catch (err) {
        console.warn("⚠️ [AdminService] getProductById DB error:", err.message);
      }
    }

    const p = this.mockCraftProducts.get(id);
    if (!p) return null;
    const cat = this.mockCraftCategories.find((c) => c.id === p.category_id);
    const art = p.artisan_id ? this.mockArtisans.get(p.artisan_id) : null;
    return {
      ...p,
      category_label: cat?.label || p.category_id,
      artisan_name: art?.name || "Nghệ nhân Làng nghề",
      artisan_title: art?.title || "",
      artisan_avatar: art?.avatar_image || "",
    };
  }

  async createProduct(data, actor) {
    if (!data.name || !data.name.trim()) {
      throw new Error("Tên tác phẩm không được để trống!");
    }
    if (!data.category_id && !data.category) {
      throw new Error("Chuyên mục làng nghề không được để trống!");
    }

    const name = data.name.trim();
    const slug = data.slug?.trim() ? this._slugify(data.slug) : this._slugify(name);
    const id = data.id?.trim() || `sp-${Date.now().toString().slice(-4)}`;
    const category_id = data.category_id || data.category || "gom-bau-truc";
    const village = data.village?.trim() || "Làng gốm Bàu Trúc";
    const materials = Array.isArray(data.materials)
      ? data.materials
      : data.materials
      ? [data.materials]
      : [];
    const images =
      Array.isArray(data.images) && data.images.length > 0
        ? data.images
        : data.image
        ? [data.image]
        : ["/images/dana-life/IMG_9911.JPG"];
    const rawPrice =
      data.raw_price !== undefined
        ? parseFloat(data.raw_price)
        : data.rawPrice
        ? parseFloat(data.rawPrice)
        : 0;
    const priceEstimate =
      data.price_estimate?.trim() ||
      data.priceEstimate?.trim() ||
      (rawPrice > 0 ? `${rawPrice.toLocaleString("vi-VN")} ₫` : "Liên hệ báo giá");

    const newRecord = {
      id,
      name,
      slug,
      category_id,
      village,
      artisan_id: data.artisan_id
        ? parseInt(data.artisan_id, 10)
        : data.artisanId
        ? parseInt(data.artisanId, 10)
        : null,
      price_estimate: priceEstimate,
      raw_price: rawPrice,
      materials,
      dimensions: data.dimensions?.trim() || "",
      crafting_time: data.crafting_time?.trim() || data.craftingTime?.trim() || "",
      badge: data.badge?.trim() || "Độc bản",
      badge_type: data.badge_type || data.badgeType || "traditional",
      summary: data.summary?.trim() || "",
      description: data.description?.trim() || "",
      cultural_meaning: data.cultural_meaning?.trim() || data.culturalMeaning?.trim() || "",
      crafting_steps: Array.isArray(data.crafting_steps) ? JSON.stringify(data.crafting_steps) : "[]",
      images,
      is_featured:
        data.is_featured !== undefined
          ? Boolean(data.is_featured)
          : data.isFeatured !== undefined
          ? Boolean(data.isFeatured)
          : false,
      preservation_status:
        data.preservation_status?.trim() ||
        data.preservationStatus?.trim() ||
        "Bảo tồn làng nghề truyền thống",
      stock_quantity: data.stock_quantity !== undefined ? parseInt(data.stock_quantity, 10) : 1,
      views_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    let createdRecord = null;
    if (db) {
      try {
        const [inserted] = await db("craft_products").insert(newRecord).returning("*");
        createdRecord = inserted;
      } catch (err) {
        console.warn("⚠️ [AdminService] Lỗi insert craft_products DB, dùng fallback:", err.message);
      }
    }

    if (!createdRecord) {
      createdRecord = { ...newRecord, crafting_steps: [] };
      this.mockCraftProducts.set(id, createdRecord);
    }

    await activityLogService.logActivity({
      actor,
      action: "PRODUCT_CREATE",
      targetType: "product",
      targetId: id,
      targetTitle: newRecord.name,
      details: { category: category_id, village },
    });

    return createdRecord;
  }

  async updateProduct(id, data, actor) {
    const existing = await this.getProductById(id);
    if (!existing) {
      const err = new Error("Không tìm thấy tác phẩm để cập nhật!");
      err.status = 404;
      throw err;
    }

    const payload = {
      updated_at: new Date(),
    };

    if (data.name !== undefined) {
      payload.name = data.name.trim();
      if (!payload.name) throw new Error("Tên tác phẩm không được để trống!");
    }
    if (data.slug !== undefined && data.slug.trim()) payload.slug = this._slugify(data.slug);
    if (data.category_id !== undefined || data.category !== undefined) {
      payload.category_id = data.category_id || data.category;
    }
    if (data.village !== undefined) payload.village = data.village.trim();
    if (data.artisan_id !== undefined) {
      payload.artisan_id = data.artisan_id ? parseInt(data.artisan_id, 10) : null;
    }
    if (data.price_estimate !== undefined || data.priceEstimate !== undefined) {
      payload.price_estimate = data.price_estimate?.trim() || data.priceEstimate?.trim();
    }
    if (data.raw_price !== undefined || data.rawPrice !== undefined) {
      payload.raw_price = parseFloat(data.raw_price ?? data.rawPrice);
    }
    if (data.materials !== undefined) {
      payload.materials = Array.isArray(data.materials) ? data.materials : [data.materials];
    }
    if (data.dimensions !== undefined) payload.dimensions = data.dimensions.trim();
    if (data.crafting_time !== undefined || data.craftingTime !== undefined) {
      payload.crafting_time = data.crafting_time?.trim() || data.craftingTime?.trim();
    }
    if (data.badge !== undefined) payload.badge = data.badge.trim();
    if (data.badge_type !== undefined || data.badgeType !== undefined) {
      payload.badge_type = data.badge_type || data.badgeType;
    }
    if (data.summary !== undefined) payload.summary = data.summary.trim();
    if (data.description !== undefined) payload.description = data.description.trim();
    if (data.cultural_meaning !== undefined || data.culturalMeaning !== undefined) {
      payload.cultural_meaning = data.cultural_meaning?.trim() || data.culturalMeaning?.trim();
    }
    if (data.crafting_steps !== undefined) {
      payload.crafting_steps = Array.isArray(data.crafting_steps)
        ? JSON.stringify(data.crafting_steps)
        : data.crafting_steps;
    }
    if (data.images !== undefined) {
      payload.images = Array.isArray(data.images) ? data.images : [data.images];
    }
    if (data.is_featured !== undefined || data.isFeatured !== undefined) {
      payload.is_featured = Boolean(data.is_featured ?? data.isFeatured);
    }
    if (data.preservation_status !== undefined || data.preservationStatus !== undefined) {
      payload.preservation_status = data.preservation_status?.trim() || data.preservationStatus?.trim();
    }
    if (data.stock_quantity !== undefined) {
      payload.stock_quantity = parseInt(data.stock_quantity, 10);
    }

    let updatedRecord = null;
    if (db) {
      try {
        const [updated] = await db("craft_products").where("id", id).update(payload).returning("*");
        updatedRecord = updated;
      } catch (err) {
        console.warn("⚠️ [AdminService] updateProduct DB error:", err.message);
      }
    }

    if (!updatedRecord) {
      const current = this.mockCraftProducts.get(id);
      updatedRecord = {
        ...current,
        ...payload,
        materials: payload.materials || current.materials,
        images: payload.images || current.images,
      };
      this.mockCraftProducts.set(id, updatedRecord);
    }

    await activityLogService.logActivity({
      actor,
      action: "PRODUCT_UPDATE",
      targetType: "product",
      targetId: id,
      targetTitle: updatedRecord.name,
      details: { category: updatedRecord.category_id, stock: updatedRecord.stock_quantity },
    });

    return updatedRecord;
  }

  async deleteProduct(id, actor) {
    const existing = await this.getProductById(id);
    if (!existing) {
      const err = new Error("Không tìm thấy tác phẩm để xóa!");
      err.status = 404;
      throw err;
    }

    if (db) {
      try {
        await db("craft_products").where("id", id).delete();
      } catch (err) {
        console.warn("⚠️ [AdminService] deleteProduct DB error:", err.message);
      }
    }

    this.mockCraftProducts.delete(id);

    await activityLogService.logActivity({
      actor,
      action: "PRODUCT_DELETE",
      targetType: "product",
      targetId: id,
      targetTitle: existing.name,
      details: { category: existing.category_id },
    });

    return { success: true, message: `Đã xóa tác phẩm "${existing.name}" thành công.` };
  }

  // =========================================================================
  // 9. CRAFT CATEGORIES
  // =========================================================================
  async getCraftCategories() {
    if (db) {
      try {
        const categories = await db("craft_categories as c")
          .leftJoin("craft_products as p", "c.id", "p.category_id")
          .select(
            "c.id",
            "c.label",
            "c.village",
            "c.description",
            "c.display_order",
            db.raw("COUNT(p.id) as product_count")
          )
          .groupBy("c.id")
          .orderBy("c.display_order", "asc");

        return categories.map((c) => ({
          ...c,
          product_count: parseInt(c.product_count || "0", 10),
        }));
      } catch (err) {
        console.warn("⚠️ [AdminService] getCraftCategories DB error:", err.message);
      }
    }

    return this.mockCraftCategories.map((c) => {
      const count = Array.from(this.mockCraftProducts.values()).filter((p) => p.category_id === c.id).length;
      return { ...c, product_count: count };
    });
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
