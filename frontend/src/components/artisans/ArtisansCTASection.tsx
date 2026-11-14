import { Link } from "react-router-dom";

export default function ArtisansCTASection() {
  return (
    <section className="py-space-xl">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
        <div className="rounded-3xl bg-surface-container-low border border-outline-variant/40 p-space-lg sm:p-space-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
              Đồng Hành Cùng Dana Tour
            </span>
            <h3 className="font-serif text-2xl font-bold text-on-surface">
              Hành Trình Gặp Gỡ & Ăn Trưa Cùng Nghệ Nhân
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
              Chúng tôi tổ chức các tour trải nghiệm chuyên sâu có hướng dẫn viên người bản địa,
              đưa đón tận nơi và thưởng thức bữa cơm truyền thống Chăm bên hiên nhà nghệ nhân.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/tour"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-xs"
            >
              Xem Tour Làng Nghề
            </Link>
            <Link
              to="/san-pham"
              className="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface text-xs font-semibold hover:bg-surface-container-highest transition-all"
            >
              Xem Sản Phẩm Di Sản
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
