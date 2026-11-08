process.env.NODE_ENV = "test";
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const newsletterService = require("../src/services/newsletterService");
const bookingService = require("../src/services/bookingService");

describe("Newsletter & Booking Security and Logic Test Suite", () => {
  // 1. Newsletter Tests
  it("newsletterService.subscribe should reject invalid email format", async () => {
    await assert.rejects(
      async () => {
        await newsletterService.subscribe("invalid-email-string");
      },
      { message: "Định dạng địa chỉ email không hợp lệ." }
    );
  });

  it("newsletterService.subscribe should normalize and accept valid email", async () => {
    const res = await newsletterService.subscribe("Test.User@ChampaWeb.VN ");
    assert.ok(res);
    assert.strictEqual(res.email, "test.user@champaweb.vn");
    assert.strictEqual(res.is_active, true);
  });

  // 2. Booking Generation Tests
  it("bookingService.createTourBooking should generate a secure cryptographically random code", async () => {
    const payload = {
      tour_slug: "tour-thap-po-klong-garai",
      tour_title: "Bình Minh Trên Đỉnh Kalan Po Klong Garai",
      customer_name: "Nguyễn Văn Chăm",
      customer_phone: "0918388998",
      departure_date: "2026-12-01",
      adults: 2,
      children: 1,
      total_price: 1750000,
    };

    const { bookingCode, booking } = await bookingService.createTourBooking(payload, "usr-cust-001");
    assert.ok(bookingCode);
    assert.match(bookingCode, /^DANA-[A-F0-9]{8}$/);
    assert.strictEqual(booking.customer_name, "Nguyễn Văn Chăm");
    assert.strictEqual(booking.customer_id, "usr-cust-001");
    assert.strictEqual(booking.total_price, 1750000);
  });

  // 3. IDOR & PII Leak Mitigation Tests
  it("bookingService.getBookingByCode should REJECT public access when phone number is missing (Anti-IDOR)", async () => {
    const { bookingCode } = await bookingService.createTourBooking({
      tour_slug: "tour-bau-truc",
      tour_title: "Lửa Lò Gốm Bàu Trúc",
      customer_name: "Trần Thị Trúc",
      customer_phone: "0905123456",
      departure_date: "2026-11-20",
      adults: 1,
      children: 0,
      total_price: 650000,
    });

    // Public lookup without phone number
    const result = await bookingService.getBookingByCode(bookingCode);
    assert.strictEqual(result, null, "Must not return booking data to public request without matching phone");
  });

  it("bookingService.getBookingByCode should REJECT public access when phone number does NOT match", async () => {
    const { bookingCode } = await bookingService.createTourBooking({
      tour_slug: "tour-bau-truc",
      tour_title: "Lửa Lò Gốm Bàu Trúc",
      customer_name: "Trần Thị Trúc",
      customer_phone: "0905123456",
      departure_date: "2026-11-20",
      adults: 1,
      children: 0,
      total_price: 650000,
    });

    // Public lookup with WRONG phone number
    const result = await bookingService.getBookingByCode(bookingCode, { customerPhone: "0988777666" });
    assert.strictEqual(result, null, "Must reject request when phone does not match");
  });

  it("bookingService.getBookingByCode should return sanitized PII when valid phone is provided", async () => {
    const { bookingCode } = await bookingService.createTourBooking({
      tour_slug: "tour-bau-truc",
      tour_title: "Lửa Lò Gốm Bàu Trúc",
      customer_name: "Trần Thị Trúc",
      customer_phone: "0905123456",
      departure_date: "2026-11-20",
      adults: 1,
      children: 0,
      total_price: 650000,
    });

    // Public lookup with CORRECT phone number
    const result = await bookingService.getBookingByCode(bookingCode, { customerPhone: "0905123456" });
    assert.ok(result, "Should return booking for verified phone");
    assert.strictEqual(result.booking_code, bookingCode);
    // Verify phone is masked
    assert.strictEqual(result.customer_phone, "090****456");
  });

  it("bookingService.getBookingByCode should grant full access to admin without phone challenge", async () => {
    const { bookingCode } = await bookingService.createTourBooking({
      tour_slug: "tour-bau-truc",
      tour_title: "Lửa Lò Gốm Bàu Trúc",
      customer_name: "Trần Thị Trúc",
      customer_phone: "0905123456",
      departure_date: "2026-11-20",
      adults: 1,
      children: 0,
      total_price: 650000,
    });

    const adminUser = { id: "usr-admin-001", role: "admin", email: "admin@champaweb.vn" };
    const result = await bookingService.getBookingByCode(bookingCode, { currentUser: adminUser });
    assert.ok(result);
    assert.strictEqual(result.customer_phone, "0905123456", "Admin should see full unmasked phone");
  });

  // 4. Trip Inquiry Tests
  it("bookingService.createTripInquiry should record valid inquiries", async () => {
    const inquiry = await bookingService.createTripInquiry({
      destination: "Tháp Po Klong Garai & Gốm Bàu Trúc",
      departure_date: "2026-12-15",
      travelers: "4 người",
      customer_phone: "0918388998",
    });

    assert.ok(inquiry);
    assert.strictEqual(inquiry.customer_phone, "0918388998");
    assert.strictEqual(inquiry.status, "new");
  });
});
