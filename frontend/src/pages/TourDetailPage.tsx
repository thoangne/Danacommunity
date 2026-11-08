import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Calendar,
  Camera,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Flame,
  HandMetal,
  HeartHandshake,
  MapPin,
  MessageSquare,
  Minus,
  Navigation,
  Phone,
  Play,
  Plus,
  Radio,
  Share2,
  ShieldCheck,
  Shirt,
  Star,
  Users,
  UtensilsCrossed,
  X,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import AudioPlayerBar from "../components/AudioPlayerBar";
import { TOURS } from "../data/champaData";
import { toast } from "../components/ui/sonner";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function TourDetailPage() {
  const { user } = useAuth();
  const { tourSlug } = useParams<{ tourSlug: string }>();

  // Tìm tour theo slug hoặc mặc định tour 1
  const tour = TOURS.find((t) => t.slug === tourSlug) ?? TOURS[0];

  // YÊU CẦU: Đồng bộ liên kết trang - Tự động cuộn lên đầu khi chuyển tour
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tourSlug]);

  // State đặt tour
  const [selectedDate, setSelectedDate] = useState("2026-12-01");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [customerName, setCustomerName] = useState(user?.fullName || "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [pickupNote, setPickupNote] = useState("");
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [confirmedBookingCode, setConfirmedBookingCode] = useState<string | null>(null);

  // State Audio trích đoạn văn hóa cục bộ của tour
  const [isPlayingLocalAudio, setIsPlayingLocalAudio] = useState(false);

  // State mở Modal Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const photos = useMemo(
    () =>
      tour.gallery && tour.gallery.length > 0
        ? tour.gallery
        : [
            {
              url: tour.image,
              tag: tour.badge,
              caption: tour.title,
              subcaption: tour.description,
            },
          ],
    [tour]
  );

  const handleOpenLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  const handleNextPhoto = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const handlePrevPhoto = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseLightbox();
      if (e.key === "ArrowRight") handleNextPhoto();
      if (e.key === "ArrowLeft") handlePrevPhoto();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, handleNextPhoto, handlePrevPhoto]);

  // Giá tính toán
  const adultPrice = tour.adultPrice ?? 650000;
  const childPrice = tour.childPrice ?? 450000;
  const totalPrice = adults * adultPrice + children * childPrice;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Vui lòng cung cấp Họ tên và Số điện thoại liên hệ để giữ chỗ.");
      return;
    }

    setIsBookingSubmitting(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          tour_slug: tour.slug,
          tour_title: tour.title,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          pickup_note: pickupNote.trim(),
          departure_date: selectedDate,
          adults,
          children,
          total_price: totalPrice,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const code = data.data?.bookingCode || data.data?.booking?.booking_code;
        setConfirmedBookingCode(code);
        toast.success("Đặt giữ chỗ thành công!", {
          description: `Mã đặt chỗ: ${code} • ${adults} người lớn, ${children} trẻ em • Ngày ${selectedDate}. Điều phối viên Dana sẽ liên hệ qua Zalo/SĐT ${customerPhone} ngay.`,
        });
      } else {
        toast.error(data.message || "Không thể đặt tour. Vui lòng kiểm tra lại thông tin.");
      }
    } catch {
      toast.error("Lỗi kết nối máy chủ khi đặt tour. Vui lòng thử lại sau.");
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  const handleContactZalo = () => {
    toast.info("Kết nối Zalo tư vấn", {
      description: "Đang mở cửa sổ hỗ trợ viên bản địa Trượng Văn Hải (Hotline: 0918.388.998).",
    });
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <Header />

      <main className="w-full pt-16 xl:pt-20 bg-surface flex-1">
        {/* Top Heritage Breadcrumb & Title Section */}
        <section className="w-full bg-surface-container-low/70 py-space-md border-b border-surface-container-high/60">
          <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
              <Link to="/" className="hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-outline shrink-0" />
              <Link to="/tour" className="hover:text-primary transition-colors">
                Hành trình Độc bản
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-outline shrink-0" />
              <span className="hover:text-primary transition-colors cursor-pointer">
                {tour.location}
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-outline shrink-0" />
              <span className="text-primary font-semibold truncate max-w-xs sm:max-w-none">
                {tour.title}
              </span>
            </nav>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-space-xs mt-space-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-[11px] tracking-wider uppercase font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" /> UNESCO Di sản phi vật thể khẩn cấp
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-highest text-secondary font-label-sm text-[11px] font-semibold tracking-wider uppercase">
                <Clock className="h-3.5 w-3.5" /> {tour.duration}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-semibold tracking-wider uppercase">
                <Users className="h-3.5 w-3.5" /> Tối đa 8 khách
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-[11px] font-semibold tracking-wider uppercase">
                <HeartHandshake className="h-3.5 w-3.5" /> 70% Hoàn Lưu Làng Nghề
              </span>
            </div>

            {/* Main Headline */}
            <div className="mt-space-sm max-w-4xl">
              <div className="text-secondary font-label-md text-xs uppercase tracking-widest font-semibold mb-1">
                {tour.location}
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl xl:text-5xl text-on-surface tracking-tight leading-tight font-semibold">
                {tour.title}
              </h1>
              <p className="font-body-md xl:font-body-lg text-sm sm:text-base xl:text-lg text-on-surface-variant mt-2 max-w-3xl leading-relaxed">
                {tour.description}
              </p>
            </div>

            {/* Meta Strip Bar */}
            <div className="mt-space-md pt-space-sm grid grid-cols-2 md:grid-cols-4 gap-space-md bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                  <Star className="h-5 w-5 fill-current text-secondary" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-title-md text-base text-on-surface font-bold">
                      {tour.rating ?? "5.0"}
                    </span>
                    <span className="text-secondary text-xs">★★★★★</span>
                  </div>
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    {tour.reviewsCount ?? "48"} đánh giá chuyên sâu
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary shrink-0">
                  <MapPin className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <span className="font-title-md text-sm text-on-surface font-semibold block leading-tight">
                    {tour.location}
                  </span>
                  <span className="font-body-sm text-xs text-on-surface-variant truncate block max-w-[180px]">
                    TT. Phước Dân, Ninh Phước
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-tertiary shrink-0">
                  <Navigation className="h-5 w-5 text-tertiary" />
                </div>
                <div>
                  <span className="font-title-md text-sm text-on-surface font-semibold block leading-tight">
                    Đón Tiễn Tận Nơi
                  </span>
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    TP. Phan Rang - Tháp Chàm
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="font-title-md text-sm text-on-surface font-semibold block leading-tight">
                    Khởi Hành Hàng Ngày
                  </span>
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    08:00 Sáng • Tối đa 8 khách
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Photo Gallery Section (5 items) */}
        <section className="w-full max-w-7xl mx-auto px-margin-mobile xl:px-margin py-space-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-sm relative">
            {/* Big Hero Lead Image (Left 7 cols) */}
            <div
              onClick={() => handleOpenLightbox(0)}
              className="lg:col-span-7 h-[380px] lg:h-[520px] rounded-2xl overflow-hidden relative group shadow-md border border-outline-variant/30 cursor-pointer"
            >
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                alt={photos[0]?.caption || tour.title}
                src={photos[0]?.url || tour.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/85 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-on-primary">
                <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-[11px] uppercase tracking-wider font-semibold">
                  Tác Tục Cổ Truyền
                </span>
                <h3 className="font-serif text-xl sm:text-2xl mt-1 text-white font-semibold">
                  Bàn tay nhào nặn đất sét ngàn năm của Muk Đàng Thị Phan
                </h3>
                <p className="font-body-sm text-xs sm:text-sm text-white/90 mt-1 line-clamp-1">
                  Kỹ thuật "tay quay, chân chạy" hoàn toàn không có sự can thiệp của bàn xoay máy móc vô tri.
                </p>
              </div>
            </div>

            {/* 4 Mosaic Images (Right 5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-space-sm h-[380px] lg:h-[520px]">
              <div
                onClick={() => handleOpenLightbox(photos.length > 1 ? 1 : 0)}
                className="h-full rounded-2xl overflow-hidden relative group shadow-sm border border-outline-variant/30 cursor-pointer"
              >
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={photos[1]?.caption || "Nung lộ thiên Bàu Trúc"}
                  src={photos[1]?.url || tour.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/75 via-transparent to-transparent"></div>
                <span className="absolute bottom-3 left-3 text-white font-label-md text-xs font-semibold drop-shadow">
                  Nung lộ thiên trong rơm củi
                </span>
              </div>

              <div
                onClick={() => handleOpenLightbox(photos.length > 2 ? 2 : 0)}
                className="h-full rounded-2xl overflow-hidden relative group shadow-sm border border-outline-variant/30 cursor-pointer"
              >
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={photos[2]?.caption || "Hoa văn vỏ sò"}
                  src={photos[2]?.url || tour.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/75 via-transparent to-transparent"></div>
                <span className="absolute bottom-3 left-3 text-white font-label-md text-xs font-semibold drop-shadow">
                  Văn hoa răng cưa & vỏ sò
                </span>
              </div>

              <div
                onClick={() => handleOpenLightbox(photos.length > 3 ? 3 : 0)}
                className="h-full rounded-2xl overflow-hidden relative group shadow-sm border border-outline-variant/30 cursor-pointer"
              >
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={photos[3]?.caption || "Ẩm thực cơm nhà Paley"}
                  src={photos[3]?.url || tour.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/75 via-transparent to-transparent"></div>
                <span className="absolute bottom-3 left-3 text-white font-label-md text-xs font-semibold drop-shadow">
                  Ẩm thực cơm nhà Paley
                </span>
              </div>

              <div
                onClick={() => handleOpenLightbox(photos.length > 4 ? 4 : 0)}
                className="h-full rounded-2xl overflow-hidden relative group shadow-sm border border-outline-variant/30 cursor-pointer"
              >
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={photos[4]?.caption || "Nhà rường Chăm"}
                  src={photos[4]?.url || tour.image}
                />
                <div className="absolute inset-0 bg-on-surface/60 group-hover:bg-on-surface/70 transition-colors flex flex-col items-center justify-center p-space-sm text-center">
                  <Camera className="h-7 w-7 text-white mb-1" />
                  <span className="text-white font-label-lg text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    Xem Toàn Bộ 24 Ảnh
                  </span>
                  <span className="text-white/80 font-body-sm text-xs">& Bản ký lục di sản</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Quick Nav Tabs */}
        <section className="sticky top-16 xl:top-20 z-40 bg-surface/95 backdrop-blur-md shadow-sm border-y border-surface-container-high/60">
          <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin flex items-center justify-between overflow-x-auto no-scrollbar gap-space-md py-3">
            <div className="flex items-center gap-space-md sm:gap-space-lg whitespace-nowrap font-label-lg text-xs sm:text-sm">
              <a className="text-primary font-bold pb-1 flex items-center gap-1.5" href="#tong-quan">
                <Radio className="h-4 w-4" /> Tổng quan & Triết lý
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors pb-1" href="#diem-doc-ban">
                4 Điểm chạm độc bản
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors pb-1" href="#lich-trinh">
                Lịch trình 5 chặng
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors pb-1" href="#nguoi-giu-lua">
                Người giữ lửa (Muk Nghệ nhân)
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors pb-1" href="#quy-tac-ung-xu">
                Cẩm nang ứng xử Chăm
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors pb-1" href="#danh-gia">
                Đánh giá lữ khách (48)
              </a>
            </div>
            <div className="hidden xl:flex items-center gap-space-sm text-on-surface-variant font-body-sm text-xs pl-4 shrink-0">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span>
                Hôm nay còn <strong>3/8 suất trống</strong>
              </span>
            </div>
          </div>
        </section>

        {/* Main 2-Column Section */}
        <section className="w-full max-w-7xl mx-auto px-margin-mobile xl:px-margin py-space-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            {/* LEFT COLUMN: Content (lg:col-span-8) */}
            <div className="lg:col-span-8 flex flex-col gap-space-xl">
              {/* Philosophy & Living Audio Guide */}
              <div className="flex flex-col gap-space-md" id="tong-quan">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-primary"></span>
                  <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
                    Triết Lý Văn Hóa Trầm Tích
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-on-surface leading-snug font-semibold">
                  "Người Chăm gọi gốm là đứa con linh thiêng được ấp ủ từ bụng Mẹ Đất và hơi thở của Thần Lửa..."
                </h2>
                <div className="p-space-lg rounded-2xl bg-surface-container-low relative overflow-hidden shadow-sm border border-outline-variant/30">
                  <div className="absolute -right-6 -bottom-6 opacity-10 text-primary pointer-events-none">
                    <Flame className="h-44 w-44" />
                  </div>
                  <p className="font-body-lg text-base xl:text-lg text-on-surface leading-relaxed italic mb-space-md">
                    "Tại Bàu Trúc (Paley Hamu Trok), không có chiếc bàn xoay cơ khí vô tri nào can thiệp. Đôi chân trần của người phụ nữ Chăm bước lùi uyển chuyển theo nhịp xoay tròn của vũ trụ, đôi bàn tay mềm dịu vuốt ve từng thớ đất sét dẻo quánh lấy từ triền sông Quao. Gốm không tráng men Tây, mà được tôi luyện trong làn khói rơm khô và tưới đẫm nước vỏ cây thị hoang dã để kết tinh những vệt khói lam hỏa biến độc bản không trùng lặp."
                  </p>
                  <div className="flex items-center gap-space-sm pt-space-xs text-on-surface-variant font-label-md text-xs sm:text-sm">
                    <FileText className="h-4 w-4 text-secondary" />
                    <span>Ghi chép từ Thuyết minh Văn hóa Dân gian Panduranga • Viện Nghiên cứu Văn hóa Chăm</span>
                  </div>
                </div>

                {/* Living Mini Audio Guide Player */}
                <div className="p-space-md rounded-2xl bg-inverse-surface text-inverse-on-surface shadow-md flex flex-col sm:flex-row items-center justify-between gap-space-md border border-white/10">
                  <div className="flex items-center gap-space-md">
                    <button
                      onClick={() => setIsPlayingLocalAudio(!isPlayingLocalAudio)}
                      className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:scale-105 transition-transform flex-shrink-0 shadow"
                      type="button"
                    >
                      <Play className={`h-6 w-6 fill-current ${isPlayingLocalAudio ? "animate-pulse" : ""}`} />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-[10px] uppercase font-semibold">
                          Audio Tour Trực Tiếp
                        </span>
                        <span className="font-label-sm text-xs text-surface-variant">03:42 Phút</span>
                      </div>
                      <h4 className="font-serif text-base sm:text-lg text-white font-semibold mt-1">
                        Sự tích Mẹ Xứ Sở Po Ino Nagar truyền dạy nghề gốm
                      </h4>
                      <p className="font-body-sm text-xs text-inverse-on-surface/80">
                        Giọng kể trầm ấm của Muk Phan hòa cùng tiếng đàn Kanhi độc tấu
                      </p>
                    </div>
                  </div>

                  {/* Waveform visual animation */}
                  <div className="w-full sm:w-44 flex items-center gap-1 h-8 px-2 py-1 bg-white/10 rounded-lg">
                    {[12, 24, 28, 16, 32, 20, 10, 24, 18, 28, 8, 20].map((h, i) => (
                      <span
                        key={i}
                        style={{ height: isPlayingLocalAudio ? `${h}px` : "8px" }}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          i % 3 === 0 ? "bg-primary" : "bg-secondary-container"
                        }`}
                      ></span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4 Distinct Highlight Touches */}
              <div className="flex flex-col gap-space-md pt-space-md" id="diem-doc-ban">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-0.5 bg-primary"></span>
                    <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
                      Trải Nghiệm Độc Bản
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-on-surface mt-1 font-semibold">
                    4 Điểm chạm tinh hoa không thể bỏ lỡ
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {/* Touch 1 */}
                  <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm hover:shadow-md transition-shadow border border-outline-variant/30">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-primary font-bold text-3xl opacity-40">01</span>
                      <span className="p-2 rounded-xl bg-surface-container text-primary">
                        <HandMetal className="h-6 w-6" />
                      </span>
                    </div>
                    <h3 className="font-serif text-lg text-on-surface font-semibold">
                      Workshop "Tay quay, Chân chạy" Đích Thực
                    </h3>
                    <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                      Được một nghệ nhân lớn tuổi cầm tay chỉ bước: đi giật lùi quanh cối trụ, dùng mảnh vải cuộn ướt vuốt mộc miệng bình và dập hoa văn răng cưa bằng mảnh sò biển cổ truyền.
                    </p>
                    <div className="mt-auto pt-space-xs font-label-md text-xs text-secondary font-semibold flex items-center gap-1 border-t border-surface-container/60">
                      <CheckCircle className="h-3.5 w-3.5" /> Mang về 01 tác phẩm gốm mộc của riêng bạn
                    </div>
                  </div>

                  {/* Touch 2 */}
                  <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm hover:shadow-md transition-shadow border border-outline-variant/30">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-secondary font-bold text-3xl opacity-40">02</span>
                      <span className="p-2 rounded-xl bg-surface-container text-secondary">
                        <Flame className="h-6 w-6" />
                      </span>
                    </div>
                    <h3 className="font-serif text-lg text-on-surface font-semibold">
                      Nghi Thức Tôi Gốm Hoàng Hôn Lộ Thiên
                    </h3>
                    <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                      Chứng kiến bãi nung rơm củi lộ thiên bốc lửa đỏ rực rỡ lúc 16h chiều. Tận mắt xem nghệ nhân dùng chổi tre vẩy nước ép vỏ cây thị (Kha buh) tạo nên sắc vệt loang khói lam huyền diệu.
                    </p>
                    <div className="mt-auto pt-space-xs font-label-md text-xs text-secondary font-semibold flex items-center gap-1 border-t border-surface-container/60">
                      <CheckCircle className="h-3.5 w-3.5" /> Độc quyền quan sát quy trình nung truyền thống
                    </div>
                  </div>

                  {/* Touch 3 */}
                  <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm hover:shadow-md transition-shadow border border-outline-variant/30">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-tertiary font-bold text-3xl opacity-40">03</span>
                      <span className="p-2 rounded-xl bg-surface-container text-tertiary">
                        <UtensilsCrossed className="h-6 w-6" />
                      </span>
                    </div>
                    <h3 className="font-serif text-lg text-on-surface font-semibold">
                      Ẩm Thực Gia Đình Chăm Paley Nguyên Bản
                    </h3>
                    <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                      Ngồi ăn trưa quây quần cùng gia đình người bản địa: canh bồi Um Bơk lá rừng cay nồng, bánh gừng ngọt ngào, bánh cúng Sakaya béo ngậy và trà lá dối thảo mộc mát lành.
                    </p>
                    <div className="mt-auto pt-space-xs font-label-md text-xs text-secondary font-semibold flex items-center gap-1 border-t border-surface-container/60">
                      <CheckCircle className="h-3.5 w-3.5" /> Thực đơn hữu cơ bản địa do chính tay Muk nấu
                    </div>
                  </div>

                  {/* Touch 4 */}
                  <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm hover:shadow-md transition-shadow border border-outline-variant/30">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-primary-container font-bold text-3xl opacity-40">04</span>
                      <span className="p-2 rounded-xl bg-surface-container text-primary-container">
                        <MessageSquare className="h-6 w-6" />
                      </span>
                    </div>
                    <h3 className="font-serif text-lg text-on-surface font-semibold">
                      Độc Thoại Chuyện Làng Cùng Nghệ Nhân Ưu Tú
                    </h3>
                    <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                      Không gian trò chuyện thân tình dưới hiên nhà gỗ cổ tích: nghe những câu chuyện thăng trầm 55 năm giữ hồn gốm cổ, phong tục mẫu hệ và cách người Chăm tôn kính Mẹ Đất.
                    </p>
                    <div className="mt-auto pt-space-xs font-label-md text-xs text-secondary font-semibold flex items-center gap-1 border-t border-surface-container/60">
                      <CheckCircle className="h-3.5 w-3.5" /> Phiên dịch viên di sản đồng hành trọn vẹn
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Stage Detailed Itinerary Timeline */}
              <div className="flex flex-col gap-space-md pt-space-md" id="lich-trinh">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-0.5 bg-primary"></span>
                    <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
                      Hành Trình Chi Tiết
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-on-surface mt-1 font-semibold">
                    Lịch trình 5 chặng thong dong một ngày
                  </h2>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    Thiết kế nhịp nhàng, tôn trọng thời gian biểu và giấc nghỉ trưa an lành của bà con làng gốm.
                  </p>
                </div>

                <div className="flex flex-col gap-space-md">
                  {/* Stage 1 */}
                  <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row gap-space-md items-start border border-outline-variant/30">
                    <div className="flex flex-row md:flex-col items-center md:items-start justify-between w-full md:w-36 shrink-0">
                      <span className="px-2.5 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-[11px] font-bold uppercase">
                        Chặng 01
                      </span>
                      <span className="font-title-md text-base text-primary font-bold mt-1">08:00 - 09:00</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-lg text-on-surface font-semibold">
                        Đón Khách Tại TP. Phan Rang & Tạ Ơn Thần Xứ Sở Dưới Hiên Cổ
                      </h4>
                      <p className="font-body-md text-sm text-on-surface-variant mt-1 leading-relaxed">
                        Xe đưa đón đón quý khách tại khách sạn trung tâm. Di chuyển 10km đến làng Hamu Trok. Nhận khăn rằn Chăm dệt tay, thưởng thức chén trà lá rừng thơm thoảng hương sả cùng trầu cau chào khách theo đúng lễ nghi mẫu hệ.
                      </p>
                    </div>
                  </div>

                  {/* Stage 2 */}
                  <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row gap-space-md items-start border border-outline-variant/30">
                    <div className="flex flex-row md:flex-col items-center md:items-start justify-between w-full md:w-36 shrink-0">
                      <span className="px-2.5 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-[11px] font-bold uppercase">
                        Chặng 02
                      </span>
                      <span className="font-title-md text-base text-secondary font-bold mt-1">09:00 - 11:30</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-lg text-on-surface font-semibold">
                        Workshop Nghệ Thuật: Bí Thuật "Tay Quay, Chân Chạy"
                      </h4>
                      <p className="font-body-md text-sm text-on-surface-variant mt-1 leading-relaxed">
                        Tìm hiểu mỏ đất sét bí mật tại bờ sông Quao chỉ người Bàu Trúc được phép khai thác. Quan sát nghệ nhân nhồi đất cát mịn, học tư thế đứng - bước lùi 3 vòng tạo dáng lu đựng nước, dùng vòng tre "chải" nhẵn và vỏ sò cào hoa văn răng cưa sóng nước.
                      </p>
                    </div>
                  </div>

                  {/* Stage 3 */}
                  <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row gap-space-md items-start border border-outline-variant/30">
                    <div className="flex flex-row md:flex-col items-center md:items-start justify-between w-full md:w-36 shrink-0">
                      <span className="px-2.5 py-1 rounded-full bg-tertiary text-on-tertiary font-label-sm text-[11px] font-bold uppercase">
                        Chặng 03
                      </span>
                      <span className="font-title-md text-base text-tertiary font-bold mt-1">11:30 - 13:30</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-lg text-on-surface font-semibold">
                        Bữa Cơm Paley Dưới Giàn Nho & Thanh Âm Kèn Saranai
                      </h4>
                      <p className="font-body-md text-sm text-on-surface-variant mt-1 leading-relaxed">
                        Nghỉ ngơi, thưởng thức bữa cơm truyền thống thịnh soạn với canh bồi rau tập tàng, cá lăng nướng muối ớt sả, thịt kho củ nén. Nghỉ trưa tự do trên võng gai mát rượi dưới rặng tre làng hoặc nghe nghệ sĩ già thử tiếng kèn Saranai réo rắt.
                      </p>
                    </div>
                  </div>

                  {/* Stage 4 */}
                  <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row gap-space-md items-start border border-outline-variant/30">
                    <div className="flex flex-row md:flex-col items-center md:items-start justify-between w-full md:w-36 shrink-0">
                      <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-[11px] font-bold uppercase">
                        Chặng 04
                      </span>
                      <span className="font-title-md text-base text-on-surface-variant font-bold mt-1">13:30 - 15:00</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-lg text-on-surface font-semibold">
                        Giải Mã Biểu Tượng Linga - Yoni & Thăm Kho Cổ Vật Gốm Đền Tháp
                      </h4>
                      <p className="font-body-md text-sm text-on-surface-variant mt-1 leading-relaxed">
                        Bước vào gian nhà trưng bày di sản cộng đồng: khám phá các chum vò cổ thế kỷ 17, phù điêu thần linh đất nung từng dùng trong lễ cúng đền Kalan Po Klong Garai. Học cách phân biệt gốm thờ tự linh thiêng và gốm gia dụng thường nhật.
                      </p>
                    </div>
                  </div>

                  {/* Stage 5 */}
                  <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row gap-space-md items-start border border-outline-variant/30">
                    <div className="flex flex-row md:flex-col items-center md:items-start justify-between w-full md:w-36 shrink-0">
                      <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary font-label-sm text-[11px] font-bold uppercase">
                        Chặng 05
                      </span>
                      <span className="font-title-md text-base text-primary font-bold mt-1">15:00 - 17:30</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-lg text-on-surface font-semibold">
                        Đại Lễ Lửa Nung Lộ Thiên, Tôi Khói Thị & Đóng Gói Tác Phẩm
                      </h4>
                      <p className="font-body-md text-sm text-on-surface-variant mt-1 leading-relaxed">
                        Khoảnh khắc hoàng hôn kỳ ảo nhất trong ngày: cả bãi gốm giữa đồng rơm bắt lửa bùng cháy. Ngắm nhìn những nghệ nhân dùng kẹp sắt lấy gốm đỏ rực và vẩy vỏ cây thị tạo màu loang khói huyền bí. Đóng gói cẩn thận tác phẩm lưu niệm vào hộp giấy kraft mộc trao tay quý khách trước khi xe đưa về Phan Rang.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meet The Artisan (Người giữ lửa) */}
              <div
                className="p-space-lg rounded-2xl bg-surface-container-low shadow-sm flex flex-col md:flex-row gap-space-lg items-center border border-outline-variant/30"
                id="nguoi-giu-lua"
              >
                <div className="w-full md:w-52 h-64 rounded-xl overflow-hidden shrink-0 shadow">
                  <img
                    className="w-full h-full object-cover"
                    alt="Muk Đàng Thị Phan"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXnVPS6oUU6URxfP4TdxHq-UsUwE04_gnpvwkrptd7BS9dXmx1ChJ7WMISmS784kI32f0t8UQRf6k-MDPPx_XQJ664Ju5dHKtYkiO-EGDM0AHxY3pwwfDkogXvFWI_HnsiYVujgmtrvXQitBbSLyAF2U3jmzcl-P6-1W9bb78_xcGU8fN1JZ7J8spZY0Xv9IkZsFQ2keAyI_isVwMyrwg1DzRYwMwraJ8pgS3d9giKmqo58fEtRvN1RA"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-space-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-[11px] uppercase font-semibold">
                      Nghệ Nhân Ưu Tú Quốc Gia
                    </span>
                    <span className="text-secondary font-label-sm text-xs font-semibold">
                      55 Năm Gắn Bó Với Lửa Nghề
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-on-surface font-semibold">
                    Muk Đàng Thị Phan
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant italic leading-relaxed">
                    "Đất sét ở Bàu Trúc có linh hồn người Chăm mình gửi gắm ở trỏng. Phải thương đất, nhào đất bằng cả tấm lòng chân thật thì lửa nung mới nhường cho màu đỏ gạch tháp rạng ngời."
                  </p>
                  <p className="font-body-sm text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Muk Phan là một trong số ít những bậc thầy cao tuổi của làng Hamu Trok từng vinh dự biểu diễn kỹ thuật "tay quay, chân chạy" tại Bảo tàng Dân tộc học Quốc tế và là nhân chứng sống truyền thụ di sản cho nhiều thế hệ con cháu.
                  </p>
                  <div className="pt-space-xs flex items-center gap-space-sm">
                    <span className="inline-flex items-center gap-1 text-primary font-label-md text-xs font-bold">
                      <HeartHandshake className="h-4 w-4" /> Cam kết Hoàn lưu Sinh kế 70%
                    </span>
                  </div>
                </div>
              </div>

              {/* Cham Cultural Etiquette */}
              <div
                className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md border border-outline-variant/30"
                id="quy-tac-ung-xu"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-primary"></span>
                  <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
                    Quy Tắc Ứng Xử Di Sản
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-on-surface font-semibold">
                  3 Nguyên tắc tôn trọng khi ghé thăm Paley Chăm
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                  <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Shirt className="h-5 w-5" />
                    </div>
                    <h5 className="font-title-md text-sm text-on-surface font-semibold">Trang phục trang nhã</h5>
                    <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                      Vui lòng mặc quần hoặc váy dài qua gối khi bước vào sân nhà cổ và các gian thờ tự dòng tộc mẫu hệ.
                    </p>
                  </div>

                  <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Share2 className="h-5 w-5" />
                    </div>
                    <h5 className="font-title-md text-sm text-on-surface font-semibold">Tôn trọng sự riêng tư</h5>
                    <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                      Xin phép bằng nụ cười thân thiện trước khi chụp ảnh chân dung cự ly gần của người cao tuổi và trẻ nhỏ.
                    </p>
                  </div>

                  <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Flame className="h-5 w-5" />
                    </div>
                    <h5 className="font-title-md text-sm text-on-surface font-semibold">Bảo vệ khối gốm mộc</h5>
                    <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                      Không bước ngang qua đầu các mẻ gốm ướt đang phơi trên sân nắng, bởi người Chăm xem đó là kiêng kỵ tâm linh.
                    </p>
                  </div>
                </div>
              </div>

              {/* Guest Reviews */}
              <div className="flex flex-col gap-space-md pt-space-md" id="danh-gia">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-0.5 bg-primary"></span>
                      <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
                        Cảm Xúc Người Đi Trước
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl text-on-surface mt-1 font-semibold">
                      Đánh giá từ lữ khách (48)
                    </h3>
                  </div>
                  <button
                    onClick={() => toast("Đang mở biểu mẫu gửi cảm nhận lữ khách")}
                    className="px-space-md py-2 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-md text-xs sm:text-sm font-semibold transition-colors"
                  >
                    Viết cảm nhận của bạn
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-xs">
                          <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary font-title-md flex items-center justify-center font-bold text-sm">
                            L
                          </div>
                          <div>
                            <h5 className="font-title-md text-sm text-on-surface font-semibold leading-tight">
                              Lê Minh Trang
                            </h5>
                            <span className="font-body-sm text-xs text-on-surface-variant">
                              Hà Nội • Khởi hành tháng 2/2025
                            </span>
                          </div>
                        </div>
                        <span className="text-secondary text-xs">★★★★★</span>
                      </div>
                      <p className="font-body-md text-sm text-on-surface-variant leading-relaxed mt-2">
                        "Chuyến đi chạm sâu sắc vào tâm hồn tôi. Cảm giác đi giật lùi theo bước chân Muk Phan để nặn một chiếc bình gốm thật sự thiền định. Bữa trưa dưới giàn nho với món canh Um Bơk ngon bất ngờ!"
                      </p>
                    </div>
                    <div className="mt-space-sm pt-space-xs text-secondary font-label-sm text-[11px] uppercase tracking-wider font-semibold border-t border-surface-container/60">
                      Đã xác thực tham gia hành trình
                    </div>
                  </div>

                  <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-xs">
                          <div className="w-9 h-9 rounded-full bg-tertiary-container text-on-tertiary font-title-md flex items-center justify-center font-bold text-sm">
                            J
                          </div>
                          <div>
                            <h5 className="font-title-md text-sm text-on-surface font-semibold leading-tight">
                              Jean-Luc Mercier
                            </h5>
                            <span className="font-body-sm text-xs text-on-surface-variant">
                              Paris, France • Khởi hành tháng 1/2025
                            </span>
                          </div>
                        </div>
                        <span className="text-secondary text-xs">★★★★★</span>
                      </div>
                      <p className="font-body-md text-sm text-on-surface-variant leading-relaxed mt-2">
                        "Une expérience inoubliable! Seeing the outdoor pottery firing at sunset and understanding why no wheel is used is astonishing. The local guide was extremely respectful and knowledgeable."
                      </p>
                    </div>
                    <div className="mt-space-sm pt-space-xs text-secondary font-label-sm text-[11px] uppercase tracking-wider font-semibold border-t border-surface-container/60">
                      Đã xác thực tham gia hành trình
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Sticky Booking Widget & Instant Info (lg:col-span-4) */}
            <aside className="lg:col-span-4 w-full lg:sticky lg:top-36 flex flex-col gap-space-md">
              {/* Main Booking Card */}
              <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-xl flex flex-col gap-space-md border border-outline-variant/30">
                {/* Pricing Header */}
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant block">
                      Giá trọn gói 1 ngày
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-serif text-3xl text-primary font-bold">
                        {adultPrice.toLocaleString("vi-VN")}đ
                      </span>
                      <span className="font-body-sm text-xs text-on-surface-variant">/ khách lớn</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs font-semibold uppercase">
                      Nhóm Nhỏ
                    </span>
                    <span className="font-body-sm text-xs text-on-surface-variant block mt-1">
                      Trẻ em: {childPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-surface-variant/60"></div>

                {/* Booking Confirmation Success Card */}
                {confirmedBookingCode ? (
                  <div className="p-space-md rounded-2xl bg-primary/10 border border-primary/30 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-primary font-serif font-bold text-base">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Đặt Giữ Chỗ Thành Công!</span>
                    </div>
                    <div className="p-3 bg-white/80 rounded-xl border border-primary/20 flex flex-col gap-1">
                      <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">
                        Mã Xác Nhận Đặt Tour:
                      </span>
                      <span className="font-mono text-xl font-extrabold text-primary tracking-wide">
                        {confirmedBookingCode}
                      </span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                      Điều phối viên bản địa sẽ liên hệ trực tiếp qua số{" "}
                      <strong className="text-on-surface font-semibold">{customerPhone}</strong> trong vòng 15 phút để xác nhận điểm đón tại Phan Rang.
                    </p>
                    <button
                      type="button"
                      onClick={() => setConfirmedBookingCode(null)}
                      className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-xs font-semibold hover:bg-primary-container transition-colors"
                    >
                      Đặt thêm lượt trải nghiệm khác
                    </button>
                  </div>
                ) : (
                  /* Booking Form */
                  <form className="flex flex-col gap-space-sm" onSubmit={handleBooking}>
                    {/* Date Picker */}
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface font-semibold flex items-center justify-between">
                        <span>Chọn Ngày Khởi Hành</span>
                        <span className="text-secondary font-label-sm text-[11px]">Hàng ngày</span>
                      </label>
                      <div className="relative flex items-center">
                        <Calendar className="absolute left-3 text-outline h-4 w-4 pointer-events-none" />
                        <input
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface text-on-surface font-body-md text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-outline-variant/30"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Customer Info Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-xs text-on-surface font-semibold">
                          Họ và tên du khách *
                        </label>
                        <input
                          className="w-full px-3 py-2 rounded-xl bg-surface text-on-surface font-body-md text-xs focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-outline-variant/30"
                          type="text"
                          required
                          placeholder="Nguyễn Văn A..."
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-xs text-on-surface font-semibold">
                          Số điện thoại / Zalo *
                        </label>
                        <input
                          className="w-full px-3 py-2 rounded-xl bg-surface text-on-surface font-body-md text-xs focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-outline-variant/30"
                          type="tel"
                          required
                          placeholder="0918 388 998..."
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Pickup Location Note */}
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface font-semibold">
                        Khách sạn hoặc điểm đón dự kiến
                      </label>
                      <input
                        className="w-full px-3 py-2 rounded-xl bg-surface text-on-surface font-body-md text-xs focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-outline-variant/30"
                        type="text"
                        placeholder="Khách sạn Sài Gòn - Ninh Chữ, Resort..."
                        value={pickupNote}
                        onChange={(e) => setPickupNote(e.target.value)}
                      />
                    </div>

                    {/* Guest Stepper */}
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs text-on-surface font-semibold">Số Lượng Du Khách</label>
                      <div className="grid grid-cols-2 gap-space-xs">
                        {/* Adults Stepper */}
                        <div className="p-2.5 rounded-xl bg-surface flex items-center justify-between shadow-sm border border-outline-variant/30">
                          <div>
                            <span className="font-label-md text-xs text-on-surface block font-medium">Người lớn</span>
                            <span className="font-body-sm text-[11px] text-on-surface-variant">Từ 12 tuổi</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                              className="w-7 h-7 rounded-lg bg-surface-container-high hover:bg-surface-variant flex items-center justify-center text-on-surface text-xs font-bold transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-title-md text-sm text-on-surface font-bold w-4 text-center">
                              {adults}
                            </span>
                            <button
                              type="button"
                              onClick={() => setAdults((prev) => prev + 1)}
                              className="w-7 h-7 rounded-lg bg-surface-container-high hover:bg-surface-variant flex items-center justify-center text-on-surface text-xs font-bold transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        {/* Children Stepper */}
                        <div className="p-2.5 rounded-xl bg-surface flex items-center justify-between shadow-sm border border-outline-variant/30">
                          <div>
                            <span className="font-label-md text-xs text-on-surface block font-medium">Trẻ em</span>
                            <span className="font-body-sm text-[11px] text-on-surface-variant">6 - 11 tuổi</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                              className="w-7 h-7 rounded-lg bg-surface-container-high hover:bg-surface-variant flex items-center justify-center text-on-surface text-xs font-bold transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-title-md text-sm text-on-surface font-bold w-4 text-center">
                              {children}
                            </span>
                            <button
                              type="button"
                              onClick={() => setChildren((prev) => prev + 1)}
                              className="w-7 h-7 rounded-lg bg-surface-container-high hover:bg-surface-variant flex items-center justify-center text-on-surface text-xs font-bold transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown Summary */}
                    <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1 text-on-surface-variant font-body-sm text-xs mt-1 border border-outline-variant/20">
                      <div className="flex justify-between">
                        <span>
                          Người lớn ({adults} khách × {adultPrice.toLocaleString("vi-VN")}đ)
                        </span>
                        <span className="text-on-surface font-medium">
                          {(adults * adultPrice).toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                      {children > 0 && (
                        <div className="flex justify-between">
                          <span>
                            Trẻ em ({children} khách × {childPrice.toLocaleString("vi-VN")}đ)
                          </span>
                          <span className="text-on-surface font-medium">
                            {(children * childPrice).toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Workshop gốm & tác phẩm mang về</span>
                        <span className="text-secondary font-medium">Đã bao gồm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bữa trưa gia đình Chăm 6 món</span>
                        <span className="text-secondary font-medium">Đã bao gồm</span>
                      </div>
                      <div className="w-full h-px bg-surface-variant/60 my-1"></div>
                      <div className="flex justify-between font-serif text-base text-on-surface font-bold">
                        <span>Tổng chi phí:</span>
                        <span className="text-primary text-lg">{totalPrice.toLocaleString("vi-VN")}đ</span>
                      </div>
                    </div>

                    {/* Primary Booking CTA */}
                    <button
                      className="w-full mt-2 py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-sm uppercase tracking-wider font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      type="submit"
                      disabled={isBookingSubmitting}
                    >
                      {isBookingSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Đang gửi xác nhận...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Đặt Giữ Chỗ Ngay</span>
                        </>
                      )}
                    </button>

                    {/* Secondary Contact CTA */}
                    <button
                      onClick={handleContactZalo}
                      className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                      type="button"
                    >
                      <Phone className="h-4 w-4 text-secondary" />
                      <span>Tư Vấn Nhanh Qua Zalo / Hotline Di Sản</span>
                    </button>
                  </form>
                )}

                {/* Reassurance Checklist */}
                <div className="flex flex-col gap-2 pt-space-xs text-on-surface-variant font-body-sm text-xs border-t border-surface-container/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary shrink-0" />
                    <span>
                      <strong>Hủy miễn phí</strong> trước 48 giờ khởi hành
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary shrink-0" />
                    <span>
                      <strong>70% hoàn lưu sinh kế</strong> trực tiếp đến gia đình nghệ nhân
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary shrink-0" />
                    <span>Xe ô tô máy lạnh đón tiễn tận nơi tại Phan Rang</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary shrink-0" />
                    <span>Bảo hiểm du lịch trọn gói mức 50.000.000đ</span>
                  </div>
                </div>
              </div>

              {/* Local Concierge Support Card */}
              <div className="p-space-md rounded-2xl bg-surface-container shadow-sm flex items-center gap-space-sm border border-outline-variant/30">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 shadow">
                  <img
                    className="w-full h-full object-cover"
                    alt="Trượng Văn Hải"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQcHxZQnp_K_KkgssTUSr3dpUH-yu8s4Ix1kTcwR7L2z_A2XafhHJGXwyWX_M9ZCnVn31OsSQIT1rzZ_zUtBMMtrtfR0idye9TJqqifJdr86XiZJDFvDui7Slx-nHKp7p5k5Jsp_raRoIJCZXLsOSqPp6iz4rvu_jR8R330yyIxZxNy2ipe4uJpmjtATJXYsPQ-xnmsl1H8Q2alTCaaBYoiKyjfuQyZClVHTmSaYsLpBw01ZN8Tc9xbA"
                  />
                </div>
                <div className="flex-1">
                  <h5 className="font-serif text-sm font-semibold text-on-surface leading-tight">
                    Điều Phối Viên Bản Địa Dana
                  </h5>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Trượng Văn Hải (Người con làng Hamu Trok)
                  </p>
                  <span className="font-label-sm text-xs text-primary font-bold uppercase tracking-wider block mt-0.5">
                    Hotline: 0918.388.998 (24/7)
                  </span>
                </div>
              </div>

              {/* Geographic Location Mini Widget */}
              <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-2 border border-outline-variant/30">
                <span className="font-label-sm text-xs text-secondary font-bold uppercase tracking-wider">
                  Vị trí thực tế
                </span>
                <div
                  className="w-full h-32 bg-cover bg-center rounded-xl shadow-inner relative flex items-end p-2.5 overflow-hidden"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDBhZVNn11c5UFMx2DxcaDkmtXTlq7A4saCKD1tNxwbEjoWfYJ_t6QaoLiziz0fOlD-rA7SqUGIOha3JR2EvZ49mfPs_APv5os3hrJOc78sS_6UhEiYDEk4R5zIJVYQmUzsgMSjHwPLtxiQDc3jkpmJpnLh0xBfqzf_O-OQ6yLdUt8hTxIw0cBS2MOmji5p670f2FQMJtMXVhFgnbl3UNENwJEVK2Q9f8Mfo8Vv1TRCE9r2IB8vRFuUwQ')",
                  }}
                >
                  <span className="px-2.5 py-1 rounded-md bg-inverse-surface/85 backdrop-blur-sm text-white font-label-sm text-xs font-medium">
                    Cách tháp Po Klong Garai 7km
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* YÊU CẦU: Đồng bộ liên kết trang - Khám Phá Tiếp Theo */}
        <section className="w-full bg-surface-container-low py-space-xl border-t border-surface-container-high/60">
          <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
              <div>
                <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
                  Khám Phá Tiếp Theo
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-on-surface mt-1 font-semibold">
                  Sản phẩm thủ công & Nghệ nhân đồng hành
                </h2>
              </div>
              <Link
                to="/san-pham"
                className="font-label-lg text-sm text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <span>Xem tất cả sản phẩm</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              <Link
                to="/san-pham"
                className="rounded-2xl bg-surface-container-lowest overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row border border-outline-variant/30 group"
              >
                <div className="w-full sm:w-48 h-48 sm:h-auto overflow-hidden shrink-0">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Sản phẩm thủ công Chăm"
                    src="/images/dana-life/IMG_9911.JPG"
                  />
                </div>
                <div className="p-space-md flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full font-label-sm text-[11px] font-semibold uppercase bg-primary/10 text-primary">
                        Gốm & Thổ Cẩm
                      </span>
                    </div>
                    <h4 className="font-serif text-base sm:text-lg text-on-surface font-semibold group-hover:text-primary transition-colors">
                      Tác Phẩm Gốm Bàu Trúc & Thổ Cẩm Mỹ Nghiệp
                    </h4>
                    <p className="font-body-sm text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                      Các tác phẩm thủ công độc bản được nung củi lộ thiên và dệt tay cổ truyền có thể mua hoặc đặt chế tác riêng.
                    </p>
                  </div>
                  <div className="mt-space-sm pt-space-xs flex items-center justify-between border-t border-surface-container/60">
                    <span className="font-serif text-lg text-primary font-bold">
                      Từ 950.000đ <span className="font-sans text-xs text-on-surface-variant font-normal">/ tác phẩm</span>
                    </span>
                    <span className="text-secondary font-label-md text-xs font-semibold group-hover:underline">
                      Khám phá →
                    </span>
                  </div>
                </div>
              </Link>

              <Link
                to="/nghe-nhan"
                className="rounded-2xl bg-surface-container-lowest overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row border border-outline-variant/30 group"
              >
                <div className="w-full sm:w-48 h-48 sm:h-auto overflow-hidden shrink-0">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Chân dung nghệ nhân"
                    src="/images/dana-life/IMG_9901.JPG"
                  />
                </div>
                <div className="p-space-md flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full font-label-sm text-[11px] font-semibold uppercase bg-secondary/10 text-secondary">
                        Báu Vật Nhân Văn
                      </span>
                    </div>
                    <h4 className="font-serif text-base sm:text-lg text-on-surface font-semibold group-hover:text-primary transition-colors">
                      Gặp Gỡ Những Người Giữ Lửa Ngàn Năm
                    </h4>
                    <p className="font-body-sm text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                      Lắng nghe câu chuyện đời nghề của Muk Đàng Thị Phan, nghệ nhân Phú Thị Mỡ và nghệ nhân Đàng Xem.
                    </p>
                  </div>
                  <div className="mt-space-sm pt-space-xs flex items-center justify-between border-t border-surface-container/60">
                    <span className="font-serif text-lg text-primary font-bold">
                      4+ Nghệ nhân <span className="font-sans text-xs text-on-surface-variant font-normal">tiêu biểu</span>
                    </span>
                    <span className="text-secondary font-label-md text-xs font-semibold group-hover:underline">
                      Xem chi tiết →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* YÊU CẦU: Modal thư viện ảnh độ phân giải cao kèm chú thích & điều hướng phím/click outside */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={handleCloseLightbox}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-in fade-in duration-200"
        >
          {/* Header Lightbox */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between text-white w-full max-w-6xl mx-auto z-10"
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-white/10 text-white font-label-sm text-xs tracking-wider uppercase font-semibold">
                {photos[currentPhotoIndex]?.tag || "Tư liệu Di sản"}
              </span>
              <span className="text-white/70 font-body-sm text-xs">
                {currentPhotoIndex + 1} / {photos.length}
              </span>
            </div>
            <button
              onClick={handleCloseLightbox}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              title="Đóng (Esc)"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Vùng xem ảnh + Nút điều hướng */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex-1 flex items-center justify-center max-w-6xl mx-auto w-full my-4 overflow-hidden"
          >
            <button
              onClick={handlePrevPhoto}
              className="absolute left-2 md:left-4 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105"
              title="Ảnh trước (Mũi tên trái)"
              type="button"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <img
              src={photos[currentPhotoIndex]?.url || tour.image}
              alt={photos[currentPhotoIndex]?.caption || "Ảnh di sản"}
              className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl transition-all select-none"
            />

            <button
              onClick={handleNextPhoto}
              className="absolute right-2 md:right-4 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105"
              title="Ảnh tiếp theo (Mũi tên phải)"
              type="button"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Chú thích văn hóa */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl mx-auto text-center text-white pb-2 z-10"
          >
            <h4 className="font-serif text-lg md:text-xl font-semibold">
              {photos[currentPhotoIndex]?.caption || tour.title}
            </h4>
            <p className="font-body-sm text-xs md:text-sm text-white/80 mt-1 leading-relaxed">
              {photos[currentPhotoIndex]?.subcaption || tour.description}
            </p>
          </div>
        </div>
      )}

      <Footer />
      <AudioPlayerBar />
      <BottomNav />
    </div>
  );
}