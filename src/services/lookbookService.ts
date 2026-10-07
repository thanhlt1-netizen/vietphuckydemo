import { LookbookAlbum, LookbookItem, LookbookDesignItem, LookbookTryOnItem } from '../types/lookbook';
import { OutfitCustomization, TryOnRequestPayload } from '../types/customization';
import { normalizeCostumeKey } from '../data/costumeDefaults';

// Nhập hình ảnh gốc sắc nét của từng loại trang phục truyền thống
import imgAoDai from '../assets/images/ao_dai_genz_1790402927498.jpg';
import imgNguThan from '../assets/images/ao_ngu_than_1790402870411.jpg';
import imgAoTac from '../assets/images/ao_tac_1790402854694.jpg';
import imgNhatBinh from '../assets/images/ao_nhat_binh_1790402840330.jpg';
import imgTuThan from '../assets/images/ao_tu_than_1790402901827.jpg';
import imgAoBaBa from '../assets/images/ao_ba_ba_1790402914999.jpg';
import imgGiaoLinh from '../assets/images/ao_giao_linh_1790402887546.jpg';
import imgVienLinh from '../assets/images/ao_vien_linh_1790402943901.jpg';
import imgYemVay from '../assets/images/yem_vay_vietnam_1790432259646.jpg';
import femaleModelImg from '../assets/images/tryon_model_female_1790437152136.jpg';

/**
 * Bản đồ ánh xạ chính xác 100% hình ảnh cho từng loại trang phục Việt Nam
 */
export const COSTUME_IMAGE_MAP: Record<string, string> = {
  'ao-dai': imgAoDai,
  'ao-ngu-than': imgNguThan,
  'ao-tac': imgAoTac,
  'ao-nhat-binh': imgNhatBinh,
  'ao-tu-than': imgTuThan,
  'ao-ba-ba': imgAoBaBa,
  'ao-giao-linh': imgGiaoLinh,
  'ao-vien-linh': imgVienLinh,
  'yem-vay': imgYemVay,
};

/**
 * Hàm lấy ảnh chuẩn xác theo mã nhận diện costumeId (không bao giờ để trống hoặc sai)
 */
export function getCostumeImage(costumeId: string = ''): string {
  const normalized = normalizeCostumeKey(costumeId);
  return COSTUME_IMAGE_MAP[normalized] || imgNhatBinh;
}

const STORAGE_KEY_ALBUMS = 'vietphuc_lookbook_albums_v2';
const LEGACY_STORAGE_KEY_DESIGN = 'vietphuc_lookbook_design';
const LEGACY_STORAGE_KEY_TRYON = 'vietphuc_lookbook_tryon';

// Dữ liệu mẫu khởi đầu chuẩn mực cho các album (chỉ tạo 1 lần)
const INITIAL_DEMO_ALBUMS: LookbookAlbum[] = [
  {
    id: 'album_royal_court',
    name: 'Cổ Phục Hoàng Triều',
    description: 'Tuyển tập lễ phục cung đình trang nghiêm và quý phái thời Nguyễn',
    createdAt: '27/09/2026 08:30',
    coverImageUrl: imgNhatBinh,
    items: [
      {
        id: 'item_demo_nhatbinh',
        albumId: 'album_royal_court',
        type: 'design',
        customName: 'Dạ Yến Cung Đình',
        costumeName: 'Áo Nhật Bình',
        costumeId: 'ao-nhat-binh',
        imageUrl: imgNhatBinh,
        savedAt: '27/09/2026 09:15',
        customizationData: {
          costumeId: 'ao-nhat-binh',
          costumeName: 'Áo Nhật Bình',
          gender: 'female',
          parts: {
            primaryRobeColor: '#BA3424',
            innerCollarColor: '#D4A043',
            bottomColor: '#F0E7D8',
            sashColor: '#58734D',
          },
          pattern: 'lotus',
          accessories: ['folding_fan', 'pearl_necklace'],
          lastUpdated: Date.now(),
        },
        note: 'Bản phối sắc phục dạ yến hoàng triều, chu sa phối hoàng kim quý phái.',
      },
      {
        id: 'item_demo_aotac',
        albumId: 'album_royal_court',
        type: 'tryon',
        customName: 'Lễ Phục Tràng An',
        costumeName: 'Áo Tấc',
        costumeId: 'ao-tac',
        imageUrl: imgAoTac,
        portraitUrl: femaleModelImg,
        savedAt: '27/09/2026 09:20',
        gender: 'female',
        culturalNote: 'Lễ phục cao cấp thời Nguyễn, tay rộng bề thế trang nghiêm trong ngày đại lễ.',
        stylingNote: 'Dáng áo tấc thanh nhã, cổ đứng kết hợp dải cổ viền ngọc.',
      }
    ],
  },
  {
    id: 'album_genz_vibes',
    name: 'Phong Cách Gen Z',
    description: 'Cách tân hiện đại kết hợp phụ kiện đương đại đầy cá tính',
    createdAt: '27/09/2026 09:00',
    coverImageUrl: imgAoDai,
    items: [
      {
        id: 'item_demo_aodai',
        albumId: 'album_genz_vibes',
        type: 'design',
        customName: 'Áo Dài Dạo Phố Thu',
        costumeName: 'Áo Dài',
        costumeId: 'ao-dai',
        imageUrl: imgAoDai,
        savedAt: '27/09/2026 09:25',
        customizationData: {
          costumeId: 'ao-dai',
          costumeName: 'Áo Dài',
          gender: 'female',
          parts: {
            primaryRobeColor: '#FAF7F2',
            innerCollarColor: '#FFFFFF',
            bottomColor: '#1E1A17',
            sashColor: '#BA3424',
          },
          pattern: 'lotus',
          accessories: ['folding_fan'],
          lastUpdated: Date.now(),
        },
        note: 'Áo dài lụa tơ tằm trắng ngọc, quần lụa đen huyền thoại.',
      }
    ],
  },
  {
    id: 'album_wedding_festive',
    name: 'Lễ Hội & Đám Cưới',
    description: 'Sắc phục đại hỷ, hôn lễ truyền thống và hội làng ngàn năm',
    createdAt: '27/09/2026 09:30',
    coverImageUrl: imgNguThan,
    items: [
      {
        id: 'item_demo_nguthan',
        albumId: 'album_wedding_festive',
        type: 'tryon',
        customName: 'Hôn Lễ Đàng Trong',
        costumeName: 'Áo Ngũ Thân',
        costumeId: 'ao-ngu-than',
        imageUrl: imgNguThan,
        savedAt: '27/09/2026 09:40',
        gender: 'female',
        culturalNote: 'Áo ngũ thân lập lĩnh 5 nút biểu trưng ngũ thường ngay thẳng.',
      }
    ],
  }
];

export class LookbookService {
  /**
   * Định dạng thời gian lưu trữ đẹp mắt chuẩn tiếng Việt
   */
  static formatSavedDate(): string {
    const now = new Date();
    return now.toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  // ==========================================
  // 1. QUẢN LÝ ALBUM / PLAYLIST
  // ==========================================

  /**
   * Lấy danh sách tất cả các Album Lookbook từ localStorage
   */
  static getAlbums(): LookbookAlbum[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ALBUMS);
      if (data !== null) {
        const parsed: LookbookAlbum[] = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }

      // Khởi tạo lần đầu
      let initialAlbums = [...INITIAL_DEMO_ALBUMS];

      // Di chuyển dữ liệu cũ nếu có
      try {
        const legacyDesign = localStorage.getItem(LEGACY_STORAGE_KEY_DESIGN);
        const legacyTryon = localStorage.getItem(LEGACY_STORAGE_KEY_TRYON);
        if (legacyDesign || legacyTryon) {
          const oldDesigns = legacyDesign ? JSON.parse(legacyDesign) : [];
          const oldTryons = legacyTryon ? JSON.parse(legacyTryon) : [];

          if (Array.isArray(oldDesigns) && oldDesigns.length > 0) {
            oldDesigns.forEach((item: any) => {
              if (!initialAlbums[0].items.some((i) => i.id === item.id)) {
                initialAlbums[0].items.push({
                  ...item,
                  albumId: initialAlbums[0].id,
                  type: 'design',
                  imageUrl: item.imageUrl || getCostumeImage(item.costumeId),
                });
              }
            });
          }
          if (Array.isArray(oldTryons) && oldTryons.length > 0) {
            oldTryons.forEach((item: any) => {
              if (!initialAlbums[0].items.some((i) => i.id === item.id)) {
                initialAlbums[0].items.push({
                  ...item,
                  albumId: initialAlbums[0].id,
                  type: 'tryon',
                  imageUrl: item.imageUrl || getCostumeImage(item.costumeId),
                });
              }
            });
          }
        }
      } catch {
        // ignore legacy parse errors
      }

      localStorage.setItem(STORAGE_KEY_ALBUMS, JSON.stringify(initialAlbums));
      return initialAlbums;
    } catch (e) {
      console.warn('Lỗi đọc Lookbook Albums:', e);
      return INITIAL_DEMO_ALBUMS;
    }
  }

  /**
   * Lấy chi tiết một Album theo ID
   */
  static getAlbumById(albumId: string): LookbookAlbum | undefined {
    const albums = this.getAlbums();
    return albums.find((a) => a.id === albumId);
  }

  /**
   * Tạo một Lookbook (album) mới
   */
  static createAlbum(name: string, description?: string): LookbookAlbum {
    const trimmed = name.trim() || 'Lookbook Mới';
    const albums = this.getAlbums();

    const newAlbum: LookbookAlbum = {
      id: `album_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      description: description?.trim() || 'Bộ sưu tập trang phục cá nhân',
      createdAt: this.formatSavedDate(),
      coverImageUrl: undefined,
      items: [],
    };

    const updated = [newAlbum, ...albums];
    try {
      localStorage.setItem(STORAGE_KEY_ALBUMS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Lỗi lưu album mới:', e);
    }
    return newAlbum;
  }

  /**
   * Đổi tên và mô tả của album
   */
  static updateAlbum(albumId: string, newName: string, newDescription?: string): boolean {
    const trimmed = newName.trim();
    if (!trimmed) return false;

    const albums = this.getAlbums();
    const index = albums.findIndex((a) => a.id === albumId);
    if (index === -1) return false;

    albums[index].name = trimmed;
    if (newDescription !== undefined) {
      albums[index].description = newDescription.trim();
    }
    albums[index].updatedAt = this.formatSavedDate();

    try {
      localStorage.setItem(STORAGE_KEY_ALBUMS, JSON.stringify(albums));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Xóa toàn bộ một album
   */
  static deleteAlbum(albumId: string): boolean {
    const albums = this.getAlbums();
    const filtered = albums.filter((a) => a.id !== albumId);
    try {
      localStorage.setItem(STORAGE_KEY_ALBUMS, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  }

  // ==========================================
  // 2. LƯU BỘ TRANG PHỤC VÀO ALBUM (PLAYLIST STYLE)
  // ==========================================

  /**
   * Lưu một bộ trang phục (Design hoặc Try-on) vào album chỉ định
   */
  static saveItemToAlbum(
    albumId: string,
    payload: {
      type: 'design' | 'tryon';
      customName: string;
      costumeName: string;
      costumeId: string;
      imageUrl: string;
      portraitUrl?: string;
      customizationData?: OutfitCustomization;
      gender?: 'female' | 'male';
      culturalNote?: string;
      stylingNote?: string;
      note?: string;
      appliedPayload?: TryOnRequestPayload;
    }
  ): { album: LookbookAlbum; item: LookbookItem } {
    let albums = this.getAlbums();
    let targetAlbum = albums.find((a) => a.id === albumId);

    // Nếu không tìm thấy album chỉ định, tạo hoặc lấy album đầu tiên
    if (!targetAlbum) {
      if (albums.length === 0) {
        targetAlbum = this.createAlbum('Bộ Sưu Tập Của Tôi');
        albums = this.getAlbums();
      } else {
        targetAlbum = albums[0];
      }
    }

    // Đảm bảo ảnh luôn có và chuẩn xác (không bao giờ để trống)
    const validImage = payload.imageUrl && payload.imageUrl.length > 5 
      ? payload.imageUrl 
      : getCostumeImage(payload.costumeId);

    const newItem: LookbookItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      albumId: targetAlbum.id,
      type: payload.type,
      customName: payload.customName.trim() || `${payload.costumeName} Tùy Biến`,
      costumeName: payload.costumeName,
      costumeId: payload.costumeId,
      imageUrl: validImage,
      portraitUrl: payload.portraitUrl,
      savedAt: this.formatSavedDate(),
      customizationData: payload.customizationData,
      gender: payload.gender,
      culturalNote: payload.culturalNote,
      stylingNote: payload.stylingNote,
      note: payload.note,
      appliedPayload: payload.appliedPayload,
    };

    // Đặt lên đầu danh sách items của album
    targetAlbum.items = [newItem, ...(targetAlbum.items || [])];
    // Cập nhật ảnh bìa album nếu chưa có hoặc cập nhật ảnh mới nhất
    targetAlbum.coverImageUrl = validImage;
    targetAlbum.updatedAt = this.formatSavedDate();

    try {
      localStorage.setItem(STORAGE_KEY_ALBUMS, JSON.stringify(albums));
    } catch (e) {
      console.warn('Lỗi lưu mục vào Lookbook album:', e);
    }

    return { album: targetAlbum, item: newItem };
  }

  /**
   * Đổi tên một bộ trang phục trong album
   */
  static updateItemName(albumId: string, itemId: string, newName: string): boolean {
    const trimmed = newName.trim();
    if (!trimmed) return false;

    const albums = this.getAlbums();
    const album = albums.find((a) => a.id === albumId);
    if (!album) return false;

    const item = album.items.find((i) => i.id === itemId);
    if (!item) return false;

    item.customName = trimmed;
    try {
      localStorage.setItem(STORAGE_KEY_ALBUMS, JSON.stringify(albums));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Xóa một bộ trang phục khỏi album
   */
  static deleteItem(albumId: string, itemId: string): boolean {
    const albums = this.getAlbums();
    const album = albums.find((a) => a.id === albumId);
    if (!album) return false;

    album.items = album.items.filter((i) => i.id !== itemId);
    // Cập nhật lại ảnh bìa nếu cần
    if (album.items.length > 0) {
      album.coverImageUrl = album.items[0].imageUrl;
    } else {
      album.coverImageUrl = undefined;
    }

    try {
      localStorage.setItem(STORAGE_KEY_ALBUMS, JSON.stringify(albums));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Lấy tất cả items từ tất cả album (tiện ích lọc tổng hợp)
   */
  static getAllItems(): LookbookItem[] {
    const albums = this.getAlbums();
    const all: LookbookItem[] = [];
    albums.forEach((alb) => {
      if (Array.isArray(alb.items)) {
        all.push(...alb.items);
      }
    });
    return all;
  }

  // ==========================================
  // 3. TIỆN ÍCH TƯƠNG THÍCH NGƯỢC (BACKWARD COMPATIBILITY)
  // ==========================================

  static getDesignItems(): LookbookDesignItem[] {
    return this.getAllItems().filter((i): i is LookbookDesignItem => i.type === 'design');
  }

  static getTryOnItems(): LookbookTryOnItem[] {
    return this.getAllItems().filter((i): i is LookbookTryOnItem => i.type === 'tryon');
  }

  static saveTryOnItem(data: {
    customName?: string;
    costumeName: string;
    costumeId: string;
    imageUrl: string;
    portraitUrl?: string;
    gender?: 'male' | 'female';
    culturalNote?: string;
    stylingNote?: string;
    appliedPayload?: TryOnRequestPayload;
  }): LookbookItem {
    const albums = this.getAlbums();
    let tryonAlbum = albums.find(
      (a) => a.id === 'album_ai_tryon' || a.name.toLowerCase().includes('thử đồ')
    );
    if (!tryonAlbum) {
      tryonAlbum = this.createAlbum('Thử Đồ Ảo AI', 'Bộ sưu tập diện mạo thử đồ ảo AI độc bản');
    }
    const res = this.saveItemToAlbum(tryonAlbum.id, {
      type: 'tryon',
      customName: data.customName || data.costumeName,
      costumeName: data.costumeName,
      costumeId: data.costumeId,
      imageUrl: data.imageUrl,
      portraitUrl: data.portraitUrl,
      gender: data.gender || 'female',
      culturalNote: data.culturalNote,
      stylingNote: data.stylingNote,
      appliedPayload: data.appliedPayload,
    });
    return res.item;
  }

  static deleteTryOnItem(itemId: string): boolean {
    const albums = this.getAlbums();
    for (const album of albums) {
      const found = album.items.find((i) => i.id === itemId);
      if (found) {
        return this.deleteItem(album.id, itemId);
      }
    }
    return false;
  }

  static saveDesignItem(data: {
    customName?: string;
    costumeName: string;
    costumeId: string;
    imageUrl: string;
    customizationData: OutfitCustomization;
    note?: string;
  }): LookbookItem {
    const albums = this.getAlbums();
    let designAlbum = albums.find(
      (a) => a.id === 'album_design' || a.name.toLowerCase().includes('thiết kế') || a.name.toLowerCase().includes('gen z')
    );
    if (!designAlbum) {
      designAlbum = this.createAlbum('Bộ Phối Thiết Kế', 'Bộ sưu tập trang phục tự phối màu và chất liệu');
    }
    const res = this.saveItemToAlbum(designAlbum.id, {
      type: 'design',
      customName: data.customName || data.costumeName,
      costumeName: data.costumeName,
      costumeId: data.costumeId,
      imageUrl: data.imageUrl,
      customizationData: data.customizationData,
      note: data.note,
    });
    return res.item;
  }

  static deleteDesignItem(itemId: string): boolean {
    return this.deleteTryOnItem(itemId);
  }

  // ==========================================
  // 4. TIỆN ÍCH TẢI ẢNH VÀ CHIA SẺ
  // ==========================================

  /**
   * Tải ảnh về thiết bị người dùng
   */
  static downloadImage(imageUrl: string, filename: string): void {
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename || `vietphuc-lookbook-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(imageUrl, '_blank');
    }
  }

  /**
   * Sao chép đường dẫn chia sẻ bộ Việt phục
   */
  static async copyShareLink(item: LookbookItem): Promise<boolean> {
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}#lookbook-item-${item.id}`;
      const textToCopy = `🌸 Chiêm ngưỡng tác phẩm "${item.customName}" (${item.costumeName}) trong Lookbook Việt Phục GenZ: ${shareUrl}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        return true;
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        return ok;
      }
    } catch {
      return false;
    }
  }

  /**
   * Chia sẻ tác phẩm trực tiếp qua Web Share API nếu trình duyệt hỗ trợ
   */
  static async shareViaWebShare(item: LookbookItem, albumName?: string): Promise<{ success: boolean; method: string }> {
    const { shareCustomizationViaWebShare } = await import('./shareService');
    const res = await shareCustomizationViaWebShare(item, albumName);
    return { success: res.success, method: res.method };
  }
}
