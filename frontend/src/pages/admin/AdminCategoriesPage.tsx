import { useState, useEffect } from "react";
import {
  FolderTree,
  Tag,
  Plus,
  Edit,
  Trash2,
  Search,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface CategoryItem {
  id: string;
  label: string;
  description?: string;
  main_category: string;
  display_order: number;
  article_count: number;
  created_at: string;
}

interface TagItem {
  id: number;
  name: string;
  slug: string;
  article_count: number;
  created_at: string;
}

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"categories" | "tags">("categories");

  // Categories State
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Category Form State
  const [catId, setCatId] = useState("");
  const [catLabel, setCatLabel] = useState("");
  const [catDescription, setCatDescription] = useState("");
  const [catMainCategory, setCatMainCategory] = useState<"van-hoa" | "lich-su" | "tin-tuc">("van-hoa");
  const [catDisplayOrder, setCatDisplayOrder] = useState(0);

  // Tags State
  const [tags, setTags] = useState<TagItem[]>([]);
  const [isTagsLoading, setIsTagsLoading] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [isTagSubmitting, setIsTagSubmitting] = useState(false);

  // Fetch Categories
  const fetchCategories = async () => {
    setIsCategoriesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/categories`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error("Lỗi lấy chuyên mục:", err);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  // Fetch Tags
  const fetchTags = async () => {
    setIsTagsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/tags`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setTags(data.data);
      }
    } catch (err) {
      console.error("Lỗi lấy thẻ tags:", err);
    } finally {
      setIsTagsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === "categories") {
        void fetchCategories();
      } else {
        void fetchTags();
      }
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, token]);

  // Open Create / Edit Category Modal
  const openCategoryModal = (cat?: CategoryItem) => {
    if (cat) {
      setEditingCategory(cat);
      setCatId(cat.id);
      setCatLabel(cat.label);
      setCatDescription(cat.description || "");
      setCatMainCategory(cat.main_category as "van-hoa" | "lich-su" | "tin-tuc");
      setCatDisplayOrder(cat.display_order || 0);
    } else {
      setEditingCategory(null);
      setCatId("");
      setCatLabel("");
      setCatDescription("");
      setCatMainCategory("van-hoa");
      setCatDisplayOrder(categories.length + 1);
    }
    setIsCategoryModalOpen(true);
  };

  // Save Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catLabel.trim()) {
      toast.error("Vui lòng nhập tên chuyên mục!");
      return;
    }

    try {
      const isEdit = Boolean(editingCategory);
      const url = isEdit
        ? `${API_BASE}/admin/categories/${editingCategory?.id}`
        : `${API_BASE}/admin/categories`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          id: catId,
          label: catLabel.trim(),
          description: catDescription.trim(),
          main_category: catMainCategory,
          display_order: catDisplayOrder,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(isEdit ? "Cập nhật chuyên mục thành công!" : "Tạo chuyên mục mới thành công!");
        setIsCategoryModalOpen(false);
        fetchCategories();
      } else {
        toast.error(data.message || "Lưu chuyên mục thất bại.");
      }
    } catch {
      toast.error("Đã xảy ra lỗi kết nối.");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (cat: CategoryItem) => {
    if (cat.article_count > 0) {
      toast.error(
        `Không thể xóa chuyên mục "${cat.label}" vì đang có ${cat.article_count} bài viết liên kết!`
      );
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa chuyên mục "${cat.label}" không?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/categories/${cat.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Đã xóa chuyên mục thành công!");
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      } else {
        toast.error(data.message || "Xóa chuyên mục thất bại.");
      }
    } catch {
      toast.error("Lỗi xóa chuyên mục.");
    }
  };

  // Create Tag
  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    setIsTagSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ name: newTagName.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Đã tạo thẻ #${newTagName.trim()}!`);
        setNewTagName("");
        fetchTags();
      } else {
        toast.error(data.message || "Tạo thẻ thất bại.");
      }
    } catch {
      toast.error("Lỗi tạo thẻ.");
    } finally {
      setIsTagSubmitting(false);
    }
  };

  // Delete Tag
  const handleDeleteTag = async (tag: TagItem) => {
    if (!window.confirm(`Xóa thẻ #${tag.name}? Các bài viết sẽ không còn gắn thẻ này.`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/tags/${tag.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Đã xóa thẻ #${tag.name}!`);
        setTags((prev) => prev.filter((t) => t.id !== tag.id));
      } else {
        toast.error(data.message || "Xóa thẻ thất bại.");
      }
    } catch {
      toast.error("Lỗi xóa thẻ.");
    }
  };

  const filteredTags = tags.filter((t) =>
    t.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs">
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              Quản lý Chuyên mục & Thẻ
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Tổ chức cấu trúc phân loại bài viết, tin tức và hệ thống từ khóa tìm kiếm.
            </p>
          </div>

          {activeTab === "categories" && (
            <button
              type="button"
              onClick={() => openCategoryModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#8F4E00] hover:bg-[#8F4E00]/90 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm chuyên mục</span>
            </button>
          )}
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-stone-200 bg-white px-6 pt-3 rounded-t-2xl">
          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "categories"
                ? "border-[#8F4E00] text-[#8F4E00]"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Chuyên mục bài viết ({categories.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tags")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "tags"
                ? "border-[#8F4E00] text-[#8F4E00]"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Từ khóa & Thẻ ({tags.length})</span>
          </button>
        </div>

        {/* TAB 1: CATEGORIES TABLE */}
        {activeTab === "categories" && (
          <div className="bg-white rounded-b-2xl border border-stone-200 shadow-2xs overflow-hidden -mt-6">
            {isCategoriesLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#8F4E00]" />
                <span className="text-xs text-stone-500 font-serif">Đang nạp chuyên mục...</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <FolderTree className="w-10 h-10 mx-auto text-stone-300" />
                <p className="text-sm font-bold text-stone-800">Chưa có chuyên mục nào</p>
                <button
                  type="button"
                  onClick={() => openCategoryModal()}
                  className="px-4 py-2 rounded-xl bg-[#8F4E00] text-white text-xs font-semibold shadow-xs"
                >
                  Tạo chuyên mục đầu tiên
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 bg-[#FAF9F6] text-stone-500 uppercase text-[10px] tracking-wider">
                      <th className="py-3.5 pl-6 pr-3 font-bold">Mã / Đường dẫn</th>
                      <th className="py-3.5 px-3 font-bold">Tên chuyên mục</th>
                      <th className="py-3.5 px-3 font-bold">Phân hệ chính</th>
                      <th className="py-3.5 px-3 font-bold">Số bài viết</th>
                      <th className="py-3.5 px-3 font-bold">Thứ tự</th>
                      <th className="py-3.5 pr-6 pl-3 font-bold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 pl-6 pr-3 font-mono text-stone-600 font-semibold">
                          {cat.id}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-stone-900">
                          {cat.label}
                          {cat.description && (
                            <p className="text-[11px] font-normal text-stone-500 line-clamp-1 mt-0.5">
                              {cat.description}
                            </p>
                          )}
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="capitalize px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#FAF4EF] text-[#8F4E00] border border-[#E8D5CB]">
                            {cat.main_category === "tin-tuc"
                              ? "Tin tức"
                              : cat.main_category === "lich-su"
                              ? "Lịch sử"
                              : "Văn hóa"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                            {cat.article_count} bài
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-stone-600">
                          {cat.display_order}
                        </td>
                        <td className="py-3.5 pr-6 pl-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openCategoryModal(cat)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-[#8F4E00] hover:bg-[#FAF4EF] transition-colors cursor-pointer"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Xóa chuyên mục"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TAGS MANAGEMENT */}
        {activeTab === "tags" && (
          <div className="space-y-6 -mt-6">
            {/* Create Tag Bar */}
            <div className="bg-white p-5 rounded-b-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <form onSubmit={handleCreateTag} className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Nhập tên thẻ mới (ví dụ: bau-truc, gom-cham)..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                />
                <button
                  type="submit"
                  disabled={isTagSubmitting || !newTagName.trim()}
                  className="px-4 py-2 rounded-xl bg-[#8F4E00] text-white text-xs font-semibold hover:bg-[#8F4E00]/90 transition-all shadow-2xs shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isTagSubmitting ? "Đang tạo..." : "+ Thêm thẻ"}
                </button>
              </form>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Lọc thẻ..."
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                />
              </div>
            </div>

            {/* Tags Cloud / Badges */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
              <h3 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wide mb-4">
                Danh sách các thẻ từ khóa ({filteredTags.length})
              </h3>

              {isTagsLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-stone-400">
                  <Loader2 className="w-6 h-6 animate-spin text-[#8F4E00]" />
                  <span className="text-xs">Đang tải danh sách thẻ...</span>
                </div>
              ) : filteredTags.length === 0 ? (
                <p className="text-xs text-stone-500 py-6 text-center">Chưa có thẻ nào.</p>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {filteredTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF9F6] border border-stone-200 text-xs font-medium text-stone-800 hover:border-[#8F4E00] transition-colors"
                    >
                      <Tag className="w-3.5 h-3.5 text-[#8F4E00]" />
                      <span className="font-semibold">#{tag.name}</span>
                      <span className="text-[10px] text-stone-400 font-mono">({tag.article_count})</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteTag(tag)}
                        className="text-stone-300 hover:text-red-600 transition-colors cursor-pointer"
                        title="Xóa thẻ"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category Modal (Create / Edit) */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#FAF9F6]">
                <h3 className="font-serif text-base font-bold text-stone-900">
                  {editingCategory ? "Chỉnh sửa chuyên mục" : "Tạo chuyên mục mới"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tên chuyên mục <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Đền tháp Kalan..."
                    value={catLabel}
                    onChange={(e) => {
                      setCatLabel(e.target.value);
                      if (!editingCategory && !catId) {
                        setCatId(
                          e.target.value
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .replace(/[đĐ]/g, "d")
                            .replace(/[^a-z0-9\s-]/g, "")
                            .trim()
                            .replace(/\s+/g, "-")
                        );
                      }
                    }}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mã chuyên mục (Slug / ID)
                  </label>
                  <input
                    type="text"
                    disabled={Boolean(editingCategory)}
                    placeholder="vi-du: den-thap-kalan"
                    value={catId}
                    onChange={(e) => setCatId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] font-mono disabled:bg-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phân hệ chính
                  </label>
                  <select
                    value={catMainCategory}
                    onChange={(e) =>
                      setCatMainCategory(e.target.value as "van-hoa" | "lich-su" | "tin-tuc")
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium focus:outline-none focus:border-[#8F4E00]"
                  >
                    <option value="van-hoa">Văn Hóa (Đền tháp, lễ hội, làng nghề)</option>
                    <option value="lich-su">Lịch Sử (Khảo cổ, vương triều)</option>
                    <option value="tin-tuc">Tin Tức (Sự kiện, bảo tồn)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    value={catDisplayOrder}
                    onChange={(e) => setCatDisplayOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mô tả ngắn
                  </label>
                  <textarea
                    rows={2}
                    value={catDescription}
                    onChange={(e) => setCatDescription(e.target.value)}
                    placeholder="Mô tả tóm tắt nội dung của chuyên mục..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#8F4E00] hover:bg-[#8F4E00]/90 text-white text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    {editingCategory ? "Cập nhật" : "Tạo chuyên mục"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
