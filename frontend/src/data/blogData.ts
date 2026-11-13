export type BlogMainCategoryType = 'all' | 'tin-tuc' | 'lich-su' | 'van-hoa';

export interface BlogCategory {
  id: string;
  label: string;
  count: number;
}

export interface BlogMainCategoryItem {
  id: BlogMainCategoryType;
  label: string;
  desc: string;
}

export const BLOG_MAIN_CATEGORIES: BlogMainCategoryItem[] = [
  { id: 'all', label: 'Tất cả bài viết', desc: 'Toàn bộ kho tàng khảo cứu & ký ức' },
  { id: 'tin-tuc', label: 'Tin tức & Sự kiện', desc: 'Bảo tồn, lễ hội mới nhất & nhịp sống bản địa' },
  { id: 'lich-su', label: 'Tiến trình Lịch sử', desc: 'Vương triều, bi ký cổ & khảo cổ học Champa' },
  { id: 'van-hoa', label: 'Văn hóa & Nghệ thuật', desc: 'Đền tháp, làng nghề gốm - dệt, âm nhạc & tín ngưỡng' },
];

export interface BlogPillar {
  id: string;
  title: string;
  village: string;
  badge: string;
  badgeClass: string;
  image: string;
  desc: string;
  readTime: string;
  slug: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  mainCategory: 'tin-tuc' | 'lich-su' | 'van-hoa';
  category: string;
  badge: string;
  badgeClass: string;
  fieldLocation: string;
  readTime: string;
  author: string;
  desc: string;
  image: string;
  slug: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: 'all', label: 'Tất cả chuyên đề', count: 32 },
  { id: 'kalan', label: 'Kiến trúc Đền tháp Kalan', count: 8 },
  { id: 'craft', label: 'Làng nghề Cổ truyền & UNESCO', count: 7 },
  { id: 'ritual', label: 'Phong tục & Mùa Lễ hội', count: 6 },
  { id: 'music', label: 'Âm nhạc cổ & Điệu múa thiêng', count: 4 },
  { id: 'cuisine', label: 'Ẩm thực & Dược thảo Paley', count: 3 },
  { id: 'archaeology', label: 'Khảo cổ học & Bi ký', count: 4 },
];

export const FEATURED_POST = {
  id: 'po-klong-garai-brick',
  category: 'Kiến trúc & Tâm linh Champa',
  code: 'Kalan-Arch #01',
  badge: 'Bài Khảo Cứu Tâm Điểm',
  readTime: '12 phút đọc',
  title: 'Bí ẩn gạch nung không vữa mạch Po Klong Garai: Khi lửa và đất hóa thành lời kinh nguyện vĩnh cửu',
  subtitle: 'Ngọn tháp sừng sững như ngọn lửa thiêng không bao giờ tắt trên đỉnh đồi Trầu qua tám thế kỷ thăng trầm.',
  authorNote: 'Chắp bút bởi Hội đồng Chuyên môn Văn hóa Dana & Nghệ nhân bản địa',
  date: 'Hạ tuần tháng 10/2024',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzljZH7__gmKglHYhA2NZtHh2wp1_j6eufhB24fW5dLEg6Q3iVPhcklfXTyfQfftG0s3kkeFa45XwJi0fI0t965d-lV9hy3Bp86bWdiRgQjJMFwqoPZzvC1Puek_bg_vu8Hy90bDTysgtbAXLReE5kLRMopjTkjh5Fgl-uWE2PDhyzuKEA3B_xFsrORw9XqbKdNdrSvBBD0BLP1ezotbfBBmrZCZNeWb86lbUY2kjNCncvJkPSIpv7pA',
  content: 'Hàng triệu viên gạch đất sét nung kết dính khít khao không để lộ một gờ chỉ vữa. Người thợ cả Champa xưa đã mài chập trực tiếp các mặt gạch với nước và nhựa vỏ cây bời lời rừng già, tạo nên khối kiến trúc nguyên khối thách thức nắng gió sa mạc và sự bào mòn của thời gian.',
  inscription: 'Thiên vương dựng đền giữa gò thiêng, cúng dường đất mặn cùng khói trầm, để vạn kiếp con cháu còn nơi cúi đầu trước Mẹ Đất.',
  audioTitle: 'Giọng đọc bản địa: Thuyết minh Po Klong Garai',
  audioDuration: '03:45',
};

export const BLOG_PILLARS: BlogPillar[] = [
  {
    id: 'bau-truc',
    village: 'Paley Hamu Trok',
    title: 'Làng gốm Bàu Trúc: Kỹ nghệ không bàn xoay độc bản',
    badge: 'UNESCO Vinh Danh',
    badgeClass: 'bg-primary text-on-primary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd_yrvnJ_UmdnGzLVXjm5HJfxWX-epAuAP73cohAxtCHVP56EKuM52m07N2hY1obT1_Wmh6lUgDS8Ye5va33Sp_Ih3JQB5vwCQfB9tHTZWaggCM2XqEUXoaNx_-AKFbm6o3Qlh0IJLDyt4WaVcS1eO4R7ER_r7FvmnriVoglYc2JHMEote5IwsaQ4KO5jEbpEvgMErIntFFp0iOdJghlh9P7kXsJrT1xrzKEBAkfFj9OWLDV8DTpPJsg',
    desc: 'Kỹ thuật người phụ nữ đi giật lùi quanh khối đất sét, dùng chính thân mình làm trục quay, nung lộ thiên bằng rơm củi tạo vết khói loang độc nhất vô nhị.',
    readTime: '8 phút đọc',
    slug: 'lang-gom-bau-truc',
  },
  {
    id: 'my-nghiep',
    village: 'Paley Caklaing',
    title: 'Dệt Mỹ Nghiệp: Sợi chỉ nhuộm vỏ rừng & đồ hình vũ trụ',
    badge: 'Thổ Cẩm Cổ Truyền',
    badgeClass: 'bg-secondary text-white',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnUVQIkkzk4sUIaAcHvZKq-_JFsMVjkwWi6wVJYz1b38pTtWTcB_NnJA9pUSrOog9MIIrHBMjNMwmZ07G62QeC68HKaFH2ZC3FLZR1ykISx0jftWhDdHrOTZyDGh6OxckvxscMAIC0lKtMK89ZXTNb9p4uIebpPghBC4Qz-x4S-IRHj1glQM0pYgcmuItDQ5ICUQO9VGBUbRyuV-L5vdNRAZPn1RVNCS2THNjEc9XBmkvxGOQuBI0ZjQ',
    desc: 'Từ rễ cây nhàu và vỏ cây tràm, người phụ nữ Mỹ Nghiệp gửi gắm triết lý âm dương qua hoa văn quả trám, rồng thần Makara và búp sen thiêng.',
    readTime: '6 phút đọc',
    slug: 'det-my-nghiep',
  },
  {
    id: 'kate',
    village: 'Đại Lễ Mùa Thu',
    title: 'Hội Katê tháp thiêng: Tiếng Baranưng thức dậy cội nguồn',
    badge: 'Nghi Lễ Linh Thiêng',
    badgeClass: 'bg-tertiary text-white',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp5oGIUVAeSJNWnmsriAoE7Rx-gdVHGigsy1epg2Fah3OzIXtn7INt9avN5y3DYyr_5mgSbawDhhdB6AVM-eYtjoRZfxrq27rRi1-chffHIx6soB1QRX5R3xTS8gl_eF19cPeH7hONAuA5dgaNxeEG4JYrWaLNmlFYWVg8fXjwigzILTDoZgUaOHe27pOw-PL1DfizD5qy-ARG-iBr0tq2l090mbglxQI-yq7RDH_u_9aIirJEjUmV9Q',
    desc: 'Ngày hội lớn nhất của tín đồ Chăm Bàlamôn mở ra với nghi thức rước y trang nữ thần Xứ sở Po Sah Inư và điệu múa quạt huyền bí dưới bóng tháp Kalan.',
    readTime: '9 phút đọc',
    slug: 'hoi-kate-thap-thieng',
  },
  {
    id: 'music-pillar',
    village: 'Bộ Ba Nhạc Khí',
    title: 'Saranai, Ginăng & Paranưng: Âm vang cõi người và cõi trời',
    badge: 'Âm Sắc Tâm Linh',
    badgeClass: 'bg-primary text-on-primary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByRjv3i0FgHFxRrA7jzb_vp4kh7-P-4NrSYq9Zkk1lt5uKtg0Nqhq3LnRPLql0yHGiNMjL6ZdJ4bvwAco_jKoi5cKVVQyrhDXC_CtMT08OA5ogzdkhkYr96QFa4Jly_q9fjQIvrK6GcFT1JJlUR6bxy0yVImxdXGO8N5wDrB4tcuYiFJUP6SevjiPWkYr2orVSIoCNJDpVkrUBSCZVndc03_Kqs_3OkB2XPFgcw_7FdSU08jQAjDT5ZQ',
    desc: 'Kèn Saranai tượng trưng cho linh hồn bay bổng, trống Paranưng là lồng ngực trời đất, còn đôi Ginăng đại diện cho nhịp chân người phàm trần.',
    readTime: '7 phút đọc',
    slug: 'nhac-khi-saranai-ginang',
  },
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'post-heritage-baoh-dana',
    mainCategory: 'van-hoa',
    category: 'archaeology',
    badge: 'Thuyết Minh Tuyến Điểm',
    badgeClass: 'bg-primary text-on-primary',
    fieldLocation: 'Tuyến Di Sản Palei Baoh Dana',
    readTime: '15 phút đọc',
    author: 'Cộng đồng Chăm Palei Baoh Dana',
    title: 'Bài Thuyết Minh Tuyến Du Lịch Cộng Đồng Chăm: Hành Trình 8 Điểm Chạm Di Sản Palei Baoh Dana',
    desc: 'Tập hợp toàn văn thuyết minh lịch sử, kiến trúc, văn hóa và nếp sống của 8 điểm đến: Đền tháp Po Klaong Garay, Đập Nha Trinh, Núi Đá Trắng, Tháp Po Ramê, Làng dệt Mỹ Nghiệp, Làng gốm Bàu Trúc, Đền Po Ina Nagar và Làng Chất Thường.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWzz5wVWN2Rre_bf3lzTZ89szZW61A19gyuIM1D6eHB2bgjSvLJ2IjqYRR2_FvWNOaiuYH_mZKTaaCYHyrAo6Y-MHZRm5QMjTQqVYlWO-UTZpP7j-38TvaXGvTC0E43MbjaK6OcYizspkYPA97vZ7ux2qQedU074FLdyFMB7zxmwJM_GGaJUJxVOmC--t3UtTdUYuMj2PhxbPFLX9SyKZLF-p5BPhi_fHZpOUSInajqnNWFka72rYwew',
    slug: 'thuyet-minh-du-lich-cong-dong-palei-baoh-dana',
  },
  {
    id: 'post-news-1',
    mainCategory: 'tin-tuc',
    category: 'ritual',
    badge: 'Sự Kiện Di Sản 2025',
    badgeClass: 'bg-primary text-on-primary',
    fieldLocation: 'Tháp Po Klong Garai & Đồi Trầu',
    readTime: '4 phút đọc',
    author: 'Ban Quản lý Di tích',
    title: 'Khai mạc Đại lễ Katê 2025: Sắc màu rực rỡ và tiếng trống Ginăng thức giấc ngàn năm',
    desc: 'Hàng vạn đồng bào Chăm cùng du khách tề tựu về ngọn tháp cổ kính trong trang phục truyền thống rực rỡ, trang nghiêm tiến hành nghi thức mở cửa tháp và tắm tượng thần Shiva.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp5oGIUVAeSJNWnmsriAoE7Rx-gdVHGigsy1epg2Fah3OzIXtn7INt9avN5y3DYyr_5mgSbawDhhdB6AVM-eYtjoRZfxrq27rRi1-chffHIx6soB1QRX5R3xTS8gl_eF19cPeH7hONAuA5dgaNxeEG4JYrWaLNmlFYWVg8fXjwigzILTDoZgUaOHe27pOw-PL1DfizD5qy-ARG-iBr0tq2l090mbglxQI-yq7RDH_u_9aIirJEjUmV9Q',
    slug: 'khai-mac-dai-le-kate-2025',
  },
  {
    id: 'post-news-2',
    mainCategory: 'tin-tuc',
    category: 'craft',
    badge: 'UNESCO Bảo Tồn Khẩn Cấp',
    badgeClass: 'bg-secondary text-white',
    fieldLocation: 'Làng gốm Bàu Trúc',
    readTime: '5 phút đọc',
    author: 'Đỗ Hữu Trí',
    title: 'Khánh thành Nhà trưng bày cộng đồng và Không gian thực hành gốm Bàu Trúc thế hệ mới',
    desc: 'Không gian mở vừa khánh thành giúp các em nhỏ trong làng học phương thức "tay làm chân quay" cổ xưa và trực tiếp đón tiếp du khách quốc tế đến trải nghiệm.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd_yrvnJ_UmdnGzLVXjm5HJfxWX-epAuAP73cohAxtCHVP56EKuM52m07N2hY1obT1_Wmh6lUgDS8Ye5va33Sp_Ih3JQB5vwCQfB9tHTZWaggCM2XqEUXoaNx_-AKFbm6o3Qlh0IJLDyt4WaVcS1eO4R7ER_r7FvmnriVoglYc2JHMEote5IwsaQ4KO5jEbpEvgMErIntFFp0iOdJghlh9P7kXsJrT1xrzKEBAkfFj9OWLDV8DTpPJsg',
    slug: 'khanh-thanh-khong-gian-gom-bau-truc',
  },
  {
    id: 'post-history-1',
    mainCategory: 'lich-su',
    category: 'archaeology',
    badge: 'Tiến Trình Vương Triều',
    badgeClass: 'bg-tertiary text-white',
    fieldLocation: 'Đô Vinh - Panduranga',
    readTime: '9 phút đọc',
    author: 'TS. Bá Trung Phụ',
    title: 'Huyền tích Vua Po Klong Garai: Từ cậu bé chăn bò đến bậc quân vương trị thủy vĩ đại',
    desc: 'Lật mở những trang sử thi huyền thoại về vị vua có công lớn nhất trong việc đắp đập Nha Trinh, đào mương Champa mang nguồn nước ngọt nuôi sống đồng bằng Ninh Thuận khô hạn.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWzz5wVWN2Rre_bf3lzTZ89szZW61A19gyuIM1D6eHB2bgjSvLJ2IjqYRR2_FvWNOaiuYH_mZKTaaCYHyrAo6Y-MHZRm5QMjTQqVYlWO-UTZpP7j-38TvaXGvTC0E43MbjaK6OcYizspkYPA97vZ7ux2qQedU074FLdyFMB7zxmwJM_GGaJUJxVOmC--t3UtTdUYuMj2PhxbPFLX9SyKZLF-p5BPhi_fHZpOUSInajqnNWFka72rYwew',
    slug: 'huyen-tich-vua-po-klong-garai',
  },
  {
    id: 'post-history-2',
    mainCategory: 'lich-su',
    category: 'archaeology',
    badge: 'Giải Mã Cổ Vật & Bia Ký',
    badgeClass: 'bg-primary text-on-primary',
    fieldLocation: 'Tháp Po Rome - Hậu Sanh',
    readTime: '12 phút đọc',
    author: 'Viện Khảo Cổ Học',
    title: 'Văn bia Tháp Po Rome và giai đoạn chuyển giao lịch sử thế kỷ XVII tại xứ Panduranga',
    desc: 'Những dòng ký tự Chăm cổ khắc sâu trên phiến đá sa thạch làm sáng tỏ thời kỳ cai trị của Po Rome - vị vua cuối cùng được phong thần và dựng đền tháp độc lập.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzljZH7__gmKglHYhA2NZtHh2wp1_j6eufhB24fW5dLEg6Q3iVPhcklfXTyfQfftG0s3kkeFa45XwJi0fI0t965d-lV9hy3Bp86bWdiRgQjJMFwqoPZzvC1Puek_bg_vu8Hy90bDTysgtbAXLReE5kLRMopjTkjh5Fgl-uWE2PDhyzuKEA3B_xFsrORw9XqbKdNdrSvBBD0BLP1ezotbfBBmrZCZNeWb86lbUY2kjNCncvJkPSIpv7pA',
    slug: 'van-bia-thap-po-rome-the-ky-17',
  },
  {
    id: 'post-1',
    mainCategory: 'van-hoa',
    category: 'cuisine',
    badge: 'Ẩm Thực & Đời Sống',
    badgeClass: 'bg-secondary text-white',
    fieldLocation: 'Điền dã An Hải',
    readTime: '5 phút đọc',
    author: 'Ja Tuan',
    title: 'Ẩm thực Paley: Triết lý cân bằng âm dương qua Canh Bồi Um Bơk và Bánh Sakaya',
    desc: 'Người Chăm không chuộng vị gắt; họ nấu rau rừng cùng mắm cá biển mặn mòi, khép lại bằng vị ngọt thơm béo ngậy của trứng và đường thốt nốt trong lễ cưới hỏi.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD57zjqmFcs1INCx-fU6nzh0ide6zKDDq8cCKhYnAeEtlZ9wD_sfFL6OBC_RI8VKv9jHdWmp0nsgtWSrLsVmZIa1pEEhDrUUTzf1p1AvWD5a6NZP_naxxAW_xfTK8bcFOBBe07AQpcffBtC2XvrA37HS_I6T62bMYo1WlXVd07SphkB8vG5swtlG4gi0wz2zyNaCpsPsQmBgCmDaYoRG1DYsvemhWdsGR4uScDGF0rlncuFd2Ae6EwAGw',
    slug: 'am-thuc-paley-canh-boi-um-bok',
  },
  {
    id: 'post-2',
    mainCategory: 'van-hoa',
    category: 'kalan',
    badge: 'Mỹ Thuật & Điêu Khắc',
    badgeClass: 'bg-primary text-on-primary',
    fieldLocation: 'Khảo cứu bảo tàng',
    readTime: '10 phút đọc',
    author: 'ThS. Đỗ Lâm',
    title: 'Hình tượng Apsara và Thần Hộ pháp Dvarapala trong điêu khắc sa thạch Champa',
    desc: 'Những đường cong uốn lượn mềm mại của vũ nữ thiên giới đối lập với vẻ uy nghiêm trầm mặc của thần gác cổng, thể hiện đỉnh cao nghệ thuật đục đẽo đá thế kỷ X-XII.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwp2O4wPSnQhuVaJC7FhDwhbAV99dJiNseJ8THl9kE3ZY-0-aWLkok7zJ2WFFTllPxI8xy6UnD4bMHSYOHgQU5jLBoC0NaOBbfExmtQi-oGTw0h6220cmB-zNjl2Auo4xUsIq4FaUBuWrFmt7pP8me2uC0ICy0quUbgeXQoTgwFNk2AyMdZY6qHNz4BvpEXd_cTS1l7HXgiVYib2QZVdvIbOYTgbdANF3PE9u-YLVSos0Gm8q7U22f8Q',
    slug: 'hinh-tuong-apsara-dvarapala',
  },
  {
    id: 'post-3',
    mainCategory: 'van-hoa',
    category: 'ritual',
    badge: 'Lễ Hội & Tín Ngưỡng',
    badgeClass: 'bg-tertiary text-white',
    fieldLocation: 'Cộng đồng Bani',
    readTime: '8 phút đọc',
    author: 'Châu Văn Minh',
    title: 'Lễ hội Ramuwan của người Chăm Bani: Tháng chay tịnh và tảo mộ tổ tiên',
    desc: 'Không khí tĩnh mịch tại nghĩa trang Ghur, nơi những ngôi mộ tròn phủ cát trắng đón con cháu trở về tưới nước thơm, dâng trầu cau tưởng nhớ cội nguồn tông tộc.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJEIcEYq_jvg3HaKcUZ8pAibuZHcHJzITLPLT8lL_vpXwHsQ3bRqr4GxqRW3obAWD9LhYupJL94K3OxtJ_N9s7DiOwh6MX5NO1CWUFLBRbDuPht-CrQdhajRY-BHgvET_MSYpYjQz4Y1CVFiCc8yydZjl2WIKSeG-A3WGYD4vccuqYCJGbEkv8vlvbI9CPWKdD7O12ulgq_6ODaGpsgDU-K6wNTL8pzAydOkqryN8EpiP3mv54F1HKRQ',
    slug: 'le-hoi-ramuwan-cham-bani',
  },
  {
    id: 'post-4',
    mainCategory: 'van-hoa',
    category: 'cuisine',
    badge: 'Dược Thảo & Y Học',
    badgeClass: 'bg-secondary text-white',
    fieldLocation: 'Tri thức bản địa',
    readTime: '6 phút đọc',
    author: 'Lương y Đàng Cường',
    title: 'Cây thuốc nam và tri thức bản địa trị bệnh của người Chăm vùng bán khô hạn',
    desc: 'Kinh nghiệm tích lũy qua hàng ngàn năm thuần hóa cỏ gai, xương rồng và rễ cây chịu hạn để điều hòa thân nhiệt trong điều kiện khí hậu khắc nghiệt nhất xứ nắng.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxc0E4K5rbpxjLyFe7O9pPc9HQWhJIiOKTzqqZe9oCNJ10_oLcRBWZpLsrhdZZp7ex2sPVGzs_pZHs8DkfScV8LvZQ7C8CSbSCXB4Oh1QnBiqcYGwxifFaplyeaAITyK5vgNgPPgfetGsvycj-HQpl2u8VkWpDIwwOOFaqARONe_VCHzuNYNG8BXL3VtmPtugvQOPmMTv5BFMSi1qbASkkjk7nsROJUfERIMA5p3BXY2XOfochYhMHNg',
    slug: 'cay-thuoc-nam-tri-thuc-ban-dia',
  },
  {
    id: 'post-5',
    mainCategory: 'lich-su',
    category: 'archaeology',
    badge: 'Khảo Cổ Học Cảnh Quan',
    badgeClass: 'bg-tertiary text-white',
    fieldLocation: 'Hạ lưu sông Dinh',
    readTime: '11 phút đọc',
    author: 'Nhóm Khảo cổ Dana',
    title: 'Bản đồ các giếng cổ và hồ nước Champa còn sót lại tại Ninh Thuận',
    desc: 'Kỹ thuật dẫn nước ngầm từ chân núi ra đồng ruộng thông qua hệ thống mương máng đá xếp không dùng vôi vữa, minh chứng cho một nền nông nghiệp tài tình.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFoCx55fZOaoTTciJYrWm2VQZrJSqmmt_dSYCWBlFm7F0pqD9gv994QuiJWdKl2ZxAT9uci4bqRtGo5yRHgju7_F7kdp9X5zxKFH_5zfx_5zLGxCFu0Bc9SN0tkrwm72FxlGux_ZpL6DcFDLVkNGFTChkoefxRUOxCdUkTDE62zQC--cDMoSQu4ccNT1ymJqdomRp6EjxNv7XxONMLmHFQLqO-XTyfEvY5-ui6Xyj_Ua7sjcxtLIqD0g',
    slug: 'ban-do-gieng-co-thuy-loi-champa',
  },
  {
    id: 'post-6',
    mainCategory: 'van-hoa',
    category: 'craft',
    badge: 'Cẩm Nang Sưu Tầm',
    badgeClass: 'bg-primary text-on-primary',
    fieldLocation: 'Cổ vật & Đời sống',
    readTime: '7 phút đọc',
    author: 'Nghệ nhân Trượng Thị Gạch',
    title: 'Cách phân biệt gốm thờ cúng tâm linh và gốm gia dụng Bàu Trúc',
    desc: 'Từ nồi nấu cơm thường nhật đến bình Kala thiêng liêng dùng trong lễ phong chức thầy Pasreh, mỗi sản phẩm gốm đều mang quy tắc tạo hình và cấm kỵ khắt khe.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQFtslRlUChsygwrMeg36AT14eMFbhiH7zQ-JHzv5MVGk5ticrX0YUVq6hQKXb5gDcjAsmairyrgPQKHFzvwBJLusUtu4GFhJfg7c80BiF-1LeOYkTqkotU3kcIZ8fTtc7nNGSqJa01CV7zqKVtIzfWJDHmVARBuoJtlE4q769O-Fx1pxm3dVne0-Mm3D979rykX7PeT0pyptbYbkSLXe65FZQo8m0uSDeRSp844-zEyBUTuAzylysgg',
    slug: 'phan-biet-gom-tho-cung-gia-dung',
  },
];
