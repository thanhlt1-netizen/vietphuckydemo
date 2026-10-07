import { 
  OutfitCustomization, 
  AIEvaluationSummary, 
  CulturalCheckResult, 
  AestheticEvaluationResult 
} from '../types/customization';
import { COSTUME_DATABASE } from './recommendationService';
import { ALL_CUSTOM_FABRICS } from '../data/traditionalFabrics';

/**
 * Bảng màu truyền thống Việt Nam
 */
export const TRADITIONAL_PALETTE = [
  { id: 'chu_sa', name: 'Đỏ Chu Sa', hex: '#BA3424', category: 'am', meaning: 'Hỷ sự, may mắn, vương giả' },
  { id: 'hoang_kim', name: 'Vàng Hoàng Cung', hex: '#D4A043', category: 'am', meaning: 'Quyền quý, hoàng thất, ấm áp' },
  { id: 'thien_thanh', name: 'Xanh Thiên Thanh', hex: '#4A7F9D', category: 'lanh', meaning: 'Khoáng đạt, mây trời, tao nhã' },
  { id: 'quan_phuc', name: 'Xanh Quân Phục', hex: '#58734D', category: 'lanh', meaning: 'Mộc mạc, bền bỉ, tre trúc ngút ngàn' },
  { id: 'phu_sa', name: 'Nâu Đất Phù Sa', hex: '#875638', category: 'trung_tinh', meaning: 'Chân chất, nguồn cội, phù sa châu thổ' },
  { id: 'bach_sa', name: 'Bạch Sa Tơ Tằm', hex: '#F0E7D8', category: 'sang', meaning: 'Thanh tân, tinh khôi, tơ lụa tự nhiên' },
  { id: 'the_tham', name: 'Đen The Thâm', hex: '#221C18', category: 'tram', meaning: 'Uy nghiêm, điềm đạm, nếp cổ phong' },
  { id: 'tim_hue', name: 'Tím Cung Đình Huế', hex: '#6E4562', category: 'quy_phai', meaning: 'Trầm mặc, đoan trang, hoài niệm' },
  { id: 'canh_sen', name: 'Hồng Cánh Sen', hex: '#C46D7D', category: 'duyen_dang', meaning: 'Thuần hậu, duyên dáng thiếu nữ Việt' },
];

/**
 * Danh sách phụ kiện Gen Z cách tân và phụ kiện cổ phong
 */
export const ACCESSORIES_CATALOG = [
  {
    id: 'folding_fan' as const,
    name: 'Quạt Xếp Dát Vàng',
    icon: '🪭',
    era: 'traditional',
    description: 'Quạt nan tre dán giấy dó phết nhũ vàng tao nhã',
    culturalFit: 'Cực kỳ phù hợp với mọi loại cổ phục Việt Nam',
  },
  {
    id: 'pearl_necklace' as const,
    name: 'Chuỗi Ngọc Trai',
    icon: '📿',
    era: 'traditional',
    description: 'Chuỗi ngọc thanh tân tôn vinh đường viền cổ',
    culturalFit: 'Rất tôn dáng cho Áo Dài, Áo Nhật Bình và Áo Tấc',
  },
  {
    id: 'hair_flower' as const,
    name: 'Hoa Cài Tóc Tơ Tằm',
    icon: '🌸',
    era: 'traditional',
    description: 'Hoa đào tơ tằm dệt tay cài lệch mái tóc',
    culturalFit: 'Nét duyên nữ tính cổ điển',
  },
  {
    id: 'headphones' as const,
    name: 'Tai Nghe Y2K Đeo Cổ',
    icon: '🎧',
    era: 'genz',
    description: 'Tai nghe over-ear bạc thời thượng theo trend Gen Z dạo phố',
    culturalFit: 'Xu hướng phối cổ phục streetwear đương đại',
  },
  {
    id: 'sunglasses' as const,
    name: 'Kính Râm Retro',
    icon: '🕶️',
    era: 'genz',
    description: 'Kính mắt gọng kim loại thanh mảnh phong cách Đông Dương',
    culturalFit: 'Phá cách Gen Z hiện đại, thích hợp chụp ảnh đường phố',
  },
  {
    id: 'baguette_bag' as const,
    name: 'Túi Kẹp Nách Baguette',
    icon: '👛',
    era: 'genz',
    description: 'Túi lụa satin nhỏ gọn kẹp nách sành điệu',
    culturalFit: 'Thanh lịch, nhỏ nhắn, tôn dáng áo dài và tứ thân',
  },
  {
    id: 'beaded_bracelet' as const,
    name: 'Vòng Chuỗi Ngũ Hành',
    icon: '🔮',
    era: 'traditional',
    description: 'Vòng đá phong thủy kết hợp hạt ngọc bích tự nhiên',
    culturalFit: 'Mang ý nghĩa bình an, cân bằng ngũ hành',
  },
  {
    id: 'tote_bag' as const,
    name: 'Túi Tote Thổ Cẩm',
    icon: '👜',
    era: 'genz',
    description: 'Túi vải mộc thêu họa tiết kỷ hà dân gian',
    culturalFit: 'Năng động, bảo vệ môi trường, tôn vinh dệt thổ cẩm',
  },
  {
    id: 'bucket_hat' as const,
    name: 'Nón Bucket Thổ Cẩm',
    icon: '👒',
    era: 'genz',
    description: 'Nón vành tròn phối thổ cẩm Tây Bắc phá cách',
    culturalFit: 'Trẻ trung, phóng khoáng, dạo chơi lễ hội ngoài trời',
  },
  {
    id: 'sneakers' as const,
    name: 'Giày Sneaker Streetwear',
    icon: '👟',
    era: 'genz',
    description: 'Giày thể thao đế thấp năng động',
    culturalFit: 'Năng động, di chuyển thuận tiện, hòa nhịp cùng thế hệ mới',
  },
  {
    id: 'chunky_boots' as const,
    name: 'Bốt Chunky Platform',
    icon: '🥾',
    era: 'genz',
    description: 'Bốt cổ lửng đế bánh mì đậm chất Y2K',
    culturalFit: 'Tạo nét cá tính mạnh mẽ khi phối cùng áo ngũ thân hoặc tứ thân',
  },
];

/**
 * Danh sách hoa văn truyền thống
 */
export const PATTERNS_CATALOG = [
  { id: 'plain' as const, name: 'Trơn Thanh Nhã', description: 'Tối giản, khoe trọn bề mặt dệt óng ả của tơ lụa' },
  { id: 'lotus' as const, name: 'Hoa Sen Quốc Hoa', description: 'Biểu tượng của sự thanh cao, thuần khiết thoát tục' },
  { id: 'clouds' as const, name: 'Vân Mây Cung Đình', description: 'Họa tiết tường vân mềm mại thời Lê – Nguyễn' },
  { id: 'waves' as const, name: 'Thủy Ba Sóng Nước', description: 'Họa tiết sóng gầm cổ truyền ở chân tà áo triều phục' },
  { id: 'crane' as const, name: 'Hạc Trắng Phiêu Diêu', description: 'Khí tiết thanh tao, trường thọ của bậc hiền nhân' },
  { id: 'plum_blossom' as const, name: 'Hoa Mai Ngũ Phúc', description: 'Hoa văn mùa xuân biểu trưng may mắn, tài lộc khởi sắc' },
  { id: 'bamboo' as const, name: 'Trúc Quân Tử', description: 'Lá trúc dập chìm tượng trưng cho chí khí kiên định, ngay thẳng' },
  { id: 'dragon_phoenix' as const, name: 'Long Phụng Hoàng Triều', description: 'Họa tiết rồng phượng cung đình lộng lẫy và uy nghi' },
  { id: 'dong_son' as const, name: 'Trống Đồng Đông Sơn', description: 'Họa tiết kỷ hà chim Lạc và mặt trời cội nguồn Văn Lang' },
];

/**
 * Service AI Đánh giá: Thẩm định Văn hóa & Phối màu Thẩm mỹ
 */
export class AIEvaluationService {
  /**
   * Đánh giá toàn diện bản thiết kế trang phục
   */
  static async evaluateOutfit(
    customization: OutfitCustomization
  ): Promise<AIEvaluationSummary> {
    // Giả lập thời gian suy luận AI 700ms tạo cảm giác phân tích điển chế
    await new Promise((resolve) => setTimeout(resolve, 700));

    const costumeInfo = COSTUME_DATABASE.find((c) => c.id === customization.costumeId) || {
      id: customization.costumeId,
      name: customization.costumeName,
      collarType: 'Truyền thống',
      originNote: 'Cổ phục di sản Việt Nam',
    };

    // 1. KIỂM TRA VĂN HÓA (Cultural Compatibility)
    const cultural = this.auditCulturalCompatibility(customization, costumeInfo);

    // 2. ĐÁNH GIÁ THẨM MỸ & MÀU SẮC (Aesthetic Score)
    const aesthetic = this.assessAesthetics(customization, costumeInfo);

    return {
      cultural,
      aesthetic,
      customizationSnapshot: customization,
      evaluatedAt: Date.now(),
    };
  }

  /**
   * Thẩm định văn hóa: Kiểm tra đặc trưng gốc & thuần phong mỹ tục
   */
  private static auditCulturalCompatibility(
    customization: OutfitCustomization,
    costumeInfo: any
  ): CulturalCheckResult {
    const violations: string[] = [];
    const preservedFeatures: string[] = [];
    let isPassed = true;
    let score = 90;

    const { costumeId, accessories, parts, pattern } = customization;

    // Đặc trưng gốc được bảo tồn
    preservedFeatures.push(`Phom dáng ${customization.costumeName} nhận diện chuẩn xác`);
    preservedFeatures.push(`Cổ áo ${costumeInfo.collarType || 'chuẩn mực'} được giữ nguyên vẹn`);

    if (customization.selectedFabricId) {
      const fabric = ALL_CUSTOM_FABRICS.find((f) => f.id === customization.selectedFabricId);
      if (fabric) {
        preservedFeatures.push(`Chất liệu vải: ${fabric.name} (${fabric.origin})`);
      }
    }

    if (pattern !== 'plain') {
      preservedFeatures.push(`Hoa văn ${pattern.toUpperCase()} mang bản sắc mỹ thuật truyền thống`);
    }

    // 1. Kiểm tra quy tắc riêng của từng loại Việt phục:
    if (costumeId === 'ao-tac') {
      // Áo Tấc là lễ phục tế tự cao cấp thời Nguyễn
      if (accessories.includes('sneakers') && accessories.includes('sunglasses')) {
        violations.push(
          'Áo Tấc là lễ phục cung đình trang trọng. Việc đồng thời phối giày sneaker thể thao và kính râm có thể làm giảm bớt tính uy nghiêm của điển chế.'
        );
        score -= 22;
      } else {
        preservedFeatures.push('Tay thụng rộng trang nghiêm bề thế đúng chuẩn áo lễ');
      }
    } else if (costumeId === 'nhat-binh') {
      // Nhật Bình là y phục hoàng gia (Hoàng hậu, Công chúa, Mệnh phụ)
      if (parts.innerCollarColor === parts.primaryRobeColor) {
        // Cổ nhật bình luôn có dải viền hoa văn hoặc nẹp ngũ hành
        violations.push(
          'Cổ áo Nhật Bình cần có sự tương phản trang nhã giữa nẹp cổ to bản và thân áo để làm nổi bật đặc trưng nhật bình.'
        );
        score -= 15;
      } else {
        preservedFeatures.push('Nẹp cổ chữ nhật ngũ hành được phân định rõ ràng');
      }
    } else if (costumeId === 'tu-than') {
      // Áo Tứ Thân Kinh Bắc
      if (parts.bottomColor === '#BA3424' || parts.bottomColor === '#C46D7D') {
        violations.push(
          'Theo truyền thống, Áo Tứ Thân đi cùng váy đen quấn chấm gót để khoe yếm đào bên trong. Váy màu đỏ tươi làm mất đi vẻ đằm thắm mộc mạc của Kinh Bắc.'
        );
        score -= 18;
      } else {
        preservedFeatures.push('Phối yếm trong và tà áo ngoài đúng kết cấu tầng lớp phụ nữ Bắc Bộ');
      }
    } else if (costumeId === 'yem-vay') {
      // Yếm & Váy
      if (accessories.includes('sunglasses') && accessories.includes('tote_bag') && accessories.includes('sneakers')) {
        violations.push(
          'Yếm là trang phục nội cổ truyền. Quá nhiều phụ kiện đường phố hiện đại cùng lúc có nguy cơ gây phản cảm và mất đi sự kín đáo thuần hậu.'
        );
        score -= 25;
      }
    }

    // 2. Kiểm tra độ quá tải phụ kiện Gen Z (Tối đa 2 phụ kiện hiện đại)
    const modernAccessoriesCount = accessories.filter((a) => ['sunglasses', 'sneakers', 'tote_bag'].includes(a)).length;
    if (modernAccessoriesCount > 2) {
      violations.push(
        'Lạm dụng quá nhiều phụ kiện hiện đại cùng lúc khiến tổng thể trang phục bị rối rắm và lấn át linh hồn cổ phục.'
      );
      score -= 15;
    }

    // Quyết định Đạt hay Cần chỉnh sửa
    if (violations.length > 0 && score < 75) {
      isPassed = false;
    }

    const badge = isPassed ? 'Phù hợp văn hóa' : 'Cần chỉnh sửa';

    const feedback = isPassed
      ? `Thiết kế rất đáng khen ngợi! Bạn đã kết hợp hài hòa giữa phom dáng di sản của ${customization.costumeName} với phong cách tươi mới của thế hệ trẻ.`
      : `Bản thiết kế có ý tưởng thú vị nhưng cần điều chỉnh lại một số điểm để đảm bảo tính chuẩn mực và tôn trọng bản sắc Việt phục.`;

    const improvementAdvice = violations.length > 0
      ? `Gợi ý: ${violations.join(' ')} Bạn hãy chỉnh sửa lại ở các mục trên để đạt chuẩn hoàn hảo nhé!`
      : undefined;

    return {
      isPassed,
      badge,
      score: Math.max(60, Math.min(99, score)),
      feedback,
      violations,
      preservedFeatures,
      improvementAdvice,
    };
  }

  /**
   * Đánh giá thẩm mỹ & màu sắc: Hòa hợp màu sắc và phối đồ
   */
  private static assessAesthetics(
    customization: OutfitCustomization,
    _costumeInfo: any
  ): AestheticEvaluationResult {
    let colorScore = 8.5;
    let stylingScore = 8.8;
    const actionableSuggestions: string[] = [];

    const { parts, accessories, pattern } = customization;

    // Phân tích độ tương phản giữa Vạt áo ngoài và Quần/Váy
    const isMonochrome = parts.primaryRobeColor === parts.bottomColor;
    if (isMonochrome) {
      colorScore -= 0.6;
      actionableSuggestions.push('Thử đổi màu quần sang trắng ngà hoặc the thâm để tạo nhịp điệu tương phản thanh thoát.');
    } else {
      colorScore += 0.5;
    }

    // Phân tích hòa sắc cổ áo / nẹp viền
    if (parts.innerCollarColor === '#F0E7D8' || parts.innerCollarColor === '#D4A043') {
      colorScore += 0.5; // Điểm cộng cho cổ trắng ngà hoặc chỉ vàng truyền thống
    }

    // Phân tích phụ kiện
    if (accessories.includes('folding_fan')) {
      stylingScore += 0.6;
    }
    if (accessories.includes('pearl_necklace')) {
      stylingScore += 0.5;
    }
    if (accessories.includes('sneakers')) {
      if (customization.costumeId === 'ao-ba-ba' || customization.costumeId === 'ao-dai') {
        stylingScore += 0.4;
      }
    }

    // Hoa văn
    if (pattern !== 'plain') {
      stylingScore += 0.4;
    } else {
      actionableSuggestions.push('Có thể điểm xuyết thêm hoa sen hoặc vân mây để trang phục thêm phần linh động.');
    }

    // Giới hạn thang điểm 10
    colorScore = Math.min(9.8, Math.max(6.5, Math.round(colorScore * 10) / 10));
    stylingScore = Math.min(9.9, Math.max(6.8, Math.round(stylingScore * 10) / 10));

    let overallComment = '';
    if (colorScore >= 9.0 && stylingScore >= 9.0) {
      overallComment = 'Một bản phối vô cùng mãn nhãn! Bảng màu sang trọng, đường nét trang phục khoáng đạt đúng khí chất điện ảnh.';
    } else if (colorScore >= 8.0) {
      overallComment = 'Cách phối màu ấm áp và bắt mắt, giữ được vẻ trang nhã truyền thống mà vẫn trẻ trung, năng động.';
    } else {
      overallComment = 'Bản phối có sự táo bạo nhưng độ tương phản hơi gắt, cân nhắc điều chỉnh lại để tạo chiều sâu cổ trang lắng đọng.';
    }

    return {
      colorHarmonyScore: colorScore,
      stylingScore,
      overallComment,
      actionableSuggestions: actionableSuggestions.slice(0, 2),
    };
  }
}
