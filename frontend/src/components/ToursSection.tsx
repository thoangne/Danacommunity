import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Star,
  MapPin,
  Sparkles,
} from "lucide-react";
import { TOURS } from "../data/champaData";

export default function ToursSection() {
  const danaTour = TOURS[0];

  return (
    <section id="hanh-trinh" className="w-full bg-surface py-space-xl">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-md">
          <div className="max-w-3xl">
            <span className="font-label-md text-xs uppercase tracking-widest text-primary font-bold block mb-space-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Sản Phẩm Trải Nghiệm Cốt Lõi • Dana Community
            </span>
            <h2 className="font-serif text-3xl xl:text-4xl text-on-surface font-semibold">
              Dana Tour: Hành Trình 8 Điểm Chạm Palei Baoh Dana
            </h2>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant mt-space-xs leading-relaxed">
              Mô hình du lịch cộng đồng độc bản: kết nối trọn vẹn 8 điểm di tích đền tháp Po Klaong Garay, Po Ramê,
              kỳ tích đập Nha Trinh, thắng cảnh Núi Đá Trắng, làng gốm Bàu Trúc UNESCO, dệt Mỹ Nghiệp và nếp sống làng Palei Baoh Dana.
            </p>
          </div>

          <Link
            to="/tour"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shrink-0 shadow-xs hover:bg-primary/90 transition-all"
          >
            <span>Chi tiết hành trình Dana Tour</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Grand Single Tour Showcase Card */}
        <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-lg border border-outline-variant/40 transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Cột trái: Ảnh tiêu biểu & Điểm nhấn (5 cols) */}
            <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full overflow-hidden bg-surface-container-high group">
              <img
                src={danaTour.image}
                alt={danaTour.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Badges trên ảnh */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary text-white shadow-md">
                  {danaTour.badge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
                  Khởi hành hàng ngày tại Phan Rang
                </span>
              </div>

              {/* Thông tin nhanh góc dưới ảnh */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-3 text-xs mb-1">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    5.0 (186 đánh giá)
                  </span>
                  <span className="flex items-center gap-1 text-white/80">
                    <Clock className="h-3.5 w-3.5" />
                    {danaTour.duration}
                  </span>
                </div>
                <p className="text-xs text-white/90 line-clamp-2">
                  Đón tiếp riêng tư, hướng dẫn viên bản địa am hiểu sâu sắc văn hóa Panduranga.
                </p>
              </div>
            </div>

            {/* Cột phải: Lịch trình & Giá vé & Đặt tour (7 cols) */}
            <div className="lg:col-span-7 p-space-md sm:p-space-lg xl:p-space-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-xs mb-2">
                  <span className="flex items-center gap-1 font-semibold text-secondary">
                    <MapPin className="h-3.5 w-3.5" />
                    {danaTour.location}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-surface-container font-semibold">
                    Giới hạn tối đa 12 khách/đoàn
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
                  <Link to="/tour" className="hover:text-primary transition-colors">
                    {danaTour.title}
                  </Link>
                </h3>

                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                  {danaTour.description}
                </p>

                {/* 4 Mốc lộ trình chính trong ngày */}
                <div className="mt-4 pt-3 border-t border-outline-variant/30">
                  <span className="font-label-md text-xs font-bold text-on-surface uppercase tracking-wider block mb-2">
                    Lộ trình 1 ngày tinh hoa:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <div>
                        <span className="font-bold text-on-surface block">Tháp Po Klong Garai</span>
                        <span className="text-[11px] text-on-surface-variant">Đón bình minh & giải mã văn bia</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <div>
                        <span className="font-bold text-on-surface block">Làng Gốm Bàu Trúc</span>
                        <span className="text-[11px] text-on-surface-variant">Vuốt gốm không bàn xoay cùng Muk Phan</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <div>
                        <span className="font-bold text-on-surface block">Ẩm Thực Chăm Bản Địa</span>
                        <span className="text-[11px] text-on-surface-variant">Bữa trưa canh Um Bơk truyền thống</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        4
                      </span>
                      <div>
                        <span className="font-bold text-on-surface block">Làng Dệt Mỹ Nghiệp</span>
                        <span className="text-[11px] text-on-surface-variant">Học luồn thoi dệt hoa văn Katê</span>
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

              {/* Price & Action CTA */}
              <div className="mt-6 pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-on-surface-variant block">
                    Chi phí trọn gói bảo tồn & trải nghiệm:
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                      Liên hệ báo giá
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Link
                    to="/tour"
                    className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <span>Liên hệ đặt tour</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
