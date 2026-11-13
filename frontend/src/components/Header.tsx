import { LOGO_URL, PC_NAV_LINKS } from "../data/champaData";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  AudioLines,
  Menu,
  ChevronDown,
  X,
  Globe,
  Newspaper,
  Landmark,
  Sparkles,
  Image as ImageIcon,
  BookOpen,
  Scroll,
  HelpCircle,
  LogIn,
  LogOut,
  Compass,
  FileText,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAudio } from "../lib/AudioContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "./ui/sonner";

interface HeaderProps {
  onToggleAudio?: () => void;
  isAudioPlaying?: boolean;
}

// Từ điển đa ngữ cho Navigation Header (Tiếng Việt & Tiếng Anh)
const NAV_LABELS: Record<string, { vi: string; en: string }> = {
  "/tour": { vi: "Dana Tour", en: "Dana Tour" },
  "/san-pham": { vi: "Sản phẩm", en: "Crafts & Products" },
  "/nghe-nhan": { vi: "Chân dung nghệ nhân", en: "Master Artisans" },
  "/bai-viet": { vi: "Bài Viết", en: "Articles" },
  "/so-hoa-di-san": { vi: "Số hoá di sản", en: "Digital Heritage" },
};

const SUB_NAV_LABELS: Record<string, { vi: string; en: string; descVi: string; descEn: string }> = {
  "/bai-viet?category=tin-tuc": {
    vi: "Tin tức",
    en: "News",
    descVi: "Sự kiện, bảo tồn & nhịp sống bản địa",
    descEn: "Events, preservation & local life",
  },
  "/bai-viet?category=lich-su": {
    vi: "Lịch sử",
    en: "History",
    descVi: "Vương triều, khảo cổ học & di tích ngàn năm",
    descEn: "Dynasties, archaeology & ancient relics",
  },
  "/bai-viet?category=van-hoa": {
    vi: "Văn Hoá",
    en: "Culture",
    descVi: "Đền tháp, làng nghề gốm - dệt & lễ hội",
    descEn: "Towers, pottery, weaving & sacred festivals",
  },
  "/so-hoa-di-san?tab=hinh-anh": {
    vi: "Hình ảnh Văn hoá",
    en: "Cultural Gallery",
    descVi: "Kho ảnh nghệ thuật điền dã & bảo tàng số",
    descEn: "Fieldwork photography & digital museum",
  },
  "/so-hoa-di-san?tab=ngon-ngu": {
    vi: "Ngôn ngữ Chăm Akhar Thrah",
    en: "Akhar Thrah Script",
    descVi: "Ký tự cổ tương tác, âm thanh & từ điển số",
    descEn: "Interactive ancient script, audio & dictionary",
  },
  "/so-hoa-di-san?tab=van-bia": {
    vi: "Giải mã Văn bia Cổ",
    en: "Ancient Inscriptions",
    descVi: "Bản dập bia ký sa thạch Sanskrit - Chăm",
    descEn: "Sanskrit - Cham sandstone stele rubbings",
  },
};

const SUB_MENU_ICONS: Record<string, { icon: typeof Newspaper; color: string; bg: string }> = {
  "/bai-viet?category=tin-tuc": {
    icon: Newspaper,
    color: "text-[#8F4E00]",
    bg: "bg-[#FAF4EF]",
  },
  "/bai-viet?category=lich-su": {
    icon: Landmark,
    color: "text-[#972F12]",
    bg: "bg-[#FDF2EE]",
  },
  "/bai-viet?category=van-hoa": {
    icon: Sparkles,
    color: "text-[#B85A32]",
    bg: "bg-[#FFF5EE]",
  },
  "/so-hoa-di-san?tab=hinh-anh": {
    icon: ImageIcon,
    color: "text-[#8F4E00]",
    bg: "bg-[#FAF4EF]",
  },
  "/so-hoa-di-san?tab=ngon-ngu": {
    icon: BookOpen,
    color: "text-[#39566D]",
    bg: "bg-[#F0F5FA]",
  },
  "/so-hoa-di-san?tab=van-bia": {
    icon: Scroll,
    color: "text-[#58423C]",
    bg: "bg-[#F8F5F2]",
  },
};

export default function Header({ onToggleAudio, isAudioPlaying }: HeaderProps) {
  const audioCtx = useAudio();
  const currentIsPlaying =
    isAudioPlaying !== undefined ? isAudioPlaying : audioCtx?.isAudioPlaying ?? false;

  const handleAudioToggle = () => {
    if (onToggleAudio) {
      onToggleAudio();
    } else if (audioCtx) {
      audioCtx.toggleAudio();
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileSubMenus, setOpenMobileSubMenus] = useState<Record<string, boolean>>({
    "/bai-viet": true,
    "/so-hoa-di-san": true,
  });

  // Scroll listener cho adaptive editorial sticky navbar
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Quản lý ngôn ngữ: Mặc định lấy từ localStorage hoặc tiếng Việt ('vi')
  const [language, setLanguage] = useState<"vi" | "en">(() => {
    const saved = localStorage.getItem("champa_language");
    return saved === "en" ? "en" : "vi";
  });

  const { user, isAdmin, openAuthModal, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const location = useLocation();

  const handleLanguageChange = (lang: "vi" | "en") => {
    if (lang === language) return;
    setLanguage(lang);
    localStorage.setItem("champa_language", lang);
    toast.success(
      lang === "vi"
        ? "Đã chuyển giao diện sang Tiếng Việt"
        : "Switched interface language to English"
    );
  };

  const toggleMobileSubMenu = (href: string) => {
    setOpenMobileSubMenus((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  // Hàm cuộn mượt có trừ hao chiều cao Header
  const scrollToElement = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  // Tự động cuộn khi URL có chứa Hash (#)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const timer = setTimeout(() => {
        scrollToElement(id);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash, scrollToElement]);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);

    if (href === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (href.includes("#")) {
      const [pathPart, hashPart] = href.split("#");
      const targetPath = pathPart || "/";
      if (location.pathname === targetPath && hashPart) {
        scrollToElement(hashPart);
      }
    } else if (location.pathname !== href) {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  };

  // Lọc bỏ nút Trang chủ theo cấu trúc editorial
  const activeNavLinks = PC_NAV_LINKS.filter((link) => link.href !== "/");

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[90] transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAF9F6]/92 backdrop-blur-md border-b border-[#DEDAD2]/80 shadow-[0_4px_24px_-4px_rgba(36,25,21,0.04)]"
          : "bg-[#FAF9F6]/80 backdrop-blur-xs border-b border-[#DEDAD2]/40"
      }`}
    >
      <div className="w-full max-w-[1680px] mx-auto h-16 xl:h-20 px-3 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-2 sm:gap-4">
        {/* ========================================================
            1. VÙNG TRÁI: ĐỊNH DANH THƯƠNG HIỆU (BRAND EXPERIENCE)
            Logo nguyên bản sắc nét, phân cấp chữ sa thạch & than chì
        ======================================================== */}
        <div className="flex items-center shrink-0 min-w-0">
          <Link
            className="flex items-center gap-2 sm:gap-3.5 group select-none py-1"
            to="/"
            onClick={() => handleNavClick("/")}
            title="Dana Community Tourism - Panduranga Heritage"
          >
            <img
              alt="Logo Dana - Di sản & Văn hóa Chăm"
              className="h-9 sm:h-11 xl:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] shrink-0"
              src={LOGO_URL}
              loading="eager"
            />
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[13px] sm:text-[15px] xl:text-[16px] text-[#24231F] font-bold tracking-tight leading-snug group-hover:text-[#8F4E00] transition-colors truncate">
                Dana Community<span className="hidden sm:inline"> Tourism</span>
              </span>
              <span className="hidden sm:inline font-serif text-[11px] xl:text-[13px] text-[#77716A] leading-tight font-normal italic mt-0.5 tracking-wide truncate">
                Panduranga Heritage
              </span>
            </div>
          </Link>
        </div>

        {/* ========================================================
            2. VÙNG GIỮA: THỰC ĐƠN CHÍNH (EDITORIAL NAVIGATION)
            Đặt chính giữa, thanh thoát, khoảng thở đều, không tab thô
        ======================================================== */}
        <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2.5 h-full mx-auto px-2">
          {activeNavLinks.map((link) => {
            const isRouteActive = link.href.includes("#")
              ? location.pathname === (link.href.split("#")[0] || "/") &&
                location.hash === link.href.substring(link.href.indexOf("#"))
              : link.href === "/bai-viet"
              ? location.pathname.startsWith("/bai-viet") ||
                location.pathname.startsWith("/blog") ||
                location.pathname.startsWith("/di-san")
              : link.href === "/so-hoa-di-san"
              ? location.pathname.startsWith("/so-hoa-di-san") ||
                location.pathname.startsWith("/hinh-anh") ||
                location.pathname.startsWith("/ngon-ngu") ||
                location.pathname.startsWith("/ban-do")
              : location.pathname.startsWith(link.href);

            // Nhãn theo ngôn ngữ
            const translatedLabel =
              language === "en" && NAV_LABELS[link.href]
                ? NAV_LABELS[link.href].en
                : NAV_LABELS[link.href]?.vi || link.label;

            const baseClass =
              "relative inline-flex items-center justify-center text-[13px] xl:text-[14px] tracking-[0.03em] whitespace-nowrap transition-colors duration-200 h-10 px-3 xl:px-3.5 rounded-full select-none";
            const currentClass = isRouteActive
              ? `${baseClass} text-[#24231F] font-semibold after:absolute after:bottom-1 after:left-3.5 after:right-3.5 after:h-[2px] after:bg-[#8F4E00] after:rounded-full`
              : `${baseClass} text-[#77716A] hover:text-[#24231F] font-medium hover:after:absolute hover:after:bottom-1 hover:after:left-3.5 hover:after:right-3.5 hover:after:h-[2px] hover:after:bg-[#8F4E00]/40 hover:after:rounded-full`;

            if (link.children && link.children.length > 0) {
              return (
                <div key={link.href} className="relative group flex items-center h-full">
                  <Link
                    to={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`${currentClass} gap-1.5`}
                  >
                    <span>{translatedLabel}</span>
                    <ChevronDown className="h-3 w-3 shrink-0 transition-transform duration-200 group-hover:rotate-180 text-[#77716A] group-hover:text-[#24231F]" />
                  </Link>

                  {/* Editorial Dropdown Index Card */}
                  <div className="absolute top-[calc(100%-10px)] left-1/2 -translate-x-1/2 pt-2 hidden group-hover:block z-[100] animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="w-80 xl:w-88 bg-[#FAF9F6] rounded-2xl shadow-[0_20px_48px_-12px_rgba(36,25,21,0.10)] border border-[#DEDAD2] p-2 flex flex-col gap-1 ring-1 ring-black/[0.03]">
                      <div className="px-3 pt-2 pb-1 text-[10px] font-semibold tracking-widest uppercase text-[#77716A]/80 border-b border-[#DEDAD2]/60 flex items-center justify-between">
                        <span>{translatedLabel}</span>
                        <span className="font-serif italic lowercase font-normal">chuyên mục</span>
                      </div>
                      {link.children.map((sub) => {
                        const itemConfig = SUB_MENU_ICONS[sub.href] || {
                          icon: HelpCircle,
                          color: "text-[#8F4E00]",
                          bg: "bg-[#FAF4EF]",
                        };
                        const IconComponent = itemConfig.icon;
                        const subData = SUB_NAV_LABELS[sub.href];
                        const subLabel =
                          language === "en" && subData ? subData.en : sub.label;
                        const subDesc =
                          language === "en" && subData ? subData.descEn : sub.desc;

                        return (
                          <Link
                            key={sub.href}
                            to={sub.href}
                            onClick={() => handleNavClick(sub.href)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white text-left transition-all duration-200 group/sub border border-transparent hover:border-[#DEDAD2]/50 hover:shadow-2xs"
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${itemConfig.bg} ${itemConfig.color} border border-[#DEDAD2]/40 transition-transform group-hover/sub:scale-105`}
                            >
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs xl:text-[13px] font-semibold text-[#24231F] group-hover/sub:text-[#8F4E00] transition-colors flex items-center justify-between">
                                <span>{subLabel}</span>
                                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover/sub:opacity-100 transition-opacity text-[#8F4E00]" />
                              </div>
                              {subDesc && (
                                <div className="text-[11px] text-[#77716A] leading-tight mt-0.5 line-clamp-1">
                                  {subDesc}
                                </div>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => handleNavClick(link.href)}
                className={currentClass}
              >
                {translatedLabel}
              </Link>
            );
          })}
        </nav>

        {/* ========================================================
            3. VÙNG PHẢI: HÀNH ĐỘNG TINH GIẢN (CURATED ACTIONS)
            Acoustic Pill Saranai, Nút Đăng nhập Than chì, Chuyển ngữ Slash
        ======================================================== */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 xl:gap-3.5 shrink-0">
          {/* 3.1 Nút âm thanh Saranai - Acoustic Pill thanh lịch, KHÔNG nhấp nháy giật mắt */}
          <button
            onClick={handleAudioToggle}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3 xl:px-3.5 rounded-full border text-xs transition-all duration-200 cursor-pointer ${
              currentIsPlaying
                ? "bg-[#8F4E00]/10 border-[#8F4E00]/40 text-[#8F4E00] shadow-2xs font-semibold"
                : "bg-transparent hover:bg-stone-200/40 border-[#DEDAD2] text-[#77716A] hover:text-[#24231F] font-medium"
            }`}
            title={
              language === "vi"
                ? "Bật/tắt thanh âm nhạc cụ Chăm (Saranai - Paranưng)"
                : "Toggle Cham folk instruments audio (Saranai - Paranung)"
            }
            type="button"
          >
            <span className="flex h-2 w-2 relative shrink-0">
              <span
                className={`relative inline-flex rounded-full h-2 w-2 transition-colors ${
                  currentIsPlaying ? "bg-[#8F4E00]" : "bg-[#77716A]"
                }`}
              ></span>
            </span>
            <AudioLines
              className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                currentIsPlaying ? "text-[#8F4E00]" : "text-[#77716A]"
              }`}
            />
            <span className="hidden xl:inline text-[11px] tracking-wide font-medium">
              {currentIsPlaying
                ? language === "vi"
                  ? "Saranai đang phát"
                  : "Playing Saranai"
                : language === "vi"
                  ? "Thanh âm Saranai"
                  : "Saranai Sound"}
            </span>
          </button>

          {/* 3.2 Đăng nhập & Profile Tài khoản */}
          {!user ? (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-4 rounded-full bg-[#24231F] hover:bg-[#8F4E00] text-[#FAF9F6] font-medium text-xs tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer shrink-0"
            >
              <LogIn className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden xs:inline">{language === "vi" ? "Đăng nhập" : "Sign In"}</span>
            </button>
          ) : (
            <div className="relative inline-block shrink-0" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 p-0.5 rounded-full hover:bg-stone-200/50 transition-all cursor-pointer focus:outline-none"
                aria-label="Tài khoản cá nhân"
              >
                <Avatar className="h-9 w-9 ring-1 ring-[#DEDAD2] hover:ring-[#8F4E00]/40 transition-all shrink-0">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-[#8F4E00] text-white font-bold text-xs uppercase">
                      {user.fullName ? user.fullName.charAt(0) : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <ChevronDown className="h-3 w-3 text-[#77716A]" />
              </button>

              {/* Profile Dropdown Tinh Tế */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#FAF9F6] shadow-[0_20px_40px_-10px_rgba(36,25,21,0.10)] border border-[#DEDAD2] py-2 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/[0.03]">
                  <div className="px-4 py-2.5 border-b border-[#DEDAD2]/60">
                    <p className="text-xs font-bold text-[#24231F] truncate">{user.fullName}</p>
                    <p className="text-[11px] text-[#77716A] truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-semibold uppercase px-2 py-0.5 rounded-md bg-[#FAF4EF] text-[#8F4E00] border border-[#E8D5CB]/80">
                      {user.provider === "google"
                        ? "Google Account"
                        : user.provider === "facebook"
                        ? "Facebook Account"
                        : "Champa Account"}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/tour"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#24231F] hover:bg-white transition-colors"
                    >
                      <Compass className="h-4 w-4 text-[#8F4E00]" />
                      <span>{language === "vi" ? "Đơn đặt tour & Trải nghiệm" : "My Bookings & Tours"}</span>
                    </Link>
                  </div>

                  {isAdmin && (
                    <div className="py-1 border-t border-[#DEDAD2]/60 bg-[#FAF4EF]/40">
                      <div className="px-4 py-1 text-[9px] font-bold uppercase tracking-wider text-[#972F12]">
                        Hệ thống Quản trị (CMS)
                      </div>
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#24231F] hover:bg-white font-semibold transition-colors"
                      >
                        <FileText className="h-4 w-4 text-[#8F4E00]" />
                        <span>{language === "vi" ? "Bảng điều khiển CMS" : "Admin Dashboard"}</span>
                      </Link>
                      <Link
                        to="/admin/articles/create"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#24231F] hover:bg-white font-semibold transition-colors"
                      >
                        <Plus className="h-4 w-4 text-[#972F12]" />
                        <span>{language === "vi" ? "Soạn bài viết mới" : "Write New Article"}</span>
                      </Link>
                    </div>
                  )}

                  <div className="border-t border-[#DEDAD2]/60 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50/60 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{language === "vi" ? "Đăng xuất" : "Sign Out"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3.3 Chuyển ngữ tối giản (Slash Toggle VI / EN) */}
          <div className="hidden sm:flex items-center text-[11px] font-semibold tracking-wider text-[#77716A] px-2 py-1 rounded-full border border-[#DEDAD2] bg-[#FAF9F6] shrink-0 select-none">
            <button
              type="button"
              onClick={() => handleLanguageChange("vi")}
              className={`transition-colors cursor-pointer ${
                language === "vi" ? "text-[#8F4E00] font-bold" : "text-[#77716A] hover:text-[#24231F]"
              }`}
              title="Tiếng Việt"
            >
              VI
            </button>
            <span className="text-[#DEDAD2] mx-1">/</span>
            <button
              type="button"
              onClick={() => handleLanguageChange("en")}
              className={`transition-colors cursor-pointer ${
                language === "en" ? "text-[#8F4E00] font-bold" : "text-[#77716A] hover:text-[#24231F]"
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* 3.4 Nút Hamburger Menu Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-full shrink-0 text-[#24231F] hover:bg-stone-200/50 border border-[#DEDAD2]"
            aria-label={mobileMenuOpen ? "Đóng danh mục" : "Mở danh mục"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-4 w-4 text-[#8F4E00]" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* ========================================================
          4. MENU DI ĐỘNG (MOBILE DRAWER - EDITORIAL INDEX)
          Mục lục nghệ thuật có đánh số thứ tự 01, 02, 03...
      ======================================================== */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF9F6] border-t border-[#DEDAD2] px-4 sm:px-6 py-5 sm:py-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-4rem)] xl:max-h-[calc(100vh-5rem)] overflow-y-auto">
          {/* Header Mobile Drawer */}
          <div className="flex items-center justify-between pb-3 border-b border-[#DEDAD2]/80">
            <span className="font-serif italic text-xs tracking-wider text-[#77716A]">
              {language === "vi" ? "Mục lục Khám phá Di sản" : "Heritage Discovery Index"}
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#77716A] hover:text-[#24231F] text-xs flex items-center gap-1 font-medium p-1 cursor-pointer"
              type="button"
            >
              <span>{language === "vi" ? "Đóng" : "Close"}</span>
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Nav List with Editorial Numbering */}
          <div className="flex flex-col gap-1">
            {activeNavLinks.map((link, idx) => {
              const isRouteActive = link.href.includes("#")
                ? location.pathname === (link.href.split("#")[0] || "/") &&
                  location.hash === link.href.substring(link.href.indexOf("#"))
                : location.pathname.startsWith(link.href);

              const translatedLabel =
                language === "en" && NAV_LABELS[link.href]
                  ? NAV_LABELS[link.href].en
                  : NAV_LABELS[link.href]?.vi || link.label;

              const numberStr = String(idx + 1).padStart(2, "0");

              if (link.children && link.children.length > 0) {
                const isSubOpen = !!openMobileSubMenus[link.href];
                return (
                  <div key={link.href} className="flex flex-col border-b border-[#DEDAD2]/40 pb-2">
                    <div className="flex items-center justify-between py-2">
                      <Link
                        to={link.href}
                        onClick={() => handleNavClick(link.href)}
                        className={`flex items-baseline gap-3 text-sm tracking-wide ${
                          isRouteActive ? "text-[#8F4E00] font-bold" : "text-[#24231F] font-medium"
                        }`}
                      >
                        <span className="font-mono text-[10px] text-[#77716A]">{numberStr}</span>
                        <span>{translatedLabel}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleMobileSubMenu(link.href)}
                        className="p-1.5 text-[#77716A] hover:text-[#24231F]"
                        aria-label="Thu phóng mục con"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isSubOpen ? "rotate-180 text-[#8F4E00]" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {isSubOpen && (
                      <div className="pl-6 pr-2 py-1 flex flex-col gap-1.5 border-l border-[#8F4E00]/30 ml-2.5 my-1">
                        {link.children.map((sub) => {
                          const subData = SUB_NAV_LABELS[sub.href];
                          const subLabel =
                            language === "en" && subData ? subData.en : sub.label;

                          return (
                            <Link
                              key={sub.href}
                              to={sub.href}
                              onClick={() => handleNavClick(sub.href)}
                              className="py-1.5 px-2 rounded-lg text-xs font-medium text-[#77716A] hover:text-[#8F4E00] hover:bg-white transition-colors"
                            >
                              {subLabel}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`flex items-baseline gap-3 py-3 border-b border-[#DEDAD2]/40 text-sm tracking-wide transition-colors ${
                    isRouteActive ? "text-[#8F4E00] font-bold" : "text-[#24231F] font-medium hover:text-[#8F4E00]"
                  }`}
                >
                  <span className="font-mono text-[10px] text-[#77716A]">{numberStr}</span>
                  <span>{translatedLabel}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Footer Actions */}
          <div className="mt-4 pt-4 border-t border-[#DEDAD2] flex flex-col gap-3">
            {/* Saranai Audio Toggle on Mobile */}
            <button
              onClick={handleAudioToggle}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                currentIsPlaying
                  ? "bg-[#8F4E00]/10 border-[#8F4E00]/30 text-[#8F4E00]"
                  : "bg-white border-[#DEDAD2] text-[#24231F]"
              }`}
              type="button"
            >
              <div className="flex items-center gap-2">
                <AudioLines className={`h-4 w-4 ${currentIsPlaying ? "text-[#8F4E00]" : "text-[#77716A]"}`} />
                <span className="font-medium">
                  {language === "vi" ? "Thanh âm Saranai - Paranưng" : "Saranai Cultural Audio"}
                </span>
              </div>
              <span className="text-[11px] font-bold">
                {currentIsPlaying
                  ? language === "vi"
                    ? "Đang phát"
                    : "Playing"
                  : language === "vi"
                  ? "Bật âm thanh"
                  : "Turn on"}
              </span>
            </button>

            {/* Language Switcher on Mobile */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#DEDAD2]">
              <div className="flex items-center gap-2 text-xs font-medium text-[#24231F]">
                <Globe className="h-4 w-4 text-[#8F4E00]" />
                <span>{language === "vi" ? "Ngôn ngữ" : "Language"}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleLanguageChange("vi")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    language === "vi"
                      ? "bg-[#8F4E00] text-white"
                      : "text-[#77716A] hover:text-[#24231F]"
                  }`}
                >
                  Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange("en")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    language === "en"
                      ? "bg-[#8F4E00] text-white"
                      : "text-[#77716A] hover:text-[#24231F]"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* User Login / Profile Section on Mobile */}
            {!user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal("login");
                }}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#24231F] hover:bg-[#8F4E00] text-white font-medium text-xs tracking-wide transition-all shadow-xs cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span>{language === "vi" ? "Đăng nhập tài khoản" : "Sign In to Account"}</span>
              </button>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#DEDAD2]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar className="h-8 w-8 ring-1 ring-[#DEDAD2] shrink-0">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                    ) : (
                      <AvatarFallback className="bg-[#8F4E00] text-white font-bold text-xs uppercase">
                        {user.fullName ? user.fullName.charAt(0) : "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#24231F] truncate">{user.fullName}</p>
                    <p className="text-[10px] text-[#77716A] truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
