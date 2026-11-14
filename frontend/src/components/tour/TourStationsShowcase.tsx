import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import type { TourGuideStation } from "../../data/baohDanaTourGuideData";

interface TourStationsShowcaseProps {
  stations: TourGuideStation[];
  tourSlug: string;
}

export default function TourStationsShowcase({
  stations,
  tourSlug,
}: TourStationsShowcaseProps) {
  return (
    <section className="w-full bg-surface-container-lowest py-space-xl border-t border-surface-container-high/60">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-md">
          <div>
            <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold mb-space-xs flex items-center gap-1.5">
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
          {stations.map((st) => (
            <Link
              key={st.id}
              to={`/tour/${tourSlug}#thuyet-minh-di-san`}
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
  );
}
