import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import AudioPlayerBar from "../components/AudioPlayerBar";
import ProductHeroSection from "../components/product/ProductHeroSection";
import ProductFilterToolbar from "../components/product/ProductFilterToolbar";
import ProductGridSection from "../components/product/ProductGridSection";
import ProductCraftProcessSection from "../components/product/ProductCraftProcessSection";
import ProductCtaSection from "../components/product/ProductCtaSection";
import ProductQuickViewModal from "../components/product/ProductQuickViewModal";
import ProductOrderModal from "../components/product/ProductOrderModal";
import { CRAFT_PRODUCTS, type CraftProduct } from "../data/productData";
import type { ProductSortOption } from "../components/product/types";

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Trích xuất bộ lọc URL trực tiếp (tránh cascading render từ useEffect)
  const selectedCategory = searchParams.get("category") || "all";
  const artisanParam = searchParams.get("artisan");
  const selectedArtisanId = artisanParam ? Number(artisanParam) : null;

  // State bộ lọc bổ sung
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<string>("all");
  const [sortBy, setSortBy] = useState<ProductSortOption>("featured");

  // State Modals
  const [previewProduct, setPreviewProduct] = useState<CraftProduct | null>(null);
  const [orderModalProduct, setOrderModalProduct] = useState<CraftProduct | null>(null);
  const [orderInitialRequestType, setOrderInitialRequestType] = useState<string>(
    "Tư vấn tác phẩm độc bản"
  );

  // Danh sách sản phẩm được lọc & sắp xếp
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

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedArtisanId !== null ||
    selectedBadge !== "all" ||
    searchQuery !== "";

  const handleCategoryChange = (catId: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", catId);
    }
    setSearchParams(newParams);
  };

  const handleArtisanFilter = (artisanId: number | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (artisanId === null) {
      newParams.delete("artisan");
    } else {
      newParams.set("artisan", String(artisanId));
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSelectedBadge("all");
    setSearchQuery("");
    setSortBy("featured");
    setSearchParams({});
  };

  const handleOpenOrderModal = (
    product: CraftProduct,
    requestType: string = "Tư vấn tác phẩm độc bản"
  ) => {
    setOrderInitialRequestType(requestType);
    setOrderModalProduct(product);
  };

  const handleOrderFromPreview = (product: CraftProduct) => {
    setPreviewProduct(null);
    handleOpenOrderModal(product, "Tư vấn tác phẩm độc bản");
  };

  const handleOpenCustomOrder = () => {
    handleOpenOrderModal(CRAFT_PRODUCTS[0], "Đặt chế tác độc bản theo yêu cầu");
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <Header
        onToggleAudio={() => setIsAudioPlaying(!isAudioPlaying)}
        isAudioPlaying={isAudioPlaying}
      />

      <main className="w-full pt-16 xl:pt-20 bg-surface flex-1">
        {/* 1. Hero Banner: Tinh hoa thủ công Panduranga */}
        <ProductHeroSection onOpenPreview={setPreviewProduct} />

        {/* 2. Bộ lọc thông minh & Thanh điều khiển */}
        <ProductFilterToolbar
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          selectedArtisanId={selectedArtisanId}
          onArtisanFilterChange={handleArtisanFilter}
          selectedBadge={selectedBadge}
          onBadgeChange={setSelectedBadge}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* 3. Lưới tác phẩm thủ công (Boutique Gallery Grid) */}
        <ProductGridSection
          products={filteredProducts}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
          onOpenPreview={setPreviewProduct}
          onOpenOrderModal={handleOpenOrderModal}
        />

        {/* 4. Quy trình chế tác độc bản (Behind The Craft) */}
        <ProductCraftProcessSection />

        {/* 5. CTA: Thỉnh tác phẩm theo yêu cầu & Trải nghiệm làng nghề */}
        <ProductCtaSection onOpenCustomOrder={handleOpenCustomOrder} />
      </main>

      {/* Modal 1: Quick View Chi Tiết Tác Phẩm */}
      {previewProduct && (
        <ProductQuickViewModal
          key={previewProduct.id}
          product={previewProduct}
          onClose={() => setPreviewProduct(null)}
          onOrderProduct={handleOrderFromPreview}
        />
      )}

      {/* Modal 2: Đăng ký thỉnh tác phẩm / Tư vấn nghệ nhân */}
      {orderModalProduct && (
        <ProductOrderModal
          key={`${orderModalProduct.id}-${orderInitialRequestType}`}
          product={orderModalProduct}
          initialRequestType={orderInitialRequestType}
          onClose={() => setOrderModalProduct(null)}
        />
      )}

      <Footer />
      <BottomNav />
      <AudioPlayerBar />
    </div>
  );
}
