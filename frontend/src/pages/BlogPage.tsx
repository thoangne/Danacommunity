import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import AudioPlayerBar from "../components/AudioPlayerBar";
import BlogHeroSection from "../components/blog/BlogHeroSection";
import BlogFeaturedPost from "../components/blog/BlogFeaturedPost";
import BlogPillarsSection from "../components/blog/BlogPillarsSection";
import BlogArticlesGrid from "../components/blog/BlogArticlesGrid";
import BlogCTASection from "../components/blog/BlogCTASection";
import { BLOG_ARTICLES, type BlogArticle, type BlogMainCategoryType } from "../data/blogData";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get("category") as BlogMainCategoryType) || "all";

  const [mainCategory, setMainCategory] = useState<BlogMainCategoryType>(
    ["tin-tuc", "lich-su", "van-hoa"].includes(initialCategory) ? initialCategory : "all"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery] = useState<string>("");
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [apiArticles, setApiArticles] = useState<BlogArticle[]>([]);

  // Tải danh sách bài viết động từ Backend API (bao gồm các bài mới do Admin đăng)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE}/posts?limit=50`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const mapped: BlogArticle[] = json.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            mainCategory: item.mainCategory || "van-hoa",
            category: item.category || "craft",
            badge: item.badge || "Khảo Cứu Di Sản",
            badgeClass: item.badgeClass || "bg-primary/10 text-primary border-primary/20",
            fieldLocation: item.fieldLocation || "Panduranga",
            readTime: item.readTime || "5 phút đọc",
            author: item.authorName || "Ban Quản Trị Di Sản",
            desc: item.excerpt || item.title,
            image: item.coverImage,
            slug: item.slug,
          }));
          setApiArticles(mapped);
        }
      } catch (err) {
        console.log("Dùng bài viết tĩnh fallback:", err);
      }
    };
    fetchPosts();
  }, []);

  // Lắng nghe thay đổi trên URL để cập nhật category khi bấm từ Menu Header
  useEffect(() => {
    const cat = searchParams.get("category") as BlogMainCategoryType;
    if (cat && ["tin-tuc", "lich-su", "van-hoa"].includes(cat)) {
      setMainCategory(cat);
      setSelectedCategory("all");
    } else if (!cat) {
      setMainCategory("all");
    }
  }, [searchParams]);

  const handleSelectMainCategory = (cat: BlogMainCategoryType) => {
    setMainCategory(cat);
    setSelectedCategory("all");
    if (cat === "all") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const toggleAudio = () => {
    setIsAudioPlaying((prev) => !prev);
  };

  // Filter articles by main category, sub category and search keyword
  const filteredArticles = useMemo(() => {
    // Kết hợp bài từ API (mới nhất từ Admin) lên đầu, tiếp đến là bài viết tĩnh mẫu
    const combined = [...apiArticles];
    BLOG_ARTICLES.forEach((staticItem) => {
      if (!combined.some((item) => item.slug === staticItem.slug)) {
        combined.push(staticItem);
      }
    });

    return combined.filter((article) => {
      const matchMainCategory =
        mainCategory === "all" || article.mainCategory === mainCategory;
      const matchSubCategory =
        selectedCategory === "all" || article.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMainCategory && matchSubCategory && matchSearch;
    });
  }, [apiArticles, mainCategory, selectedCategory, searchQuery]);

  return (
    <div className="bg-surface text-on-surface font-body-md flex flex-col min-h-screen selection:bg-primary-container selection:text-on-primary-container">
      {/* 1. Global Header */}
      <Header onToggleAudio={toggleAudio} isAudioPlaying={isAudioPlaying} />

      {/* 2. Main Blog Flow */}
      <main className="w-full pt-16 xl:pt-20 bg-surface min-h-[calc(100vh-80px)] flex flex-col">
        {/* Section 1: Hero Header & Filters */}
        <BlogHeroSection
          mainCategory={mainCategory}
          onSelectMainCategory={handleSelectMainCategory}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Section 2: Featured Archival Story */}
        <BlogFeaturedPost onToggleAudioPlayer={toggleAudio} />

        {/* Section 3: Four Pillars of Panduranga */}
        <BlogPillarsSection />

        {/* Section 4: In-depth Research Articles Grid */}
        <BlogArticlesGrid articles={filteredArticles} />

        {/* Section 5: Journal PDF & Community Oral History */}
        <BlogCTASection />
      </main>

      {/* 3. Global Footer */}
      <Footer />

      {/* 4. Saranai Audio Player Floating Bar */}
      <AudioPlayerBar
        isOpen={isAudioPlaying}
        onClose={() => setIsAudioPlaying(false)}
      />

      {/* 5. Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
