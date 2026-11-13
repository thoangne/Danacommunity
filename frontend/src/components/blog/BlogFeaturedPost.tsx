import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Feather, Play, Pause, Volume2 } from "lucide-react";
import { FEATURED_POST } from "../../data/blogData";
import { toast } from "../ui/sonner";

interface BlogFeaturedPostProps {
  onToggleAudioPlayer?: () => void;
}

export default function BlogFeaturedPost({
  onToggleAudioPlayer,
}: BlogFeaturedPostProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
    if (!isPlaying) {
      toast.success("Đang phát thuyết minh âm thanh bản địa", {
        description: FEATURED_POST.audioTitle,
      });
      onToggleAudioPlayer?.();
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-margin-mobile xl:px-margin py-space-xl">
      <div className="bg-surface-container-lowest rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 border border-outline-variant/30">
        {/* Visual Column (60%) */}
        <div className="lg:col-span-7 relative min-h-[220px] sm:min-h-[400px] lg:min-h-[580px] bg-inverse-surface overflow-hidden group">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
            alt={FEATURED_POST.title}
            src={FEATURED_POST.image}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-background/95 via-on-background/35 to-transparent"></div>

          {/* Overlay Badges */}
          <div className="absolute top-2.5 left-2.5 sm:top-space-md sm:left-space-md flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-[10px] sm:text-xs tracking-widest uppercase font-bold shadow-md">
              {FEATURED_POST.badge}
            </span>
            <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-surface/90 backdrop-blur-md text-on-surface font-label-sm text-[10px] sm:text-xs font-semibold shadow-sm">
              {FEATURED_POST.readTime}
            </span>
          </div>

          {/* In-image Metadata Bottom */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-space-md sm:left-space-md sm:right-space-md text-surface flex flex-col gap-1">
            <span className="font-label-sm text-[10px] sm:text-xs uppercase tracking-wider text-secondary-container font-semibold">
              Hồ sơ Di tích Quốc gia Đặc biệt
            </span>
            <p className="font-serif text-sm sm:text-xl text-on-primary italic leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
              "{FEATURED_POST.subtitle}"
            </p>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-surface-variant/80 mt-0.5 sm:mt-1">
              <Feather className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-secondary-container" />
              <span className="line-clamp-1">{FEATURED_POST.authorNote}</span>
            </div>
          </div>
        </div>

        {/* Content Column (40%) */}
        <div className="lg:col-span-5 p-4 sm:p-space-lg lg:p-space-xl flex flex-col justify-between bg-surface-container-low/40">
          <div className="flex flex-col gap-2 sm:gap-space-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[10px] sm:text-xs uppercase tracking-widest text-primary font-bold">
                {FEATURED_POST.category}
              </span>
              <span className="font-mono text-[10px] sm:text-xs text-outline font-semibold">
                {FEATURED_POST.code}
              </span>
            </div>

            <h2 className="font-serif text-lg sm:text-2xl xl:text-3xl text-on-surface leading-snug font-semibold">
              {FEATURED_POST.title}
            </h2>

            <p className="font-body-md text-xs sm:text-sm xl:text-base text-on-surface-variant leading-relaxed line-clamp-3 sm:line-clamp-none">
              {FEATURED_POST.content}
            </p>

            {/* Archival Quote Inscription */}
            <div className="p-2.5 sm:p-space-sm bg-surface-container rounded-xl sm:rounded-2xl flex items-start gap-2 sm:gap-space-sm border border-outline-variant/30">
              <span className="text-secondary shrink-0 mt-0.5 font-serif text-lg sm:text-xl font-bold">
                “
              </span>
              <div className="flex flex-col">
                <span className="font-label-sm text-[10px] sm:text-xs text-secondary font-bold uppercase tracking-wider">
                  Trích văn bia Kalan:
                </span>
                <p className="font-body-sm text-[11px] sm:text-xs sm:text-sm text-on-surface italic mt-0.5 leading-relaxed line-clamp-2 sm:line-clamp-none">
                  "{FEATURED_POST.inscription}"
                </p>
              </div>
            </div>

            {/* Mini Audio Reader Player */}
            <div className="mt-1 sm:mt-space-xs p-2.5 sm:p-3.5 bg-surface-container-lowest rounded-xl sm:rounded-2xl shadow-xs sm:shadow-sm border border-outline-variant/30 flex items-center gap-2 sm:gap-space-sm">
              <button
                onClick={handleTogglePlay}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center shrink-0 transition-all shadow-md cursor-pointer"
                title={isPlaying ? "Tạm dừng" : "Phát thuyết minh"}
                type="button"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                ) : (
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-current ml-0.5" />
                )}
              </button>

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-center text-[11px] sm:text-xs">
                  <span className="text-on-surface font-semibold truncate flex items-center gap-1 sm:gap-1.5">
                    <Volume2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-secondary shrink-0" />
                    <span className="truncate">{FEATURED_POST.audioTitle}</span>
                  </span>
                  <span className="font-mono text-outline shrink-0 ml-2 font-semibold">
                    {FEATURED_POST.audioDuration}
                  </span>
                </div>

                {/* Simulated Animated Waveform */}
                <div className="flex items-center gap-1 h-3.5 mt-2 overflow-hidden">
                  {[40, 70, 30, 85, 60, 45, 90, 35, 75, 55, 40, 80, 65, 30, 70].map(
                    (h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          isPlaying
                            ? "bg-primary animate-pulse"
                            : "bg-outline-variant/60"
                        }`}
                        style={{
                          height: isPlaying ? `${h}%` : "30%",
                          animationDelay: `${i * 70}ms`,
                        }}
                      ></span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-space-md flex items-center justify-between border-t border-surface-container/60 mt-space-md">
            <Link
              className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold text-base group cursor-pointer"
              to="/blog/po-klong-garai-brick"
            >
              <span>Đọc toàn bộ khảo cứu</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="font-label-sm text-xs text-outline uppercase tracking-wider">
              {FEATURED_POST.date}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
