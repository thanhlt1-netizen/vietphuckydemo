import { OutfitCustomization, GenderType, TryOnRequestPayload } from './customization';

export type LookbookSourceType = 'design' | 'tryon';

export interface LookbookItem {
  id: string;
  albumId: string;
  type: LookbookSourceType;            // Phân biệt rõ nguồn: 'design' (Tùy chỉnh) hoặc 'tryon' (Thử đồ ảo)
  customName: string;                  // Tên do người dùng đặt cho bộ
  costumeName: string;                 // Tên loại Việt phục
  costumeId: string;                   // Mã định danh Việt phục
  imageUrl: string;                    // Ảnh đúng hiện tại (base64 hoặc URL)
  portraitUrl?: string;                // Ảnh chân dung người dùng (nếu có từ Try-on)
  savedAt: string;                     // Thời gian lưu
  customizationData?: OutfitCustomization; // Dữ liệu màu sắc, hoa văn nếu là Design
  gender?: GenderType;
  culturalNote?: string;
  stylingNote?: string;
  note?: string;
  appliedPayload?: TryOnRequestPayload;
}

export interface LookbookAlbum {
  id: string;
  name: string;                        // Tên album (ví dụ: "Cưới hỏi truyền thống", "Đi chơi Tết")
  description?: string;                // Mô tả album
  createdAt: string;
  updatedAt?: string;
  coverImageUrl?: string;              // Ảnh bìa đại diện
  items: LookbookItem[];               // Danh sách các bộ trong album
}

// Backward compatibility types
export type LookbookDesignItem = LookbookItem & { type: 'design' };
export type LookbookTryOnItem = LookbookItem & { type: 'tryon' };
export type LookbookTab = 'albums' | 'design' | 'tryon';
