import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import type { BlogArticle } from "../../data/blogData";

interface BlogArticlesGridProps {
  articles: BlogArticle[];
}

export default function BlogArticlesGrid({ articles }: BlogArticlesGridProps) {
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState<"newest" | "readTime" | "popular">(
    "newest"
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleReadArticle = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-margin-mobile xl:px-margin py-space-xl">
      <div className="flex flex-col gap-space-lg">
        {/* Grid Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs text-primary font-label-sm text-xs uppercase tracking-widest font-bold">
              <BookOpen className="h-4 w-4" />
              <span>Khảo Tả Điền Dã & Biên Khảo Chuyên Sâu</span>
            </div>
            <h2 className="font-serif text-3xl xl:text-4xl text-on-surface font-semibold">
              Kho Tri Thức & Bút Ký Điền Dã
            </h2>
          </div>

          <div className="flex items-center gap-space-sm">
            <span className="font-body-sm text-xs xl:text-sm text-on-surface-variant flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5 text-secondary" />
              <span>Sắp xếp:</span>
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as "newest" | "readTime" | "popular")}
              className="px-3 py-2 bg-surface-container rounded-xl text-on-surface text-xs xl:text-sm font-semibold border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="newest">Mới biên khảo nhất</option>
              <option value="readTime">Thời lượng đọc</option>
              <option value="popular">Được quan tâm nhất</option>
            </select>
          </div>
        </div>

        {/* 3-Column Research Grid */}
        {articles.length === 0 ? (
          <div className="py-16 text-center bg-surface-container-low/50 rounded-3xl border border-dashed border-outline-variant/60">
            <p className="font-serif text-xl text-on-surface">
              Chưa tìm thấy bài khảo cứu phù hợp
            </p>
            <p className="text-sm text-on-surface-variant mt-1">
              Vui lòng thử tìm với từ khóa khác hoặc chọn mục "Tất cả kho tàng".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-gutter">
            {articles.map((post) => (
              <article
                key={post.id}
                onClick={() => handleReadArticle(post.slug)}
                className="bg-surface-container-lowest rounded-xl sm:rounded-2xl overflow-hidden shadow-xs sm:shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-outline-variant/30 hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative h-36 sm:h-52 overflow-hidden bg-surface-container">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={post.title}
                    src={post.image}
                    loading="lazy"
                  />
                  <span
                    className={`absolute top-2 left-2 sm:top-3 sm:left-3 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-label-sm text-[10px] sm:text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${post.badgeClass}`}
                  >
                    {post.badge}
                  </span>
                </div>

                <div className="p-3 sm:p-space-md flex flex-col flex-1 justify-between gap-2 sm:gap-space-sm">
                  <div className="flex flex-col gap-1 sm:gap-space-xs">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-outline text-[11px] sm:text-xs">
                      <span>{post.fieldLocation}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="font-title-lg text-base sm:text-lg text-on-surface group-hover:text-primary transition-colors leading-snug font-semibold line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant line-clamp-2 sm:line-clamp-3 leading-relaxed">
                      {post.desc}
                    </p>
                  </div>

                  <div className="pt-2 sm:pt-space-xs flex items-center justify-between border-t border-surface-container/60 mt-1 sm:mt-space-xs text-[11px] sm:text-xs">
                    <span className="text-outline truncate max-w-[150px]">Tác giả: {post.author}</span>
                    <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                      <span>Đọc bài</span>
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Archival Pagination Bar */}
        <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md border-t border-surface-container-high/60 mt-space-md">
          <span className="font-body-sm text-xs xl:text-sm text-on-surface-variant">
            Hiển thị <strong>{Math.min(articles.length, 6)}</strong> trên tổng
            số <strong>{articles.length}</strong> bài khảo cứu & tài liệu
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-outline hover:text-on-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Trang trước"
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                  currentPage === page
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                }`}
                type="button"
              >
                {page}
              </button>
            ))}

            <span className="text-outline px-1">...</span>

            <button
              onClick={() => setCurrentPage(5)}
              className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                currentPage === 5
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface"
              }`}
              type="button"
            >
              5
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
              disabled={currentPage === 5}
              className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Trang kế"
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
