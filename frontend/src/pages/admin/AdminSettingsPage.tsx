import { useState, useEffect } from "react";
import {
  Globe,
  Share2,
  Save,
  Building,
  Mail,
  Phone,
  MapPin,
  Loader2,
  SlidersHorizontal,
  Plus,
  Trash2,
  Edit,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";
import MediaPickerModal from "../../components/admin/MediaPickerModal";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export interface CarouselSlideItem {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
}

const DEFAULT_SITE_INFO = {
  siteName: "Dana Community Tourism",
  tagline: "Bảo tồn & phát huy giá trị di sản văn hóa Champa",
  description:
    "Cổng thông tin chuyên sâu về khảo cứu lịch sử, kiến trúc đền tháp Kalan, làng nghề gốm cổ Bàu Trúc, dệt thổ cẩm Mỹ Nghiệp và du lịch di sản cộng đồng Chăm.",
  contactEmail: "admin@danacommunity.vn",
  contactPhone: "0976 029 004",
  address: "Thôn Chất Thường, Xã Phước Hậu, Huyện Ninh Phước, Tỉnh Ninh Thuận",
};

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"site" | "seo" | "social" | "carousel">("site");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Site Info
  const [siteName, setSiteName] = useState(DEFAULT_SITE_INFO.siteName);
  const [tagline, setTagline] = useState(DEFAULT_SITE_INFO.tagline);
  const [description, setDescription] = useState(DEFAULT_SITE_INFO.description);
  const [contactEmail, setContactEmail] = useState(DEFAULT_SITE_INFO.contactEmail);
  const [contactPhone, setContactPhone] = useState(DEFAULT_SITE_INFO.contactPhone);
  const [address, setAddress] = useState(DEFAULT_SITE_INFO.address);

  // 2. SEO Defaults
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [ogImage, setOgImage] = useState("");

  // 3. Social Links
  const [facebook, setFacebook] = useState("");
  const [youtube, setYoutube] = useState("");
  const [zalo, setZalo] = useState("");
  const [instagram, setInstagram] = useState("");

  // 4. Carousel Slides
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlideItem[]>([]);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlideItem | null>(null);
  const [slideTitle, setSlideTitle] = useState("");
  const [slideSubtitle, setSlideSubtitle] = useState("");
  const [slideImage, setSlideImage] = useState("");
  const [slideLink, setSlideLink] = useState("");
  const [slideOrder, setSlideOrder] = useState(1);
  const [slideIsActive, setSlideIsActive] = useState(true);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/settings`, {
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        });
        const data = await res.json();
        if (data.success && data.data) {
          const s = data.data;
          if (s.site_info) {
            const isPlaceholder = s.site_info.contactEmail === "contact@champaweb.vn" || (s.site_info.siteName && s.site_info.siteName.includes("ChampaWeb"));
            setSiteName(isPlaceholder ? DEFAULT_SITE_INFO.siteName : (s.site_info.siteName || DEFAULT_SITE_INFO.siteName));
            setTagline(isPlaceholder ? DEFAULT_SITE_INFO.tagline : (s.site_info.tagline || DEFAULT_SITE_INFO.tagline));
            setDescription(isPlaceholder ? DEFAULT_SITE_INFO.description : (s.site_info.description || DEFAULT_SITE_INFO.description));
            setContactEmail(isPlaceholder ? DEFAULT_SITE_INFO.contactEmail : (s.site_info.contactEmail || DEFAULT_SITE_INFO.contactEmail));
            setContactPhone(isPlaceholder ? DEFAULT_SITE_INFO.contactPhone : (s.site_info.contactPhone || DEFAULT_SITE_INFO.contactPhone));
            setAddress(isPlaceholder ? DEFAULT_SITE_INFO.address : (s.site_info.address || DEFAULT_SITE_INFO.address));
          }
          if (s.seo_defaults) {
            setMetaTitle(s.seo_defaults.metaTitle || "");
            setMetaDescription(s.seo_defaults.metaDescription || "");
            setKeywords(s.seo_defaults.keywords || "");
            setOgImage(s.seo_defaults.ogImage || "");
          }
          if (s.social_links) {
            setFacebook(s.social_links.facebook || "");
            setYoutube(s.social_links.youtube || "");
            setZalo(s.social_links.zalo || "");
            setInstagram(s.social_links.instagram || "");
          }
          if (Array.isArray(s.home_carousel)) {
            setCarouselSlides(
              [...s.home_carousel].sort((a, b) => (a.order || 0) - (b.order || 0))
            );
          }
        }
      } catch (err) {
        console.error("Lỗi tải cài đặt:", err);
        toast.error("Không thể nạp cài đặt hệ thống.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let key = "site_info";
      let payload: Record<string, string> | CarouselSlideItem[] = {};

      if (activeTab === "site") {
        key = "site_info";
        payload = {
          siteName,
          tagline,
          description,
          contactEmail,
          contactPhone,
          address,
        };
      } else if (activeTab === "seo") {
        key = "seo_defaults";
        payload = {
          metaTitle,
          metaDescription,
          keywords,
          ogImage,
        };
      } else if (activeTab === "social") {
        key = "social_links";
        payload = {
          facebook,
          youtube,
          zalo,
          instagram,
        };
      } else if (activeTab === "carousel") {
        key = "home_carousel";
        payload = carouselSlides;
      }

      const res = await fetch(`${API_BASE}/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ key, value: payload }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Cập nhật cài đặt thành công!");
      } else {
        toast.error(data.message || "Cập nhật thất bại.");
      }
    } catch {
      toast.error("Lỗi kết nối máy chủ khi lưu cài đặt.");
    } finally {
      setIsSaving(false);
    }
  };

  // Carousel Slide Handlers
  const openCreateSlideModal = () => {
    setEditingSlide(null);
    setSlideTitle("");
    setSlideSubtitle("");
    setSlideImage("");
    setSlideLink("");
    setSlideOrder(carouselSlides.length + 1);
    setSlideIsActive(true);
    setIsSlideModalOpen(true);
  };

  const openEditSlideModal = (slide: CarouselSlideItem) => {
    setEditingSlide(slide);
    setSlideTitle(slide.title);
    setSlideSubtitle(slide.subtitle || "");
    setSlideImage(slide.image);
    setSlideLink(slide.link || "");
    setSlideOrder(slide.order || 1);
    setSlideIsActive(slide.isActive !== false);
    setIsSlideModalOpen(true);
  };

  const handleSaveSlideModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideTitle.trim() || !slideImage.trim()) {
      toast.error("Vui lòng điền tiêu đề và hình ảnh cho slide!");
      return;
    }

    if (editingSlide) {
      setCarouselSlides((prev) =>
        prev
          .map((item) =>
            item.id === editingSlide.id
              ? {
                ...item,
                title: slideTitle.trim(),
                subtitle: slideSubtitle.trim(),
                image: slideImage.trim(),
                link: slideLink.trim(),
                order: Number(slideOrder) || 1,
                isActive: slideIsActive,
              }
              : item
          )
          .sort((a, b) => (a.order || 0) - (b.order || 0))
      );
      toast.success("Đã cập nhật slide! Đừng quên nhấn 'Lưu cấu hình Carousel'.");
    } else {
      const newSlide: CarouselSlideItem = {
        id: Date.now(),
        title: slideTitle.trim(),
        subtitle: slideSubtitle.trim(),
        image: slideImage.trim(),
        link: slideLink.trim(),
        order: Number(slideOrder) || carouselSlides.length + 1,
        isActive: slideIsActive,
      };
      setCarouselSlides((prev) =>
        [...prev, newSlide].sort((a, b) => (a.order || 0) - (b.order || 0))
      );
      toast.success("Đã thêm slide mới! Đừng quên nhấn 'Lưu cấu hình Carousel'.");
    }
    setIsSlideModalOpen(false);
  };

  const handleToggleSlideActive = (slideId: number) => {
    setCarouselSlides((prev) =>
      prev.map((item) =>
        item.id === slideId ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === carouselSlides.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newSlides = [...carouselSlides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    // Cập nhật lại thứ tự
    const reordered = newSlides.map((slide, idx) => ({
      ...slide,
      order: idx + 1,
    }));
    setCarouselSlides(reordered);
  };

  const handleDeleteSlide = (slideId: number, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa slide "${title}" không?`)) {
      return;
    }
    setCarouselSlides((prev) => prev.filter((item) => item.id !== slideId));
    toast.info("Đã xóa slide khỏi danh sách. Nhấn 'Lưu cấu hình Carousel' để áp dụng.");
  };

  const handleSaveCarouselDirect = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ key: "home_carousel", value: carouselSlides }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Đã lưu cấu hình Carousel trang chủ thành công!");
      } else {
        toast.error(data.message || "Lưu Carousel thất bại.");
      }
    } catch {
      toast.error("Lỗi kết nối máy chủ khi lưu Carousel.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs">
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              Cài đặt Hệ thống & Cấu hình Website
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Tùy biến Carousel trang chủ, thông tin thương hiệu, SEO toàn trang và mạng xã hội.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-stone-200 bg-white px-6 pt-3 rounded-t-2xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("carousel")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${activeTab === "carousel"
              ? "border-[#8F4E00] text-[#8F4E00]"
              : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Carousel Trang Chủ ({carouselSlides.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("site")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${activeTab === "site"
              ? "border-[#8F4E00] text-[#8F4E00]"
              : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
          >
            <Building className="w-4 h-4" />
            <span>Thông tin Website</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("seo")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${activeTab === "seo"
              ? "border-[#8F4E00] text-[#8F4E00]"
              : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
          >
            <Globe className="w-4 h-4" />
            <span>Cấu hình SEO Mặc định</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("social")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${activeTab === "social"
              ? "border-[#8F4E00] text-[#8F4E00]"
              : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Kênh Mạng Xã Hội</span>
          </button>
        </div>

        {/* Settings Body */}
        <div className="bg-white rounded-b-2xl border border-stone-200 shadow-2xs p-6 -mt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-stone-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#8F4E00]" />
              <span className="text-xs font-medium">Đang tải cấu hình hệ thống...</span>
            </div>
          ) : activeTab === "carousel" ? (
            /* TAB: CAROUSEL TRANG CHỦ */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <h2 className="font-serif text-lg font-bold text-stone-900">
                    Banner & Carousel Đầu Trang Chủ
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Tùy biến hình ảnh chất lượng cao, tiêu đề di sản, thứ tự hiển thị và liên kết khi người dùng nhấp vào.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openCreateSlideModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm slide mới</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCarouselDirect}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8F4E00] hover:bg-[#8F4E00]/90 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Lưu cấu hình Carousel</span>
                  </button>
                </div>
              </div>

              {carouselSlides.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  Chưa có slide nào. Hãy bấm "Thêm slide mới" để bắt đầu.
                </div>
              ) : (
                <div className="space-y-3">
                  {carouselSlides.map((slide, idx) => (
                    <div
                      key={slide.id}
                      className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${slide.isActive
                        ? "bg-[#FAF9F6] border-stone-200 hover:border-[#8F4E00]/50"
                        : "bg-stone-50/70 border-stone-200 opacity-60"
                        }`}
                    >
                      {/* Left: Reorder buttons & Thumbnail */}
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveSlide(idx, "up")}
                            className="p-1 rounded hover:bg-stone-200 text-stone-500 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Di chuyển lên"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === carouselSlides.length - 1}
                            onClick={() => handleMoveSlide(idx, "down")}
                            className="p-1 rounded hover:bg-stone-200 text-stone-500 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Di chuyển xuống"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs font-mono font-bold text-stone-400 w-6 text-center">
                          #{idx + 1}
                        </span>

                        <div className="w-24 h-16 rounded-lg overflow-hidden bg-stone-200 shrink-0 border border-stone-300">
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=300&q=80";
                            }}
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-serif text-sm font-bold text-stone-900 truncate">
                            {slide.title}
                          </h3>
                          {slide.subtitle && (
                            <p className="text-xs text-stone-500 truncate mt-0.5">
                              {slide.subtitle}
                            </p>
                          )}
                          {slide.link && (
                            <p className="text-[11px] text-[#8F4E00] flex items-center gap-1 mt-0.5 truncate font-mono">
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              <span>{slide.link}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleSlideActive(slide.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${slide.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                            }`}
                          title={slide.isActive ? "Đang hiển thị - Bấm để ẩn" : "Đang ẩn - Bấm để hiện"}
                        >
                          {slide.isActive ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Hiển thị</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Đã ẩn</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditSlideModal(slide)}
                          className="p-1.5 rounded-lg border border-stone-200 hover:border-[#8F4E00] text-stone-600 hover:text-[#8F4E00] bg-white transition-colors cursor-pointer"
                          title="Chỉnh sửa slide"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSlide(slide.id, slide.title)}
                          className="p-1.5 rounded-lg border border-stone-200 hover:border-red-400 text-stone-400 hover:text-red-600 bg-white transition-colors cursor-pointer"
                          title="Xóa slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* TAB: SITE / SEO / SOCIAL FORMS */
            <form onSubmit={handleSave} className="space-y-6">
              {/* 1. THÔNG TIN WEBSITE */}
              {activeTab === "site" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Tên nền tảng (Site Name) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      placeholder="Dana Community"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Khẩu hiệu (Tagline)
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="Bảo tồn & phát huy giá trị di sản văn hóa Champa"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Mô tả giới thiệu chung (Meta Description gốc)
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Cổng thông tin chuyên sâu về khảo cứu lịch sử, kiến trúc đền tháp Kalan, làng nghề gốm cổ Bàu Trúc, dệt thổ cẩm Mỹ Nghiệp và du lịch di sản cộng đồng Chăm."
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      <span>Email liên hệ</span>
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="admin@danacommunity.vn"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>Số điện thoại / Hotline</span>
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="0976 029 004"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>Địa chỉ trụ sở / Trạm di sản</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Thôn Chất Thường, Xã Phước Hậu, Huyện Ninh Phước, Tỉnh Ninh Thuận"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>
                </div>
              )}

              {/* 2. CẤU HÌNH SEO MẶC ĐỊNH */}
              {activeTab === "seo" && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Tiêu đề trang mặc định (Meta Title)
                    </label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="Dana Community | Di sản & Văn hóa Champa"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Mô tả SEO mặc định (Meta Description)
                    </label>
                    <textarea
                      rows={3}
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Khám phá chiều sâu văn hóa Champa qua khảo cứu lịch sử, đền tháp Kalan và du lịch di sản cộng đồng..."
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Từ khóa tìm kiếm (Keywords, phân cách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="Champa, Panduranga, Tháp Chàm, Gốm Bàu Trúc, Dệt Mỹ Nghiệp..."
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Ảnh đại diện chia sẻ mạng xã hội (OpenGraph Image URL)
                    </label>
                    <input
                      type="url"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>
                </div>
              )}

              {/* 3. KÊNH MẠNG XÃ HỘI */}
              {activeTab === "social" && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Facebook Fanpage
                    </label>
                    <input
                      type="url"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Kênh YouTube Di sản
                    </label>
                    <input
                      type="url"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      placeholder="https://youtube.com/@..."
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Zalo Official Account
                    </label>
                    <input
                      type="url"
                      value={zalo}
                      onChange={(e) => setZalo(e.target.value)}
                      placeholder="https://zalo.me/..."
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>
                </div>
              )}

              {/* Save Button for Site/SEO/Social */}
              <div className="pt-4 border-t border-stone-200 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8F4E00] hover:bg-[#8F4E00]/90 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isSaving ? "Đang lưu cấu hình..." : "Lưu thay đổi cài đặt"}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Slide Create / Edit Modal */}
        {isSlideModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#FAF9F6]">
                <h3 className="font-serif text-base font-bold text-stone-900">
                  {editingSlide ? "Chỉnh sửa Slide Carousel" : "Thêm Slide Mới"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveSlideModal} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tiêu đề Slide <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={slideTitle}
                    onChange={(e) => setSlideTitle(e.target.value)}
                    placeholder="Ví dụ: Tháp Cổ Po Klong Garai - Đỉnh Cao Nghệ Thuật Champa"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mô tả phụ / Khẩu hiệu
                  </label>
                  <input
                    type="text"
                    value={slideSubtitle}
                    onChange={(e) => setSlideSubtitle(e.target.value)}
                    placeholder="Ví dụ: Kalan ngàn năm trên đồi Trầu - Đô thành Panduranga"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Hình ảnh Slide (URL) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={slideImage}
                      onChange={(e) => setSlideImage(e.target.value)}
                      placeholder="https://... hoặc /images/dana-life/..."
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors shrink-0 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Thư viện Media</span>
                    </button>
                  </div>

                  {slideImage && (
                    <div className="mt-2 w-full h-32 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                      <img
                        src={slideImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Đường dẫn liên kết (Link)
                    </label>
                    <input
                      type="text"
                      value={slideLink}
                      onChange={(e) => setSlideLink(e.target.value)}
                      placeholder="/kham-pha/thap-po-klong-garai"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Thứ tự hiển thị
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={slideOrder}
                      onChange={(e) => setSlideOrder(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="slideActiveCheck"
                    checked={slideIsActive}
                    onChange={(e) => setSlideIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8F4E00] focus:ring-[#8F4E00] border-stone-300"
                  />
                  <label htmlFor="slideActiveCheck" className="text-xs font-medium text-stone-700 cursor-pointer">
                    Kích hoạt hiển thị slide này trên trang chủ
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsSlideModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#8F4E00] hover:bg-[#8F4E00]/90 text-white cursor-pointer shadow-xs"
                  >
                    {editingSlide ? "Cập nhật Slide" : "Thêm vào danh sách"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Media Picker Modal */}
        <MediaPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={(url) => {
            setSlideImage(url);
            setIsMediaPickerOpen(false);
          }}
          title="Chọn hình ảnh cho Carousel Trang Chủ"
        />
      </div>
    </AdminLayout>
  );
}
