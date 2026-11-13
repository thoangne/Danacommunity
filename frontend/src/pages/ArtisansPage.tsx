import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Quote,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  Flame,
  Check,
  X,
  BookOpen,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import AudioPlayerBar from "../components/AudioPlayerBar";
import { ARTISANS } from "../data/champaData";
import { CRAFT_PRODUCTS } from "../data/productData";
import { toast } from "../components/ui/sonner";

const VILLAGE_TABS = [
  { id: "all", label: "Tất cả nghệ nhân", count: 4 },
  { id: "Làng gốm Bàu Trúc", label: "Gốm Bàu Trúc", count: 2 },
  { id: "Làng dệt Mỹ Nghiệp", label: "Dệt Mỹ Nghiệp", count: 1 },
  { id: "Làng Chăm Hữu Đức", label: "Âm nhạc Hữu Đức", count: 1 },
];

export default function ArtisansPage() {
  const location = useLocation();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState<string>("all");

  // State Modal đặt hẹn ghé thăm xưởng
  const [bookingArtisan, setBookingArtisan] = useState<(typeof ARTISANS)[0] | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    visitDate: "",
    guestsCount: "2 người",
    experienceType: "Tham quan & Trải nghiệm thực tế",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cuộn tới đúng nghệ nhân khi có hash URL (#artisan-1)
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace("#", "");
      const elem = document.getElementById(elementId);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
      }
    }
  }, [location.hash]);

  const filteredArtisans = useMemo(() => {
    if (selectedVillage === "all") return ARTISANS;
    return ARTISANS.filter((a) => a.village === selectedVillage);
  }, [selectedVillage]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name.trim() || !bookingForm.phone.trim()) {
      toast.error("Vui lòng điền họ tên và số điện thoại liên hệ!");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Đăng ký lịch hẹn thành công!", {
        description: `Đã kết nối lịch hẹn với ${bookingArtisan?.name} tại ${bookingArtisan?.village}. Đại diện văn hóa sẽ xác nhận qua số ${bookingForm.phone}.`,
      });
      setBookingArtisan(null);
      setBookingForm({
        name: "",
        phone: "",
        visitDate: "",
        guestsCount: "2 người",
        experienceType: "Tham quan & Trải nghiệm thực tế",
        notes: "",
      });
    }, 700);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <Header
        onToggleAudio={() => setIsAudioPlaying(!isAudioPlaying)}
        isAudioPlaying={isAudioPlaying}
      />

      <main className="w-full pt-16 xl:pt-20 bg-surface flex-1">
        {/* ========================================================
            1. Hero: Ký ức trong đôi bàn tay - Tôn vinh Người Giữ Lửa
        ======================================================== */}
        <section className="relative w-full bg-gradient-to-b from-surface-container-low via-surface to-surface py-space-xl overflow-hidden border-b border-surface-container-high/60">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center text-on-surface-variant font-label-md text-xs sm:text-sm gap-space-xs tracking-wider uppercase mb-space-sm">
              <Link className="hover:text-primary transition-colors" to="/">
                Trang chủ
              </Link>
              <span className="text-outline/60">/</span>
              <span className="text-primary font-bold">Chân dung Nghệ nhân</span>
            </div>

            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-label-sm text-xs font-bold uppercase tracking-widest mb-space-xs border border-secondary/20">
                <Flame className="w-3.5 h-3.5 text-secondary" />
                Báu Vật Nhân Văn Sống Panduranga
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl xl:text-5xl text-on-surface font-bold leading-tight mt-space-xs">
                Ký Ức Sống Trong Đôi Bàn Tay
              </h1>
              <p className="font-body-md text-sm sm:text-base text-on-surface-variant mt-space-sm leading-relaxed">
                Họ không chỉ làm nghề để mưu sinh. Từng đường vuốt đất, từng lượt thoi dệt,
                từng nhịp gõ paranưng là hành trình gìn giữ danh dự và linh hồn của cả một dân tộc.
                Gặp gỡ những nghệ nhân ưu tú đã dành nửa thế kỷ giữ lửa cho văn hóa Champa.
              </p>

              {/* Heritage Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-space-lg">
                <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30">
                  <span className="font-serif text-2xl font-bold text-primary block">
                    4+ Thế hệ
                  </span>
                  <span className="text-[11px] text-on-surface-variant block mt-0.5 font-medium">
                    Truyền dạy gia tộc liên tục
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30">
                  <span className="font-serif text-2xl font-bold text-secondary block">
                    58 Năm
                  </span>
                  <span className="text-[11px] text-on-surface-variant block mt-0.5 font-medium">
                    Giữ lửa gốm của Muk Phan
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30">
                  <span className="font-serif text-2xl font-bold text-amber-700 block">
                    UNESCO
                  </span>
                  <span className="text-[11px] text-on-surface-variant block mt-0.5 font-medium">
                    Di sản ghi danh nhân loại
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30">
                  <span className="font-serif text-2xl font-bold text-tertiary block">
                    100%
                  </span>
                  <span className="text-[11px] text-on-surface-variant block mt-0.5 font-medium">
                    Kỹ nghệ cổ không bàn xoay
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. Bộ lọc theo Làng nghề & Vùng di sản
        ======================================================== */}
        <section className="sticky top-16 xl:top-20 z-30 bg-surface/95 backdrop-blur-md border-b border-surface-container-high py-3 shadow-xs">
          <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {VILLAGE_TABS.map((tab) => {
                const isActive = selectedVillage === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedVillage(tab.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 flex items-center gap-2 ${
                      isActive
                        ? "bg-secondary text-white border-secondary shadow-xs"
                        : "bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:bg-surface-container hover:text-on-surface"
                    }`}
                    type="button"
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            3. Danh sách Chân dung Nghệ nhân (Editorial Asymmetric Layout)
        ======================================================== */}
        <section className="py-space-xl">
          <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin space-y-space-xl">
            {filteredArtisans.map((artisan, index) => {
              const isEven = index % 2 === 1;
              // Lấy các sản phẩm gắn liền với nghệ nhân này
              const artisanProducts = CRAFT_PRODUCTS.filter(
                (p) => p.artisanId === artisan.id
              );

              return (
                <article
                  key={artisan.id}
                  id={`artisan-${artisan.id}`}
                  className="rounded-2xl sm:rounded-3xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 shadow-xs sm:shadow-sm hover:shadow-lg transition-all duration-300 p-3.5 sm:p-space-lg xl:p-space-xl scroll-mt-28"
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-gutter items-center ${
                      isEven ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Cột 1: Cụm hình ảnh chân dung & Thao tác đôi tay (5 cols) */}
                    <div
                      className={`lg:col-span-5 relative ${
                        isEven ? "lg:order-2" : "lg:order-1"
                      }`}
                    >
                      {/* Ảnh chân dung lớn */}
                      <div className="relative aspect-[16/10] sm:aspect-[4/5] max-h-56 sm:max-h-none rounded-2xl sm:rounded-3xl overflow-hidden bg-surface-container-high shadow-md">
                        <img
                          src={artisan.image}
                          alt={artisan.name}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Huy hiệu trên ảnh */}
                        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
                          <span
                            className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-xs ${artisan.badgeClass}`}
                          >
                            {artisan.title}
                          </span>
                        </div>

                        {/* Chú thích làng nghề góc dưới */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 text-white">
                          <span className="text-[10px] sm:text-[11px] font-semibold text-primary-fixed uppercase tracking-wider block">
                            {artisan.village}
                          </span>
                          <span className="font-serif text-base sm:text-lg font-bold">
                            {artisan.experience}
                          </span>
                        </div>
                      </div>

                      {/* Ảnh nhỏ lồng ghép: Đôi bàn tay làm nghề */}
                      {artisan.handsImage && (
                        <div className="hidden sm:block absolute -bottom-4 -right-4 w-28 h-28 xl:w-36 xl:h-36 rounded-2xl overflow-hidden border-4 border-surface shadow-xl bg-surface-container-high">
                          <img
                            src={artisan.handsImage}
                            alt={`Bàn tay tạo tác của ${artisan.name}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                          <span className="absolute bottom-1 left-1 right-1 text-[9px] text-center font-bold text-white bg-black/60 backdrop-blur-xs py-0.5 rounded">
                            Bàn tay tạo tác
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Cột 2: Thông tin, Triết lý sống & Tác phẩm tiêu biểu (7 cols) */}
                    <div
                      className={`lg:col-span-7 flex flex-col justify-between ${
                        isEven ? "lg:order-1" : "lg:order-2"
                      }`}
                    >
                      <div>
                        {/* Specialty pill */}
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <span className="text-[11px] sm:text-xs font-bold text-secondary flex items-center gap-1 uppercase tracking-wider">
                            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            {artisan.specialty || "Nghệ nhân truyền thống Champa"}
                          </span>
                        </div>

                        {/* Tên nghệ nhân */}
                        <h2 className="font-serif text-xl sm:text-3xl xl:text-4xl font-bold text-on-surface">
                          {artisan.name}
                        </h2>
                        <p className="text-[11px] sm:text-sm text-secondary font-semibold mt-0.5 sm:mt-1">
                          {artisan.title} • {artisan.village}
                        </p>

                        {/* Khối Trích dẫn Thiền định (Quote Box) */}
                        <div className="my-2 sm:my-space-md p-2.5 sm:p-space-md rounded-xl sm:rounded-2xl bg-surface-container-low border border-outline-variant/30 relative">
                          <Quote className="absolute right-2.5 top-2.5 h-5 w-5 sm:h-8 sm:w-8 text-primary/15" />
                          <p className="font-serif text-xs sm:text-base text-on-surface italic leading-relaxed pr-5 sm:pr-6 line-clamp-2 sm:line-clamp-none">
                            {artisan.quote}
                          </p>
                        </div>

                        {/* Tiểu sử chi tiết */}
                        <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-2 sm:mb-space-sm line-clamp-3 sm:line-clamp-none">
                          {artisan.bio}
                        </p>

                        {/* Thành tựu tiêu biểu */}
                        {artisan.achievements && artisan.achievements.length > 0 && (
                          <div className="mb-space-md">
                            <span className="font-label-md text-xs font-bold text-on-surface uppercase tracking-wider block mb-1.5">
                              Dấu ấn cống hiến:
                            </span>
                            <ul className="space-y-1">
                              {artisan.achievements.map((ach, i) => (
                                <li
                                  key={i}
                                  className="text-xs text-on-surface-variant flex items-center gap-2"
                                >
                                  <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                                  <span>{ach}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Thông tin lịch đón khách & Workshop */}
                        <div className="p-3 rounded-2xl bg-surface-container text-xs text-on-surface space-y-1 mb-space-md">
                          <div className="flex items-center gap-2 font-medium">
                            <Calendar className="w-4 h-4 text-primary shrink-0" />
                            <span>{artisan.schedule}</span>
                          </div>
                          {artisan.workshopLocation && (
                            <div className="flex items-center gap-2 text-on-surface-variant">
                              <MapPin className="w-4 h-4 text-secondary shrink-0" />
                              <span>{artisan.workshopLocation}</span>
                            </div>
                          )}
                        </div>

                        {/* Mini Portfolio: Tác phẩm do nghệ nhân tạo tác */}
                        {artisanProducts.length > 0 && (
                          <div className="mt-space-md pt-space-sm border-t border-outline-variant/30">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-label-md text-xs font-bold text-on-surface uppercase tracking-wider">
                                Tác phẩm tiêu biểu:
                              </span>
                              <Link
                                to={`/san-pham?artisan=${artisan.id}`}
                                className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                              >
                                <span>Xem tất cả tác phẩm ({artisanProducts.length})</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {artisanProducts.slice(0, 2).map((prod) => (
                                <Link
                                  key={prod.id}
                                  to={`/san-pham?category=${prod.category}`}
                                  className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 flex items-center gap-2.5 transition-all group/prod"
                                >
                                  <img
                                    src={prod.images[0]}
                                    alt={prod.name}
                                    className="w-12 h-12 rounded-lg object-cover border border-outline-variant/40 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-on-surface group-hover/prod:text-primary transition-colors truncate">
                                      {prod.name}
                                    </h4>
                                    <span className="text-[11px] font-semibold text-primary block">
                                      {prod.priceEstimate}
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Các nút hành động */}
                      <div className="mt-space-lg pt-space-sm flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => setBookingArtisan(artisan)}
                          className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-xs"
                          type="button"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Đặt hẹn ghé thăm xưởng</span>
                        </button>

                        <Link
                          to={`/san-pham?artisan=${artisan.id}`}
                          className="px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition-all flex items-center gap-1.5"
                        >
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span>Bộ sưu tập tác phẩm</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            4. Phân đoạn: Lớp học nghề & Trải nghiệm thực địa (Workshops)
        ======================================================== */}
        <section className="py-space-xl bg-surface-container-low border-t border-b border-surface-container-high/60">
          <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
            <div className="text-center max-w-2xl mx-auto mb-space-lg">
              <span className="font-label-md text-xs font-bold text-secondary uppercase tracking-widest block mb-1">
                Tiếp Nối Hồn Xưa
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
                Lớp Học Nghề & Trải Nghiệm Thực Tế Tại Làng
              </h2>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                Đăng ký một buổi sáng ngồi bệt cùng các Muk, tự tay nắn chiếc bình đất sông Quao
                hay luồn sợi con thoi để cảm nhận nhịp đập sống động của văn hóa bản địa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary inline-block mb-2">
                    Làng Bàu Trúc
                  </span>
                  <h3 className="font-serif text-base font-bold text-on-surface mb-1">
                    Trải nghiệm Vuốt Gốm Không Bàn Xoay
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Học kỹ thuật đi giật lùi, tự tay nhào nặn khối đất sông Quao và
                    được nghệ nhân Bàu Trúc nung củi tặng lại tác phẩm mang về.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-medium">Thời lượng: 2.5 giờ</span>
                  <button
                    onClick={() => {
                      setBookingArtisan(ARTISANS[0]);
                      setBookingForm((prev) => ({
                        ...prev,
                        experienceType: "Lớp học vuốt gốm không bàn xoay Bàu Trúc",
                      }));
                    }}
                    className="text-primary font-bold hover:underline"
                    type="button"
                  >
                    Đăng ký →
                  </button>
                </div>
              </div>

              <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-secondary/10 text-secondary inline-block mb-2">
                    Làng Mỹ Nghiệp
                  </span>
                  <h3 className="font-serif text-base font-bold text-on-surface mb-1">
                    Thử Tài Luồn Con Thoi Khung Dệt Cổ
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Tìm hiểu bí quyết nhuộm màu thảo mộc tự nhiên từ củ nâu,
                    ngồi vào khung dệt học cách dệt những đường hoa văn Katê đầu tiên.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-medium">Thời lượng: 2 giờ</span>
                  <button
                    onClick={() => {
                      setBookingArtisan(ARTISANS[1]);
                      setBookingForm((prev) => ({
                        ...prev,
                        experienceType: "Lớp học luồn thoi dệt thổ cẩm Mỹ Nghiệp",
                      }));
                    }}
                    className="text-secondary font-bold hover:underline"
                    type="button"
                  >
                    Đăng ký →
                  </button>
                </div>
              </div>

              <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 inline-block mb-2">
                    Làng Hữu Đức
                  </span>
                  <h3 className="font-serif text-base font-bold text-on-surface mb-1">
                    Thanh Âm Thiêng: Kèn Saranai & Trống Chăm
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Lắng nghe giai điệu ngũ cung huyền bí, khám phá cấu tạo dăm lá buông
                    và học nhịp vỗ lòng bàn tay trên mặt trống Paranưng bịt da dê.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-medium">Thời lượng: 2 giờ</span>
                  <button
                    onClick={() => {
                      setBookingArtisan(ARTISANS[2]);
                      setBookingForm((prev) => ({
                        ...prev,
                        experienceType: "Trải nghiệm thanh âm nhạc cụ cổ truyền Hữu Đức",
                      }));
                    }}
                    className="text-amber-800 font-bold hover:underline"
                    type="button"
                  >
                    Đăng ký →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            5. CTA: Khám phá Tour Làng Nghề Trọn Gói
        ======================================================== */}
        <section className="py-space-xl">
          <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
            <div className="rounded-3xl bg-surface-container-low border border-outline-variant/40 p-space-lg sm:p-space-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl">
                <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                  Đồng Hành Cùng Dana Tour
                </span>
                <h3 className="font-serif text-2xl font-bold text-on-surface">
                  Hành Trình Gặp Gỡ & Ăn Trưa Cùng Nghệ Nhân
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                  Chúng tôi tổ chức các tour trải nghiệm chuyên sâu có hướng dẫn viên người bản địa,
                  đưa đón tận nơi và thưởng thức bữa cơm truyền thống Chăm bên hiên nhà nghệ nhân.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to="/tour"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-xs"
                >
                  Xem Tour Làng Nghề
                </Link>
                <Link
                  to="/san-pham"
                  className="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface text-xs font-semibold hover:bg-surface-container-highest transition-all"
                >
                  Xem Sản Phẩm Di Sản
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================
          MODAL: Đặt lịch hẹn ghé thăm xưởng / Trải nghiệm
      ======================================================== */}
      {bookingArtisan && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="bg-surface rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/40 relative">
            <button
              onClick={() => setBookingArtisan(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container-highest text-on-surface hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-xs"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-secondary block mb-1">
              Gặp Gỡ Nghệ Nhân Bản Địa
            </span>
            <h3 className="font-serif text-xl font-bold text-on-surface">
              Đặt Hẹn Ghé Thăm Xưởng
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Bạn đang lên lịch gặp gỡ{" "}
              <span className="font-bold text-on-surface">
                {bookingArtisan.name}
              </span>{" "}
              tại {bookingArtisan.village}.
            </p>

            <form onSubmit={handleBookingSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">
                  Họ và tên của bạn <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={bookingForm.name}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, name: e.target.value })
                  }
                  placeholder="Ví dụ: Trần Thị Mai"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Số điện thoại liên hệ <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.phone}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, phone: e.target.value })
                    }
                    placeholder="09xx xxx xxx"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Ngày dự kiến ghé thăm
                  </label>
                  <input
                    type="date"
                    value={bookingForm.visitDate}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, visitDate: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Số lượng khách
                  </label>
                  <select
                    value={bookingForm.guestsCount}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, guestsCount: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface"
                  >
                    <option value="1 người">1 người (Cá nhân)</option>
                    <option value="2 người">2 người (Cặp đôi/Bạn bè)</option>
                    <option value="3 - 5 người">3 - 5 người (Gia đình)</option>
                    <option value="Đoàn trên 6 người">Đoàn trên 6 người</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Loại hình trải nghiệm
                  </label>
                  <select
                    value={bookingForm.experienceType}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, experienceType: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface"
                  >
                    <option value="Tham quan & Trải nghiệm thực tế">
                      Tham quan & Trải nghiệm
                    </option>
                    <option value="Học nghề chuyên sâu">
                      Học nghề cùng nghệ nhân
                    </option>
                    <option value="Đặt chế tác tác phẩm riêng">
                      Trao đổi đặt chế tác riêng
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">
                  Yêu cầu đặc biệt
                </label>
                <textarea
                  rows={2}
                  value={bookingForm.notes}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, notes: e.target.value })
                  }
                  placeholder="Ví dụ: Cần người phiên dịch, kết hợp ăn trưa canh Um Bơk..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Đang xác nhận...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Xác nhận đặt lịch hẹn</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setBookingArtisan(null)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-all"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <BottomNav />
      <AudioPlayerBar />
    </div>
  );
}
