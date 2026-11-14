import { Link } from "react-router-dom";
import { ArrowRight, Clock, Star, MapPin } from "lucide-react";
import type { Tour } from "../../types/heritage";
import TourItineraryTimeline from "./TourItineraryTimeline";

interface TourShowcaseCardProps {
  tour: Tour;
}

export default function TourShowcaseCard({ tour }: TourShowcaseCardProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-margin-mobile xl:px-margin py-space-xl">
      <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-lg border border-outline-variant/40">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Cột trái: Ảnh chính & Thông số */}
          <div className="lg:col-span-5 relative min-h-[350px] lg:min-h-full overflow-hidden bg-surface-container">
            <img
              src={tour.image}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3.5 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider shadow-md">
                {tour.badge}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                Khởi hành mỗi ngày tại Phan Rang
              </span>
            </div>

            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="flex items-center gap-3 text-xs mb-2">
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <Star className="h-4 w-4 fill-current" />
                  {tour.rating || "5.0"} ({tour.reviewsCount || "186"} đánh giá thực tế)
                </span>
                <span className="flex items-center gap-1 text-white/90">
                  <Clock className="h-3.5 w-3.5" />
                  {tour.duration}
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
                  {tour.location}
                </span>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-surface-container font-semibold text-on-surface">
                  Đoàn nhỏ tối đa 12 khách
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
                {tour.title}
              </h2>

              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-2.5 leading-relaxed">
                {tour.description}
              </p>

              {/* Chi tiết lịch trình 1 ngày */}
              <div className="mt-5 pt-4 border-t border-outline-variant/30">
                <span className="font-label-md text-xs font-bold text-on-surface uppercase tracking-wider block mb-3">
                  Lịch trình chi tiết trong ngày:
                </span>
                <TourItineraryTimeline />
              </div>

              {/* Highlights chips */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {tour.chips.map((chip) => (
                  <span
                    key={chip.label}
                    className={`px-2.5 py-1 rounded-lg text-xs ${chip.className || ""}`}
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
                    {tour.price || "Liên hệ báo giá"}
                  </span>
                </div>
              </div>

              <Link
                to={`/tour/${tour.slug}`}
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
  );
}
