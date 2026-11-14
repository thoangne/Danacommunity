import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Phone } from "lucide-react";
import type { CraftProduct } from "../../data/productData";

interface ProductQuickViewModalProps {
  product: CraftProduct;
  onClose: () => void;
  onOrderProduct: (product: CraftProduct) => void;
}

export default function ProductQuickViewModal({
  product,
  onClose,
  onOrderProduct,
}: ProductQuickViewModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-surface rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-outline-variant/40 relative flex flex-col">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-surface-container-highest text-on-surface hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-xs cursor-pointer"
          type="button"
          aria-label="Đóng xem nhanh"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-7">
          {/* Cột trái: Ảnh chi tiết & Thumbnails */}
          <div className="md:col-span-6 flex flex-col gap-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container-high border border-outline-variant/30">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary text-white shadow-xs">
                {product.badge}
              </span>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? "border-primary scale-105 shadow-xs"
                        : "border-outline-variant/40 opacity-70 hover:opacity-100"
                    }`}
                    type="button"
                  >
                    <img
                      src={img}
                      alt="Góc chụp tác phẩm"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Khối nghệ nhân tác giả */}
            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between mt-1">
              <div className="flex items-center gap-3">
                <img
                  src={product.artisanAvatar}
                  alt={product.artisanName}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-primary shrink-0"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-primary block">
                    {product.artisanTitle}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-on-surface">
                    {product.artisanName}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    {product.village}
                  </p>
                </div>
              </div>
              <Link
                to={`/nghe-nhan#artisan-${product.artisanId}`}
                onClick={onClose}
                className="text-xs text-primary font-bold hover:underline shrink-0"
              >
                Xem hồ sơ →
              </Link>
            </div>
          </div>

          {/* Cột phải: Thông tin & Ý nghĩa */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                {product.categoryLabel} • {product.preservationStatus}
              </span>
              <h3 className="font-serif text-2xl font-bold text-on-surface mt-1">
                {product.name}
              </h3>
              <div className="mt-2 text-xl font-serif font-bold text-primary">
                {product.priceEstimate}
              </div>

              <p className="text-xs sm:text-sm text-on-surface-variant mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Ý nghĩa văn hóa */}
              <div className="mt-4 p-3.5 rounded-2xl bg-primary/5 border border-primary/20">
                <span className="font-serif text-xs font-bold text-primary block mb-1">
                  Ý Nghĩa Biểu Tượng & Tâm Linh:
                </span>
                <p className="text-xs text-on-surface-variant leading-relaxed italic">
                  "{product.culturalMeaning}"
                </p>
              </div>

              {/* Thông số kỹ thuật */}
              <div className="mt-4 space-y-1.5 text-xs text-on-surface-variant">
                <div className="flex justify-between py-1 border-b border-outline-variant/20">
                  <span className="font-semibold text-on-surface">Kích thước:</span>
                  <span>{product.dimensions}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/20">
                  <span className="font-semibold text-on-surface">Chất liệu:</span>
                  <span>{product.materials.join(" • ")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/20">
                  <span className="font-semibold text-on-surface">Thời gian tạo tác:</span>
                  <span>{product.craftingTime}</span>
                </div>
              </div>

              {/* 4 bước chế tác */}
              <div className="mt-4">
                <span className="font-serif text-xs font-bold text-on-surface block mb-2">
                  Quy trình tạo tác thủ công:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {product.craftingSteps.map((step) => (
                    <div
                      key={step.step}
                      className="p-2 rounded-xl bg-surface-container text-[11px]"
                    >
                      <span className="font-bold text-primary mr-1">
                        {step.step}.
                      </span>
                      <span className="font-semibold text-on-surface">
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thông tin liên hệ nhanh trực tiếp */}
              <div className="mt-4 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <span className="text-[10px] text-on-surface-variant block font-medium">Hotline / Zalo liên hệ nghệ nhân:</span>
                    <a href="tel:0918388998" className="font-serif text-xs font-bold text-primary hover:underline">
                      0918.388.998 (Trượng Văn Hải - Làng Nghề)
                    </a>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container text-secondary font-bold">
                  Hỗ trợ 24/7
                </span>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center gap-3">
              <button
                onClick={() => onOrderProduct(product)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all text-center shadow-xs cursor-pointer"
                type="button"
              >
                Thỉnh Tác Phẩm / Đặt Chế Tác
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-all cursor-pointer"
                type="button"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
