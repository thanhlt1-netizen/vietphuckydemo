import imgNhatBinh from '../assets/images/ao_nhat_binh_1790402840330.jpg';
import imgAoTac from '../assets/images/ao_tac_1790402854694.jpg';
import imgNguThan from '../assets/images/ao_ngu_than_1790402870411.jpg';
import imgGiaoLinh from '../assets/images/ao_giao_linh_1790402887546.jpg';
import imgVienLinh from '../assets/images/ao_vien_linh_1790402943901.jpg';
import imgTuThan from '../assets/images/ao_tu_than_1790402901827.jpg';
import imgAoDaiGenZ from '../assets/images/ao_dai_genz_1790402927498.jpg';
import imgAoBaBa from '../assets/images/ao_ba_ba_1790402914999.jpg';
import imgYemVay from '../assets/images/yem_vay_vietnam_1790432259646.jpg';

export interface VietPhucItem {
  id: string;
  orderNumber: number;
  name: string;
  aliasName?: string;
  origin: string;
  designFeatures: string[];
  primaryColors: string;
  culturalMeaning: string;
  suitableOccasions: string;
  imageNote: string;
  imageUrl: string;
  dynasty: string;
  collarType: string;
  collarShape: 'crossed' | 'rectangular' | 'round' | 'buttoned' | 'wide' | 'tied';
  accentColor: string;
  defaultFabrics: string[];
}

/**
 * KHO DỮ LIỆU VIỆT PHỤC CHUẨN MỰC TỪ vietphuc.md (9 BỘ DUY NHẤT VÀ BẮT BUỘC)
 * 100% trích xuất nguyên bản từ tài liệu vietphuc.md, không chỉnh sửa hay bịa đặt.
 */
export const VIET_PHUC_LIST: VietPhucItem[] = [
  // 1. Áo Dài (Áo Dài Hiện Đại / Quốc phục)
  {
    id: 'ao-dai',
    orderNumber: 1,
    name: 'Áo Dài (Áo Dài Hiện Đại / Quốc phục)',
    aliasName: 'Áo dài tân thời',
    origin: 'Cách tân từ Áo Ngũ Thân vào những năm 1930 bởi họa sĩ Nguyễn Cát Tường (Le Mur) và các họa sĩ khác. Tiền thân xa hơn là áo giao lĩnh và áo ngũ thân thời Nguyễn.',
    designFeatures: [
      'Thân áo ôm sát cơ thể, xẻ tà cao hai bên',
      'Hai tà trước và sau dài chạm đất hoặc gần đất',
      'Cổ thuyền hoặc cổ đứng thấp',
      'Mặc kèm quần dài ống rộng'
    ],
    primaryColors: 'Đa dạng – trắng (học đường, trang trọng), đỏ/hồng (cưới hỏi), vàng, xanh, tím, họa tiết hoa văn truyền thống hoặc hiện đại',
    culturalMeaning: 'Biểu tượng quốc phục Việt Nam, tôn vinh vẻ đẹp duyên dáng, kín đáo mà hiện đại của người phụ nữ Việt. Được mặc trong lễ hội, cưới hỏi, sự kiện trang trọng, trường học.',
    suitableOccasions: 'Mọi miền, mọi sự kiện trang trọng, kỷ yếu, đám cưới, lễ hội.',
    imageNote: 'Nên dùng ảnh áo dài truyền thống ôm dáng, tà bay nhẹ, nền đơn giản hoặc cảnh Việt Nam.',
    imageUrl: imgAoDaiGenZ,
    dynasty: 'Hiện đại (Cách tân từ 1930s)',
    collarType: 'Cổ thuyền hoặc cổ đứng thấp',
    collarShape: 'buttoned',
    accentColor: '#BA7A2A',
    defaultFabrics: ['Lụa tơ tằm', 'Gấm hoa', 'Lụa Hà Đông']
  },

  // 2. Áo Ngũ Thân (Áo Ngũ Thân Tay Chẽn)
  {
    id: 'ngu-than',
    orderNumber: 2,
    name: 'Áo Ngũ Thân (Áo Ngũ Thân Tay Chẽn)',
    aliasName: 'Áo dài ngũ thân, Áo chẽn',
    origin: 'Định hình từ cuộc cải cách y phục của Chúa Nguyễn Phúc Khoát năm 1744 tại Đàng Trong, sau đó trở thành quốc phục thời Nguyễn.',
    designFeatures: [
      'May từ 5 thân vải (2 trước, 2 sau, 1 thân con bên trong)',
      'Cổ đứng (lập lĩnh)',
      'Tay hẹp (tay chẽn)',
      'Cài 5 nút bên phải',
      'Tà áo dài quá gối'
    ],
    primaryColors: 'Xanh, đen, nâu, the thâm, gấm màu trang trọng',
    culturalMeaning: '5 thân tượng trưng cho tứ thân phụ mẫu + bản thân người mặc. 5 nút tượng trưng Ngũ thường (Nhân – Lễ – Nghĩa – Trí – Tín). Đường may sống lưng tượng trưng sự ngay thẳng.',
    suitableOccasions: 'Lễ phục, đám cưới truyền thống, sự kiện trang trọng miền Trung – Nam.',
    imageNote: 'Ảnh cổ phục phục dựng chính xác, cổ đứng, tay hẹp.',
    imageUrl: imgNguThan,
    dynasty: 'Thời Nguyễn (Định hình từ 1744)',
    collarType: 'Cổ đứng (lập lĩnh), cài 5 nút bên phải',
    collarShape: 'buttoned',
    accentColor: '#8C6014',
    defaultFabrics: ['Gấm tơ tằm', 'The thâm', 'Đũi tơ']
  },

  // 3. Áo Tấc (Áo Ngũ Thân Tay Thụng)
  {
    id: 'ao-tac',
    orderNumber: 3,
    name: 'Áo Tấc (Áo Ngũ Thân Tay Thụng)',
    aliasName: 'Áo thụng, Áo lễ, Áo rộng',
    origin: 'Biến thể tay rộng của Áo Ngũ Thân thời Nguyễn, dùng làm lễ phục trang trọng.',
    designFeatures: [
      'Giống Áo Ngũ Thân nhưng tay áo rộng và dài (tay thụng)',
      'Viền tay rộng khoảng 1 tấc',
      'Cổ đứng, 5 thân',
      'Dáng trang nghiêm, bề thế'
    ],
    primaryColors: 'Xanh lục, đen, tía, gấm vàng, đỏ (tùy cấp bậc và dịp)',
    culturalMeaning: 'Lễ phục cao cấp, thể hiện sự trang trọng, dùng trong tế lễ, cưới hỏi, triều phục.',
    suitableOccasions: 'Đám cưới truyền thống, lễ hội lớn, sự kiện trang nghiêm.',
    imageNote: 'Ảnh nam/nữ mặc áo tấc tay rộng, đội khăn xếp.',
    imageUrl: imgAoTac,
    dynasty: 'Thời Nguyễn',
    collarType: 'Cổ đứng, tay thụng rộng 1 tấc',
    collarShape: 'wide',
    accentColor: '#78482E',
    defaultFabrics: ['Gấm dệt vân mây', 'Sa đoạn', 'Lụa tơ tằm']
  },

  // 4. Áo Nhật Bình
  {
    id: 'nhat-binh',
    orderNumber: 4,
    name: 'Áo Nhật Bình',
    aliasName: 'Áo Nhật Bình cung đình',
    origin: 'Trang phục cung đình thời Nguyễn, dành cho Hoàng hậu, Công chúa, phi tần và mệnh phụ.',
    designFeatures: [
      'Cổ áo hình chữ nhật to bản (nhật bình)',
      'Hai vạt trước buộc dây hoặc cài',
      'Tay rộng, dáng suông trang trọng',
      'Thường có hoa văn thêu phức tạp (rồng, phượng, hoa lá)'
    ],
    primaryColors: 'Hoàng hậu: Vàng; Công chúa: Đỏ; Các màu khác: Tím, đào, xanh theo quy định cấp bậc',
    culturalMeaning: 'Biểu tượng quyền quý, thanh cao của phụ nữ cung đình. Ngày nay được dùng nhiều trong đám cưới cổ trang.',
    suitableOccasions: 'Đám cưới cổ trang, chụp ảnh nghệ thuật, lễ hội cung đình.',
    imageNote: 'Ảnh phục dựng Nhật Bình cổ đứng hình chữ nhật, màu đỏ hoặc vàng.',
    imageUrl: imgNhatBinh,
    dynasty: 'Cung đình thời Nguyễn',
    collarType: 'Cổ áo hình chữ nhật to bản (nhật bình)',
    collarShape: 'rectangular',
    accentColor: '#C68A1E',
    defaultFabrics: ['Gấm thêu kim tuyến', 'Lụa Vạn Phúc', 'Sa tơ ngũ sắc']
  },

  // 5. Áo Tứ Thân
  {
    id: 'tu-than',
    orderNumber: 5,
    name: 'Áo Tứ Thân',
    aliasName: 'Áo dài tứ thân',
    origin: 'Phổ biến từ thời Lý – Trần đến hết thời Nguyễn, đặc trưng của phụ nữ đồng bằng Bắc Bộ.',
    designFeatures: [
      'May từ 4 thân vải',
      'Hai vạt trước buông tự do hoặc thắt lại',
      'Mặc ngoài yếm + áo cánh, dưới là váy đen',
      'Thường khoác ngoài, không cài kín'
    ],
    primaryColors: 'Nâu, thâm, đen, nâu đất (bình dân); the, lụa màu nhẹ (khá giả)',
    culturalMeaning: 'Biểu tượng người phụ nữ Bắc Bộ cần cù, duyên dáng, giản dị. Hai vạt trước tượng trưng sự gắn kết.',
    suitableOccasions: 'Lễ hội Bắc Bộ, Tết, chụp ảnh dân gian, múa hát quan họ.',
    imageNote: 'Ảnh thiếu nữ Bắc Bộ mặc tứ thân + nón quai thao + yếm.',
    imageUrl: imgTuThan,
    dynasty: 'Thời Lý – Trần đến hết thời Nguyễn',
    collarType: 'Bốn vạt thắt lưng hoặc buông tự do',
    collarShape: 'tied',
    accentColor: '#9A5B32',
    defaultFabrics: ['The mỏng', 'Đũi tơ mộc', 'Lụa tơ']
  },

  // 6. Áo Bà Ba
  {
    id: 'ao-ba-ba',
    orderNumber: 6,
    name: 'Áo Bà Ba',
    aliasName: 'Áo bà ba Nam Bộ',
    origin: 'Xuất hiện cuối thế kỷ 19 tại Nam Bộ, phù hợp khí hậu nóng và đời sống sông nước.',
    designFeatures: [
      'Áo ngắn hoặc dài vừa, cổ tròn hoặc cổ tim',
      'Cài nút giữa trước ngực',
      'Tay dài hoặc ngắn, xẻ hai bên hông',
      'Mặc với quần dài ống đứng'
    ],
    primaryColors: 'Đen, trắng, bà ba flash (sọc), màu pastel nhẹ',
    culturalMeaning: 'Biểu tượng người dân Nam Bộ giản dị, cần cù, gần gũi với thiên nhiên sông nước.',
    suitableOccasions: 'Lễ hội miền Nam, đời thường, chụp ảnh dân dã, sự kiện vui vẻ.',
    imageNote: 'Ảnh áo bà ba đen/trắng, nền sông nước hoặc vườn.',
    imageUrl: imgAoBaBa,
    dynasty: 'Dân gian Nam Bộ (Cuối thế kỷ 19)',
    collarType: 'Cổ tròn hoặc cổ tim, cài nút giữa',
    collarShape: 'round',
    accentColor: '#704214',
    defaultFabrics: ['Lãnh Mỹ A', 'Lụa Tân Châu', 'Đũi mềm']
  },

  // 7. Áo Giao Lĩnh (Áo Tràng Vạt)
  {
    id: 'giao-linh',
    orderNumber: 7,
    name: 'Áo Giao Lĩnh (Áo Tràng Vạt)',
    aliasName: 'Áo đối lĩnh, Áo giao lãnh',
    origin: 'Một trong những kiểu áo cổ nhất, phổ biến từ thời Lý – Trần, tồn tại đến thời Nguyễn (chủ yếu dùng trong lễ phục).',
    designFeatures: [
      'Cổ chéo giao nhau (hình chữ Y)',
      'Hai vạt trước giao nhau, buộc hoặc không buộc',
      'Tay rộng, thân dài'
    ],
    primaryColors: 'Đa dạng theo thời kỳ và tầng lớp',
    culturalMeaning: 'Kiểu áo cổ truyền chuẩn của người Việt trước khi áo ngũ thân thống trị.',
    suitableOccasions: 'Phục dựng lịch sử, lễ hội cổ trang, biểu diễn.',
    imageNote: 'Ảnh cổ phục giao lĩnh cổ chéo rõ ràng.',
    imageUrl: imgGiaoLinh,
    dynasty: 'Thời Lý – Trần – Lê (Đến thời Nguyễn)',
    collarType: 'Cổ chéo giao nhau (hình chữ Y)',
    collarShape: 'crossed',
    accentColor: '#B8860B',
    defaultFabrics: ['Đũi tơ tằm', 'Lụa tơ dệt hoa mờ', 'Thô lanh']
  },

  // 8. Áo Viên Lĩnh (Áo Cổ Tròn)
  {
    id: 'vien-linh',
    orderNumber: 8,
    name: 'Áo Viên Lĩnh (Áo Cổ Tròn)',
    aliasName: 'Áo viên lĩnh, Áo cổ tròn',
    origin: 'Phổ biến song song với Giao Lĩnh qua nhiều triều đại, đặc biệt trong triều phục.',
    designFeatures: [
      'Cổ tròn ôm sát, cài bên phải, thân dài'
    ],
    primaryColors: 'Theo quy định quan phẩm (xanh, tía, đỏ…).',
    culturalMeaning: 'Thường dùng trong triều phục quan lại và hoàng tộc.',
    suitableOccasions: 'Phục dựng triều đình, lễ nghi trang trọng.',
    imageNote: 'Ảnh cổ phục viên lĩnh cổ tròn trang trọng.',
    imageUrl: imgVienLinh,
    dynasty: 'Thời Lý – Trần – Hậu Lê',
    collarType: 'Cổ tròn ôm sát, cài bên phải',
    collarShape: 'round',
    accentColor: '#A0522D',
    defaultFabrics: ['Gấm đoạn', 'Lụa thêu bổ tử', 'Dạ gấm']
  },

  // 9. Yếm + Váy (Trang phục nội)
  {
    id: 'yem-vay',
    orderNumber: 9,
    name: 'Yếm + Váy (Trang phục nội)',
    aliasName: 'Yếm và váy, Yếm đào',
    origin: 'Yếm là trang phục nội truyền thống của phụ nữ Việt xưa, mặc trong áo tứ thân hoặc áo dài xưa.',
    designFeatures: [
      'Yếm là áo lót truyền thống của phụ nữ, mặc trong áo tứ thân hoặc áo dài xưa',
      'Váy đen quấn'
    ],
    primaryColors: 'Yếm lụa màu, váy đen',
    culturalMeaning: 'Thể hiện sự kín đáo và tầng lớp trang phục nhiều lớp của người Việt xưa.',
    suitableOccasions: 'Lễ hội dân gian, múa hát quan họ, chụp ảnh nghệ thuật, mặc nội trong áo tứ thân hoặc áo dài xưa.',
    imageNote: 'Ảnh thiếu nữ mặc yếm đào và váy đen quấn kín đáo, duyên dáng.',
    imageUrl: imgYemVay,
    dynasty: 'Cổ truyền dân gian',
    collarType: 'Cổ tròn hoặc cổ thoi buộc sau gáy',
    collarShape: 'tied',
    accentColor: '#C45D48',
    defaultFabrics: ['Lụa Vạn Phúc', 'Lụa đào', 'Vải lĩnh đen']
  }
];
