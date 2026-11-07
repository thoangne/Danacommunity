import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  BookOpen,
  ArrowLeft,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import BlogPreviewModal from "../components/blog/BlogPreviewModal";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export default function AdminBlogListPage() {
  const { token } = useAuth();

  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [previewPost, setPreviewPost] = useState<any | null>(null);

  // Lấy danh sách bài viết quản trị
  const fetchAdminPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/posts/admin/all`, {
        headers: {
          Authorization: `Bearer ${token || "mock-admin-token"}`,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPosts(data.data);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách bài viết:", err);
      toast.error("Không thể tải danh sách bài viết.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminPosts();
  }, [token]);

  // Xóa bài viết
  const handleDeletePost = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}" không?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token || "mock-admin-token"}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Đã xóa bài viết thành công!");
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        throw new Error(data.message || "Xóa bài thất bại.");
      }
    } catch (err: any) {
      toast.error(err.message || "Đã xảy ra lỗi khi xóa bài viết.");
    }
  };

  // Lọc bài viết
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPublished = posts.filter((p) => p.status === "published").length;
  const totalDrafts = posts.filter((p) => p.status === "draft").length;
  const totalViews = posts.reduce((sum, p) => sum + (p.viewsCount || 0), 0);

  return (
    <div className="bg-[#fff8f6] min-h-screen text-on-surface font-body-md flex flex-col antialiased">
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-outline-variant/50 shadow-xs px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/bai-viet"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-container"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Trang Blog độc giả</span>
          </Link>
          <div className="h-4 w-px bg-outline-variant/40 hidden sm:block" />
          <h1 className="font-serif font-bold text-base sm:text-lg text-primary">
            Quản trị Nội dung & Soạn thảo Blog
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/blog/editor"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Viết bài mới</span>
          </Link>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-outline-variant/40 shadow-xs">
            <span className="text-xs text-on-surface-variant font-medium block">Tổng số bài</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-on-surface mt-1 block">
              {posts.length}
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-outline-variant/40 shadow-xs">
            <span className="text-xs text-emerald-700 font-medium block">Đã xuất bản</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-800 mt-1 block">
              {totalPublished}
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-outline-variant/40 shadow-xs">
            <span className="text-xs text-amber-700 font-medium block">Bản nháp</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-800 mt-1 block">
              {totalDrafts}
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-outline-variant/40 shadow-xs">
            <span className="text-xs text-secondary font-medium block">Tổng lượt đọc</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-secondary mt-1 block">
              {totalViews.toLocaleString("vi-VN")}
            </span>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-outline-variant/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tiêu đề hoặc slug..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant/50 text-xs font-medium focus:border-primary outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-outline shrink-0 hidden sm:block" />
            <div className="flex items-center p-1 rounded-xl bg-surface-container border border-outline-variant/30 text-xs font-semibold w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`flex-1 sm:flex-none px-3 py-1 rounded-lg transition-all ${statusFilter === "all" ? "bg-white text-primary shadow-xs" : "text-on-surface-variant"
                  }`}
              >
                Tất cả ({posts.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("published")}
                className={`flex-1 sm:flex-none px-3 py-1 rounded-lg transition-all ${statusFilter === "published"
                    ? "bg-white text-emerald-800 shadow-xs"
                    : "text-on-surface-variant"
                  }`}
              >
                Đã xuất bản ({totalPublished})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("draft")}
                className={`flex-1 sm:flex-none px-3 py-1 rounded-lg transition-all ${statusFilter === "draft"
                    ? "bg-white text-amber-800 shadow-xs"
                    : "text-on-surface-variant"
                  }`}
              >
                Bản nháp ({totalDrafts})
              </button>
            </div>
          </div>
        </div>

        {/* Table List of Posts */}
        <div className="bg-white rounded-2xl border border-outline-variant/40 shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-sm text-on-surface-variant">
              Đang tải danh sách bài viết khảo cứu...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <BookOpen className="w-10 h-10 text-outline/50" />
              <p className="font-serif text-base text-on-surface">Không tìm thấy bài viết nào.</p>
              <Link
                to="/admin/blog/editor"
                className="text-xs font-bold text-primary hover:underline"
              >
                + Bấm vào đây để tạo bài viết mới đầu tiên
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fff1ec]/60 border-b border-outline-variant/40 text-[11px] font-bold uppercase tracking-wider text-secondary">
                    <th className="py-3 px-4">Bài viết & Hình ảnh</th>
                    <th className="py-3 px-4">Chuyên mục</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">Lượt đọc</th>
                    <th className="py-3 px-4">Ngày đăng</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 text-xs">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-surface-container-low/50 transition-colors">
                      {/* Tiêu đề & Thumbnail */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.coverImage}
                            alt=""
                            className="w-14 h-11 rounded-lg object-cover shrink-0 border border-outline-variant/30"
                          />
                          <div className="min-w-0">
                            <span className="font-serif font-bold text-sm text-on-surface line-clamp-1 block hover:text-primary transition-colors">
                              {post.title}
                            </span>
                            <span className="text-[11px] text-outline font-mono truncate block">
                              /blog/{post.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Chuyên mục */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-surface-container text-primary border border-outline-variant/30">
                          {post.mainCategory === "tin-tuc"
                            ? "Tin tức"
                            : post.mainCategory === "lich-su"
                              ? "Lịch sử"
                              : "Văn hóa"}
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${post.status === "published"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                            }`}
                        >
                          {post.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                        </span>
                      </td>

                      {/* Lượt xem */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-on-surface-variant">
                        {(post.viewsCount || 0).toLocaleString("vi-VN")}
                      </td>

                      {/* Ngày đăng */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-on-surface-variant">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </td>

                      {/* Thao tác */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewPost(post)}
                            title="Xem trước nội dung"
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <Link
                            to={`/blog/${post.slug}`}
                            target="_blank"
                            title="Xem trên trang thực tế"
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/admin/blog/editor/${post.id}`}
                            title="Chỉnh sửa bài viết"
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDeletePost(post.id, post.title)}
                            title="Xóa bài viết"
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-red-700 hover:bg-red-50 transition-colors"
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
      </main>

      {/* Live Preview Modal */}
      {previewPost && (
        <BlogPreviewModal
          isOpen={Boolean(previewPost)}
          onClose={() => setPreviewPost(null)}
          post={previewPost}
        />
      )}
    </div>
  );
}
