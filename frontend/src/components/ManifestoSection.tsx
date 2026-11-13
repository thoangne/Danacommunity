import {
  Handshake,
  Landmark,
  Award,
} from "lucide-react";
import { MANIFESTO_METRICS } from "../data/champaData";

const METRIC_ICONS = {
  handshake: Handshake,
  museum: Landmark,
  workspace_premium: Award,
};

export default function ManifestoSection() {
  return (
    <section id="triet-ly" className="w-full bg-surface-container-low py-space-xl border-y border-surface-container-high/60">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
        {/* Champa Geometric Motif Divider */}
        <div className="w-full flex items-center justify-center gap-space-md opacity-80 mb-space-lg">
          <div className="h-0.5 w-16 sm:w-24 bg-gradient-to-r from-transparent to-primary"></div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rotate-45 bg-primary shadow-sm"></span>
            <span className="w-3.5 h-3.5 rotate-45 bg-secondary shadow-sm"></span>
            <span className="w-2.5 h-2.5 rotate-45 bg-primary shadow-sm"></span>
          </div>
          <div className="h-0.5 w-16 sm:w-24 bg-gradient-to-l from-transparent to-primary"></div>
        </div>

        {/* Philosophy Heading & Core Statement */}
        <div className="max-w-3xl mx-auto text-center mb-0 md:mb-space-xl">
          <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold block mb-space-xs">
            Triết lý Dana • Di sản trong từng nhịp thở
          </span>
          <h2 className="font-serif text-3xl xl:text-4xl text-on-surface mb-space-md font-semibold">
            Chữa lành ký ức, tiếp nối hồn thiêng
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed italic text-base xl:text-lg">
            “Chúng tôi tin rằng, mỗi viên gạch tháp Chăm đều có linh hồn, mỗi
            vệt khói gốm Bàu Trúc đều cất giấu ký ức tiền nhân. Dana không dẫn
            bạn đi check-in vội vã. Chúng tôi đưa bạn ngồi xuống cùng các Muk,
            uống ngụm trà mát, tự tay vuốt thớ đất sét dẻo quánh và thấu hiểu một
            nền văn hóa bằng cả trái tim trân kính.”
          </p>
        </div>

        {/* 3 Impact Metric Cards Grid - Ẩn trên màn hình Smartphone (SP), hiển thị từ breakpoint md (Tablet/Desktop) */}
        <div className="hidden md:grid md:grid-cols-3 gap-gutter">
          {MANIFESTO_METRICS.map((metric) => {
            const IconComponent =
              METRIC_ICONS[metric.icon as keyof typeof METRIC_ICONS] ?? Handshake;

            return (
              <div
                key={metric.title}
                className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-md flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 border border-outline-variant/30 group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-surface-container text-primary flex items-center justify-center mb-space-md group-hover:scale-110 transition-transform">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div
                    className={`font-serif text-4xl xl:text-5xl font-bold leading-none mb-1.5 ${metric.colorClass}`}
                  >
                    {metric.value}
                  </div>
                  <div className="font-title-md text-title-md text-on-surface mb-space-xs font-semibold">
                    {metric.title}
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {metric.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
