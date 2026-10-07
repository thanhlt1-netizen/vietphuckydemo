// Nhập hình ảnh gốc của các chất liệu vải cổ truyền Việt Nam
import imgGamThuongUyen from '../assets/images/gam_thuong_uyen_1791003801564.jpg';
import imgLuaVanPhuc from '../assets/images/lua_van_phuc_1791003816943.jpg';
import imgLanhMyA from '../assets/images/lanh_my_a_1791003830311.jpg';
import imgToTamBaoLoc from '../assets/images/to_tam_baoloc_1791003840232.jpg';
import imgThoCamTayBac from '../assets/images/tho_cam_taybac_1791003853565.jpg';
import imgLuaSaNamDinh from '../assets/images/lua_sa_namdinh_1791003869820.jpg';
import imgDuiNamCao from '../assets/images/dui_nam_cao_1791003888520.jpg';

// Nhập các chất liệu vải trong bộ sưu tập gấm lụa cao cấp
import imgGeminiLongVan from '../assets/images/gam_long_van_1791005921127.jpg';
import imgGeminiSenHong from '../assets/images/lua_sen_hong_1791005936458.jpg';
import imgGeminiThuyBa from '../assets/images/gam_thuy_ba_1791005947178.jpg';
import imgChamMyNghiep from '../assets/images/tho_cam_cham_1791005959174.jpg';

// Nhập 5 màu vải đơn sắc (đen, trắng, đỏ, xanh da trời, hồng cánh sen)
import imgVaiDonSacDen from '../assets/images/vai_don_sac_den_1791006815444.jpg';
import imgVaiDonSacTrang from '../assets/images/vai_don_sac_trang_1791006825984.jpg';
import imgVaiDonSacDo from '../assets/images/vai_don_sac_do_1791006836573.jpg';
import imgVaiDonSacXanh from '../assets/images/vai_don_sac_xanh_1791006847601.jpg';
import imgVaiDonSacHong from '../assets/images/vai_don_sac_hong_1791006860850.jpg';

import { PatternType } from '../types/customization';

export interface TraditionalFabric {
  id: string;
  name: string;
  subtitle: string;
  origin: string;
  fullImage: string;
  isSolid?: boolean;
  solidColorHex?: string;
  // Bảng màu sắc mặc định đi kèm với chất liệu vải
  defaultColors: {
    primaryRobeColor: string;
    innerCollarColor: string;
    bottomColor: string;
    sashColor: string;
  };
  defaultPattern: PatternType;
  description: string;
  culturalNote: string;
}

// 5 Màu vải đơn sắc theo yêu cầu: Đen, Trắng, Đỏ, Xanh da trời, Hồng cánh sen
export const SOLID_COLOR_FABRICS: TraditionalFabric[] = [
  {
    id: 'vai-don-sac-den',
    name: 'Vải Đơn Sắc Đen Tuyền',
    subtitle: 'Huyền sắc trang trọng & uy nghiêm',
    origin: 'Vải đơn sắc hiện đại / Huyền sắc di sản',
    fullImage: imgVaiDonSacDen,
    isSolid: true,
    solidColorHex: '#1A1A1A',
    defaultColors: {
      primaryRobeColor: '#1A1A1A', // Đen tuyền huyền sắc
      innerCollarColor: '#F8F9FA', // Bạch ngọc tương phản
      bottomColor: '#111111',      // Đen the
      sashColor: '#BA3424',        // Đỏ chu sa điểm xuyết
    },
    defaultPattern: 'plain',
    description: 'Chất liệu lụa dệt đơn sắc đen tuyền sâu thẳm, bề mặt láng mịn sang trọng, tạo khí chất uy nghi và lịch lãm.',
    culturalNote: 'Màu đen (huyền/thâm) tượng trưng cho phương Bắc, hành Thủy trong ngũ hành, biểu thị sự trang nghiêm, chiều sâu và kín đáo.',
  },
  {
    id: 'vai-don-sac-trang',
    name: 'Vải Đơn Sắc Trắng Tinh',
    subtitle: 'Bạch sa thanh tao & thuần khiết',
    origin: 'Vải đơn sắc hiện đại / Bạch sa tinh khôi',
    fullImage: imgVaiDonSacTrang,
    isSolid: true,
    solidColorHex: '#F8F9FA',
    defaultColors: {
      primaryRobeColor: '#F8F9FA', // Trắng tinh khôi
      innerCollarColor: '#D4A043', // Vàng hoàng cung
      bottomColor: '#FFFFFF',      // Bạch sa
      sashColor: '#58734D',        // Thanh trúc
    },
    defaultPattern: 'plain',
    description: 'Chất liệu lụa dệt đơn sắc trắng tinh khiết thanh tao, sợi tơ óng nhẹ, toát lên vẻ đẹp đoan trang, thuần khiết.',
    culturalNote: 'Màu trắng tượng trưng cho phương Tây, hành Kim, mang ý nghĩa tinh khôi, quang minh chính đại và tinh thần thanh khiết.',
  },
  {
    id: 'vai-don-sac-do',
    name: 'Vải Đơn Sắc Đỏ Thắm',
    subtitle: 'Chu sa son thắm may mắn & đại cát',
    origin: 'Vải đơn sắc hiện đại / Chu sa may mắn',
    fullImage: imgVaiDonSacDo,
    isSolid: true,
    solidColorHex: '#C92A2A',
    defaultColors: {
      primaryRobeColor: '#C92A2A', // Đỏ thắm son
      innerCollarColor: '#D4A043', // Vàng kim
      bottomColor: '#1E1A17',      // Đen the thâm
      sashColor: '#58734D',        // Xanh ngọc bích
    },
    defaultPattern: 'plain',
    description: 'Sắc đỏ thắm son nồng ấm, rực rỡ và tràn đầy sinh khí, chất vải dệt đanh mịn bắt sáng tuyệt đẹp.',
    culturalNote: 'Màu đỏ tượng trưng cho phương Nam, hành Hỏa, biểu tượng của đại cát đại lợi, hỷ sự và vượng khí trường tồn.',
  },
  {
    id: 'vai-don-sac-xanh-da-troi',
    name: 'Vải Đơn Sắc Xanh Da Trời',
    subtitle: 'Thiên thanh trong trẻo & phóng khoáng',
    origin: 'Vải đơn sắc hiện đại / Thiên thanh thanh bình',
    fullImage: imgVaiDonSacXanh,
    isSolid: true,
    solidColorHex: '#4EA8DE',
    defaultColors: {
      primaryRobeColor: '#4EA8DE', // Xanh da trời thiên thanh
      innerCollarColor: '#F8F9FA', // Bạch sa
      bottomColor: '#1E1A17',      // Đen the
      sashColor: '#D4A043',        // Hoàng kim
    },
    defaultPattern: 'plain',
    description: 'Sắc xanh da trời (thiên thanh) dịu mát, thanh thoát như bầu trời thu bao la, mang lại cảm giác trẻ trung và tự do.',
    culturalNote: 'Sắc thiên thanh hòa ái, biểu trưng cho hòa bình, khát vọng và tinh thần phóng khoáng, rất được giới trẻ Gen Z yêu chuộng.',
  },
  {
    id: 'vai-don-sac-hong-canh-sen',
    name: 'Vải Đơn Sắc Hồng Cánh Sen',
    subtitle: 'Quốc hoa ngọt ngào & đằm thắm',
    origin: 'Vải đơn sắc hiện đại / Hồng sen thuần Việt',
    fullImage: imgVaiDonSacHong,
    isSolid: true,
    solidColorHex: '#E05297',
    defaultColors: {
      primaryRobeColor: '#E05297', // Hồng cánh sen
      innerCollarColor: '#F8F9FA', // Bạch ngà
      bottomColor: '#1E1A17',      // Quần đen truyền thống
      sashColor: '#58734D',        // Xanh búp sen
    },
    defaultPattern: 'plain',
    description: 'Sắc hồng cánh sen tươi tắn, dịu ngọt và đằm thắm của quốc hoa Việt Nam, tôn lên nét duyên dáng thanh xuân rạng rỡ.',
    culturalNote: 'Màu hoa sen gắn liền với tâm hồn Việt, biểu trưng cho sự thanh cao "gần bùn mà chẳng hôi tanh mùi bùn", yêu kiều và thanh tú.',
  },
];

export const TRADITIONAL_FABRICS: TraditionalFabric[] = [
  {
    id: 'gam-thuong-uyen',
    name: 'Gấm Thượng Uyển Huế',
    subtitle: 'Đại lễ phục hoàng gia triều Nguyễn',
    origin: 'Hoàng cung Huế',
    fullImage: imgGamThuongUyen,
    defaultColors: {
      primaryRobeColor: '#BA3424', // Đỏ chu sa hoàng triều
      innerCollarColor: '#D4A043', // Vàng hoàng cung
      bottomColor: '#F0E7D8',      // Bạch sa tơ tằm
      sashColor: '#58734D',        // Thanh trúc ngọc bích
    },
    defaultPattern: 'dragon_phoenix',
    description: 'Chất gấm tiến vua dệt tơ tằm cao cấp đan cài chỉ vàng kim thêu Long Phụng và Vân Mây cung đình bề thế.',
    culturalNote: 'Chuyên dùng may Nhật Bình hoàng hậu và Áo Tấc đại lễ cung đình Huế, biểu tượng quyền quý và sự trang nghiêm tối cao.',
  },
  {
    id: 'lua-van-phuc',
    name: 'Lụa Vạn Phúc Hà Đông',
    subtitle: 'Làng nghề dệt lụa ngàn năm tuổi',
    origin: 'Làng lụa Vạn Phúc, Hà Đông',
    fullImage: imgLuaVanPhuc,
    defaultColors: {
      primaryRobeColor: '#BA7A2A', // Hoàng kim hổ phách
      innerCollarColor: '#D4A043', // Vàng hoàng cung
      bottomColor: '#1E1A17',      // The thâm cổ điển
      sashColor: '#58734D',        // Xanh quân phục
    },
    defaultPattern: 'lotus',
    description: 'Dệt nổi hoa văn bông Sen truyền thống chìm nổi trên nền lụa vàng hổ phách óng ả, mềm mại mát lành.',
    culturalNote: 'Lụa Vạn Phúc từng theo thuyền buôn sang Marseille (Pháp) năm 1931, là biểu tượng quốc hồn quốc túy của tơ lụa xứ Đoài.',
  },
  {
    id: 'lanh-my-a',
    name: 'Lãnh Mỹ A Tân Châu',
    subtitle: 'Nữ hoàng tơ tằm huyền thoại Nam Bộ',
    origin: 'Tân Châu, An Giang',
    fullImage: imgLanhMyA,
    defaultColors: {
      primaryRobeColor: '#140D08', // Đen tuyền huyền bí mộc nưa
      innerCollarColor: '#D4A043', // Vàng hoàng cung viền cổ
      bottomColor: '#1E1A17',      // Đen than
      sashColor: '#BA3424',        // Chu sa rực rỡ
    },
    defaultPattern: 'waves',
    description: 'Tơ tằm tự nhiên nhuộm trái mặc nưa hàng trăm lần, đen bóng mịn màng như da thuộc, càng giặt càng bóng đẹp.',
    culturalNote: 'Sản vật độc nhất vô nhị của miền sông nước Cửu Long, xưa kia chỉ dành riêng cho các bậc vương giả và điền chủ giàu sang.',
  },
  {
    id: 'to-tam-baoloc',
    name: 'Tơ Tằm Bảo Lộc',
    subtitle: 'Bạch sa cao nguyên tinh khôi',
    origin: 'Bảo Lộc, Lâm Đồng',
    fullImage: imgToTamBaoLoc,
    defaultColors: {
      primaryRobeColor: '#FAF7F2', // Bạch sa tinh khiết
      innerCollarColor: '#F0E7D8', // Trắng ngà tơ tằm
      bottomColor: '#1E1A17',      // Quần lụa đen huyền thoại
      sashColor: '#D4A043',        // Thắt lưng hoàng kim
    },
    defaultPattern: 'crane',
    description: 'Tơ tằm 100% nguyên chất từ cao nguyên Bảo Lộc, thớ vải nhẹ bẫng tựa sương mai, độ rủ tự nhiên thanh thoát.',
    culturalNote: 'Được mệnh danh là thủ phủ tơ tằm của Việt Nam, cung cấp nguồn tơ lụa thượng hạng xuất khẩu toàn cầu.',
  },
  {
    id: 'tho-cam-taybac',
    name: 'Thổ Cẩm Hoa Ban Tây Bắc',
    subtitle: 'Hoa văn dệt tay hình học chim Lạc',
    origin: 'Vùng cao Tây Bắc',
    fullImage: imgThoCamTayBac,
    defaultColors: {
      primaryRobeColor: '#3A506B', // Chàm thổ cẩm núi rừng
      innerCollarColor: '#BA3424', // Đỏ thổ cẩm
      bottomColor: '#1E1A17',      // Chàm đen
      sashColor: '#D4A043',        // Hoàng thổ
    },
    defaultPattern: 'dong_son',
    description: 'Thổ cẩm dệt khung cửi tay với sợi bông và tơ thô nhuộm chàm, thêu họa tiết hình học quả trám và hoa ban rực rỡ.',
    culturalNote: 'Kết tinh tình yêu và văn hóa của các dân tộc Thái, Mường, H’Mông, mang tinh thần tự do phóng khoáng của núi rừng.',
  },
  {
    id: 'lua-sa-namdinh',
    name: 'Lụa Sa Nha Xá Nam Định',
    subtitle: 'Thanh bích mây ngàn duyên dáng',
    origin: 'Nha Xá, Nam Định',
    fullImage: imgLuaSaNamDinh,
    defaultColors: {
      primaryRobeColor: '#465A3D', // Thanh ngọc bích
      innerCollarColor: '#D4A043', // Vàng hoàng cung
      bottomColor: '#F0E7D8',      // Bạch sa
      sashColor: '#BA8A30',        // Hoàng sa
    },
    defaultPattern: 'clouds',
    description: 'Vải sa dệt mỏng thấu quang nhẹ, lượn sóng vân mây cung đình, tạo cảm giác phiêu bồng tựa thần tiên tiên phong đạo cốt.',
    culturalNote: 'Chất liệu lụa sa cổ xưa bậc nhất vùng đồng bằng sông Hồng, rất được ưa chuộng trong các lễ hội múa hát và tế tự cổ truyền.',
  },
  {
    id: 'dui-nam-cao',
    name: 'Đũi Nam Cao Thái Bình',
    subtitle: 'Nâu phù sa đất mẹ mộc mạc',
    origin: 'Nam Cao, Kiến Xương, Thái Bình',
    fullImage: imgDuiNamCao,
    defaultColors: {
      primaryRobeColor: '#8C6014', // The thâm vàng đất
      innerCollarColor: '#D4A043', // Vàng hoàng cung
      bottomColor: '#F0E7D8',      // Bạch sa tơ tằm
      sashColor: '#58734D',        // Xanh tre trúc
    },
    defaultPattern: 'bamboo',
    description: 'Tơ đũi thô kéo tay thủ công từ kén tằm vụn, giữ nguyên hạt sợi tự nhiên, thấm mồ hôi và mang hơi thở đất mẹ.',
    culturalNote: 'Làng nghề đũi hơn 400 năm, đặc trưng cho tinh thần bình dân, cần cù và mộc mạc của người nông dân Bắc Bộ.',
  },
  {
    id: 'gam-long-van',
    name: 'Gấm Long Vân Hoàng Triều',
    subtitle: 'Rồng cuộn mây ngàn đại lễ phục',
    origin: 'Cung đình Thăng Long - Huế',
    fullImage: imgGeminiLongVan,
    defaultColors: {
      primaryRobeColor: '#D4A043', // Hoàng kim vương triều
      innerCollarColor: '#3A506B', // Lam ngọc tương phản
      bottomColor: '#1E1A17',      // Đen the thâm
      sashColor: '#BA3424',        // Đỏ chu sa
    },
    defaultPattern: 'dragon_phoenix',
    description: 'Chất gấm dệt chỉ vàng kim thêu hoa văn Rồng thiêng ẩn mây (Long Vân) uy nghiêm, lấp lánh ánh kim hoàng thất.',
    culturalNote: 'Y phục triều nghi tôn quý của hoàng tộc và đại thần, thể hiện uy quyền và ước vọng thái bình thịnh trị.',
  },
  {
    id: 'lua-sen-hong',
    name: 'Lụa Sen Hồng Đồng Bằng',
    subtitle: 'Nét duyên thuần khiết xứ Đoài',
    origin: 'Làng dệt Cổ Chất - Hà Đông',
    fullImage: imgGeminiSenHong,
    defaultColors: {
      primaryRobeColor: '#C46D7D', // Hồng cánh sen thanh nhã
      innerCollarColor: '#F0E7D8', // Bạch ngà tinh tế
      bottomColor: '#1E1A17',      // Quần đen truyền thống
      sashColor: '#58734D',        // Xanh búp sen
    },
    defaultPattern: 'lotus',
    description: 'Nền lụa tơ tằm mềm mại ánh sắc hồng phấn cánh sen mùa hạ, dệt chìm hoa văn đóa sen tỏa hương thuần hậu.',
    culturalNote: 'Rất tôn dáng cho Áo Dài nữ sinh và Áo Tứ Thân quan họ, mang lại cảm giác dịu dàng e ấp của thiếu nữ Việt.',
  },
  {
    id: 'gam-thuy-ba',
    name: 'Gấm Sa Thủy Ba Vân Hạc',
    subtitle: 'Sóng biếc hạc bay phiêu bồng',
    origin: 'Thổ cẩm dệt gấm Cổ Đô',
    fullImage: imgGeminiThuyBa,
    defaultColors: {
      primaryRobeColor: '#4A7F9D', // Lam bích thiên thanh
      innerCollarColor: '#D4A043', // Vàng hoàng cung
      bottomColor: '#F0E7D8',      // Bạch sa tơ tằm
      sashColor: '#8C6014',        // Hoàng thổ cổ
    },
    defaultPattern: 'waves',
    description: 'Họa tiết Thủy Ba (sóng nước tầng lớp) phối ngẫu cùng Vân Hạc trên nền gấm tơ xanh ngọc lam cao quý, óng ả bắt sáng.',
    culturalNote: 'Đặc trưng trang phục mệnh phụ và lễ quan, biểu trưng cho phúc thọ vô biên và non sông gấm vóc.',
  },
  {
    id: 'tho-cam-cham',
    name: 'Thổ Cẩm Chăm Mỹ Nghiệp',
    subtitle: 'Nghệ thuật dệt tay ngàn năm huyền bí',
    origin: 'Làng Mỹ Nghiệp, Ninh Thuận',
    fullImage: imgChamMyNghiep,
    defaultColors: {
      primaryRobeColor: '#875638', // Nâu đất nung Champa
      innerCollarColor: '#BA3424', // Đỏ thổ cẩm
      bottomColor: '#1E1A17',      // Chàm đen
      sashColor: '#D4A043',        // Hoàng thổ
    },
    defaultPattern: 'dong_son',
    description: 'Thổ cẩm dệt thoi gỗ cổ truyền từ sợi bông nhuộm thảo mộc tự nhiên, họa tiết quả trám, chim công và vân đá Champa cổ kính.',
    culturalNote: 'Di sản văn hóa phi vật thể quý báu của đồng bào Chăm, kết tinh kỹ thuật xe sợi dệt hoa văn nổi hai mặt độc nhất vô nhị.',
  },
];

// Danh sách vải tổng hợp trong tính năng Tự Phối Màu: 5 màu vải đơn sắc (đen, trắng, đỏ, xanh da trời, hồng cánh sen) + toàn bộ vải cổ truyền
export const ALL_CUSTOM_FABRICS: TraditionalFabric[] = [
  ...SOLID_COLOR_FABRICS,
  ...TRADITIONAL_FABRICS,
];
