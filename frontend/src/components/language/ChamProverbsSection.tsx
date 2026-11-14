import { CHAM_PROVERBS } from "../../data/languageData";
import ProverbCard from "./ProverbCard";
import type { ChamProverbsSectionProps } from "./types";

export default function ChamProverbsSection({
  proverbs = CHAM_PROVERBS,
  className = "",
}: ChamProverbsSectionProps) {
  return (
    <section
      className={`w-full max-w-7xl mx-auto px-margin-mobile xl:px-margin py-space-xl ${className}`}
    >
      <div className="flex flex-col gap-space-lg">
        {/* Section Header */}
        <div className="flex flex-col gap-space-xs max-w-2xl">
          <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
            Dôm Ngap Champa
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold">
            Ca Dao & Tục Ngữ Dân Gian Chăm
          </h2>
          <p className="text-sm text-on-surface-variant">
            Đúc kết triết lý nhân sinh hòa ái, lòng kính trọng đấng sinh thành và tình yêu thiên nhiên đất mặn.
          </p>
        </div>

        {/* Proverbs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {proverbs.map((proverb) => (
            <ProverbCard key={proverb.id} proverb={proverb} />
          ))}
        </div>
      </div>
    </section>
  );
}
