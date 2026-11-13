import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  MapPin,
  Clock,
  Compass,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import {
  BAOH_DANA_TOUR_STATIONS,
  type TourGuideStation,
} from "../data/baohDanaTourGuideData";

interface HeritageCommentaryModalProps {
  station: TourGuideStation | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectStation?: (station: TourGuideStation) => void;
}

export default function HeritageCommentaryModal({
  station,
  isOpen,
  onClose,
  onSelectStation,
}: HeritageCommentaryModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    // Prevent background scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!station || !onSelectStation) return;
      if (e.key === "ArrowRight") {
        const nextIdx = (station.order % BAOH_DANA_TOUR_STATIONS.length);
        onSelectStation(BAOH_DANA_TOUR_STATIONS[nextIdx]);
      }
      if (e.key === "ArrowLeft") {
        const prevIdx =
          (station.order - 2 + BAOH_DANA_TOUR_STATIONS.length) %
          BAOH_DANA_TOUR_STATIONS.length;
        onSelectStation(BAOH_DANA_TOUR_STATIONS[prevIdx]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, station, onClose, onSelectStation]);

  if (!isOpen || !station) return null;

  const currentIdx = station.order - 1;
  const prevStation =
    BAOH_DANA_TOUR_STATIONS[
      (currentIdx - 1 + BAOH_DANA_TOUR_STATIONS.length) %
        BAOH_DANA_TOUR_STATIONS.length
    ];
  const nextStation =
    BAOH_DANA_TOUR_STATIONS[(currentIdx + 1) % BAOH_DANA_TOUR_STATIONS.length];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[90vh] my-auto overflow-y-auto bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/40 z-10 flex flex-col">
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 bg-surface-container-lowest/95 backdrop-blur-md border-b border-surface-container-high/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="font-label-sm text-[11px] uppercase tracking-widest text-primary font-bold">
              Thuyết Minh Di Sản • Tuyến Palei Baoh Dana
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onSelectStation && (
              <div className="flex items-center gap-1 mr-2 text-xs text-stone-500">
                <button
                  type="button"
                  onClick={() => onSelectStation(prevStation)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                  title={`Trạm trước: ${prevStation.title}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono font-semibold">
                  {station.order}/8
                </span>
                <button
                  type="button"
                  onClick={() => onSelectStation(nextStation)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                  title={`Trạm tiếp theo: ${nextStation.title}`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 md:p-8 space-y-6">
          {/* Header info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${station.badgeClass}`}
              >
                {station.badge}
              </span>
              <span className="text-xs font-mono font-medium text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                {station.ancientName}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface">
              {station.title}
            </h2>

            <p className="font-body-md text-sm sm:text-base text-primary font-medium italic">
              "{station.tagline}"
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-stone-500 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{station.district}</span>
              </span>
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-stone-400" />
                <span>{station.distance}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{station.openHours}</span>
              </span>
              {station.googleMapsUrl && (
                <a
                  href={station.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-bold bg-primary/10 px-2 py-0.5 rounded-md transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Ghim Google Maps ({station.coords[0].toFixed(4)}, {station.coords[1].toFixed(4)})</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-md bg-stone-100">
            <img
              src={station.image}
              alt={station.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 text-white text-xs">
              <span className="font-semibold block">{station.title}</span>
              <span className="text-white/80 text-[11px]">
                {station.ancientName} • Ninh Thuận (Panduranga)
              </span>
            </div>
          </div>

          {/* Key Highlights */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60">
            <h4 className="text-xs uppercase tracking-wider font-bold text-amber-900 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Điểm nhấn di sản nổi bật</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-amber-950 font-medium">
              {station.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-700 font-bold">•</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full Commentary Text */}
          <div className="space-y-4 pt-2 border-t border-stone-200">
            <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Nội Dung Thuyết Minh Chi Tiết</span>
            </h3>

            <div className="prose prose-stone max-w-none text-sm text-stone-700 leading-relaxed space-y-3.5">
              {station.paragraphs.map((p, idx) => (
                <p key={idx} className="text-justify indent-4">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Cultural Etiquette / Rules */}
          <div className="p-4 rounded-2xl bg-stone-100/90 border border-stone-200 text-xs text-stone-700 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-900 block mb-0.5">
                Quy tắc ứng xử tôn nghiêm của người bản địa:
              </span>
              <span>{station.rules}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer with Station Switcher */}
        {onSelectStation && (
          <div className="sticky bottom-0 z-20 flex items-center justify-between px-5 py-3.5 bg-surface-container-lowest/95 backdrop-blur-md border-t border-surface-container-high/80">
            <button
              type="button"
              onClick={() => onSelectStation(prevStation)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Trạm trước:</span>
              <span className="font-semibold truncate max-w-[140px] sm:max-w-none">
                {prevStation.title}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectStation(nextStation)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <span className="hidden sm:inline">Trạm tiếp theo:</span>
              <span className="truncate max-w-[140px] sm:max-w-none">
                {nextStation.title}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
