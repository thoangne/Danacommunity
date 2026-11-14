import { Link } from "react-router-dom";
import {
  Quote,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  Check,
  BookOpen,
} from "lucide-react";
import type { Artisan } from "../../types/heritage";
import { CRAFT_PRODUCTS, type CraftProduct } from "../../data/productData";

interface ArtisanCardProps {
  artisan: Artisan;
  index: number;
  products?: CraftProduct[];
  onBook: (artisan: Artisan) => void;
}

export default function ArtisanCard({
  artisan,
  index,
  products,
  onBook,
}: ArtisanCardProps) {
  const isEven = index % 2 === 1;

  // Lấy các sản phẩm gắn liền với nghệ nhân này nếu không truyền vào
  const artisanProducts =
    products || CRAFT_PRODUCTS.filter((p) => p.artisanId === artisan.id);

  return (
    <article
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
              onClick={() => onBook(artisan)}
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
}
