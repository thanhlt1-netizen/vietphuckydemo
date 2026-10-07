/**
 * BẢN MÀU GỐC ĐẶC TRƯNG TỪNG BỘ VIỆT PHỤC (THEO CHUẨN vietphuc.md)
 * Áp dụng tự động khi người dùng chọn bộ trang phục và bước vào màn hình Tùy chỉnh (Atelier).
 */

export interface CostumeColorSpec {
  id: string;
  name: string;
  primaryRobeColor: string;  // Vạt áo chính (theo accentColor chuẩn xác từ VIET_PHUC_LIST)
  innerCollarColor: string;  // Cổ áo / Yếm trong / Nẹp cổ (Vàng hoàng cung #D4A043)
  bottomColor: string;       // Quần dài / Chân váy (Bạch sa tơ tằm #F0E7D8)
  sashColor: string;         // Dải thắt lưng / Nơ buộc (Xanh quân phục #58734D)
  defaultPattern: 'lotus' | 'clouds' | 'waves' | 'crane' | 'plum_blossom' | 'bamboo' | 'dragon_phoenix' | 'dong_son';
  defaultAccessories: string[];
  colorDescription: string;
}

export const TRADITIONAL_COSTUME_DEFAULTS: Record<string, CostumeColorSpec> = {
  // 1. Áo Dài Hiện Đại / Quốc Phục (accentColor: #BA7A2A)
  'ao-dai': {
    id: 'ao-dai',
    name: 'Áo Dài (Áo Dài Hiện Đại / Quốc phục)',
    primaryRobeColor: '#BA7A2A', // Hoàng kim hổ phách chuẩn mực từ VIET_PHUC_LIST
    innerCollarColor: '#D4A043', // Vàng hoàng cung chuẩn gợi ý AI
    bottomColor: '#F0E7D8',      // Bạch sa tơ tằm chuẩn gợi ý AI
    sashColor: '#58734D',        // Xanh quân phục / tre trúc chuẩn gợi ý AI
    defaultPattern: 'lotus',
    defaultAccessories: ['folding_fan'],
    colorDescription: 'Vạt áo hoàng kim hổ phách (#BA7A2A), nẹp cổ vàng hoàng cung (#D4A043), quần bạch sa (#F0E7D8) và thắt lưng xanh quân phục (#58734D) theo chuẩn gợi ý AI.'
  },

  // 2. Áo Ngũ Thân Tay Chẽn (accentColor: #8C6014)
  'ao-ngu-than': {
    id: 'ao-ngu-than',
    name: 'Áo Ngũ Thân (Áo Ngũ Thân Tay Chẽn)',
    primaryRobeColor: '#8C6014', // The thâm / nâu đất Đàng Trong chuẩn mực từ VIET_PHUC_LIST
    innerCollarColor: '#D4A043', // Vàng hoàng cung chuẩn gợi ý AI
    bottomColor: '#F0E7D8',      // Bạch sa tơ tằm chuẩn gợi ý AI
    sashColor: '#58734D',        // Xanh quân phục chuẩn gợi ý AI
    defaultPattern: 'bamboo',
    defaultAccessories: ['folding_fan'],
    colorDescription: 'Vạt áo the thâm vàng đất (#8C6014), cổ lót vàng hoàng cung (#D4A043), quần bạch sa (#F0E7D8) và thắt lưng xanh quân phục (#58734D).'
  },

  // 3. Áo Tấc - Ngũ Thân Tay Thụng (accentColor: #78482E)
  'ao-tac': {
    id: 'ao-tac',
    name: 'Áo Tấc (Áo Ngũ Thân Tay Thụng)',
    primaryRobeColor: '#78482E', // Gụ trầm vương giả từ VIET_PHUC_LIST
    innerCollarColor: '#D4A043', // Vàng hoàng cung chuẩn gợi ý AI
    bottomColor: '#F0E7D8',      // Bạch sa tơ tằm chuẩn gợi ý AI
    sashColor: '#58734D',        // Xanh quân phục chuẩn gợi ý AI
    defaultPattern: 'clouds',
    defaultAccessories: ['folding_fan'],
    colorDescription: 'Vạt áo gụ trầm lễ nghi (#78482E), nẹp cổ vàng hoàng cung (#D4A043), quần bạch sa (#F0E7D8) và thắt lưng xanh quân phục (#58734D).'
  },

  // 4. Áo Nhật Bình Cung Đình (accentColor: #C68A1E)
  'ao-nhat-binh': {
    id: 'ao-nhat-binh',
    name: 'Áo Nhật Bình Cung Đình',
    primaryRobeColor: '#C68A1E', // Hoàng kim cung đình từ VIET_PHUC_LIST
    innerCollarColor: '#D4A043', // Vàng hoàng cung chuẩn gợi ý AI
    bottomColor: '#F0E7D8',      // Bạch sa tơ tằm chuẩn gợi ý AI
    sashColor: '#58734D',        // Xanh quân phục chuẩn gợi ý AI
    defaultPattern: 'dragon_phoenix',
    defaultAccessories: ['folding_fan'],
    colorDescription: 'Vạt áo hoàng kim quý phái (#C68A1E), nẹp cổ chữ nhật vàng hoàng cung (#D4A043), quần bạch sa (#F0E7D8) và đai xanh quân phục (#58734D).'
  },

  // 5. Áo Tứ Thân Bắc Bộ (accentColor: #9A5B32)
  'ao-tu-than': {
    id: 'ao-tu-than',
    name: 'Áo Tứ Thân Bắc Bộ',
    primaryRobeColor: '#9A5B32', // Nâu phù sa Kinh Bắc từ VIET_PHUC_LIST
    innerCollarColor: '#D4A043', // Vàng hoàng cung chuẩn gợi ý AI
    bottomColor: '#F0E7D8',      // Bạch sa tơ tằm chuẩn gợi ý AI
    sashColor: '#58734D',        // Xanh quân phục chuẩn gợi ý AI
    defaultPattern: 'plum_blossom',
    defaultAccessories: ['folding_fan'],
    colorDescription: 'Vạt áo nâu phù sa mộc mạc (#9A5B32), yếm cổ vàng hoàng cung (#D4A043), quần bạch sa (#F0E7D8) và dải thắt lưng xanh quân phục (#58734D).'
  },

  // 6. Áo Bà Ba Nam Bộ (accentColor: #704214)
  'ao-ba-ba': {
    id: 'ao-ba-ba',
    name: 'Áo Bà Ba Nam Bộ',
    primaryRobeColor: '#704214', // Đất mộc mạc sông nước từ VIET_PHUC_LIST
    innerCollarColor: '#D4A043', // Vàng hoàng cung chuẩn gợi ý AI
    bottomColor: '#F0E7D8',      // Bạch sa tơ tằm chuẩn gợi ý AI
    sashColor: '#58734D',        // Xanh quân phục chuẩn gợi ý AI
    defaultPattern: 'lotus',
    defaultAccessories: ['folding_fan'],
    colorDescription: 'Vạt áo đất mộc mạc sông nước (#704214), viền cổ vàng hoàng cung (#D4A043), quần bạch sa (#F0E7D8) và khăn rằn thắt lưng xanh quân phục (#58734D).'
  },

  // 7. Áo Giao Lĩnh - Tràng Vạt (accentColor: #B8860B)
  'ao-giao-linh': {
    id: 'ao-giao-linh',
    name: 'Áo Giao Lĩnh (Áo Tràng Vạt)',
    primaryRobeColor: '#B8860B', // Hoàng sa cổ phong Lý - Trần từ VIET_PHUC_LIST
    innerCollarColor: '#D4A043', // Vàng hoàng cung chuẩn gợi ý AI
    bottomColor: '#F0E7D8',      // Bạch sa tơ tằm chuẩn gợi ý AI
    sashColor: '#58734D',        // Xanh quân phục chuẩn gợi ý AI
    defaultPattern: 'crane',
    defaultAccessories: ['folding_fan'],
    colorDescription: 'Vạt áo trường vạt hoàng sa (#B8860B), cổ vạt chéo chữ Y vàng hoàng cung (#D4A043), quần bạch sa (#F0E7D8) và đai xanh quân phục (#58734D).'
  },

  // 8. Áo Viên Lĩnh - Cổ Tròn (accentColor: #A0522D)
  'ao-vien-linh': {
    id: 'ao-vien-linh',
    name: 'Áo Viên Lĩnh (Áo Cổ Tròn)',
    primaryRobeColor: '#A0522D', // Sienna triều phục từ VIET_PHUC_LIST
    innerCollarColor: '#D4A043', // Vàng hoàng cung chuẩn gợi ý AI
    bottomColor: '#F0E7D8',      // Bạch sa tơ tằm chuẩn gợi ý AI
    sashColor: '#58734D',        // Xanh quân phục chuẩn gợi ý AI
    defaultPattern: 'dong_son',
    defaultAccessories: ['folding_fan'],
    colorDescription: 'Vạt áo tròn thụng sắc sienna uy nghiêm (#A0522D), nẹp cổ vàng hoàng cung (#D4A043), quần bạch sa (#F0E7D8) và đai xanh quân phục (#58734D).'
  },

  // 9. Yếm + Váy - Nội Y Phục (accentColor: #C45D48)
  'yem-vay': {
    id: 'yem-vay',
    name: 'Yếm + Váy (Trang phục nội)',
    primaryRobeColor: '#C45D48', // Hoa sen tơ tằm từ VIET_PHUC_LIST
    innerCollarColor: '#D4A043', // Vàng hoàng cung chuẩn gợi ý AI
    bottomColor: '#F0E7D8',      // Bạch sa tơ tằm chuẩn gợi ý AI
    sashColor: '#58734D',        // Xanh quân phục chuẩn gợi ý AI
    defaultPattern: 'lotus',
    defaultAccessories: ['hair_flower'],
    colorDescription: 'Yếm lụa đào sen thắm (#C45D48), dây buộc cổ vàng hoàng cung (#D4A043), váy bạch sa (#F0E7D8) và dải thắt lưng xanh quân phục (#58734D).'
  }
};

// Khởi tạo alias mapping cho cả key không có tiền tố "ao-"
TRADITIONAL_COSTUME_DEFAULTS['ngu-than'] = TRADITIONAL_COSTUME_DEFAULTS['ao-ngu-than'];
TRADITIONAL_COSTUME_DEFAULTS['nhat-binh'] = TRADITIONAL_COSTUME_DEFAULTS['ao-nhat-binh'];
TRADITIONAL_COSTUME_DEFAULTS['tu-than'] = TRADITIONAL_COSTUME_DEFAULTS['ao-tu-than'];
TRADITIONAL_COSTUME_DEFAULTS['giao-linh'] = TRADITIONAL_COSTUME_DEFAULTS['ao-giao-linh'];
TRADITIONAL_COSTUME_DEFAULTS['vien-linh'] = TRADITIONAL_COSTUME_DEFAULTS['ao-vien-linh'];

/**
 * Chuẩn hóa mã nhận diện costumeId (hỗ trợ cả có tiền tố `ao-` và không có tiền tố)
 */
export function normalizeCostumeKey(rawId: string = ''): string {
  const id = rawId.toLowerCase().trim();
  if (id === 'ao-dai' || id === 'dai') return 'ao-dai';
  if (id === 'ao-ngu-than' || id === 'ngu-than' || id === 'chen') return 'ao-ngu-than';
  if (id === 'ao-tac' || id === 'tac' || id === 'thung') return 'ao-tac';
  if (id === 'ao-nhat-binh' || id === 'nhat-binh') return 'ao-nhat-binh';
  if (id === 'ao-tu-than' || id === 'tu-than') return 'ao-tu-than';
  if (id === 'ao-ba-ba' || id === 'ba-ba') return 'ao-ba-ba';
  if (id === 'ao-giao-linh' || id === 'giao-linh' || id === 'trang-vat') return 'ao-giao-linh';
  if (id === 'ao-vien-linh' || id === 'vien-linh' || id === 'doan-linh') return 'ao-vien-linh';
  if (id === 'yem-vay' || id === 'yem') return 'yem-vay';

  // Fallback matching
  if (id.includes('dai')) return 'ao-dai';
  if (id.includes('ngu')) return 'ao-ngu-than';
  if (id.includes('tac')) return 'ao-tac';
  if (id.includes('nhat')) return 'ao-nhat-binh';
  if (id.includes('tu')) return 'ao-tu-than';
  if (id.includes('ba')) return 'ao-ba-ba';
  if (id.includes('giao')) return 'ao-giao-linh';
  if (id.includes('vien')) return 'ao-vien-linh';
  if (id.includes('yem')) return 'yem-vay';

  return 'ao-nhat-binh';
}

/**
 * Lấy cấu hình màu gốc di sản chuẩn xác cho bất kỳ costumeId nào
 */
export function getCostumeDefaultColors(costumeId: string): CostumeColorSpec {
  const key = normalizeCostumeKey(costumeId);
  return TRADITIONAL_COSTUME_DEFAULTS[key] || TRADITIONAL_COSTUME_DEFAULTS['ao-nhat-binh'];
}
