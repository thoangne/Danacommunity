import { Link } from "react-router-dom";
import { Languages } from "lucide-react";
import type { LanguageHeroSectionProps } from "./types";

export default function LanguageHeroSection({
  breadcrumbCurrent = "Ngôn ngữ Chăm",
  tagline = "Văn Tự Cổ & Cội Nguồn Tri Thức Akhar Thrah",
  title = "Ngôn Ngữ Chăm: Những Ký Tự Khắc Vào Thời Gian",
  description = "Chữ Chăm cổ (Akhar Thrah) bắt nguồn từ hệ chữ Brahmi cổ đại, là một trong những văn tự sớm nhất Đông Nam Á còn được cộng đồng gìn giữ, lưu truyền qua những trang kinh lá buông và văn bia sa thạch.",
  badgeText = "Kho Tàng Văn Tự Bản Địa",
  className = "",
}: LanguageHeroSectionProps) {
  return (
    <section
      className={`w-full bg-surface-container-low/70 pt-space-lg pb-space-xl border-b border-surface-container-high/60 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin flex flex-col gap-space-md">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-space-xs tracking-wider uppercase text-xs text-on-surface-variant font-label-md"
        >
          <Link className="hover:text-primary transition-colors" to="/">
            Trang chủ
          </Link>
          <span className="text-outline/60">/</span>
          <span className="text-primary font-bold">{breadcrumbCurrent}</span>
        </nav>

        {/* Title Lockup */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mt-space-xs">
          <div className="flex flex-col gap-space-xs max-w-3xl">
            <div className="flex items-center gap-2 text-primary font-label-sm text-xs uppercase tracking-widest font-bold">
              <Languages className="h-4 w-4" />
              <span>{tagline}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl xl:text-5xl text-on-surface font-semibold leading-tight">
              {title}
            </h1>
            <p className="font-body-md text-on-surface-variant text-base xl:text-lg leading-relaxed mt-1">
              {description}
            </p>
          </div>

          {badgeText && (
            <div className="hidden lg:flex items-center gap-2 text-secondary font-label-sm text-xs uppercase tracking-widest bg-surface-container px-4 py-2 rounded-full border border-outline-variant/30">
              <Languages className="h-4 w-4 text-primary" />
              <span>{badgeText}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
