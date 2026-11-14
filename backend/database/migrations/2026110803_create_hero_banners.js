/**
 * Knex Migration: 2026110803_create_hero_banners.js
 * Quản lý phiên bản bảng CMS Quản trị: Hero Carousel Banners (Banners trình chiếu đầu trang)
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const hasHeroBanners = await knex.schema.hasTable("hero_banners");
  if (!hasHeroBanners) {
    await knex.schema.createTable("hero_banners", (table) => {
      table.increments("id").primary();
      table.string("title", 255).notNullable();
      table.string("subtitle", 255).nullable();
      table.string("category", 100).notNullable();
      table.text("image_url").notNullable();
      table.string("location", 255).nullable();
      table.string("date_display", 100).nullable();
      table.text("description").nullable();
      table.string("author", 100).nullable();
      table.string("link_url", 255).nullable();
      table.integer("display_order").defaultTo(0).index();
      table.boolean("is_active").defaultTo(true).index();
      table.string("position", 50).defaultTo("home_hero").index();
      table.timestamp("created_at").defaultTo(knex.fn.now()).index();
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });

    // Seed 5 slide ban đầu (Đồng bộ với dữ liệu di sản của DanaLifeCarousel)
    await knex("hero_banners").insert([
      {
        title: "Tháp Cổ Po Klong Garai - Đỉnh Cao Nghệ Thuật Champa",
        subtitle: "Quần thể đền tháp gạch nung thế kỷ XIII - Di tích Quốc gia đặc biệt",
        category: "Kiến Trúc Đền Tháp Kỳ Vĩ",
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBWzz5wVWN2Rre_bf3lzTZ89szZW61A19gyuIM1D6eHB2bgjSvLJ2IjqYRR2_FvWNOaiuYH_mZKTaaCYHyrAo6Y-MHZRm5QMjTQqVYlWO-UTZpP7j-38TvaXGvTC0E43MbjaK6OcYizspkYPA97vZ7ux2qQedU074FLdyFMB7zxmwJM_GGaJUJxVOmC--t3UtTdUYuMj2PhxbPFLX9SyKZLF-p5BPhi_fHZpOUSInajqnNWFka72rYwew",
        location: "Đồi Trầu, Phường Đô Vinh, TP. Phan Rang - Tháp Chàm (Cách trung tâm 7km)",
        date_display: "Xây dựng TK XIII - XIV",
        description:
          "Biểu tượng kiêu hãnh của xứ Panduranga với 3 tòa tháp Kalan chính, Gopura cổng và Kosagrha lửa. Nơi lưu giữ tượng Yoni - Linga thần Po Klong Garai cùng bia ký Sanskrit cổ ca ngợi công đức dẫn nước ngọt tưới mát đồng bằng.",
        author: "Điểm đến Di sản Số 1",
        link_url: "/tour",
        display_order: 1,
        is_active: true,
        position: "home_hero",
      },
      {
        title: "Làng Gốm Bàu Trúc - Kỹ Nghệ Đất Nung Không Bàn Xoay",
        subtitle: "Làng gốm cổ xưa nhất Đông Nam Á vẫn đỏ lửa nung lộ thiên",
        category: "Di Sản Văn Hóa Nhân Loại UNESCO",
        image_url: "/images/dana-life/IMG_9911.JPG",
        location: "Thị trấn Phước Dân, Huyện Ninh Phước (Cách Phan Rang 10km)",
        date_display: "Di sản UNESCO 2022",
        description:
          "Tận mắt chiêm ngưỡng phương thức 'tay làm chân quay, đi giật lùi' độc nhất vô nhị của phụ nữ Chăm. Gốm nung củi và rơm rạ ngoài trời tạo nên những vệt khói loang độc bản hòa quyện cùng nước thảo mộc trâm bầu.",
        author: "Làng nghề truyền thống",
        link_url: "/san-pham",
        display_order: 2,
        is_active: true,
        position: "home_hero",
      },
      {
        title: "Làng Dệt Thổ Cẩm Mỹ Nghiệp - Sợi Chỉ Vàng Katê",
        subtitle: "Phục dựng hơn 20 mẫu hoa văn hoàng gia Champa thế kỷ XVII",
        category: "Nghệ Thuật Sợi Dệt Cung Đình",
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDXDHM6yk37AcZTWKD2kHI9jPGZKP1I4JY5yxSnfX4BbftErgSz5JHk80zz2TUzC_obO4A9NMXDFx8yx6BPBGmoGhCEaCXQvDZl1oXbqVoWkpJ3biH8-ERIAfE760E73pitqQdKh1Cszx9wZVscKNWrs_AhSvA-Knlo8t0FpNAlnZWyKlwoQFLeUtM0rrVeqUM5MhUYT5g8PyjacjFmVVYeo1XjeHE7PUh2mJzLoBrzGxvfV-vafEjkXA",
        location: "Thôn Mỹ Nghiệp, Huyện Ninh Phước (Cách làng gốm Bàu Trúc 2km)",
        date_display: "Bảo tồn làng nghề cổ",
        description:
          "Bên những khung cửi gỗ rộn rã nhịp thoi đưa, từng sợi chỉ nhuộm từ vỏ trâm bầu, củ nâu rừng được đan cài thành đồ án chim thần Garuda, thần Shiva và hoa sen phục vụ cho các đại lễ Katê thiêng liêng.",
        author: "Làng dệt thủ công",
        link_url: "/san-pham",
        display_order: 3,
        is_active: true,
        position: "home_hero",
      },
      {
        title: "Đền Tháp Po Rome - Vị Vua Cuối Cùng Trên Đồi Đá",
        subtitle: "Ngôi đền tháp xây dựng trên đỉnh đồi đá biệt lập giữa thảo nguyên",
        category: "Thánh Địa Huyền Bí",
        image_url:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAzljZH7__gmKglHYhA2NZtHh2wp1_j6eufhB24fW5dLEg6Q3iVPhcklfXTyfQfftG0s3kkeFa45XwJi0fI0t965d-lV9hy3Bp86bWdiRgQjJMFwqoPZzvC1Puek_bg_vu8Hy90bDTysgtbAXLReE5kLRMopjTkjh5Fgl-uWE2PDhyzuKEA3B_xFsrORw9XqbKdNdrSvBBD0BLP1ezotbfBBmrZCZNeWb86lbUY2kjNCncvJkPSIpv7pA",
        location: "Làng Hậu Sanh, Xã Phước Hữu, Huyện Ninh Phước",
        date_display: "Thế kỷ XVII",
        description:
          "Nằm uy nghi giữa miền đất bán sa mạc, tháp Po Rome là nơi thờ phụng vị vua anh minh cuối cùng được phong thánh trong tâm thức Chăm. Nơi đây lưu giữ bức tượng vua tạc theo phong cách bán diện và bệ thờ linh thiêng.",
        author: "Di tích lịch sử Champa",
        link_url: "/tour",
        display_order: 4,
        is_active: true,
        position: "home_hero",
      },
      {
        title: "Đồng Cừu An Hải & Đồi Cát Nam Cương Trầm Mặc",
        subtitle: "Bình yên thảo nguyên bán sa mạc và đồi cát chuyển mình theo gió",
        category: "Cảnh Sắc Bản Địa Thơ Mộng",
        image_url: "/images/dana-life/IMG_3237.JPG",
        location: "Xã An Hải, Huyện Ninh Phước, Tỉnh Ninh Thuận",
        date_display: "Điểm đến sinh thái",
        description:
          "Mỗi chiều buông xuống, hàng trăm chú cừu thong dong gặm cỏ dưới chân đồi cát lộng gió. Không gian khoáng đạt của miền cát sa mạc Panduranga đưa lữ khách trở về với sự tĩnh tại nguyên sơ của thiên nhiên.",
        author: "Thiên nhiên Panduranga",
        link_url: "/tour",
        display_order: 5,
        is_active: true,
        position: "home_hero",
      },
    ]);
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("hero_banners");
};
