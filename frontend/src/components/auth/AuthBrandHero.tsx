import { Link } from "react-router-dom";
import { Sparkles, Quote, ArrowLeft } from "lucide-react";
import { LOGO_URL } from "../../data/champaData";

export interface AuthBrandHeroProps {
  showHomeLink?: boolean;
  className?: string;
}

export function AuthBrandHero({
  showHomeLink = true,
  className = "hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-[#faf4ef] via-[#f6ebe1] to-[#eeddd2] text-stone-900 flex-col justify-between p-10 xl:p-14 relative overflow-hidden select-none border-r border-[#e8d5cb]/80",
}: AuthBrandHeroProps) {
  return (
    <section className={className}>
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

      {/* Delicate Dot Matrix Pattern */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#8f4e00_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Top Header: Brand Identity */}
      <div className="relative z-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={LOGO_URL}
            alt="Dana Community Tourism"
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col text-left">
            <span className="text-[11px] uppercase tracking-wider text-primary font-bold leading-tight">
              Dana Community Tourism
            </span>
            <span className="font-serif text-sm text-stone-800 leading-tight font-normal">
              Panduranga Heritage
            </span>
          </div>
        </Link>

        {showHomeLink && (
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 transition-colors py-1.5 px-3 rounded-full hover:bg-stone-200/50 border border-stone-300/50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
        )}
      </div>

      {/* Center: Brand Manifesto & Core Value */}
      <div className="relative z-10 max-w-lg my-auto py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold tracking-wide mb-6">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Nền tảng Du lịch Di sản Bản địa</span>
        </div>

        <h1 className="font-serif text-3xl xl:text-4xl 2xl:text-5xl font-bold text-stone-900 leading-tight tracking-tight">
          Nơi trầm tích ngàn năm hòa cùng nhịp sống đương đại.
        </h1>

        <p className="mt-4 text-sm xl:text-base text-stone-600 leading-relaxed font-light">
          Kết nối trọn vẹn các tuyến tour khảo cứu Kalan Po Klong Garai, làng gốm Bàu Trúc,
          dệt thổ cẩm Mỹ Nghiệp và tri thức trao truyền từ các Nghệ nhân Ưu tú.
        </p>

        {/* SaaS-Style Glass Testimonial Card */}
        <div className="mt-8 p-5 rounded-2xl bg-white/85 backdrop-blur-xl border border-[#dfc0b8]/60 shadow-xs relative">
          <Quote className="w-6 h-6 text-primary/25 absolute top-4 right-4" />
          <p className="text-xs xl:text-sm italic text-stone-800 leading-relaxed font-serif pr-4">
            "Mỗi bước chân chạm vào đất nung là một lần lắng nghe hơi thở của tổ tiên qua ngàn năm..."
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-serif font-bold text-xs">
              M
            </div>
            <div>
              <h4 className="text-xs font-semibold text-stone-900">Muk Đàng Thị Phan</h4>
              <p className="text-[11px] text-primary font-medium">Nghệ nhân Ưu tú Làng gốm Bàu Trúc</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Meta */}
      <div className="relative z-10 text-[11px] text-stone-500 flex items-center justify-between border-t border-[#e8d5cb]/70 pt-4">
        <span>© 2026 Dana Heritage. All rights reserved.</span>
        <span className="hidden xl:inline">Bảo tồn & Phát triển Di sản Bền vững</span>
      </div>
    </section>
  );
}
export default AuthBrandHero;
