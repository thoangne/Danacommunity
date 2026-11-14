import { RotateCcw, Sparkles } from "lucide-react";
import type { CraftProduct } from "../../data/productData";
import ProductCard from "./ProductCard";

interface ProductGridSectionProps {
  products: CraftProduct[];
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onOpenPreview: (product: CraftProduct) => void;
  onOpenOrderModal: (product: CraftProduct) => void;
}

export default function ProductGridSection({
  products,
  hasActiveFilters,
  onResetFilters,
  onOpenPreview,
  onOpenOrderModal,
}: ProductGridSectionProps) {
  return (
    <section className="py-space-xl">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
        {/* Header kết quả */}
        <div className="flex items-center justify-between mb-space-md">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-on-surface">
              Bộ Sưu Tập Tác Phẩm
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Hiển thị{" "}
              <span className="font-bold text-primary">
                {products.length}
              </span>{" "}
              tác phẩm được giám tuyển từ các nghệ nhân bản địa
            </p>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-secondary hover:underline font-semibold cursor-pointer"
              type="button"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại bộ lọc</span>
            </button>
          )}
        </div>

        {/* Empty state */}
        {products.length === 0 ? (
          <div className="p-space-xl rounded-3xl bg-surface-container-low text-center border border-outline-variant/30 max-w-lg mx-auto my-12">
            <Sparkles className="w-12 h-12 text-outline/50 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-on-surface">
              Không tìm thấy tác phẩm phù hợp
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 mb-4 leading-relaxed">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các tiêu chí lọc hiện tại.
            </p>
            <button
              onClick={onResetFilters}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer"
              type="button"
            >
              Xem tất cả tác phẩm
            </button>
          </div>
        ) : (
          /* Grid tác phẩm */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-md xl:gap-space-lg">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenPreview={onOpenPreview}
                onOpenOrderModal={onOpenOrderModal}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
