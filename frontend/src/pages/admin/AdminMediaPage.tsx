import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Search,
  Grid,
  List as ListIcon,
  Copy,
  Trash2,
  Eye,
  ImageIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  HardDrive,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface MediaItem {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  dimensions?: string | null;
  url: string;
  uploader_name?: string;
  created_at: string;
}

export default function AdminMediaPage() {
  const { token } = useAuth();
  const [files, setFiles] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(24);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`${API_BASE}/admin/media?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setFiles(data.data);
        setTotal(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Lỗi lấy media:", err);
      toast.error("Không thể tải danh sách media.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchMedia();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, token]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMedia();
  };

  const handleUploadFile = async (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dung lượng tệp vượt quá giới hạn 5MB!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/media/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Tải tệp media lên thành công!");
        setFiles((prev) => [data.data, ...prev]);
        setTotal((prev) => prev + 1);
      } else {
        toast.error(data.message || "Tải tệp thất bại.");
      }
    } catch {
      toast.error("Lỗi khi tải tệp lên.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (file: MediaItem) => {
    if (!window.confirm(`Xóa tệp media "${file.original_name}" khỏi kho lưu trữ?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/media/${file.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Đã xóa tệp media thành công!");
        setFiles((prev) => prev.filter((f) => f.id !== file.id));
        setTotal((prev) => Math.max(0, prev - 1));
        if (previewItem?.id === file.id) setPreviewItem(null);
      } else {
        toast.error(data.message || "Xóa media thất bại.");
      }
    } catch {
      toast.error("Lỗi khi xóa media.");
    }
  };

  const copyToClipboard = (text: string) => {
    const fullUrl = text.startsWith("http") ? text : `${window.location.origin}${text}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Đã sao chép liên kết hình ảnh vào bộ nhớ tạm!");
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs">
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              Thư viện Media & Quản lý Hình ảnh
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Kho lưu trữ trung tâm các hình ảnh điền dã, đền tháp, nghệ nhân và sản phẩm Champa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleUploadFile(e.target.files[0]);
                }
              }}
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#8F4E00] hover:bg-[#8F4E00]/90 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>{isUploading ? "Đang tải ảnh..." : "Tải ảnh mới"}</span>
            </button>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleUploadFile(e.dataTransfer.files[0]);
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center gap-2 ${
            dragActive
              ? "border-[#8F4E00] bg-[#FAF4EF]"
              : "border-stone-200 bg-white hover:border-stone-300"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-[#FAF4EF] text-[#8F4E00] flex items-center justify-center">
            <HardDrive className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-stone-800">
            Kéo thả tập tin hình ảnh vào bất cứ đâu để tải lên nhanh
          </p>
          <p className="text-[11px] text-stone-400">
            Hỗ trợ JPG, PNG, WEBP, GIF, SVG (Dung lượng tối đa 5MB)
          </p>
        </div>

        {/* Toolbar: Search & View Toggle */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3 justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm theo tên tập tin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] transition-colors"
            />
          </form>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "border-[#8F4E00] bg-[#FAF4EF] text-[#8F4E00]"
                  : "border-stone-200 text-stone-500 hover:bg-stone-50"
              }`}
              title="Chế độ Lưới (Grid)"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "border-[#8F4E00] bg-[#FAF4EF] text-[#8F4E00]"
                  : "border-stone-200 text-stone-500 hover:bg-stone-50"
              }`}
              title="Chế độ Danh sách (List)"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 sm:p-6 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#8F4E00]" />
              <span className="text-xs text-stone-500 font-serif">Đang nạp kho media...</span>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ImageIcon className="w-12 h-12 mx-auto text-stone-300" />
              <p className="text-sm font-bold text-stone-800">Kho media đang trống</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-[#8F4E00] text-white text-xs font-semibold shadow-xs"
              >
                Tải ảnh đầu tiên
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="group relative rounded-xl border border-stone-200 overflow-hidden bg-stone-100 aspect-square flex flex-col hover:border-[#8F4E00] transition-all hover:shadow-sm"
                >
                  <img
                    src={file.url}
                    alt={file.original_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />

                  {/* Gradient Overlay & Details */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 text-white">
                    <p className="text-xs font-semibold truncate leading-tight">
                      {file.original_name}
                    </p>
                    <p className="text-[10px] text-stone-300 mt-0.5">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* Action Buttons on Hover */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setPreviewItem(file)}
                      className="p-1.5 rounded-lg bg-white/90 text-stone-800 hover:bg-white shadow-md transition-colors cursor-pointer"
                      title="Xem chi tiết ảnh"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(file.url)}
                      className="p-1.5 rounded-lg bg-white/90 text-stone-800 hover:bg-white shadow-md transition-colors cursor-pointer"
                      title="Sao chép URL"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(file)}
                      className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md transition-colors cursor-pointer"
                      title="Xóa ảnh"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px] tracking-wider">
                    <th className="py-3 pl-4 pr-3 font-bold">Hình ảnh</th>
                    <th className="py-3 px-3 font-bold">Tên gốc</th>
                    <th className="py-3 px-3 font-bold">Định dạng</th>
                    <th className="py-3 px-3 font-bold">Dung lượng</th>
                    <th className="py-3 px-3 font-bold">Ngày tải</th>
                    <th className="py-3 pr-4 pl-3 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 pl-4 pr-3">
                        <img
                          src={file.url}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                        />
                      </td>
                      <td className="py-3 px-3 font-bold text-stone-900 max-w-xs truncate">
                        {file.original_name}
                      </td>
                      <td className="py-3 px-3 text-stone-500 uppercase font-mono">
                        {file.mime_type.split("/")[1]}
                      </td>
                      <td className="py-3 px-3 text-stone-600 font-mono">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="py-3 px-3 text-stone-500">
                        {new Date(file.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="py-3 pr-4 pl-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setPreviewItem(file)}
                            className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(file.url)}
                            className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors cursor-pointer"
                            title="Sao chép liên kết"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(file)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Xóa"
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
          {!isLoading && files.length > 0 && (
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-stone-200 text-xs text-stone-600">
              <span>
                Hiển thị trang <strong>{page}</strong> trên <strong>{totalPages}</strong> ({total} tệp)
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

        {/* Image Preview Modal */}
        {previewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#FAF9F6]">
                <h3 className="font-serif text-sm font-bold text-stone-900 truncate max-w-md">
                  {previewItem.original_name}
                </h3>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="rounded-xl border border-stone-200 overflow-hidden aspect-video bg-stone-100 flex items-center justify-center">
                  <img
                    src={previewItem.url}
                    alt={previewItem.original_name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">
                      Tên tập tin
                    </span>
                    <span className="font-medium text-stone-800 break-all">{previewItem.filename}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">
                      Dung lượng
                    </span>
                    <span className="font-mono text-stone-800">{formatFileSize(previewItem.size)}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">
                      Định dạng
                    </span>
                    <span className="font-mono text-stone-800">{previewItem.mime_type}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">
                      Ngày tải lên
                    </span>
                    <span className="text-stone-800">
                      {new Date(previewItem.created_at).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    readOnly
                    value={
                      previewItem.url.startsWith("http")
                        ? previewItem.url
                        : `${window.location.origin}${previewItem.url}`
                    }
                    className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-stone-200 bg-stone-50 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(previewItem.url)}
                    className="px-4 py-2 rounded-xl bg-[#8F4E00] text-white text-xs font-semibold hover:bg-[#8F4E00]/90 transition-colors shrink-0 shadow-2xs"
                  >
                    Sao chép URL
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
