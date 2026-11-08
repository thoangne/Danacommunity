import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  FolderTree,
  Image as ImageIcon,
  Users,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Package,
  Award,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export default function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const userRole = user?.role || "customer";
  const isAdminOrSuper = userRole === "admin" || userRole === "super_admin" || user?.email === "admin@champaweb.vn";

  const navGroups: NavGroup[] = [
    {
      group: "TỔNG QUAN",
      items: [
        {
          label: "Bảng điều khiển",
          href: "/admin",
          icon: LayoutDashboard,
          exact: true,
        },
      ],
    },
    {
      group: "NỘI DUNG DI SẢN",
      items: [
        {
          label: "Bài viết khảo cứu",
          href: "/admin/articles",
          icon: FileText,
        },
        {
          label: "Tin tức & Sự kiện",
          href: "/admin/news",
          icon: Newspaper,
        },
        {
          label: "Chuyên mục & Thẻ",
          href: "/admin/categories",
          icon: FolderTree,
        },
      ],
    },
    {
      group: "LÀNG NGHỀ & NGHỆ NHÂN",
      items: [
        {
          label: "Tác phẩm thủ công",
          href: "/admin/products",
          icon: Package,
        },
        {
          label: "Hồ sơ nghệ nhân",
          href: "/admin/artisans",
          icon: Award,
        },
      ],
    },
    {
      group: "TÀI NGUYÊN",
      items: [
        {
          label: "Thư viện Media",
          href: "/admin/media",
          icon: ImageIcon,
        },
      ],
    },
    ...(isAdminOrSuper
      ? [
          {
            group: "QUẢN TRỊ HỆ THỐNG",
            items: [
              {
                label: "Người dùng & Vai trò",
                href: "/admin/users",
                icon: Users,
              },
              {
                label: "Nhật ký hoạt động",
                href: "/admin/activity-logs",
                icon: History,
              },
              {
                label: "Cấu hình Website",
                href: "/admin/settings",
                icon: Settings,
              },
            ],
          },
        ]
      : []),
  ];

  const checkIsActive = (href: string, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#FAF9F6] border-r border-[#DEDAD2] transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#DEDAD2]/80">
          <Link
            to="/admin"
            className="flex items-center gap-2.5 overflow-hidden group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8F4E00] to-[#972F12] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-serif font-bold text-sm tracking-wide text-[#24231F] leading-tight">
                  ChampaWeb
                </span>
                <span className="text-[10px] font-semibold text-[#8F4E00] tracking-wider uppercase">
                  CMS Di Sản
                </span>
              </div>
            )}
          </Link>

          {/* Collapse Toggle Button (Desktop) */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex w-7 h-7 rounded-lg border border-[#DEDAD2] items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 transition-colors cursor-pointer"
            title={isCollapsed ? "Mở rộng thanh điều hướng" : "Thu gọn thanh điều hướng"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-[#77716A] uppercase">
                  {group.group}
                </div>
              )}
              {group.items.map((item) => {
                const isActive = checkIsActive(item.href, item.exact);
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) onCloseMobile();
                    }}
                    title={isCollapsed ? item.label : undefined}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-[#8F4E00] text-white shadow-xs"
                        : "text-[#4A4742] hover:bg-[#FAF4EF] hover:text-[#8F4E00]"
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? "text-white" : "text-[#77716A] group-hover:text-[#8F4E00]"
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-[#DEDAD2]/80">
          <div
            className={`flex items-center gap-2.5 p-2 rounded-xl bg-white border border-[#DEDAD2]/60 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#FAF4EF] text-[#8F4E00] font-bold text-xs flex items-center justify-center shrink-0 uppercase border border-[#E8D5CB]">
              {user?.fullName?.charAt(0) || "A"}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate min-w-0">
                <span className="text-xs font-bold text-[#24231F] truncate">
                  {user?.fullName || "Quản trị viên"}
                </span>
                <span className="text-[10px] text-[#77716A] uppercase font-semibold truncate">
                  {userRole}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
