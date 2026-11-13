import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  Star,
  MapPin,
  Sparkles,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import AudioPlayerBar from "../components/AudioPlayerBar";
import { TOURS } from "../data/champaData";
import { BAOH_DANA_TOUR_STATIONS } from "../data/baohDanaTourGuideData";

export default function TourListPage() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const danaTour = TOURS[0];

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <Header
        onToggleAudio={() => setIsAudioPlaying(!isAudioPlaying)}
        isAudioPlaying={isAudioPlaying}
      />

      <main className="w-full pt-16 xl:pt-20 bg-surface flex-1">
        {/* Hero Banner Section */}
        <section className="relative w-full bg-gradient-to-b from-surface-container-low via-surface to-surface py-space-lg sm:py-space-xl overflow-hidden border-b border-surface-container-high/60">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
            {/* Breadcrumb & Archival Tag */}
            <div className="flex items-center justify-between text-on-surface-variant font-label-md text-xs sm:text-sm flex-wrap gap-2 mb-space-sm">
              <nav className="flex items-center gap-space-xs tracking-wider uppercase text-xs">
                <Link className="hover:text-primary transition-colors" to="/">
                  Trang chủ
                </Link>
                <span className="text-outline/60">/</span>
                <span className="text-primary font-bold">Dana Tour</span>
              </nav>
              <div className="hidden sm:flex items-center gap-2 text-secondary font-label-sm text-xs uppercase tracking-widest bg-surface-container px-3 py-1 rounded-full border border-outline-variant/30">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span>Hành Trình Di Sản Độc Bản Duy Nhất • 2025</span>
              </div>
            </div>

            {/* Main Heading Lockup */}
            <div className="flex flex-col gap-space-xs max-w-4xl">
              <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/30 w-fit shadow-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-label-sm text-[11px] uppercase tracking-widest text-primary font-bold">
                  Sản Phẩm Trải Nghiệm Cốt Lõi
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl xl:text-5xl text-on-surface font-semibold leading-tight tracking-tight mt-1">
                Dana Tour: Hành Trình Khám Phá Di Sản Panduranga
              </h1>
              <p className="font-body-md xl:font-body-lg text-sm sm:text-base xl:text-lg text-on-surface-variant max-w-3xl leading-relaxed mt-1">
                Gom trọn vẹn tinh hoa đất thiêng trong 1 ngày duy nhất: Đón bình minh tại Tháp Po Klong Garai,
                tự tay nắn gốm Bàu Trúc cùng Muk Phan, dùng bữa trưa canh Um Bơk và học dệt thổ cẩm Mỹ Nghiệp.
              </p>
            </div>
          </div>
        </section>

        {/* Single Tour Showcase Detail Section */}
        <section className="w-full max-w-7xl mx-auto px-margin-mobile xl:px-margin py-space-xl">
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-lg border border-outline-variant/40">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Cột trái: Ảnh chính & Thông số */}
              <div className="lg:col-span-5 relative min-h-[350px] lg:min-h-full overflow-hidden bg-surface-container">
                <img
                  src={danaTour.image}
                  alt={danaTour.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider shadow-md">
                    {danaTour.badge}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                    Khởi hành mỗi ngày tại Phan Rang
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex items-center gap-3 text-xs mb-2">
                    <span className="flex items-center gap-1 text-amber-300 font-bold">
                      <Star className="h-4 w-4 fill-current" />
                      5.0 (186 đánh giá thực tế)
                    </span>
                    <span className="flex items-center gap-1 text-white/90">
                      <Clock className="h-3.5 w-3.5" />
                      {danaTour.duration}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold leading-snug">
                    Kết nối 3 không gian di sản tiêu biểu nhất của người Chăm
                  </h3>
                </div>
              </div>

              {/* Cột phải: Lịch trình & Giá vé & Đặt tour */}
              <div className="lg:col-span-7 p-space-md sm:p-space-lg xl:p-space-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="flex items-center gap-1 font-semibold text-secondary">
                      <MapPin className="h-4 w-4" />
                      {danaTour.location}
                    </span>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-surface-container font-semibold text-on-surface">
                      Đoàn nhỏ tối đa 12 khách
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
                    {danaTour.title}
                  </h2>

                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-2.5 leading-relaxed">
                    {danaTour.description}
                  </p>

                  {/* Chi tiết lịch trình 1 ngày */}
                  <div className="mt-5 pt-4 border-t border-outline-variant/30">
                    <span className="font-label-md text-xs font-bold text-on-surface uppercase tracking-wider block mb-3">
                      Lịch trình chi tiết trong ngày:
                    </span>
                    <div className="space-y-2.5 text-xs">
                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
                        <span className="px-2 py-1 rounded bg-primary text-white font-mono font-bold text-[11px] shrink-0">
                          07:30
                        </span>
                        <div>
                          <span className="font-bold text-on-surface block">
                            Đón khách tại khách sạn TP. Phan Rang - Tháp Chàm
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            Xe du lịch máy lạnh đưa đón tận nơi, gặp gỡ hướng dẫn viên bản địa Chăm.
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
                        <span className="px-2 py-1 rounded bg-primary text-white font-mono font-bold text-[11px] shrink-0">
                          08:00
                        </span>
                        <div>
                          <span className="font-bold text-on-surface block">
                            Tháp Po Klong Garai - Giải mã Văn bia & Kiến trúc Tháp Cổ
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            Đón ánh bình minh trên Đồi Trầu, giải mã văn bia cổ Sanskrit và nghe hòa tấu kèn Saranai.
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
                        <span className="px-2 py-1 rounded bg-primary text-white font-mono font-bold text-[11px] shrink-0">
                          10:00
                        </span>
                        <div>
                          <span className="font-bold text-on-surface block">
                            Làng Gốm Bàu Trúc - Kỹ nghệ nắn gốm không bàn xoay
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            Trò chuyện cùng Muk Đàng Thị Phan, trải nghiệm đi giật lùi nặn đất sông Quao và nung củi.
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
                        <span className="px-2 py-1 rounded bg-primary text-white font-mono font-bold text-[11px] shrink-0">
                          12:00
                        </span>
                        <div>
                          <span className="font-bold text-on-surface block">
                            Bữa trưa Ẩm thực Chăm Bản Địa
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            Thưởng thức canh bồi Um Bơk, bánh tét Katê và nước thảo mộc truyền thống dưới giàn cây mát rượi.
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
                        <span className="px-2 py-1 rounded bg-primary text-white font-mono font-bold text-[11px] shrink-0">
                          14:00
                        </span>
                        <div>
                          <span className="font-bold text-on-surface block">
                            Làng Dệt Thổ Cẩm Mỹ Nghiệp - Luồn con thoi cổ hoàng cung
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            Ngồi vào khung dệt cổ cùng nghệ nhân Phú Thị Mỡ, học phân biệt hoa văn chim công Katê.
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
                        <span className="px-2 py-1 rounded bg-primary text-white font-mono font-bold text-[11px] shrink-0">
                          16:30
                        </span>
                        <div>
                          <span className="font-bold text-on-surface block">
                            Đồi Cát Nam Cương & Trở về khách sạn
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            Ngắm hoàng hôn trên đồi cát chuyển mình theo gió trước khi xe đưa quý khách về lại điểm hẹn.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Highlights chips */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {danaTour.chips.map((chip) => (
                      <span
                        key={chip.label}
                        className={`px-2.5 py-1 rounded-lg text-xs ${chip.className}`}
                      >
                        ✓ {chip.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price Table & CTA Button */}
                <div className="mt-6 pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-on-surface-variant block">
                      Chi phí trọn gói bảo tồn & trải nghiệm:
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                        Liên hệ báo giá
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/tour/${danaTour.slug}`}
                    className="px-6 py-3 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>Xem chi tiết & liên hệ đặt tour</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8 Heritage Waypoint Commentary Showcase */}
        <section className="w-full bg-surface-container-lowest py-space-xl border-t border-surface-container-high/60">
          <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-md">
              <div>
                <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold block mb-space-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Cẩm Nang Thuyết Minh Điểm Chạm
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
                  8 Điểm Đến Tuyến Du Lịch Cộng Đồng Palei Baoh Dana
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
                  Được cộng đồng Chăm bản địa trực tiếp biên soạn và thuyết minh, giúp du khách cảm nhận trọn vẹn hồn thiêng tháp cổ và nếp sống làng quê.
                </p>
              </div>

              <Link
                to="/bai-viet/thuyet-minh-du-lich-cong-dong-palei-baoh-dana"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold text-xs shrink-0 transition-all cursor-pointer"
              >
                <span>Xem toàn văn 8 bài thuyết minh</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {BAOH_DANA_TOUR_STATIONS.map((st) => (
                <Link
                  key={st.id}
                  to={`/tour/${danaTour.slug}#thuyet-minh-di-san`}
                  className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="relative h-36 rounded-xl overflow-hidden bg-stone-200">
                      <img
                        src={st.image}
                        alt={st.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=400&q=80";
                        }}
                      />
                      <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${st.badgeClass}`}>
                        Trạm 0{st.order}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif text-sm font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                        {st.title}
                      </h4>
                      <p className="text-[11px] text-primary italic font-medium line-clamp-1 mt-0.5">
                        {st.ancientName}
                      </p>
                      <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                        {st.summary}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-surface-container/60 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="truncate max-w-[150px]">{st.district}</span>
                    <span className="text-primary font-bold group-hover:translate-x-0.5 transition-transform">
                      Chi tiết →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Reassurance Banner */}
        <section className="w-full bg-surface-container-low py-space-xl border-t border-surface-container-high/60">
          <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin grid grid-cols-1 md:grid-cols-2 gap-gutter text-center md:text-left">
            <div className="flex items-center gap-space-md p-space-md bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <ShieldCheck className="h-10 w-10 text-primary shrink-0" />
              <div>
                <h4 className="font-serif text-base font-semibold text-on-surface">100% Nghệ Nhân Bản Địa</h4>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">Không thông qua trung gian du lịch thương mại hóa.</p>
              </div>
            </div>

            <div className="flex items-center gap-space-md p-space-md bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <ShieldCheck className="h-10 w-10 text-secondary shrink-0" />
              <div>
                <h4 className="font-serif text-base font-semibold text-on-surface">Bảo Hiểm & Đưa Đón Tận Nơi</h4>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">Xe đưa đón trọn gói từ TP. Phan Rang - Tháp Chàm.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
      <AudioPlayerBar />
    </div>
  );
}
