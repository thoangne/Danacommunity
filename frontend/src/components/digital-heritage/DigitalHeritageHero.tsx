import { Link } from "react-router-dom";
import { Binary, Camera, Languages } from "lucide-react";
import type { DigitalHeritageHeroProps, DigitalHeritageTabConfig } from "./types";

const DIGITAL_HERITAGE_TABS: DigitalHeritageTabConfig[] = [
  {
    id: "hinh-anh",
    label: "Kho ảnh Văn hoá",
    icon: Camera,
    desc: "Kho ảnh nghệ thuật điền dã & bảo tàng số",
  },
  {
    id: "ngon-ngu",
    label: "Số hoá Ngôn ngữ Chăm",
    icon: Languages,
    desc: "Ký tự Akhar Thrah tương tác & từ điển số",
  },
  {
    id: "van-bia",
    label: "Giải mã Văn bia Cổ",
    icon: Binary,
    desc: "Bản dập bia ký sa thạch Sanskrit - Chăm",
  },
];

export default function DigitalHeritageHero({
  activeTab,
  onSelectTab,
}: DigitalHeritageHeroProps) {
  return (
    <section className="w-full bg-surface-container-low/70 pt-space-md sm:pt-space-lg pb-space-lg border-b border-surface-container-high/60">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin flex flex-col gap-space-md">
        {/* Breadcrumb & Archival Tag */}
        <div className="flex items-center justify-between text-on-surface-variant font-label-md text-xs sm:text-sm flex-wrap gap-2">
          <nav className="flex items-center gap-space-xs tracking-wider uppercase text-xs" aria-label="Breadcrumb">
            <Link className="hover:text-primary transition-colors" to="/">
              Trang chủ
            </Link>
            <span className="text-outline/60">/</span>
            <span className="text-primary font-bold">Số hoá di sản</span>
          </nav>
          <div className="hidden sm:flex items-center gap-2 text-secondary font-label-sm text-xs uppercase tracking-widest bg-surface-container px-3 py-1 rounded-full border border-outline-variant/30">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Số Hóa Di Sản Bản Địa 2025</span>
          </div>
        </div>

        {/* Title Lockup */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mt-space-xs">
          <div className="flex flex-col gap-space-xs max-w-3xl">
            <div className="flex items-center gap-2 text-primary font-label-sm text-xs uppercase tracking-widest font-bold">
              <Binary className="h-4 w-4" />
              <span>Trung Tâm Bảo Tồn Số • Kho Ảnh Văn Hóa • Ngôn Ngữ & Văn Bia</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl xl:text-5xl text-on-surface font-semibold leading-tight tracking-tight">
              Số Hoá Di Sản: Bất Tử Hóa Ký Ức Champa
            </h1>
            <p className="font-body-md xl:font-body-lg text-on-surface-variant text-sm sm:text-base xl:text-lg leading-relaxed mt-1">
              Không gian số hóa toàn diện lưu trữ tư liệu nhiếp ảnh điền dã độ
              phân giải cao, bảo tồn hệ thống chữ cổ Akhar Thrah và giải mã các
              bản dập văn bia sa thạch ngàn năm xứ Panduranga.
            </p>
          </div>
        </div>

        {/* 3 Major Digital Hub Navigation Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-space-md">
          {DIGITAL_HERITAGE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                type="button"
                className={`flex flex-col text-left p-4 rounded-2xl transition-all cursor-pointer border ${
                  isCurrent
                    ? "bg-primary text-on-primary border-primary shadow-md ring-2 ring-primary/20 -translate-y-0.5"
                    : "bg-surface-container-lowest hover:bg-surface-container text-on-surface border-outline-variant/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${isCurrent ? "text-on-primary" : "text-primary"}`} />
                  <span className="font-title-sm text-sm sm:text-base font-bold">
                    {tab.label}
                  </span>
                </div>
                <span
                  className={`font-body-sm text-xs mt-1.5 line-clamp-1 ${
                    isCurrent
                      ? "text-on-primary/80"
                      : "text-on-surface-variant"
                  }`}
                >
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
