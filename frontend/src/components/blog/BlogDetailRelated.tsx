import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { BLOG_ARTICLES, BLOG_PILLARS, FEATURED_POST } from "../../data/blogData";
import type { BlogDetailArticle } from "../../data/blogDetailData";

interface BlogDetailRelatedProps {
  article: BlogDetailArticle;
}

export default function BlogDetailRelated({ article }: BlogDetailRelatedProps) {
  // Lọc 3 bài viết liên quan: ưu tiên theo relatedSlugs, nếu không đủ thì lấy bài cùng mainCategory
  const candidates: {
    slug: string;
    title: string;
    badge: string;
    readTime: string;
    desc: string;
    image: string;
  }[] = [];

  // 1. Thêm từ relatedSlugs
  article.relatedSlugs.forEach((slug) => {
    if (slug === article.slug) return;
    if (slug === "po-klong-garai-brick" && article.slug !== "po-klong-garai-brick") {
      candidates.push({
        slug: "po-klong-garai-brick",
        title: FEATURED_POST.title,
        badge: FEATURED_POST.badge,
        readTime: FEATURED_POST.readTime,
        desc: FEATURED_POST.subtitle,
        image: FEATURED_POST.image,
      });
      return;
    }
    const foundArt = BLOG_ARTICLES.find((a) => a.slug === slug);
    if (foundArt) {
      candidates.push({
        slug: foundArt.slug,
        title: foundArt.title,
        badge: foundArt.badge,
        readTime: foundArt.readTime,
        desc: foundArt.desc,
        image: foundArt.image,
      });
      return;
    }
    const foundPillar = BLOG_PILLARS.find((p) => p.slug === slug);
    if (foundPillar) {
      candidates.push({
        slug: foundPillar.slug,
        title: foundPillar.title,
        badge: foundPillar.badge,
        readTime: foundPillar.readTime,
        desc: foundPillar.desc,
        image: foundPillar.image,
      });
    }
  });

  // 2. Nếu chưa đủ 3 bài, bổ sung bài cùng mainCategory hoặc bài khác
  if (candidates.length < 3) {
    const moreArticles = BLOG_ARTICLES.filter(
      (a) => a.slug !== article.slug && !candidates.some((c) => c.slug === a.slug)
    );
    for (const more of moreArticles) {
      if (candidates.length >= 3) break;
      candidates.push({
        slug: more.slug,
        title: more.title,
        badge: more.badge,
        readTime: more.readTime,
        desc: more.desc,
        image: more.image,
      });
    }
  }

  const displayList = candidates.slice(0, 3);

  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-xs">
        <div>
          <span className="font-label-sm text-xs text-secondary uppercase tracking-[0.2em] font-semibold">
            Chuyên Đề Tiếp Nối • {article.categoryLabel}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface mt-1">
            Khảo cứu tiếp theo bạn không nên bỏ lỡ
          </h2>
        </div>
        <Link
          className="font-label-md text-xs sm:text-sm text-primary hover:underline flex items-center gap-1 font-semibold"
          to={`/bai-viet?category=${article.mainCategory}`}
        >
          <span>Xem tất cả bài viết cùng chuyên mục</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-gutter">
        {displayList.map((post) => (
          <Link
            key={post.slug}
            to={`/bai-viet/${post.slug}`}
            className="bg-surface rounded-xl sm:rounded-2xl overflow-hidden shadow-xs sm:shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-outline-variant/30 hover:-translate-y-1 cursor-pointer"
          >
            <div className="h-36 sm:h-48 overflow-hidden relative bg-surface-container">
              <img
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                alt={post.title}
                src={post.image}
                loading="lazy"
              />
              <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-surface/90 backdrop-blur-md font-label-sm text-[10px] sm:text-[11px] font-semibold text-secondary shadow-sm">
                {post.badge}
              </span>
            </div>

            <div className="p-3 sm:p-space-md flex flex-col flex-1 justify-between gap-2 sm:gap-space-sm">
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <span className="text-on-surface-variant font-label-sm text-[11px] sm:text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{post.readTime}</span>
                </span>
                <h3 className="font-serif text-sm sm:text-lg font-semibold text-on-surface group-hover:text-primary transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                  {post.desc}
                </p>
              </div>

              <div className="pt-2 sm:pt-space-xs flex items-center justify-between text-primary font-semibold text-[11px] sm:text-xs border-t border-surface-container/60 mt-1 sm:mt-space-xs">
                <span>Đọc bài khảo cứu</span>
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
