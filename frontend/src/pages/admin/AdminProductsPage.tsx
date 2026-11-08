import { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";
import MediaPickerModal from "../../components/admin/MediaPickerModal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface AdminProductItem {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category_label?: string;
  village: string;
  artisan_id?: number | null;
  artisan_name?: string;
  artisan_title?: string;
  artisan_avatar?: string;
  price_estimate: string;
  raw_price: number;
  materials: string[];
  dimensions?: string;
  crafting_time?: string;
  badge: string;
  badge_type: "exclusive" | "traditional" | "unesco" | "ocop" | string;
  summary?: string;
  description?: string;
  cultural_meaning?: string;
  images: string[];
  is_featured: boolean;
  preservation_status?: string;
  stock_quantity: number;
  views_count?: number;
  created_at: string;
  updated_at: string;
}

interface CraftCategoryOption {
  id: string;
  label: string;
  village?: string;
  product_count?: number;
}

interface ArtisanOption {
  id: number;
  name: string;
  title: string;
  village: string;
}

export default function AdminProductsPage() {
  const { token, user: currentActor } = useAuth();
  const isAdmin = currentActor?.role === "admin" || currentActor?.role === "super_admin";

  // Data states
  const [products, setProducts] = useState<AdminProductItem[]>([]);
  const [categories, setCategories] = useState<CraftCategoryOption[]>([]);
  const [artisans, setArtisans] = useState<ArtisanOption[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [villageFilter, setVillageFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProductItem | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    category_id: "gom-bau-truc",
    village: "Làng gốm Bàu Trúc",
    artisan_id: "" as string | number,
    price_estimate: "",
    raw_price: 0,
    materials: [] as string[],
    dimensions: "",
    crafting_time: "",
    badge: "Độc bản",
    badge_type: "traditional",
    summary: "",
    cultural_meaning: "",
    description: "",
    images: [] as string[],
    is_featured: false,
    preservation_status: "Bảo tồn làng nghề truyền thống",
    stock_quantity: 1,
  });

  const [newMaterialInput, setNewMaterialInput] = useState("");
  const [customImageUrl, setCustomImageUrl] = useState("");

  // Fetch Categories & Artisans on load
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, artRes] = await Promise.all([
          fetch(`${API_BASE}/admin/craft-categories`, {
            headers: { Authorization: `Bearer ${token || ""}` },
          }),
          fetch(`${API_BASE}/admin/artisans?limit=50`, {
            headers: { Authorization: `Bearer ${token || ""}` },
          }),
        ]);

        const catData = await catRes.json();
        if (catData.success && Array.isArray(catData.data)) {
          setCategories(catData.data);
        }

        const artData = await artRes.json();
        if (artData.success && Array.isArray(artData.data)) {
          setArtisans(artData.data);
        }
      } catch (err) {
        console.warn("Lỗi tải danh mục hoặc nghệ nhân:", err);
      }
    };

    if (token) {
      void fetchOptions();
    }
  }, [token]);

  // Fetch Products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        category: categoryFilter,
        village: villageFilter,
        isFeatured: featuredFilter,
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`${API_BASE}/admin/products?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
        setTotal(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách tác phẩm:", err);
      toast.error("Không thể tải danh sách tác phẩm làng nghề.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchProducts();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, categoryFilter, villageFilter, featuredFilter, token]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      id: `sp-${Date.now().toString().slice(-4)}`,
      name: "",
      slug: "",
      category_id: categories[0]?.id || "gom-bau-truc",
      village: "Làng gốm Bàu Trúc",
      artisan_id: artisans[0]?.id || "",
      price_estimate: "",
      raw_price: 0,
      materials: ["Đất sét sông Quao"],
      dimensions: "",
      crafting_time: "",
      badge: "Độc bản",
      badge_type: "traditional",
      summary: "",
      cultural_meaning: "",
      description: "",
      images: ["/images/dana-life/IMG_9911.JPG"],
      is_featured: false,
      preservation_status: "Bảo tồn làng nghề truyền thống",
      stock_quantity: 1,
    });
    setNewMaterialInput("");
    setCustomImageUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (p: AdminProductItem) => {
    setEditingProduct(p);
    setFormData({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category_id: p.category_id,
      village: p.village,
      artisan_id: p.artisan_id || "",
      price_estimate: p.price_estimate || "",
      raw_price: p.raw_price || 0,
      materials: Array.isArray(p.materials) ? [...p.materials] : [],
      dimensions: p.dimensions || "",
      crafting_time: p.crafting_time || "",
      badge: p.badge || "Độc bản",
      badge_type: p.badge_type || "traditional",
      summary: p.summary || "",
      cultural_meaning: p.cultural_meaning || "",
      description: p.description || "",
      images: Array.isArray(p.images) ? [...p.images] : [],
      is_featured: Boolean(p.is_featured),
      preservation_status: p.preservation_status || "Bảo tồn làng nghề truyền thống",
      stock_quantity: p.stock_quantity ?? 1,
    });
    setNewMaterialInput("");
    setCustomImageUrl("");
    setIsModalOpen(true);
  };

  const handleAddMaterial = () => {
    if (newMaterialInput.trim()) {
      if (!formData.materials.includes(newMaterialInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          materials: [...prev.materials, newMaterialInput.trim()],
        }));
      }
      setNewMaterialInput("");
    }
  };

  const handleRemoveMaterial = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleAddCustomImage = () => {
    if (customImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, customImageUrl.trim()],
      }));
      setCustomImageUrl("");
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleMediaSelect = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));
    setIsMediaPickerOpen(false);
    toast.success("Đã chọn ảnh từ Thư viện Media!");
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên tác phẩm thủ công!");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingProduct
        ? `${API_BASE}/admin/products/${editingProduct.id}`
        : `${API_BASE}/admin/products`;
      const method = editingProduct ? "PUT" : "POST";

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
          editingProduct
            ? "Cập nhật tác phẩm thành công!"
            : "Thêm mới tác phẩm làng nghề thành công!"
        );
        setIsModalOpen(false);
        fetchProducts();
      } else {
        toast.error(data.message || "Không thể lưu thông tin tác phẩm.");
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi kết nối tới máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (p: AdminProductItem) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tác phẩm "${p.name}" không?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/products/${p.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Đã xóa tác phẩm thành công!");
        setProducts((prev) => prev.filter((item) => item.id !== p.id));
        setTotal((prev) => Math.max(0, prev - 1));
      } else {
        toast.error(data.message || "Xóa tác phẩm thất bại.");
      }
    } catch {
      toast.error("Lỗi khi kết nối đến máy chủ.");
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "unesco":
        return "bg-amber-50 text-amber-900 border-amber-300";
      case "exclusive":
        return "bg-red-50 text-red-900 border-red-200";
      case "ocop":
        return "bg-emerald-50 text-emerald-900 border-emerald-200";
      default:
        return "bg-stone-100 text-stone-800 border-stone-200";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#FAF4EF] text-[#8F4E00] rounded-xl border border-[#E8D5CB]">
                <Package className="w-5 h-5" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
                Quản lý Tác phẩm Làng nghề
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Gốm Bàu Trúc, Thổ cẩm Mỹ Nghiệp, Nhạc khí Hữu Đức và Điêu khắc mỹ nghệ Chăm Panduranga.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8F4E00] hover:bg-[#8F4E00]/90 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm tác phẩm mới</span>
          </button>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center gap-3 justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm theo tên tác phẩm, mã, chất liệu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] transition-colors"
            />
          </form>

          <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium text-stone-700 focus:outline-none focus:border-[#8F4E00]"
            >
              <option value="all">Tất cả ngành nghề</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={villageFilter}
              onChange={(e) => {
                setVillageFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium text-stone-700 focus:outline-none focus:border-[#8F4E00]"
            >
              <option value="all">Tất cả làng nghề</option>
              <option value="Làng gốm Bàu Trúc">Làng gốm Bàu Trúc</option>
              <option value="Làng dệt Mỹ Nghiệp">Làng dệt Mỹ Nghiệp</option>
              <option value="Làng Chăm Hữu Đức">Làng Chăm Hữu Đức</option>
            </select>

            <select
              value={featuredFilter}
              onChange={(e) => {
                setFeaturedFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium text-stone-700 focus:outline-none focus:border-[#8F4E00]"
            >
              <option value="all">Tất cả tiêu biểu</option>
              <option value="true">Tiêu biểu (Featured)</option>
              <option value="false">Thông thường</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#8F4E00]" />
              <span className="text-xs text-stone-500 font-serif">Đang nạp danh mục tác phẩm...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 space-y-2 text-stone-400">
              <Package className="w-10 h-10 mx-auto text-stone-300" />
              <p className="text-sm font-bold text-stone-800">Không tìm thấy tác phẩm phù hợp</p>
              <p className="text-xs text-stone-500">Hãy thử đổi từ khóa tìm kiếm hoặc chọn thêm mới tác phẩm.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 bg-[#FAF9F6] text-stone-500 uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 pl-6 pr-3 font-bold">Tác phẩm</th>
                    <th className="py-3.5 px-3 font-bold">Làng nghề & Ngành</th>
                    <th className="py-3.5 px-3 font-bold">Nghệ nhân tạo tác</th>
                    <th className="py-3.5 px-3 font-bold">Giá ước tính</th>
                    <th className="py-3.5 px-3 font-bold">Huy hiệu & Kho</th>
                    <th className="py-3.5 px-3 font-bold text-center">Tiêu biểu</th>
                    <th className="py-3.5 pr-6 pl-3 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => {
                    const thumb = p.images?.[0] || "/images/dana-life/IMG_9911.JPG";
                    return (
                      <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                        {/* Tác phẩm info */}
                        <td className="py-3.5 pl-6 pr-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                              <img src={thumb} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 max-w-xs">
                              <span className="font-bold text-stone-900 block truncate hover:text-[#8F4E00]">
                                {p.name}
                              </span>
                              <div className="flex items-center gap-2 text-[11px] text-stone-400 font-mono mt-0.5">
                                <span>{p.id}</span>
                                {p.dimensions && <span>• {p.dimensions}</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Làng nghề & Ngành */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="font-medium text-stone-800">{p.village}</div>
                          <span className="text-[11px] text-[#8F4E00] font-medium block">
                            {p.category_label || p.category_id}
                          </span>
                        </td>

                        {/* Nghệ nhân */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {p.artisan_name ? (
                            <div className="flex items-center gap-2">
                              {p.artisan_avatar ? (
                                <img
                                  src={p.artisan_avatar}
                                  alt=""
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 text-[10px] flex items-center justify-center font-bold">
                                  {p.artisan_name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-stone-800 block">{p.artisan_name}</span>
                                {p.artisan_title && (
                                  <span className="text-[10px] text-stone-400 block">{p.artisan_title}</span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-stone-400 italic text-[11px]">Chưa gắn nghệ nhân</span>
                          )}
                        </td>

                        {/* Giá */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="font-bold text-stone-900">{p.price_estimate}</div>
                          {p.raw_price > 0 && (
                            <span className="text-[10px] font-mono text-stone-400 block">
                              Số: {p.raw_price.toLocaleString("vi-VN")} ₫
                            </span>
                          )}
                        </td>

                        {/* Huy hiệu & Tồn kho */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getBadgeStyle(
                                p.badge_type
                              )}`}
                            >
                              {p.badge}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-500 font-mono block">
                            Kho: <strong className="text-stone-800">{p.stock_quantity}</strong>
                          </span>
                        </td>

                        {/* Tiêu biểu */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          {p.is_featured ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span>Tiêu biểu</span>
                            </span>
                          ) : (
                            <span className="text-stone-300 text-xs">—</span>
                          )}
                        </td>

                        {/* Thao tác */}
                        <td className="py-3.5 pr-6 pl-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEditModal(p)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-[#8F4E00] hover:bg-[#FAF4EF] transition-colors cursor-pointer"
                              title="Chỉnh sửa tác phẩm"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(p)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Xóa tác phẩm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && products.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-[#FAF9F6] text-xs text-stone-600">
              <span>
                Hiển thị trang <strong>{page}</strong> trên <strong>{totalPages}</strong> ({total} tác phẩm)
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

        {/* Modal Thêm / Chỉnh sửa Tác phẩm */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
            <div className="w-full max-w-3xl my-8 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#FAF9F6]">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#8F4E00]" />
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    {editingProduct ? "Chỉnh sửa tác phẩm làng nghề" : "Thêm mới tác phẩm làng nghề Chăm"}
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
                {/* Dòng 1: Tên & Mã */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">
                      Tên tác phẩm thủ công <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Bình Gốm Ngấn Khói Bàu Trúc Cổ Truyền"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Mã định danh (ID)</label>
                    <input
                      type="text"
                      placeholder="sp-01"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 font-mono focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>
                </div>

                {/* Dòng 2: Ngành nghề, Làng nghề & Nghệ nhân */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Chuyên mục ngành nghề</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium focus:outline-none focus:border-[#8F4E00]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Làng nghề di sản</label>
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      placeholder="Làng gốm Bàu Trúc"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Nghệ nhân thực hiện</label>
                    <select
                      value={formData.artisan_id}
                      onChange={(e) => setFormData({ ...formData, artisan_id: e.target.value ? Number(e.target.value) : "" })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium focus:outline-none focus:border-[#8F4E00]"
                    >
                      <option value="">-- Chưa gắn nghệ nhân --</option>
                      {artisans.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.village})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dòng 3: Giá & Kích thước & Thời gian */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Giá hiển thị ước tính</label>
                    <input
                      type="text"
                      placeholder="1.850.000 ₫"
                      value={formData.price_estimate}
                      onChange={(e) => setFormData({ ...formData, price_estimate: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Giá số (Số nguyên VNĐ)</label>
                    <input
                      type="number"
                      placeholder="1850000"
                      value={formData.raw_price || ""}
                      onChange={(e) => setFormData({ ...formData, raw_price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 font-mono focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Kích thước</label>
                    <input
                      type="text"
                      placeholder="Cao 45cm x ĐK 28cm"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>
                </div>

                {/* Dòng 4: Huy hiệu & Tồn kho */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Huy hiệu tác phẩm</label>
                    <input
                      type="text"
                      placeholder="Độc bản UNESCO"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Loại huy hiệu</label>
                    <select
                      value={formData.badge_type}
                      onChange={(e) => setFormData({ ...formData, badge_type: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium focus:outline-none focus:border-[#8F4E00]"
                    >
                      <option value="unesco">UNESCO Vinh Danh</option>
                      <option value="exclusive">Độc bản Quý hiếm</option>
                      <option value="traditional">Truyền thống Bản địa</option>
                      <option value="ocop">Chứng nhận OCOP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Số lượng tồn kho</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 font-mono focus:outline-none focus:border-[#8F4E00]"
                    />
                  </div>
                </div>

                {/* Chất liệu tags */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Chất liệu chế tác</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formData.materials.map((mat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-medium"
                      >
                        <span>{mat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(idx)}
                          className="text-stone-400 hover:text-red-600"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nhập tên chất liệu (vd: Đất sét sông Quao) và bấm Thêm..."
                      value={newMaterialInput}
                      onChange={(e) => setNewMaterialInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddMaterial();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                    <button
                      type="button"
                      onClick={handleAddMaterial}
                      className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 font-semibold text-stone-700 cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                {/* Hình ảnh tác phẩm */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-stone-700">Hình ảnh tác phẩm ({formData.images.length})</label>
                    <button
                      type="button"
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8F4E00] hover:underline cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Chọn từ Thư viện Media</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Hoặc dán URL hình ảnh..."
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomImage}
                      className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 font-semibold text-stone-700 cursor-pointer"
                    >
                      Chèn ảnh
                    </button>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200">
                      {formData.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-stone-300 aspect-square">
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ý nghĩa văn hóa & Tóm tắt */}
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Tóm tắt ngắn</label>
                    <textarea
                      rows={2}
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="Tóm tắt tác phẩm vuốt tay thủ công 100% không bàn xoay..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Ý nghĩa văn hóa di sản Champa</label>
                    <textarea
                      rows={2}
                      value={formData.cultural_meaning}
                      onChange={(e) => setFormData({ ...formData, cultural_meaning: e.target.value })}
                      placeholder="Biểu trưng cho bầu vú Mẹ Xứ Sở Po Ino Nagar..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Mô tả chi tiết kỹ thuật chế tác</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Mô tả kỹ thuật đi giật lùi, chất đất sông Quao, nung lộ thiên..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] resize-none"
                    />
                  </div>
                </div>

                {/* Checkbox Tiêu biểu */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isFeaturedProduct"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8F4E00] focus:ring-[#8F4E00] cursor-pointer"
                  />
                  <label htmlFor="isFeaturedProduct" className="font-semibold text-stone-800 cursor-pointer">
                    Đánh dấu là tác phẩm tiêu biểu (Hiển thị nổi bật trang chủ & đầu danh sách)
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
                    {isSubmitting ? "Đang lưu..." : editingProduct ? "Lưu thay đổi" : "Thêm tác phẩm"}
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
          title="Chọn hình ảnh tác phẩm làng nghề"
        />
      </div>
    </AdminLayout>
  );
}
