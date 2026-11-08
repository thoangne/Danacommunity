const fs = require("fs");
const path = require("path");
const supabase = require("../config/supabaseClient");

class StorageService {
  constructor() {
    this.uploadsDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }

    this.isSupabaseConfigured =
      Boolean(process.env.SUPABASE_URL) &&
      !process.env.SUPABASE_URL.includes("placeholder-project") &&
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY) &&
      !String(process.env.SUPABASE_ANON_KEY).includes("placeholder");

    this.bucketName = process.env.SUPABASE_STORAGE_BUCKET || "media";
  }

  /**
   * Lưu tệp tin đa phương tiện
   * Tự động ưu tiên Supabase Storage Bucket khi có cấu hình; nếu không có sẽ fallback vào local disk /uploads
   *
   * @param {object} file - Đối tượng file do Multer phân tích
   * @returns {Promise<{ url: string, filename: string, size: number, mimeType: string, originalName: string }>}
   */
  async saveFile(file) {
    if (!file) {
      throw new Error("Không có tệp nào được cung cấp!");
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 50);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e4)}`;
    const filename = file.filename || `${cleanBase}-${uniqueSuffix}${ext}`;

    // 1. Thử tải lên Supabase Storage nếu đã cấu hình
    if (this.isSupabaseConfigured && supabase) {
      try {
        const fileBuffer = file.buffer || (file.path ? fs.readFileSync(file.path) : null);
        if (fileBuffer) {
          const filePathInBucket = `uploads/${filename}`;
          const { error: uploadError } = await supabase.storage
            .from(this.bucketName)
            .upload(filePathInBucket, fileBuffer, {
              contentType: file.mimetype,
              upsert: true,
            });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from(this.bucketName)
              .getPublicUrl(filePathInBucket);

            // Xóa file tạm trên disk nếu multer lưu tạm vào disk
            if (file.path && fs.existsSync(file.path)) {
              try {
                fs.unlinkSync(file.path);
              } catch (_) {}
            }

            return {
              filename,
              originalName: file.originalname,
              mimeType: file.mimetype,
              size: file.size,
              url: publicUrlData.publicUrl,
            };
          }
        }
      } catch (err) {
        console.warn("⚠️ [StorageService] Không thể upload lên Supabase Storage, dùng lưu trữ cục bộ:", err.message);
      }
    }

    // 2. Fallback: Lưu vào thư mục cục bộ backend/uploads
    let finalPath = file.path;
    if (!finalPath && file.buffer) {
      finalPath = path.join(this.uploadsDir, filename);
      fs.writeFileSync(finalPath, file.buffer);
    }

    return {
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${filename}`,
    };
  }

  /**
   * Xóa tệp tin vật lý hoặc trên đám mây
   *
   * @param {string} fileUrl
   */
  async deleteFile(fileUrl) {
    if (!fileUrl) return;

    // 1. Xóa trên đĩa cục bộ nếu là đường dẫn nội bộ /uploads/...
    if (fileUrl.startsWith("/uploads/")) {
      const filename = path.basename(fileUrl);
      const filePath = path.join(this.uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.warn("⚠️ [StorageService] Lỗi khi xóa file vật lý:", err.message);
        }
      }
      return;
    }

    // 2. Xóa trên Supabase Storage nếu là URL đám mây
    if (this.isSupabaseConfigured && supabase && fileUrl.includes(this.bucketName)) {
      try {
        const parts = fileUrl.split(`${this.bucketName}/`);
        if (parts.length > 1) {
          const pathInBucket = decodeURIComponent(parts[1].split("?")[0]);
          await supabase.storage.from(this.bucketName).remove([pathInBucket]);
        }
      } catch (err) {
        console.warn("⚠️ [StorageService] Lỗi khi xóa file trên Supabase Storage:", err.message);
      }
    }
  }
}

module.exports = new StorageService();
