import { useState, useEffect } from "react";
import { Maximize2, X, MapPin, Camera, Sparkles } from "lucide-react";

export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  author: string;
  category: string;
}

// Danh sách các bức ảnh chân thực của cộng đồng Champa
const ROW_1_IMAGES: GalleryItem[] = [
  {
    id: "r1-1",
    title: "Nắng sớm ngõ làng gốm Bàu Trúc",
    location: "Làng Bàu Trúc, Ninh Phước",
    imageUrl: "/images/dana-life/IMG_9898.JPG",
    author: "Ký sự điền dã Dana",
    category: "Làng nghề",
  },
  {
    id: "r1-2",
    title: "Bình minh trên đỉnh tháp Po Klong Garai",
    location: "Tháp Đô Vinh, Phan Rang",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWzz5wVWN2Rre_bf3lzTZ89szZW61A19gyuIM1D6eHB2bgjSvLJ2IjqYRR2_FvWNOaiuYH_mZKTaaCYHyrAo6Y-MHZRm5QMjTQqVYlWO-UTZpP7j-38TvaXGvTC0E43MbjaK6OcYizspkYPA97vZ7ux2qQedU074FLdyFMB7zxmwJM_GGaJUJxVOmC--t3UtTdUYuMj2PhxbPFLX9SyKZLF-p5BPhi_fHZpOUSInajqnNWFka72rYwew",
    author: "Đỗ Hữu Trí",
    category: "Đền tháp",
  },
  {
    id: "r1-3",
    title: "Kỹ nghệ nặn gốm 'tay làm chân quay'",
    location: "Lò gốm Bàu Trúc",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAd_yrvnJ_UmdnGzLVXjm5HJfxWX-epAuAP73cohAxtCHVP56EKuM52m07N2hY1obT1_Wmh6lUgDS8Ye5va33Sp_Ih3JQB5vwCQfB9tHTZWaggCM2XqEUXoaNx_-AKFbm6o3Qlh0IJLDyt4WaVcS1eO4R7ER_r7FvmnriVoglYc2JHMEote5IwsaQ4KO5jEbpEvgMErIntFFp0iOdJghlh9P7kXsJrT1xrzKEBAkfFj9OWLDV8DTpPJsg",
    author: "Viện Di sản",
    category: "Nghề cổ",
  },
  {
    id: "r1-4",
    title: "Nụ cười đôn hậu xóm Chăm",
    location: "Phước Dân, Ninh Thuận",
    imageUrl: "/images/dana-life/IMG_9901.JPG",
    author: "Chân dung bản địa",
    category: "Con người",
  },
  {
    id: "r1-5",
    title: "Điệu múa quạt chim công lễ hội Katê",
    location: "Sân lễ Đền tháp Po Nagar",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAp5oGIUVAeSJNWnmsriAoE7Rx-gdVHGigsy1epg2Fah3OzIXtn7INt9avN5y3DYyr_5mgSbawDhhdB6AVM-eYtjoRZfxrq27rRi1-chffHIx6soB1QRX5R3xTS8gl_eF19cPeH7hONAuA5dgaNxeEG4JYrWaLNmlFYWVg8fXjwigzILTDoZgUaOHe27pOw-PL1DfizD5qy-ARG-iBr0tq2l090mbglxQI-yq7RDH_u_9aIirJEjUmV9Q",
    author: "Bá Minh Cường",
    category: "Lễ hội",
  },
  {
    id: "r1-6",
    title: "Sợi chỉ nhuộm màu vỏ rừng bên khung cửi cổ",
    location: "Làng Mỹ Nghiệp",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCnUVQIkkzk4sUIaAcHvZKq-_JFsMVjkwWi6wVJYz1b38pTtWTcB_NnJA9pUSrOog9MIIrHBMjNMwmZ07G62QeC68HKaFH2ZC3FLZR1ykISx0jftWhDdHrOTZyDGh6OxckvxscMAIC0lKtMK89ZXTNb9p4uIebpPghBC4Qz-x4S-IRHj1glQM0pYgcmuItDQ5ICUQO9VGBUbRyuV-L5vdNRAZPn1RVNCS2THNjEc9XBmkvxGOQuBI0ZjQ",
    author: "Đàng Thị Loan",
    category: "Dệt thổ cẩm",
  },
  {
    id: "r1-7",
    title: "Khoảng trời xanh bên nếp nhà gỗ",
    location: "Xóm cổ Mỹ Nghiệp",
    imageUrl: "/images/dana-life/IMG_9911.JPG",
    author: "Kiến trúc bản địa",
    category: "Đời sống",
  },
  {
    id: "r1-8",
    title: "Thần hộ mệnh Po Rome giữa bóng chiều tà",
    location: "Tháp Po Rome, Hậu Sanh",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzljZH7__gmKglHYhA2NZtHh2wp1_j6eufhB24fW5dLEg6Q3iVPhcklfXTyfQfftG0s3kkeFa45XwJi0fI0t965d-lV9hy3Bp86bWdiRgQjJMFwqoPZzvC1Puek_bg_vu8Hy90bDTysgtbAXLReE5kLRMopjTkjh5Fgl-uWE2PDhyzuKEA3B_xFsrORw9XqbKdNdrSvBBD0BLP1ezotbfBBmrZCZNeWb86lbUY2kjNCncvJkPSIpv7pA",
    author: "Nguyễn Thanh Tùng",
    category: "Đền tháp",
  },
];

const ROW_2_IMAGES: GalleryItem[] = [
  {
    id: "r2-1",
    title: "Thanh âm kèn Saranai & đôi nhịp trống Paranưng",
    location: "Tháp Đô Vinh",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByRjv3i0FgHFxRrA7jzb_vp4kh7-P-4NrSYq9Zkk1lt5uKtg0Nqhq3LnRPLql0yHGiNMjL6ZdJ4bvwAco_jKoi5cKVVQyrhDXC_CtMT08OA5ogzdkhkYr96QFa4Jly_q9fjQIvrK6GcFT1JJlUR6bxy0yVImxdXGO8N5wDrB4tcuYiFJUP6SevjiPWkYr2orVSIoCNJDpVkrUBSCZVndc03_Kqs_3OkB2XPFgcw_7FdSU08jQAjDT5ZQ",
    author: "Trương Quang Nam",
    category: "Nhạc cụ thiêng",
  },
  {
    id: "r2-2",
    title: "Đàn cừu về chuồng trong chiều hoàng hôn",
    location: "Đồng cừu An Hải, Ninh Thuận",
    imageUrl: "/images/dana-life/IMG_3237.JPG",
    author: "Nhiếp ảnh phong cảnh",
    category: "Thiên nhiên",
  },
  {
    id: "r2-3",
    title: "Ánh mắt người giữ lửa Muk Đàng Thị Phan",
    location: "Làng gốm Bàu Trúc",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGoBQ0YTbgeC_aU74pGXo1oL2EIQvXidi293uM-D3IC3ytJg2Kb6n6-zQS893aL4Y-1ZeWUHgOy0CXn1RYU6Xg5ERRBTu44GX82RIfmSysT1lBGe11NxBc90UySzTISL4VfCfy2kwAwDqdhlo7-qSU4n9Wq149H7EgzP6jyN0S770xNmbtg8Bb8Sgmfn2GG91FQp1KF8UL6tZrnZDkKMgDqHyyIWjTGrAQtlhGDBIJVsnjy0rGg1nHJw",
    author: "Trần Tuấn Linh",
    category: "Nghệ nhân",
  },
  {
    id: "r2-4",
    title: "Khung cửi thoi đưa bên hiên nhà Chăm",
    location: "Mỹ Nghiệp, Phước Dân",
    imageUrl: "/images/dana-life/IMG_9911.JPG",
    author: "Ký sự điền dã",
    category: "Làng nghề",
  },
  {
    id: "r2-5",
    title: "Nghệ nhân Phú Thị Mỡ bên hoa văn hoàng cung",
    location: "HTX Thổ cẩm Mỹ Nghiệp",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9DOa0kU9XPSC4ElDUYdkw-HVXrxst6qmjl-lUQl29coyB3dJ9-vQbqfdakYBl6jppcYvq7Nih94eJY0xa602x9Lm9fSWkwUkez46Mou_js76LipE83WzU-xNC6p9A37bPiJRQnRypjtRBqPGz3udpwc7pbWEAirI405yrHUOQpBqIg_hKppN7Wr772Erm11GCx3XktevmV50KpaZjljmWw7I8dpauAhny2KblbS9-SwL6i64m5yCz0A",
    author: "Lê Hoàng Yến",
    category: "Nghệ nhân",
  },
  {
    id: "r2-6",
    title: "Sắc nắng ban mai trên vách tháp gạch cổ",
    location: "Tháp Po Klong Garai",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWzz5wVWN2Rre_bf3lzTZ89szZW61A19gyuIM1D6eHB2bgjSvLJ2IjqYRR2_FvWNOaiuYH_mZKTaaCYHyrAo6Y-MHZRm5QMjTQqVYlWO-UTZpP7j-38TvaXGvTC0E43MbjaK6OcYizspkYPA97vZ7ux2qQedU074FLdyFMB7zxmwJM_GGaJUJxVOmC--t3UtTdUYuMj2PhxbPFLX9SyKZLF-p5BPhi_fHZpOUSInajqnNWFka72rYwew",
    author: "Di sản Champa",
    category: "Di tích",
  },
  {
    id: "r2-7",
    title: "Ánh mắt trong veo của thế hệ tiếp nối",
    location: "Xóm Chăm Panduranga",
    imageUrl: "/images/dana-life/IMG_9901.JPG",
    author: "Bá Minh Cường",
    category: "Con người",
  },
  {
    id: "r2-8",
    title: "Rực rỡ sắc màu lễ phục truyền thống Katê",
    location: "Lễ hội Đền Po Nagar",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAp5oGIUVAeSJNWnmsriAoE7Rx-gdVHGigsy1epg2Fah3OzIXtn7INt9avN5y3DYyr_5mgSbawDhhdB6AVM-eYtjoRZfxrq27rRi1-chffHIx6soB1QRX5R3xTS8gl_eF19cPeH7hONAuA5dgaNxeEG4JYrWaLNmlFYWVg8fXjwigzILTDoZgUaOHe27pOw-PL1DfizD5qy-ARG-iBr0tq2l090mbglxQI-yq7RDH_u_9aIirJEjUmV9Q",
    author: "Văn hóa dân gian",
    category: "Lễ hội",
  },
];

const ROW_3_IMAGES: GalleryItem[] = [
  {
    id: "r3-1",
    title: "Hoa văn quả trám biểu trưng vũ trụ Chăm",
    location: "Làng thổ cẩm Mỹ Nghiệp",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCnUVQIkkzk4sUIaAcHvZKq-_JFsMVjkwWi6wVJYz1b38pTtWTcB_NnJA9pUSrOog9MIIrHBMjNMwmZ07G62QeC68HKaFH2ZC3FLZR1ykISx0jftWhDdHrOTZyDGh6OxckvxscMAIC0lKtMK89ZXTNb9p4uIebpPghBC4Qz-x4S-IRHj1glQM0pYgcmuItDQ5ICUQO9VGBUbRyuV-L5vdNRAZPn1RVNCS2THNjEc9XBmkvxGOQuBI0ZjQ",
    author: "Đàng Thị Loan",
    category: "Thổ cẩm",
  },
  {
    id: "r3-2",
    title: "Nhịp sống thanh bình xóm Chăm ven đồng",
    location: "Hamu Trok, Bàu Trúc",
    imageUrl: "/images/dana-life/IMG_9898.JPG",
    author: "Ký sự điền dã",
    category: "Làng cổ",
  },
  {
    id: "r3-3",
    title: "Miết đất nung gốm bên ngọn lửa rơm",
    location: "Bàu Trúc, Ninh Phước",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAd_yrvnJ_UmdnGzLVXjm5HJfxWX-epAuAP73cohAxtCHVP56EKuM52m07N2hY1obT1_Wmh6lUgDS8Ye5va33Sp_Ih3JQB5vwCQfB9tHTZWaggCM2XqEUXoaNx_-AKFbm6o3Qlh0IJLDyt4WaVcS1eO4R7ER_r7FvmnriVoglYc2JHMEote5IwsaQ4KO5jEbpEvgMErIntFFp0iOdJghlh9P7kXsJrT1xrzKEBAkfFj9OWLDV8DTpPJsg",
    author: "Nghệ nhân bản địa",
    category: "Gốm cổ",
  },
  {
    id: "r3-4",
    title: "Chiều buông lững lờ trên thảo nguyên cừu",
    location: "Đồng cừu An Hải",
    imageUrl: "/images/dana-life/IMG_3237.JPG",
    author: "Phong cảnh",
    category: "Đồng quê",
  },
  {
    id: "r3-5",
    title: "Tháp Po Rome sừng sững tạc vào nền trời",
    location: "Đồi Hậu Sanh, Ninh Phước",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzljZH7__gmKglHYhA2NZtHh2wp1_j6eufhB24fW5dLEg6Q3iVPhcklfXTyfQfftG0s3kkeFa45XwJi0fI0t965d-lV9hy3Bp86bWdiRgQjJMFwqoPZzvC1Puek_bg_vu8Hy90bDTysgtbAXLReE5kLRMopjTkjh5Fgl-uWE2PDhyzuKEA3B_xFsrORw9XqbKdNdrSvBBD0BLP1ezotbfBBmrZCZNeWb86lbUY2kjNCncvJkPSIpv7pA",
    author: "Trần Tuấn Linh",
    category: "Đền tháp",
  },
  {
    id: "r3-6",
    title: "Không gian thoáng đãng bên hàng hiên Chăm",
    location: "Làng Mỹ Nghiệp",
    imageUrl: "/images/dana-life/IMG_9911.JPG",
    author: "Kiến trúc",
    category: "Đời sống",
  },
  {
    id: "r3-7",
    title: "Hòa tấu Saranai vang vọng núi rừng",
    location: "Lễ tế thần tháp Chăm",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByRjv3i0FgHFxRrA7jzb_vp4kh7-P-4NrSYq9Zkk1lt5uKtg0Nqhq3LnRPLql0yHGiNMjL6ZdJ4bvwAco_jKoi5cKVVQyrhDXC_CtMT08OA5ogzdkhkYr96QFa4Jly_q9fjQIvrK6GcFT1JJlUR6bxy0yVImxdXGO8N5wDrB4tcuYiFJUP6SevjiPWkYr2orVSIoCNJDpVkrUBSCZVndc03_Kqs_3OkB2XPFgcw_7FdSU08jQAjDT5ZQ",
    author: "Nhạc khí thiêng",
    category: "Lễ hội",
  },
  {
    id: "r3-8",
    title: "Nụ cười hồn hậu của bậc trưởng làng",
    location: "Phước Dân, Ninh Thuận",
    imageUrl: "/images/dana-life/IMG_9901.JPG",
    author: "Chân dung",
    category: "Con người",
  },
];

export default function ChampaCommunityGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  // Đóng lightbox bằng phím Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Nhân bản đôi mảng ảnh để chạy marquee vô tận mượt mà
  const row1Doubled = [...ROW_1_IMAGES, ...ROW_1_IMAGES];
  const row2Doubled = [...ROW_2_IMAGES, ...ROW_2_IMAGES];
  const row3Doubled = [...ROW_3_IMAGES, ...ROW_3_IMAGES];

  const renderPhotoCard = (item: GalleryItem, index: number) => (
    <div
      key={`${item.id}-${index}`}
      onClick={() => setSelectedPhoto(item)}
      className="group relative h-40 sm:h-48 lg:h-56 shrink-0 rounded-2xl overflow-hidden bg-stone-900 border border-surface-container-high/70 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer select-none"
    >
      {/* Ảnh hiển thị chuẩn kích thước thật, không bị kéo dãn */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="h-full w-auto max-w-[340px] sm:max-w-[420px] object-contain sm:object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        loading="lazy"
      />

      {/* Lớp phủ thông tin khi hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 sm:p-4 text-white z-10">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-bold uppercase tracking-wider">
            {item.category}
          </span>
          <div className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90">
            <Maximize2 className="h-3.5 w-3.5" />
          </div>
        </div>

        <div>
          <h4 className="text-xs sm:text-sm font-bold font-serif line-clamp-1 leading-snug text-white">
            {item.title}
          </h4>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-white/80 mt-1">
            <MapPin className="h-3 w-3 text-amber-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative w-full py-12 sm:py-16 lg:py-20 bg-surface overflow-hidden hover-pause-marquee">
      {/* ========================================================
          1. HEADER SECTION
      ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Kho Tàng Tư Liệu Điền Dã</span>
        </div>

        {/* Phụ đề tôn vinh nét văn hóa */}
        <p className="font-body-md text-xs sm:text-sm lg:text-base text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
          Nhịp thở di sản sống động qua từng góc máy — Từ sắc đỏ đền tháp ngàn năm, làn khói thơm lò gốm Bàu Trúc đến nụ cười hiền hậu của cộng đồng Panduranga bản địa.
        </p>
      </div>

      {/* ========================================================
          2. 3 HÀNG ẢNH CHẠY TỪ PHẢI SANG TRÁI, XẾP XEN KẼ (MARQUEE)
      ======================================================== */}
      <div className="relative w-full flex flex-col gap-3 sm:gap-4 lg:gap-5 overflow-hidden">
        {/* Lớp mờ chuyển tiếp hai bên mép màn hình (Edge Gradient Masks) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 lg:w-44 bg-gradient-to-r from-surface to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 lg:w-44 bg-gradient-to-l from-surface to-transparent z-20" />

        {/* HÀNG 1: Chạy từ phải sang trái (Tốc độ 50s) */}
        <div className="overflow-hidden w-full">
          <div className="animate-marquee-row-1 gap-3 sm:gap-4 lg:gap-5">
            {row1Doubled.map((item, idx) => renderPhotoCard(item, idx))}
          </div>
        </div>

        {/* HÀNG 2: Chạy từ phải sang trái, so le xen kẽ (Tốc độ 62s - có offset -ml-16) */}
        <div className="overflow-hidden w-full">
          <div className="animate-marquee-row-2 gap-3 sm:gap-4 lg:gap-5 -ml-16 sm:-ml-24">
            {row2Doubled.map((item, idx) => renderPhotoCard(item, idx))}
          </div>
        </div>

        {/* HÀNG 3: Chạy từ phải sang trái, so le xen kẽ (Tốc độ 44s - có offset -ml-32) */}
        <div className="overflow-hidden w-full">
          <div className="animate-marquee-row-3 gap-3 sm:gap-4 lg:gap-5 -ml-32 sm:-ml-48">
            {row3Doubled.map((item, idx) => renderPhotoCard(item, idx))}
          </div>
        </div>
      </div>

      {/* Ghi chú gợi ý rê chuột */}
      <div className="text-center mt-6 text-xs text-on-surface-variant/70 font-medium">
        <span>Rê chuột vào hình ảnh để dừng chuyển động và xem chú thích</span>
      </div>

      {/* ========================================================
          3. LIGHTBOX XEM ẢNH KÍCH THƯỚC ĐẦY ĐỦ KHI NHẤP CHUỘT
      ======================================================== */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200 select-none"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Header Lightbox */}
          <div
            className="flex items-center justify-between text-white w-full max-w-6xl mx-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-white/10 text-white font-label-sm text-xs font-bold uppercase tracking-wider">
                {selectedPhoto.category}
              </span>
              <span className="text-white/80 text-xs sm:text-sm font-serif">
                {selectedPhoto.title}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Ảnh trung tâm */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.title}
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
            />
          </div>

          {/* Footer Lightbox */}
          <div
            className="flex items-center justify-between text-white/80 w-full max-w-6xl mx-auto z-10 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
              <span>{selectedPhoto.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Camera className="h-3.5 w-3.5 text-amber-400" />
              <span>{selectedPhoto.author}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
