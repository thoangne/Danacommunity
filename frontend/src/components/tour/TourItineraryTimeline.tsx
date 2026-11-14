export interface ItineraryItem {
  time: string;
  title: string;
  desc: string;
}

const DEFAULT_ITINERARY: ItineraryItem[] = [
  {
    time: "07:30",
    title: "Đón khách tại khách sạn TP. Phan Rang - Tháp Chàm",
    desc: "Xe du lịch máy lạnh đưa đón tận nơi, gặp gỡ hướng dẫn viên bản địa Chăm.",
  },
  {
    time: "08:00",
    title: "Tháp Po Klong Garai - Giải mã Văn bia & Kiến trúc Tháp Cổ",
    desc: "Đón ánh bình minh trên Đồi Trầu, giải mã văn bia cổ Sanskrit và nghe hòa tấu kèn Saranai.",
  },
  {
    time: "10:00",
    title: "Làng Gốm Bàu Trúc - Kỹ nghệ nắn gốm không bàn xoay",
    desc: "Trò chuyện cùng Muk Đàng Thị Phan, trải nghiệm đi giật lùi nặn đất sông Quao và nung củi.",
  },
  {
    time: "12:00",
    title: "Bữa trưa Ẩm thực Chăm Bản Địa",
    desc: "Thưởng thức canh bồi Um Bơk, bánh tét Katê và nước thảo mộc truyền thống dưới giàn cây mát rượi.",
  },
  {
    time: "14:00",
    title: "Làng Dệt Thổ Cẩm Mỹ Nghiệp - Luồn con thoi cổ hoàng cung",
    desc: "Ngồi vào khung dệt cổ cùng nghệ nhân Phú Thị Mỡ, học phân biệt hoa văn chim công Katê.",
  },
  {
    time: "16:30",
    title: "Đồi Cát Nam Cương & Trở về khách sạn",
    desc: "Ngắm hoàng hôn trên đồi cát chuyển mình theo gió trước khi xe đưa quý khách về lại điểm hẹn.",
  },
];

interface TourItineraryTimelineProps {
  items?: ItineraryItem[];
}

export default function TourItineraryTimeline({
  items = DEFAULT_ITINERARY,
}: TourItineraryTimelineProps) {
  return (
    <div className="space-y-2.5 text-xs">
      {items.map((step) => (
        <div
          key={step.time}
          className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3"
        >
          <span className="px-2 py-1 rounded bg-primary text-white font-mono font-bold text-[11px] shrink-0">
            {step.time}
          </span>
          <div>
            <span className="font-bold text-on-surface block">
              {step.title}
            </span>
            <span className="text-[11px] text-on-surface-variant">
              {step.desc}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
