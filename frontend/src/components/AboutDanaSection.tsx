import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Scroll,
  Landmark,
  MapPin,
  BookOpen,
  Maximize2,
  X,
  ArrowRight,
  ShieldCheck,
  Compass,
  Award,
} from "lucide-react";

interface HousePhoto {
  id: string;
  title: string;
  viewLabel: string;
  image: string;
  caption: string;
  detail: string;
}

const HOUSE_PHOTOS: HousePhoto[] = [
  {
    id: "front",
    viewLabel: "Nhà cổ • Phía trước",
    title: "Mặt tiền & Mái ngói rêu phong trăm năm",
    image: "/images/dana-life/nha_co_dana.png",
    caption:
      "Ngôi nhà cổ kết hợp hài hòa giữa kiến trúc mộc truyền thống Chăm và nét Pháp cổ kính hơn trăm năm tuổi.",
    detail:
      "Mái ngói âm dương rêu phong nhuốm màu thời gian, hiên rộng thoáng đãng đón luồng gió mát lành từ cánh đồng phì nhiêu vùng Gah Praong.",
  },
  {
    id: "left",
    viewLabel: "Nhà cổ • Bên trái",
    title: "Cấu trúc mộc kê đá & hàng hiên làng cổ",
    image: "/images/dana-life/nha_co_dana2.png",
    caption:
      "Hệ thống cột mộc vững chãi kê trên đá tảng tự nhiên, kỹ thuật mộng mộc truyền thống không dùng đinh kim loại.",
    detail:
      "Các vì kèo, đòn tay bằng gỗ quý bản địa thích ứng hoàn hảo với khí hậu nắng gió Ninh Phước, tạo nên một nếp nhà vững chãi qua nhiều thế hệ.",
  },
  {
    id: "inside",
    viewLabel: "Nhà cổ • Bên trong",
    title: "Gian nội thất ấm cúng & nếp sống mẫu hệ",
    image: "/images/dana-life/nha_co_dana3.png",
    caption:
      "Không gian sinh hoạt tôn nghiêm, nơi phụ nữ mẫu hệ giữ ngọn lửa ấm gia đình và lưu giữ các kỷ vật tiền nhân.",
    detail:
      "Cột cái kê đá trang trọng, ánh sáng tự nhiên len lỏi qua từng ô cửa gỗ mộc, mở ra không gian sum vầy bên những câu chuyện sử thi cổ truyền.",
  },
];

const ANCIENT_CITATIONS = [
  {
    source: "Truyền thuyết 'Nai Mah Ghang'",
    chamText: "palei Baoh Dana hu danaok Po Sah",
    translation: "Làng Chất Thường có đền Po Sah",
    meaning:
      "Ghi nhận đền thờ nữ thần Po Sah linh thiêng, khẳng định vị thế tâm linh và sự hình thành từ thuở xa xưa của ngôi làng.",
    badge: "Truyền Thuyết Cổ Bản",
  },
  {
    source: "Thánh ca Po Girai Bhaok (Nghi lễ Kadhar)",
    chamText: "padei tak ni tel Baoh Dana",
    translation: "Dừng chân nơi đây, làng Chất Thường",
    meaning:
      "Lời xướng ca của thầy Kadhar trong nghi lễ tôn giáo thiêng liêng, xem Baoh Dana là điểm dừng chân quan trọng của chư thần tiền hiền.",
    badge: "Thánh Ca Nghi Lễ",
  },
  {
    source: "Tác phẩm Ariya Po Pareng (Cuối TK XIX)",
    chamText: "Ja Theng Ong baoh Dana ruak kaok luic jalan",
    translation: "Ja Theng Ong, làng Chất Thường bệnh đau suốt dọc đường",
    meaning:
      "Étienne Aymonier cùng trí thức Chăm ghi chép chuyến khảo sát đền tháp từ Panduranga ra Hải Phòng, minh chứng sự tham gia của nhân sĩ Palei Dana.",
    badge: "Du Khảo Lịch Sử 1885",
  },
];

const PROMINENT_FIGURES = [
  {
    group: "Thời Triều Nguyễn & Dân Biểu Thời Pháp",
    names: "Ông Trượng Chỉ, ông Huyện Quảng Đại Minh (sinh tại Phước Đồng, lấy vợ palei Dana)",
    desc: "Đại diện cho các dòng tộc lớn, giữ trọng trách quan trường và uy tín xã hội.",
  },
  {
    group: "Trí Thức & Học Giả Kính Mến",
    names:
      "Ông Dương Tấn Thời, Quận trưởng Dương Tấn Sở, Thầy Thành Phú Bá (Hiệu trưởng Po Klong)",
    desc: "Những bậc trí thức tiên phong trong giáo dục và quản trị cộng đồng Chăm.",
  },
  {
    group: "Nghiên Cứu & Bảo Tồn Văn Hóa",
    names: "Ông Quảng Văn Đại (Nhà nghiên cứu văn hóa), PGS. TS Po Dharma (Học giả quốc tế)",
    desc: "Những người con ưu tú cống hiến trọn đời để số hóa, giải mã và đưa di sản Champa ra thế giới.",
  },
];

export default function AboutDanaSection() {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activePhoto = HOUSE_PHOTOS[selectedPhotoIndex];

  return (
    <section id="ve-dana" className="w-full bg-surface py-space-xl scroll-mt-20">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
        {/* ========================================================
            1. TIÊU ĐỀ SECTION & NGUỒN GỐC TÊN GỌI DANA
        ======================================================== */}
        <div className="max-w-4xl mb-space-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold uppercase tracking-wider mb-space-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Về Palei Dana • Trái Tim Di Sản Sống</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl xl:text-5xl text-on-surface font-semibold leading-tight mt-1">
            Dana – Loài cây hóa tên làng, cội nguồn nếp nhà cổ trăm năm
          </h2>

          <p className="font-body-lg text-base sm:text-lg text-on-surface-variant mt-space-sm leading-relaxed">
            <strong className="text-primary font-serif font-bold">Dana</strong> – tên một loài
            cây (cây Cà-na) được người Chăm xưa đặt tên cho ngôi làng mình sinh sống, tiếng Việt
            gọi là <strong className="text-on-surface font-semibold">thôn Chất Thường</strong>,
            hay còn gọi dân dã là <strong className="text-on-surface font-semibold">xóm Cà-na</strong>.
            Cho đến nay, không ai còn nhớ rõ Palei Dana được hình thành chính xác từ khi nào, nhưng
            tên gọi thân thương ấy đã in sâu qua bao thế kỷ dâu bể.
          </p>
        </div>

        {/* ========================================================
            2. CHỨNG TÍCH LỊCH SỬ QUA 3 VĂN BẢN CHĂM CỔ
        ======================================================== */}
        <div className="mb-space-xl">
          <div className="flex items-center gap-2 mb-space-md">
            <Scroll className="w-5 h-5 text-secondary" />
            <h3 className="font-serif text-xl sm:text-2xl text-on-surface font-semibold">
              Baoh Dana trong dòng chảy cổ thư & thi ca Champa
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {ANCIENT_CITATIONS.map((item, idx) => (
              <div
                key={idx}
                className="p-space-lg rounded-2xl bg-surface-container-low border border-outline-variant/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-space-xs">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      {item.badge}
                    </span>
                    <span className="font-serif text-xs text-on-surface-variant font-medium">
                      0{idx + 1}
                    </span>
                  </div>

                  <h4 className="font-serif text-base sm:text-lg font-bold text-on-surface mb-2">
                    {item.source}
                  </h4>

                  {/* Trích dẫn nguyên văn cổ ngữ */}
                  <div className="p-3 rounded-xl bg-surface-container border-l-4 border-primary my-2.5">
                    <p className="font-mono text-xs sm:text-sm text-primary font-bold italic">
                      “{item.chamText}”
                    </p>
                    <p className="font-serif text-xs text-on-surface mt-1 font-semibold">
                      → {item.translation}
                    </p>
                  </div>
                </div>

                <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-2 pt-2 border-t border-outline-variant/30">
                  {item.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            3. ĐẤT LÀNH "GAH PRAONG" & CÁI NÔI TRÍ THỨC CHĂM
        ======================================================== */}
        <div className="p-space-lg sm:p-space-xl rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm mb-space-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
            {/* Cột trái: Đất lành đập Nha Trinh & gah praong (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-space-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
                <Landmark className="w-4 h-4 text-primary" />
                <span>Vùng đất "Gah Praong" & Huyền tích đập cổ Nha Trinh</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold leading-snug">
                Ngôi làng trù phú bên công trình trị thủy thế kỷ XIII – XIV
              </h3>

              <p className="font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Palei Dana là một làng Chăm cổ thuộc khu vực Panduranga xưa, nơi gắn liền mật thiết với
                con <strong className="text-on-surface font-semibold">đập Nha Trinh (Banak Pasa – Bara Caklaing)</strong> huyền
                thoại được xây dựng dưới triều vua Po Klaong Girai.
              </p>

              <p className="font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Người Chăm gọi nơi đây là <strong className="text-primary font-semibold">“gah praong” (vùng lớn)</strong>,
                sở hữu cánh đồng rộng mênh mông với phù sa sông Dinh màu mỡ. Nhờ thiên nhiên ưu đãi,
                Dana từ xưa đã là ngôi làng sung túc, hội tụ những dòng tộc lớn và sản sinh nhiều thế
                hệ con cháu rạng danh non sông.
              </p>

              {/* Box trích dẫn danh nhân */}
              <div className="mt-space-xs space-y-2.5">
                {PROMINENT_FIGURES.map((fig, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs sm:text-sm"
                  >
                    <div className="font-serif font-bold text-primary flex items-center gap-1.5 mb-0.5">
                      <Award className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span>{fig.group}</span>
                    </div>
                    <div className="font-semibold text-on-surface">{fig.names}</div>
                    <p className="text-on-surface-variant text-[11px] sm:text-xs mt-0.5">
                      {fig.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cột phải: Bản đồ vị thế & Điểm nhấn (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-space-md">
              <div className="rounded-2xl overflow-hidden bg-surface-container-high border border-outline-variant/40 shadow-inner p-space-md flex flex-col justify-between min-h-[300px]">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      Tọa Độ Địa Lý
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-surface text-secondary font-medium border border-outline-variant/40">
                      Phước Hậu, Ninh Phước
                    </span>
                  </div>

                  <h4 className="font-serif text-lg font-bold text-on-surface mt-1">
                    Trụ Sở Văn Hóa & Nhà Cổ Baoh Dana
                  </h4>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Cách trung tâm Phan Rang – Tháp Chàm 8 km về phía Tây Nam. Điểm kết nối giao hòa
                    giữa đập Nha Trinh, đền tháp Po Ramê, núi Đá Trắng và hai làng nghề di sản gốm
                    Bàu Trúc & dệt thổ cẩm Mỹ Nghiệp.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/40 mt-3">
                  <div className="text-xs font-serif font-bold text-on-surface flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Quy Tắc Văn Hóa Bản Địa</span>
                  </div>
                  <ul className="text-[11px] text-on-surface-variant space-y-1 list-disc list-inside">
                    <li>Tháo giày dép trước khi bước lên hàng hiên và gian nhà gỗ.</li>
                    <li>Chào hỏi người cao tuổi và tôn trọng không gian gia đình mẫu hệ.</li>
                    <li>Đón tiếp theo đoàn nhỏ (tối đa 8 khách) để giữ gìn sự thanh tịnh.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            4. BỘ SƯU TẬP 3 HÌNH ẢNH THỰC TẾ: NHÀ CỔ BAOH DANA
        ======================================================== */}
        <div className="mb-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-md">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Không Gian Kiến Trúc Độc Bản</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold">
                Kiến trúc Nhà Cổ Chăm – Pháp hơn trăm năm tuổi
              </h3>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
                Chiêm ngưỡng 3 góc nhìn chân thực của ngôi nhà cổ quý giá còn lưu giữ nguyên vẹn tại làng Chất Thường.
              </p>
            </div>

            {/* Bộ chọn góc nhìn nhanh */}
            <div className="flex items-center gap-1.5 bg-surface-container-high p-1 rounded-xl self-start md:self-auto border border-outline-variant/30">
              {HOUSE_PHOTOS.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedPhotoIndex === index
                      ? "bg-primary text-white shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest"
                  }`}
                >
                  {photo.viewLabel.replace("Nhà cổ • ", "")}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Photo Spotlight Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden bg-surface-container-low border border-outline-variant/40 shadow-md">
            {/* Cột trái: Ảnh tiêu điểm lớn (7 cols) */}
            <div className="lg:col-span-7 relative group min-h-[340px] sm:min-h-[440px] overflow-hidden bg-black/10">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Tag góc ảnh */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary text-white shadow-md">
                  {activePhoto.viewLabel}
                </span>
              </div>

              {/* Nút phóng to Lightbox */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-md"
                title="Phóng to ảnh"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Chú thích trên ảnh */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h4 className="font-serif text-lg sm:text-2xl font-bold mb-1">
                  {activePhoto.title}
                </h4>
                <p className="text-xs sm:text-sm text-white/90 line-clamp-2">
                  {activePhoto.caption}
                </p>
              </div>
            </div>

            {/* Cột phải: 3 ảnh thu nhỏ & Chi tiết cấu trúc (5 cols) */}
            <div className="lg:col-span-5 p-space-md sm:p-space-lg flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-secondary block mb-1">
                  Khảo Cứu Kiến Trúc Điền Dã
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-on-surface mb-2">
                  {activePhoto.title}
                </h4>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-space-md">
                  {activePhoto.detail}
                </p>

                <div className="text-xs font-bold text-on-surface mb-2">
                  Chọn góc ảnh để khám phá:
                </div>

                {/* 3 Thumbs Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {HOUSE_PHOTOS.map((photo, idx) => (
                    <button
                      key={photo.id}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all ${
                        selectedPhotoIndex === idx
                          ? "border-primary scale-95 shadow-md"
                          : "border-transparent opacity-70 hover:opacity-100 hover:border-outline-variant"
                      }`}
                    >
                      <img
                        src={photo.image}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/25" />
                      <span className="absolute bottom-1 left-1 right-1 text-[9px] font-bold text-white text-center truncate px-0.5">
                        {photo.viewLabel.replace("Nhà cổ • ", "")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA nhỏ nội bộ */}
              <div className="mt-space-md pt-space-sm border-t border-outline-variant/30 flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-medium">
                  Đón tiếp: 08:00 – 17:30 (Lịch hẹn)
                </span>
                <Link
                  to="/tour"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>Xem tour trải nghiệm</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            5. TẦM NHÌN TƯƠNG LAI & LỜI KÊU GỌI HÀNH ĐỘNG (CTA)
        ======================================================== */}
        <div className="rounded-3xl p-space-lg sm:p-space-xl bg-gradient-to-br from-primary/10 via-surface-container-low to-secondary/10 border border-primary/20 text-center max-w-4xl mx-auto shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">
            Tương Lai Du Lịch Di Sản Bản Địa
          </span>

          <h3 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold mb-space-xs">
            Cánh cửa mở ra để thấu hiểu một nền văn hóa bằng cả trái tim
          </h3>

          <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto mb-space-md leading-relaxed">
            Trong tương lai, Palei Dana mở rộng cánh cửa đón chào lữ khách muôn phương đến tham quan,
            tìm hiểu về lịch sử cũng như văn hoá Chăm chân thực. Chúng tôi mong muốn đưa bạn bước qua
            hàng rào dâm bụt, cởi giày bước lên gian nhà gỗ mộc kê đá, uống ngụm trà thảo mộc ngọt lành
            và lắng nghe các cụ già kể sử thi bên bếp lửa ấm.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/tour"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 transition-all"
            >
              <span>Xem Lịch Đặt Chỗ Tham Quan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="tel:0976029004"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface-container-highest hover:bg-surface-container text-on-surface font-bold text-sm border border-outline-variant/40 transition-all"
            >
              <Compass className="w-4 h-4 text-secondary" />
              <span>Liên Hệ Tư Vấn: 0976 029 004</span>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================
          LIGHTBOX MODAL XEM ẢNH FULL-SCREEN
      ======================================================== */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            title="Đóng"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="max-w-5xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activePhoto.image}
              alt={activePhoto.title}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <div className="mt-4 text-center text-white">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-primary text-white inline-block mb-1">
                {activePhoto.viewLabel}
              </span>
              <h4 className="font-serif text-lg font-bold">{activePhoto.title}</h4>
              <p className="text-xs text-white/80 max-w-xl mx-auto mt-0.5">
                {activePhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
