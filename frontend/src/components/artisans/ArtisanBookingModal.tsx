import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { toast } from "../ui/sonner";
import type { Artisan } from "../../types/heritage";
import type { BookingFormData } from "./types";

interface ArtisanBookingModalProps {
  artisan: Artisan;
  initialExperienceType?: string;
  onClose: () => void;
}

const DEFAULT_EXPERIENCES = [
  { value: "Tham quan & Trải nghiệm thực tế", label: "Tham quan & Trải nghiệm" },
  { value: "Học nghề chuyên sâu", label: "Học nghề cùng nghệ nhân" },
  { value: "Đặt chế tác tác phẩm riêng", label: "Trao đổi đặt chế tác riêng" },
];

export default function ArtisanBookingModal({
  artisan,
  initialExperienceType = "Tham quan & Trải nghiệm thực tế",
  onClose,
}: ArtisanBookingModalProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    phone: "",
    visitDate: "",
    guestsCount: "2 người",
    experienceType: initialExperienceType,
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Vui lòng điền họ tên và số điện thoại liên hệ!");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Đăng ký lịch hẹn thành công!", {
        description: `Đã kết nối lịch hẹn với ${artisan.name} tại ${artisan.village}. Đại diện văn hóa sẽ xác nhận qua số ${formData.phone}.`,
      });
      onClose();
    }, 700);
  };

  const isCustomExperience =
    Boolean(formData.experienceType) &&
    !DEFAULT_EXPERIENCES.some((exp) => exp.value === formData.experienceType);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-surface rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/40 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container-highest text-on-surface hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-xs"
          type="button"
          aria-label="Đóng cửa sổ"
        >
          <X className="w-4 h-4" />
        </button>

        <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-secondary block mb-1">
          Gặp Gỡ Nghệ Nhân Bản Địa
        </span>
        <h3 className="font-serif text-xl font-bold text-on-surface">
          Đặt Hẹn Ghé Thăm Xưởng
        </h3>
        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
          Bạn đang lên lịch gặp gỡ{" "}
          <span className="font-bold text-on-surface">{artisan.name}</span> tại{" "}
          {artisan.village}.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1">
              Họ và tên của bạn <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Ví dụ: Trần Thị Mai"
              className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-on-surface block mb-1">
                Số điện thoại liên hệ <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="09xx xxx xxx"
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-on-surface block mb-1">
                Ngày dự kiến ghé thăm
              </label>
              <input
                type="date"
                value={formData.visitDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, visitDate: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-on-surface block mb-1">
                Số lượng khách
              </label>
              <select
                value={formData.guestsCount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    guestsCount: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface"
              >
                <option value="1 người">1 người (Cá nhân)</option>
                <option value="2 người">2 người (Cặp đôi/Bạn bè)</option>
                <option value="3 - 5 người">3 - 5 người (Gia đình)</option>
                <option value="Đoàn trên 6 người">Đoàn trên 6 người</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-on-surface block mb-1">
                Loại hình trải nghiệm
              </label>
              <select
                value={formData.experienceType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    experienceType: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface"
              >
                {isCustomExperience && (
                  <option value={formData.experienceType}>
                    {formData.experienceType}
                  </option>
                )}
                {DEFAULT_EXPERIENCES.map((exp) => (
                  <option key={exp.value} value={exp.value}>
                    {exp.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1">
              Yêu cầu đặc biệt
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Ví dụ: Cần người phiên dịch, kết hợp ăn trưa canh Um Bơk..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface resize-none"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Đang xác nhận...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Xác nhận đặt lịch hẹn</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-all"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
