import { ShieldCheck } from "lucide-react";

export default function TourTrustSection() {
  return (
    <section className="w-full bg-surface-container-low py-space-xl border-t border-surface-container-high/60">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin grid grid-cols-1 md:grid-cols-2 gap-gutter text-center md:text-left">
        <div className="flex items-center gap-space-md p-space-md bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
          <ShieldCheck className="h-10 w-10 text-primary shrink-0" />
          <div>
            <h4 className="font-serif text-base font-semibold text-on-surface">100% Nghệ Nhân Bản Địa</h4>
            <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">Không thông qua trung gian du lịch thương mại hóa.</p>
          </div>
        </div>

        <div className="flex items-center gap-space-md p-space-md bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
          <ShieldCheck className="h-10 w-10 text-secondary shrink-0" />
          <div>
            <h4 className="font-serif text-base font-semibold text-on-surface">Bảo Hiểm & Đưa Đón Tận Nơi</h4>
            <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">Xe đưa đón trọn gói từ TP. Phan Rang - Tháp Chàm.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
