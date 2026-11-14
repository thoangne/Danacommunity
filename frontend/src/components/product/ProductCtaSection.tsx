import { Link } from "react-router-dom";

interface ProductCtaSectionProps {
  onOpenCustomOrder: () => void;
}

export default function ProductCtaSection({
  onOpenCustomOrder,
}: ProductCtaSectionProps) {
  return (
    <section className="py-space-xl">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
        <div className="rounded-3xl bg-gradient-to-r from-primary via-primary/95 to-secondary p-space-lg sm:p-space-xl text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white font-label-sm text-xs font-bold uppercase tracking-wider inline-block mb-2">
              Dịch vụ Giám tuyển & Đặt riêng
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
              Bạn muốn chế tác tác phẩm độc bản riêng hoặc ghé thăm xưởng làng nghề?
            </h2>
            <p className="text-xs sm:text-sm text-white/80 mt-space-sm leading-relaxed">
              Đội ngũ DanaCommunity kết nối trực tiếp bạn với các nghệ nhân ưu tú tại Bàu Trúc,
              Mỹ Nghiệp và Hữu Đức để tạo tác kích thước riêng hoặc sắp xếp trải nghiệm học nghề.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-space-md">
              <button
                onClick={onOpenCustomOrder}
                className="px-5 py-2.5 rounded-xl bg-white text-primary text-xs font-bold hover:bg-white/90 transition-all shadow-md cursor-pointer"
                type="button"
              >
                Đăng ký tư vấn chế tác
              </button>
              <Link
                to="/tour"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/30 transition-all"
              >
                Xem Dana Tour Làng Nghề →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
