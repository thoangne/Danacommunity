import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  main_category: string;
  category_id: string;
  category_label?: string;
  badge: string;
  author_name: string;
  featured_image?: string;
  is_published: boolean;
  status: string;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export default function AdminArticlesPage() {
  const { token } = useAuth();
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        mainCategory: "articles", // Chỉ lấy bài viết văn hóa / lịch sử
        category: categoryFilter,
        status: statusFilter,
        search,
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`${API_BASE}/admin/articles?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setArticles(data.data);
        setTotal(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách bài viết:", err);
      toast.error("Không thể tải danh sách bài viết.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchArticles();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, categoryFilter, token]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchArticles();
  };

  // Chuyển đổi nhanh trạng thái xuất bản
  const handleTogglePublish = async (article: ArticleItem) => {
    const nextPublishedState = !article.is_published;
    try {
      const res = await fetch(`${API_BASE}/admin/articles/${article.id}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ isPublished: nextPublishedState }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(
          nextPublishedState ? "Đã xuất bản bài viết!" : "Đã chuyển về bản nháp!"
        );
        setArticles((prev) =>
          prev.map((a) =>
            a.id === article.id
              ? { ...a, is_published: nextPublishedState, status: nextPublishedState ? "published" : "draft" }
              : a
          )
        );
      } else {
        toast.error(data.message || "Thao tác thất bại.");
      }
    } catch {
      toast.error("Đã xảy ra lỗi kết nối.");
    }
  };

  // Xóa bài viết
  const handleDelete = async (article: ArticleItem) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${article.title}" không?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/articles/${article.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Đã xóa bài viết thành công!");
        setArticles((prev) => prev.filter((a) => a.id !== article.id));
        setTotal((prev) => Math.max(0, prev - 1));
      } else {
        toast.error(data.message || "Xóa thất bại.");
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi xóa bài viết.");
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs">
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              Quản lý Bài viết Khảo cứu
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Tổng số <strong className="text-stone-800">{total}</strong> bài viết khảo cứu lịch sử, kiến trúc và văn hóa Champa.
            </p>
          </div>

          <Link
            to="/admin/articles/create"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#8F4E00] hover:bg-[#8F4E00]/90 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Soạn bài viết mới</span>
          </Link>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center gap-3 justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, tác giả..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] transition-colors"
            />
          </form>

          <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium text-stone-700 focus:outline-none focus:border-[#8F4E00]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
            </select>

            {/* Sub-Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium text-stone-700 focus:outline-none focus:border-[#8F4E00]"
            >
              <option value="all">Tất cả chuyên mục</option>
              <option value="van-hoa">Văn Hóa</option>
              <option value="lich-su">Lịch Sử</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#8F4E00]" />
              <span className="text-xs text-stone-500 font-serif">Đang nạp bài viết...</span>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-sm font-serif font-bold text-stone-800">
                Không tìm thấy bài viết nào
              </p>
              <p className="text-xs text-stone-500">
                Thử thay đổi từ khóa tìm kiếm hoặc tạo bài viết mới.
              </p>
              <Link
                to="/admin/articles/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8F4E00] text-white text-xs font-semibold shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo bài đầu tiên</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 bg-[#FAF9F6] text-stone-500 uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 pl-6 pr-3 font-bold">Bài viết</th>
                    <th className="py-3.5 px-3 font-bold">Chuyên mục</th>
                    <th className="py-3.5 px-3 font-bold">Tác giả</th>
                    <th className="py-3.5 px-3 font-bold">Trạng thái</th>
                    <th className="py-3.5 px-3 font-bold">Lượt xem</th>
                    <th className="py-3.5 px-3 font-bold">Ngày cập nhật</th>
                    <th className="py-3.5 pr-6 pl-3 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Title + Thumbnail */}
                      <td className="py-3.5 pl-6 pr-3 max-w-sm">
                        <div className="flex items-center gap-3">
                          {art.featured_image ? (
                            <img
                              src={art.featured_image}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover shrink-0 border border-stone-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 shrink-0 text-xs font-serif font-bold">
                              Champa
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <Link
                              to={`/admin/articles/edit/${art.id}`}
                              className="font-bold text-stone-900 hover:text-[#8F4E00] transition-colors line-clamp-1 text-xs sm:text-sm"
                            >
                              {art.title}
                            </Link>
                            <span className="text-[11px] text-stone-400 font-mono truncate block">
                              /bai-viet/{art.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#FAF4EF] text-[#8F4E00] border border-[#E8D5CB]">
                          {art.category_label || (art.main_category === "van-hoa" ? "Văn Hóa" : "Lịch Sử")}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="py-3.5 px-3 text-stone-700 font-medium whitespace-nowrap">
                        {art.author_name || "Ban Nghiên Cứu"}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(art)}
                          title="Nhấp để thay đổi trạng thái"
                          className="inline-flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          {art.is_published ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Xuất bản</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Bản nháp</span>
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-3 text-stone-600 font-mono whitespace-nowrap">
                        {(art.views_count || 0).toLocaleString()}
                      </td>

                      {/* Updated Date */}
                      <td className="py-3.5 px-3 text-stone-500 whitespace-nowrap">
                        {new Date(art.updated_at || art.created_at).toLocaleDateString("vi-VN")}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pr-6 pl-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/bai-viet/${art.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                            title="Xem trang công khai"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/articles/edit/${art.id}`}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-[#8F4E00] hover:bg-[#FAF4EF] transition-colors"
                            title="Chỉnh sửa bài viết"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(art)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Xóa bài viết"
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

          {/* Pagination Bar */}
          {!isLoading && articles.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-[#FAF9F6] text-xs text-stone-600">
              <span>
                Hiển thị trang <strong>{page}</strong> trên <strong>{totalPages}</strong> ({total} bài viết)
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
      </div>
    </AdminLayout>
  );
}
