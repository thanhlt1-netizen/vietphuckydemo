import { RecommendedCostume, ContextSelection } from '../types/context';
import { COSTUME_DATABASE, DEFAULT_FEATURED_COSTUMES, recommendCostumes } from './recommendationService';

const SELECTED_COSTUME_KEY = 'vietphuc_selected_costume';
const RECENT_RECOMMENDATIONS_KEY = 'vietphuc_recommendations';
const CONTEXT_KEY = 'vietphuc_context';

/**
 * Service quản lý dữ liệu và logic cho Màn hình Phục Trang (Sanctuary Realm)
 */
export class CostumeService {
  /**
   * Lưu trang phục đã chọn vào localStorage
   */
  static saveSelectedCostume(costume: RecommendedCostume): void {
    try {
      localStorage.setItem(SELECTED_COSTUME_KEY, JSON.stringify(costume));
    } catch (e) {
      console.warn('Không thể lưu trang phục vào localStorage:', e);
    }
  }

  /**
   * Đọc trang phục đã chọn gần nhất
   */
  static getSelectedCostume(): RecommendedCostume | null {
    try {
      const data = localStorage.getItem(SELECTED_COSTUME_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Đọc bối cảnh đã lưu
   */
  static getSavedContext(): ContextSelection | null {
    try {
      const data = localStorage.getItem(CONTEXT_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Lấy danh sách phục trang hiển thị cho màn hình Phục Trang:
   * 1. Ưu tiên danh sách gợi ý nhận từ Bối Cảnh.
   * 2. Nếu chưa có, tự động kiểm tra xem có bối cảnh đã lưu không để tính toán.
   * 3. Nếu không có bối cảnh, trả về danh sách 5 bộ tiêu biểu mặc định.
   */
  static async loadCostumesForDisplay(
    providedRecommendations?: RecommendedCostume[],
    providedContext?: ContextSelection | null
  ): Promise<{
    costumes: RecommendedCostume[];
    isDefaultFallback: boolean;
  }> {
    // 1. Nếu đã có sẵn danh sách gợi ý hợp lệ (tối đa 3-4 bộ theo bối cảnh)
    if (providedRecommendations && providedRecommendations.length > 0) {
      return {
        costumes: providedRecommendations.slice(0, 4),
        isDefaultFallback: false,
      };
    }

    // 2. Thử đọc từ localStorage
    try {
      const savedRecsStr = localStorage.getItem(RECENT_RECOMMENDATIONS_KEY);
      if (savedRecsStr) {
        const parsed = JSON.parse(savedRecsStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return {
            costumes: parsed.slice(0, 4),
            isDefaultFallback: false,
          };
        }
      }
    } catch {
      // ignore
    }

    // 3. Nếu có context mà chưa có recommendations, tính toán lại
    const context = providedContext || this.getSavedContext();
    if (context) {
      const computed = await recommendCostumes(context);
      try {
        localStorage.setItem(RECENT_RECOMMENDATIONS_KEY, JSON.stringify(computed));
      } catch {
        // ignore
      }
      return {
        costumes: computed.slice(0, 4),
        isDefaultFallback: false,
      };
    }

    // 4. Trường hợp không có dữ liệu bối cảnh -> mặc định hiển thị top 3 bộ tiêu biểu gợi ý
    return {
      costumes: DEFAULT_FEATURED_COSTUMES.slice(0, 3),
      isDefaultFallback: true,
    };
  }

  /**
   * Lấy toàn bộ 9 bộ Việt phục chuẩn mực có sẵn từ kho dữ liệu vietphuc.md
   */
  static getAllCostumes(): RecommendedCostume[] {
    return DEFAULT_FEATURED_COSTUMES;
  }

  /**
   * Lấy chi tiết thông tin văn hóa của một bộ trang phục theo ID
   */
  static getCostumeById(id: string) {
    return COSTUME_DATABASE.find((c) => c.id === id) || null;
  }
}
