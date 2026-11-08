import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  ImageIcon,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Quote,
  List,
  ListOrdered,
  Link2,
  Minus,
  Calendar,
  MapPin,
  Globe,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import MediaPickerModal from "./MediaPickerModal";
import BlogPreviewModal from "../blog/BlogPreviewModal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface CategoryOption {
  id: string;
  label: string;
  main_category: string;
}

interface RichArticleEditorProps {
  initialId?: string;
  defaultMainCategory?: "van-hoa" | "lich-su" | "tin-tuc";
  backUrl: string;
  titlePrefix: string;
}

export default function RichArticleEditor({
  initialId,
  defaultMainCategory = "van-hoa",
  backUrl,
  titlePrefix,
}: RichArticleEditorProps) {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const isEditMode = Boolean(initialId);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [mainCategory, setMainCategory] = useState<"van-hoa" | "lich-su" | "tin-tuc">(defaultMainCategory);
  const [categoryId, setCategoryId] = useState("");
  const [badge, setBadge] = useState(defaultMainCategory === "tin-tuc" ? "Tin Tức Mới" : "Khảo Cứu Di Sản");
  const [fieldLocation, setFieldLocation] = useState("Ninh Thuận");
  const [authorName, setAuthorName] = useState(user?.fullName || "Ban Quản Trị Di Sản");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">("published");
  const [scheduledAt, setScheduledAt] = useState("");

  // Tags
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // SEO
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // Modals & Dynamic Data
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<"featured" | "inline">("featured");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cảnh báo người dùng khi thoát trang nếu có nội dung chưa lưu
  const isDirty = Boolean(title.trim() || content.trim());
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSubmitting]);

  // Tự sinh Slug
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      setSlug(generateSlug(val));
    }
    if (!seoTitle) {
      setSeoTitle(val);
    }
  };

  const calculateReadTime = (text: string) => {
    if (!text) return "3 phút đọc";
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} phút đọc`;
  };

  // Tải danh mục và chi tiết bài nếu edit mode
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch(`${API_BASE}/admin/categories`, {
          headers: { Authorization: `Bearer ${token || ""}` },
        });
        const catData = await catRes.json();
        if (catData.success && Array.isArray(catData.data)) {
          setCategories(catData.data);
          if (catData.data.length > 0) {
            const matched = catData.data.find((c: CategoryOption) => c.main_category === defaultMainCategory);
            if (matched) setCategoryId((prev) => prev || matched.id);
          }
        }

        if (isEditMode && initialId) {
          const artRes = await fetch(`${API_BASE}/admin/articles/${initialId}`, {
            headers: { Authorization: `Bearer ${token || ""}` },
          });
          const artData = await artRes.json();
          if (artData.success && artData.data) {
            const a = artData.data;
            setTitle(a.title || "");
            setSlug(a.slug || "");
            setIsSlugManual(true);
            setExcerpt(a.summary || a.excerpt || "");
            setContent(a.content || "");
            setFeaturedImage(a.featured_image || a.coverImage || "");
            setMainCategory(a.main_category || defaultMainCategory);
            setCategoryId(a.category_id || "");
            setBadge(a.badge || "");
            setFieldLocation(a.field_location || "Ninh Thuận");
            setAuthorName(a.author_name || "");
            setStatus(a.status || (a.is_published ? "published" : "draft"));
            setSeoTitle(a.seo_title || a.title || "");
            setSeoDescription(a.seo_description || a.summary || "");
            if (Array.isArray(a.tagsList)) {
              setTags(a.tagsList.map((t: { name: string }) => t.name));
            } else if (Array.isArray(a.tags)) {
              setTags(a.tags);
            }
          }
        }
      } catch (err) {
        console.error("Lỗi khởi tạo editor:", err);
        toast.error("Không thể tải thông tin bài viết.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [initialId, isEditMode, token, defaultMainCategory]);

  // Thêm / Xóa Tag
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, "");
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Hỗ trợ chèn markdown nhanh vào vùng soạn thảo
  const insertMarkdown = (prefix: string, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    const replacement = prefix + (selected || "nội dung") + suffix;
    const newContent = text.substring(0, start) + replacement + text.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 7));
    }, 0);
  };

  // Chọn ảnh từ MediaPickerModal
  const handleMediaSelected = (url: string) => {
    if (mediaPickerTarget === "featured") {
      setFeaturedImage(url);
      toast.success("Đã chọn ảnh đại diện!");
    } else {
      insertMarkdown(`\n![Hình ảnh di sản](${url})\n`);
      toast.success("Đã chèn ảnh vào nội dung bài viết!");
    }
  };

  // Lưu hoặc Xuất bản bài viết
  const handleSubmit = async (targetStatus?: "draft" | "published" | "scheduled") => {
    const finalStatus = targetStatus || status;

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết!");
      return;
    }

    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung bài viết!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content,
        featured_image: featuredImage,
        coverImage: featuredImage,
        mainCategory,
        main_category: mainCategory,
        category_id: categoryId || null,
        badge,
        fieldLocation,
        authorName,
        status: finalStatus,
        isPublished: finalStatus === "published",
        scheduledAt: finalStatus === "scheduled" ? scheduledAt : null,
        tags,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt,
        readTime: calculateReadTime(content),
      };

      const url = isEditMode
        ? `${API_BASE}/admin/articles/${initialId}`
        : `${API_BASE}/admin/articles`;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(
          finalStatus === "published"
            ? "Đã xuất bản bài viết thành công!"
            : "Đã lưu bản nháp thành công!"
        );
        navigate(backUrl);
      } else {
        toast.error(data.message || "Lưu bài viết thất bại.");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Đã xảy ra lỗi khi lưu bài viết.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#8F4E00]" />
        <span className="text-xs text-stone-500 font-serif">Đang nạp dữ liệu bài viết...</span>
      </div>
    );
  }

  // Preview Post Object
  const previewPostData = {
    title: title || "Tiêu đề bài viết bản xem trước",
    slug: slug || "preview-post",
    excerpt: excerpt || "Đoạn tóm tắt giới thiệu bài viết...",
    content: content || "Nội dung bài viết sẽ hiển thị tại đây...",
    coverImage:
      featuredImage ||
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
    mainCategory,
    category: categoryId || "craft",
    badge,
    badgeClass: "bg-amber-100 text-amber-800",
    fieldLocation,
    readTime: calculateReadTime(content),
    authorName,
    status,
    publishedAt: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to={backUrl}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
              {isEditMode ? `Chỉnh sửa ${titlePrefix}` : `Tạo mới ${titlePrefix}`}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Soạn thảo định dạng Markdown tiêu chuẩn, tối ưu hóa ảnh và thông số SEO.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500" />
            <span>Xem trước</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit("draft")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#8F4E00]/30 bg-[#FAF4EF] text-[#8F4E00] hover:bg-[#FAF4EF]/80 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu bản nháp</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit("published")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8F4E00] hover:bg-[#8F4E00]/90 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{isEditMode ? "Cập nhật bài" : "Xuất bản ngay"}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Editor Grid (2 Columns: Main Content vs Sidebar Settings) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Title, Slug, Content & Excerpt (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug Box */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Tiêu đề bài viết <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tiêu đề bài viết khảo cứu hoặc tin tức..."
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 text-base sm:text-lg font-serif font-bold rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] focus:ring-1 focus:ring-[#8F4E00] transition-colors"
              />
            </div>

            {/* Slug URL */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  Đường dẫn liên kết (Slug)
                </label>
                <button
                  type="button"
                  onClick={() => setIsSlugManual(!isSlugManual)}
                  className="text-[11px] text-[#8F4E00] hover:underline cursor-pointer"
                >
                  {isSlugManual ? "Tự động sinh từ tiêu đề" : "Tùy chỉnh thủ công"}
                </button>
              </div>
              <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2 text-xs text-stone-600 focus-within:border-[#8F4E00] focus-within:bg-white transition-colors">
                <span className="text-stone-400 shrink-0 select-none">/bai-viet/</span>
                <input
                  type="text"
                  value={slug}
                  readOnly={!isSlugManual}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  placeholder="duong-dan-bai-viet"
                  className="w-full bg-transparent pl-1 font-mono text-xs focus:outline-none text-stone-900"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Đoạn tóm tắt ngắn (Excerpt)
              </label>
              <textarea
                rows={3}
                placeholder="Tóm tắt ngắn gọn nội dung bài viết trong 1-2 câu để hiển thị ngoài danh sách bài viết..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Markdown Content Editor */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center flex-wrap gap-1 p-2 border-b border-stone-200 bg-[#FAF9F6]">
              <button
                type="button"
                onClick={() => insertMarkdown("## ", "\n")}
                title="Tiêu đề H2"
                className="p-1.5 rounded-lg hover:bg-stone-200/60 text-stone-700 transition-colors cursor-pointer"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("### ", "\n")}
                title="Tiêu đề H3"
                className="p-1.5 rounded-lg hover:bg-stone-200/60 text-stone-700 transition-colors cursor-pointer"
              >
                <Heading3 className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-4 bg-stone-300 mx-1" />
              <button
                type="button"
                onClick={() => insertMarkdown("**", "**")}
                title="In đậm (Bold)"
                className="p-1.5 rounded-lg hover:bg-stone-200/60 text-stone-700 transition-colors cursor-pointer"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("*", "*")}
                title="In nghiêng (Italic)"
                className="p-1.5 rounded-lg hover:bg-stone-200/60 text-stone-700 transition-colors cursor-pointer"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("> ", "\n")}
                title="Trích dẫn (Quote)"
                className="p-1.5 rounded-lg hover:bg-stone-200/60 text-stone-700 transition-colors cursor-pointer"
              >
                <Quote className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-4 bg-stone-300 mx-1" />
              <button
                type="button"
                onClick={() => insertMarkdown("- ", "\n")}
                title="Danh sách gạch đầu dòng"
                className="p-1.5 rounded-lg hover:bg-stone-200/60 text-stone-700 transition-colors cursor-pointer"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("1. ", "\n")}
                title="Danh sách đánh số"
                className="p-1.5 rounded-lg hover:bg-stone-200/60 text-stone-700 transition-colors cursor-pointer"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("[Tiêu đề liên kết](", ")")}
                title="Chèn liên kết"
                className="p-1.5 rounded-lg hover:bg-stone-200/60 text-stone-700 transition-colors cursor-pointer"
              >
                <Link2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("\n---\n")}
                title="Đường kẻ ngang phân cách"
                className="p-1.5 rounded-lg hover:bg-stone-200/60 text-stone-700 transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-4 bg-stone-300 mx-1" />

              {/* Nút chèn ảnh từ Media Library vào nội dung */}
              <button
                type="button"
                onClick={() => {
                  setMediaPickerTarget("inline");
                  setIsMediaPickerOpen(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-[#8F4E00] hover:bg-[#FAF4EF] text-xs font-semibold transition-colors cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Chèn ảnh từ Media</span>
              </button>
            </div>

            {/* Textarea */}
            <div className="p-4 sm:p-5 flex-1 min-h-[420px]">
              <textarea
                ref={textareaRef}
                rows={18}
                placeholder="Nhập nội dung bài viết bằng Markdown (Hỗ trợ tiêu đề ##, danh sách, trích dẫn, ảnh...)..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full font-mono text-xs sm:text-sm text-stone-800 focus:outline-none resize-y leading-relaxed bg-transparent"
              />
            </div>

            {/* Editor Footer Status */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-stone-100 bg-[#FAF9F6] text-[11px] text-stone-500">
              <div className="flex items-center gap-3">
                <span>{content.trim() ? content.trim().split(/\s+/).length : 0} từ</span>
                <span>{content.length} ký tự</span>
                <span>{calculateReadTime(content)}</span>
              </div>
              <span className="text-[#8F4E00] font-medium">Hỗ trợ Markdown chuẩn</span>
            </div>
          </div>

          {/* SEO Metadata Box */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Globe className="w-4 h-4 text-[#8F4E00]" />
              <h3 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wide">
                Tối ưu hóa tìm kiếm (SEO Metadata)
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tiêu đề SEO (SEO Title)
              </label>
              <input
                type="text"
                placeholder={title || "Tiêu đề xuất hiện trên Google Tìm Kiếm..."}
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mô tả SEO (Meta Description)
              </label>
              <textarea
                rows={2}
                placeholder={excerpt || "Mô tả ngắn gọn thu hút người dùng nhấp vào kết quả tìm kiếm..."}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] resize-none"
              />
            </div>

            {/* Google Snippet Preview */}
            <div className="rounded-xl border border-stone-200 p-3 bg-stone-50/50 space-y-1">
              <p className="text-[10px] text-stone-400 font-mono">
                https://champaweb.vn/bai-viet/{slug || "duong-dan"}
              </p>
              <p className="text-xs font-bold text-blue-800 line-clamp-1">
                {seoTitle || title || "Tiêu đề bài viết trên Google"}
              </p>
              <p className="text-[11px] text-stone-600 line-clamp-2">
                {seoDescription || excerpt || "Mô tả bài viết sẽ xuất hiện ở đây khi người dùng tìm kiếm trên Google..."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Featured Image, Categorization, Status, Author (1/3 width) */}
        <div className="space-y-6">
          {/* 1. Trạng thái xuất bản */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wide border-b border-stone-100 pb-2">
              Xuất bản & Lên lịch
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Trạng thái bài viết
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published" | "scheduled")}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-white font-medium focus:outline-none focus:border-[#8F4E00]"
              >
                <option value="published">Công khai (Published)</option>
                <option value="draft">Bản nháp (Draft)</option>
                <option value="scheduled">Lên lịch đăng (Scheduled)</option>
              </select>
            </div>

            {status === "scheduled" && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Ngày giờ xuất bản tự động
                </label>
                <div className="flex items-center gap-2 px-3 py-2 border border-stone-200 rounded-xl">
                  <Calendar className="w-4 h-4 text-stone-400" />
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full text-xs text-stone-800 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Ảnh đại diện (Featured Image) */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wide">
                Ảnh đại diện
              </h3>
              <button
                type="button"
                onClick={() => {
                  setMediaPickerTarget("featured");
                  setIsMediaPickerOpen(true);
                }}
                className="text-xs text-[#8F4E00] font-semibold hover:underline cursor-pointer"
              >
                {featuredImage ? "Thay đổi" : "Chọn ảnh"}
              </button>
            </div>

            {featuredImage ? (
              <div className="relative rounded-xl border border-stone-200 overflow-hidden aspect-video group bg-stone-100">
                <img
                  src={featuredImage}
                  alt="Ảnh đại diện"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMediaPickerTarget("featured");
                      setIsMediaPickerOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white text-stone-900 text-xs font-semibold shadow-md cursor-pointer hover:bg-stone-100"
                  >
                    Đổi ảnh
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeaturedImage("")}
                    className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold shadow-md cursor-pointer hover:bg-red-700"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => {
                  setMediaPickerTarget("featured");
                  setIsMediaPickerOpen(true);
                }}
                className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center bg-stone-50/50 hover:bg-[#FAF4EF] hover:border-[#8F4E00]/40 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                <p className="text-xs font-medium text-stone-600">Nhấp để chọn ảnh đại diện</p>
                <p className="text-[10px] text-stone-400 mt-1">Từ thư viện hoặc máy tính</p>
              </div>
            )}
          </div>

          {/* 3. Phân loại & Chuyên mục */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wide border-b border-stone-100 pb-2">
              Phân loại bài viết
            </h3>

            {/* Nhóm phân loại chính */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Phân hệ chính
              </label>
              <select
                value={mainCategory}
                onChange={(e) =>
                  setMainCategory(e.target.value as "van-hoa" | "lich-su" | "tin-tuc")
                }
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-white font-medium focus:outline-none focus:border-[#8F4E00]"
              >
                <option value="van-hoa">Văn Hóa (Đền tháp, lễ hội, làng nghề)</option>
                <option value="lich-su">Lịch Sử (Khảo cổ, vương triều, di tích)</option>
                <option value="tin-tuc">Tin Tức (Sự kiện, bảo tồn, cộng đồng)</option>
              </select>
            </div>

            {/* Chuyên mục con */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Chuyên mục cụ thể
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-white font-medium focus:outline-none focus:border-[#8F4E00]"
              >
                <option value="">-- Chọn chuyên mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} ({c.main_category})
                  </option>
                ))}
              </select>
            </div>

            {/* Huy hiệu Badge */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Huy hiệu nhãn (Badge)
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Khảo Cứu Di Sản, UNESCO Vinh Danh..."
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
              />
            </div>

            {/* Thẻ Tags */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Từ khóa / Thẻ (Tags)
              </label>
              <input
                type="text"
                placeholder="Gõ thẻ rồi nhấn Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] mb-2"
              />
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF4EF] text-[#8F4E00] text-[11px] font-semibold border border-[#E8D5CB]"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Tác giả & Địa điểm điền dã */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wide border-b border-stone-100 pb-2">
              Thông tin thực địa
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Tên tác giả / Ban biên tập
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Địa điểm điền dã (Field Location)
              </label>
              <div className="flex items-center gap-2 px-3 py-2 border border-stone-200 rounded-xl">
                <MapPin className="w-4 h-4 text-[#8F4E00] shrink-0" />
                <input
                  type="text"
                  placeholder="Ví dụ: Ninh Phước, Ninh Thuận"
                  value={fieldLocation}
                  onChange={(e) => setFieldLocation(e.target.value)}
                  className="w-full text-xs text-stone-800 focus:outline-none bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaSelected}
        title={mediaPickerTarget === "featured" ? "Chọn ảnh đại diện" : "Chèn ảnh vào nội dung"}
      />

      {/* Preview Modal */}
      <BlogPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        post={previewPostData}
      />
    </div>
  );
}
