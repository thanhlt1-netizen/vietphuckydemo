import { TryOnRecord, OutfitCustomization, TryOnRequestPayload } from '../types/customization';
import { COSTUME_DATABASE } from './recommendationService';
import { LookbookService } from './lookbookService';
import { normalizeCostumeKey } from '../data/costumeDefaults';

import femaleModelImg from '../assets/images/tryon_model_female_1790437152136.jpg';
import maleModelImg from '../assets/images/tryon_model_male_1790437165820.jpg';

export const PRESET_PORTRAITS = [
  {
    id: 'preset_female_1',
    name: 'Mai Linh (Nữ)',
    gender: 'female' as const,
    imageUrl: femaleModelImg,
    description: 'Chân dung nữ thanh tú, phong cách hiện đại',
  },
  {
    id: 'preset_male_1',
    name: 'Minh Quân (Nam)',
    gender: 'male' as const,
    imageUrl: maleModelImg,
    description: 'Chân dung nam đĩnh đạc, nét mặt Á Đông',
  },
];

export class TryOnService {
  /**
   * Tổng hợp ảnh Thử Đồ Ảo (Virtual Try-on)
   * Giữ nguyên khuôn mặt, tóc, tỷ lệ cơ thể và tư thế người dùng.
   * Truyền trọn vẹn context dữ liệu: ảnh chân dung, tên Việt phục, toàn bộ 4 màu tùy biến,
   * họa tiết, phụ kiện Gen Z và ảnh mockup reference.
   */
  static async synthesizeTryOn(
    arg1: TryOnRequestPayload | string,
    arg2?: string | ((step: string, pct: number) => void),
    arg3?: OutfitCustomization | null,
    arg4?: (step: string, pct: number) => void
  ): Promise<TryOnRecord> {
    let payload: TryOnRequestPayload;
    let onProgress: ((step: string, pct: number) => void) | undefined;

    if (typeof arg1 === 'object') {
      payload = arg1;
      onProgress = typeof arg2 === 'function' ? arg2 : undefined;
    } else {
      const userPhotoUrl = arg1;
      const costumeId = typeof arg2 === 'string' ? arg2 : 'ao-tac';
      const customizationSnapshot = arg3;
      onProgress = arg4;

      const costume = COSTUME_DATABASE.find((c) => c.id === costumeId || normalizeCostumeKey(c.id) === normalizeCostumeKey(costumeId)) || COSTUME_DATABASE[0];

      payload = {
        userPortraitUrl: userPhotoUrl,
        costumeId,
        costumeName: customizationSnapshot?.costumeName || costume.name,
        gender: customizationSnapshot?.gender || 'female',
        customizationColors: customizationSnapshot?.parts || {
          primaryRobeColor: costume.accentColor || '#BA3424',
          innerCollarColor: '#D4A043',
          bottomColor: '#F0E7D8',
          sashColor: '#58734D',
        },
        pattern: customizationSnapshot?.pattern || 'lotus',
        patternName: 'Hoa Sen Quốc Hoa',
        accessories: customizationSnapshot?.accessories || [],
        accessoryNames: [],
        referenceMockupUrl: costume.imageUrl,
        timestamp: Date.now(),
      };
    }

    // 1. Phân tích khuôn mặt và tỷ lệ cơ thể chân dung (25%)
    if (onProgress) onProgress('Đang quét và giữ nguyên khuôn mặt Á Đông, tỷ lệ cơ thể...', 25);
    await new Promise((resolve) => setTimeout(resolve, 400));

    // 2. Dựng form dáng đặc trưng của bộ Việt phục và dệt hoa văn (55%)
    if (onProgress) onProgress(`Đang dựng phom dáng chuẩn mực ${payload.costumeName} và dệt hoa văn...`, 55);
    await new Promise((resolve) => setTimeout(resolve, 400));

    // 3. Gọi API AI sinh ảnh thực tế (80%)
    const accCount = payload.accessories.length;
    if (onProgress) onProgress(`AI đang tạo tác diện mạo thực tế với màu sắc và ${accCount} phụ kiện...`, 80);

    // Tìm thông tin bộ trang phục
    const costume = COSTUME_DATABASE.find((c) => c.id === payload.costumeId || normalizeCostumeKey(c.id) === normalizeCostumeKey(payload.costumeId)) || COSTUME_DATABASE[0];
    let resultImageUrl = costume.imageUrl || payload.userPortraitUrl;
    let isDemoMode = true;
    let demoNotice = 'Bản phục dựng mẫu di sản (Chế độ Demo - Chưa tạo tác từ chân dung thực tế)';

    try {
      const response = await fetch('/api/tryon/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPortraitUrl: payload.userPortraitUrl,
          costumeId: payload.costumeId,
          costumeName: payload.costumeName,
          gender: payload.gender,
          customizationColors: payload.customizationColors,
          pattern: payload.pattern,
          patternName: payload.patternName,
          accessories: payload.accessories,
          accessoryNames: payload.accessoryNames,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.imageUrl && data.imageUrl.length > 50) {
          resultImageUrl = data.imageUrl;
          // Chỉ coi là AI thành công thực tế nếu không phải là heritage fallback
          if (!data.isHeritageFallback && data.modelUsed && !data.isHeritageFallback) {
            isDemoMode = false;
            demoNotice = '';
          }
        }
      } else {
        console.warn('API /api/tryon/generate trả về mã lỗi:', response.status);
      }
    } catch (apiErr) {
      console.warn('Lỗi gọi API Thử Đồ Ảo, dùng ảnh chất lượng cao chuẩn di sản:', apiErr);
    }

    const colorDesc = `Áo ${payload.customizationColors.primaryRobeColor} · Cổ/Yếm ${payload.customizationColors.innerCollarColor} · Quần/Váy ${payload.customizationColors.bottomColor}`;
    const accDesc = payload.accessoryNames && payload.accessoryNames.length > 0 
      ? `Phối cùng: ${payload.accessoryNames.join(', ')}` 
      : 'Phong cách thanh nhã';

    const record: TryOnRecord = {
      id: `tryon_${Date.now()}`,
      costumeId: costume.id,
      costumeName: payload.costumeName,
      portraitUrl: payload.userPortraitUrl,
      resultImageUrl,
      gender: payload.gender,
      createdAt: new Date().toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      culturalNote: costume.culturalMeaning,
      stylingNote: `${colorDesc}. ${accDesc}.`,
      appliedPayload: payload,
      isDemoMode,
      demoNotice: isDemoMode ? demoNotice : undefined,
    };

    if (onProgress) {
      if (isDemoMode) {
        onProgress('Đã chuẩn bị bản mẫu di sản tham khảo (Chế độ Demo)', 100);
      } else {
        onProgress('Hoàn tất tạo tác diện mạo thực tế!', 100);
      }
    }

    return record;
  }

  /**
   * Lưu vào Lookbook Try-on mang theo toàn bộ metadata context
   */
  static saveToLookbook(record: TryOnRecord, customName?: string): void {
    LookbookService.saveTryOnItem({
      customName: customName || record.costumeName,
      costumeName: record.costumeName,
      costumeId: record.costumeId,
      imageUrl: record.resultImageUrl,
      portraitUrl: record.portraitUrl,
      gender: record.gender,
      culturalNote: record.culturalNote,
      stylingNote: record.stylingNote,
      appliedPayload: record.appliedPayload,
    });
  }

  /**
   * Đọc danh sách Lookbook
   */
  static getLookbookRecords(): TryOnRecord[] {
    const items = LookbookService.getTryOnItems();
    return items.map((i) => ({
      id: i.id,
      costumeId: i.costumeId,
      costumeName: i.customName || i.costumeName,
      portraitUrl: i.portraitUrl || '',
      resultImageUrl: i.imageUrl,
      gender: i.gender || 'female',
      createdAt: i.savedAt,
      culturalNote: i.culturalNote || '',
      stylingNote: i.stylingNote || '',
      appliedPayload: i.appliedPayload,
    }));
  }

  /**
   * Xóa một mục trong Lookbook
   */
  static removeLookbookRecord(id: string): void {
    LookbookService.deleteTryOnItem(id);
  }

  /**
   * Tải ảnh về máy người dùng
   */
  static downloadImage(imageUrl: string, filename = 'vietphuc-genz-portrait.jpg'): void {
    LookbookService.downloadImage(imageUrl, filename);
  }
}
