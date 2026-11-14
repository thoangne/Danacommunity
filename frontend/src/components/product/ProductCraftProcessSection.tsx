export default function ProductCraftProcessSection() {
  const steps = [
    {
      step: "01",
      title: "Khai thác đất & sợi thảo mộc",
      description:
        "Đất sét phù sa mịn khai thác từ lòng sông Quao chỉ có ở mùa khô; bông vải kéo sợi và ngâm nhuộm trong nước lá cây rừng tự nhiên.",
    },
    {
      step: "02",
      title: "Xoay chân giật lùi & dệt khung",
      description:
        "Không dùng bàn xoay, nghệ nhân dùng chính cơ thể đi giật lùi miết tạo dáng gốm; ngồi bệt xuống sàn điều khiển nhịp con thoi chuẩn từng mắt sợi.",
    },
    {
      step: "03",
      title: "Nung củi lộ thiên 800°C",
      description:
        "Không dùng lò kín, gốm được chất đống ngoài trời phủ củi và rơm rạ, đốt bằng lửa trần để đón ngọn gió đồi cát hun đúc độ bền rắn chắc.",
    },
    {
      step: "04",
      title: "Nước trâm bầu & ngấn khói thiêng",
      description:
        "Lúc gốm còn đỏ rực, nghệ nhân vẩy nước vỏ hạt điều hoặc lá trâm bầu; vệt khói đen loang tự nhiên biến mỗi sản phẩm thành một kiệt tác độc nhất vô nhị.",
    },
  ];

  return (
    <section className="py-space-xl bg-surface-container-low border-t border-b border-surface-container-high/60">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin">
        <div className="text-center max-w-2xl mx-auto mb-space-lg">
          <span className="font-label-md text-xs font-bold text-secondary uppercase tracking-widest block mb-1">
            Kỹ Thuật Cổ Xưa Ngàn Năm
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
            Quy Trình Chế Tác Độc Bản Panduranga
          </h2>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
            Tại Bàu Trúc hay Mỹ Nghiệp, người nghệ nhân gìn giữ những kỹ nghệ
            chưa từng biến đổi qua hàng chục thế kỷ: từ bước chân giật lùi đến ngấn khói vỏ trấu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {steps.map((item) => (
            <div
              key={item.step}
              className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs relative"
            >
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center mb-3">
                {item.step}
              </span>
              <h3 className="font-serif text-base font-bold text-on-surface mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
