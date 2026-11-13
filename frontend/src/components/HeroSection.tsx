import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  AudioLines,
  Calendar,
  CheckCircle2,
  HeartHandshake,
  Landmark,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import {
  DESTINATION_OPTIONS,
  EXPERIENCE_OPTIONS,
  HERO_IMAGE,
  TRAVELER_OPTIONS,
} from "../data/champaData";
import { toast } from "./ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DatePicker } from "./ui/date-picker";

interface HeroSectionProps {
  onToggleAudio?: () => void;
  isAudioPlaying?: boolean;
}

export default function HeroSection({
  onToggleAudio,
  isAudioPlaying = false,
}: HeroSectionProps) {
  const [destination, setDestination] = useState(DESTINATION_OPTIONS[0]);
  const [date, setDate] = useState("2025-05-15");
  const [experience, setExperience] = useState(EXPERIENCE_OPTIONS[0]);
  const [travelers, setTravelers] = useState(TRAVELER_OPTIONS[0]);

  const handleSearchTrip = (e: FormEvent) => {
    e.preventDefault();
    toast.success("Dana đã tìm thấy các hành trình phù hợp!", {
      description: `${destination} • ${travelers} • Khởi hành ngày ${date}`,
    });
    const el = document.getElementById("hanh-trinh");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface-container-low/60 via-surface to-surface pb-space-lg sm:pb-space-xl pt-16 sm:pt-20 xl:pt-24">
      {/* Atmospheric subtle decorative gradient blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin pt-space-xs sm:pt-space-md xl:pt-space-lg">
        {/* Main 2-Column Hero Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center min-h-[auto] lg:min-h-[580px]">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col justify-center pr-0 lg:pr-space-md z-10">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-space-xs px-3 py-1 sm:px-space-sm sm:py-1.5 rounded-full bg-surface-container-high border border-outline-variant/30 w-fit mb-space-sm sm:mb-space-md shadow-sm">
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-sm text-[10px] sm:text-[11px] xl:text-label-sm uppercase tracking-wider sm:tracking-widest text-primary font-bold">
                Dana • Di sản Panduranga - Văn hóa sống ngàn năm
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-2xl sm:text-4xl xl:text-5xl 2xl:text-6xl text-on-surface mb-space-sm sm:mb-space-md leading-tight sm:leading-[1.15] font-semibold tracking-tight">
              Chạm vào{" "}
              <span className="italic text-primary font-normal">nhịp thở</span>{" "}
              ngàn năm xứ Panduranga
            </h1>

            {/* Description */}
            <p className="font-body-md xl:font-body-lg text-on-surface-variant max-w-xl mb-space-md sm:mb-space-xl leading-relaxed text-sm sm:text-base xl:text-lg">
              Không đơn thuần là chuyến du ngoạn. Đây là hành trình trở về để
              lắng nghe đất nung kể chuyện, thổ cẩm hát ca và tâm hồn người Chăm
              mở lối trân quý.
            </p>

            {/* Dual CTA Buttons */}
            <div className="flex flex-wrap items-center gap-space-sm xl:gap-space-md mb-space-xl">
              <a
                className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-3.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 font-semibold"
                href="#hanh-trinh"
              >
                <span>Khám phá Hành trình độc bản</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-space-sm px-space-md py-3.5 rounded-lg font-label-lg text-label-lg transition-all shadow-sm ${
                  isAudioPlaying
                    ? "bg-primary-container text-on-primary-container ring-2 ring-primary"
                    : "bg-surface-container-low hover:bg-surface-container text-on-secondary-container"
                }`}
                onClick={onToggleAudio}
                type="button"
              >
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                </span>
                <AudioLines className="h-5 w-5 text-secondary" />
                <span className="font-semibold">
                  {isAudioPlaying ? "Đang phát Saranai" : "Lắng nghe Saranai & Baranưng"}
                </span>
              </button>
            </div>

            {/* Trust Badges Micro-row */}
            <div className="flex flex-wrap items-center gap-space-md xl:gap-space-lg pt-space-xs text-on-surface-variant border-t border-surface-container-high/60">
              <div className="flex items-center gap-space-xs">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="font-body-sm text-body-sm">
                  Đồng hành cùng 100% Nghệ nhân bản địa
                </span>
              </div>
            </div>
          </div>

          {/* Right Visual Showcase */}
          <div className="lg:col-span-5 relative mt-space-lg lg:mt-0">
            <div className="relative w-full h-[380px] xl:h-[520px] rounded-2xl overflow-hidden shadow-2xl bg-surface-container-high group border border-outline-variant/30">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Tháp Po Klong Garai ráng chiều hoàng hôn Ninh Thuận"
                src={HERO_IMAGE}
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/25 to-transparent"></div>

              {/* Floated Cultural Badge */}
              <div className="absolute top-space-md left-space-md bg-surface/90 backdrop-blur-md px-space-md py-space-xs rounded-lg shadow-md border border-white/20">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold flex items-center gap-1.5">
                  <Landmark className="h-4 w-4 text-secondary" />
                  Di sản Thế giới Khẩn cấp UNESCO
                </span>
              </div>

              {/* Bottom Caption Card Overlay */}
              <div className="absolute bottom-space-md left-space-md right-space-md bg-white/95 backdrop-blur-md p-space-md rounded-xl shadow-lg border border-outline-variant/30">
                <div className="flex items-start justify-between gap-space-sm">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase text-primary tracking-widest font-semibold block">
                      Tâm điểm Khảo cổ Thế kỷ XII
                    </span>
                    <h3 className="font-headline-sm text-xl text-on-surface mt-0.5 font-serif font-semibold">
                      Kalan Po Klong Garai
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                      Kiệt tác kiến trúc gạch nung không vữa cùng ngọn lửa thiêng
                      soi bóng văn hóa Panduranga hơn 800 năm.
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-primary">
                    <Landmark className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Staggered Accent Stamp behind */}
            <div className="absolute -bottom-4 -left-4 w-28 h-28 rounded-2xl bg-secondary-fixed/50 -z-10 blur-[1px]"></div>
          </div>
        </div>

        {/* Integrated Trip Planner Bar (Desktop Horizontally Aligned Bar) */}
        <div
          id="dat-tour"
          className="mt-space-lg xl:mt-space-xl p-3 sm:p-4 xl:p-5 rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl shadow-stone-900/10 border border-outline-variant/40 ring-1 ring-primary/5"
        >
          <form
            onSubmit={handleSearchTrip}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3 xl:gap-4 items-stretch"
          >
            {/* Field 1: Destination */}
            <div className="flex flex-col justify-between p-3 rounded-2xl bg-surface-container-low/70 hover:bg-surface-container-low transition-all border border-transparent hover:border-outline-variant/50 focus-within:border-primary/50 focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/10 min-h-[74px]">
              <label className="font-label-sm text-[11px] uppercase tracking-wider text-secondary font-semibold flex items-center gap-1.5 select-none">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Điểm đến / Làng nghề</span>
              </label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger className="h-auto p-0 border-none bg-transparent shadow-none hover:bg-transparent focus:ring-0 text-sm xl:text-[15px] font-semibold text-on-surface mt-1">
                  <SelectValue placeholder="Chọn vùng di sản" />
                </SelectTrigger>
                <SelectContent>
                  {DESTINATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Field 2: Date */}
            <div className="flex flex-col justify-between p-3 rounded-2xl bg-surface-container-low/70 hover:bg-surface-container-low transition-all border border-transparent hover:border-outline-variant/50 focus-within:border-primary/50 focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/10 min-h-[74px]">
              <label className="font-label-sm text-[11px] uppercase tracking-wider text-secondary font-semibold flex items-center gap-1.5 select-none">
                <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Ngày khởi hành</span>
              </label>
              <DatePicker
                value={date}
                onChange={setDate}
                placeholder="Chọn ngày khởi hành"
              />
            </div>

            {/* Field 3: Experience Type */}
            <div className="flex flex-col justify-between p-3 rounded-2xl bg-surface-container-low/70 hover:bg-surface-container-low transition-all border border-transparent hover:border-outline-variant/50 focus-within:border-primary/50 focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/10 min-h-[74px]">
              <label className="font-label-sm text-[11px] uppercase tracking-wider text-secondary font-semibold flex items-center gap-1.5 select-none">
                <HeartHandshake className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Trải nghiệm mong muốn</span>
              </label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger className="h-auto p-0 border-none bg-transparent shadow-none hover:bg-transparent focus:ring-0 text-sm xl:text-[15px] font-semibold text-on-surface mt-1">
                  <SelectValue placeholder="Chọn trải nghiệm" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Field 4: Guests */}
            <div className="flex flex-col justify-between p-3 rounded-2xl bg-surface-container-low/70 hover:bg-surface-container-low transition-all border border-transparent hover:border-outline-variant/50 focus-within:border-primary/50 focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/10 min-h-[74px]">
              <label className="font-label-sm text-[11px] uppercase tracking-wider text-secondary font-semibold flex items-center gap-1.5 select-none">
                <Users className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Số lượng lữ khách</span>
              </label>
              <Select value={travelers} onValueChange={setTravelers}>
                <SelectTrigger className="h-auto p-0 border-none bg-transparent shadow-none hover:bg-transparent focus:ring-0 text-sm xl:text-[15px] font-semibold text-on-surface mt-1">
                  <SelectValue placeholder="Chọn số lượng khách" />
                </SelectTrigger>
                <SelectContent>
                  {TRAVELER_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="flex items-center min-h-[74px]">
              <button
                className="w-full h-full min-h-[60px] rounded-2xl bg-gradient-to-r from-primary to-primary-container hover:from-primary-container hover:to-primary text-on-primary font-semibold text-base tracking-wide flex items-center justify-center gap-2.5 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group"
                type="submit"
              >
                <Search className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span>Tìm Chuyến Đi</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
