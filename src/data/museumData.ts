export interface MuseumArtifact {
  id: string;
  name: string;
  vietnameseName: string;
  dynasty: string;
  era: string; // e.g. 'Thế kỷ 11-14', 'Thế kỷ 17-18', 'Thế kỷ 18-19'
  category: 'imperial' | 'ceremonial' | 'folk' | 'textile' | 'document';
  museumLocation: string; // e.g. 'Bảo tàng Cổ vật Cung đình Huế', 'Bảo tàng Lịch sử Quốc gia (Hà Nội)', 'Bảo tàng Áo Dài TP.HCM'
  significance: string;
  description: string;
  culturalValues: string[];
  historicalQuotes?: {
    source: string;
    quote: string;
  };
  features: {
    collar: string;
    sleeves: string;
    buttons: string;
    patterns: string;
    material: string;
  };
  imageUrl: string;
  detailImages?: string[];
  relatedCostumeId?: string; // Links to 9 traditional costumes in app
  tags: string[];
}

export interface MuseumDynastyTimeline {
  id: string;
  name: string;
  period: string;
  historicalContext: string;
  costumeHighlights: string[];
  definingFeatures: string;
}

export const MUSEUM_TIMELINE: MuseumDynastyTimeline[] = [
  {
    id: 'ly-tran',
    name: 'Thời Lý - Trần',
    period: '1009 – 1400',
    historicalContext: 'Thời kỳ quốc gia Đại Việt phát triển rực rỡ sau độc lập. Y phục mang tinh thần Phật giáo Đại thừa, phóng khoáng, uyển chuyển với vạt áo đối lĩnh, giao lĩnh thanh thoát.',
    costumeHighlights: ['Áo Giao Lĩnh vạt rộng', 'Viên Lĩnh Bào', 'Khăn La dệt chỉ vàng', 'Họa tiết Hoa Cúc, Hoa Sen & Sóng Thủy Ba'],
    definingFeatures: 'Cổ chéo hình chữ Y, tà áo thướt tha, viền rộng, tay áo cánh buồm thanh nhã.'
  },
  {
    id: 'le-trung-hung',
    name: 'Thời Lê Sơ & Lê Trung Hưng',
    period: '1428 – 1789',
    historicalContext: 'Định hình quy chế phẩm phục văn võ phân minh với Điển chế y quan nghiêm ngặt. Di sản tiêu biểu qua tượng Hoàng hậu Trịnh Thị Ngọc Trúc và hệ thống Bổ Tử.',
    costumeHighlights: ['Bổ Tử thêu Phượng / Mãng', 'Áo Giao Lĩnh khoác ngoài', 'Y phục Tượng Phật Bà Bút Tháp', 'Vải Đoạn gấm Thăng Long'],
    definingFeatures: 'Hệ thống hoa văn thêu tinh xảo, phân định phẩm cấp rõ rệt bằng ngực áo Bổ Tử.'
  },
  {
    id: 'nguyen',
    name: 'Thời Chúa Nguyễn & Triều Nguyễn',
    period: '1744 – 1945',
    historicalContext: '1744: Chúa Nguyễn Phúc Khoát cải cách y phục Đàng Trong, khai sinh Áo Ngũ Thân. Triều Nguyễn hoàn thiện Điển chế trang phục cung đình và dân gian với Đại triều phục, Thường triều và Lễ phục.',
    costumeHighlights: ['Hoàng Bào Long Vân khảm châu', 'Phượng Bào Hậu Cung', 'Áo Nhật Bình đối khâm', 'Áo Tấc tay thụng', 'Áo Ngũ Thân tay chẽn'],
    definingFeatures: 'Cổ đứng lập lĩnh, 5 nút cài bên phải (tượng trưng Ngũ Thường), 5 thân áo biểu trưng Tứ thân phụ mẫu + Bản thân.'
  },
  {
    id: 'modern-folk',
    name: 'Dân Gian & Đương Đại',
    period: 'Thế kỷ 19 – 21',
    historicalContext: 'Sự tiếp nối và chuyển mình sống động trong đời sống dân tộc: Áo Tứ Thân quan họ xứ Kinh Bắc, Áo Bà Ba sông nước Cửu Long, và Áo Dài Tân Thời Le Mur vươn tầm quốc phục.',
    costumeHighlights: ['Áo Tứ Thân Bắc Bộ & Yếm Đào', 'Áo Bà Ba Nam Bộ mềm mại', 'Áo Dài Lemur & Cát Tường', 'Việt Phục Cách Tân Gen Z'],
    definingFeatures: 'Gắn liền với lao động, hội hè đình đám và tính thẩm mỹ duyên dáng, gần gũi với thiên nhiên.'
  }
];

export const MUSEUM_ARTIFACTS: MuseumArtifact[] = [
  {
    id: 'art-hoang-bao',
    name: 'Imperial Dragon Robe (Hoàng Bào)',
    vietnameseName: 'Hoàng Bào Long Vân Đại Triều Phục',
    dynasty: 'Triều Nguyễn (1802 - 1945)',
    era: 'Thế kỷ 19',
    category: 'imperial',
    museumLocation: 'Bảo tàng Cổ vật Cung đình Huế (Điện Long An)',
    significance: 'Bảo vật tối thượng của bậc Thiên Tử trong các đại lễ Tế Giao, Thiết Triều và Đăng Quang.',
    description: 'Chiếc hoàng bào chính sắc vàng óng thêu chín con rồng vàng (Cửu Long) cuộn trong mây ngũ sắc (Long Vân Đại Hội), vạt áo thêu cảnh Thủy Ba sóng nước dâng trào kết hợp đá quý và trần sa. Đi kèm Mũ Bình Thiên và Hài Kim Tuyến.',
    culturalValues: [
      'Biểu tượng của quyền uy tối cao và vương triều độc lập',
      'Họa tiết Rồng 5 móng ngậm ngọc minh châu độc quyền Hoàng đế',
      'Kỹ thuật thêu tơ vàng luồn kim sa đạt đỉnh cao mỹ nghệ Việt Nam'
    ],
    historicalQuotes: {
      source: 'Khâm định Đại Nam hội điển sự lệ (Quyển 78 - Y quan quy chế)',
      quote: 'Hoàng bào dùng sa đoạn thêu rồng mây bóng bẩy sắc vàng chính vị, đính hạt ngọc trân châu ngũ sắc, lót lụa the hồng rực rỡ.'
    },
    features: {
      collar: 'Viên Lĩnh hoặc Lập Lĩnh viền gấm rồng',
      sleeves: 'Tay thụng rộng rãi mang dáng vẻ uy nghi, quyền quý',
      buttons: '5 hạt ngọc bảo bằng hoàng ngọc bọc vàng',
      patterns: 'Rồng cuộn ngũ trảo, mây ngũ sắc, sóng thủy ba, chữ Thọ vàng',
      material: 'Đoạn lụa gấm dệt chỉ kim tuyến cung tiến tiến vua'
    },
    imageUrl: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=1200&q=80',
    relatedCostumeId: 'ngu-than',
    tags: ['Hoàng Cung', 'Hoàng Bào', 'Triều Nguyễn', 'Bảo Tàng Huế', 'Rồng 5 Móng']
  },
  {
    id: 'art-phuong-bao-nhat-binh',
    name: 'Royal Phoenix Robe & Nhật Bình',
    vietnameseName: 'Áo Nhật Bình Cung Tần Triều Nguyễn',
    dynasty: 'Triều Nguyễn (1802 - 1945)',
    era: 'Thế kỷ 19 - Đầu thế kỷ 20',
    category: 'imperial',
    museumLocation: 'Bảo tàng Cổ vật Cung đình Huế & Bảo tàng Lịch sử Quốc gia',
    significance: 'Triều phục cao cấp dành cho Hoàng hậu, Hoàng thái hậu, Công chúa và Cung tần.',
    description: 'Áo Nhật Bình nổi bật với phần cổ chữ nhật to bản viền chỉ vàng thêu họa tiết Loan Phượng, hoa cúc, mây và chữ Phúc Thọ. Hai dải ngũ sắc buông dài phía trước ngực tượng trưng cho ngũ hành tương sinh hòa hợp.',
    culturalValues: [
      'Quy chuẩn sắc phục nghiêm ngặt theo cấp bậc (Hoàng Hậu dùng sắc Vàng/Đỏ; Công Chúa dùng sắc Đỏ; Cung tần dùng sắc Tím/Lam)',
      'Nghệ thuật thêu đính chỉ bạc, hạt cườm ngọc trai thủ công tinh xảo',
      'Hiện vật tiêu biểu cho đỉnh cao trang phục nữ quý tộc hoàng cung Việt Nam'
    ],
    historicalQuotes: {
      source: 'Đại Nam Thực Lục',
      quote: 'Nhật Bình áo cổ vuông vắn ngay ngắn, sắc áo đỏ thắm thêu phượng hoàng hàm thư, viền gấm thêu hoa dây bát bửu.'
    },
    features: {
      collar: 'Cổ hình chữ nhật to bản (Nhật Bình) viền hoa văn thêu dầy',
      sleeves: 'Tay rộng có dải ngũ sắc (xanh, đỏ, vàng, trắng, đen) viền cửa tay',
      buttons: 'Buộc dải ngọc khánh kết hợp khuy ngọc bích',
      patterns: 'Phụng ổ, Loan ổ, Thủy ba sóng nước, Tam đa Phúc Lộc Thọ',
      material: 'Lụa the kép, gấm đoạn thượng hạng Cung đình'
    },
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    relatedCostumeId: 'nhat-binh',
    tags: ['Cung Đình', 'Nhật Bình', 'Phượng Hoàng', 'Hoàng Tộc', 'Cổ Ngũ Sắc']
  },
  {
    id: 'art-ao-tac-ngu-than',
    name: 'Wide-sleeve Ceremonial Robe (Áo Tấc)',
    vietnameseName: 'Áo Tấc Ngũ Thân Tay Thụng Truyền Thống',
    dynasty: 'Triều Nguyễn đến cận đại',
    era: 'Thế kỷ 18 - 20',
    category: 'ceremonial',
    museumLocation: 'Bảo tàng Áo Dài TP.HCM & Trung tâm Bảo tồn Di tích Cố đô Huế',
    significance: 'Lễ phục trang trọng chuẩn mực của giới tri thức, nho sĩ, quan lại và dân chúng trong tế lễ, cưới hỏi.',
    description: 'Áo Tấc là dạng áo ngũ thân với ống tay rộng thụng (rộng đúng một tấc khoảng 10-12cm ở viền gấu). Áo tượng trưng cho phong thái ung dung, đĩnh đạc và lễ giáo của người quân tử phương Nam.',
    culturalValues: [
      '5 thân áo tượng trưng cho Tứ thân phụ mẫu và Bản thân người mặc',
      '5 cúc áo tượng trưng cho Ngũ Thường: Nhân - Lễ - Nghĩa - Trí - Tín',
      'Đường sống lưng (trung phùng) may thẳng tắp biểu trưng cho đức tính ngay thẳng, liêm khiết'
    ],
    historicalQuotes: {
      source: 'Vũ Trung Tùy Bút (Phạm Đình Hổ)',
      quote: 'Y phục đoan trang, cổ cao nút ngay thẳng, tay áo dài thụng tấc thước biểu lộ phong thái lễ giáo ngàn đời.'
    },
    features: {
      collar: 'Cổ đứng lập lĩnh cao 3-4cm giữ sự kín đáo, nghiêm trang',
      sleeves: 'Tay thụng dài qua đầu ngón tay khi buông thả',
      buttons: '5 hạt cúc đồng mạ hoặc đồi mồi, xà cừ',
      patterns: 'Trơn màu the đen, gấm hoa chìm hoặc dệt vân mây chữ Vạn',
      material: 'Vải Sa, The, Gấm vân tơ tằm nguyên bản'
    },
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    relatedCostumeId: 'ao-tac',
    tags: ['Lễ Phục', 'Áo Tấc', 'Tay Thụng', 'Ngũ Thường', 'Khăn Đóng']
  },
  {
    id: 'art-tuong-ngoc-truc-le',
    name: 'Queen Trinh Thi Ngoc Truc Robes (Tượng Ngọc Trúc)',
    vietnameseName: 'Bảo vật Quốc gia: Y phục Tượng Hoàng Hậu Trịnh Thị Ngọc Trúc',
    dynasty: 'Thời Lê Trung Hưng (Thế kỷ 17)',
    era: 'Năm 1646',
    category: 'document',
    museumLocation: 'Bảo tàng Mỹ thuật Việt Nam (Hà Nội)',
    significance: 'Pho tượng chân dung điêu khắc gỗ sơn thếp đỉnh cao của mỹ thuật Đại Việt thế kỷ 17.',
    description: 'Bảo vật quốc gia khắc họa chân dung Hoàng hậu trong trang phục cung đình nhiều lớp: bên trong là áo giao lĩnh cổ chéo, khoác ngoài viên lĩnh thêu phụng, đội mũ Kim Quan đính hoa văn hoa cúc và chim loan.',
    culturalValues: [
      'Minh chứng sống động nhất về y phục phụ nữ quý tộc thời Lê Trung Hưng',
      'Tư liệu gốc phục vụ cho hàng loạt công trình phục dựng cổ phục Việt Nam thế kỷ 21',
      'Nghệ thuật chạm khắc nếp áo mềm mại như gấm lụa sống động'
    ],
    features: {
      collar: 'Nhiều lớp giao lĩnh cổ chéo lồng ghép hài hòa',
      sleeves: 'Tay áo xếp nếp điệp tụ buông phủ nhẹ nhàng',
      buttons: 'Dải lụa thắt thắt lưng ngọc đới trang nhã',
      patterns: 'Hoa cúc dây, chim phượng thời Lê, mây dải',
      material: 'Gỗ mít phủ sơn son thếp vàng cổ truyền'
    },
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    relatedCostumeId: 'giao-linh',
    tags: ['Bảo Vật Quốc Gia', 'Thời Lê', 'Chùa Bút Tháp', 'Tượng Cổ', 'Mỹ Thuật']
  },
  {
    id: 'art-henri-oger-1908',
    name: 'Henri Oger Woodcut Archives (1908-1909)',
    vietnameseName: 'Bản khắc gỗ Kỹ thuật người An Nam (Henri Oger)',
    dynasty: 'Thời Nguyễn - Đầu thế kỷ 20',
    era: 'Năm 1908 - 1909',
    category: 'document',
    museumLocation: 'Thư viện Quốc gia Việt Nam & Viện Viễn Đông Bác Cổ (EFEO)',
    significance: 'Bộ đại từ điển bách khoa hình ảnh bằng tranh khắc gỗ hơn 4.200 bản vẽ về đời sống và y phục người Việt cổ.',
    description: 'Công trình đồ sộ ghi chép chân thực từng nét cắt may áo dài năm thân, thợ dệt vải tơ tằm, nghệ nhân khâu nón ba tầm, nón quai thao, cách mặc áo tứ thân đi cấy, lễ rước đình làng.',
    culturalValues: [
      'Nguồn tư liệu thị giác vô giá về cách ăn mặc của mọi tầng lớp dân chúng',
      'Minh chứng về kỹ thuật dệt lụa, nhuộm củ nâu, nhuộm chàm truyền thống',
      'Khắc họa chân thực sự chuyển giao từ cổ phục ngũ thân sang áo dài tân thời'
    ],
    features: {
      collar: 'Ghi chép đầy đủ từ cổ chéo, cổ tròn tới cổ ngũ thân bấm khuy',
      sleeves: 'Chi tiết đường may tay chẽn, tay rộng xắn cao khi lao động',
      buttons: 'Các kiểu cúc tết bằng vải bện, cúc kim loại và khuy ngọc',
      patterns: 'Tranh khắc mộc bản dân gian Thăng Long - Hà Nội',
      material: 'Giấy dó cổ in mộc bản bản khắc gỗ'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    relatedCostumeId: 'ao-tu-than',
    tags: ['Tư Liệu Cổ', 'Henri Oger', 'Khắc Gỗ', 'Bách Khoa Y Phục', 'Hà Nội Xưa']
  },
  {
    id: 'art-lua-van-phuc-ha-dong',
    name: 'Van Phuc Ancient Silk & Lãnh Mỹ A',
    vietnameseName: 'Lụa Vạn Phúc & Lãnh Mỹ A Bảo Tồn',
    dynasty: 'Ngàn năm di sản dệt lụa',
    era: 'Từ thời Hùng Vương thứ 6 đến nay',
    category: 'textile',
    museumLocation: 'Bảo tàng Dệt May & Không gian Lụa Di Sản Vạn Phúc (Hà Đông)',
    significance: 'Tinh hoa tơ tằm nước Việt được lưu truyền qua hàng nghìn năm, từng được chọn may quốc phục cung đình.',
    description: 'Lụa tơ tằm tự nhiên óng ả mềm mịn mát mẻ vào mùa hạ ấm áp vào mùa đông. Đặc biệt là Vân lụa dệt hoa chìm hoa nổi và Lãnh Mỹ A nhuộm mủ trái mặc nưa trứ danh Tân Châu.',
    culturalValues: [
      'Nghề truyền thống khởi xướng từ công chúa Thiều Hoa thời Hùng Vương',
      'Chất liệu tự nhiên 100% thân thiện môi trường và mềm mại cho làn da',
      'Được xuất khẩu trên Con đường Tơ lụa biển từ thế kỷ 17'
    ],
    features: {
      collar: 'Dệt nên độ đứng form mềm mại cho cổ lập lĩnh',
      sleeves: 'Độ rủ óng ả tự nhiên khi cử động tà áo',
      buttons: 'Kết hợp vải viền bọc nút hài hòa',
      patterns: 'Vân Mây, Song Phượng, Chữ Thọ, Hoa Cúc cổ truyền',
      material: 'Tơ tằm tự nhiên 100%, nhuộm màu thảo mộc tự nhiên'
    },
    imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80',
    relatedCostumeId: 'ao-dai',
    tags: ['Lụa Vạn Phúc', 'Lãnh Mỹ A', 'Tơ Tằm', 'Nghề Cổ Truyền', 'Dệt Vải']
  },
  {
    id: 'art-mang-bao-hoang-tu',
    name: 'Prince Python Robe (Mãng Bào Hoàng Tử)',
    vietnameseName: 'Mãng Bào Hoàng Tử Cung Đình Huế',
    dynasty: 'Triều Nguyễn (1802 - 1945)',
    era: 'Cuối thế kỷ 19',
    category: 'imperial',
    museumLocation: 'Bảo tàng Cổ vật Cung đình Huế',
    significance: 'Lễ phục trang trọng của các Hoàng tử và Quan đại thần thượng phẩm triều Nguyễn.',
    description: 'Mãng bào thêu họa tiết Mãng xà (loài rồng bốn móng) cuộn mây, màu xanh lam thẫm hoặc tím cánh sen, đính kim tuyến lấp lánh biểu trưng cho tài trí và hoàng tộc.',
    culturalValues: [
      'Phân biệt rõ ràng giữa Long bào (Vua - 5 móng) và Mãng bào (Hoàng tử/Quan - 4 móng)',
      'Kỹ nghệ may thêu cung đình đạt trình độ tinh hoa bậc nhất châu Á thế kỷ 19',
      'Lưu giữ hoàn chỉnh tại kho cổ vật cung đình Huế'
    ],
    features: {
      collar: 'Viên Lĩnh hoặc Lập Lĩnh may khít viền the vàng',
      sleeves: 'Tay thụng trung bình dài, cử động khoan thai',
      buttons: 'Khuy ngọc bọc vàng 5 khuy',
      patterns: 'Mãng cuộn mây, thủy ba sóng thần, hoa sen cách điệu',
      material: 'Gấm sa đoạn nhập tiến triều đình'
    },
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    relatedCostumeId: 'vien-linh',
    tags: ['Mãng Bào', 'Hoàng Tử', 'Cung Đình', 'Bảo Tàng Huế', 'Rồng 4 Móng']
  },
  {
    id: 'art-ao-ba-ba-nam-bo',
    name: 'Southern Ba Ba Folk Attire',
    vietnameseName: 'Áo Bà Ba Nam Bộ & Khăn Rằn Miền Tây',
    dynasty: 'Cuối thế kỷ 19 – Hiện đại',
    era: 'Thế kỷ 19 - 20',
    category: 'folk',
    museumLocation: 'Bảo tàng Phụ Nữ Nam Bộ (TP.HCM)',
    significance: 'Biểu tượng của nét đẹp mộc mạc, phóng khoáng, thủy chung của người dân Nam Bộ hào sảng.',
    description: 'Áo cổ tròn hoặc tim, cài cúc giữa ngực, xẻ tà hai bên hông dễ cử động, may bằng vải lụa hoặc the mát mẻ, kết hợp chiếc Khăn Rằn dệt ô vuông caro đen trắng.',
    culturalValues: [
      'Thích nghi hoàn hảo với khí hậu nhiệt đới sông nước miền Tây Nam Bộ',
      'Gắn liền với hình ảnh người mẹ, người chị kiên cường trong lịch sử đấu tranh dân tộc',
      'Trở thành nét đặc trưng văn hóa phương Nam được yêu chuộng toàn cầu'
    ],
    features: {
      collar: 'Cổ tròn ôm nhẹ hoặc cổ tim thanh thoát',
      sleeves: 'Tay dài thon gọn, có túi áo tiện dụng',
      buttons: 'Hàng cúc giữa bấm nút xương hoặc cúc bấm mạ bạc',
      patterns: 'Trơn màu đỗ xanh, nâu đen, hoa nhí nhẹ nhàng',
      material: 'Vải lụa mỏng, the, đũi mát mẻ thông thoáng'
    },
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=80',
    relatedCostumeId: 'ao-ba-ba',
    tags: ['Nam Bộ', 'Áo Bà Ba', 'Khăn Rằn', 'Sông Nước', 'Dân Gian']
  }
];
