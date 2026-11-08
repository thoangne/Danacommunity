import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";
import MediaPickerModal from "../../components/admin/MediaPickerModal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface AdminArtisanItem {
  id: number;
  name: string;
  slug: string;
  title: string;
  experience?: string;
  years_of_dedication: number;
  village: string;
  specialty?: string;
  achievements: string[];
  workshop_location?: string;
  quote?: string;
  bio: string;
  schedule?: string;
  avatar_image: string;
  hands_image?: string;
  badge_class?: string;
  is_active: boolean;
  product_count?: number;
  created_at: string;
  updated_at: string;
}

export default function AdminArtisansPage() {
  const { token, user: currentActor } = useAuth();
  const isAdmin = currentActor?.role === "admin" || currentActor?.role === "super_admin";

  const [artisans, setArtisans] = useState<AdminArtisanItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [villageFilter, setVillageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtisan, setEditingArtisan] = useState<AdminArtisanItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Media Picker state
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [activeMediaTarget, setActiveMediaTarget] = useState<"avatar" | "hands">("avatar");

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    title: "Nghệ nhân Chăm",
    experience: "",
    years_of_dedication: 30,
    village: "Làng gốm Bàu Trúc",
    specialty: "",
    achievements: [] as string[],
    workshop_location: "",
    quote: "",
    bio: "",
    schedule: "Đón khách các ngày trong tuần",
    avatar_image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    hands_image: "",
    is_active: true,
  });

  const [newAchievementInput, setNewAchievementInput] = useState("");

  const fetchArtisans = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        village: villageFilter,
        isActive: statusFilter === "active" ? "true" : statusFilter === "inactive" ? "false" : "all",
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`${API_BASE}/admin/artisans?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setArtisans(data.data);
        setTotal(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách nghệ nhân:", err);
      toast.error("Không thể tải danh sách nghệ nhân.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchArtisans();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, villageFilter, statusFilter, token]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchArtisans();
  };

  const openCreateModal = () => {
    setEditingArtisan(null);
    setFormData({
      name: "",
      slug: "",
      title: "Nghệ nhân Chăm",
      experience: "Hơn 30 năm gìn giữ nghề tổ",
      years_of_dedication: 30,
      village: "Làng gốm Bàu Trúc",
      specialty: "Gốm nung lộ thiên không bàn xoay",
      achievements: ["Bàn tay vàng làng nghề truyền thống"],
      workshop_location: "Khu phố Bàu Trúc, Thị trấn Phước Dân, Ninh Phước",
      quote: "Đất có linh hồn, người thợ gốm chỉ là người đánh thức vẻ đẹp tiềm ẩn của đất Mẹ.",
      bio: "Nghệ nhân gắn bó trọn đời với di sản văn hóa Champa, truyền dạy kỹ nghệ cho thế hệ trẻ.",
      schedule: "8:00 - 17:00 các ngày trong tuần",
      avatar_image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
      hands_image: "/images/dana-life/IMG_9911.JPG",
      is_active: true,
    });
    setNewAchievementInput("");
    setIsModalOpen(true);
  };

  const openEditModal = (a: AdminArtisanItem) => {
    setEditingArtisan(a);
    setFormData({
      name: a.name,
      slug: a.slug,
      title: a.title,
      experience: a.experience || "",
      years_of_dedication: a.years_of_dedication || 0,
      village: a.village,
      specialty: a.specialty || "",
      achievements: Array.isArray(a.achievements) ? [...a.achievements] : [],
      workshop_location: a.workshop_location || "",
      quote: a.quote || "",
      bio: a.bio || "",
      schedule: a.schedule || "",
      avatar_image: a.avatar_image || "",
      hands_image: a.hands_image || "",
      is_active: Boolean(a.is_active),
    });
    setNewAchievementInput("");
    setIsModalOpen(true);
  };

  const handleAddAchievement = () => {
    if (newAchievementInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, newAchievementInput.trim()],
      }));
      setNewAchievementInput("");
    }
  };

  const handleRemoveAchievement = (idxToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, idx) => idx !== idxToRemove),
    }));
  };

  const handleMediaSelect = (url: string) => {
    if (activeMediaTarget === "avatar") {
      setFormData((prev) => ({ ...prev, avatar_image: url }));
      toast.success("Đã chọn ảnh đại diện nghệ nhân!");
    } else {
      setFormData((prev) => ({ ...prev, hands_image: url }));
      toast.success("Đã chọn ảnh bàn tay chế tác!");
    }
    setIsMediaPickerOpen(false);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập họ tên nghệ nhân!");
      return;
    }
    if (!formData.village.trim()) {
      toast.error("Vui lòng chọn làng nghề của nghệ nhân!");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingArtisan
        ? `${API_BASE}/admin/artisans/${editingArtisan.id}`
        : `${API_BASE}/admin/artisans`;
      const method = editingArtisan ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(
          editingArtisan
            ? "Cập nhật hồ sơ nghệ nhân thành công!"
            : "Tạo mới hồ sơ nghệ nhân thành công!"
        );
        setIsModalOpen(false);
        fetchArtisans();
      } else {
        toast.error(data.message || "Không thể lưu thông tin nghệ nhân.");
      }
    } catch {
      toast.error("Lỗi khi kết nối đến máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArtisan = async (a: AdminArtisanItem) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ nghệ nhân "${a.name}" không?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/artisans/${a.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Đã xóa hồ sơ nghệ nhân thành công!");
        setArtisans((prev) => prev.filter((item) => item.id !== a.id));
        setTotal((prev) => Math.max(0, prev - 1));
      } else {
        toast.error(data.message || "Xóa nghệ nhân thất bại.");
      }
    } catch {
      toast.error("Lỗi khi kết nối đến máy chủ.");
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#FAF4EF] text-[#8F4E00] rounded-xl border border-[#E8D5CB]">
                <Award className="w-5 h-5" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
                Hồ sơ Nghệ nhân Chăm Giữ Lửa
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Quản lý danh sách bậc thầy vuốt gốm Bàu Trúc, dệt thổ cẩm Mỹ Nghiệp và chế tác nhạc khí Hữu Đức.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8F4E00] hover:bg-[#8F4E00]/90 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm nghệ nhân mới</span>
          </button>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center gap-3 justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm theo họ tên, danh hiệu, sở trường..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] transition-colors"
            />
          </form>

          <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={villageFilter}
              onChange={(e) => {
                setVillageFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium text-stone-700 focus:outline-none focus:border-[#8F4E00]"
            >
              <option value="all">Tất cả làng nghề</option>
              <option value="Bàu Trúc">Làng gốm Bàu Trúc</option>
              <option value="Mỹ Nghiệp">Làng dệt Mỹ Nghiệp</option>
              <option value="Hữu Đức">Làng Chăm Hữu Đức</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium text-stone-700 focus:outline-none focus:border-[#8F4E00]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang truyền dạy & Đón khách</option>
              <option value="inactive">Tạm nghỉ</option>
            </select>
          </div>
        </div>

        {/* Artisans Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#8F4E00]" />
              <span className="text-xs text-stone-500 font-serif">Đang nạp hồ sơ nghệ nhân...</span>
            </div>
          ) : artisans.length === 0 ? (
            <div className="text-center py-16 space-y-2 text-stone-400">
              <Users className="w-10 h-10 mx-auto text-stone-300" />
              <p className="text-sm font-bold text-stone-800">Không tìm thấy nghệ nhân phù hợp</p>
              <p className="text-xs text-stone-500">Hãy thử đổi từ khóa tìm kiếm hoặc bấm Thêm nghệ nhân mới.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 bg-[#FAF9F6] text-stone-500 uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 pl-6 pr-3 font-bold">Nghệ nhân</th>
                    <th className="py-3.5 px-3 font-bold">Làng nghề & Chức danh</th>
                    <th className="py-3.5 px-3 font-bold">Cống hiến & Kinh nghiệm</th>
                    <th className="py-3.5 px-3 font-bold">Sở trường kỹ thuật</th>
                    <th className="py-3.5 px-3 font-bold">Tác phẩm</th>
                    <th className="py-3.5 px-3 font-bold">Trạng thái</th>
                    <th className="py-3.5 pr-6 pl-3 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {artisans.map((a) => (
                    <tr key={a.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Nghệ nhân */}
                      <td className="py-3.5 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                            <img
                              src={a.avatar_image || "/images/dana-life/IMG_9911.JPG"}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 block hover:text-[#8F4E00]">
                              {a.name}
                            </span>
                            <span className="text-[11px] text-stone-400 font-mono block">
                              Mã #{a.id} • {a.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Làng nghề & Chức danh */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="font-medium text-stone-800">{a.village}</div>
                        <span className="text-[11px] text-[#8F4E00] font-semibold block">{a.title}</span>
                      </td>

                      {/* Cống hiến */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="font-bold text-stone-900">
                          {a.years_of_dedication > 0 ? `${a.years_of_dedication} năm gìn giữ` : "Truyền nhân trẻ"}
                        </div>
                        {a.experience && (
                          <span className="text-[11px] text-stone-500 block max-w-xs truncate">
                            {a.experience}
                          </span>
                        )}
                      </td>

                      {/* Sở trường */}
                      <td className="py-3.5 px-3">
                        <span className="text-stone-700 block max-w-xs line-clamp-2">
                          {a.specialty || "Kỹ nghệ truyền thống"}
                        </span>
                      </td>

                      {/* Tác phẩm */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono font-bold text-[11px]">
                          {a.product_count || 0} tác phẩm
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {a.is_active ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Hoạt động</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                            <span>Tạm nghỉ</span>
                          </span>
                        )}
                      </td>

                      {/* Thao tác */}
                      <td className="py-3.5 pr-6 pl-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(a)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-[#8F4E00] hover:bg-[#FAF4EF] transition-colors cursor-pointer"
                            title="Chỉnh sửa hồ sơ"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteArtisan(a)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Xóa nghệ nhân"
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

          {/* Pagination */}
          {!isLoading && artisans.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-[#FAF9F6] text-xs text-stone-600">
              <span>
                Hiển thị trang <strong>{page}</strong> trên <strong>{totalPages}</strong> ({total} nghệ nhân)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-stone-300 hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-stone-300 hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Thêm / Chỉnh sửa Nghệ nhân */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
            <div className="w-full max-w-2xl my-8 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#FAF9F6]">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#8F4E00]" />
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    {editingArtisan ? "Chỉnh sửa hồ sơ nghệ nhân" : "Thêm mới nghệ nhân Chăm gìn giữ di sản"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700 text-lg cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
                {/* Dòng 1: Tên & Chức danh */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Họ và tên nghệ nhân <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Muk Đàng Thị Phan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Danh xưng / Chức danh</label>
                    <input
                      type="text"
                      placeholder="Nghệ nhân Ưu tú Bàu Trúc"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>
                </div>

                {/* Dòng 2: Làng nghề & Số năm cống hiến */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Làng nghề <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium focus:outline-none focus:border-[#8F4E00]"
                    >
                      <option value="Làng gốm Bàu Trúc">Làng gốm Bàu Trúc</option>
                      <option value="Làng dệt Mỹ Nghiệp">Làng dệt Mỹ Nghiệp</option>
                      <option value="Làng Chăm Hữu Đức">Làng Chăm Hữu Đức</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Số năm cống hiến</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="58"
                      value={formData.years_of_dedication || ""}
                      onChange={(e) => setFormData({ ...formData, years_of_dedication: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 font-mono focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Kinh nghiệm tóm lược</label>
                    <input
                      type="text"
                      placeholder="58 năm giữ lửa gốm mẹ"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>
                </div>

                {/* Dòng 3: Sở trường & Lịch đón khách */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Sở trường kỹ thuật</label>
                    <input
                      type="text"
                      placeholder="Gốm đất nung lộ thiên không bàn xoay"
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Lịch đón khách / truyền dạy</label>
                    <input
                      type="text"
                      placeholder="Thứ Bảy & Chủ Nhật hàng tuần"
                      value={formData.schedule}
                      onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>
                </div>

                {/* Địa chỉ xưởng */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Địa chỉ xưởng chế tác / Không gian đón khách</label>
                  <input
                    type="text"
                    placeholder="Khu phố Bàu Trúc, Thị trấn Phước Dân, Ninh Phước"
                    value={formData.workshop_location}
                    onChange={(e) => setFormData({ ...formData, workshop_location: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                  />
                </div>

                {/* Hình ảnh đại diện & bàn tay */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-stone-700">Ảnh đại diện chân dung</label>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMediaTarget("avatar");
                          setIsMediaPickerOpen(true);
                        }}
                        className="text-[11px] font-semibold text-[#8F4E00] hover:underline cursor-pointer"
                      >
                        Chọn ảnh
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formData.avatar_image}
                      onChange={(e) => setFormData({ ...formData, avatar_image: e.target.value })}
                      placeholder="URL ảnh chân dung..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-[#8F4E00]"
                    />
                    {formData.avatar_image && (
                      <div className="mt-2 w-14 h-14 rounded-full overflow-hidden border border-stone-300">
                        <img src={formData.avatar_image} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-stone-700">Ảnh đôi bàn tay chế tác</label>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMediaTarget("hands");
                          setIsMediaPickerOpen(true);
                        }}
                        className="text-[11px] font-semibold text-[#8F4E00] hover:underline cursor-pointer"
                      >
                        Chọn ảnh
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formData.hands_image}
                      onChange={(e) => setFormData({ ...formData, hands_image: e.target.value })}
                      placeholder="URL ảnh bàn tay..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-[#8F4E00]"
                    />
                    {formData.hands_image && (
                      <div className="mt-2 w-14 h-14 rounded-lg overflow-hidden border border-stone-300">
                        <img src={formData.hands_image} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Danh hiệu / Thành tựu */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Thành tựu & Danh hiệu vinh danh</label>
                  <div className="space-y-1.5 mb-2">
                    {formData.achievements.map((ach, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-stone-100 text-stone-800 text-xs"
                      >
                        <span>• {ach}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAchievement(idx)}
                          className="text-stone-400 hover:text-red-600 font-bold ml-2"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nhập thành tựu (vd: Nghệ nhân Ưu tú Chủ tịch nước phong tặng) và bấm Thêm..."
                      value={newAchievementInput}
                      onChange={(e) => setNewAchievementInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddAchievement();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                    <button
                      type="button"
                      onClick={handleAddAchievement}
                      className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 font-semibold text-stone-700 cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                {/* Quote & Bio */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Câu nói tâm đắc / Triết lý gìn giữ</label>
                  <textarea
                    rows={2}
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    placeholder="“Người Chăm làm gốm bằng đôi chân đi giật lùi, xoay quanh chiếc trụ đất...”"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] resize-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tiểu sử & Đóng góp di sản</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Giới thiệu cuộc đời, cống hiến và các thế hệ truyền dạy của nghệ nhân..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] resize-none"
                  />
                </div>

                {/* Checkbox Trạng thái */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isActiveArtisan"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8F4E00] focus:ring-[#8F4E00] cursor-pointer"
                  />
                  <label htmlFor="isActiveArtisan" className="font-semibold text-stone-800 cursor-pointer">
                    Hồ sơ đang hoạt động (Hiển thị đón khách & kết nối tác phẩm trên website)
                  </label>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-[#8F4E00] hover:bg-[#8F4E00]/90 text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Đang lưu..." : editingArtisan ? "Lưu thay đổi" : "Thêm nghệ nhân"}
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
          onSelect={handleMediaSelect}
          title={
            activeMediaTarget === "avatar"
              ? "Chọn ảnh đại diện nghệ nhân"
              : "Chọn ảnh bàn tay chế tác"
          }
        />
      </div>
    </AdminLayout>
  );
}
