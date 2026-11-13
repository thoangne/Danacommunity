import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Loader2, Sparkles, Compass, ShieldCheck } from "lucide-react";
import { LOGO_URL } from "../data/champaData";
import { toast } from "./ui/sonner";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface SiteInfo {
  siteName: string;
  tagline: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

interface SocialLinks {
  facebook?: string;
  youtube?: string;
  zalo?: string;
  instagram?: string;
}

const DEFAULT_SITE_INFO: SiteInfo = {
  siteName: "Dana Community",
  tagline: "Bảo tồn & phát huy giá trị di sản văn hóa Champa",
  description:
    "Cổng thông tin chuyên sâu về khảo cứu lịch sử, kiến trúc đền tháp Kalan, làng nghề gốm cổ Bàu Trúc, dệt thổ cẩm Mỹ Nghiệp và du lịch di sản cộng đồng Chăm.",
  contactEmail: "admin@danacommunity.vn",
  contactPhone: "0976 029 004",
  address: "Thôn Chất Thường, Xã Phước Hậu, Huyện Ninh Phước, Tỉnh Ninh Thuận",
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(DEFAULT_SITE_INFO);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook: "https://www.facebook.com/profile.php?id=100063464976505",
  });

  // Tải cấu hình thông tin liên hệ và mạng xã hội mới nhất từ CMS
  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/settings/public`);
        const data = await res.json();
        if (isMounted && data.success && data.data) {
          if (data.data.site_info) {
            setSiteInfo((prev) => ({
              ...prev,
              siteName: data.data.site_info.siteName || prev.siteName,
              tagline: data.data.site_info.tagline || prev.tagline,
              description: data.data.site_info.description || prev.description,
              contactEmail: data.data.site_info.contactEmail || prev.contactEmail,
              contactPhone: data.data.site_info.contactPhone || prev.contactPhone,
              address: data.data.site_info.address || prev.address,
            }));
          }
          if (data.data.social_links) {
            setSocialLinks(data.data.social_links);
          }
        }
      } catch {
        // Dự phòng dữ liệu mặc định
      }
    };

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "footer_newsletter" }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Đăng ký nhận bản tin thành công!", {
          description: `Bản tin chuyên đề văn hóa Panduranga định kỳ sẽ được gửi tới: ${email}`,
        });
        setEmail("");
      } else {
        toast.error(data.message || "Không thể đăng ký nhận bản tin. Vui lòng thử lại.");
      }
    } catch {
      toast.error("Lỗi kết nối máy chủ. Vui lòng kiểm tra lại đường truyền.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-surface-container-low text-on-surface border-t border-surface-container-high/60 shadow-[0_-2px_12px_rgba(36,25,21,0.03)] pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin pt-space-xl pb-space-lg">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter mb-space-xl">
          {/* Column 1: Brand & Commitment */}
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm">
              <img
                src={LOGO_URL}
                alt="Logo Dana Community"
                className="h-10 w-auto object-contain shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-primary leading-tight">
                  Dana Community
                </span>
                <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary font-semibold">
                  Panduranga Living Heritage
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-secondary font-medium">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{siteInfo.tagline}</span>
            </div>
          </div>

          {/* Column 2: Journeys */}
          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <h4 className="font-serif text-base sm:text-lg font-bold text-on-surface flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-primary" />
              <span>Hành Trình</span>
            </h4>
            <ul className="flex flex-col gap-1.5">
              {[
                { label: "Tất cả Tour Di sản", href: "/tour" },
                { label: "Khảo Cổ & Làng Nghề 1 Ngày", href: "/tour/dana-tour" },
                { label: "Bình minh Tháp Po Klong Garai", href: "/tour" },
                { label: "Lò gốm Bàu Trúc cổ truyền", href: "/tour" },
                { label: "Thổ cẩm sắc hoa Mỹ Nghiệp", href: "/tour" },
                { label: "Đồi cát & Đền Tháp Po Rome", href: "/tour" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="font-body-sm text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Topics & Digital Modules */}
          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <h4 className="font-serif text-base sm:text-lg font-bold text-on-surface flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-secondary" />
              <span>Kho Tàng Di Sản</span>
            </h4>
            <ul className="flex flex-col gap-1.5">
              {[
                { label: "Tác phẩm Làng nghề", href: "/san-pham" },
                { label: "Chân dung Nghệ nhân", href: "/nghe-nhan" },
                { label: "Khảo cứu Lịch sử", href: "/bai-viet?category=lich-su" },
                { label: "Văn hóa & Đền tháp", href: "/bai-viet?category=van-hoa" },
                { label: "Tin tức & Sự kiện", href: "/bai-viet?category=tin-tuc" },
                { label: "Thư viện Số hóa Di sản", href: "/so-hoa-di-san" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="font-body-sm text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact */}
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <h4 className="font-serif text-base sm:text-lg font-bold text-on-surface">
                Bản tin Văn hóa Panduranga
              </h4>
              <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Nhận tin khảo cứu chuyên sâu về nghi lễ, câu chuyện làng nghề và lịch biểu diễn nghệ thuật dân gian Chăm hàng tháng.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex items-center gap-space-xs">
              <input
                className="flex-1 px-3.5 py-2 sm:py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-xs sm:text-sm placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-xs border border-outline-variant/30"
                placeholder="Nhập email của bạn..."
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="px-3.5 py-2 sm:py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs uppercase tracking-wider transition-colors font-semibold shrink-0 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isSubmitting ? "Gửi..." : "Đăng ký"}</span>
              </button>
            </form>

            <div className="flex flex-col gap-2 pt-space-xs border-t border-surface-container/60 text-xs">
              <span className="font-label-md text-secondary font-bold uppercase tracking-wider text-[11px]">
                Không gian kết nối Panduranga:
              </span>
              <p className="font-body-sm text-on-surface-variant flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{siteInfo.address}</span>
              </p>
              <p className="font-body-sm text-on-surface-variant flex items-center gap-2">
                <Phone className="h-4 w-4 text-secondary shrink-0" />
                <span>
                  Hotline:{" "}
                  <a
                    href={`tel:${siteInfo.contactPhone.replace(/\s+/g, "")}`}
                    className="hover:text-primary transition-colors font-semibold text-on-surface"
                  >
                    {siteInfo.contactPhone}
                  </a>
                </span>
              </p>
              <p className="font-body-sm text-on-surface-variant flex items-center gap-2">
                <Mail className="h-4 w-4 text-secondary shrink-0" />
                <span>
                  Email:{" "}
                  <a
                    href={`mailto:${siteInfo.contactEmail}`}
                    className="hover:text-primary transition-colors font-medium"
                  >
                    {siteInfo.contactEmail}
                  </a>
                </span>
              </p>
              {socialLinks.facebook && (
                <p className="font-body-sm text-on-surface-variant flex items-center gap-2">
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group"
                  >
                    <svg
                      className="h-4 w-4 text-secondary group-hover:text-primary transition-colors shrink-0 fill-current"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>
                      Cộng đồng:{" "}
                      <span className="font-medium text-on-surface group-hover:text-primary transition-colors underline decoration-transparent group-hover:decoration-primary underline-offset-2">
                        Fanpage Dana Heritage
                      </span>
                    </span>
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sub-footer / Copyright */}
        <div className="pt-space-md flex flex-col md:flex-row items-center justify-between gap-space-sm border-t border-surface-container-high/60 text-xs text-on-surface-variant">
          <div>
            <span>© {currentYear} {siteInfo.siteName}. Bảo lưu mọi quyền di sản cộng đồng.</span>
          </div>
          <div className="flex flex-wrap items-center gap-space-sm sm:gap-space-md font-label-md text-[11px] sm:text-xs">
            <span className="hover:text-primary transition-colors cursor-pointer">
              Quy tắc Ứng xử Di sản
            </span>
            <span>•</span>
            <span className="hover:text-primary transition-colors cursor-pointer">
              Bảo tồn Làng nghề
            </span>
            <span>•</span>
            <Link to="/admin" className="hover:text-primary text-stone-400 transition-colors">
              Cổng Quản Trị CMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
