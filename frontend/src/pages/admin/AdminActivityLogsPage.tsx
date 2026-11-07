import { useState, useEffect } from "react";
import {
  History,
  Search,
  Clock,
  User,
  Shield,
  FileText,
  ImageIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface ActivityLogItem {
  id: string | number;
  actor_name: string;
  actor_email: string;
  action: string;
  target_type: string;
  target_id?: string;
  target_title?: string;
  details?: Record<string, unknown> | string;
  ip_address?: string;
  created_at: string;
}

export default function AdminActivityLogsPage() {
  const { token } = useAuth();
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [targetTypeFilter, setTargetTypeFilter] = useState("all");

  // Expand Details Accordion
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        action: actionFilter,
        targetType: targetTypeFilter,
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`${API_BASE}/admin/activity-logs?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setLogs(data.data);
        setTotal(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Lỗi lấy nhật ký kiểm toán:", err);
      toast.error("Không thể tải nhật ký hoạt động.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchLogs();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, actionFilter, targetTypeFilter, token]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const totalPages = Math.ceil(total / limit) || 1;

  const getActionBadge = (action: string) => {
    if (action.includes("CREATE")) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
          Tạo mới
        </span>
      );
    }
    if (action.includes("UPDATE")) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
          Cập nhật
        </span>
      );
    }
    if (action.includes("DELETE")) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-red-50 text-red-700 border border-red-200">
          Đã xóa
        </span>
      );
    }
    if (action.includes("PUBLISH")) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
          Xuất bản
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200">
        {action}
      </span>
    );
  };

  const getTargetIcon = (type: string) => {
    switch (type) {
      case "article":
      case "news":
        return <FileText className="w-3.5 h-3.5 text-[#8F4E00]" />;
      case "media":
        return <ImageIcon className="w-3.5 h-3.5 text-blue-600" />;
      case "user":
        return <User className="w-3.5 h-3.5 text-purple-600" />;
      case "settings":
        return <Settings className="w-3.5 h-3.5 text-stone-600" />;
      default:
        return <Shield className="w-3.5 h-3.5 text-stone-400" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs">
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              Nhật ký Hoạt động & Kiểm toán (Audit Logs)
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Lưu vết minh bạch toàn bộ các thao tác chỉnh sửa bài viết, thay đổi phân quyền và cập nhật hệ thống.
            </p>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center gap-3 justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm theo người thực hiện, đối tượng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] transition-colors"
            />
          </form>

          <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium text-stone-700 focus:outline-none focus:border-[#8F4E00]"
            >
              <option value="all">Tất cả hành động</option>
              <option value="ARTICLE_CREATE">Tạo bài viết</option>
              <option value="ARTICLE_UPDATE">Cập nhật bài viết</option>
              <option value="ARTICLE_DELETE">Xóa bài viết</option>
              <option value="ARTICLE_PUBLISH">Xuất bản bài viết</option>
              <option value="USER_UPDATE">Phân quyền người dùng</option>
              <option value="MEDIA_UPLOAD">Tải ảnh lên</option>
              <option value="MEDIA_DELETE">Xóa ảnh</option>
              <option value="SETTINGS_UPDATE">Cập nhật cài đặt</option>
            </select>

            <select
              value={targetTypeFilter}
              onChange={(e) => {
                setTargetTypeFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium text-stone-700 focus:outline-none focus:border-[#8F4E00]"
            >
              <option value="all">Tất cả tài nguyên</option>
              <option value="article">Bài viết</option>
              <option value="news">Tin tức</option>
              <option value="media">Media</option>
              <option value="user">Người dùng</option>
              <option value="category">Chuyên mục</option>
              <option value="settings">Cài đặt</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#8F4E00]" />
              <span className="text-xs text-stone-500 font-serif">Đang nạp nhật ký kiểm toán...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16 space-y-2 text-stone-400">
              <History className="w-10 h-10 mx-auto text-stone-300" />
              <p className="text-sm font-bold text-stone-800">Không tìm thấy hoạt động nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 bg-[#FAF9F6] text-stone-500 uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 pl-6 pr-3 font-bold">Người thực hiện</th>
                    <th className="py-3.5 px-3 font-bold">Thao tác</th>
                    <th className="py-3.5 px-3 font-bold">Tài nguyên</th>
                    <th className="py-3.5 px-3 font-bold">Thời gian</th>
                    <th className="py-3.5 pr-6 pl-3 font-bold text-right">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {logs.map((log) => {
                    const isExpanded = expandedId === log.id;

                    return (
                      <tr key={log.id} className="hover:bg-stone-50/70 transition-colors">
                        {/* Actor */}
                        <td className="py-3.5 pl-6 pr-3 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#FAF4EF] text-[#8F4E00] font-bold text-xs flex items-center justify-center uppercase shrink-0">
                              {log.actor_name?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="font-bold text-stone-900">{log.actor_name}</p>
                              <p className="text-[11px] text-stone-400 font-mono">{log.actor_email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Action Badge */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {getActionBadge(log.action)}
                          </div>
                        </td>

                        {/* Target */}
                        <td className="py-3.5 px-3 max-w-xs">
                          <div className="flex items-center gap-1.5 font-medium text-stone-800">
                            {getTargetIcon(log.target_type)}
                            <span className="truncate">{log.target_title || log.target_type}</span>
                          </div>
                          {log.target_id && (
                            <span className="text-[10px] text-stone-400 font-mono block truncate">
                              ID: {log.target_id}
                            </span>
                          )}
                        </td>

                        {/* Timestamp */}
                        <td className="py-3.5 px-3 whitespace-nowrap text-stone-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>{new Date(log.created_at).toLocaleString("vi-VN")}</span>
                          </div>
                        </td>

                        {/* Action Details Toggle */}
                        <td className="py-3.5 pr-6 pl-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : log.id)}
                            className="inline-flex items-center gap-1 text-[11px] text-[#8F4E00] font-semibold hover:underline cursor-pointer"
                          >
                            <span>{isExpanded ? "Ẩn bớt" : "Xem JSON"}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Expanded JSON Inspector Modal / Row Drawer if selected */}
          {expandedId !== null && (
            <div className="border-t border-stone-200 bg-stone-900 text-stone-200 p-4 font-mono text-[11px] overflow-x-auto">
              <div className="flex items-center justify-between text-stone-400 pb-2 mb-2 border-b border-stone-800">
                <span>Dữ liệu chi tiết hành động #{expandedId}</span>
                <button
                  type="button"
                  onClick={() => setExpandedId(null)}
                  className="text-stone-400 hover:text-white cursor-pointer"
                >
                  Đóng
                </button>
              </div>
              <pre className="text-amber-300">
                {JSON.stringify(
                  logs.find((l) => l.id === expandedId)?.details || {},
                  null,
                  2
                )}
              </pre>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && logs.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-[#FAF9F6] text-xs text-stone-600">
              <span>
                Hiển thị trang <strong>{page}</strong> trên <strong>{totalPages}</strong> ({total} sự kiện)
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
