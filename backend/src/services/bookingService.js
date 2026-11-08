const crypto = require("crypto");
const supabase = require("../config/supabaseClient");
const { db } = require("../config/db");

class BookingService {
  constructor() {
    this.mockBookings = new Map();
    this.mockInquiries = [];
  }

  // 1. Tạo đơn đặt tour (TourDetailPage)
  async createTourBooking(bookingData, customerId = null) {
    // Sinh mã ngẫu nhiên bảo mật cao (cryptographically random 8-hex-char uppercase = 4.29 tỷ khả năng)
    const bookingCode = `DANA-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const payload = {
      booking_code: bookingCode,
      tour_slug: bookingData.tour_slug,
      tour_title: bookingData.tour_title,
      customer_name: bookingData.customer_name,
      customer_phone: bookingData.customer_phone,
      pickup_note: bookingData.pickup_note || "",
      departure_date: bookingData.departure_date,
      adults: parseInt(bookingData.adults, 10) || 1,
      children: parseInt(bookingData.children, 10) || 0,
      total_price: parseFloat(bookingData.total_price) || 0,
      status: "pending",
      customer_id: customerId || null,
    };

    // 1. Ghi Knex PostgreSQL nếu có (bỏ qua khi chạy test runner offline)
    if (db && process.env.NODE_ENV !== "test") {
      try {
        const [created] = await db("tour_bookings").insert(payload).returning("*");
        if (created) {
          return { bookingCode, booking: created };
        }
      } catch (err) {
        console.warn("[BookingService] Lỗi Knex, chuyển sang fallback:", err.message);
      }
    }

    // 2. Ghi qua Supabase client (bỏ qua khi chạy test runner offline)
    if (supabase && process.env.NODE_ENV !== "test") {
      try {
        const { data, error } = await supabase.from("tour_bookings").insert([payload]).select();
        if (!error && data && data.length > 0) {
          return { bookingCode, booking: data[0] };
        }
      } catch (err) {
        console.warn("[BookingService] Lỗi Supabase:", err.message);
      }
    }

    // 3. Fallback in-memory
    const mockRecord = {
      id: "mock-booking-" + Date.now(),
      ...payload,
      created_at: new Date().toISOString(),
    };
    this.mockBookings.set(bookingCode, mockRecord);
    return { bookingCode, booking: mockRecord };
  }

  // 2. Tra cứu đơn theo mã booking (Bảo vệ chống IDOR & rò rỉ PII)
  async getBookingByCode(bookingCode, { customerPhone = "", currentUser = null } = {}) {
    if (!bookingCode) return null;

    let record = null;

    // 1. Tìm trong Knex
    if (db && process.env.NODE_ENV !== "test") {
      try {
        record = await db("tour_bookings").where("booking_code", bookingCode).first();
      } catch (err) {
        console.warn("[BookingService] Lỗi Knex getBookingByCode:", err.message);
      }
    }

    // 2. Tìm trong Supabase
    if (!record && supabase && process.env.NODE_ENV !== "test") {
      try {
        const { data, error } = await supabase
          .from("tour_bookings")
          .select("*")
          .eq("booking_code", bookingCode)
          .single();
        if (!error && data) record = data;
      } catch {
        // Fallback tiếp
      }
    }

    // 3. Tìm trong in-memory
    if (!record && this.mockBookings.has(bookingCode)) {
      record = this.mockBookings.get(bookingCode);
    }

    if (!record) return null;

    // KIỂM TRA PHÂN QUYỀN & CHỐNG IDOR:
    // a. Quyền Quản trị viên (admin/super_admin): xem toàn bộ thông tin
    const isAdmin = currentUser && ["super_admin", "admin"].includes(currentUser.role);
    if (isAdmin) {
      return record;
    }

    // b. Khách hàng chính chủ đã đăng nhập
    const isOwner = currentUser && record.customer_id && currentUser.id === record.customer_id;
    if (isOwner) {
      return record;
    }

    // c. Khách vãng lai công khai: BẮT BUỘC số điện thoại xác minh phải trùng khớp
    const normalizedInputPhone = String(customerPhone).trim().replace(/\D/g, "");
    const normalizedRecordPhone = String(record.customer_phone).trim().replace(/\D/g, "");

    if (!normalizedInputPhone || normalizedInputPhone !== normalizedRecordPhone) {
      return null; // Không trùng SĐT -> từ chối cấp thông tin (Chống quét cạn PII)
    }

    // Làm mờ thông tin cá nhân nhạy cảm khi trả về công khai
    const maskedPhone = record.customer_phone
      ? record.customer_phone.slice(0, 3) + "****" + record.customer_phone.slice(-3)
      : "";

    return {
      booking_code: record.booking_code,
      tour_slug: record.tour_slug,
      tour_title: record.tour_title,
      customer_name: record.customer_name,
      customer_phone: maskedPhone,
      departure_date: record.departure_date,
      adults: record.adults,
      children: record.children,
      total_price: record.total_price,
      status: record.status,
      created_at: record.created_at,
    };
  }

  // 3. Tạo yêu cầu tư vấn nhanh (TripPlannerSection / HeroSection)
  async createTripInquiry(inquiryData) {
    const payload = {
      destination: inquiryData.destination || "Panduranga",
      departure_date: inquiryData.departure_date || new Date().toISOString().slice(0, 10),
      experience_type: inquiryData.experience_type || "",
      travelers: String(inquiryData.travelers || "1"),
      customer_phone: String(inquiryData.customer_phone || "").trim(),
      status: "new",
    };

    if (db && process.env.NODE_ENV !== "test") {
      try {
        const [created] = await db("trip_inquiries").insert(payload).returning("*");
        if (created) return created;
      } catch (err) {
        console.warn("[BookingService] Lỗi Knex createTripInquiry:", err.message);
      }
    }

    if (supabase && process.env.NODE_ENV !== "test") {
      try {
        const { data, error } = await supabase.from("trip_inquiries").insert([payload]).select();
        if (!error && data && data.length > 0) return data[0];
      } catch (err) {
        console.warn("[BookingService] Lỗi Supabase createTripInquiry:", err.message);
      }
    }

    const mockInquiry = {
      id: "mock-inquiry-" + Date.now(),
      ...payload,
      created_at: new Date().toISOString(),
    };
    this.mockInquiries.push(mockInquiry);
    return mockInquiry;
  }
}

module.exports = new BookingService();
