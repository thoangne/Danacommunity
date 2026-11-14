import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import type { LanguageCommunityBannerProps } from "./types";

export default function LanguageCommunityBanner({
  title = "Lớp Truyền Dạy Chữ Chăm Akhar Thrah Miễn Phí",
  description = "Được tài trợ bởi Quỹ Dana Community Tourism, mở lớp thứ Bảy & Chủ Nhật hàng tuần tại Làng Bàu Trúc và Mỹ Nghiệp cho con em bản địa và du khách yêu mến di sản.",
  ctaText = "Tham gia trải nghiệm",
  ctaLink = "/tour",
  className = "",
}: LanguageCommunityBannerProps) {
  return (
    <section
      className={`w-full bg-primary-container text-on-primary-container py-space-lg ${className}`}
    >
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-md">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-serif text-xl font-bold">{title}</h3>
            <p className="text-xs sm:text-sm text-on-primary-container/80 mt-1 max-w-2xl">
              {description}
            </p>
          </div>
        </div>

        <Link
          to={ctaLink}
          className="px-6 py-3 rounded-xl bg-primary hover:bg-on-primary hover:text-primary text-on-primary font-label-lg text-sm font-semibold shadow-md transition-all whitespace-nowrap shrink-0"
        >
          {ctaText}
        </Link>
      </div>
    </section>
  );
}
