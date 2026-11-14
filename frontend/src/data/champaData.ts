import type { Artisan, NavItem, PcNavLink, Testimonial, Tour, Waypoint } from '../types/heritage';

export const LOGO_URL = '/Logo.png';

export const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBJO2LeFcBxrnLD3_ngvbOCay5NrUQGUVuZkFtrKpti5KEcoH30WS6OOO-NMqLrlRG0HQZsxltS-um4S3a3R0yMJmfF5gre0ab0BqJ5JhFryOZ8lehz0tESRLuaIHYpc9p3aA_VAvNr2nJQG8S6z5VUEkRsC_vENB7PbBCA9G3B4X9Xxyy6JnGaagERULeA3pN-YMcSOAxhLS-dmW3MzMG1Y4SvS7-RsxXP1Jbo4ZPAd02G32DktDt1UQ';

export const MAP_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBUfYzm1NZ4arEZYOjXP-ADVRrL2xvxRYpA11bkxwybvUPyaLDDHcbzdna3ORWQdNhRZ691hmCL8NhJzSAjGU5gLcf6loBzxm9LlDDjY-bDf5UiEUEa8dCbgRQO5NwMElBhJX6SjLnotVvZ4SesvgT8Thywsaeywlcgwf1tW1jO8xFQbtJMa3R7BXOwL3MrVqNKr5Y-maFTUq9d3YpEzE5Uvj6QVImJxg-rCyKTWSyfkqmmjoELc7hWkA';

export const ARTISAN_PHAN_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBGoBQ0YTbgeC_aU74pGXo1oL2EIQvXidi293uM-D3IC3ytJg2Kb6n6-zQS893aL4Y-1ZeWUHgOy0CXn1RYU6Xg5ERRBTu44GX82RIfmSysT1lBGe11NxBc90UySzTISL4VfCfy2kwAwDqdhlo7-qSU4n9Wq149H7EgzP6jyN0S770xNmbtg8Bb8Sgmfn2GG91FQp1KF8UL6tZrnZDkKMgDqHyyIWjTGrAQtlhGDBIJVsnjy0rGg1nHJw';

export const ARTISAN_MO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA9DOa0kU9XPSC4ElDUYdkw-HVXrxst6qmjl-lUQl29coyB3dJ9-vQbqfdakYBl6jppcYvq7Nih94eJY0xa602x9Lm9fSWkwUkez46Mou_js76LipE83WzU-xNC6p9A37bPiJRQnRypjtRBqPGz3udpwc7pbWEAirI405yrHUOQpBqIg_hKppN7Wr772Erm11GCx3XktevmV50KpaZjljmWw7I8dpauAhny2KblbS9-SwL6i64m5yCz0A';

export const MANIFESTO_METRICS = [
  {
    icon: 'handshake',
    value: '100%',
    title: 'Nghệ nhân Bản địa',
    desc: 'Tất cả người dẫn lối, nghệ nhân thực hành nghi lễ và chế tác đều là con em cộng đồng Chăm Panduranga.',
    colorClass: 'text-primary',
  },
  {
    icon: 'museum',
    value: '02',
    title: 'Làng Cổ Đông Nam Á',
    desc: 'Làng gốm Bàu Trúc và dệt thổ cẩm Mỹ Nghiệp giữ nguyên phương pháp chế tác thủ công cổ xưa nhất khu vực.',
    colorClass: 'text-secondary',
  },
  {
    icon: 'workspace_premium',
    value: 'UNESCO',
    title: 'Bảo tồn Bền vững',
    desc: 'Nghệ thuật làm gốm của người Chăm được ghi danh trong Danh mục Di sản phi vật thể cần bảo vệ khẩn cấp.',
    colorClass: 'text-tertiary',
  },
];

export const MANIFESTO_STATS = [
  { value: '100%', label: 'Nghệ nhân bản địa', className: 'text-primary' },
  { value: '02', label: 'Làng cổ Đông Nam Á', className: 'text-secondary' },
  { value: 'UNESCO', label: 'Di sản bảo tồn', className: 'text-tertiary' },
];

export const TOURS: Tour[] = [
  {
    id: 1,
    slug: 'dana-tour',
    badge: 'Hành Trình Độc Quyền Duy Nhất',
    badgeClass: 'bg-primary text-white shadow-xs',
    duration: '1 Ngày Trọn Vẹn (07:30 - 17:30)',
    location: 'Tháp Po Klong Garai • Làng gốm Bàu Trúc • Làng dệt Mỹ Nghiệp',
    price: 'Liên hệ báo giá',
    category: 'craft',
    rating: '5.0',
    reviewsCount: '186',
    title: 'Dana Tour: Hành Trình Khám Phá Di Sản Panduranga Trọn Vẹn',
    description:
      'Hành trình độc bản duy nhất của Dana Community Tourism kết nối trọn vẹn tinh hoa đất thiêng: Đón bình minh và giải mã văn bia Tháp Po Klong Garai, học nắn gốm không bàn xoay tại Bàu Trúc cùng Muk Phan, thưởng thức bữa trưa canh Um Bơk truyền thống và ngồi vào khung cửi dệt thổ cẩm Mỹ Nghiệp cùng nghệ nhân Phú Thị Mỡ.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBWzz5wVWN2Rre_bf3lzTZ89szZW61A19gyuIM1D6eHB2bgjSvLJ2IjqYRR2_FvWNOaiuYH_mZKTaaCYHyrAo6Y-MHZRm5QMjTQqVYlWO-UTZpP7j-38TvaXGvTC0E43MbjaK6OcYizspkYPA97vZ7ux2qQedU074FLdyFMB7zxmwJM_GGaJUJxVOmC--t3UtTdUYuMj2PhxbPFLX9SyKZLF-p5BPhi_fHZpOUSInajqnNWFka72rYwew',
    chips: [
      { label: 'Xe đưa đón tận nơi Phan Rang', className: 'bg-surface-container text-on-surface-variant font-medium' },
      { label: 'Thực hành nặn gốm không bàn xoay', className: 'bg-surface-container text-on-surface-variant font-medium' },
      { label: 'Học dệt thổ cẩm hoa văn Katê', className: 'bg-surface-container text-on-surface-variant font-medium' },
      { label: 'Bữa trưa đặc sản Chăm (Um Bơk)', className: 'bg-surface-container text-on-surface-variant font-medium' },
      { label: 'Tặng bình gốm tự nặn mang về', className: 'bg-primary/10 text-primary font-bold' },
    ],
  },
];

export const WAYPOINTS: Waypoint[] = [
  {
    id: 1,
    icon: 'temple_hindu',
    shortName: '1. Po Klaong Garay',
    district: 'Đô Vinh',
    title: 'Đền tháp Po Klaong Garay (Đô Vinh)',
    sub: 'Cách Phan Rang 7 km • 07:00 - 17:30',
    distance: 'Cách Phan Rang 7 km',
    openHours: '07:00 - 17:30',
    badge: 'Trạm 01 • Kiến trúc Thánh điện',
    badgeClass: 'bg-primary text-white shadow-xs',
    rules: 'Trang phục kín đáo qua gối, cởi nón và giày dép khi vào viếng Kalan chính.',
    coords: [11.6033, 108.9482],
  },
  {
    id: 2,
    icon: 'water',
    shortName: '2. Đập Nha Trinh',
    district: 'Sông Dinh',
    title: 'Đập thuỷ lợi cổ Nha Trinh (Sông Dinh)',
    sub: 'Cách Tháp 3 km • Mạch sống ngàn năm',
    distance: 'Cách Tháp 3 km',
    openHours: 'Mở cửa cả ngày',
    badge: 'Trạm 02 • Di sản Trị thủy',
    badgeClass: 'bg-sky-600 text-white shadow-xs',
    rules: 'Giữ gìn vệ sinh dòng nước sông Cái, không leo trèo thành kè mùa lũ.',
    coords: [11.612, 108.931],
  },
  {
    id: 3,
    icon: 'mountain',
    shortName: '3. Núi Đá Trắng',
    district: 'Phước Hữu',
    title: 'Núi Đá Trắng - Cek Yang Patao',
    sub: 'Thôn Như Bình • Thắng cảnh huyền tích',
    distance: 'Cách Phan Rang 14 km',
    openHours: '06:00 - 18:00',
    badge: 'Trạm 03 • Thắng cảnh Kỳ quan',
    badgeClass: 'bg-emerald-600 text-white shadow-xs',
    rules: 'Không vẽ bậy lên các vách đá tự nhiên, thu gom rác sạch sẽ khi ngắm cảnh.',
    coords: [11.512, 108.889],
  },
  {
    id: 4,
    icon: 'account_balance',
    shortName: '4. Tháp Po Ramê',
    district: 'Hậu Sanh',
    title: 'Đền tháp Po Ramê (Hậu Sanh)',
    sub: 'Cách Phan Rang 15 km • Thế kỷ XVII',
    distance: 'Cách Phan Rang 15 km',
    openHours: '07:30 - 17:00',
    badge: 'Trạm 04 • Tháp thiêng Vương triều',
    badgeClass: 'bg-amber-600 text-white shadow-xs',
    rules: 'Tháp còn thờ phụng tôn nghiêm, giữ trật tự và bỏ nón khi bước vào bệ thờ.',
    coords: [11.5178, 108.9205],
  },
  {
    id: 5,
    icon: 'texture',
    shortName: '5. Dệt Mỹ Nghiệp',
    district: 'Ninh Phước',
    title: 'Thổ cẩm Làng Mỹ Nghiệp (Paley Caklaing)',
    sub: 'Cách Phan Rang 12 km • 08:00 - 18:00',
    distance: 'Cách Phan Rang 12 km',
    openHours: '08:00 - 18:00',
    badge: 'Trạm 05 • Tinh hoa Khung cửi',
    badgeClass: 'bg-purple-600 text-white shadow-xs',
    rules: 'Tôn trọng khung dệt cổ, hỏi ý kiến trước khi quay phim nghệ nhân luồn sợi.',
    coords: [11.5167, 108.9333],
  },
  {
    id: 6,
    icon: 'potted_plant',
    shortName: '6. Gốm Bàu Trúc',
    district: 'Phước Dân',
    title: 'Gốm Đất nung Bàu Trúc (Paley Hamu Craok)',
    sub: 'Cách Phan Rang 10 km • Di sản UNESCO',
    distance: 'Cách Phan Rang 10 km',
    openHours: 'Mở cửa cả ngày (07:30 - 17:30)',
    badge: 'Trạm 06 • UNESCO Vinh Danh',
    badgeClass: 'bg-primary text-white shadow-xs',
    rules: 'Trang phục thoải mái, tháo giày dép khi bước vào sân nhà cổ Muk nặn gốm.',
    coords: [11.5312, 108.9567],
  },
  {
    id: 7,
    icon: 'sparkles',
    shortName: '7. Đền Po Ina Nagar',
    district: 'Hữu Đức',
    title: 'Di tích Đền thờ Po Ina Nagar (Hữu Đức)',
    sub: 'Thờ Nữ thần Mẹ Xứ Sở • Làng cổ Chăm',
    distance: 'Cách Po Ramê 2 km',
    openHours: '07:30 - 17:00',
    badge: 'Trạm 07 • Đền Mẹ Xứ Sở',
    badgeClass: 'bg-rose-600 text-white shadow-xs',
    rules: 'Kính cẩn trước hòm y trang thánh, không làm ồn trong gian chính tẩm.',
    coords: [11.505, 108.905],
  },
  {
    id: 8,
    icon: 'home',
    shortName: '8. Nhà cổ Baoh Dana',
    district: 'Chất Thường, Phước Hậu',
    title: 'Nhà cổ Chăm - Palei Baoh Dana (Làng Chất Thường)',
    sub: 'Thôn Chất Thường • Trụ sở cộng đồng & Điểm chạm Nhà cổ',
    distance: 'Cách Phan Rang 8 km',
    openHours: '08:00 - 17:30 (Đón khách theo lịch hẹn)',
    badge: 'Trạm 08 • Tọa độ Nhà Cổ Baoh Dana',
    badgeClass: 'bg-emerald-700 text-white shadow-xs',
    rules: 'Giữ gìn sự thanh tịnh, tháo giày trước khi lên Thang Ging, tôn trọng không gian gia đình mẫu hệ.',
    coords: [11.5844183, 108.9116267],
    googleMapsUrl: 'https://maps.app.goo.gl/FWVdoPUTFZDaNBZW8',
  },
];

export const ARTISANS: Artisan[] = [
  {
    id: 1,
    name: 'Muk Đàng Thị Phan',
    slug: 'muk-dang-thi-phan',
    title: 'Nghệ nhân Ưu tú Bàu Trúc',
    experience: '58 năm giữ lửa • Đệ nhất bàn tay vàng gốm mẹ',
    village: 'Làng gốm Bàu Trúc',
    specialty: 'Gốm đất nung lộ thiên không bàn xoay',
    yearsOfDedication: 58,
    achievements: [
      'Nghệ nhân Ưu tú được Chủ tịch nước phong tặng',
      'Đại diện Việt Nam trình diễn di sản tại UNESCO Paris',
      'Truyền dạy kỹ thuật làm gốm cho hơn 120 học viên trẻ',
    ],
    workshopLocation: 'Khu phố Bàu Trúc, Thị trấn Phước Dân, Ninh Phước',
    quote:
      '“Người Chăm làm gốm bằng đôi chân đi giật lùi, xoay quanh chiếc trụ đất. Đất dẻo theo tâm người, lửa đỏ theo lòng người. Mình thương đất thì đất nuôi mình sống rạng rỡ.”',
    bio: 'Muk Phan là một trong những nghệ nhân tiêu biểu đại diện Việt Nam tham gia trình diễn tại trụ sở UNESCO Paris khi di sản gốm Chăm được ghi danh. Tại Bàu Trúc, bà đã truyền dạy kỹ thuật làm gốm không bàn xoay cho hơn 3 thế hệ con gái trong làng, bảo tồn trọn vẹn hồn cốt văn hóa mẫu hệ.',
    schedule: 'Lớp truyền dạy & Đón khách: Thứ Bảy & Chủ Nhật hàng tuần (08:30 - 16:30)',
    image: ARTISAN_PHAN_IMAGE,
    handsImage: '/images/dana-life/IMG_9911.JPG',
    productImage: '/images/dana-life/IMG_9911.JPG',
    productName: 'Bình gốm ngấn khói Bàu Trúc & Lu đất nung lộ thiên',
    featuredProductIds: ['sp-01', 'sp-07'],
    badgeClass: 'bg-primary text-on-primary',
  },
  {
    id: 2,
    name: 'Nghệ nhân Phú Thị Mỡ',
    slug: 'nghe-nhan-phu-thi-mo',
    title: 'Nghệ nhân Thổ cẩm Mỹ Nghiệp',
    experience: '45 năm dệt khung • Bậc thầy đồ án hoa văn Katê',
    village: 'Làng dệt Mỹ Nghiệp',
    specialty: 'Dệt luồn hoa văn cổ hoàng cung & Thảo mộc tự nhiên',
    yearsOfDedication: 45,
    achievements: [
      'Phục dựng thành công 20+ mẫu hoa văn Champa thế kỷ XVII',
      'Nghệ nhân Bàn Tay Vàng Làng nghề truyền thống Việt Nam',
      'Chủ nhiệm Hợp tác xã Dệt Thổ cẩm Mỹ Nghiệp',
    ],
    workshopLocation: 'Hợp tác xã Thổ cẩm Mỹ Nghiệp, Ninh Phước, Ninh Thuận',
    quote:
      '“Hoa văn quả trám, hình thần Shiva hay chim công không chỉ để đẹp. Đó là chữ viết không lời của phụ nữ Chăm gởi gắm cho chồng con lúc đi làm xa.”',
    bio: 'Bà Phú Thị Mỡ đã phục dựng thành công hơn 20 mẫu hoa văn hoàng cung Champa thế kỷ XVII tưởng chừng đã thất truyền, hoàn toàn sử dụng phẩm màu nhuộm từ thảo mộc thiên nhiên vùng đồi cát như vỏ trâm bầu, củ nâu và rễ cây rừng.',
    schedule: 'Không gian dệt: Hợp tác xã Dệt Mỹ Nghiệp • Đón khách các ngày trong tuần',
    image: ARTISAN_MO_IMAGE,
    handsImage: '/images/dana-life/IMG_3237.JPG',
    productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXDHM6yk37AcZTWKD2kHI9jPGZKP1I4JY5yxSnfX4BbftErgSz5JHk80zz2TUzC_obO4A9NMXDFx8yx6BPBGmoGhCEaCXQvDZl1oXbqVoWkpJ3biH8-ERIAfE760E73pitqQdKh1Cszx9wZVscKNWrs_AhSvA-Knlo8t0FpNAlnZWyKlwoQFLeUtM0rrVeqUM5MhUYT5g8PyjacjFmVVYeo1XjeHE7PUh2mJzLoBrzGxvfV-vafEjkXA',
    productName: 'Khăn thổ cẩm hoa văn chim công & Vải dệt Katê truyền thống',
    featuredProductIds: ['sp-02', 'sp-06'],
    badgeClass: 'bg-secondary text-on-secondary',
  },
  {
    id: 3,
    name: 'Nghệ nhân Đàng Xem',
    slug: 'nghe-nhan-dang-xem',
    title: 'Bậc Thầy Chế Tác Nhạc Cụ Chăm',
    experience: '48 năm giữ nhịp • Truyền nhân thanh âm thiêng Katê',
    village: 'Làng Chăm Hữu Đức',
    specialty: 'Chế tác trọn bộ nhạc khí: Kèn Saranai, Trống Paranưng & Ginăng',
    yearsOfDedication: 48,
    achievements: [
      'Bậc thầy chế tác nhạc cụ nghi lễ tiêu biểu vùng Panduranga',
      'Nghệ nhân diễn xướng chính các mùa lễ hội Katê tháp Po Klong Garai',
      'Đào tạo hơn 40 học trò giữ lửa nhạc khí dân tộc',
    ],
    workshopLocation: 'Thôn Hữu Đức, Xã Phước Hữu, Huyện Ninh Phước',
    quote:
      '“Kèn Saranai làm từ gỗ mun, kẹp dăm lá buông thiêng. Tiếng kèn cất lên như ngọn gió Panduranga thổi bùng ký ức tiền nhân trong ngày hội Katê.”',
    bio: 'Nghệ nhân Đàng Xem là bậc thầy hiếm hoi nắm giữ bí quyết chế tác thủ công trọn vẹn bộ ba nhạc khí nghi lễ Chăm: Kèn Saranai, Trống Paranưng và Trống Ginăng. Mỗi nhạc cụ qua tay ông đều được thử âm trực tiếp tại chân tháp cổ.',
    schedule: 'Không gian diễn xướng Hữu Đức • Đón khách theo lịch hẹn trước',
    image: '/images/dana-life/IMG_9901.JPG',
    handsImage: '/images/dana-life/IMG_9901.JPG',
    productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzljZH7__gmKglHYhA2NZtHh2wp1_j6eufhB24fW5dLEg6Q3iVPhcklfXTyfQfftG0s3kkeFa45XwJi0fI0t965d-lV9hy3Bp86bWdiRgQjJMFwqoPZzvC1Puek_bg_vu8Hy90bDTysgtbAXLReE5kLRMopjTkjh5Fgl-uWE2PDhyzuKEA3B_xFsrORw9XqbKdNdrSvBBD0BLP1ezotbfBBmrZCZNeWb86lbUY2kjNCncvJkPSIpv7pA',
    productName: 'Kèn Saranai gỗ mun cổ truyền & Trống Paranưng bịt da',
    featuredProductIds: ['sp-03', 'sp-05'],
    badgeClass: 'bg-primary text-on-primary',
  },
  {
    id: 4,
    name: 'Nghệ nhân Đàng Năng Xoay',
    slug: 'nghe-nhan-dang-nang-xoay',
    title: 'Nghệ nhân Điêu Khắc Gốm Phù Điêu',
    experience: '42 năm tạo tác • Phục dựng mỹ thuật đền tháp',
    village: 'Làng gốm Bàu Trúc',
    specialty: 'Điêu khắc phù điêu thần thoại Champa & Gốm mỹ nghệ cổ vật',
    yearsOfDedication: 42,
    achievements: [
      'Giải thưởng Tinh hoa Làng nghề Gốm Việt Nam',
      'Tác giả hơn 50 tác phẩm phù điêu Apsara cỡ lớn tại các bảo tàng di sản',
      'Tiên phong đưa mỹ thuật đền tháp vào ứng dụng không gian kiến trúc',
    ],
    workshopLocation: 'Xưởng điêu khắc gốm mỹ nghệ, Làng Bàu Trúc, Ninh Thuận',
    quote:
      '“Từng thớ đất sét sông Quao qua bàn tay miết không cần bàn xoay, khi chạm khắc phù điêu Apsara là lúc linh hồn đền tháp sống lại trong từng vệt khói.”',
    bio: 'Nghệ nhân Đàng Năng Xoay nổi tiếng với tài nghệ kết hợp gốm Bàu Trúc nung lộ thiên cùng nghệ thuật điêu khắc tượng thần, phù điêu Champa cổ được trưng bày tại nhiều triển lãm văn hóa trong và ngoài nước.',
    schedule: 'Xưởng gốm mỹ nghệ Bàu Trúc • Đón khách tham quan & học chạm khắc hàng ngày',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd_yrvnJ_UmdnGzLVXjm5HJfxWX-epAuAP73cohAxtCHVP56EKuM52m07N2hY1obT1_Wmh6lUgDS8Ye5va33Sp_Ih3JQB5vwCQfB9tHTZWaggCM2XqEUXoaNx_-AKFbm6o3Qlh0IJLDyt4WaVcS1eO4R7ER_r7FvmnriVoglYc2JHMEote5IwsaQ4KO5jEbpEvgMErIntFFp0iOdJghlh9P7kXsJrT1xrzKEBAkfFj9OWLDV8DTpPJsg',
    handsImage: '/images/dana-life/IMG_9898.JPG',
    productImage: '/images/dana-life/IMG_9898.JPG',
    productName: 'Phù điêu Vũ nữ Apsara gốm nung & Tượng thần hộ pháp',
    featuredProductIds: ['sp-04', 'sp-08'],
    badgeClass: 'bg-secondary text-on-secondary',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    initials: 'TM',
    name: 'Thảo My',
    origin: 'Kiến trúc sư cảnh quan • TP. Hồ Chí Minh',
    avatarClass: 'bg-primary-fixed text-primary',
    content:
      '“Khoảnh khắc ngồi trên thềm nhà Muk Phan, tự tay miết bùn đất mát rượi và nghe Muk hát bài đồng dao Chăm đã làm tôi rơi nước mắt. Dana đã mang đến một góc nhìn hoàn toàn khác biệt: không thương mại hóa, ấm áp và vô cùng trang trọng.”',
  },
  {
    id: 2,
    initials: 'DM',
    name: 'David Miller',
    origin: 'Archaeology Researcher • Melbourne, Australia',
    avatarClass: 'bg-secondary-fixed text-secondary',
    content:
      '“As an archaeologist studying Southeast Asian brick temples, the sunrise tour at Po Klong Garai led by Cham scholars was an unmatched experience. The respect shown to sacred rites and local elders is something every tour company should learn from.”',
  },
  {
    id: 3,
    initials: 'ND',
    name: 'TS. Nguyễn Văn Dũng',
    origin: 'Giảng viên Văn hóa học • Hà Nội',
    avatarClass: 'bg-tertiary-fixed text-tertiary',
    content:
      '“Hành trình 2 ngày 1 đêm ở Mỹ Nghiệp đã giúp các con tôi hiểu thế nào là cội nguồn văn hóa. Đêm nghe tiếng trống Ginăng bập bùng bên bếp lửa làng, mọi âu lo phố thị dường như tan biến. Cảm ơn Dana rất nhiều!”',
  },
];

export const NAV_ITEMS: NavItem[] = [
  { path: 'cong-di-san', icon: 'temple_buddhist', label: 'Cổng di sản' },
  { path: 'hanh-trinh-kham-pha', icon: 'explore', label: 'Dana Tour' },
  { path: 'ban-do-thap-cham', icon: 'map', label: 'Bản đồ số' },
  { path: 'dat-tour-trai-nghiem', icon: 'calendar_month', label: 'Đặt tour' },
];

export const PC_NAV_LINKS: PcNavLink[] = [
  { href: '/', label: 'Trang chủ' },
  { href: '/#ve-dana', label: 'Về Dana' },
  { href: '/tour', label: 'Dana Tour' },
  { href: '/san-pham', label: 'Sản phẩm' },
  { href: '/nghe-nhan', label: 'Chân dung nghệ nhân' },
  {
    href: '/bai-viet',
    label: 'Bài Viết',
    children: [
      {
        href: '/bai-viet?category=tin-tuc',
        label: 'Tin tức',
        desc: 'Sự kiện, bảo tồn & nhịp sống bản địa',
      },
      {
        href: '/bai-viet?category=lich-su',
        label: 'Lịch sử',
        desc: 'Vương triều, khảo cổ học & di tích ngàn năm',
      },
      {
        href: '/bai-viet?category=van-hoa',
        label: 'Văn Hoá',
        desc: 'Đền tháp, làng nghề gốm - dệt & lễ hội',
      },
    ],
  },
  {
    href: '/so-hoa-di-san',
    label: 'Số hoá di sản',
    children: [
      {
        href: '/so-hoa-di-san?tab=hinh-anh',
        label: 'Hình ảnh Văn hoá',
        desc: 'Kho ảnh nghệ thuật điền dã & bảo tàng số',
      },
      {
        href: '/so-hoa-di-san?tab=ngon-ngu',
        label: 'Ngôn ngữ Chăm Akhar Thrah',
        desc: 'Ký tự cổ tương tác, âm thanh & từ điển số',
      },
      {
        href: '/so-hoa-di-san?tab=van-bia',
        label: 'Giải mã Văn bia Cổ',
        desc: 'Bản dập bia ký sa thạch Sanskrit - Chăm',
      },
    ],
  },
];

export const DESTINATION_OPTIONS = [
  'Tất cả vùng di sản',
  'Tháp Po Klong Garai (Đô Vinh)',
  'Làng gốm Bàu Trúc (Phước Dân)',
  'Dệt thổ cẩm Mỹ Nghiệp (Ninh Phước)',
  'Đền tháp thiêng Po Rome (Hậu Sanh)',
  'Bảo tàng Văn hóa Chăm Ninh Thuận',
];

export const EXPERIENCE_OPTIONS = [
  'Gốm nung lộ thiên & Muk',
  'Giải mã bia ký & Khảo cổ',
  'Đêm hội Katê & Thổ cẩm',
  'Nhiếp ảnh Di sản Chuyên sâu',
];

export const TRAVELER_OPTIONS = [
  '2 khách (Trải nghiệm riêng tư)',
  '1 khách (Hành hương cá nhân)',
  '4 - 6 khách (Gia đình/Nhóm bạn)',
  'Đoàn khảo cứu (> 8 khách)',
];
