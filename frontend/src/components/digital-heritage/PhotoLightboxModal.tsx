import { useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import type { PhotoLightboxModalProps } from "./types";

export default function PhotoLightboxModal({
  photo,
  currentIndex,
  totalCount,
  onClose,
  onPrev,
  onNext,
}: PhotoLightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        onPrev();
      } else if (e.key === "ArrowRight") {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-200"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50 cursor-pointer"
        aria-label="Đóng ảnh"
        type="button"
      >
        <X className="h-6 w-6" />
      </button>

      <button
        onClick={onPrev}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white items-center justify-center transition-all cursor-pointer z-50"
        aria-label="Ảnh trước"
        type="button"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={onNext}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white items-center justify-center transition-all cursor-pointer z-50"
        aria-label="Ảnh kế tiếp"
        type="button"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="relative max-w-5xl w-full max-h-[90vh] bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10">
        <div className="md:w-3/5 bg-black flex items-center justify-center overflow-hidden max-h-[50vh] md:max-h-full">
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="w-full h-full object-contain max-h-[80vh]"
          />
        </div>

        <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-surface-container-low max-h-[40vh] md:max-h-full">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-label-sm uppercase tracking-wider text-secondary">
              <span>Panduranga Visual Archive</span>
              <span className="font-mono font-bold">{photo.year}</span>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold text-on-surface leading-snug">
                {photo.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-primary font-semibold mt-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>{photo.location}</span>
              </div>
            </div>

            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              {photo.description}
            </p>

            {photo.curatorNote && (
              <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col gap-1">
                <span className="font-label-sm text-xs font-bold uppercase tracking-wider text-primary">
                  Ghi chú giám tuyển di sản:
                </span>
                <p className="font-body-sm text-xs text-on-surface-variant italic leading-relaxed">
                  "{photo.curatorNote}"
                </p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-surface-container-high flex items-center justify-between text-xs text-on-surface-variant">
            <span>
              Tác giả: <strong className="text-on-surface">{photo.author}</strong>
            </span>
            <span className="font-mono">
              {currentIndex + 1} / {totalCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
