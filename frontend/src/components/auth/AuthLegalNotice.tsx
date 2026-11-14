export interface AuthLegalNoticeProps {
  className?: string;
}

export function AuthLegalNotice({ className = "" }: AuthLegalNoticeProps) {
  return (
    <div className={`w-full max-w-[420px] mx-auto text-center pt-4 border-t border-stone-100 ${className}`}>
      <p className="text-[11px] text-stone-400 leading-tight">
        Bằng việc tiếp tục, bạn đồng ý với{" "}
        <a href="#dieu-khoan" className="underline hover:text-stone-700">
          Điều khoản dịch vụ
        </a>{" "}
        và{" "}
        <a href="#chinh-sach" className="underline hover:text-stone-700">
          Chính sách bảo mật di sản
        </a>
        .
      </p>
    </div>
  );
}
export default AuthLegalNotice;
