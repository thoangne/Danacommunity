import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Newspaper,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  badge: string;
  author_name: string;
  featured_image?: string;
  is_published: boolean;
  status: string;
  views_count: number;
  created_at: string;
  updated_at: string;
  scheduled_at?: string;
}

export default function AdminNewsPage() {
  const { token } = useAuth();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        mainCategory: "tin-tuc",
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
        setNewsList(data.data);
        setTotal(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách tin tức:", err);
      toast.error("Không thể tải danh sách tin tức.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchNews();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, token]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchNews();
  };

  const handleTogglePublish = async (item: NewsItem) => {
    const nextPublishedState = !item.is_published;
    try {
      const res = await fetch(`${API_BASE}/admin/articles/${item.id}/publish`, {
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
          nextPublishedState ? "Đã xuất bản tin tức!" : "Đã chuyển về bản nháp!"
        );
        setNewsList((prev) =>
          prev.map((n) =>
            n.id === item.id
              ? { ...n, is_published: nextPublishedState, status: nextPublishedState ? "published" : "draft" }
              : n
          )
        );
      } else {
        toast.error(data.message || "Thao tác thất bại.");
      }
    } catch {
      toast.error("Đã xảy ra lỗi kết nối.");
    }
  };

  const handleDelete = async (item: NewsItem) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tin tức "${item.title}" không?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/articles/${item.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Đã xóa tin tức thành công!");
        setNewsList((prev) => prev.filter((n) => n.id !== item.id));
        setTotal((prev) => Math.max(0, prev - 1));
      } else {
        toast.error(data.message || "Xóa thất bại.");
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi xóa tin tức.");
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
              Quản lý Tin tức & Hoạt động Cộng đồng
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Cập nhật thông tin bảo tồn, sự kiện lễ hội Rija Nưgar, Katê và bản tin thực địa Panduranga.
            </p>
          </div>

          <Link
            to="/admin/news/create"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#972F12] hover:bg-[#972F12]/90 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng tin tức mới</span>
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3 justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề tin tức..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#972F12] transition-colors"
            />
          </form>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium text-stone-700 focus:outline-none focus:border-[#972F12]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã đăng công khai</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>

        {/* Content Grid */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#972F12]" />
              <span className="text-xs text-stone-500 font-serif">Đang nạp danh sách tin tức...</span>
            </div>
          ) : newsList.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Newspaper className="w-10 h-10 mx-auto text-stone-300" />
              <p className="text-sm font-serif font-bold text-stone-800">Chưa có tin tức nào</p>
              <Link
                to="/admin/news/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#972F12] text-white text-xs font-semibold shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Đăng tin đầu tiên</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 bg-[#FAF9F6] text-stone-500 uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 pl-6 pr-3 font-bold">Tin tức</th>
                    <th className="py-3.5 px-3 font-bold">Huy hiệu</th>
                    <th className="py-3.5 px-3 font-bold">Trạng thái</th>
                    <th className="py-3.5 px-3 font-bold">Lượt đọc</th>
                    <th className="py-3.5 px-3 font-bold">Thời gian</th>
                    <th className="py-3.5 pr-6 pl-3 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {newsList.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 pl-6 pr-3 max-w-sm">
                        <div className="flex items-center gap-3">
                          {item.featured_image ? (
                            <img
                              src={item.featured_image}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover shrink-0 border border-stone-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 shrink-0 text-xs font-serif">
                              Tin tức
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <Link
                              to={`/admin/news/edit/${item.id}`}
                              className="font-bold text-stone-900 hover:text-[#972F12] transition-colors line-clamp-1 text-xs sm:text-sm"
                            >
                              {item.title}
                            </Link>
                            <span className="text-[11px] text-stone-400 font-mono truncate block">
                              /bai-viet/{item.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#FDF2EE] text-[#972F12] border border-[#F5D5CB]">
                          {item.badge || "Tin Mới"}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(item)}
                          className="inline-flex items-center gap-1 cursor-pointer"
                        >
                          {item.is_published ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Đã đăng</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Bản nháp</span>
                            </span>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-3 text-stone-600 font-mono whitespace-nowrap">
                        {(item.views_count || 0).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-3 text-stone-500 whitespace-nowrap">
                        {new Date(item.updated_at || item.created_at).toLocaleDateString("vi-VN")}
                      </td>

                      <td className="py-3.5 pr-6 pl-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/bai-viet/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                            title="Xem trang công khai"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/news/edit/${item.id}`}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-[#972F12] hover:bg-[#FDF2EE] transition-colors"
                            title="Sửa tin tức"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Xóa tin tức"
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

          {/* Pagination */}
          {!isLoading && newsList.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-[#FAF9F6] text-xs text-stone-600">
              <span>
                Hiển thị trang <strong>{page}</strong> trên <strong>{totalPages}</strong> ({total} tin tức)
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
