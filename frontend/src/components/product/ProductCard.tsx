import { Link } from "react-router-dom";
import { Compass, Eye, Phone } from "lucide-react";
import type { CraftProduct } from "../../data/productData";

interface ProductCardProps {
  product: CraftProduct;
  onOpenPreview: (product: CraftProduct) => void;
  onOpenOrderModal: (product: CraftProduct) => void;
}

export default function ProductCard({
  product,
  onOpenPreview,
  onOpenOrderModal,
}: ProductCardProps) {
  return (
    <article className="group rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/50 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Area */}
      <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-surface-container-high">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badge trên ảnh */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-primary shadow-xs border border-outline-variant/20">
            {product.categoryLabel}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-secondary/90 text-white shadow-xs">
            {product.badge}
          </span>
        </div>

        {/* Quick action button on hover */}
        <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
          <button
            onClick={() => onOpenPreview(product)}
            className="p-2 rounded-xl bg-white/95 backdrop-blur-md text-on-surface hover:text-primary shadow-md hover:scale-105 transition-all cursor-pointer"
            type="button"
            title="Xem nhanh chi tiết"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Làng nghề */}
          <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
            <Compass className="w-3 h-3" />
            {product.village}
          </span>

          {/* Tên tác phẩm */}
          <h3 className="font-serif text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1 mt-1">
            {product.name}
          </h3>

          {/* Mô tả ngắn */}
          <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
            {product.summary}
          </p>

          {/* Thông số chất liệu */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {product.materials.slice(0, 2).map((mat, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded text-[10px] bg-surface-container text-on-surface-variant font-medium"
              >
                {mat}
              </span>
            ))}
          </div>
        </div>

        {/* Footer card: Tác giả & Giá / CTA */}
        <div className="mt-3.5 pt-3 border-t border-outline-variant/30">
          {/* Nghệ nhân chế tác */}
          <Link
            to={`/nghe-nhan#artisan-${product.artisanId}`}
            className="flex items-center gap-2 group/author hover:bg-surface-container-low p-1 rounded-lg transition-colors mb-2"
          >
            <img
              src={product.artisanAvatar}
              alt={product.artisanName}
              className="w-6 h-6 rounded-full object-cover border border-primary/50 shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-primary group-hover/author:underline truncate block">
                {product.artisanName}
              </span>
            </div>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-on-surface-variant block">
                Giá tham khảo:
              </span>
              <span className="font-serif text-sm font-bold text-primary block">
                {product.priceEstimate}
              </span>
              <span className="text-[10px] text-secondary font-medium flex items-center gap-1 mt-0.5">
                <Phone className="w-2.5 h-2.5 text-primary" /> Hotline: 0918.388.998
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenPreview(product)}
                className="px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface text-[11px] font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                type="button"
              >
                Chi tiết
              </button>
              <button
                onClick={() => onOpenOrderModal(product)}
                className="px-2.5 py-1.5 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
                type="button"
              >
                Thỉnh tác phẩm
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
