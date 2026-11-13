import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  X,
} from "lucide-react";

export interface PhotoSlide {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  link?: string;
}

const DEFAULT_PHOTO_SLIDES: PhotoSlide[] = [
  {
    id: 1,
    // Thêm =s0 ở cuối URL để lấy ảnh gốc độ phân giải cao nhất, không bị nén
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWzz5wVWN2Rre_bf3lzTZ89szZW61A19gyuIM1D6eHB2bgjSvLJ2IjqYRR2_FvWNOaiuYH_mZKTaaCYHyrAo6Y-MHZRm5QMjTQqVYlWO-UTZpP7j-38TvaXGvTC0E43MbjaK6OcYizspkYPA97vZ7ux2qQedU074FLdyFMB7zxmwJM_GGaJUJxVOmC--t3UtTdUYuMj2PhxbPFLX9SyKZLF-p5BPhi_fHZpOUSInajqnNWFka72rYwew=s0",
    title: "Tháp Cổ Po Klong Garai - Đỉnh Cao Nghệ Thuật Champa",
    subtitle: "Kalan ngàn năm trên đồi Trầu - Đô thành Panduranga",
    link: "/kham-pha/thap-po-klong-garai",
  },
  {
    id: 2,
    image: "/images/dana-life/IMG_9911.JPG",
    title: "Làng Gốm Bàu Trúc - Kỹ Nghệ Đất Nung Không Bàn Xoay",
    subtitle: "Di sản văn hóa phi vật thể đại diện nhân loại UNESCO",
    link: "/san-pham?village=bau-truc",
  },
  {
    id: 3,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXDHM6yk37AcZTWKD2kHI9jPGZKP1I4JY5yxSnfX4BbftErgSz5JHk80zz2TUzC_obO4A9NMXDFx8yx6BPBGmoGhCEaCXQvDZl1oXbqVoWkpJ3biH8-ERIAfE760E73pitqQdKh1Cszx9wZVscKNWrs_AhSvA-Knlo8t0FpNAlnZWyKlwoQFLeUtM0rrVeqUM5MhUYT5g8PyjacjFmVVYeo1XjeHE7PUh2mJzLoBrzGxvfV-vafEjkXA=s0",
    title: "Làng Dệt Thổ Cẩm Mỹ Nghiệp - Sợi Chỉ Vàng Katê",
    subtitle: "Hoa văn cổ hoàng cung dệt từ thảo mộc thiên nhiên",
    link: "/san-pham?village=my-nghiep",
  },
  {
    id: 4,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzljZH7__gmKglHYhA2NZtHh2wp1_j6eufhB24fW5dLEg6Q3iVPhcklfXTyfQfftG0s3kkeFa45XwJi0fI0t965d-lV9hy3Bp86bWdiRgQjJMFwqoPZzvC1Puek_bg_vu8Hy90bDTysgtbAXLReE5kLRMopjTkjh5Fgl-uWE2PDhyzuKEA3B_xFsrORw9XqbKdNdrSvBBD0BLP1ezotbfBBmrZCZNeWb86lbUY2kjNCncvJkPSIpv7pA=s0",
    title: "Đền Tháp Po Rome - Vị Vua Cuối Cùng Trên Đồi Đá",
    subtitle: "Dấu ấn vương triều và nghi thức tế lễ cổ truyền",
    link: "/bai-viet",
  },
  {
    id: 5,
    image: "/images/dana-life/IMG_3237.JPG",
    title: "Đồng Cừu An Hải & Đồi Cát Nam Cương Trầm Mặc",
    subtitle: "Cảnh sắc thiên nhiên Panduranga nguyên sơ đầy quyến rũ",
    link: "/tour",
  },
];

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export default function DanaLifeCarousel() {
  const [slides, setSlides] = useState<PhotoSlide[]>(DEFAULT_PHOTO_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const SLIDE_DURATION = 4000;

  // Tải danh sách slide động được Admin cấu hình trong CMS
  useEffect(() => {
    let isMounted = true;
    const fetchSlides = async () => {
      try {
        const res = await fetch(`${API_BASE}/settings/public`);
        const data = await res.json();
        if (
          isMounted &&
          data.success &&
          data.data?.home_carousel &&
          Array.isArray(data.data.home_carousel)
        ) {
          const activeSlides = data.data.home_carousel
            .filter((s: { isActive?: boolean }) => s.isActive !== false)
            .sort(
              (a: { order?: number }, b: { order?: number }) =>
                (a.order || 0) - (b.order || 0)
            );

          if (activeSlides.length > 0) {
            setSlides(activeSlides);
          }
        }
      } catch {
        // Dự phòng âm thầm dùng DEFAULT_PHOTO_SLIDES
      }
    };

    fetchSlides();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= totalSlides - 1 ? 0 : prev + 1));
    setProgress(0);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    setProgress(0);
  }, [totalSlides]);

  // Preload toàn bộ ảnh trước vào bộ nhớ trình duyệt để chuyển slide sắc nét tức thì
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, [slides]);

  useEffect(() => {
    if (!isPlaying || isLightboxOpen) return;

    const intervalTime = 50;
    const step = (intervalTime / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          nextSlide();
          return 0;
        }
        return old + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, isLightboxOpen, nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen && e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide, isLightboxOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) prevSlide();
    if (diff < -50) nextSlide();
    touchStartX.current = null;
  };

  const currentSlide = slides[currentIndex] || slides[0] || DEFAULT_PHOTO_SLIDES[0];

  return (
    <section className="relative w-full py-6 sm:py-8 lg:py-10 bg-surface select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* THANH TIÊU ĐỀ TRÌNH CHIẾU */}
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-primary relative">
              {isPlaying && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              )}
            </span>
            <span className="font-serif font-bold text-xs sm:text-sm tracking-wider uppercase text-on-surface">
              Chân Dung Đất Panduranga
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-mono text-xs text-on-surface-variant font-bold">
              <span className="text-primary text-sm sm:text-base">0{currentIndex + 1}</span>
              <span className="mx-1 opacity-50">/</span>
              <span className="opacity-70">0{totalSlides}</span>
            </span>

            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              aria-label={isPlaying ? "Tạm dừng trình chiếu" : "Tiếp tục trình chiếu"}
              className="p-1.5 sm:p-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors cursor-pointer"
              title={isPlaying ? "Tạm dừng (Phím cách)" : "Chạy tiếp (Phím cách)"}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </button>
          </div>
        </div>

        {/* KHUNG HIỂN THỊ ẢNH CHÍNH (FULL-WIDTH ASPECT CINEMATIC) */}
        <div
          className="relative w-full aspect-[16/10] sm:aspect-[16/8] lg:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden bg-surface-container-lowest shadow-2xl border border-outline-variant/30 group cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsLightboxOpen(true)}
        >
          {/* LỚP ẢNH HIỂN THỊ */}
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center transform transition-transform duration-[7000ms] ease-out group-hover:scale-105 contrast-[1.03] saturate-[1.05]"
                loading={idx === 0 ? "eager" : "lazy"}
              />
              {/* GRADIENT CHE PHỦ BẢO VỆ CHỮ TỰ NHIÊN */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          ))}

          {/* NÚT PHÓNG TO GÓC PHẢI TRÊN */}
          <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              aria-label="Phóng to ảnh chất lượng cao"
              className="w-9 h-9 rounded-full bg-black/55 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-all cursor-pointer"
              title="Xem ảnh cỡ lớn"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          {/* NÚT ĐIỀU HƯỚNG TRÁI & PHẢI */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Ảnh trước"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer transform hover:scale-110 shadow-xl"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Ảnh kế tiếp"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer transform hover:scale-110 shadow-xl"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>

          {/* TIÊU ĐỀ ĐẶT TRỰC TIẾP TRÊN ẢNH */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 z-20">
            {currentSlide.link ? (
              <a
                href={currentSlide.link}
                onClick={(e) => e.stopPropagation()}
                className="group/link inline-block"
              >
                <h3 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] tracking-tight group-hover/link:text-amber-300 transition-colors">
                  {currentSlide.title}
                </h3>
                {currentSlide.subtitle && (
                  <p className="text-xs sm:text-sm text-stone-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] mt-1 font-medium">
                    {currentSlide.subtitle}
                  </p>
                )}
              </a>
            ) : (
              <div>
                <h3 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] tracking-tight">
                  {currentSlide.title}
                </h3>
                {currentSlide.subtitle && (
                  <p className="text-xs sm:text-sm text-stone-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] mt-1 font-medium">
                    {currentSlide.subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* THANH TIẾN TRÌNH CHẠY DƯỚI ĐÁY */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-primary to-amber-500 transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* DẢI FILMSTRIP THUMBNAIL PHÍA DƯỚI */}
        <div className="mt-4 flex items-center justify-between gap-3 overflow-x-auto pb-1">
          <div className="flex items-center gap-2 sm:gap-3">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setProgress(0);
                }}
                className={`relative flex items-center gap-2 p-1 sm:p-1.5 rounded-2xl border transition-all cursor-pointer ${
                  idx === currentIndex
                    ? "bg-surface-container-lowest border-primary shadow-md ring-2 ring-primary/30"
                    : "bg-surface-container-low/60 border-transparent hover:bg-surface-container hover:border-outline-variant/40 opacity-75 hover:opacity-100"
                }`}
                title={slide.title}
              >
                <div className="w-12 h-8 sm:w-16 sm:h-10 rounded-xl overflow-hidden bg-surface-container shrink-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="hidden md:inline-block font-serif text-xs font-semibold text-on-surface max-w-[140px] truncate pr-2">
                  {slide.title.split("-")[0]?.trim()}
                </span>
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-on-surface-variant font-mono">
            <span>Dùng phím</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high border border-outline-variant font-mono text-[10px]">
              &larr;
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high border border-outline-variant font-mono text-[10px]">
              &rarr;
            </kbd>
            <span>để chuyển ảnh</span>
          </div>
        </div>
      </div>

      {/* LIGHTBOX TOÀN MÀN HÌNH (FULLSCREEN IMMERSIVE PREVIEW) */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh toàn màn hình"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="flex items-center justify-between text-white w-full max-w-7xl mx-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-white/90 text-sm sm:text-base font-serif font-semibold">
              {currentSlide.title}
            </span>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Đóng xem ảnh lớn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="max-h-[85vh] max-w-[95vw] object-contain rounded-2xl shadow-2xl contrast-[1.04] saturate-[1.05]"
            />
          </div>

          <div
            className="flex items-center justify-between text-white/80 w-full max-w-7xl mx-auto z-10 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-mono text-amber-400 font-bold whitespace-nowrap pl-4">
              0{currentIndex + 1} / 0{totalSlides}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
