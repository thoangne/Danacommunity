import { Search, SlidersHorizontal, X } from "lucide-react";
import { CRAFT_CATEGORIES } from "../../data/productData";
import { ARTISANS } from "../../data/champaData";
import type { ProductSortOption } from "./types";

interface ProductFilterToolbarProps {
  selectedCategory: string;
  onCategoryChange: (catId: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedArtisanId: number | null;
  onArtisanFilterChange: (artisanId: number | null) => void;
  selectedBadge: string;
  onBadgeChange: (badge: string) => void;
  sortBy: ProductSortOption;
  onSortChange: (sort: ProductSortOption) => void;
}

export default function ProductFilterToolbar({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchQueryChange,
  selectedArtisanId,
  onArtisanFilterChange,
  selectedBadge,
  onBadgeChange,
  sortBy,
  onSortChange,
}: ProductFilterToolbarProps) {
  const selectedArtisan = selectedArtisanId
    ? ARTISANS.find((a) => a.id === selectedArtisanId)
    : null;

  return (
    <section className="sticky top-16 xl:top-20 z-30 bg-surface/95 backdrop-blur-md border-b border-surface-container-high py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
        {/* Lọc danh mục chính (Category Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CRAFT_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:bg-surface-container hover:text-on-surface"
                }`}
                type="button"
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Thanh tìm kiếm & Tùy chọn lọc phụ */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-3 pt-2 border-t border-outline-variant/20">
          {/* Ô tìm kiếm */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Tìm tác phẩm, chất liệu, làng nghề..."
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/50 focus:outline-none focus:border-primary text-on-surface placeholder:text-outline-variant"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchQueryChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
                type="button"
                aria-label="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Lọc theo Huy hiệu / Chứng nhận & Sắp xếp */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto justify-between md:justify-end">
            {/* Lọc theo nghệ nhân (nếu đang được chọn) */}
            {selectedArtisan && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-xs font-semibold shrink-0">
                <span>Tác giả: {selectedArtisan.name}</span>
                <button
                  onClick={() => onArtisanFilterChange(null)}
                  className="hover:text-red-700 cursor-pointer"
                  type="button"
                  title="Bỏ lọc nghệ nhân"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Huy hiệu */}
            <select
              value={selectedBadge}
              onChange={(e) => onBadgeChange(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">Tất cả chứng nhận</option>
              <option value="unesco">Độc bản UNESCO</option>
              <option value="exclusive">Đồ án Cung đình / Độc quyền</option>
              <option value="traditional">Cổ truyền dân tộc</option>
              <option value="ocop">Chứng nhận OCOP</option>
            </select>

            {/* Sắp xếp */}
            <div className="flex items-center gap-1 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-outline" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as ProductSortOption)}
                className="text-xs px-2.5 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary font-medium cursor-pointer"
              >
                <option value="featured">Nổi bật nhất</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
                <option value="name">Tên tác phẩm (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
