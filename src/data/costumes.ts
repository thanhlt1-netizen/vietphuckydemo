import { VietnameseCostume } from '../types/scenes';

export const VIETNAMESE_COSTUMES: VietnameseCostume[] = [
  {
    id: 'ao-dai',
    name: 'Áo Dài',
    aliases: ['Áo Dài Tân Thời', 'Quốc Phục Việt Nam'],
    dynasty: 'Thời Hiện Đại (Tiền thân Nguyễn)',
    era: 'Thập niên 1930 – Nay',
    origin: 'Cách tân từ Áo Ngũ Thân vào những năm 1930 bởi họa sĩ Nguyễn Cát Tường (Le Mur). Tiền thân xa hơn là Áo Giao Lĩnh và Áo Ngũ Thân thời Nguyễn.',
    features: [
      'Thân áo ôm sát cơ thể, xẻ tà cao hai bên hông',
      'Hai tà trước và sau dài chạm đất hoặc gần đất thanh thoát',
      'Cổ thuyền, cổ tròn hoặc cổ đứng thấp truyền thống',
      'Mặc kèm quần dài lụa ống rộng bay bổng'
    ],
    colors: ['Trắng học đường', 'Đỏ cưới hỏi', 'Vàng hoàng yến', 'Xanh ngọc bích', 'Tím Huế'],
    significance: 'Biểu tượng quốc phục Việt Nam, tôn vinh vẻ đẹp duyên dáng, kín đáo mà hiện đại của người phụ nữ Việt.',
    occasions: ['Mọi miền đất nước', 'Sự kiện trang trọng', 'Kỷ yếu', 'Lễ cưới', 'Lễ hội'],
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop',
    culturalNote: 'Luôn giữ tỷ lệ tà áo và sự kín đáo trang nhã. Khi cách tân với phụ kiện Gen Z, nên phối cùng giày sneaker vintage hoặc túi cói thay vì biến tấu xẻ tà quá đà.',
    genZScore: 98
  },
  {
    id: 'ao-ngu-than',
    name: 'Áo Ngũ Thân (Tay Chẽn)',
    aliases: ['Áo Dài Ngũ Thân', 'Áo Chẽn'],
    dynasty: 'Triều Nguyễn',
    era: '1744 – 1945',
    origin: 'Định hình từ cuộc cải cách y phục của Chúa Nguyễn Phúc Khoát năm 1744 tại Đàng Trong, sau đó trở thành quốc phục triều Nguyễn dưới thời vua Minh Mạng.',
    features: [
      'May từ 5 thân vải (2 thân trước, 2 thân sau, 1 thân con lót bên trong)',
      'Cổ đứng thẳng (lập lĩnh) ôm khít cổ',
      'Tay áo hẹp gọn gàng (tay chẽn), thuận tiện sinh hoạt',
      'Cài 5 nút bên phải (gỗ, ngọc, kim loại)',
      'Tà áo dài quá gối, sống lưng may thẳng tắp'
    ],
    colors: ['Xanh lam', 'Đen the thâm', 'Nâu gụ', 'Gấm hoàng gia', 'Tía'],
    significance: '5 thân tượng trưng tứ thân phụ mẫu che chở bản thân. 5 nút tượng trưng Ngũ Thường (Nhân – Lễ – Nghĩa – Trí – Tín). Đường sống lưng tượng trưng đạo làm người ngay thẳng.',
    occasions: ['Lễ phục nam/nữ', 'Đám cưới truyền thống', 'Sự kiện văn hóa miền Trung – Nam', 'Nghi lễ gia tộc'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    culturalNote: 'Khi mặc bắt buộc cài đủ 5 khuy nút và mặc áo lót trắng bên trong. Có thể phối cùng đồng hồ dây da cổ điển hoặc kính râm gọng tròn thanh lịch.',
    genZScore: 94
  },
  {
    id: 'ao-tac',
    name: 'Áo Tấc (Tay Thụng)',
    aliases: ['Áo Thụng', 'Áo Lễ', 'Áo Rộng'],
    dynasty: 'Triều Nguyễn',
    era: 'Thế kỷ 19 – Đầu thế kỷ 20',
    origin: 'Biến thể tay thụng rộng của Áo Ngũ Thân thời Nguyễn, được xem là thường lễ phục cao cấp trong triều đình và dân gian.',
    features: [
      'Giống Áo Ngũ Thân nhưng tay áo may rất thụng và dài',
      'Viền tay áo rộng đúng chuẩn 1 tấc (khoảng 4cm)',
      'Cổ đứng, cài 5 cúc bên hữu',
      'Dáng áo bề thế, trang nghiêm, phong thái thư thái'
    ],
    colors: ['Xanh lục', 'The đen', 'Tía sẫm', 'Gấm vàng kim', 'Đỏ son'],
    significance: 'Lễ phục trang trọng bậc nhất dùng trong tế tự, điển lễ hoàng gia, đại hỷ cưới hỏi và hội làng tôn nghiêm.',
    occasions: ['Đại lễ cưới cổ trang', 'Lễ hội Đền Hùng', 'Triều bái', 'Chụp ảnh kỷ niệm di sản'],
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop',
    culturalNote: 'Cần đội khăn đóng (khăn xếp) chỉnh tề. Tư thế hai tay chắp ngang ngực (vái chào) tôn vinh trọn vẹn nét đẹp của tay áo thụng bay trong gió.',
    genZScore: 96
  },
  {
    id: 'ao-nhat-binh',
    name: 'Áo Nhật Bình',
    aliases: ['Nhật Bình Cung Đình', 'Phi Phong'],
    dynasty: 'Triều Nguyễn',
    era: '1802 – 1945',
    origin: 'Trang phục cung đình cao cấp triều Nguyễn, dành riêng cho Hoàng hậu, Công chúa, Cung tần và Mệnh phụ quý tộc.',
    features: [
      'Cổ áo hình chữ nhật to bản trước ngực (nhật bình)',
      'Dải hoa văn thêu rồng phượng, ngũ phúc tinh xảo viền cổ',
      'Hai vạt trước buộc dải lụa buông rủ kiêu sa',
      'Tay áo ngũ sắc (xanh, đỏ, vàng, trắng, tím) trang nhã',
      'Dáng suông rộng bề thế, quý phái'
    ],
    colors: ['Vàng (Hoàng hậu)', 'Đỏ (Công chúa)', 'Tím (Nhị giai phi)', 'Xanh ngọc (Tam giai)'],
    significance: 'Đỉnh cao nghệ thuật thêu may cung đình Việt Nam. Biểu tượng của quyền uy, sự cao quý và vẻ đẹp lộng lẫy của phụ nữ hoàng tộc.',
    occasions: ['Đám cưới cổ phong cao cấp', 'Chụp ảnh nghệ thuật Cố Đô', 'Lễ hội Festival Huế', 'Trình diễn di sản'],
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
    culturalNote: 'Cổ áo hình chữ nhật là đặc trưng bất biến, không được biến tấu thành cổ tròn. Kết hợp búi tóc cài trâm phượng hoặc nón ba tầm phủ the cực kỳ ấn tượng.',
    genZScore: 99
  },
  {
    id: 'ao-tu-than',
    name: 'Áo Tứ Thân',
    aliases: ['Áo Dài Tứ Thân Bắc Bộ'],
    dynasty: 'Thời Lý – Trần – Lê – Nguyễn',
    era: 'Thế kỷ 11 – Thế kỷ 20',
    origin: 'Trang phục dân gian đặc trưng gắn liền với người phụ nữ đồng bằng Bắc Bộ qua hàng nghìn năm lịch sử.',
    features: [
      'May từ 4 thân vải (2 thân sau khâu ghép sống lưng, 2 thân trước buông tự do)',
      'Hai vạt trước có thể buông rủ hoặc thắt nút trước bụng duyên dáng',
      'Mặc ngoài yếm đào + áo cánh trắng lót mỏng',
      'Phía dưới là váy đen xòe chấm gót'
    ],
    colors: ['Nâu sồng', 'Thâm than', 'Nâu phù sa đất', 'The lụa mơ', 'Xanh cốm non'],
    significance: 'Hiện thân của vẻ đẹp người phụ nữ đất Bắc: cần cù, chịu thương chịu khó, duyên dáng và gắn kết gia đình bền chặt.',
    occasions: ['Lễ hội Quan họ Bắc Ninh', 'Hội xuân Kinh Bắc', 'Tết cổ truyền', 'Múa hát dân gian'],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
    culturalNote: 'Đi kèm khăn mỏ quạ và nón quai thao (nón ba tầm). Tuyệt đối giữ yếm trong kín đáo, tránh hở lưng quá mức làm mất nét mộc mạc dân gian.',
    genZScore: 91
  },
  {
    id: 'ao-ba-ba',
    name: 'Áo Bà Ba',
    aliases: ['Áo Bà Ba Nam Bộ'],
    dynasty: 'Thời Nguyễn – Đương đại',
    era: 'Cuối thế kỷ 19 – Nay',
    origin: 'Xuất hiện vào cuối thế kỷ 19 tại vùng đồng bằng sông Cửu Long, phỏng theo trang phục người Ba Ba Mã Lai và cải tiến phù hợp sông nước Nam Bộ.',
    features: [
      'Thân áo ngắn vừa vặn, cổ tròn hoặc cổ tim thanh thoát',
      'Cài hàng nút chạy dọc chính giữa ngực',
      'Xẻ hai bên hông tạo sự thoải mái tối đa khi vận động',
      'Mặc cùng quần dài đen hoặc trắng ống đứng suông'
    ],
    colors: ['Đen tuyền', 'Trắng tinh khôi', 'Nâu sẫm', 'Họa tiết carô flash', 'Hồng cánh sen pastel'],
    significance: 'Biểu tượng người dân miền Tây Nam Bộ: hào sảng, phóng khoáng, chân chất, gắn bó máu thịt với đời sống sông nước phù sa.',
    occasions: ['Đời thường Nam Bộ', 'Chợ nổi Cần Thơ', 'Lễ hội trái cây', 'Chụp ảnh dã ngoại'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop',
    culturalNote: 'Kết hợp cùng khăn rằn Nam Bộ và nón lá chóp nhọn. Gen Z có thể chọn chất liệu lụa tơ tằm dệt hoa chìm để biến tấu thành outfit dạo phố thanh lịch.',
    genZScore: 92
  },
  {
    id: 'ao-giao-linh',
    name: 'Áo Giao Lĩnh (Tràng Vạt)',
    aliases: ['Áo Đối Lĩnh', 'Áo Giao Lãnh'],
    dynasty: 'Thời Lý – Trần – Lê',
    era: 'Thế kỷ 11 – 18',
    origin: 'Một trong những cổ phục lâu đời nhất của người Việt, phổ biến trong triều đình và giới quý tộc từ thời Lý, Trần đến Lê sơ.',
    features: [
      'Cổ áo vắt chéo nhau sang bên phải tạo thành hình chữ Y thanh tú',
      'Hai vạt trước giao nhau, buộc dây lụa tinh tế',
      'Tay áo rộng vừa hoặc thụng dài',
      'Thân áo dài quá đầu gối, xếp nếp bay bổng'
    ],
    colors: ['Xanh thiên thanh', 'Đỏ thắm chu sa', 'Bạch ngọc', 'Nâu hoàng thổ', 'Xanh ngọc'],
    significance: 'Đỉnh cao trang phục cổ truyền thời kỳ độc lập tự chủ Lý – Trần, toát lên phong thái thoát tục, thanh tao của bậc quân tử và tài nữ.',
    occasions: ['Phục dựng lịch sử cổ trang', 'Lễ hội hoa đăng', 'Điển lễ tôn vinh danh nhân', 'Cosplay cổ phong'],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
    culturalNote: 'Chú ý vạt trái luôn đè lên vạt phải (tả nhậm/hữu nhậm theo lễ nghi truyền thống Á Đông).',
    genZScore: 95
  },
  {
    id: 'ao-vien-linh',
    name: 'Áo Viên Lĩnh (Cổ Tròn)',
    aliases: ['Áo Đoàn Lĩnh', 'Triều Phục Cổ Tròn'],
    dynasty: 'Thời Lý – Trần – Lê Sơ',
    era: 'Thế kỷ 11 – 18',
    origin: 'Phổ biến song song với Giao Lĩnh, là quy chuẩn triều phục của quan lại, vương hầu và hoàng gia thời Lý, Trần, Lê.',
    features: [
      'Cổ áo tròn ôm sát cổ, cài nút bên hữu vai',
      'Tay áo thụng dài uy nghiêm',
      'Trước ngực thường có Bổ Tử (hoa văn chim thú chỉ định phẩm hàm)',
      'Thắt đai lưng bản lớn đính ngọc quý'
    ],
    colors: ['Đỏ son (Nhất phẩm)', 'Xanh tía', 'Xanh bích', 'Vàng kim', 'Trắng ngà'],
    significance: 'Thể hiện trật tự tôn nghiêm, văn võ phân minh và tư tưởng phong thái trị quốc uy nghi của các triều đại đại việt rực rỡ.',
    occasions: ['Nghi lễ cung đình phục dựng', 'Triển lãm di sản lịch sử', 'Sự kiện trang trọng quốc gia'],
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop',
    culturalNote: 'Họa tiết Bổ Tử thêu hạc, phượng, lân, sư tử cần đúng quy chế triều đại, không lai căng với trang phục các nước láng giềng.',
    genZScore: 93
  },
  {
    id: 'yem-vay',
    name: 'Yếm + Váy (Nội Y Phục)',
    aliases: ['Áo Yếm Cổ Truyền', 'Yếm Đào Váy Lĩnh'],
    dynasty: 'Mọi thời kỳ (Lý đến Nguyễn)',
    era: 'Thế kỷ 11 – 20',
    origin: 'Trang phục nội thất kín đáo của phụ nữ Việt xưa, mặc bên trong áo Tứ Thân, Giao Lĩnh hoặc Áo Dài xưa.',
    features: [
      'Yếm vải hình thoi che ngực, cổ tròn hoặc cổ xẻ chữ V',
      'Dây buộc sau gáy và sau lưng tinh tế',
      'Váy đen quấn quanh eo, buông rủ chấm gót',
      'Chất liệu lụa tơ tằm, đũi, the mềm mát'
    ],
    colors: ['Đỏ đào', 'Hồng sen', 'Trắng ngà', 'Xanh thiên lý', 'Nâu sồng'],
    significance: 'Biểu hiện sự e ấp, tinh tế và văn hóa trang phục đa tầng lớp (layering) sâu sắc của người phụ nữ Việt Nam.',
    occasions: ['Mặc trong áo Tứ Thân/Tấc', 'Nghệ thuật nhiếp ảnh dân gian', 'Múa dân gian cổ truyền'],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
    culturalNote: 'Yếm là trang phục mặc kèm hoặc trong không gian riêng tư truyền thống. Khi cách tân hiện đại, nên phối kèm áo khoác voan mỏng hoặc kimono lụa dáng dài bên ngoài.',
    genZScore: 89
  }
];
