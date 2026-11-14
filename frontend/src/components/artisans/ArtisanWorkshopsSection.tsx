import type { Artisan } from "../../types/heritage";
import type { WorkshopItem } from "./types";

const WORKSHOP_ITEMS: WorkshopItem[] = [
  {
    id: "bau-truc-pottery",
    artisanId: 1,
    villageBadge: "Làng Bàu Trúc",
    badgeClass: "bg-primary/10 text-primary",
    title: "Trải nghiệm Vuốt Gốm Không Bàn Xoay",
    description:
      "Học kỹ thuật đi giật lùi, tự tay nhào nặn khối đất sông Quao và được nghệ nhân Bàu Trúc nung củi tặng lại tác phẩm mang về.",
    duration: "2.5 giờ",
    experienceType: "Lớp học vuốt gốm không bàn xoay Bàu Trúc",
    actionClass: "text-primary hover:underline",
  },
  {
    id: "my-nghiep-weaving",
    artisanId: 2,
    villageBadge: "Làng Mỹ Nghiệp",
    badgeClass: "bg-secondary/10 text-secondary",
    title: "Thử Tài Luồn Con Thoi Khung Dệt Cổ",
    description:
      "Tìm hiểu bí quyết nhuộm màu thảo mộc tự nhiên từ củ nâu, ngồi vào khung dệt học cách dệt những đường hoa văn Katê đầu tiên.",
    duration: "2 giờ",
    experienceType: "Lớp học luồn thoi dệt thổ cẩm Mỹ Nghiệp",
    actionClass: "text-secondary hover:underline",
  },
  {
    id: "huu-duc-instruments",
    artisanId: 3,
    villageBadge: "Làng Hữu Đức",
    badgeClass: "bg-amber-100 text-amber-800",
    title: "Thanh Âm Thiêng: Kèn Saranai & Trống Chăm",
    description:
      "Lắng nghe giai điệu ngũ cung huyền bí, khám phá cấu tạo dăm lá buông và học nhịp vỗ lòng bàn tay trên mặt trống Paranưng bịt da dê.",
    duration: "2 giờ",
    experienceType: "Trải nghiệm thanh âm nhạc cụ cổ truyền Hữu Đức",
    actionClass: "text-amber-800 hover:underline",
  },
];

interface ArtisanWorkshopsSectionProps {
  artisans: Artisan[];
  onSelectWorkshop: (artisan: Artisan, experienceType: string) => void;
}

export default function ArtisanWorkshopsSection({
  artisans,
  onSelectWorkshop,
}: ArtisanWorkshopsSectionProps) {
  const handleWorkshopClick = (item: WorkshopItem) => {
    const targetArtisan =
      artisans.find((a) => a.id === item.artisanId) || artisans[0];
    if (targetArtisan) {
      onSelectWorkshop(targetArtisan, item.experienceType);
    }
  };

  return (
    <section className="py-space-xl bg-surface-container-low border-t border-b border-surface-container-high/60">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
        <div className="text-center max-w-2xl mx-auto mb-space-lg">
          <span className="font-label-md text-xs font-bold text-secondary uppercase tracking-widest block mb-1">
            Tiếp Nối Hồn Xưa
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
            Lớp Học Nghề & Trải Nghiệm Thực Tế Tại Làng
          </h2>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
            Đăng ký một buổi sáng ngồi bệt cùng các Muk, tự tay nắn chiếc bình đất sông Quao
            hay luồn sợi con thoi để cảm nhận nhịp đập sống động của văn hóa bản địa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {WORKSHOP_ITEMS.map((item) => (
            <div
              key={item.id}
              className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-block mb-2 ${item.badgeClass}`}
                >
                  {item.villageBadge}
                </span>
                <h3 className="font-serif text-base font-bold text-on-surface mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-medium">
                  Thời lượng: {item.duration}
                </span>
                <button
                  onClick={() => handleWorkshopClick(item)}
                  className={`font-bold transition-all ${item.actionClass}`}
                  type="button"
                >
                  Đăng ký →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
