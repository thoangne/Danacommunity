export interface TourGuideStation {
  id: string;
  order: number;
  title: string;
  ancientName: string;
  district: string;
  tagline: string;
  summary: string;
  paragraphs: string[];
  coords: [number, number];
  openHours: string;
  distance: string;
  rules: string;
  image: string;
  badge: string;
  badgeClass: string;
  highlights: string[];
  googleMapsUrl?: string;
}

export const BAOH_DANA_TOUR_STATIONS: TourGuideStation[] = [
  {
    id: "po-klaong-garay",
    order: 1,
    title: "Đền tháp Po Klaong Garay",
    ancientName: "Kalan Po Klaong Garay",
    district: "Phường Đô Vinh, TP. Phan Rang - Tháp Chàm, Tỉnh Ninh Thuận",
    tagline: "Đỉnh cao nghệ thuật kiến trúc gạch nung Champa thế kỷ XIII - XIV",
    summary:
      "Quần thể đền tháp Champa tiêu biểu và đẹp nhất còn tồn tại ở Việt Nam, ngự trên đỉnh Đồi Trầu lộng gió, biểu tượng trường tồn của vị vua trị thủy vĩ đại.",
    paragraphs: [
      "Đền tháp Po Klaong Garay là một trong những công trình kiến trúc Champa tiêu biểu và đẹp nhất còn tồn tại ở Việt Nam. Di tích nằm trên đồi Trầu thuộc phường Đô Vinh, tỉnh Ninh Thuận (trung tâm xứ Panduranga xưa). Đây không chỉ là một địa điểm du lịch nổi tiếng mà còn là biểu tượng văn hóa, lịch sử thiêng liêng của đồng bào Chăm ở khu vực Nam Trung Bộ.",
      "Tháp được xây dựng vào cuối thế kỷ XIII, đầu thế kỷ XIV dưới thời vua Chăm Jaya Simhavarman III (Chế Mân) để thờ vua Po Klaong Garay. Theo truyền thuyết dân gian, Po Klaong Garay là một vị vua anh minh, có nhiều công lao to lớn trong việc phát triển sản xuất nông nghiệp, xây dựng hệ thống thủy lợi kỳ vĩ và chăm lo đời sống nhân dân. Sau khi qua đời, ông được người dân tôn kính như một vị thần bảo hộ xứ sở.",
      "Quần thể đền tháp Po Klaong Garay gồm ba công trình chính: tháp Chính (Kalan), tháp Cổng (Gopura) và tháp Lửa (Kosagrha). Trong đó, tháp Chính cao hơn 20 mét, là nơi đặt tượng Mukhalinga và thờ vua Po Klaong Garay. Các công trình đều được xây dựng bằng gạch nung đỏ với kỹ thuật ghép gạch kỳ tài không lộ vữa mà đến nay vẫn còn là điều bí ẩn. Những hoa văn, phù điêu thần Shiva, ngọn lửa uốn lượn được chạm khắc tinh xảo trực tiếp trên thân tháp thể hiện trình độ nghệ thuật và kỹ thuật xây dựng bậc thầy của người Chăm cổ.",
      "Không chỉ có giá trị về mặt kiến trúc, đền tháp Po Klaong Garay còn mang ý nghĩa to lớn về văn hóa và tín ngưỡng. Hằng năm, nơi đây diễn ra nhiều hoạt động lễ hội truyền thống của đồng bào Chăm, nổi bật nhất là Đại lễ hội Katê vào tháng 7 Chăm lịch. Vào dịp này, người dân trang trọng tổ chức các nghi thức mở cửa tháp, tắm tượng thần, cầu mong mưa thuận gió hòa, mùa màng bội thu và cuộc sống ấm no, hạnh phúc.",
      "Ngày nay, đền tháp Po Klaong Garay đã được xếp hạng Di tích quốc gia đặc biệt, thu hút đông đảo du khách trong và ngoài nước đến tham quan, khảo cứu. Công trình là niềm tự hào của đồng bào Chăm nói riêng và của kho tàng di sản văn hóa Việt Nam nói chung."
    ],
    coords: [11.6033, 108.9482],
    openHours: "07:00 - 17:30 hằng ngày",
    distance: "Cách trung tâm Phan Rang 7 km",
    rules: "Trang phục kín đáo lịch sự khi lên tháp, cởi nón bảo hiểm và giày dép khi bước vào trong Kalan chính.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWzz5wVWN2Rre_bf3lzTZ89szZW61A19gyuIM1D6eHB2bgjSvLJ2IjqYRR2_FvWNOaiuYH_mZKTaaCYHyrAo6Y-MHZRm5QMjTQqVYlWO-UTZpP7j-38TvaXGvTC0E43MbjaK6OcYizspkYPA97vZ7ux2qQedU074FLdyFMB7zxmwJM_GGaJUJxVOmC--t3UtTdUYuMj2PhxbPFLX9SyKZLF-p5BPhi_fHZpOUSInajqnNWFka72rYwew",
    badge: "Trạm 01 • Di Tích Quốc Gia Đặc Biệt",
    badgeClass: "bg-primary text-white shadow-xs",
    highlights: [
      "Di tích Quốc gia đặc biệt với 3 tòa tháp gạch nung nguyên vẹn",
      "Kỹ thuật mài chập gắn kết gạch không lộ mạch vữa",
      "Trung tâm thực hành đại lễ Katê lớn nhất trong năm"
    ]
  },
  {
    id: "dap-nha-trinh",
    order: 2,
    title: "Đập thuỷ lợi Nha Trinh",
    ancientName: "Banưng Chaklin Nha Trinh",
    district: "Sông Dinh, Xã Nhơn Sơn & Phường Đô Vinh, Tỉnh Ninh Thuận",
    tagline: "Kỳ tích trị thủy ngàn năm - Cội nguồn mạch sống đồng bằng Panduranga",
    summary:
      "Công trình thủy lợi cổ kính do vua Po Klaong Garay tổ chức thi công, biến vùng đất khô hạn bậc nhất thành vựa lúa, vườn nho trù phú đôi bờ sông Dinh.",
    paragraphs: [
      "Vùng đất duyên hải Ninh Thuận nổi tiếng với khí hậu khô nóng quanh năm, vì vậy các công trình thủy lợi có vai trò sống còn đối với đời sống và sản xuất của nhân dân. Trong số đó, đập Nha Trinh là một công trình thủy lợi cổ kính tiêu biểu, khởi nguồn nguồn nước quý báu tưới mát cho toàn bộ đồng bằng Phan Rang và các làng Chăm ven sông.",
      "Đập Nha Trinh nằm trên dòng sông Dinh (sông Cái Phan Rang), thuộc địa phận giáp ranh xã Nhơn Sơn và phường Đô Vinh. Được khởi dựng từ thế kỷ XIII - XIV nhằm mục đích điều tiết dòng chảy, tích trữ nước và mở hệ thống kênh mương xương cá dẫn vào ruộng đồng, đập giúp giảm thiểu thiên tai hạn hán khốc liệt và biến vùng đất cằn cỗi thành đồng ruộng xanh tươi quanh năm.",
      "Với kết cấu đá tảng kiên cố cùng hệ thống phân thủy thông minh (kênh Chăm, kênh Nam, kênh Bắc), đập Nha Trinh đã mang lại dòng nước tưới tiêu cho hàng chục nghìn héc-ta đất nông nghiệp. Nhờ đó, người dân các palei Chăm và bà con người Kinh phát triển rực rỡ nghề trồng lúa nước, nho, táo và hoa màu, đưa đời sống kinh tế ngày càng no ấm.",
      "Không chỉ có giá trị lớn về kinh tế, đập Nha Trinh còn tạo nên một cảnh quan thiên nhiên tráng lệ bên chân núi. Mặt nước hồ phẳng lặng phản chiếu rặng cây rợp mát cùng bóng tháp xa xa, là điểm dừng chân yên bình giúp du khách cảm nhận sự tài hoa của tổ tiên người Chăm trong việc thích ứng và làm chủ thiên nhiên.",
      "Hằng năm, bà con trong vùng vẫn tổ chức nghi lễ cúng Thần Thủy Lợi (Mbang Katé, Yơ Yang Banưng) ngay tại đầu nguồn đập Nha Trinh để tạ ơn công đức tiền nhân đã để lại dòng nước mát lành cho muôn đời con cháu."
    ],
    coords: [11.612, 108.931],
    openHours: "Tham quan tự do ban ngày",
    distance: "Cách Tháp Po Klaong Garay 3 km về phía Tây",
    rules: "Giữ gìn vệ sinh nguồn nước, không leo trèo qua bờ kè đập trong mùa lũ dâng.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUfYzm1NZ4arEZYOjXP-ADVRrL2xvxRYpA11bkxwybvUPyaLDDHcbzdna3ORWQdNhRZ691hmCL8NhJzSAjGU5gLcf6loBzxm9LlDDjY-bDf5UiEUEa8dCbgRQO5NwMElBhJX6SjLnotVvZ4SesvgT8Thywsaeywlcgwf1tW1jO8xFQbtJMa3R7BXOwL3MrVqNKr5Y-maFTUq9d3YpEzE5Uvj6QVImJxg-rCyKTWSyfkqmmjoELc7hWkA",
    badge: "Trạm 02 • Di Sản Trị Thủy Cổ",
    badgeClass: "bg-sky-600 text-white shadow-xs",
    highlights: [
      "Công trình thủy lợi đá cổ hơn 700 năm tuổi trên dòng sông Dinh",
      "Hệ thống phân thủy phục vụ tưới tiêu hàng nghìn hecta ruộng lúa Champa",
      "Khung cảnh thiên nhiên sông nước thơ mộng hữu tình"
    ]
  },
  {
    id: "nui-da-trang",
    order: 3,
    title: "Núi Đá Trắng - Cek Yang Patao",
    ancientName: "Cek Yang Patao (Núi Thần Vua)",
    district: "Thôn Như Bình, Xã Phước Hữu, Huyện Ninh Phước, Tỉnh Ninh Thuận",
    tagline: "Thắng cảnh thiên nhiên hùng vĩ và không gian huyền thoại linh thiêng",
    summary:
      "Ngọn núi thiêng với những khối đá hoa cương ánh trắng kỳ ảo giữa đồng bằng Ninh Phước, nơi lưu giữ huyền tích Yang Patao và tầm nhìn ngắm trọn quê hương.",
    paragraphs: [
      "Vùng đất Ninh Thuận sở hữu những thắng cảnh thiên nhiên độc đáo mang vẻ đẹp vừa hoang sơ vừa hùng vĩ. Trong số đó, núi Đá Trắng (tiếng Chăm gọi là Cek Yang Patao - Núi Thần Vua) ở thôn Như Bình, xã Phước Hữu là một địa danh quen thuộc và là điểm nhấn cảnh quan nổi bật của vùng đất đầy nắng gió.",
      "Núi Đá Trắng nằm ở phía nam huyện Ninh Phước. Từ xa nhìn lại, ngọn núi nổi bật với những khối đá hoa cương khổng lồ có sắc trắng tinh khôi, phản chiếu ánh nắng rực rỡ giữa nền trời xanh biếc. Đặc điểm địa chất phong hóa hàng triệu năm đã tạo nên những tảng đá có hình dáng kỳ thú, tựa như những tác phẩm điêu khắc tự nhiên của đất trời.",
      "Vào sáng sớm hoặc hoàng hôn, khi ánh nắng buông nghiêng sườn núi, cảnh sắc Đá Trắng trở nên lung linh và thanh bình lạ thường. Đứng từ các triền đá trên cao, du khách có thể phóng tầm mắt ngắm trọn toàn cảnh cánh đồng lúa xanh mướt của xã Phước Hữu, Phước Hậu cùng dãy Trường Sơn xa mờ bao bọc.",
      "Không chỉ có giá trị cảnh quan du lịch sinh thái, núi Đá Trắng còn gắn bó mật thiết với ký ức tuổi thơ và đời sống tâm linh của người dân thôn Như Bình. Nơi đây lưu giữ nhiều câu chuyện dân gian kỳ bí về các vị thần bảo hộ núi rừng, nhắc nhở con người luôn kính trọng và che chở thiên nhiên.",
      "Đây là điểm đến tuyệt vời cho những lữ khách yêu thích trekking nhẹ nhàng, cắm trại ngắm hoàng hôn và hòa mình vào bầu không khí trong lành, mộc mạc của làng quê Champa."
    ],
    coords: [11.512, 108.889],
    openHours: "Thích hợp tham quan 06:00 - 18:00",
    distance: "Cách Palei Baoh Dana khoảng 4.5 km",
    rules: "Giữ gìn vệ sinh môi trường, không xả rác và không vẽ bậy lên các vách đá tự nhiên.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXnVPS6oUU6URxfP4TdxHq-UsUwE04_gnpvwkrptd7BS9dXmx1ChJ7WMISmS784kI32f0t8UQRf6k-MDPPx_XQJ664Ju5dHKtYkiO-EGDM0AHxY3pwwfDkogXvFWI_HnsiYVujgmtrvXQitBbSLyAF2U3jmzcl-P6-1W9bb78_xcGU8fN1JZ7J8spZY0Xv9IkZsFQ2keAyI_isVwMyrwg1DzRYwMwraJ8pgS3d9giKmqo58fEtRvN1RA",
    badge: "Trạm 03 • Thắng Cảnh Huyền Tích",
    badgeClass: "bg-emerald-600 text-white shadow-xs",
    highlights: [
      "Khối địa chất đá hoa cương trắng tự nhiên nổi bật giữa cánh đồng",
      "Điểm ngắm hoàng hôn và toàn cảnh thung lũng Ninh Phước đẹp nhất",
      "Gắn liền với truyền thuyết Cek Yang Patao của người Chăm"
    ]
  },
  {
    id: "po-rame",
    order: 4,
    title: "Đền tháp Po Ramê",
    ancientName: "Kalan Po Ramê",
    district: "Làng Hậu Sanh, Xã Phước Hữu, Huyện Ninh Phước, Tỉnh Ninh Thuận",
    tagline: "Vương triều Champa thế kỷ XVII và trung tâm tín ngưỡng cổ truyền",
    summary:
      "Ngôi tháp trầm mặc trên ngọn đồi đá cô tịch, nơi thờ vị vua cuối cùng được phong thánh, bảo tồn nguyên vẹn các nghi thức tế lễ Katê cổ kính.",
    paragraphs: [
      "Đền tháp Po Ramê tọa lạc trên một ngọn đồi đá biệt lập thuộc làng Hậu Sanh, xã Phước Hữu, huyện Ninh Phước, tỉnh Ninh Thuận. Công trình được xây dựng vào khoảng giữa thế kỷ XVII để thờ vua Po Ramê – vị vua có nhiều đóng góp to lớn cho sự phồn vinh và hòa hợp của vương quốc Champa trước thời kỳ cận đại.",
      "Theo sử thi và truyền thuyết Chăm, Po Ramê là vị minh quân tài ba, có công lớn trong việc khai hoang lập ấp, đắp đập dẫn thủy nhập điền và đoàn kết các cộng đồng dân tộc anh em. Sau khi qua đời, ông được tôn xưng như một vị thánh bảo hộ tối linh của người Chăm Bàlamôn.",
      "Tháp Po Ramê là một trong những kiệt tác cuối cùng của phong cách kiến trúc đền tháp Champa. Dù quy mô không đồ sộ như Po Klaong Garay, tháp Po Ramê mang vẻ uy nghiêm, thâm trầm hiếm có. Bên trong tháp còn lưu giữ bức tượng vua Po Ramê tạc bằng sa thạch dạng Mukhalinga bán thân với phù điêu chim thần Garuda và các hoàng hậu (Bia Than Cih và Bia Than Can).",
      "Nơi đây là trung tâm tín ngưỡng quan trọng diễn ra đại lễ Katê hằng năm của cộng đồng Chăm Hậu Sanh. Những thanh âm trầm hùng của kèn Saranai, trống Paranưng và trống Ginăng hòa quyện cùng khói trầm hương ngào ngạt tạo nên không gian tâm linh linh thiêng bất tận.",
      "Đứng trên đồi Po Ramê, du khách được tận hưởng ngọn gió mát lành của bình nguyên Panduranga và cảm nhận sâu sắc nhịp đập lịch sử qua từng thớ gạch nung hàng trăm năm tuổi."
    ],
    coords: [11.5178, 108.9205],
    openHours: "07:30 - 17:00 hằng ngày",
    distance: "Cách Phan Rang 15 km về phía Tây Nam",
    rules: "Giữ trật tự tôn nghiêm, cởi nón và đi chân đất khi vào bên trong vòm thờ Kalan.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzljZH7__gmKglHYhA2NZtHh2wp1_j6eufhB24fW5dLEg6Q3iVPhcklfXTyfQfftG0s3kkeFa45XwJi0fI0t965d-lV9hy3Bp86bWdiRgQjJMFwqoPZzvC1Puek_bg_vu8Hy90bDTysgtbAXLReE5kLRMopjTkjh5Fgl-uWE2PDhyzuKEA3B_xFsrORw9XqbKdNdrSvBBD0BLP1ezotbfBBmrZCZNeWb86lbUY2kjNCncvJkPSIpv7pA",
    badge: "Trạm 04 • Tháp Thiêng Vương Triều",
    badgeClass: "bg-amber-600 text-white shadow-xs",
    highlights: [
      "Ngôi tháp độc đáo thế kỷ XVII thờ vị vua cuối cùng được phong thánh",
      "Bảo tồn tượng Mukhalinga Po Ramê nguyên bản tuyệt mỹ",
      "Vị trí đồi đá phóng tầm mắt ngắm trọn rặng núi mờ xa"
    ]
  },
  {
    id: "tho-cam-my-nghiep",
    order: 5,
    title: "Nghề dệt thổ cẩm Chăm làng Mỹ Nghiệp",
    ancientName: "Paley Caklaing",
    district: "Thị trấn Phước Dân, Huyện Ninh Phước, Tỉnh Ninh Thuận",
    tagline: "Tinh hoa luồn sợi Katê cổ truyền truyền dạy từ Mẹ Xứ Sở Po Ina Nagar",
    summary:
      "Làng dệt cổ xưa bậc nhất nơi phụ nữ Chăm giữ lửa nghề bằng khung cửi mộc, phẩm màu thảo mộc thiên nhiên và đồ hình hoa văn mang đậm triết lý vũ trụ.",
    paragraphs: [
      "Làng dệt thổ cẩm Mỹ Nghiệp (tiếng Chăm gọi là Paley Caklaing) nằm tại thị trấn Phước Dân, huyện Ninh Phước, tỉnh Ninh Thuận. Đây là một trong những làng nghề dệt thủ công truyền thống lâu đời nhất của người Chăm tại Việt Nam còn hoạt động bền bỉ đến ngày nay.",
      "Theo truyền ngôn dân gian, nghề dệt vải được nữ thần Po Ina Nagar (Người Mẹ Xứ Sở) truyền dạy cho bà Pong Pang rồi lan tỏa khắp làng Caklaing. Bởi vậy, mỗi khung cửi, mỗi con thoi đối với người phụ nữ Chăm đều mang ý nghĩa thiêng liêng và niềm tự hào sâu sắc của dòng tộc mẫu hệ.",
      "Để làm nên một tấm thổ cẩm tinh xảo, người nghệ nhân Mỹ Nghiệp phải trải qua nhiều công đoạn công phu: chọn bông, kéo sợi, nhuộm màu tự nhiên từ lá trâm bầu, vỏ cây rừng, củ nâu và nhọc công mắc khung luồn hoa văn. Từng sợi chỉ được dệt hoàn toàn bằng tay, đòi hỏi sự kiên nhẫn và đôi mắt tinh anh.",
      "Hoa văn thổ cẩm Mỹ Nghiệp vô cùng phong phú: từ hoa văn cổ hoàng cung, hình thần Shiva, rồng Makara, chim công, búp sen đến các họa tiết hình học kỷ hà. Mỗi tấm khăn choàng hay tấm vải không chỉ là trang phục mà còn là một tác phẩm nghệ thuật chứa đựng tâm tư, tình cảm và vũ trụ quan của người Chăm.",
      "Đến với làng Mỹ Nghiệp, du khách được trực tiếp ngồi thử bên khung dệt gỗ cổ xưa, trò chuyện cùng các nghệ nhân lão thành và chọn mua những sản phẩm thủ công tinh hoa làm quà lưu niệm đầy ý nghĩa."
    ],
    coords: [11.5167, 108.9333],
    openHours: "08:00 - 18:00 hằng ngày",
    distance: "Cách trung tâm Phan Rang 12 km",
    rules: "Tôn trọng khung dệt cổ, hỏi ý kiến trước khi chụp cận cảnh thao tác tay của nghệ nhân.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXDHM6yk37AcZTWKD2kHI9jPGZKP1I4JY5yxSnfX4BbftErgSz5JHk80zz2TUzC_obO4A9NMXDFx8yx6BPBGmoGhCEaCXQvDZl1oXbqVoWkpJ3biH8-ERIAfE760E73pitqQdKh1Cszx9wZVscKNWrs_AhSvA-Knlo8t0FpNAlnZWyKlwoQFLeUtM0rrVeqUM5MhUYT5g8PyjacjFmVVYeo1XjeHE7PUh2mJzLoBrzGxvfV-vafEjkXA",
    badge: "Trạm 05 • Làng Nghề Thổ Cẩm Cổ",
    badgeClass: "bg-purple-600 text-white shadow-xs",
    highlights: [
      "Làng nghề dệt thổ cẩm truyền thống liên tục hàng trăm năm",
      "Sử dụng kỹ thuật luồn hoa văn độc bản và thuốc nhuộm thảo mộc",
      "Trải nghiệm tự tay luồn thoi dệt vải cùng nghệ nhân bản địa"
    ]
  },
  {
    id: "gom-bau-truc",
    order: 6,
    title: "Làng nghề gốm thủ công Bàu Trúc",
    ancientName: "Paley Hamu Craok",
    district: "Thị trấn Phước Dân, Huyện Ninh Phước, Tỉnh Ninh Thuận",
    tagline: "Kỹ nghệ nặn gốm không bàn xoay độc bản - Di sản văn hóa phi vật thể UNESCO",
    summary:
      "Làng gốm cổ xưa bậc nhất Đông Nam Á với phương pháp 'tay làm chân quay, đi giật lùi' và kỹ thuật nung lộ thiên rơm củi tạo vết khói huyền thoại.",
    paragraphs: [
      "Làng gốm Bàu Trúc (Paley Hamu Craok) tọa lạc tại thị trấn Phước Dân, huyện Ninh Phước, tỉnh Ninh Thuận. Được xem là một trong những làng gốm cổ xưa nhất tại Đông Nam Á còn lưu giữ phương thức chế tác thủ công nguyên sơ nhất.",
      "Tổ nghề dạy dân làm gốm là vợ chồng ông Po Klaong Can từ hàng trăm năm trước. Điều kỳ diệu làm nên danh tiếng quốc tế của gốm Bàu Trúc là hoàn toàn KHÔNG DÙNG BÀN XOAY. Người phụ nữ Chăm lấy chính cơ thể mình làm trục quay: đôi bàn tay khéo léo nắn vuốt khối đất sét, trong khi đôi chân nhịp nhàng bước thụt lùi quanh bệ gốm.",
      "Đất sét làm gốm được lấy từ tầng sâu ven sông Quao giàu hạt mịn, phối trộn với cát sông theo tỷ lệ bí truyền của các Muk (Mẹ). Từng chiếc bình, lu nước, phù điêu Apsara hay tượng thần linh đều mang dấu ấn độc bản, không chiếc nào giống hệt chiếc nào.",
      "Đặc biệt, gốm Bàu Trúc được nung lộ thiên hoàn toàn giữa bãi đất trống bằng rơm rạ, củi gỗ mục. Khi dỡ lò nung đỏ lửa, nghệ nhân vẩy nước chiết từ vỏ cây thị (chưa chín) hoặc hạt điều để tạo nên những mảng màu khói loang lổ đỏ gạch, vàng nâu và đen ánh huyền bí.",
      "Năm 2022, Nghệ thuật làm gốm của người Chăm đã chính thức được UNESCO ghi danh vào Danh mục Di sản văn hóa phi vật thể cần bảo vệ khẩn cấp của nhân loại. Đây là niềm tự hào to lớn của đất nước và là điểm dừng chân không thể bỏ lỡ của mọi du khách."
    ],
    coords: [11.5312, 108.9567],
    openHours: "Mở cửa cả ngày (07:30 - 17:30)",
    distance: "Cách Phan Rang 10 km về phía Nam",
    rules: "Trang phục thoải mái, tháo giày dép khi bước vào sân nhà cổ nặn gốm của các Muk.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAd_yrvnJ_UmdnGzLVXjm5HJfxWX-epAuAP73cohAxtCHVP56EKuM52m07N2hY1obT1_Wmh6lUgDS8Ye5va33Sp_Ih3JQB5vwCQfB9tHTZWaggCM2XqEUXoaNx_-AKFbm6o3Qlh0IJLDyt4WaVcS1eO4R7ER_r7FvmnriVoglYc2JHMEote5IwsaQ4KO5jEbpEvgMErIntFFp0iOdJghlh9P7kXsJrT1xrzKEBAkfFj9OWLDV8DTpPJsg",
    badge: "Trạm 06 • Di Sản Nhân Loại UNESCO",
    badgeClass: "bg-primary text-white shadow-xs",
    highlights: [
      "Di sản văn hóa phi vật thể cần bảo vệ khẩn cấp của UNESCO (2022)",
      "Kỹ thuật 'tay làm chân quay' đi lùi độc nhất vô nhị trên thế giới",
      "Trực tiếp trải nghiệm tự tay nặn sản phẩm gốm mang về làm kỷ niệm"
    ]
  },
  {
    id: "po-ina-nagar",
    order: 7,
    title: "Di tích đền thờ Po Ina Nagar ở Hữu Đức",
    ancientName: "Đền thờ Mẹ Xứ Sở (Paley Hamu Tanran)",
    district: "Làng Hữu Đức, Xã Phước Hữu, Huyện Ninh Phước, Tỉnh Ninh Thuận",
    tagline: "Không gian thờ phụng Người Mẹ Xứ Sở tối thượng trong tâm thức Champa",
    summary:
      "Ngôi đền thiêng giữa làng cổ Hữu Đức, nơi gìn giữ trọn vẹn y trang Nữ thần Mẹ Xứ Sở và là trung tâm khởi phát tiếng trống hội Katê tưng bừng.",
    paragraphs: [
      "Đền thờ Po Ina Nagar tọa lạc tại làng Hữu Đức (tiếng Chăm là Paley Hamu Tanran), xã Phước Hữu, huyện Ninh Phước, tỉnh Ninh Thuận. Đây là một trong những làng Chăm cổ kính và trù phú bậc nhất vùng đất Panduranga.",
      "Đền là nơi tôn thờ Nữ thần Po Ina Nagar – Người Mẹ Xứ Sở được tôn kính như đấng sáng tạo tối cao, người che chở bờ cõi và dạy đồng bào trồng trọt lúa ngô, dệt vải, làm gốm. Công đức của Nữ thần thấm sâu vào từng nét văn hóa, đạo lý uống nước nhớ nguồn của người Chăm.",
      "Tuy không đồ sộ nguy nga như các cụm tháp gạch nung cổ, đền thờ Po Ina Nagar tại Hữu Đức toát lên vẻ thâm nghiêm, tĩnh tại và gần gũi giữa bóng cây cổ thụ làng quê. Đền là nơi lưu giữ và cất giữ y trang thiêng của Nữ thần trước khi được người Raglai rước về tháp trong mùa đại lễ.",
      "Vào dịp lễ hội Katê hằng năm, sân đền Hữu Đức trở thành không gian lễ hội rực rỡ nhất: hàng ngàn phụ nữ Chăm trong tà áo dài truyền thống Aw Kamei cầm quạt nhảy múa theo tiếng kèn Saranai và tiếng trống Ginăng giòn giã. Không khí trang trọng mà chan chứa tình làng nghĩa xóm.",
      "Du khách đến đền thờ Po Ina Nagar sẽ cảm nhận được lòng hiếu khách nồng hậu của bà con Hữu Đức cùng chiều sâu văn hóa mẫu hệ thiêng liêng được trao truyền qua muôn thế hệ."
    ],
    coords: [11.505, 108.905],
    openHours: "07:30 - 17:00 hằng ngày",
    distance: "Cách tháp Po Ramê khoảng 2 km",
    rules: "Giữ thái độ trang nghiêm, ăn mặc kín đáo, không chạm vào y trang thánh và án thờ.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAp5oGIUVAeSJNWnmsriAoE7Rx-gdVHGigsy1epg2Fah3OzIXtn7INt9avN5y3DYyr_5mgSbawDhhdB6AVM-eYtjoRZfxrq27rRi1-chffHIx6soB1QRX5R3xTS8gl_eF19cPeH7hONAuA5dgaNxeEG4JYrWaLNmlFYWVg8fXjwigzILTDoZgUaOHe27pOw-PL1DfizD5qy-ARG-iBr0tq2l090mbglxQI-yq7RDH_u_9aIirJEjUmV9Q",
    badge: "Trạm 07 • Đền Mẹ Xứ Sở Linh Thiêng",
    badgeClass: "bg-rose-600 text-white shadow-xs",
    highlights: [
      "Nơi gìn giữ hòm Y trang thiêng liêng của Nữ thần Mẹ Xứ Sở Po Ina Nagar",
      "Không gian khởi nguồn rước y trang và điệu múa thiêng ngày hội Katê",
      "Làng Chăm Hữu Đức cổ kính với nếp sống mẫu hệ thuần khiết"
    ]
  },
  {
    id: "palei-baoh-dana",
    order: 8,
    title: "Nhà cổ Chăm - Palei Baoh Dana (Làng Chất Thường)",
    ancientName: "Palei Baoh Dana (Paley Cet Tuang)",
    district: "Thôn Chất Thường, Xã Phước Hậu, Huyện Ninh Phước, Tỉnh Ninh Thuận",
    tagline: "Trái tim du lịch cộng đồng - Không gian Nhà Cổ Mẫu Hệ & Trụ sở Dana Community",
    summary:
      "Trụ sở Dana Community và không gian nhà cổ mẫu hệ Chăm nguyên bản tại làng Chất Thường, nơi lưu giữ tinh hoa kiến trúc mộc kê đá, ẩm thực dân gian và văn hóa Chăm Panduranga.",
    paragraphs: [
      "Ninh Thuận là địa phương có đông đảo đồng bào Chăm sinh sống nhất cả nước. Trong số các làng Chăm ven sông, làng Chất Thường – tên Chăm cổ kính là Palei Baoh Dana thuộc xã Phước Hậu, huyện Ninh Phước là một điểm sáng tiêu biểu phản ánh trọn vẹn đời sống văn hóa, tín ngưỡng và sự giao thoa cộng cư hài hòa.",
      "Palei Baoh Dana là ngôi làng có bề dày lịch sử hình thành lâu đời. Nơi đây đồng bào Chăm sinh sống quây quần với những nếp nhà ngói rêu phong, hàng rào dâm bụt, giàn nho trĩu quả và những người phụ nữ thắt lưng vải dệt đi chợ sớm. Cùng với đó là sự cộng cư gắn bó keo sơn qua nhiều thế hệ giữa người Chăm bản địa và người Kinh di dân, bồi đắp nên một không gian văn hóa đa dạng, đoàn kết và ấm áp tình người.",
      "Người dân Palei Baoh Dana gìn giữ vẹn nguyên các nghi lễ truyền thống như Rija Nagar, Katê, lễ cưới hỏi theo phong tục mẫu hệ, các bài thuốc dân gian từ thảo mộc đồi cát và nghệ thuật ẩm thực tinh tế như canh bồi Um Bơk, bánh tét, bánh Sakaya.",
      "Chính tại mảnh đất này, mô hình Du lịch Cộng đồng Dana Community ra đời với tâm nguyện phụng sự: bảo tồn tiếng nói, chữ viết, nghề thủ công truyền thống và đưa du khách hòa mình vào đời sống thực chất của bà con. Du khách được cùng nấu cơm làng, nghe các cụ già kể sử thi bên bếp lửa và thưởng thức trà thảo mộc ngọt lành.",
      "Palei Baoh Dana không chỉ là điểm kết thúc hoàn hảo cho chuyến du khảo di sản Panduranga, mà còn là nơi mở ra những kết nối chân thành giữa lữ khách bốn phương với tâm hồn mộc mạc, bền bỉ của người Chăm."
    ],
    coords: [11.5844183, 108.9116267],
    openHours: "08:00 - 17:30 (Đón tiếp du khách theo lịch hẹn)",
    distance: "Cách trung tâm Phan Rang 8 km",
    rules: "Chào hỏi người cao tuổi trong làng, tôn trọng nếp sống và không gian sinh hoạt của các gia đình mẫu hệ.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByRjv3i0FgHFxRrA7jzb_vp4kh7-P-4NrSYq9Zkk1lt5uKtg0Nqhq3LnRPLql0yHGiNMjL6ZdJ4bvwAco_jKoi5cKVVQyrhDXC_CtMT08OA5ogzdkhkYr96QFa4Jly_q9fjQIvrK6GcFT1JJlUR6bxy0yVImxdXGO8N5wDrB4tcuYiFJUP6SevjiPWkYr2orVSIoCNJDpVkrUBSCZVndc03_Kqs_3OkB2XPFgcw_7FdSU08jQAjDT5ZQ",
    badge: "Trạm 08 • Tọa độ Nhà Cổ Baoh Dana",
    badgeClass: "bg-emerald-700 text-white shadow-xs",
    highlights: [
      "Trụ sở sinh hoạt cộng đồng và trạm tiếp đón trung tâm Dana Community",
      "Không gian làng mẫu hệ Chăm - Kinh giao hòa ấm áp",
      "Trải nghiệm ẩm thực truyền thống và giao lưu văn nghệ bản địa"
    ],
    googleMapsUrl: "https://maps.app.goo.gl/FWVdoPUTFZDaNBZW8"
  }
];
