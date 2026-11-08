import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Newspaper,
  Users,
  Image as ImageIcon,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Package,
  Award,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface DashboardMetrics {
  articles: {
    total: number;
    published: number;
    draft: number;
    totalViews: number;
  };
  news: {
    total: number;
    published: number;
    draft: number;
  };
  users: {
    total: number;
    admins: number;
    editors: number;
    active: number;
  };
  media: {
    total: number;
    totalSize: number;
  };
  products?: {
    total: number;
    featured: number;
    outOfStock: number;
  };
  artisans?: {
    total: number;
    active: number;
  };
  recentContent: Array<{
    id: string;
    title: string;
    slug: string;
    main_category: string;
    is_published: boolean;
    status: string;
    views_count: number;
    updated_at: string;
  }>;
  recentActivity: Array<{
    id: string | number;
    actor_name: string;
    actor_email: string;
    action: string;
    target_type: string;
    target_title: string;
    created_at: string;
  }>;
  topViewed: Array<{
    id: string;
    title: string;
    slug: string;
    views_count: number;
    main_category: string;
  }>;
}

export default function AdminDashboardPage() {
  const { token, user } = useAuth();
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        });
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Lỗi tải dashboard metrics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getActionBadge = (action: string) => {
    if (action.includes("CREATE")) {
      return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">Tạo mới</span>;
    }
    if (action.includes("UPDATE")) {
      return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">Cập nhật</span>;
    }
    if (action.includes("DELETE")) {
      return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-red-50 text-red-700 border border-red-200">Đã xóa</span>;
    }
    if (action.includes("PUBLISH")) {
      return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">Xuất bản</span>;
    }
    return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200">{action}</span>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#8F4E00] via-[#972F12] to-[#58423C] p-6 sm:p-8 text-white shadow-md">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-white text-xs font-semibold tracking-wider uppercase border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Trung tâm Quản trị CMS ChampaWeb</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Xin chào, {user?.fullName || "Quản trị viên"}!
            </h1>
            <p className="text-stone-200 text-xs sm:text-sm font-light leading-relaxed">
              Hệ thống đang quản lý toàn diện các bài viết khảo cứu di sản, chuyên trang tin tức, thư viện hình ảnh và tài khoản cộng đồng Panduranga.
            </p>
            <div className="pt-2 flex flex-wrap gap-2.5">
              <Link
                to="/admin/articles/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#8F4E00] hover:bg-stone-100 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Viết bài khảo cứu</span>
              </Link>
              <Link
                to="/admin/news/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-xs border border-white/25 transition-all cursor-pointer"
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>Đăng tin tức mới</span>
              </Link>
              <Link
                to="/admin/products"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-xs border border-white/25 transition-all cursor-pointer"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Quản lý sản phẩm</span>
              </Link>
              <Link
                to="/admin/artisans"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-xs border border-white/25 transition-all cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Hồ sơ nghệ nhân</span>
              </Link>
            </div>
          </div>
          {/* Subtle background ornamentation */}
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
            <Sparkles className="w-80 h-80" />
          </div>
        </div>

        {/* 2. Key Metrics Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#8F4E00]" />
            <span className="text-xs text-stone-500 font-serif">Đang nạp số liệu thống kê...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* Metric 1: Articles */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Bài viết Khảo cứu
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#FAF4EF] text-[#8F4E00] flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-stone-900">
                    {data?.articles.total || 0}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                    <span className="text-emerald-700 font-semibold">
                      {data?.articles.published || 0} đã xuất bản
                    </span>
                    <span>•</span>
                    <span className="text-amber-700 font-medium">
                      {data?.articles.draft || 0} bản nháp
                    </span>
                  </div>
                </div>
                <Link
                  to="/admin/articles"
                  className="inline-flex items-center gap-1 text-xs text-[#8F4E00] font-semibold hover:underline pt-1"
                >
                  <span>Quản lý bài viết</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Metric 2: News */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Tin tức & Sự kiện
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#FDF2EE] text-[#972F12] flex items-center justify-center">
                    <Newspaper className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-stone-900">
                    {data?.news.total || 0}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                    <span className="text-emerald-700 font-semibold">
                      {data?.news.published || 0} đã đăng
                    </span>
                    <span>•</span>
                    <span className="text-amber-700 font-medium">
                      {data?.news.draft || 0} bản nháp
                    </span>
                  </div>
                </div>
                <Link
                  to="/admin/news"
                  className="inline-flex items-center gap-1 text-xs text-[#972F12] font-semibold hover:underline pt-1"
                >
                  <span>Quản lý tin tức</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Metric 3: Products */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Tác phẩm Làng nghề
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-800 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-stone-900">
                    {data?.products?.total || 8}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                    <span className="text-emerald-700 font-semibold">
                      {data?.products?.featured || 4} độc bản tiêu biểu
                    </span>
                    <span>•</span>
                    <span className="text-stone-500">Gốm & Thổ cẩm</span>
                  </div>
                </div>
                <Link
                  to="/admin/products"
                  className="inline-flex items-center gap-1 text-xs text-orange-800 font-semibold hover:underline pt-1"
                >
                  <span>Quản lý tác phẩm</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Metric 4: Artisans */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Nghệ nhân Chăm
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-stone-900">
                    {data?.artisans?.total || 4}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                    <span className="text-emerald-700 font-semibold">
                      {data?.artisans?.active || 4} đang đón khách
                    </span>
                    <span>•</span>
                    <span className="text-stone-500">Bàu Trúc & Mỹ Nghiệp</span>
                  </div>
                </div>
                <Link
                  to="/admin/artisans"
                  className="inline-flex items-center gap-1 text-xs text-amber-900 font-semibold hover:underline pt-1"
                >
                  <span>Hồ sơ nghệ nhân</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Metric 5: Users */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Người dùng đăng ký
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#F0F5FA] text-[#39566D] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-stone-900">
                    {data?.users.total || 0}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                    <span className="text-stone-700 font-semibold">
                      {data?.users.admins || 0} quản trị
                    </span>
                    <span>•</span>
                    <span className="text-stone-500">
                      {data?.users.active || 0} đang hoạt động
                    </span>
                  </div>
                </div>
                <Link
                  to="/admin/users"
                  className="inline-flex items-center gap-1 text-xs text-[#39566D] font-semibold hover:underline pt-1"
                >
                  <span>Phân quyền người dùng</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Metric 6: Media */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Thư viện Media
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-stone-900">
                    {data?.media.total || 0} tệp
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                    <span className="text-stone-700 font-medium">
                      Dung lượng: {formatFileSize(data?.media.totalSize || 0)}
                    </span>
                  </div>
                </div>
                <Link
                  to="/admin/media"
                  className="inline-flex items-center gap-1 text-xs text-amber-800 font-semibold hover:underline pt-1"
                >
                  <span>Quản lý kho ảnh</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 3. Detailed Panels: Recent Content & Activity Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Panel: Recently Updated Content (2 cols) */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#8F4E00]" />
                    <h2 className="font-serif text-base font-bold text-stone-900">
                      Nội dung cập nhật gần đây
                    </h2>
                  </div>
                  <Link
                    to="/admin/articles"
                    className="text-xs font-semibold text-[#8F4E00] hover:underline"
                  >
                    Xem tất cả ({data?.articles.total || 0})
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] tracking-wider">
                        <th className="pb-3 font-semibold">Tiêu đề bài viết</th>
                        <th className="pb-3 font-semibold">Phân hệ</th>
                        <th className="pb-3 font-semibold">Trạng thái</th>
                        <th className="pb-3 font-semibold">Lượt xem</th>
                        <th className="pb-3 font-semibold text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {data?.recentContent && data.recentContent.length > 0 ? (
                        data.recentContent.map((item) => (
                          <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                            <td className="py-3 pr-3 font-semibold text-stone-900 max-w-xs truncate">
                              <Link
                                to={`/admin/articles/edit/${item.id}`}
                                className="hover:text-[#8F4E00] transition-colors"
                              >
                                {item.title}
                              </Link>
                            </td>
                            <td className="py-3 pr-3">
                              <span className="capitalize text-stone-600 font-medium">
                                {item.main_category === "tin-tuc"
                                  ? "Tin tức"
                                  : item.main_category === "lich-su"
                                  ? "Lịch sử"
                                  : "Văn hóa"}
                              </span>
                            </td>
                            <td className="py-3 pr-3">
                              {item.is_published ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Đã xuất bản</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  <span>Bản nháp</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3 pr-3 text-stone-600 font-mono">
                              {item.views_count.toLocaleString()}
                            </td>
                            <td className="py-3 text-right">
                              <Link
                                to={`/admin/articles/edit/${item.id}`}
                                className="text-xs font-semibold text-[#8F4E00] hover:underline"
                              >
                                Sửa
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-stone-400">
                            Chưa có nội dung nào được cập nhật.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Panel: Recent Administrative Activities (1 col) */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#8F4E00]" />
                    <h2 className="font-serif text-base font-bold text-stone-900">
                      Nhật ký kiểm toán
                    </h2>
                  </div>
                  <Link
                    to="/admin/activity-logs"
                    className="text-xs font-semibold text-[#8F4E00] hover:underline"
                  >
                    Xem lịch sử
                  </Link>
                </div>

                <div className="space-y-3.5">
                  {data?.recentActivity && data.recentActivity.length > 0 ? (
                    data.recentActivity.map((log) => (
                      <div key={log.id} className="flex items-start gap-2.5 text-xs">
                        <div className="mt-0.5">{getActionBadge(log.action)}</div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-stone-900 truncate">
                            {log.target_title || log.target_type}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            bởi <span className="font-medium text-stone-700">{log.actor_name}</span> •{" "}
                            {new Date(log.created_at).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-stone-400 text-xs">
                      Chưa có nhật ký hoạt động nào.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
