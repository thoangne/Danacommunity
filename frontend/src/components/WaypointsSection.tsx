import { useState } from "react";
import {
  Shirt,
  Sun,
  ShoppingBag,
  BookOpen,
  Waves,
  Mountain,
  Landmark,
  Sparkles,
  Home,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { WAYPOINTS } from "../data/champaData";
import {
  BAOH_DANA_TOUR_STATIONS,
  type TourGuideStation,
} from "../data/baohDanaTourGuideData";
import HeritageMap from "./HeritageMap";
import HeritageCommentaryModal from "./HeritageCommentaryModal";

interface WaypointsSectionProps {
  activeStation: number;
  onSelectStation: (id: number) => void;
}

export default function WaypointsSection({
  activeStation,
  onSelectStation,
}: WaypointsSectionProps) {
  const [selectedStationForModal, setSelectedStationForModal] =
    useState<TourGuideStation | null>(null);
  const [isCommentaryModalOpen, setIsCommentaryModalOpen] = useState(false);

  const handleOpenCommentary = (stationId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const found =
      BAOH_DANA_TOUR_STATIONS.find((s) => s.order === stationId) ||
      BAOH_DANA_TOUR_STATIONS[0];
    setSelectedStationForModal(found);
    setIsCommentaryModalOpen(true);
  };

  return (
    <section id="ban-do" className="w-full bg-surface-container-low py-space-xl border-y border-surface-container-high/60">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
        {/* Section Header */}
        <div className="max-w-3xl mb-space-xl">
          <span className="font-label-md text-label-md uppercase tracking-widest text-primary font-bold block mb-space-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Bản đồ Điểm chạm Di sản • Tuyến Khảo cứu Panduranga</span>
          </span>
          <h2 className="font-serif text-3xl xl:text-4xl text-on-surface font-semibold">
            Khảo cứu Tuyến đường Di sản Panduranga
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs leading-relaxed">
            Hệ thống 8 điểm mốc thiêng liêng kết nối đền tháp Kalan cổ kính, đập thủy lợi ngàn năm,
            thắng cảnh núi đá, làng nghề cổ truyền và nếp nhà cổ mẫu hệ Chăm Palei Baoh Dana. Chọn điểm dừng để tra cứu cự ly, xem tọa độ đã ghim hoặc bấm "Thuyết minh" để lắng nghe câu chuyện văn hóa bản địa.
          </p>
        </div>

        {/* 2-Column Desktop Grid for Map & Stops */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Left Column: Interactive Station List (8 stations) */}
          <div className="lg:col-span-5 flex flex-col gap-space-sm max-h-[720px] overflow-y-auto pr-1" id="stations-list">
            {WAYPOINTS.map((w) => {
              const isActive = w.id === activeStation;

              return (
                <div
                  key={w.id}
                  onClick={() => onSelectStation(w.id)}
                  className={`p-space-md rounded-2xl shadow-sm cursor-pointer transition-all duration-300 hover:translate-x-1 border ${isActive
                    ? "border-l-4 border-l-primary border-primary/20 bg-surface-container-lowest shadow-md ring-1 ring-primary/10"
                    : "border-outline-variant/30 bg-white/80 hover:bg-white"
                    }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-space-xs py-0.5 rounded font-label-sm text-[11px] font-bold uppercase tracking-wider ${w.badgeClass ?? "bg-surface-container text-on-surface"
                        }`}
                    >
                      {w.badge ?? `Trạm 0${w.id}`}
                    </span>
                    <span className="font-body-sm text-xs text-on-surface-variant font-medium">
                      {w.distance}
                    </span>
                  </div>

                  <h4 className="font-title-lg text-base sm:text-lg text-on-surface mt-space-xs font-semibold">
                    {w.title}
                  </h4>

                  <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed line-clamp-2">
                    {w.rules}
                  </p>

                  <div className="mt-space-sm flex flex-wrap items-center justify-between gap-2 text-[12px] font-label-sm text-secondary pt-2 border-t border-surface-container/60">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1">
                        {w.id === 1 && <Landmark className="h-3.5 w-3.5 text-primary" />}
                        {w.id === 2 && <Waves className="h-3.5 w-3.5 text-sky-600" />}
                        {w.id === 3 && <Mountain className="h-3.5 w-3.5 text-emerald-600" />}
                        {w.id === 4 && <Landmark className="h-3.5 w-3.5 text-amber-600" />}
                        {w.id === 5 && <Shirt className="h-3.5 w-3.5 text-purple-600" />}
                        {w.id === 6 && <ShoppingBag className="h-3.5 w-3.5 text-primary" />}
                        {w.id === 7 && <Sparkles className="h-3.5 w-3.5 text-rose-600" />}
                        {w.id === 8 && <Home className="h-3.5 w-3.5 text-emerald-700" />}
                        <span>{w.district}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Sun className="h-3.5 w-3.5" />
                        <span>{w.openHours}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {w.googleMapsUrl && (
                        <a
                          href={w.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition-all cursor-pointer border border-emerald-200/60"
                          title="Mở tọa độ vị trí thực địa trên Google Maps"
                        >
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>Ghim Maps</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleOpenCommentary(w.id, e)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary text-[11px] font-bold transition-all cursor-pointer"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Thuyết minh</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Styled Archaeological Map Canvas */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 mt-space-md lg:mt-0 flex flex-col gap-3">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-surface-container-high border border-outline-variant/40">
              <HeritageMap
                activeStation={activeStation}
                onSelectStation={onSelectStation}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Heritage Commentary Modal */}
      <HeritageCommentaryModal
        isOpen={isCommentaryModalOpen}
        station={selectedStationForModal}
        onClose={() => setIsCommentaryModalOpen(false)}
        onSelectStation={(st) => {
          setSelectedStationForModal(st);
          onSelectStation(st.order);
        }}
      />
    </section>
  );
}
