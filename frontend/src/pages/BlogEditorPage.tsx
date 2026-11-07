import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Sparkles,
  Image as ImageIcon,
  Quote,
  Heading2,
  Heading3,
  List,
  Clock,
  Compass,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import BlogPreviewModal from "../components/blog/BlogPreviewModal";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const PRESET_COVER_IMAGES = [
  {
    label: "Tháp Po Klong Garai",
    url: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Làng gốm Bàu Trúc",
    url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Thổ cẩm Mỹ Nghiệp",
    url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Lễ hội & Nhạc cụ Saranai",
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function BlogEditorPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const isEditMode = Boolean(id);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(PRESET_COVER_IMAGES[0].url);
  const [mainCategory, setMainCategory] = useState<"tin-tuc" | "lich-su" | "van-hoa">("van-hoa");
  const [category, setCategory] = useState("craft");
  const [badge, setBadge] = useState("Khảo Cứu Di Sản");
  const [fieldLocation, setFieldLocation] = useState("Ninh Phước, Ninh Thuận");
  const [authorName, setAuthorName] = useState(user?.fullName || "Ban Quản Trị Di Sản");
  const [status, setStatus] = useState<"draft" | "published">("published");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Tự sinh Slug từ Title khi người dùng chưa tự sửa slug
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
  };

  // Tính toán thời gian đọc tự động
  const calculateReadTime = (text: string) => {
    if (!text) return "3 phút đọc";
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} phút đọc`;
  };

  // Lấy dữ liệu bài viết nếu đang ở chế độ chỉnh sửa (Edit Mode)
  useEffect(() => {
    if (isEditMode && id) {
      const fetchPostDetail = async () => {
        try {
          const res = await fetch(`${API_BASE}/posts/admin/all`, {
            headers: {
              Authorization: `Bearer ${token || "mock-admin-token"}`,
            },
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            const current = data.data.find((p: any) => p.id === id);
            if (current) {
              setTitle(current.title || "");
              setSlug(current.slug || "");
              setIsSlugManual(true);
              setExcerpt(current.excerpt || "");
              setContent(current.content || "");
              setCoverImage(current.coverImage || PRESET_COVER_IMAGES[0].url);
              setMainCategory(current.mainCategory || "van-hoa");
              setCategory(current.category || "craft");
              setBadge(current.badge || "Khảo Cứu Di Sản");
              setFieldLocation(current.fieldLocation || "");
              setAuthorName(current.authorName || user?.fullName || "Ban Quản Trị Di Sản");
              setStatus(current.status || "published");
            }
          }
        } catch (err) {
          console.error("Lỗi tải chi tiết bài viết:", err);
          toast.error("Không thể tải thông tin bài viết cần chỉnh sửa.");
        }
      };
      fetchPostDetail();
    }
  }, [isEditMode, id, token, user?.fullName]);

  // Toolbar Insert Helpers
  const insertTextAtCursor = (prefix: string, suffix: string = "") => {
    setContent((prev) => {
      return prev ? `${prev}\n\n${prefix}${suffix}` : `${prefix}${suffix}`;
    });
  };

  const handleInsertH2 = () => insertTextAtCursor("## Tiêu đề mục nghiên cứu mới");
  const handleInsertH3 = () => insertTextAtCursor("### Khía cạnh văn hóa chi tiết");
  const handleInsertQuote = () =>
    insertTextAtCursor('> "Di sản văn hóa Champa là dòng chảy tiếp nối qua từng thế hệ nghệ nhân."');
  const handleInsertList = () =>
    insertTextAtCursor("- Điểm nổi bật thứ nhất\n- Điểm nổi bật thứ hai\n- Điểm nổi bật thứ ba");
  const handleInsertImage = () => {
    insertTextAtCursor(
      `![Hiện vật khảo cổ](https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80)\n*Chú thích: Chiếc bình gốm ngấn khói Bàu Trúc nung lộ thiên.*`
    );
  };

  // Nạp mẫu bài viết khảo cứu mẫu
  const handleLoadTemplate = () => {
    setTitle("Bí ẩn nghệ thuật dệt thổ cẩm cổ truyền làng Mỹ Nghiệp");
    setSlug("bi-an-nghe-thuat-det-tho-cam-my-nghiep");
    setExcerpt(
      "Tìm hiểu những hoa văn hình học cổ, sợi chỉ nhuộm từ vỏ cây rừng và triết lý âm dương của người Chăm thể hiện qua từng mét vải dệt tay."
    );
    setContent(`## 1. Nguồn gốc làng dệt cổ nhất Đông Nam Á\n\nLàng Mỹ Nghiệp (Paley Ca-kheng) thuộc thị trấn Phước Dân, huyện Ninh Phước, tỉnh Ninh Thuận. Nơi đây là cái nôi gìn giữ kỹ nghệ dệt vải Chăm từ thời vua Po Klong Garai.\n\nNgười phụ nữ Chăm sử dụng khung dệt gỗ truyền thống, phối hợp nhịp nhàng giữa tay luồn con thoi và chân dập lược nén sợi.\n\n> "Từng hoa văn rồng bay, vân mây hay văn bia thần Shiva trên tấm khăn Matra là ngôn ngữ thị giác biểu đạt vũ trụ quan thiêng liêng của cộng đồng Panduranga."\n\n## 2. Kỹ nghệ nhuộm màu từ thảo mộc thiên nhiên\n\nSợi bông tự nhiên được nhuộm bằng vỏ cây tràm, vỏ hạt điều nhuộm đỏ gạch, cây chàm cho sắc lam thẫm và củ nghệ già cho sắc vàng tươi. Màu sắc lưu giữ độ bền hàng chục năm không phai.`);
    setMainCategory("van-hoa");
    setCategory("craft");
    setBadge("UNESCO Vinh Danh");
    setFieldLocation("Làng Mỹ Nghiệp, Ninh Phước, Ninh Thuận");
    toast.success("Đã nạp nội dung mẫu bài viết khảo cứu!");
  };

  // Gửi form lưu bài viết (Tạo mới hoặc Sửa)
  const handleSubmit = async (targetStatus: "draft" | "published") => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập Tiêu đề bài viết!");
      return;
    }
    if (!content.trim()) {
      toast.error("Vui lòng nhập Nội dung bài viết!");
      return;
    }

    setIsSubmitting(true);
    const postPayload = {
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      excerpt: excerpt.trim() || content.slice(0, 150),
      content: content.trim(),
      coverImage: coverImage.trim(),
      mainCategory,
      category,
      badge: badge.trim(),
      fieldLocation: fieldLocation.trim(),
      readTime: calculateReadTime(content),
      authorName: authorName.trim(),
      status: targetStatus,
    };

    try {
      const url = isEditMode ? `${API_BASE}/posts/${id}` : `${API_BASE}/posts`;
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || "mock-admin-token"}`,
        },
        body: JSON.stringify(postPayload),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Không thể lưu bài viết.");
      }

      toast.success(
        targetStatus === "published"
          ? "🎉 Đăng bài viết lên Blog thành công!"
          : "💾 Đã lưu bản nháp bài viết thành công!"
      );

      navigate("/admin/blog/quan-ly");
    } catch (err: any) {
      console.error("Lỗi đăng bài:", err);
      toast.error(err.message || "Đã xảy ra lỗi trong quá trình lưu bài.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fff8f6] min-h-screen text-on-surface font-body-md flex flex-col antialiased">
      {/* 1. Header Admin Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-outline-variant/50 shadow-xs px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/blog/quan-ly"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-container"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Quản lý bài viết</span>
          </Link>
          <div className="h-4 w-px bg-outline-variant/40 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm sm:text-base text-primary">
              {isEditMode ? "Chỉnh sửa bài viết khảo cứu" : "Soạn thảo bài viết mới"}
            </span>
            <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-secondary/10 text-secondary border border-secondary/20">
              Quyền Quản trị viên (Admin)
            </span>
          </div>
        </div>

        {/* Nút thao tác trên cùng */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadTemplate}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant/50 text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-all"
            title="Tải bài viết mẫu để xem bố cục"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Nạp bài mẫu</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-primary" />
            <span>Xem trước</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit("draft")}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-primary/30 text-primary hover:bg-primary/5 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu nháp</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit("published")}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isEditMode ? "Cập nhật bài" : "Xuất bản ngay"}</span>
          </button>
        </div>
      </header>

      {/* 2. Main Editor 2-Column Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CỘT TRÁI (8/12): TIÊU ĐỀ, TÓM TẮT & SOẠN THẢO NỘI DUNG */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Card Tiêu đề & Đoạn dẫn dắt */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-outline-variant/40 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                Tiêu đề bài viết khảo cứu <span className="text-red-500">*</span>
              </label>
              <textarea
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Nhập tiêu đề bài viết (Ví dụ: Kỹ thuật nung gốm lộ thiên Bàu Trúc...)"
                rows={2}
                className="w-full font-serif text-xl sm:text-2xl font-bold p-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none leading-snug placeholder:text-outline/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Đoạn tóm tắt / Lời dẫn đầu trang (Excerpt)
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Tóm tắt ngắn 1-2 câu về di sản, bối cảnh lịch sử hoặc thông điệp cốt lõi..."
                rows={2}
                className="w-full font-body-md text-sm p-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none leading-relaxed placeholder:text-outline/40"
              />
            </div>
          </div>

          {/* Card Trình Soạn Thảo Phong Phú */}
          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/40 flex flex-col flex-1 overflow-hidden">
            {/* Toolbar công cụ */}
            <div className="bg-[#fff1ec]/70 px-3 py-2 border-b border-outline-variant/30 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={handleInsertH2}
                  className="px-2.5 py-1 rounded-lg hover:bg-white text-xs font-bold text-on-surface flex items-center gap-1 transition-colors border border-transparent hover:border-outline-variant/30"
                  title="Thêm Tiêu đề mục chính (H2)"
                >
                  <Heading2 className="w-3.5 h-3.5 text-secondary" />
                  <span>Mục H2</span>
                </button>
                <button
                  type="button"
                  onClick={handleInsertH3}
                  className="px-2.5 py-1 rounded-lg hover:bg-white text-xs font-bold text-on-surface flex items-center gap-1 transition-colors border border-transparent hover:border-outline-variant/30"
                  title="Thêm Tiêu đề mục con (H3)"
                >
                  <Heading3 className="w-3.5 h-3.5 text-primary" />
                  <span>Mục H3</span>
                </button>
                <button
                  type="button"
                  onClick={handleInsertQuote}
                  className="px-2.5 py-1 rounded-lg hover:bg-white text-xs font-bold text-on-surface flex items-center gap-1 transition-colors border border-transparent hover:border-outline-variant/30"
                  title="Thêm Trích dẫn văn học Chăm (Quote)"
                >
                  <Quote className="w-3.5 h-3.5 text-amber-700" />
                  <span>Trích dẫn</span>
                </button>
                <button
                  type="button"
                  onClick={handleInsertList}
                  className="px-2.5 py-1 rounded-lg hover:bg-white text-xs font-bold text-on-surface flex items-center gap-1 transition-colors border border-transparent hover:border-outline-variant/30"
                  title="Thêm Danh sách điểm nhấn"
                >
                  <List className="w-3.5 h-3.5 text-teal-700" />
                  <span>Danh sách</span>
                </button>
                <button
                  type="button"
                  onClick={handleInsertImage}
                  className="px-2.5 py-1 rounded-lg hover:bg-white text-xs font-bold text-on-surface flex items-center gap-1 transition-colors border border-transparent hover:border-outline-variant/30"
                  title="Chèn ảnh tư liệu kèm chú thích"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Ảnh tư liệu</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Ước tính: {calculateReadTime(content)}</span>
              </div>
            </div>

            {/* Vùng nhập văn bản chính */}
            <div className="p-4 flex-1 flex flex-col min-h-[380px]">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung bài viết khảo cứu tại đây. Hỗ trợ định dạng Tiêu đề (##), Trích dẫn (>), Danh sách (-)..."
                className="w-full flex-1 p-3 font-serif text-base leading-relaxed text-on-surface outline-none border border-transparent focus:border-outline-variant/40 rounded-xl resize-y min-h-[320px] placeholder:text-outline/40"
              />
            </div>

            {/* Footer hướng dẫn cú pháp nhanh */}
            <div className="bg-[#fff8f6] px-4 py-2 border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-on-surface-variant">
              <span>Định dạng hỗ trợ: ## Tiêu đề lớn | ### Tiêu đề nhỏ | &gt; Trích dẫn thơ văn</span>
              <span>Tổng số từ: {content ? content.trim().split(/\s+/).length : 0} từ</span>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (4/12): THIẾT LẬP XUẤT BẢN & METADATA */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Card 1: Trạng thái xuất bản */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/40 space-y-3">
            <h3 className="font-serif font-bold text-sm text-on-surface flex items-center gap-1.5 border-b border-outline-variant/30 pb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Trạng thái xuất bản</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus("published")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${status === "published"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs"
                    : "border-outline-variant/40 text-on-surface-variant hover:bg-surface-container"
                  }`}
              >
                <span>Xuất bản ngay</span>
                <span className="text-[10px] font-normal opacity-80">Hiển thị cho độc giả</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus("draft")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${status === "draft"
                    ? "bg-amber-50 border-amber-500 text-amber-800 shadow-xs"
                    : "border-outline-variant/40 text-on-surface-variant hover:bg-surface-container"
                  }`}
              >
                <span>Bản nháp (Draft)</span>
                <span className="text-[10px] font-normal opacity-80">Chỉ admin nhìn thấy</span>
              </button>
            </div>
          </div>

          {/* Card 2: Chuyên mục & Địa danh khảo cứu */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/40 space-y-3">
            <h3 className="font-serif font-bold text-sm text-on-surface flex items-center gap-1.5 border-b border-outline-variant/30 pb-2">
              <Compass className="w-4 h-4 text-primary" />
              <span>Chuyên mục & Phân loại</span>
            </h3>

            {/* Chuyên mục chính */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Chuyên mục chính
              </label>
              <select
                value={mainCategory}
                onChange={(e) => setMainCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-outline-variant/50 text-xs font-medium bg-white focus:border-primary outline-none"
              >
                <option value="van-hoa">✨ Văn hóa & Nghệ thuật</option>
                <option value="lich-su">🏛️ Tiến trình Lịch sử</option>
                <option value="tin-tuc">📰 Tin tức & Sự kiện</option>
              </select>
            </div>

            {/* Chuyên đề phụ */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Chuyên đề di sản
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-outline-variant/50 text-xs font-medium bg-white focus:border-primary outline-none"
              >
                <option value="craft">🏺 Làng nghề Cổ truyền & UNESCO</option>
                <option value="kalan">🏰 Kiến trúc Đền tháp Kalan</option>
                <option value="ritual">🕊️ Phong tục & Mùa Lễ hội</option>
                <option value="music">🎺 Âm nhạc cổ & Điệu múa thiêng</option>
                <option value="archaeology">📜 Khảo cổ học & Bi ký</option>
                <option value="cuisine">🍲 Ẩm thực & Dược thảo Paley</option>
              </select>
            </div>

            {/* Địa danh thực địa */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Địa điểm khảo cứu
              </label>
              <input
                type="text"
                value={fieldLocation}
                onChange={(e) => setFieldLocation(e.target.value)}
                placeholder="VD: Tháp Po Klong Garai, Đô Vinh, Ninh Thuận"
                className="w-full p-2.5 rounded-xl border border-outline-variant/50 text-xs font-medium focus:border-primary outline-none"
              />
            </div>

            {/* Nhãn nổi bật */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Nhãn huy hiệu (Badge)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="VD: UNESCO Vinh Danh, Khảo cổ thế kỷ XII..."
                className="w-full p-2.5 rounded-xl border border-outline-variant/50 text-xs font-medium focus:border-primary outline-none"
              />
            </div>

            {/* Tên Tác giả */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Tác giả bài viết
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="VD: Ban Nghiên Cứu Di Sản Panduranga"
                className="w-full p-2.5 rounded-xl border border-outline-variant/50 text-xs font-medium focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Card 3: Ảnh Bìa Đại Diện */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/40 space-y-3">
            <h3 className="font-serif font-bold text-sm text-on-surface flex items-center gap-1.5 border-b border-outline-variant/30 pb-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              <span>Ảnh bìa đại diện (Cover Image)</span>
            </h3>

            {/* Ảnh xem trước */}
            {coverImage && (
              <div className="relative rounded-xl overflow-hidden aspect-video border border-outline-variant/40 bg-surface-container">
                <img src={coverImage} alt="Ảnh bìa bài viết" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Input link ảnh */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Đường dẫn ảnh (URL)
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 rounded-xl border border-outline-variant/50 text-xs font-medium focus:border-primary outline-none"
              />
            </div>

            {/* Kho ảnh mẫu nhanh */}
            <div>
              <label className="block text-[11px] font-semibold text-outline mb-1.5">
                Chọn nhanh từ kho ảnh di sản mẫu:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {PRESET_COVER_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCoverImage(preset.url)}
                    className="p-1.5 rounded-lg border border-outline-variant/30 hover:border-primary text-[10px] text-left truncate hover:bg-surface-container transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4: Cấu hình SEO & Slug */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/40 space-y-3">
            <h3 className="font-serif font-bold text-sm text-on-surface flex items-center gap-1.5 border-b border-outline-variant/30 pb-2">
              <ExternalLink className="w-4 h-4 text-secondary" />
              <span>Cấu hình SEO & Đường dẫn URL</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Đường dẫn thân thiện (Slug)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugManual(true);
                }}
                placeholder="duong-dan-bai-viet"
                className="w-full p-2.5 rounded-xl border border-outline-variant/50 text-xs font-mono focus:border-primary outline-none"
              />
              <span className="text-[10px] text-on-surface-variant mt-1 block">
                URL công khai: /blog/{slug || "duong-dan-bai-viet"}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Modal Live Preview */}
      <BlogPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        post={{
          title,
          excerpt,
          content,
          coverImage,
          mainCategory,
          category,
          badge,
          fieldLocation,
          readTime: calculateReadTime(content),
          authorName,
          status,
        }}
      />
    </div>
  );
}
