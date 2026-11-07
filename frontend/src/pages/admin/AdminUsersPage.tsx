import { useState, useEffect } from "react";
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Edit,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface UserProfileItem {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone_number?: string;
  role: string;
  provider: string;
  bio?: string;
  address?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdminUsersPage() {
  const { token, user: currentActor } = useAuth();
  const [users, setUsers] = useState<UserProfileItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<UserProfileItem | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editRole, setEditRole] = useState("customer");
  const [editStatus, setEditStatus] = useState("active");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        role: roleFilter,
        status: statusFilter,
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`${API_BASE}/admin/users?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setUsers(data.data);
        setTotal(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách người dùng:", err);
      toast.error("Không thể tải danh sách người dùng.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchUsers();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter, statusFilter, token]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const openEditModal = (target: UserProfileItem) => {
    setEditingUser(target);
    setEditFullName(target.full_name || "");
    setEditPhoneNumber(target.phone_number || "");
    setEditBio(target.bio || "");
    setEditRole(target.role || "customer");
    setEditStatus(target.status || "active");
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    // Kiểm tra tự khóa tài khoản
    const isSelf = currentActor?.id === editingUser.id || currentActor?.email === editingUser.email;
    if (isSelf && editStatus === "suspended") {
      toast.error("Bảo mật: Bạn không thể tự đình chỉ tài khoản của chính mình!");
      return;
    }
    if (isSelf && editingUser.role === "admin" && editRole !== "admin" && editRole !== "super_admin") {
      toast.error("Bảo mật: Bạn không thể tự hạ quyền quản trị viên của chính mình!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          full_name: editFullName.trim(),
          phone_number: editPhoneNumber.trim(),
          bio: editBio.trim(),
          role: editRole,
          status: editStatus,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Cập nhật thông tin người dùng thành công!");
        setEditingUser(null);
        fetchUsers();
      } else {
        toast.error(data.message || "Cập nhật người dùng thất bại.");
      }
    } catch {
      toast.error("Lỗi khi kết nối đến máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#FAF4EF] text-[#8F4E00] border border-[#E8D5CB]">
            <ShieldCheck className="w-3 h-3" />
            <span>Quản trị (Admin)</span>
          </span>
        );
      case "editor":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#F0F5FA] text-[#39566D] border border-blue-200">
            <Shield className="w-3 h-3" />
            <span>Biên tập (Editor)</span>
          </span>
        );
      case "artisan":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#FDF2EE] text-[#972F12] border border-[#F5D5CB]">
            Nghệ nhân Chăm
          </span>
        );
      case "guide":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Hướng dẫn viên
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-stone-100 text-stone-700">
            Khách hàng (User)
          </span>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs">
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              Quản lý Người dùng & Phân quyền RBAC
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Kiểm soát tài khoản thành viên, vai trò Quản trị viên, Biên tập viên và bảo vệ an toàn hệ thống.
            </p>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center gap-3 justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm theo họ tên, email, SĐT..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] transition-colors"
            />
          </form>

          <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium text-stone-700 focus:outline-none focus:border-[#8F4E00]"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên (Admin)</option>
              <option value="editor">Biên tập viên (Editor)</option>
              <option value="artisan">Nghệ nhân</option>
              <option value="guide">Hướng dẫn viên</option>
              <option value="customer">Khách hàng</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium text-stone-700 focus:outline-none focus:border-[#8F4E00]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="suspended">Đã tạm khóa</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#8F4E00]" />
              <span className="text-xs text-stone-500 font-serif">Đang nạp danh sách tài khoản...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 space-y-2 text-stone-400">
              <Users className="w-10 h-10 mx-auto text-stone-300" />
              <p className="text-sm font-bold text-stone-800">Không tìm thấy tài khoản phù hợp</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 bg-[#FAF9F6] text-stone-500 uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 pl-6 pr-3 font-bold">Thành viên</th>
                    <th className="py-3.5 px-3 font-bold">Email</th>
                    <th className="py-3.5 px-3 font-bold">Vai trò (Role)</th>
                    <th className="py-3.5 px-3 font-bold">Trạng thái</th>
                    <th className="py-3.5 px-3 font-bold">Kênh đăng ký</th>
                    <th className="py-3.5 px-3 font-bold">Ngày tham gia</th>
                    <th className="py-3.5 pr-6 pl-3 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {users.map((u) => {
                    const isSelf = currentActor?.id === u.id || currentActor?.email === u.email;
                    return (
                      <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 pl-6 pr-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                              {u.avatar_url ? (
                                <img
                                  src={u.avatar_url}
                                  alt=""
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                u.full_name?.charAt(0) || "U"
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-stone-900 flex items-center gap-1.5">
                                <span>{u.full_name || "Chưa đặt tên"}</span>
                                {isSelf && (
                                  <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded font-mono">
                                    (Bạn)
                                  </span>
                                )}
                              </div>
                              {u.phone_number && (
                                <span className="text-[11px] text-stone-400 font-mono block">
                                  {u.phone_number}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 font-medium text-stone-700 whitespace-nowrap">
                          {u.email}
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {getRoleBadge(u.role)}
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {u.status === "suspended" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                              <UserX className="w-3.5 h-3.5" />
                              <span>Tạm khóa</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Hoạt động</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 capitalize font-mono text-[11px] text-stone-500 whitespace-nowrap">
                          {u.provider || "email"}
                        </td>

                        <td className="py-3.5 px-3 text-stone-500 whitespace-nowrap">
                          {new Date(u.created_at).toLocaleDateString("vi-VN")}
                        </td>

                        <td className="py-3.5 pr-6 pl-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-[#8F4E00] hover:bg-[#FAF4EF] transition-colors cursor-pointer"
                            title="Phân quyền & Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && users.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-[#FAF9F6] text-xs text-stone-600">
              <span>
                Hiển thị trang <strong>{page}</strong> trên <strong>{totalPages}</strong> ({total} người dùng)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-stone-300 hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-stone-300 hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#FAF9F6]">
                <div>
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    Phân quyền & Chỉnh sửa tài khoản
                  </h3>
                  <p className="text-xs text-stone-500">{editingUser.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={editPhoneNumber}
                    onChange={(e) => setEditPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Vai trò (Role)
                    </label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium focus:outline-none focus:border-[#8F4E00]"
                    >
                      <option value="admin">Quản trị viên (Admin)</option>
                      <option value="editor">Biên tập viên (Editor)</option>
                      <option value="artisan">Nghệ nhân Chăm</option>
                      <option value="guide">Hướng dẫn viên</option>
                      <option value="customer">Khách hàng thông thường</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Trạng thái tài khoản
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium focus:outline-none focus:border-[#8F4E00]"
                    >
                      <option value="active">Đang hoạt động</option>
                      <option value="suspended">Tạm khóa tài khoản</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tiểu sử / Ghi chú
                  </label>
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#8F4E00] resize-none"
                  />
                </div>

                {/* Security Warning Notice */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-[11px] text-amber-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Lưu ý bảo mật</span>
                  </div>
                  <p>
                    Mọi thay đổi vai trò hoặc trạng thái đều được ghi nhật ký kiểm toán hệ thống. Mật khẩu được mã hóa an toàn và không bao giờ hiển thị trên giao diện quản trị.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-[#8F4E00] hover:bg-[#8F4E00]/90 text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
