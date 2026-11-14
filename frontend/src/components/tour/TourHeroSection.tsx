import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function TourHeroSection() {
  return (
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
  );
}
