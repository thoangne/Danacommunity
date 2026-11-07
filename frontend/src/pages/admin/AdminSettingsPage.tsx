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
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"site" | "seo" | "social">("site");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Site Info
  const [siteName, setSiteName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");

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
            setSiteName(s.site_info.siteName || "");
            setTagline(s.site_info.tagline || "");
            setDescription(s.site_info.description || "");
            setContactEmail(s.site_info.contactEmail || "");
            setContactPhone(s.site_info.contactPhone || "");
            setAddress(s.site_info.address || "");
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
      let payload: Record<string, string> = {};

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
        toast.success("Cập nhật cài đặt hệ thống thành công!");
      } else {
        toast.error(data.message || "Cập nhật thất bại.");
      }
    } catch {
      toast.error("Lỗi kết nối máy chủ khi lưu cài đặt.");
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
              Thiết lập thông tin thương hiệu, siêu dữ liệu SEO toàn trang và kênh kết nối mạng xã hội.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-stone-200 bg-white px-6 pt-3 rounded-t-2xl">
          <button
            type="button"
            onClick={() => setActiveTab("site")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "site"
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
            className={`pb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "seo"
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
            className={`pb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "social"
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
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#8F4E00]" />
              <span className="text-xs text-stone-500 font-serif">Đang nạp cấu hình hệ thống...</span>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
              {/* TAB 1: SITE INFO */}
              {activeTab === "site" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Tên cổng thông tin di sản (Site Title)
                    </label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Khẩu hiệu di sản (Tagline)
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Mô tả sứ mệnh văn hóa
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] resize-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Email liên hệ chính thức
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2 border border-stone-200 rounded-xl">
                        <Mail className="w-4 h-4 text-stone-400" />
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full text-xs text-stone-800 focus:outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Hotline hỗ trợ du khách
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2 border border-stone-200 rounded-xl">
                        <Phone className="w-4 h-4 text-stone-400" />
                        <input
                          type="text"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full text-xs text-stone-800 focus:outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Địa chỉ thực địa trung tâm
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 border border-stone-200 rounded-xl">
                      <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full text-xs text-stone-800 focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SEO DEFAULTS */}
              {activeTab === "seo" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Tiêu đề SEO mặc định (Meta Title)
                    </label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
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
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Từ khóa tìm kiếm (Keywords)
                    </label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Ảnh chia sẻ mạng xã hội mặc định (OG Image URL)
                    </label>
                    <input
                      type="url"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                    {ogImage && (
                      <div className="mt-2 rounded-xl overflow-hidden aspect-video max-w-sm border border-stone-200 bg-stone-100">
                        <img src={ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: SOCIAL LINKS */}
              {activeTab === "social" && (
                <div className="space-y-4">
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

              {/* Save Button */}
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
      </div>
    </AdminLayout>
  );
}
