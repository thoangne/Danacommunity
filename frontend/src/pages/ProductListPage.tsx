import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  Eye,
  Check,
  X,
  Flame,
  RotateCcw,
  Compass,
  Phone,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import AudioPlayerBar from "../components/AudioPlayerBar";
import {
  CRAFT_PRODUCTS,
  CRAFT_CATEGORIES,
} from "../data/productData";
import type { CraftProduct } from "../data/productData";
import { ARTISANS } from "../data/champaData";
import { toast } from "../components/ui/sonner";

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // State lọc & tìm kiếm
  const initialCat = searchParams.get("category") || "all";
  const initialArtisan = searchParams.get("artisan")
    ? Number(searchParams.get("artisan"))
    : null;

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedArtisanId, setSelectedArtisanId] = useState<number | null>(initialArtisan);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");

  // State Modal Xem nhanh
  const [previewProduct, setPreviewProduct] = useState<CraftProduct | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // State Modal Đặt hàng / Tư vấn tác phẩm
  const [orderModalProduct, setOrderModalProduct] = useState<CraftProduct | null>(null);
  const [orderForm, setOrderForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    requestType: "Tư vấn tác phẩm độc bản",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Đồng bộ URL params
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
    const art = searchParams.get("artisan");
    if (art) setSelectedArtisanId(Number(art));
  }, [searchParams]);

  // Bộ lọc sản phẩm
  const filteredProducts = useMemo(() => {
    return CRAFT_PRODUCTS.filter((product) => {
      const matchCat =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchArtisan =
        selectedArtisanId === null || product.artisanId === selectedArtisanId;
      const matchBadge =
        selectedBadge === "all" || product.badgeType === selectedBadge;
      const matchSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.materials.some((m) =>
          m.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchCat && matchArtisan && matchBadge && matchSearch;
    }).sort((a, b) => {
      if (sortBy === "price-asc") {
        return (a.rawPrice || 0) - (b.rawPrice || 0);
      }
      if (sortBy === "price-desc") {
        return (b.rawPrice || 0) - (a.rawPrice || 0);
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name, "vi");
      }
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, selectedArtisanId, selectedBadge, searchQuery, sortBy]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", catId);
    }
    setSearchParams(searchParams);
  };

  const handleArtisanFilter = (artisanId: number | null) => {
    setSelectedArtisanId(artisanId);
    if (artisanId === null) {
      searchParams.delete("artisan");
    } else {
      searchParams.set("artisan", String(artisanId));
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedArtisanId(null);
    setSelectedBadge("all");
    setSearchQuery("");
    setSortBy("featured");
    setSearchParams({});
  };

  const handleOpenPreview = (product: CraftProduct) => {
    setPreviewProduct(product);
    setActiveImageIndex(0);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.fullName.trim() || !orderForm.phone.trim()) {
      toast.error("Vui lòng nhập họ tên và số điện thoại liên hệ!");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Gửi yêu cầu thỉnh tác phẩm thành công!", {
        description: `Ban quản lý làng nghề & nghệ nhân sẽ liên hệ với bạn trong vòng 24 giờ qua số ${orderForm.phone}.`,
      });
      setOrderModalProduct(null);
      setOrderForm({
        fullName: "",
        phone: "",
        email: "",
        requestType: "Tư vấn tác phẩm độc bản",
        notes: "",
      });
    }, 800);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <Header
        onToggleAudio={() => setIsAudioPlaying(!isAudioPlaying)}
        isAudioPlaying={isAudioPlaying}
      />

      <main className="w-full pt-16 xl:pt-20 bg-surface flex-1">
        {/* ========================================================
            1. Hero Banner: Tinh hoa thủ công Panduranga
        ======================================================== */}
        <section className="relative w-full bg-gradient-to-b from-surface-container-low via-surface to-surface py-space-xl overflow-hidden border-b border-surface-container-high/60">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center text-on-surface-variant font-label-md text-xs sm:text-sm gap-space-xs tracking-wider uppercase mb-space-sm">
              <Link className="hover:text-primary transition-colors" to="/">
                Trang chủ
              </Link>
              <span className="text-outline/60">/</span>
              <span className="text-primary font-bold">Sản phẩm Di sản</span>
            </div>

            {/* Split Hero Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center mt-space-sm">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-xs font-bold uppercase tracking-widest mb-space-xs border border-primary/20">
                  <Flame className="w-3.5 h-3.5 text-primary" />
                  Di sản Đất & Sợi Panduranga
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl xl:text-5xl text-on-surface font-bold leading-tight mt-space-xs">
                  Tác Phẩm Thủ Công Độc Bản
                </h1>
                <p className="font-body-md text-sm sm:text-base text-on-surface-variant mt-space-sm max-w-2xl leading-relaxed">
                  Mỗi tác phẩm là tinh hoa được nắn vuốt bằng đôi chân đi giật lùi,
                  dệt từng nhịp thoi cài hoa văn cổ hoàng cung hay gọt đẽo từ gỗ mun rừng.
                  Không qua khuôn đúc công nghiệp — lưu giữ trọn vẹn hồn cốt của đất trời và tiền nhân Champa.
                </p>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-space-lg max-w-lg">
                  <div className="p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30">
                    <span className="font-serif text-xl sm:text-2xl font-bold text-primary block">
                      100%
                    </span>
                    <span className="font-label-sm text-[11px] text-on-surface-variant block mt-0.5">
                      Thủ công truyền thống
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30">
                    <span className="font-serif text-xl sm:text-2xl font-bold text-secondary block">
                      UNESCO
                    </span>
                    <span className="font-label-sm text-[11px] text-on-surface-variant block mt-0.5">
                      Gốm Chăm ghi danh
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30">
                    <span className="font-serif text-xl sm:text-2xl font-bold text-amber-700 block">
                      4+
                    </span>
                    <span className="font-label-sm text-[11px] text-on-surface-variant block mt-0.5">
                      Làng nghề lưu giữ
                    </span>
                  </div>
                </div>

                {/* Thông tin liên hệ tư vấn & đặt tác phẩm trực tiếp */}
                <div className="mt-space-md p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex flex-wrap items-center justify-between gap-3 max-w-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">
                        Hotline Tư Vấn Đặt Tác Phẩm & Giao Tận Nơi
                      </span>
                      <a
                        href="tel:0918388998"
                        className="font-serif text-sm font-bold text-on-surface hover:text-primary transition-colors block"
                      >
                        0918.388.998 • Zalo Nghệ Nhân Chăm
                      </a>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold">
                    Trực tiếp từ xưởng làng nghề
                  </span>
                </div>
              </div>

              {/* Hero Spotlight Right: Featured Highlight Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden bg-surface-container-lowest border border-outline-variant/40 shadow-lg p-3 group">
                  <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-surface-container">
                    <img
                      src="/images/dana-life/IMG_9911.JPG"
                      alt="Bình gốm Bàu Trúc độc bản"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-white text-xs font-bold shadow-xs">
                      Tác phẩm Spotlight
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[11px] uppercase tracking-wider text-primary-fixed block font-semibold">
                        Gốm Mẹ Bàu Trúc • Muk Đàng Thị Phan
                      </span>
                      <h3 className="font-serif text-lg font-bold">
                        Bình Gốm Ngấn Khói Lộ Thiên Cổ Truyền
                      </h3>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-on-surface-variant block">Giá tham khảo thỉnh tác phẩm:</span>
                      <span className="font-serif text-base font-bold text-primary">1.850.000 ₫</span>
                    </div>
                    <button
                      onClick={() => handleOpenPreview(CRAFT_PRODUCTS[0])}
                      className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-1 shadow-xs"
                      type="button"
                    >
                      <span>Xem câu chuyện</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. Bộ lọc thông minh & Thanh điều khiển
        ======================================================== */}
        <section className="sticky top-16 xl:top-20 z-30 bg-surface/95 backdrop-blur-md border-b border-surface-container-high py-3 shadow-xs">
          <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
            {/* Lọc danh mục chính (Category Pills) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CRAFT_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5 ${isActive
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:bg-surface-container hover:text-on-surface"
                      }`}
                    type="button"
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive
                          ? "bg-white/20 text-white"
                          : "bg-surface-container-high text-on-surface-variant"
                        }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Thanh tìm kiếm & Tùy chọn lọc phụ */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-3 pt-2 border-t border-outline-variant/20">
              {/* Ô tìm kiếm */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tác phẩm, chất liệu, làng nghề..."
                  className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/50 focus:outline-none focus:border-primary text-on-surface placeholder:text-outline-variant"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                    type="button"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Lọc theo Huy hiệu / Chứng nhận & Sắp xếp */}
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto justify-between md:justify-end">
                {/* Lọc theo nghệ nhân (nếu đang được chọn) */}
                {selectedArtisanId && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-xs font-semibold shrink-0">
                    <span>
                      Tác giả: {ARTISANS.find((a) => a.id === selectedArtisanId)?.name}
                    </span>
                    <button
                      onClick={() => handleArtisanFilter(null)}
                      className="hover:text-red-700"
                      type="button"
                      title="Bỏ lọc nghệ nhân"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Huy hiệu */}
                <select
                  value={selectedBadge}
                  onChange={(e) => setSelectedBadge(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="all">Tất cả chứng nhận</option>
                  <option value="unesco">Độc bản UNESCO</option>
                  <option value="exclusive">Đồ án Cung đình / Độc quyền</option>
                  <option value="traditional">Cổ truyền dân tộc</option>
                  <option value="ocop">Chứng nhận OCOP</option>
                </select>

                {/* Sắp xếp */}
                <div className="flex items-center gap-1 shrink-0">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-outline" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs px-2.5 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary font-medium"
                  >
                    <option value="featured">Nổi bật nhất</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="name">Tên tác phẩm (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. Lưới tác phẩm thủ công (Boutique Gallery Grid)
        ======================================================== */}
        <section className="py-space-xl">
          <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
            {/* Header kết quả */}
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-on-surface">
                  Bộ Sưu Tập Tác Phẩm
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Hiển thị{" "}
                  <span className="font-bold text-primary">
                    {filteredProducts.length}
                  </span>{" "}
                  tác phẩm được giám tuyển từ các nghệ nhân bản địa
                </p>
              </div>

              {(selectedCategory !== "all" ||
                selectedArtisanId !== null ||
                selectedBadge !== "all" ||
                searchQuery !== "") && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 text-xs text-secondary hover:underline font-semibold"
                    type="button"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Đặt lại bộ lọc</span>
                  </button>
                )}
            </div>

            {/* Empty state */}
            {filteredProducts.length === 0 ? (
              <div className="p-space-xl rounded-3xl bg-surface-container-low text-center border border-outline-variant/30 max-w-lg mx-auto my-12">
                <Sparkles className="w-12 h-12 text-outline/50 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-on-surface">
                  Không tìm thấy tác phẩm phù hợp
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 mb-4 leading-relaxed">
                  Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các tiêu chí lọc hiện tại.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all"
                  type="button"
                >
                  Xem tất cả tác phẩm
                </button>
              </div>
            ) : (
              /* Grid tác phẩm */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-md xl:gap-space-lg">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="group rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/50 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-surface-container-high">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Badge trên ảnh */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-primary shadow-xs border border-outline-variant/20">
                          {product.categoryLabel}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-secondary/90 text-white shadow-xs">
                          {product.badge}
                        </span>
                      </div>

                      {/* Quick action button on hover */}
                      <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenPreview(product)}
                          className="p-2 rounded-xl bg-white/95 backdrop-blur-md text-on-surface hover:text-primary shadow-md hover:scale-105 transition-all"
                          type="button"
                          title="Xem nhanh chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Làng nghề */}
                        <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
                          <Compass className="w-3 h-3" />
                          {product.village}
                        </span>

                        {/* Tên tác phẩm */}
                        <h3 className="font-serif text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1 mt-1">
                          {product.name}
                        </h3>

                        {/* Mô tả ngắn */}
                        <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                          {product.summary}
                        </p>

                        {/* Thông số chất liệu */}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {product.materials.slice(0, 2).map((mat, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-surface-container text-on-surface-variant font-medium"
                            >
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer card: Tác giả & Giá / CTA */}
                      <div className="mt-3.5 pt-3 border-t border-outline-variant/30">
                        {/* Nghệ nhân chế tác */}
                        <Link
                          to={`/nghe-nhan#artisan-${product.artisanId}`}
                          className="flex items-center gap-2 group/author hover:bg-surface-container-low p-1 rounded-lg transition-colors mb-2"
                        >
                          <img
                            src={product.artisanAvatar}
                            alt={product.artisanName}
                            className="w-6 h-6 rounded-full object-cover border border-primary/50 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[11px] font-bold text-primary group-hover/author:underline truncate block">
                              {product.artisanName}
                            </span>
                          </div>
                        </Link>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-on-surface-variant block">
                              Giá tham khảo:
                            </span>
                            <span className="font-serif text-sm font-bold text-primary block">
                              {product.priceEstimate}
                            </span>
                            <span className="text-[10px] text-secondary font-medium flex items-center gap-1 mt-0.5">
                              <Phone className="w-2.5 h-2.5 text-primary" /> Hotline: 0918.388.998
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenPreview(product)}
                              className="px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface text-[11px] font-semibold hover:bg-surface-container-high transition-colors"
                              type="button"
                            >
                              Chi tiết
                            </button>
                            <button
                              onClick={() => setOrderModalProduct(product)}
                              className="px-2.5 py-1.5 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary/90 transition-colors shadow-xs"
                              type="button"
                            >
                              Thỉnh tác phẩm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ========================================================
            4. Phân đoạn: Quy trình chế tác độc bản (Behind The Craft)
        ======================================================== */}
        <section className="py-space-xl bg-surface-container-low border-t border-b border-surface-container-high/60">
          <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
            <div className="text-center max-w-2xl mx-auto mb-space-lg">
              <span className="font-label-md text-xs font-bold text-secondary uppercase tracking-widest block mb-1">
                Kỹ Thuật Cổ Xưa Ngàn Năm
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
                Quy Trình Chế Tác Độc Bản Panduranga
              </h2>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                Tại Bàu Trúc hay Mỹ Nghiệp, người nghệ nhân gìn giữ những kỹ nghệ
                chưa từng biến đổi qua hàng chục thế kỷ: từ bước chân giật lùi đến ngấn khói vỏ trấu.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs relative">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center mb-3">
                  01
                </span>
                <h3 className="font-serif text-base font-bold text-on-surface mb-1">
                  Khai thác đất & sợi thảo mộc
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Đất sét phù sa mịn khai thác từ lòng sông Quao chỉ có ở mùa khô;
                  bông vải kéo sợi và ngâm nhuộm trong nước lá cây rừng tự nhiên.
                </p>
              </div>

              <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs relative">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center mb-3">
                  02
                </span>
                <h3 className="font-serif text-base font-bold text-on-surface mb-1">
                  Xoay chân giật lùi & dệt khung
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Không dùng bàn xoay, nghệ nhân dùng chính cơ thể đi giật lùi miết tạo dáng gốm;
                  ngồi bệt xuống sàn điều khiển nhịp con thoi chuẩn từng mắt sợi.
                </p>
              </div>

              <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs relative">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center mb-3">
                  03
                </span>
                <h3 className="font-serif text-base font-bold text-on-surface mb-1">
                  Nung củi lộ thiên 800°C
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Không dùng lò kín, gốm được chất đống ngoài trời phủ củi và rơm rạ,
                  đốt bằng lửa trần để đón ngọn gió đồi cát hun đúc độ bền rắn chắc.
                </p>
              </div>

              <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs relative">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center mb-3">
                  04
                </span>
                <h3 className="font-serif text-base font-bold text-on-surface mb-1">
                  Nước trâm bầu & ngấn khói thiêng
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Lúc gốm còn đỏ rực, nghệ nhân vẩy nước vỏ hạt điều hoặc lá trâm bầu;
                  vệt khói đen loang tự nhiên biến mỗi sản phẩm thành một kiệt tác độc nhất vô nhị.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            5. CTA: Thỉnh tác phẩm theo yêu cầu & Trải nghiệm làng nghề
        ======================================================== */}
        <section className="py-space-xl">
          <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
            <div className="rounded-3xl bg-gradient-to-r from-primary via-primary/95 to-secondary p-space-lg sm:p-space-xl text-white shadow-xl relative overflow-hidden">
              <div className="max-w-2xl relative z-10">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white font-label-sm text-xs font-bold uppercase tracking-wider inline-block mb-2">
                  Dịch vụ Giám tuyển & Đặt riêng
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                  Bạn muốn chế tác tác phẩm độc bản riêng hoặc ghé thăm xưởng làng nghề?
                </h2>
                <p className="text-xs sm:text-sm text-white/80 mt-space-sm leading-relaxed">
                  Đội ngũ DanaCommunity kết nối trực tiếp bạn với các nghệ nhân ưu tú tại Bàu Trúc,
                  Mỹ Nghiệp và Hữu Đức để tạo tác kích thước riêng hoặc sắp xếp trải nghiệm học nghề.
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-space-md">
                  <button
                    onClick={() => {
                      setOrderModalProduct(CRAFT_PRODUCTS[0]);
                      setOrderForm((prev) => ({
                        ...prev,
                        requestType: "Đặt chế tác độc bản theo yêu cầu",
                      }));
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white text-primary text-xs font-bold hover:bg-white/90 transition-all shadow-md"
                    type="button"
                  >
                    Đăng ký tư vấn chế tác
                  </button>
                  <Link
                    to="/tour"
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/30 transition-all"
                  >
                    Xem Dana Tour Làng Nghề →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================
          MODAL 1: Quick View Chi Tiết Tác Phẩm
      ======================================================== */}
      {previewProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="bg-surface rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-outline-variant/40 relative flex flex-col">
            {/* Nút đóng */}
            <button
              onClick={() => setPreviewProduct(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-surface-container-highest text-on-surface hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-xs"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-7">
              {/* Cột trái: Ảnh chi tiết & Thumbnails */}
              <div className="md:col-span-6 flex flex-col gap-3">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container-high border border-outline-variant/30">
                  <img
                    src={previewProduct.images[activeImageIndex] || previewProduct.images[0]}
                    alt={previewProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary text-white shadow-xs">
                    {previewProduct.badge}
                  </span>
                </div>

                {/* Thumbnails */}
                {previewProduct.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {previewProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${activeImageIndex === idx
                            ? "border-primary scale-105 shadow-xs"
                            : "border-outline-variant/40 opacity-70 hover:opacity-100"
                          }`}
                        type="button"
                      >
                        <img
                          src={img}
                          alt="Góc chụp tác phẩm"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Khối nghệ nhân tác giả */}
                <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between mt-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={previewProduct.artisanAvatar}
                      alt={previewProduct.artisanName}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-primary shrink-0"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-primary block">
                        {previewProduct.artisanTitle}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-on-surface">
                        {previewProduct.artisanName}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant">
                        {previewProduct.village}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/nghe-nhan#artisan-${previewProduct.artisanId}`}
                    onClick={() => setPreviewProduct(null)}
                    className="text-xs text-primary font-bold hover:underline shrink-0"
                  >
                    Xem hồ sơ →
                  </Link>
                </div>
              </div>

              {/* Cột phải: Thông tin & Ý nghĩa */}
              <div className="md:col-span-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                    {previewProduct.categoryLabel} • {previewProduct.preservationStatus}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-on-surface mt-1">
                    {previewProduct.name}
                  </h3>
                  <div className="mt-2 text-xl font-serif font-bold text-primary">
                    {previewProduct.priceEstimate}
                  </div>

                  <p className="text-xs sm:text-sm text-on-surface-variant mt-3 leading-relaxed">
                    {previewProduct.description}
                  </p>

                  {/* Ý nghĩa văn hóa */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-primary/5 border border-primary/20">
                    <span className="font-serif text-xs font-bold text-primary block mb-1">
                      Ý Nghĩa Biểu Tượng & Tâm Linh:
                    </span>
                    <p className="text-xs text-on-surface-variant leading-relaxed italic">
                      "{previewProduct.culturalMeaning}"
                    </p>
                  </div>

                  {/* Thông số kỹ thuật */}
                  <div className="mt-4 space-y-1.5 text-xs text-on-surface-variant">
                    <div className="flex justify-between py-1 border-b border-outline-variant/20">
                      <span className="font-semibold text-on-surface">Kích thước:</span>
                      <span>{previewProduct.dimensions}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/20">
                      <span className="font-semibold text-on-surface">Chất liệu:</span>
                      <span>{previewProduct.materials.join(" • ")}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/20">
                      <span className="font-semibold text-on-surface">Thời gian tạo tác:</span>
                      <span>{previewProduct.craftingTime}</span>
                    </div>
                  </div>

                  {/* 4 bước chế tác */}
                  <div className="mt-4">
                    <span className="font-serif text-xs font-bold text-on-surface block mb-2">
                      Quy trình tạo tác thủ công:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {previewProduct.craftingSteps.map((step) => (
                        <div
                          key={step.step}
                          className="p-2 rounded-xl bg-surface-container text-[11px]"
                        >
                          <span className="font-bold text-primary mr-1">
                            {step.step}.
                          </span>
                          <span className="font-semibold text-on-surface">
                            {step.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Thông tin liên hệ nhanh trực tiếp */}
                  <div className="mt-4 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="text-[10px] text-on-surface-variant block font-medium">Hotline / Zalo liên hệ nghệ nhân:</span>
                        <a href="tel:0918388998" className="font-serif text-xs font-bold text-primary hover:underline">
                          0918.388.998 (Trượng Văn Hải - Làng Nghề)
                        </a>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container text-secondary font-bold">
                      Hỗ trợ 24/7
                    </span>
                  </div>
                </div>

                {/* Nút hành động */}
                <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center gap-3">
                  <button
                    onClick={() => {
                      const p = previewProduct;
                      setPreviewProduct(null);
                      setOrderModalProduct(p);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all text-center shadow-xs"
                    type="button"
                  >
                    Thỉnh Tác Phẩm / Đặt Chế Tác
                  </button>
                  <button
                    onClick={() => setPreviewProduct(null)}
                    className="py-2.5 px-4 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-all"
                    type="button"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: Đăng ký thỉnh tác phẩm / Tư vấn nghệ nhân
      ======================================================== */}
      {orderModalProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="bg-surface rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/40 relative">
            <button
              onClick={() => setOrderModalProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container-highest text-on-surface hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-xs"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-primary block mb-1">
              Kết Nối Nghệ Nhân Bản Địa
            </span>
            <h3 className="font-serif text-xl font-bold text-on-surface">
              Thỉnh Tác Phẩm Thủ Công
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Bạn đang quan tâm đến:{" "}
              <span className="font-bold text-on-surface">
                {orderModalProduct.name}
              </span>{" "}
              ({orderModalProduct.artisanName} - {orderModalProduct.village}).
            </p>

            <form onSubmit={handleSubmitOrder} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">
                  Họ và tên của bạn <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={orderForm.fullName}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, fullName: e.target.value })
                  }
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Số điện thoại <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={orderForm.phone}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, phone: e.target.value })
                    }
                    placeholder="09xx xxx xxx"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Email (Tùy chọn)
                  </label>
                  <input
                    type="email"
                    value={orderForm.email}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, email: e.target.value })
                    }
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">
                  Nhu cầu của bạn
                </label>
                <select
                  value={orderForm.requestType}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, requestType: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface"
                >
                  <option value="Thỉnh tác phẩm có sẵn">Thỉnh tác phẩm hiện hữu</option>
                  <option value="Đặt chế tác độc bản theo yêu cầu">
                    Đặt chế tác theo kích thước riêng
                  </option>
                  <option value="Hẹn lịch ghé thăm xưởng nghệ nhân">
                    Hẹn lịch ghé thăm xưởng trải nghiệm
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">
                  Ghi chú hoặc câu hỏi cho nghệ nhân
                </label>
                <textarea
                  rows={3}
                  value={orderForm.notes}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, notes: e.target.value })
                  }
                  placeholder="Ghi chú kích thước mong muốn, ngày dự kiến ghé thăm hoặc địa chỉ nhận tác phẩm..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:outline-none focus:border-primary text-on-surface resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Đang gửi thông tin...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Xác nhận gửi yêu cầu</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setOrderModalProduct(null)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-all"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <BottomNav />
      <AudioPlayerBar />
    </div>
  );
}
