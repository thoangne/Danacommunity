import { Link } from "react-router-dom";
import { Flame, Phone, ArrowRight } from "lucide-react";
import { CRAFT_PRODUCTS, type CraftProduct } from "../../data/productData";

interface ProductHeroSectionProps {
  onOpenPreview: (product: CraftProduct) => void;
  spotlightProduct?: CraftProduct;
}

export default function ProductHeroSection({
  onOpenPreview,
  spotlightProduct = CRAFT_PRODUCTS[0],
}: ProductHeroSectionProps) {
  return (
    <section className="relative w-full bg-gradient-to-b from-surface-container-low via-surface to-surface py-space-xl overflow-hidden border-b border-surface-container-high/60">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center text-on-surface-variant font-label-md text-xs sm:text-sm gap-space-xs tracking-wider uppercase mb-space-sm">
          <Link className="hover:text-primary transition-colors" to="/">
            Trang chủ
          </Link>
          <span className="text-outline/60">/</span>
          <span className="text-primary font-bold">Sản phẩm Di sản</span>
        </div>

        {/* Split Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center mt-space-sm">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-xs font-bold uppercase tracking-widest mb-space-xs border border-primary/20">
              <Flame className="w-3.5 h-3.5 text-primary" />
              Di sản Đất & Sợi Panduranga
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl xl:text-5xl text-on-surface font-bold leading-tight mt-space-xs">
              Tác Phẩm Thủ Công Độc Bản
            </h1>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant mt-space-sm max-w-2xl leading-relaxed">
              Mỗi tác phẩm là tinh hoa được nắn vuốt bằng đôi chân đi giật lùi,
              dệt từng nhịp thoi cài hoa văn cổ hoàng cung hay gọt đẽo từ gỗ mun rừng.
              Không qua khuôn đúc công nghiệp — lưu giữ trọn vẹn hồn cốt của đất trời và tiền nhân Champa.
            </p>

            {/* Metrics Pill Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-space-lg max-w-lg">
              <div className="p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30">
                <span className="font-serif text-xl sm:text-2xl font-bold text-primary block">
                  100%
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant block mt-0.5">
                  Thủ công truyền thống
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30">
                <span className="font-serif text-xl sm:text-2xl font-bold text-secondary block">
                  UNESCO
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant block mt-0.5">
                  Gốm Chăm ghi danh
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30">
                <span className="font-serif text-xl sm:text-2xl font-bold text-amber-700 block">
                  4+
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant block mt-0.5">
                  Làng nghề lưu giữ
                </span>
              </div>
            </div>

            {/* Thông tin liên hệ tư vấn & đặt tác phẩm trực tiếp */}
            <div className="mt-space-md p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex flex-wrap items-center justify-between gap-3 max-w-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">
                    Hotline Tư Vấn Đặt Tác Phẩm & Giao Tận Nơi
                  </span>
                  <a
                    href="tel:0918388998"
                    className="font-serif text-sm font-bold text-on-surface hover:text-primary transition-colors block"
                  >
                    0918.388.998 • Zalo Nghệ Nhân Chăm
                  </a>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold">
                Trực tiếp từ xưởng làng nghề
              </span>
            </div>
          </div>

          {/* Hero Spotlight Right: Featured Highlight Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-surface-container-lowest border border-outline-variant/40 shadow-lg p-3 group">
              <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-surface-container">
                <img
                  src={spotlightProduct.images[0] || "/images/dana-life/IMG_9911.JPG"}
                  alt={spotlightProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-white text-xs font-bold shadow-xs">
                  Tác phẩm Spotlight
                </span>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] uppercase tracking-wider text-primary-fixed block font-semibold">
                    {spotlightProduct.categoryLabel} • {spotlightProduct.artisanName}
                  </span>
                  <h3 className="font-serif text-lg font-bold">
                    {spotlightProduct.name}
                  </h3>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs text-on-surface-variant block">Giá tham khảo thỉnh tác phẩm:</span>
                  <span className="font-serif text-base font-bold text-primary">{spotlightProduct.priceEstimate}</span>
                </div>
                <button
                  onClick={() => onOpenPreview(spotlightProduct)}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  type="button"
                >
                  <span>Xem câu chuyện</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
