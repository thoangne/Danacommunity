import { DIGITAL_INSCRIPTIONS } from "../../data/digitalHeritageData";
import InscriptionCard from "./InscriptionCard";

export default function InscriptionsSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-margin-mobile xl:px-margin py-space-xl animate-in fade-in duration-200">
      <div className="flex flex-col gap-space-lg">
        {/* Section Header */}
        <div className="flex flex-col gap-space-xs max-w-2xl">
          <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
            Kho Lưu Trữ Ký Tự Khảo Cổ
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold">
            Bản Dập & Giải Mã Văn Bia Cổ Sa Thạch
          </h2>
          <p className="text-sm text-on-surface-variant">
            Số hóa ảnh độ phân giải cao và giải mã các dòng minh văn Sanskrit - Chăm cổ ngàn năm.
          </p>
        </div>

        {/* Inscriptions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DIGITAL_INSCRIPTIONS.map((ins) => (
            <InscriptionCard key={ins.id} inscription={ins} />
          ))}
        </div>
      </div>
    </section>
  );
}
