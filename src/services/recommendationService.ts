import { ContextSelection, RecommendedCostume } from '../types/context';
import { VIET_PHUC_LIST, VietPhucItem } from '../data/vietphucData';

export interface BaseCostume extends VietPhucItem {
  originNote: string; // Đồng bộ alias cho origin
  baseScore: number;
}

/**
 * KHO DỮ LIỆU 9 BỘ VIỆT PHỤC CHUẨN MỰC
 * Nguồn dữ liệu duy nhất và bắt buộc lấy 100% từ vietphuc.md
 */
export const COSTUME_DATABASE: BaseCostume[] = VIET_PHUC_LIST.map((item) => ({
  ...item,
  aliasName: item.aliasName || '',
  originNote: item.origin,
  baseScore: item.id === 'ao-dai' ? 95 : item.id === 'nhat-binh' ? 94 : item.id === 'ao-tac' ? 93 : item.id === 'ngu-than' ? 92 : 90,
}));

/**
 * Danh sách toàn bộ 9 bộ Việt phục chuẩn mực từ vietphuc.md
 * Hiển thị đầy đủ cả 9 bộ khi người dùng chưa chọn bối cảnh hoặc muốn xem toàn bộ kho phục trang.
 */
export const DEFAULT_FEATURED_COSTUMES: RecommendedCostume[] = COSTUME_DATABASE.map(
  (c, idx) => ({
    id: c.id,
    name: c.name,
    aliasName: c.aliasName,
    dynasty: c.dynasty,
    collarType: c.collarType,
    accentColor: c.accentColor,
    collarShape: c.collarShape,
    matchScore: c.baseScore,
    recommendationReason: `Phù hợp: ${c.suitableOccasions}`,
    recommendedFabrics: c.defaultFabrics,
    designFeatures: c.designFeatures,
    primaryColors: c.primaryColors,
    culturalMeaning: c.culturalMeaning,
    suitableOccasions: c.suitableOccasions,
    imageUrl: c.imageUrl,
    originNote: c.origin,
    imageNote: c.imageNote,
    isBestMatch: idx === 0,
  })
);

/**
 * THUẬT TOÁN GỢI Ý BỐI CẢNH (Mùa + Khu vực + Sự kiện)
 * Yêu cầu:
 * - Chỉ gợi ý TỐI ĐA 3 bộ phù hợp nhất.
 * - Xác định và đánh dấu rõ BỘ PHÙ HỢP NHẤT (isBestMatch = true).
 * - Ưu tiên tuyệt đối những bộ có mục "Phù hợp" khớp với lựa chọn của người dùng.
 * - Mọi thông tin hiển thị lấy đúng 100% từ vietphuc.md.
 */
export async function recommendCostumes(
  selection: ContextSelection
): Promise<RecommendedCostume[]> {
  // Giả lập thời gian tra cứu điển chế AI nhẹ nhàng (450ms)
  await new Promise((resolve) => setTimeout(resolve, 450));

  const { season, region, eventId } = selection;

  const scoredList = COSTUME_DATABASE.map((item) => {
    let score = item.baseScore;
    let matchReasons: string[] = [];

    const suitable = item.suitableOccasions.toLowerCase();

    // 1. ĐỐI CHIẾU KHU VỰC VĂN HÓA VỚI MỤC "PHÙ HỢP" (Trọng số lớn)
    if (region === 'north') {
      if (suitable.includes('bắc bộ') || item.id === 'tu-than' || item.id === 'yem-vay') {
        score += 25;
        matchReasons.push('Đặc trưng phụ nữ Bắc Bộ ngàn năm văn hiến');
      } else if (suitable.includes('mọi miền') || item.id === 'ao-dai') {
        score += 15;
        matchReasons.push('Quốc phục phù hợp mọi miền non sông');
      } else if (item.id === 'giao-linh' || item.id === 'vien-linh') {
        score += 18;
        matchReasons.push('Tiêu biểu thời Lý – Trần – Lê đất kinh kỳ Thăng Long');
      }
    } else if (region === 'central') {
      if (suitable.includes('miền trung') || suitable.includes('cung đình') || item.id === 'nhat-binh' || item.id === 'ao-tac' || item.id === 'ngu-than') {
        score += 28;
        matchReasons.push('Chuẩn mực lễ nhạc và y phục cung đình miền Trung – triều Nguyễn');
      } else if (suitable.includes('mọi miền') || item.id === 'ao-dai') {
        score += 15;
        matchReasons.push('Thướt tha, trang nhã hài hòa nét trầm mặc cố đô');
      }
    } else if (region === 'south') {
      if (suitable.includes('miền nam') || item.id === 'ao-ba-ba') {
        score += 32;
        matchReasons.push('Biểu tượng người dân Nam Bộ gần gũi thiên nhiên sông nước');
      } else if (suitable.includes('trung – nam') || item.id === 'ngu-than') {
        score += 18;
        matchReasons.push('Di sản cải cách y phục Đàng Trong thời Chúa Nguyễn');
      } else if (suitable.includes('mọi miền') || item.id === 'ao-dai') {
        score += 15;
        matchReasons.push('Thanh lịch, hiện đại trong nhịp sống phương Nam');
      }
    }

    // 2. ĐỐI CHIẾU SỰ KIỆN / LỄ HỘI VỚI MỤC "PHÙ HỢP" (Trọng số then chốt)
    switch (eventId) {
      case 'wedding':
        if (suitable.includes('đám cưới') || suitable.includes('cưới hỏi') || suitable.includes('lễ phục')) {
          score += 26;
          if (item.id === 'nhat-binh') matchReasons.push('Lựa chọn hàng đầu cho đám cưới cổ trang quyền quý');
          if (item.id === 'ao-tac') matchReasons.push('Lễ phục trang nghiêm, đoan trang trong hôn lễ truyền thống');
          if (item.id === 'ao-dai') matchReasons.push('Tôn vinh vẻ duyên dáng rạng rỡ của tân nương');
          if (item.id === 'ngu-than') matchReasons.push('Chuẩn mực nghi lễ bái gia tiên');
        } else {
          score -= 15;
        }
        break;

      case 'graduation':
        if (suitable.includes('kỷ yếu') || item.id === 'ao-dai') {
          score += 30;
          matchReasons.push('Biểu tượng học đường thanh tân, lưu giữ mốc kỷ yếu thiêng liêng');
        } else if (suitable.includes('nghệ thuật') || item.id === 'nhat-binh') {
          score += 16;
          matchReasons.push('Bộ ảnh kỷ yếu di sản cổ trang ấn tượng');
        } else if (item.id === 'ao-tac' || item.id === 'ngu-than') {
          score += 14;
          matchReasons.push('Phong thái cử tử, nho sinh khoa bảng xưa');
        }
        break;

      case 'tet':
        if (suitable.includes('tết') || suitable.includes('lễ hội')) {
          score += 24;
          if (item.id === 'ao-dai') matchReasons.push('Sắc màu tươi vui, chuẩn mực du xuân đón tài lộc ngày Tết');
          if (item.id === 'tu-than') matchReasons.push('Đậm không khí Tết hội làng truyền thống miền Bắc');
          if (item.id === 'nhat-binh') matchReasons.push('Vàng son phú quý đón Tết đại cát');
          if (item.id === 'ao-tac' || item.id === 'ngu-than') matchReasons.push('Lễ phục điềm đạm chúc Tết gia tiên');
        }
        break;

      case 'hung-kings':
        if (suitable.includes('lễ hội lớn') || suitable.includes('phục dựng lịch sử') || suitable.includes('lễ nghi trang trọng')) {
          score += 25;
          if (item.id === 'giao-linh') matchReasons.push('Áo cổ truyền chuẩn mực thời Lý – Trần hướng về cội nguồn');
          if (item.id === 'vien-linh') matchReasons.push('Lễ nghi trang trọng, triều phục tế lễ non sông');
          if (item.id === 'ao-tac') matchReasons.push('Lễ phục cao cấp bề thế trong ngày Quốc giỗ');
        }
        break;

      case 'women-day':
        if (item.id === 'ao-dai') {
          score += 25;
          matchReasons.push('Tôn vinh vẻ đẹp duyên dáng, kín đáo mà hiện đại của phụ nữ Việt');
        } else if (item.id === 'tu-than') {
          score += 22;
          matchReasons.push('Tôn vinh người phụ nữ Việt cần cù, duyên dáng, giàu đức hy sinh');
        } else if (item.id === 'ao-ba-ba') {
          score += 20;
          matchReasons.push('Nét đẹp chân chất, dịu dàng, đảm đang của phụ nữ Nam Bộ');
        }
        break;

      case 'mid-autumn':
        if (suitable.includes('lễ hội') || suitable.includes('dân gian') || item.id === 'tu-than' || item.id === 'giao-linh' || item.id === 'yem-vay') {
          score += 20;
          matchReasons.push('Hài hòa không khí trăng rằm dân gian thơ mộng');
        }
        break;

      case 'national-day':
      case 'reunification':
        if (suitable.includes('sự kiện trang trọng') || suitable.includes('trang nghiêm') || suitable.includes('lễ phục')) {
          score += 22;
          if (item.id === 'ao-dai') matchReasons.push('Quốc phục tự hào trong ngày đại lễ non sông');
          if (item.id === 'ao-tac' || item.id === 'vien-linh') matchReasons.push('Trang nghiêm, đĩnh đạc trong sự kiện đại lễ');
        }
        break;

      case 'birthday':
        if (suitable.includes('sự kiện vui vẻ') || item.id === 'ao-ba-ba') {
          score += 20;
          matchReasons.push('Gần gũi, thoải mái trong tiệc mừng ấm cúng');
        } else if (item.id === 'ao-dai') {
          score += 18;
          matchReasons.push('Nổi bật và trang nhã trong ngày sinh nhật');
        }
        break;

      case 'local-festival':
        if (suitable.includes('lễ hội') || suitable.includes('dân dã')) {
          score += 22;
          matchReasons.push('Rộn ràng sắc màu ngày hội văn hóa truyền thống');
        }
        break;
    }

    // 3. ĐỐI CHIẾU MÙA & KHÍ HẬU VỚI CHẤT LIỆU, ĐẶC ĐIỂM
    if (season === 'winter') {
      if (item.id === 'ao-tac' || item.id === 'vien-linh' || item.id === 'nhat-binh' || item.id === 'ngu-than') {
        score += 8;
        matchReasons.push('Cấu trúc nhiều lớp, chất liệu the gấm giữ ấm thanh nhã tiết trời đông');
      } else if (item.id === 'ao-ba-ba' || item.id === 'yem-vay') {
        score -= 15; // Không phù hợp trời đông giá lạnh
      }
    } else if (season === 'summer') {
      if (item.id === 'ao-ba-ba') {
        score += 12;
        matchReasons.push('Thoáng mát, tiện vận động trong khí hậu mùa hè');
      } else if (item.id === 'ao-dai') {
        score += 8;
        matchReasons.push('Lụa tơ tằm mềm mát, bay nhẹ trong gió hạ');
      } else if (item.id === 'vien-linh' || item.id === 'ao-tac') {
        score -= 8;
      }
    } else if (season === 'spring') {
      score += 5;
    } else if (season === 'autumn') {
      score += 5;
    }

    // Tổng hợp lý do gợi ý chuẩn xác theo mục "Phù hợp" của vietphuc.md
    let finalReason = matchReasons.length > 0
      ? matchReasons.join('. ') + '.'
      : `Phù hợp: ${item.suitableOccasions}`;

    const matchScore = Math.min(99, Math.max(82, score));

    return {
      id: item.id,
      name: item.name,
      aliasName: item.aliasName,
      dynasty: item.dynasty,
      collarType: item.collarType,
      accentColor: item.accentColor,
      collarShape: item.collarShape,
      matchScore,
      recommendationReason: finalReason,
      recommendedFabrics: item.defaultFabrics,
      designFeatures: item.designFeatures,
      primaryColors: item.primaryColors,
      culturalMeaning: item.culturalMeaning,
      suitableOccasions: item.suitableOccasions,
      imageUrl: item.imageUrl,
      originNote: item.origin,
      imageNote: item.imageNote,
      isBestMatch: false,
    };
  });

  // Sắp xếp giảm dần theo điểm số tương thích
  scoredList.sort((a, b) => b.matchScore - a.matchScore);

  // CHỈ LẤY TỐI ĐA 3 BỘ PHÙ HỢP NHẤT theo đúng yêu cầu đề bài
  const topRecommendations = scoredList.slice(0, 3);

  // Đánh dấu rõ BỘ PHÙ HỢP NHẤT (Top 1)
  if (topRecommendations.length > 0) {
    topRecommendations[0].isBestMatch = true;
  }

  return topRecommendations;
}
