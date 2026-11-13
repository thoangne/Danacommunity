export interface DigitalSite {
  id: string;
  name: string;
  ancientName: string;
  century: string;
  district: string;
  coords: [number, number];
  preservationStatus: 'Đang bảo tồn tốt' | 'Đã trùng tu' | 'Cần bảo vệ khẩn cấp';
  scanResolution: string;
  model3DUrl?: string;
  image: string;
  description: string;
  artifactsCount: number;
}

export interface Model3DItem {
  id: string;
  title: string;
  category: 'monument' | 'ceramic' | 'sculpture';
  material: string;
  period: string;
  origin: string;
  polygonCount: string;
  previewImage: string;
  description: string;
  highlights: string[];
}

export interface DigitalInscription {
  id: string;
  code: string;
  title: string;
  language: 'Sanskrit' | 'Chăm Cổ' | 'Song ngữ Sanskrit - Chăm';
  material: string;
  foundLocation: string;
  preservationPlace: string;
  transliterationSnippet: string;
  vietnameseMeaning: string;
  image: string;
}

export const DIGITAL_SITES: DigitalSite[] = [
  {
    id: 'site-1',
    name: 'Đền tháp Po Klong Garai',
    ancientName: 'Kalan Po Klong Garai',
    century: 'Thế kỷ XIII - XIV',
    district: 'Đô Vinh, TP. Phan Rang - Tháp Chàm',
    coords: [11.6033, 108.9482],
    preservationStatus: 'Đang bảo tồn tốt',
    scanResolution: 'LIDAR Point Cloud 0.5mm',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBWzz5wVWN2Rre_bf3lzTZ89szZW61A19gyuIM1D6eHB2bgjSvLJ2IjqYRR2_FvWNOaiuYH_mZKTaaCYHyrAo6Y-MHZRm5QMjTQqVYlWO-UTZpP7j-38TvaXGvTC0E43MbjaK6OcYizspkYPA97vZ7ux2qQedU074FLdyFMB7zxmwJM_GGaJUJxVOmC--t3UtTdUYuMj2PhxbPFLX9SyKZLF-p5BPhi_fHZpOUSInajqnNWFka72rYwew',
    description:
      'Quần thể kiến trúc gạch nung đỉnh cao của phong cách muộn Champa, gồm tháp Cổng (Gopura), tháp Lửa (Kosagrha) và tháp Chính (Kalan).',
    artifactsCount: 24,
  },
  {
    id: 'site-2',
    name: 'Tháp Po Rome',
    ancientName: 'Kalan Po Rome',
    century: 'Thế kỷ XVII',
    district: 'Làng Hậu Sanh, Huyện Ninh Phước',
    coords: [11.5178, 108.9205],
    preservationStatus: 'Đã trùng tu',
    scanResolution: 'Photogrammetry 4K Multi-angle',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAzljZH7__gmKglHYhA2NZtHh2wp1_j6eufhB24fW5dLEg6Q3iVPhcklfXTyfQfftG0s3kkeFa45XwJi0fI0t965d-lV9hy3Bp86bWdiRgQjJMFwqoPZzvC1Puek_bg_vu8Hy90bDTysgtbAXLReE5kLRMopjTkjh5Fgl-uWE2PDhyzuKEA3B_xFsrORw9XqbKdNdrSvBBD0BLP1ezotbfBBmrZCZNeWb86lbUY2kjNCncvJkPSIpv7pA',
    description:
      'Ngôi đền tháp xây dựng trên ngọn đồi đá biệt lập, thờ vị vua cuối cùng được phong thánh trong tâm thức người Chăm.',
    artifactsCount: 12,
  },
  {
    id: 'site-3',
    name: 'Di chỉ Làng gốm Bàu Trúc',
    ancientName: 'Paley Hamu Trok',
    century: 'Cổ truyền liên tục từ TK XII',
    district: 'Thị trấn Phước Dân, Ninh Phước',
    coords: [11.5312, 108.9567],
    preservationStatus: 'Cần bảo vệ khẩn cấp',
    scanResolution: 'Spatial Audio & 3D Motion',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAd_yrvnJ_UmdnGzLVXjm5HJfxWX-epAuAP73cohAxtCHVP56EKuM52m07N2hY1obT1_Wmh6lUgDS8Ye5va33Sp_Ih3JQB5vwCQfB9tHTZWaggCM2XqEUXoaNx_-AKFbm6o3Qlh0IJLDyt4WaVcS1eO4R7ER_r7FvmnriVoglYc2JHMEote5IwsaQ4KO5jEbpEvgMErIntFFp0iOdJghlh9P7kXsJrT1xrzKEBAkfFj9OWLDV8DTpPJsg',
    description:
      'Không gian sinh thái sống bảo tồn kỹ thuật nắn gốm bằng tay và nung lộ thiên của phụ nữ Chăm.',
    artifactsCount: 45,
  },
  {
    id: 'site-4',
    name: 'Tháp Hòa Lai',
    ancientName: 'Kalan Ba Tháp',
    century: 'Thế kỷ IX',
    district: 'Xã Bắc Phong, Huyện Thuận Bắc',
    coords: [11.6914, 109.0256],
    preservationStatus: 'Đã trùng tu',
    scanResolution: 'LIDAR Drone Scan 8K',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCwp2O4wPSnQhuVaJC7FhDwhbAV99dJiNseJ8THl9kE3ZY-0-aWLkok7zJ2WFFTllPxI8xy6UnD4bMHSYOHgQU5jLBoC0NaOBbfExmtQi-oGTw0h6220cmB-zNjl2Auo4xUsIq4FaUBuWrFmt7pP8me2uC0ICy0quUbgeXQoTgwFNk2AyMdZY6qHNz4BvpEXd_cTS1l7HXgiVYib2QZVdvIbOYTgbdANF3PE9u-YLVSos0Gm8q7U22f8Q',
    description:
      'Một trong những cụm tháp cổ kính bậc nhất Đông Dương còn giữ vẹn nguyên các mảng hoa văn vòm cửa cuốn chạm khắc tinh xảo trực tiếp trên gạch.',
    artifactsCount: 18,
  },
  {
    id: 'site-5',
    name: 'Đập thuỷ lợi Nha Trinh',
    ancientName: 'Banưng Chaklin Nha Trinh',
    century: 'Thế kỷ XIII - XIV',
    district: 'Sông Dinh, Xã Nhơn Sơn & Đô Vinh',
    coords: [11.612, 108.931],
    preservationStatus: 'Đang bảo tồn tốt',
    scanResolution: 'Drone Orthomosaic 4K',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBUfYzm1NZ4arEZYOjXP-ADVRrL2xvxRYpA11bkxwybvUPyaLDDHcbzdna3ORWQdNhRZ691hmCL8NhJzSAjGU5gLcf6loBzxm9LlDDjY-bDf5UiEUEa8dCbgRQO5NwMElBhJX6SjLnotVvZ4SesvgT8Thywsaeywlcgwf1tW1jO8xFQbtJMa3R7BXOwL3MrVqNKr5Y-maFTUq9d3YpEzE5Uvj6QVImJxg-rCyKTWSyfkqmmjoELc7hWkA',
    description:
      'Công trình thủy lợi đá cổ kính điều tiết dòng nước sông Dinh do vua Po Klaong Garay tổ chức thi công.',
    artifactsCount: 8,
  },
  {
    id: 'site-6',
    name: 'Núi Đá Trắng - Cek Yang Patao',
    ancientName: 'Cek Yang Patao (Núi Thần Vua)',
    century: 'Địa mạo hàng triệu năm',
    district: 'Thôn Như Bình, Xã Phước Hữu',
    coords: [11.512, 108.889],
    preservationStatus: 'Đang bảo tồn tốt',
    scanResolution: 'DEM Elevation Map 1m',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXnVPS6oUU6URxfP4TdxHq-UsUwE04_gnpvwkrptd7BS9dXmx1ChJ7WMISmS784kI32f0t8UQRf6k-MDPPx_XQJ664Ju5dHKtYkiO-EGDM0AHxY3pwwfDkogXvFWI_HnsiYVujgmtrvXQitBbSLyAF2U3jmzcl-P6-1W9bb78_xcGU8fN1JZ7J8spZY0Xv9IkZsFQ2keAyI_isVwMyrwg1DzRYwMwraJ8pgS3d9giKmqo58fEtRvN1RA',
    description:
      'Thắng cảnh núi đá hoa cương trắng tự nhiên gắn với huyền tích Yang Patao giữa đồng bằng Ninh Phước.',
    artifactsCount: 6,
  },
  {
    id: 'site-7',
    name: 'Đền thờ Po Ina Nagar Hữu Đức',
    ancientName: 'Paley Hamu Tanran',
    century: 'Cổ truyền qua nhiều thế hệ',
    district: 'Làng Hữu Đức, Xã Phước Hữu',
    coords: [11.505, 108.905],
    preservationStatus: 'Đang bảo tồn tốt',
    scanResolution: 'Photogrammetry 3D Spatial Audio',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAp5oGIUVAeSJNWnmsriAoE7Rx-gdVHGigsy1epg2Fah3OzIXtn7INt9avN5y3DYyr_5mgSbawDhhdB6AVM-eYtjoRZfxrq27rRi1-chffHIx6soB1QRX5R3xTS8gl_eF19cPeH7hONAuA5dgaNxeEG4JYrWaLNmlFYWVg8fXjwigzILTDoZgUaOHe27pOw-PL1DfizD5qy-ARG-iBr0tq2l090mbglxQI-yq7RDH_u_9aIirJEjUmV9Q',
    description:
      'Nơi gìn giữ hòm Y trang thiêng liêng của Nữ thần Mẹ Xứ Sở và trung tâm khởi phát tiếng trống hội Katê.',
    artifactsCount: 15,
  },
  {
    id: 'site-8',
    name: 'Làng Văn hóa Chăm Palei Baoh Dana',
    ancientName: 'Paley Baoh Dana (Chất Thường)',
    century: 'Định cư liên tục qua nhiều thế kỷ',
    district: 'Thôn Chất Thường, Xã Phước Hậu',
    coords: [11.545, 108.925],
    preservationStatus: 'Đang bảo tồn tốt',
    scanResolution: 'Virtual Tour 360 Panorama',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuByRjv3i0FgHFxRrA7jzb_vp4kh7-P-4NrSYq9Zkk1lt5uKtg0Nqhq3LnRPLql0yHGiNMjL6ZdJ4bvwAco_jKoi5cKVVQyrhDXC_CtMT08OA5ogzdkhkYr96QFa4Jly_q9fjQIvrK6GcFT1JJlUR6bxy0yVImxdXGO8N5wDrB4tcuYiFJUP6SevjiPWkYr2orVSIoCNJDpVkrUBSCZVndc03_Kqs_3OkB2XPFgcw_7FdSU08jQAjDT5ZQ',
    description:
      'Trái tim du lịch cộng đồng Dana, nơi giao thoa văn hóa Chăm - Kinh và bảo tồn kiến trúc nhà mẫu hệ cổ truyền.',
    artifactsCount: 20,
  },
];

export const MODELS_3D: Model3DItem[] = [
  {
    id: 'model-1',
    title: 'Tháp Chính Kalan Po Klong Garai',
    category: 'monument',
    material: 'Gạch đất nung & Sa thạch',
    period: 'Thế kỷ XIII',
    origin: 'Đồi Trầu, Ninh Thuận',
    polygonCount: '1.250.000 Đa giác (LOD 1)',
    previewImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBWzz5wVWN2Rre_bf3lzTZ89szZW61A19gyuIM1D6eHB2bgjSvLJ2IjqYRR2_FvWNOaiuYH_mZKTaaCYHyrAo6Y-MHZRm5QMjTQqVYlWO-UTZpP7j-38TvaXGvTC0E43MbjaK6OcYizspkYPA97vZ7ux2qQedU074FLdyFMB7zxmwJM_GGaJUJxVOmC--t3UtTdUYuMj2PhxbPFLX9SyKZLF-p5BPhi_fHZpOUSInajqnNWFka72rYwew',
    description:
      'Mô hình 3D độ nét cực cao quét bằng công nghệ LiDAR đo vẽ laser, tái hiện từng vết nứt thời gian và cấu trúc mộng gạch chập khít không dùng vôi vữa.',
    highlights: [
      'Cửa giả trang trí hình thần Shiva đa thủ',
      'Đỉnh tháp 4 tầng thu nhỏ tượng trưng núi Meru',
      'Tượng bò thần Nandi đá sa thạch trong tiền sảnh',
    ],
  },
  {
    id: 'model-2',
    title: 'Bình Gốm Thiêng Kala Cổ Bàu Trúc',
    category: 'ceramic',
    material: 'Đất sét bồi sông Quao & Bụi rơm nung',
    period: 'Hiện vật phục dựng nguyên bản thế kỷ XIV',
    origin: 'Paley Hamu Trok',
    polygonCount: '480.000 Đa giác',
    previewImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAd_yrvnJ_UmdnGzLVXjm5HJfxWX-epAuAP73cohAxtCHVP56EKuM52m07N2hY1obT1_Wmh6lUgDS8Ye5va33Sp_Ih3JQB5vwCQfB9tHTZWaggCM2XqEUXoaNx_-AKFbm6o3Qlh0IJLDyt4WaVcS1eO4R7ER_r7FvmnriVoglYc2JHMEote5IwsaQ4KO5jEbpEvgMErIntFFp0iOdJghlh9P7kXsJrT1xrzKEBAkfFj9OWLDV8DTpPJsg',
    description:
      'Scan 3D 360 độ bình Kala dùng trong các nghi lễ phong chức chức sắc tôn giáo. Bề mặt phủ lớp nước vỏ hạt điều và khói loang độc bản.',
    highlights: [
      'Hoa văn khắc vạch hình sóng nước Makara',
      'Miệng bình tạo hình búp hoa sen hé nở',
      'Vết khói loang đỏ vàng đặc trưng nung lộ thiên',
    ],
  },
  {
    id: 'model-3',
    title: 'Phù Điêu Nữ Thần Apsara Múa Thiêng',
    category: 'sculpture',
    material: 'Đá sa thạch xanh mịn',
    period: 'Thế kỷ X',
    origin: 'Bảo tàng Văn hóa Chăm Ninh Thuận',
    polygonCount: '890.000 Đa giác',
    previewImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCwp2O4wPSnQhuVaJC7FhDwhbAV99dJiNseJ8THl9kE3ZY-0-aWLkok7zJ2WFFTllPxI8xy6UnD4bMHSYOHgQU5jLBoC0NaOBbfExmtQi-oGTw0h6220cmB-zNjl2Auo4xUsIq4FaUBuWrFmt7pP8me2uC0ICy0quUbgeXQoTgwFNk2AyMdZY6qHNz4BvpEXd_cTS1l7HXgiVYib2QZVdvIbOYTgbdANF3PE9u-YLVSos0Gm8q7U22f8Q',
    description:
      'Scan số hóa chi tiết đường nét cơ thể mềm mại, nụ cười bí ẩn và vòng trang sức tinh tế của vũ nữ thiên giới Champa.',
    highlights: [
      'Tư thế uốn mình Tribhanga tam khúc kinh điển',
      'Mũ miện chạm khắc hoa văn búp sen tinh xảo',
      'Đai lưng nạm ngọc tái hiện qua mặt cắt 3D',
    ],
  },
];

export const DIGITAL_INSCRIPTIONS: DigitalInscription[] = [
  {
    id: 'ins-1',
    code: 'Bia Ký C.101',
    title: 'Văn Bia Tháp Po Klong Garai',
    language: 'Song ngữ Sanskrit - Chăm',
    material: 'Trụ đá sa thạch nguyên khối',
    foundLocation: 'Bên phải cửa tháp chính Po Klong Garai',
    preservationPlace: 'Tại chỗ (In-situ)',
    transliterationSnippet:
      'Om namas Sivaya... Svasti Sri Po Klong Garai raja...',
    vietnameseMeaning:
      'Kính lạy thần Shiva... Chúc tụng đức vua Po Klong Garai đã cho dựng ngọn tháp này để che chở cho dân chúng khỏi hạn hán, dẫn nguồn nước ngọt về muôn nơi...',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFoCx55fZOaoTTciJYrWm2VQZrJSqmmt_dSYCWBlFm7F0pqD9gv994QuiJWdKl2ZxAT9uci4bqRtGo5yRHgju7_F7kdp9X5zxKFH_5zfx_5zLGxCFu0Bc9SN0tkrwm72FxlGux_ZpL6DcFDLVkNGFTChkoefxRUOxCdUkTDE62zQC--cDMoSQu4ccNT1ymJqdomRp6EjxNv7XxONMLmHFQLqO-XTyfEvY5-ui6Xyj_Ua7sjcxtLIqD0g',
  },
  {
    id: 'ins-2',
    code: 'Bia Ký C.114',
    title: 'Văn Bia Tháp Po Rome',
    language: 'Chăm Cổ',
    material: 'Phiến đá sa thạch đen',
    foundLocation: 'Gần bệ thờ Linga trong tháp Po Rome',
    preservationPlace: 'Bảo tàng Văn hóa Chăm',
    transliterationSnippet:
      'Ni ppo Rome yang padruk bi duk sa-ap...',
    vietnameseMeaning:
      'Đây là nơi an nghỉ của đức vua Po Rome, vị thần linh che chở vùng đất Panduranga, công đức lưu truyền đến muôn ngàn đời sau...',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAzljZH7__gmKglHYhA2NZtHh2wp1_j6eufhB24fW5dLEg6Q3iVPhcklfXTyfQfftG0s3kkeFa45XwJi0fI0t965d-lV9hy3Bp86bWdiRgQjJMFwqoPZzvC1Puek_bg_vu8Hy90bDTysgtbAXLReE5kLRMopjTkjh5Fgl-uWE2PDhyzuKEA3B_xFsrORw9XqbKdNdrSvBBD0BLP1ezotbfBBmrZCZNeWb86lbUY2kjNCncvJkPSIpv7pA',
  },
];
