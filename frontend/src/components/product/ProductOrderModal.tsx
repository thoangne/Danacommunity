import { useState } from "react";
import { X, Check } from "lucide-react";
import { toast } from "../ui/sonner";
import type { CraftProduct } from "../../data/productData";
import type { ProductOrderFormData } from "./types";

interface ProductOrderModalProps {
  product: CraftProduct;
  initialRequestType?: string;
  onClose: () => void;
}

export default function ProductOrderModal({
  product,
  initialRequestType = "Tư vấn tác phẩm độc bản",
  onClose,
}: ProductOrderModalProps) {
  const [orderForm, setOrderForm] = useState<ProductOrderFormData>({
    fullName: "",
    phone: "",
    email: "",
    requestType: initialRequestType,
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.fullName.trim() || !orderForm.phone.trim()) {
      toast.error("Vui lòng nhập họ tên và số điện thoại liên hệ!");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Gửi yêu cầu thỉnh tác phẩm thành công!", {
        description: `Ban quản lý làng nghề & nghệ nhân sẽ liên hệ với bạn trong vòng 24 giờ qua số ${orderForm.phone}.`,
      });
      onClose();
    }, 800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-surface rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/40 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container-highest text-on-surface hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-xs cursor-pointer"
          type="button"
          aria-label="Đóng biểu mẫu"
        >
          <X className="w-4 h-4" />
        </button>

        <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-primary block mb-1">
          Kết Nối Nghệ Nhân Bản Địa
        </span>
        <h3 className="font-serif text-xl font-bold text-on-surface">
          Thỉnh Tác Phẩm Thủ Công
        </h3>
        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
          Bạn đang quan tâm đến:{" "}
          <span className="font-bold text-on-surface">
            {product.name}
          </span>{" "}
          ({product.artisanName} - {product.village}).
        </p>

        <form onSubmit={handleSubmitOrder} className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1">
              Họ và tên của bạn <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={orderForm.fullName}
              onChange={(e) =>
                setOrderForm({ ...orderForm, fullName: e.target.value })
              }
              placeholder="Ví dụ: Nguyễn Văn A"
              className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-on-surface block mb-1">
                Số điện thoại <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                required
                value={orderForm.phone}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, phone: e.target.value })
                }
                placeholder="09xx xxx xxx"
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-on-surface block mb-1">
                Email (Tùy chọn)
              </label>
              <input
                type="email"
                value={orderForm.email}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, email: e.target.value })
                }
                placeholder="name@example.com"
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1">
              Nhu cầu của bạn
            </label>
            <select
              value={orderForm.requestType}
              onChange={(e) =>
                setOrderForm({ ...orderForm, requestType: e.target.value })
              }
              className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface cursor-pointer"
            >
              <option value="Tư vấn tác phẩm độc bản">Tư vấn tác phẩm độc bản</option>
              <option value="Thỉnh tác phẩm có sẵn">Thỉnh tác phẩm hiện hữu</option>
              <option value="Đặt chế tác độc bản theo yêu cầu">
                Đặt chế tác theo kích thước riêng
              </option>
              <option value="Hẹn lịch ghé thăm xưởng nghệ nhân">
                Hẹn lịch ghé thăm xưởng trải nghiệm
              </option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1">
              Ghi chú hoặc câu hỏi cho nghệ nhân
            </label>
            <textarea
              rows={3}
              value={orderForm.notes}
              onChange={(e) =>
                setOrderForm({ ...orderForm, notes: e.target.value })
              }
              placeholder="Ghi chú kích thước mong muốn, ngày dự kiến ghé thăm hoặc địa chỉ nhận tác phẩm..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface resize-none"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Đang gửi thông tin...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Xác nhận gửi yêu cầu</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-all cursor-pointer"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
