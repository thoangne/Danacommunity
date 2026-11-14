import { useState, useEffect } from "react";
import {
  Sliders,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  CheckCircle2,
  Eye,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Layers,
  MapPin,
  Calendar,
  Sparkles,
  Camera,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";
import MediaPickerModal from "../../components/admin/MediaPickerModal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface HeroBannerItem {
  id: number;
  title: string;
  subtitle?: string | null;
  category: string;
  image_url: string;
  location?: string | null;
  date_display?: string | null;
  description?: string | null;
  author?: string | null;
  link_url?: string | null;
  display_order: number;
  is_active: boolean;
  position: string;
  created_at?: string;
  updated_at?: string;
}

const CATEGORY_SUGGESTIONS = [
  "Kiến Trúc Đền Tháp Kỳ Vĩ",
  "Di Sản Văn Hóa Nhân Loại UNESCO",
  "Nghệ Thuật Sợi Dệt Cung Đình",
  "Thánh Địa Huyền Bí",
  "Cảnh Sắc Bản Địa Thơ Mộng",
  "Lễ Hội Truyền Thống",
  "Nghệ Thuật Diễn Xướng Dân Gian",
];

export default function AdminBannersPage() {
  const { token, user: currentActor } = useAuth();
  const isAdmin = currentActor?.role === "admin" || currentActor?.role === "super_admin";

  const [banners, setBanners] = useState<HeroBannerItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Edit / Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBannerItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preview Modal
  const [previewBanner, setPreviewBanner] = useState<HeroBannerItem | null>(null);

  // Media Picker state
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    category: "Kiến Trúc Đền Tháp Kỳ Vĩ",
    image_url: "",
    location: "",
    date_display: "",
    description: "",
    author: "",
    link_url: "",
    display_order: 1,
    is_active: true,
  });

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        isActive: statusFilter === "active" ? "true" : statusFilter === "inactive" ? "false" : "all",
        position: "home_hero",
        limit: "100",
      });

      const res = await fetch(`${API_BASE}/admin/banners?${query.toString()}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (data.success) {
        setBanners(data.data || []);
        setTotal(data.pagination?.total || (data.data || []).length);
      } else {
        toast.error(data.message || "Không thể tải danh sách banner");
      }
    } catch {
      toast.error("Lỗi mạng khi tải dữ liệu slide banner");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [search, statusFilter]);

  const handleOpenCreateModal = () => {
    setEditingBanner(null);
    const nextOrder = banners.length > 0 ? Math.max(...banners.map((b) => b.display_order)) + 1 : 1;
    setFormData({
      title: "",
      subtitle: "",
      category: "Kiến Trúc Đền Tháp Kỳ Vĩ",
      image_url:
        "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80",
      location: "",
      date_display: "",
      description: "",
      author: "Điểm đến Di sản",
      link_url: "",
      display_order: nextOrder,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (banner: HeroBannerItem) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      category: banner.category,
      image_url: banner.image_url,
      location: banner.location || "",
      date_display: banner.date_display || "",
      description: banner.description || "",
      author: banner.author || "",
      link_url: banner.link_url || "",
      display_order: banner.display_order,
      is_active: banner.is_active,
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (banner: HeroBannerItem) => {
    // Optimistic UI update
    const previousBanners = [...banners];
    const updatedStatus = !banner.is_active;
    setBanners((prev) =>
      prev.map((b) => (b.id === banner.id ? { ...b, is_active: updatedStatus } : b))
    );

    try {
      const res = await fetch(`${API_BASE}/admin/banners/${banner.id}/status`, {
        method: "PATCH",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        setBanners(previousBanners);
        toast.error(data.message || "Lỗi cập nhật trạng thái");
      }
    } catch {
      setBanners(previousBanners);
      toast.error("Lỗi mạng khi cập nhật trạng thái");
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const newBanners = [...banners];
    const currentItem = newBanners[index];
    const targetItem = newBanners[targetIndex];

    // Swap display_order
    const tempOrder = currentItem.display_order;
    currentItem.display_order = targetItem.display_order;
    targetItem.display_order = tempOrder;

    // Swap in array
    newBanners[index] = targetItem;
    newBanners[targetIndex] = currentItem;
    setBanners(newBanners);

    try {
      const payload = [
        { id: currentItem.id, display_order: currentItem.display_order },
        { id: targetItem.id, display_order: targetItem.display_order },
      ];

      const res = await fetch(`${API_BASE}/admin/banners/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ orders: payload }),
      });

      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "Lỗi sắp xếp lại thứ tự");
        fetchBanners();
      } else {
        toast.success("Đã cập nhật thứ tự trình chiếu!");
      }
    } catch {
      toast.error("Lỗi mạng khi cập nhật thứ tự");
      fetchBanners();
    }
  };

  const handleDelete = async (banner: HeroBannerItem) => {
    if (!isAdmin) {
      toast.error("Chỉ Quản trị viên cấp cao (Admin) mới có quyền xóa slide banner!");
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa slide [${banner.title}] không?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/banners/${banner.id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Đã xóa slide thành công!");
        fetchBanners();
      } else {
        toast.error(data.message || "Lỗi khi xóa slide");
      }
    } catch {
      toast.error("Lỗi mạng khi xóa slide");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề slide!");
      return;
    }
    if (!formData.category.trim()) {
      toast.error("Vui lòng chọn hoặc nhập phân loại slide!");
      return;
    }
    if (!formData.image_url.trim()) {
      toast.error("Vui lòng chọn hoặc nhập đường dẫn ảnh slide!");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingBanner
        ? `${API_BASE}/admin/banners/${editingBanner.id}`
        : `${API_BASE}/admin/banners`;
      const method = editingBanner ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Lưu thông tin slide thành công!");
        setIsModalOpen(false);
        fetchBanners();
      } else {
        toast.error(data.message || "Lỗi khi lưu slide");
      }
    } catch {
      toast.error("Lỗi mạng khi gửi biểu mẫu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCount = banners.filter((b) => b.is_active).length;
  const inactiveCount = banners.filter((b) => !b.is_active).length;

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* ========================================================
            1. HEADER TIÊU ĐỀ & HÀNH ĐỘNG
        ======================================================== */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#DEDAD2] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <Sliders className="w-5 h-5" />
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#241915]">
                Quản trị Hero Carousel & Banners
              </h1>
            </div>
            <p className="text-sm text-[#7D7571]">
              Quản lý các slide trình chiếu ảnh danh thắng & làng nghề Champa Panduranga hiển thị ngay đầu trang chủ.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#DEDAD2] bg-white text-xs font-semibold text-[#5A504B] hover:bg-[#FAF9F6] transition-all shadow-xs"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Xem trang chủ</span>
            </a>

            <button
              onClick={handleOpenCreateModal}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Slide Mới</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            2. THẺ THỐNG KÊ TỔNG QUAN
        ======================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#DEDAD2] shadow-xs">
            <span className="text-xs font-medium text-[#7D7571] uppercase tracking-wider block mb-1">
              Tổng số Slide
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#241915]">{total}</span>
              <span className="text-xs text-[#7D7571]">slide</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs">
            <span className="text-xs font-medium text-emerald-800 uppercase tracking-wider block mb-1">
              Đang Hiển Thị
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700">
                {activeCount}
              </span>
              <span className="text-xs text-emerald-600">trang chủ</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-[#DEDAD2] shadow-xs">
            <span className="text-xs font-medium text-[#7D7571] uppercase tracking-wider block mb-1">
              Đã Ẩn / Bản Nháp
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#7D7571]">
                {inactiveCount}
              </span>
              <span className="text-xs text-[#7D7571]">slide</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-xs">
            <span className="text-xs font-medium text-amber-900 uppercase tracking-wider block mb-1">
              Thời Lượng Chiếu
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-700">4.0s</span>
              <span className="text-xs text-amber-700/80">tự động chuyển</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. BỘ LỌC & TÌM KIẾM
        ======================================================== */}
        <div className="p-4 rounded-2xl bg-white border border-[#DEDAD2] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7D7571]" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, địa danh, phân loại hoặc tác giả..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#DEDAD2] bg-[#FAF9F6] text-[#241915] placeholder-[#7D7571] focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7D7571] whitespace-nowrap">Trạng thái:</span>
            <div className="flex p-0.5 rounded-xl bg-[#FAF9F6] border border-[#DEDAD2]">
              {(["all", "active", "inactive"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setStatusFilter(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    statusFilter === mode
                      ? "bg-white text-primary shadow-xs font-bold"
                      : "text-[#7D7571] hover:text-[#241915]"
                  }`}
                >
                  {mode === "all" ? "Tất cả" : mode === "active" ? "Đang chiếu" : "Đã ẩn"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================
            4. BẢNG DANH SÁCH SLIDE HERO BANNERS
        ======================================================== */}
        <div className="bg-white rounded-2xl border border-[#DEDAD2] shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-xs text-[#7D7571]">Đang nạp danh sách slide banner di sản...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF9F6] border border-[#DEDAD2] flex items-center justify-center text-[#7D7571]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#241915]">Chưa có slide banner nào</h3>
              <p className="text-xs text-[#7D7571] max-w-sm">
                Hãy tạo slide đầu tiên để làm nổi bật vẻ đẹp đền tháp và làng nghề Champa trên trang chủ.
              </p>
              <button
                onClick={handleOpenCreateModal}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm slide ngay</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FAF9F6] text-[#7D7571] uppercase tracking-wider text-[11px] font-bold border-b border-[#DEDAD2]">
                  <tr>
                    <th className="py-3.5 px-4 w-16 text-center">Thứ tự</th>
                    <th className="py-3.5 px-4 w-40">Hình ảnh</th>
                    <th className="py-3.5 px-4">Tiêu đề & Chuyên mục</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Địa danh & Niên đại</th>
                    <th className="py-3.5 px-4 w-32 text-center">Hiển thị</th>
                    <th className="py-3.5 px-4 w-32 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DEDAD2]/70">
                  {banners.map((banner, idx) => (
                    <tr
                      key={banner.id}
                      className="hover:bg-[#FAF9F6]/80 transition-colors group"
                    >
                      {/* Cột Thứ tự & Nút di chuyển */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                            0{idx + 1}
                          </span>
                          <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveOrder(idx, "up")}
                              title="Di chuyển lên trên"
                              className="p-1 rounded hover:bg-white text-[#7D7571] hover:text-primary disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === banners.length - 1}
                              onClick={() => handleMoveOrder(idx, "down")}
                              title="Di chuyển xuống dưới"
                              className="p-1 rounded hover:bg-white text-[#7D7571] hover:text-primary disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Cột Hình ảnh */}
                      <td className="py-4 px-4">
                        <div
                          onClick={() => setPreviewBanner(banner)}
                          className="relative w-32 sm:w-36 h-20 rounded-xl overflow-hidden bg-stone-900 border border-[#DEDAD2] shadow-xs cursor-pointer group/img"
                        >
                          <img
                            src={banner.image_url}
                            alt={banner.title}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye className="w-5 h-5 drop-shadow-md" />
                          </div>
                        </div>
                      </td>

                      {/* Cột Tiêu đề & Chuyên mục */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 max-w-md">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                              {banner.category}
                            </span>
                            {banner.author && (
                              <span className="text-[10px] text-[#7D7571] font-medium bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#DEDAD2]">
                                {banner.author}
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-[#241915] leading-snug">
                            {banner.title}
                          </h4>
                          {banner.subtitle && (
                            <p className="text-xs text-[#7D7571] line-clamp-1 italic">
                              {banner.subtitle}
                            </p>
                          )}
                          {banner.description && (
                            <p className="text-[11px] text-[#7D7571] line-clamp-2 leading-relaxed">
                              {banner.description}
                            </p>
                          )}
                          {banner.link_url && (
                            <div className="pt-0.5">
                              <span className="text-[10px] font-mono text-secondary hover:underline inline-flex items-center gap-1">
                                <span>Link:</span> {banner.link_url}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Cột Địa danh & Niên đại */}
                      <td className="py-4 px-4 hidden md:table-cell text-xs text-[#5A504B]">
                        <div className="space-y-1">
                          {banner.location && (
                            <div className="flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{banner.location}</span>
                            </div>
                          )}
                          {banner.date_display && (
                            <div className="flex items-center gap-1.5 text-[#7D7571]">
                              <Calendar className="w-3.5 h-3.5 text-secondary shrink-0" />
                              <span>{banner.date_display}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Cột Công tắc Bật / Tắt */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(banner)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            banner.is_active
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                              : "bg-stone-100 text-[#7D7571] border border-[#DEDAD2] hover:bg-stone-200"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              banner.is_active ? "bg-emerald-600 animate-pulse" : "bg-stone-400"
                            }`}
                          />
                          <span>{banner.is_active ? "Đang chiếu" : "Đã ẩn"}</span>
                        </button>
                      </td>

                      {/* Cột Thao tác */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewBanner(banner)}
                            title="Xem trước Slide"
                            className="p-2 rounded-lg text-[#7D7571] hover:text-primary hover:bg-white border border-transparent hover:border-[#DEDAD2] transition-all cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(banner)}
                            title="Chỉnh sửa thông tin"
                            className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-all cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDelete(banner)}
                              title="Xóa Slide"
                              className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ========================================================
            5. MODAL FORM: THÊM MỚI / CHỈNH SỬA SLIDE
        ======================================================== */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-[#DEDAD2] shadow-2xl overflow-hidden my-6">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#DEDAD2] flex items-center justify-between bg-[#FAF9F6]">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Sliders className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#241915]">
                      {editingBanner ? "Chỉnh Sửa Slide Hero Banner" : "Thêm Mới Slide Hero Banner"}
                    </h3>
                    <p className="text-xs text-[#7D7571]">
                      Cập nhật thông tin chi tiết và kiểm tra khung xem trước thời gian thực
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#EAE6DF] text-[#7D7571] hover:text-[#241915] transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit}>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
                  {/* Left Column: Form Inputs (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Tiêu đề chính */}
                    <div>
                      <label className="block text-xs font-bold text-[#241915] uppercase tracking-wider mb-1.5">
                        Tiêu đề Slide <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Tháp Cổ Po Klong Garai - Đỉnh Cao Nghệ Thuật Champa"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DEDAD2] bg-[#FAF9F6] text-sm text-[#241915] focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    {/* Tiêu đề phụ */}
                    <div>
                      <label className="block text-xs font-bold text-[#241915] uppercase tracking-wider mb-1.5">
                        Tiêu đề phụ (Subtitle)
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Quần thể đền tháp gạch nung thế kỷ XIII - Di tích Quốc gia đặc biệt"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DEDAD2] bg-[#FAF9F6] text-sm text-[#241915] focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    {/* Chuyên mục & Gợi ý nhanh */}
                    <div>
                      <label className="block text-xs font-bold text-[#241915] uppercase tracking-wider mb-1.5">
                        Phân loại / Chuyên mục <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Kiến Trúc Đền Tháp Kỳ Vĩ"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DEDAD2] bg-[#FAF9F6] text-sm text-[#241915] focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary mb-2"
                      />
                      {/* Gợi ý tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {CATEGORY_SUGGESTIONS.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: cat })}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-all cursor-pointer ${
                              formData.category === cat
                                ? "bg-primary text-white border-primary"
                                : "bg-white text-[#5A504B] border-[#DEDAD2] hover:bg-[#FAF9F6]"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ảnh slide & MediaPicker */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-[#241915] uppercase tracking-wider">
                          Hình ảnh Slide (URL hoặc Tải lên) <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsMediaPickerOpen(true)}
                          className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Mở kho Media CMS</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="https://... hoặc /images/dana-life/..."
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DEDAD2] bg-[#FAF9F6] text-sm font-mono text-[#241915] focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    {/* Địa điểm & Niên đại */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#241915] uppercase tracking-wider mb-1.5">
                          Địa danh / Vị trí
                        </label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Đồi Trầu, Phan Rang"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DEDAD2] bg-[#FAF9F6] text-sm text-[#241915] focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#241915] uppercase tracking-wider mb-1.5">
                          Niên đại / Danh hiệu
                        </label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Xây dựng TK XIII - XIV"
                          value={formData.date_display}
                          onChange={(e) => setFormData({ ...formData, date_display: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DEDAD2] bg-[#FAF9F6] text-sm text-[#241915] focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Tác giả / Huy hiệu & Link URL */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#241915] uppercase tracking-wider mb-1.5">
                          Ghi chú Tác giả / Huy hiệu
                        </label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Điểm đến Di sản Số 1"
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DEDAD2] bg-[#FAF9F6] text-sm text-[#241915] focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#241915] uppercase tracking-wider mb-1.5">
                          Đường dẫn liên kết (CTA Link)
                        </label>
                        <input
                          type="text"
                          placeholder="Ví dụ: /tour hoặc /bai-viet"
                          value={formData.link_url}
                          onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DEDAD2] bg-[#FAF9F6] text-sm text-[#241915] focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Câu chuyện di sản (Mô tả) */}
                    <div>
                      <label className="block text-xs font-bold text-[#241915] uppercase tracking-wider mb-1.5">
                        Câu chuyện di sản & Giới thiệu chi tiết
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Mô tả ý nghĩa lịch sử, phương thức thủ công hoặc thông điệp văn hóa của bức ảnh..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DEDAD2] bg-[#FAF9F6] text-sm text-[#241915] focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary leading-relaxed"
                      />
                    </div>

                    {/* Thứ tự & Trạng thái Active */}
                    <div className="flex items-center gap-6 pt-2">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-[#241915] uppercase tracking-wider">
                          Thứ tự hiển thị:
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={formData.display_order}
                          onChange={(e) =>
                            setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 1 })
                          }
                          className="w-20 px-3 py-1.5 rounded-lg border border-[#DEDAD2] bg-[#FAF9F6] text-sm font-bold text-center focus:outline-hidden"
                        />
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                          className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-[#DEDAD2]"
                        />
                        <span className="text-xs font-bold text-[#241915]">
                          Kích hoạt hiển thị trên Trang chủ
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Right Column: Live Card Preview (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col">
                    <label className="block text-xs font-bold text-[#241915] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span>Xem trước giao diện thực tế (Live Preview)</span>
                    </label>

                    <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-stone-950 border border-[#DEDAD2] shadow-lg flex flex-col justify-end p-5 group">
                      {/* Background blurred image */}
                      {formData.image_url ? (
                        <>
                          <img
                            src={formData.image_url}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-105 pointer-events-none"
                          />
                          <img
                            src={formData.image_url}
                            alt=""
                            className="absolute inset-0 w-full h-full object-contain p-4 drop-shadow-xl"
                          />
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[#7D7571] text-xs">
                          Chưa có hình ảnh
                        </div>
                      )}

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 pointer-events-none" />

                      {/* Content overlay */}
                      <div className="relative z-10 text-white space-y-2">
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider">
                          <span>{formData.category || "Chuyên mục di sản"}</span>
                        </div>

                        <h4 className="font-serif font-bold text-base sm:text-lg text-white leading-snug drop-shadow-md">
                          {formData.title || "Tiêu đề Slide sẽ hiển thị ở đây"}
                        </h4>

                        {formData.subtitle && (
                          <p className="text-xs text-amber-200/90 italic line-clamp-1">
                            {formData.subtitle}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-white/70">
                          {formData.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-amber-400" />
                              <span className="line-clamp-1">{formData.location}</span>
                            </span>
                          )}
                          {formData.date_display && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-amber-400" />
                              <span>{formData.date_display}</span>
                            </span>
                          )}
                        </div>

                        {formData.description && (
                          <p className="text-[11px] text-white/80 line-clamp-3 leading-relaxed pt-1 border-t border-white/10">
                            {formData.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-[#7D7571] mt-2 italic text-center">
                      Mô phỏng chân thực tỷ lệ và màu sắc hiển thị trên Player trang chủ.
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-[#FAF9F6] border-t border-[#DEDAD2] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#DEDAD2] text-xs font-semibold text-[#5A504B] hover:bg-white transition-all cursor-pointer"
                  >
                    Hủy bỏ
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{editingBanner ? "Cập nhật Slide" : "Tạo Slide Mới"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            6. MODAL XEM TRƯỚC FULLSCREEN LIGHTBOX
        ======================================================== */}
        {previewBanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden bg-stone-950 border border-white/20 shadow-2xl flex flex-col">
              {/* Close button */}
              <button
                type="button"
                onClick={() => setPreviewBanner(null)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Player Stage */}
              <div className="relative w-full h-[520px] sm:h-[600px] flex items-center justify-center overflow-hidden">
                <img
                  src={previewBanner.image_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-35 scale-110 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30 pointer-events-none z-10" />

                <img
                  src={previewBanner.image_url}
                  alt={previewBanner.title}
                  className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain rounded-2xl shadow-2xl p-4 sm:p-8"
                />

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-6 left-6 right-6 z-20 max-w-2xl text-white space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/25 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
                    <span>{previewBanner.category}</span>
                    {previewBanner.author && <span>• {previewBanner.author}</span>}
                  </div>

                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-white leading-tight drop-shadow-md">
                    {previewBanner.title}
                  </h3>

                  {previewBanner.subtitle && (
                    <p className="text-sm text-amber-200/90 italic">{previewBanner.subtitle}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
                    {previewBanner.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{previewBanner.location}</span>
                      </span>
                    )}
                    {previewBanner.date_display && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{previewBanner.date_display}</span>
                      </span>
                    )}
                  </div>

                  {previewBanner.description && (
                    <p className="text-xs text-white/80 line-clamp-3 leading-relaxed pt-1">
                      {previewBanner.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            7. MODAL CHỌN MEDIA SẴN CÓ
        ======================================================== */}
        <MediaPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={(mediaUrl) => {
            setFormData((prev) => ({ ...prev, image_url: mediaUrl }));
            setIsMediaPickerOpen(false);
            toast.success("Đã chọn ảnh từ thư viện Media!");
          }}
          title="Chọn ảnh cho Slide Hero Banner"
        />
      </div>
    </AdminLayout>
  );
}
