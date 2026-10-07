export type SeasonId = 'spring' | 'summer' | 'autumn' | 'winter';
export type RegionId = 'north' | 'central' | 'south';

export interface EventOption {
  id: string;
  name: string;
  category: 'truyenthong' | 'ngayle' | 'doisong';
  badge?: string;
}

export interface ContextSelection {
  season: SeasonId | string;
  region: RegionId | string;
  eventId?: string;
  eventName?: string;
  occasion?: string;
}

export interface RecommendedCostume {
  id: string;
  name: string;
  aliasName?: string;
  dynasty: string;
  collarType: string;
  accentColor: string;
  collarShape: 'crossed' | 'rectangular' | 'round' | 'buttoned' | 'wide' | 'tied';
  matchScore: number; // 82 - 99
  recommendationReason: string;
  recommendedFabrics: string[];
  designFeatures?: string[];
  primaryColors?: string;
  culturalMeaning?: string;
  suitableOccasions?: string;
  imageUrl?: string;
  originNote?: string;
  imageNote?: string;
  isBestMatch?: boolean;
}

export const SEASONS_LIST: { id: SeasonId; name: string; subtitle: string }[] = [
  { id: 'spring', name: 'Xuân', subtitle: 'Khởi sắc · Ấm áp' },
  { id: 'summer', name: 'Hạ', subtitle: 'Thanh lương · Nắng rực' },
  { id: 'autumn', name: 'Thu', subtitle: 'Dịu êm · Se lạnh' },
  { id: 'winter', name: 'Đông', subtitle: 'Trầm ấm · Sương giá' },
];

export const REGIONS_LIST: { id: RegionId; name: string; subtitle: string }[] = [
  { id: 'north', name: 'Miền Bắc', subtitle: 'Kinh kỳ ngàn năm' },
  { id: 'central', name: 'Miền Trung', subtitle: 'Cung đình cổ kính' },
  { id: 'south', name: 'Miền Nam', subtitle: 'Phóng khoáng sông nước' },
];

export const EVENTS_LIST: EventOption[] = [
  { id: 'tet', name: 'Tết Nguyên Đán', category: 'truyenthong', badge: 'Xuân' },
  { id: 'hung-kings', name: 'Giỗ Tổ Hùng Vương', category: 'truyenthong', badge: '10/3' },
  { id: 'wedding', name: 'Đám Cưới / Hôn Lễ', category: 'doisong', badge: 'Hỷ sự' },
  { id: 'graduation', name: 'Kỷ Yếu Tốt Nghiệp', category: 'doisong', badge: 'Gen Z' },
  { id: 'national-day', name: 'Quốc Khánh 2/9', category: 'ngayle', badge: 'Đại lễ' },
  { id: 'reunification', name: '30/4 & 1/5', category: 'ngayle', badge: 'Kỷ niệm' },
  { id: 'women-day', name: 'Quốc Tế Phụ Nữ 8/3', category: 'ngayle', badge: 'Tôn vinh' },
  { id: 'mid-autumn', name: 'Tết Trung Thu', category: 'truyenthong', badge: 'Trăng rằm' },
  { id: 'birthday', name: 'Sinh Nhật / Tiệc Mừng', category: 'doisong', badge: 'Đương đại' },
  { id: 'local-festival', name: 'Lễ Hội Địa Phương', category: 'truyenthong', badge: 'Dân gian' },
];
