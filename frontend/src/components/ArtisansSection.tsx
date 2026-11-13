import { ArrowRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { ARTISANS } from "../data/champaData";

export default function ArtisansSection() {
  return (
    <section id="nghe-nhan" className="w-full bg-surface py-space-xl">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-space-xl">
          <div className="max-w-3xl">
            <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold block mb-space-xs">
              Người Giữ Lửa Ngàn Năm
            </span>
            <h2 className="font-serif text-3xl xl:text-4xl text-on-surface font-semibold">
              Góc Nghệ Nhân: Ký ức trong đôi bàn tay
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
              Họ không chỉ làm nghề để mưu sinh. Từng đường vuốt đất, từng lượt
              thoi dệt là hành trình gìn giữ danh dự và linh hồn của cả một dân tộc.
            </p>
          </div>
          <Link
            to="/nghe-nhan"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold text-xs shrink-0 transition-colors shadow-xs"
          >
            <span>Tất cả nghệ nhân</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Feature Split Section: Spotlight Master Artisans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-gutter">
          {ARTISANS.map((artisan) => (
            <div
              key={artisan.name}
              className="p-3.5 sm:p-space-lg rounded-2xl bg-surface-container-low shadow-sm sm:shadow-md flex flex-col justify-between border border-outline-variant/30 hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex flex-row sm:grid sm:grid-cols-12 gap-3 sm:gap-space-md mb-2.5 sm:mb-space-md items-start sm:items-center">
                  <div className="w-24 h-28 sm:w-auto sm:h-56 sm:col-span-5 rounded-xl overflow-hidden bg-surface-container-high shadow-inner shrink-0">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      alt={artisan.name}
                      src={artisan.image}
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 sm:col-span-7 min-w-0">
                    <span
                      className={`px-1.5 sm:px-space-xs py-0.5 rounded font-label-sm text-[10px] sm:text-[11px] uppercase font-bold tracking-wider inline-block ${artisan.badgeClass}`}
                    >
                      {artisan.title}
                    </span>
                    <h3 className="font-serif text-base sm:text-2xl text-on-surface mt-0.5 sm:mt-space-xs font-semibold leading-snug truncate sm:whitespace-normal">
                      {artisan.name}
                    </h3>
                    <p className="font-label-md text-[11px] sm:text-xs text-secondary mt-0.5 font-semibold line-clamp-1">
                      {artisan.experience}
                    </p>

                    <div className="mt-1.5 sm:mt-space-sm p-1.5 sm:p-space-sm rounded-lg sm:rounded-xl bg-surface-container-lowest shadow-xs sm:shadow-sm border border-outline-variant/20 relative">
                      <Quote className="absolute right-1.5 top-1.5 h-3.5 w-3.5 sm:h-5 sm:w-5 text-primary/15" />
                      <p className="font-body-sm text-[11px] sm:text-xs xl:text-sm text-on-surface-variant italic leading-relaxed pr-2 sm:pr-3 line-clamp-2 sm:line-clamp-none">
                        {artisan.quote}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="font-body-md text-xs sm:text-sm xl:text-base text-on-surface-variant leading-relaxed line-clamp-2 sm:line-clamp-none mt-2 sm:mt-0">
                  {artisan.bio}
                </p>
              </div>

              <div className="pt-2 sm:pt-space-md mt-2 sm:mt-space-md flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 border-t border-surface-container/60 text-[11px] sm:text-xs">
                <span className="font-body-sm text-[11px] sm:text-xs text-on-surface-variant font-medium line-clamp-1">
                  {artisan.schedule}
                </span>
                <Link
                  to={`/nghe-nhan#artisan-${artisan.id}`}
                  className="font-label-md text-[11px] sm:text-xs text-primary font-bold hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Xem chi tiết</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
