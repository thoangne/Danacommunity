import { Link } from "react-router-dom";
import { Flame } from "lucide-react";

const HERITAGE_METRICS = [
  {
    value: "4+ Thế hệ",
    label: "Truyền dạy gia tộc liên tục",
    colorClass: "text-primary",
  },
  {
    value: "58 Năm",
    label: "Giữ lửa gốm của Muk Phan",
    colorClass: "text-secondary",
  },
  {
    value: "UNESCO",
    label: "Di sản ghi danh nhân loại",
    colorClass: "text-amber-700",
  },
  {
    value: "100%",
    label: "Kỹ nghệ cổ không bàn xoay",
    colorClass: "text-tertiary",
  },
];

export default function ArtisansHeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-b from-surface-container-low via-surface to-surface py-space-xl overflow-hidden border-b border-surface-container-high/60">
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center text-on-surface-variant font-label-md text-xs sm:text-sm gap-space-xs tracking-wider uppercase mb-space-sm">
          <Link className="hover:text-primary transition-colors" to="/">
            Trang chủ
          </Link>
          <span className="text-outline/60">/</span>
          <span className="text-primary font-bold">Chân dung Nghệ nhân</span>
        </div>

        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-label-sm text-xs font-bold uppercase tracking-widest mb-space-xs border border-secondary/20">
            <Flame className="w-3.5 h-3.5 text-secondary" />
            Báu Vật Nhân Văn Sống Panduranga
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl xl:text-5xl text-on-surface font-bold leading-tight mt-space-xs">
            Ký Ức Sống Trong Đôi Bàn Tay
          </h1>
          <p className="font-body-md text-sm sm:text-base text-on-surface-variant mt-space-sm leading-relaxed">
            Họ không chỉ làm nghề để mưu sinh. Từng đường vuốt đất, từng lượt thoi dệt,
            từng nhịp gõ paranưng là hành trình gìn giữ danh dự và linh hồn của cả một dân tộc.
            Gặp gỡ những nghệ nhân ưu tú đã dành nửa thế kỷ giữ lửa cho văn hóa Champa.
          </p>

          {/* Heritage Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-space-lg">
            {HERITAGE_METRICS.map((metric, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30"
              >
                <span className={`font-serif text-2xl font-bold ${metric.colorClass} block`}>
                  {metric.value}
                </span>
                <span className="text-[11px] text-on-surface-variant block mt-0.5 font-medium">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
