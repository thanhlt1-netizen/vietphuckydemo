export type GenderType = 'female' | 'male';

export type PatternType = 
  | 'plain'           // Trơn thanh nhã
  | 'lotus'           // Hoa Sen Quốc Hoa
  | 'clouds'          // Vân Mây Cung Đình
  | 'waves'           // Thủy Ba Sóng Nước
  | 'crane'           // Hạc Trắng Phiêu Diêu
  | 'plum_blossom'    // Hoa Mai Ngũ Phúc
  | 'bamboo'          // Trúc Quân Tử
  | 'dragon_phoenix'  // Long Phụng Cung Đình
  | 'dong_son'        // Họa tiết Trống Đồng Đông Sơn
  | 'custom_canvas';  // Họa tiết Canvas Tự Tạo (Hoa sen, Vân mây, Hoa cúc,...)

export type AccessoryId = 
  | 'sunglasses'       // Kính râm retro
  | 'folding_fan'      // Quạt xếp dát vàng
  | 'tote_bag'         // Túi tote thổ cẩm
  | 'sneakers'         // Giày sneaker đương đại
  | 'pearl_necklace'   // Chuỗi ngọc trai cổ điển
  | 'hair_flower'      // Hoa cài tóc tơ tằm
  | 'headphones'       // Tai nghe Y2K đeo cổ
  | 'baguette_bag'     // Túi kẹp nách baguette
  | 'beaded_bracelet'  // Vòng chuỗi ngọc ngũ hành
  | 'bucket_hat'       // Nón bucket thổ cẩm cách tân
  | 'chunky_boots';    // Bốt chunky streetwear

export interface CustomizationParts {
  primaryRobeColor: string; // Vạt áo ngoài chính (Hex: #rrggbb)
  innerCollarColor: string; // Cổ áo trong / Lớp lót / Yếm
  bottomColor: string;      // Quần / Váy quấn
  sashColor: string;        // Dải thắt lưng / Dải viền
}

export interface OutfitCustomization {
  costumeId: string;
  costumeName: string;
  gender: GenderType;
  parts: CustomizationParts;
  pattern: PatternType;
  accessories: AccessoryId[];
  selectedFabricId?: string;       // Mã nhận diện vải cổ truyền đã chọn
  customFabricImage?: string;      // Ảnh chất liệu vải cổ truyền
  customPatternDataUrl?: string;   // Dữ liệu hình ảnh họa tiết Canvas tự tạo
  customPatternName?: string;      // Tên họa tiết Canvas do người dùng tùy biến
  lastUpdated: number;
}

export interface CulturalCheckResult {
  isPassed: boolean;
  badge: 'Phù hợp văn hóa' | 'Cần chỉnh sửa';
  score: number; // Thang 100
  feedback: string;
  violations: string[];
  preservedFeatures: string[];
  improvementAdvice?: string;
}

export interface AestheticEvaluationResult {
  colorHarmonyScore: number; // Thang 10 (ví dụ: 8.8)
  stylingScore: number;      // Thang 10 (ví dụ: 9.2)
  overallComment: string;
  actionableSuggestions: string[];
}

export interface AIEvaluationSummary {
  cultural: CulturalCheckResult;
  aesthetic: AestheticEvaluationResult;
  customizationSnapshot: OutfitCustomization;
  evaluatedAt: number;
}

export interface TryOnPresetPortrait {
  id: string;
  name: string;
  gender: GenderType;
  imageUrl: string;
  description: string;
}

export interface TryOnRequestPayload {
  userPortraitUrl: string;           // Ảnh chân dung người dùng (hoặc preset)
  costumeId: string;                 // Mã định danh Việt phục
  costumeName: string;               // Tên bộ Việt phục đang chọn
  gender: GenderType;                // Giới tính (female / male)
  customizationColors: CustomizationParts; // Toàn bộ màu sắc tùy chỉnh: vạt áo, cổ áo, quần/váy, thắt lưng
  pattern: PatternType;              // Họa tiết đã chọn
  patternName?: string;
  accessories: AccessoryId[];        // Danh sách phụ kiện Gen Z đã chọn
  accessoryNames?: string[];
  referenceMockupUrl?: string;       // Ảnh mockup / design tham chiếu hiện tại
  timestamp: number;
}

export interface TryOnRecord {
  id: string;
  costumeId: string;
  costumeName: string;
  portraitUrl: string;
  resultImageUrl: string;
  gender: GenderType;
  createdAt: string;
  culturalNote: string;
  stylingNote: string;
  appliedPayload?: TryOnRequestPayload;
  isDemoMode?: boolean;
  demoNotice?: string;
}

export interface CommunityReview {
  id: string;
  author: string;
  comment: string;
  stars: number;
  date: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  authorName: string;
  authorAvatar?: string;
  customization: OutfitCustomization;
  likesCount: number;
  isLiked?: boolean;
  rating?: number;
  ratingCount?: number;
  culturalBadge?: string;
  tags: string[];
  createdAt: string;
  description?: string;
  reviews?: CommunityReview[];
  isMyDesign?: boolean;
}
