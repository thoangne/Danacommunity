import { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Search,
  Check,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export interface MediaFileItem {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  dimensions?: string | null;
  url: string;
  created_at: string;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, item?: MediaFileItem) => void;
  title?: string;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = "Chọn hình ảnh",
}: MediaPickerModalProps) {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"library" | "upload" | "url">("library");

  // Library State
  const [files, setFiles] = useState<MediaFileItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<MediaFileItem | null>(null);

  // Upload State
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // URL State
  const [customUrl, setCustomUrl] = useState<string>("");

  const fetchMediaFiles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/media?limit=50`, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setFiles(data.data);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách media:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Tải danh sách media khi mở modal
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      void fetchMediaFiles();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, token]);

  // Upload handler
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
        toast.success("Tải ảnh lên thành công!");
        setFiles((prev) => [data.data, ...prev]);
        setSelectedFile(data.data);
        setActiveTab("library");
      } else {
        toast.error(data.message || "Tải ảnh thất bại.");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải ảnh lên.";
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmSelect = () => {
    if (activeTab === "url") {
      if (!customUrl.trim()) {
        toast.error("Vui lòng nhập đường dẫn URL hợp lệ!");
        return;
      }
      onSelect(customUrl.trim());
      onClose();
      return;
    }

    if (selectedFile) {
      onSelect(selectedFile.url, selectedFile);
      onClose();
    } else {
      toast.error("Vui lòng chọn một hình ảnh!");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const filteredFiles = files.filter(
    (f) =>
      f.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#FAF9F6]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FAF4EF] text-[#8F4E00] flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-200 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab("library")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "library"
                ? "border-[#8F4E00] text-[#8F4E00]"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Thư viện Media ({files.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "upload"
                ? "border-[#8F4E00] text-[#8F4E00]"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Tải tệp mới
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "url"
                ? "border-[#8F4E00] text-[#8F4E00]"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Nhập liên kết URL
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[350px]">
          {/* TAB 1: LIBRARY */}
          {activeTab === "library" && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm hình ảnh theo tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] transition-colors"
                />
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-stone-400">
                  <Loader2 className="w-6 h-6 animate-spin text-[#8F4E00]" />
                  <span className="text-xs">Đang tải thư viện media...</span>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
                  <ImageIcon className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                  <p className="text-xs font-medium text-stone-600">
                    Chưa có tệp nào phù hợp trong thư viện.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className="mt-3 text-xs text-[#8F4E00] font-semibold hover:underline cursor-pointer"
                  >
                    + Tải ảnh mới ngay
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-1">
                  {filteredFiles.map((file) => {
                    const isSelected = selectedFile?.id === file.id;
                    return (
                      <div
                        key={file.id}
                        onClick={() => setSelectedFile(file)}
                        className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all aspect-square bg-stone-100 flex flex-col ${
                          isSelected
                            ? "border-[#8F4E00] ring-2 ring-[#8F4E00]/40 shadow-sm"
                            : "border-stone-200 hover:border-stone-300 hover:shadow-xs"
                        }`}
                      >
                        <img
                          src={file.url}
                          alt={file.original_name}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2 text-white">
                          <p className="text-[11px] font-medium truncate">{file.original_name}</p>
                          <p className="text-[9px] text-stone-300">{formatFileSize(file.size)}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#8F4E00] text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UPLOAD */}
          {activeTab === "upload" && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 text-center transition-all min-h-[300px] ${
                dragActive
                  ? "border-[#8F4E00] bg-[#FAF4EF]"
                  : "border-stone-300 hover:border-stone-400 bg-stone-50/50"
              }`}
            >
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
              <div className="w-14 h-14 rounded-2xl bg-[#FAF4EF] text-[#8F4E00] flex items-center justify-center mb-4">
                <Upload className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-base font-bold text-stone-900 mb-1">
                Kéo thả hình ảnh vào đây
              </h4>
              <p className="text-xs text-stone-500 mb-4 max-w-sm">
                Hỗ trợ định dạng JPG, PNG, WEBP, GIF, SVG. Dung lượng tối đa không quá 5MB.
              </p>
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-[#8F4E00] hover:bg-[#8F4E00]/90 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isUploading ? "Đang tải ảnh lên..." : "Chọn ảnh từ thiết bị"}
              </button>
            </div>
          )}

          {/* TAB 3: EXTERNAL URL */}
          {activeTab === "url" && (
            <div className="space-y-4 max-w-lg mx-auto py-6">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Đường dẫn hình ảnh (Image URL)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] transition-colors"
                />
              </div>
              {customUrl && (
                <div className="mt-4 rounded-xl border border-stone-200 overflow-hidden aspect-video bg-stone-100 flex items-center justify-center">
                  <img
                    src={customUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => toast.error("Đường dẫn ảnh không khả dụng hoặc bị chặn CORS.")}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-stone-200 bg-[#FAF9F6]">
          <div className="text-xs text-stone-500 truncate max-w-xs sm:max-w-md">
            {activeTab === "library" && selectedFile && (
              <span>
                Đang chọn: <strong className="text-stone-800">{selectedFile.original_name}</strong>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-medium transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleConfirmSelect}
              className="px-5 py-2 rounded-xl bg-[#8F4E00] hover:bg-[#8F4E00]/90 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              Áp dụng hình ảnh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
