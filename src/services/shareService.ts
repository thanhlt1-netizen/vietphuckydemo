import { LookbookItem } from '../types/lookbook';
import { OutfitCustomization } from '../types/customization';

/**
 * Bảng từ điển tên gọi Họa tiết truyền thống Việt Nam
 */
export const PATTERN_NAMES_VI: Record<string, string> = {
  plain: 'Trơn Thanh Nhã',
  lotus: 'Hoa Sen Quốc Hoa',
  clouds: 'Vân Mây Cung Đình',
  waves: 'Thủy Ba Sóng Nước',
  crane: 'Hạc Trắng Phiêu Diêu',
  plum_blossom: 'Hoa Mai Ngũ Phúc',
  bamboo: 'Trúc Quân Tử',
  dragon_phoenix: 'Long Phụng Cung Đình',
  dong_son: 'Trống Đồng Đông Sơn',
};

/**
 * Bảng từ điển tên gọi Phụ kiện đương đại Gen Z
 */
export const ACCESSORY_NAMES_VI: Record<string, string> = {
  sunglasses: 'Kính râm retro',
  folding_fan: 'Quạt xếp dát vàng',
  tote_bag: 'Túi tote thổ cẩm',
  sneakers: 'Giày sneaker đương đại',
  pearl_necklace: 'Chuỗi ngọc trai cổ điển',
  hair_flower: 'Hoa cài tóc tơ tằm',
  headphones: 'Tai nghe Y2K',
  baguette_bag: 'Túi kẹp nách baguette',
  beaded_bracelet: 'Vòng chuỗi ngọc ngũ hành',
  bucket_hat: 'Nón bucket thổ cẩm cách tân',
  chunky_boots: 'Bốt chunky streetwear',
};

/**
 * Ánh xạ mã màu Hex sang tên gọi sắc phong hoa cổ điển Việt Nam
 */
export function getVietnameseColorName(hex: string): string {
  if (!hex) return 'Sắc phục truyền thống';
  const clean = hex.toUpperCase().trim();

  // Danh mục màu đặc trưng Việt phục
  const colorMap: Record<string, string> = {
    '#BA7A2A': 'Hoàng kim hổ phách',
    '#D4A043': 'Vàng hoàng cung',
    '#BA8A30': 'Hoàng sa cổ phong',
    '#F3C96B': 'Vàng ánh dương',
    '#C68A1E': 'Hoàng kim cung đình',
    '#B8860B': 'Hoàng thổ Đàng Trong',
    '#BA3424': 'Chu sa cung đình',
    '#872013': 'Hồng điều đại lễ',
    '#A32818': 'Đỏ điều hoàng triều',
    '#C45D48': 'Hồng đào sen thắm',
    '#465A3D': 'Xanh quân phục',
    '#58734D': 'Thanh trúc vương giả',
    '#36472F': 'Lục trầm Thăng Long',
    '#78976A': 'Thanh ngọc bích',
    '#1C140E': 'The thâm huyền bí',
    '#140D08': 'Huyền đen tuyền',
    '#241A13': 'Đen than trầm mặc',
    '#1E1A17': 'The thâm cổ truyền',
    '#FAF7F2': 'Bạch sa tơ tằm',
    '#F0E7D8': 'Bạch tơ ngọc ngà',
    '#FFFFFF': 'Bạch tuyết tinh khôi',
    '#8C6014': 'The thâm vàng đất',
    '#704214': 'Nâu mộc sông nước',
    '#78482E': 'Gụ trầm vương giả',
    '#9A5B32': 'Nâu phù sa Kinh Bắc',
    '#A0522D': 'Tử điều triều phục',
    '#3A506B': 'Lam trầm sông Lam',
    '#5C3D75': 'Tía hoàng tộc',
    '#8B0000': 'Huyết dụ cung đình',
  };

  if (colorMap[clean]) {
    return colorMap[clean];
  }

  // Phân tích RGB gần đúng nếu mã màu tùy biến người dùng tự chọn
  const r = parseInt(clean.slice(1, 3), 16) || 0;
  const g = parseInt(clean.slice(3, 5), 16) || 0;
  const b = parseInt(clean.slice(5, 7), 16) || 0;

  if (r > 200 && g > 200 && b > 200) return 'Bạch sắc (Trắng ngà)';
  if (r < 60 && g < 60 && b < 60) return 'Huyền sắc (Đen trầm)';
  if (r > 160 && g < 80 && b < 80) return 'Chu sa (Đỏ rực)';
  if (r > 180 && g > 130 && b < 90) return 'Hoàng kim (Vàng ấm)';
  if (g > 120 && r < 100 && b < 100) return 'Thanh bích (Xanh lục)';
  if (b > 130 && r < 100 && g < 120) return 'Thanh lam (Xanh biếc)';
  if (r > 120 && g < 90 && b > 110) return 'Tử sắc (Tím quý phái)';
  if (r > 120 && g > 80 && b < 70) return 'Thổ sắc (Nâu đất trầm)';

  return `Sắc mã ${clean}`;
}

export interface CostumeCustomizationDetails {
  primaryRobeColorName: string;
  primaryRobeHex: string;
  innerCollarColorName: string;
  innerCollarHex: string;
  bottomColorName: string;
  bottomHex: string;
  sashColorName: string;
  sashHex: string;
  patternName: string;
  accessoryNames: string[];
  genderText: string;
  culturalNote: string;
}

/**
 * Trích xuất chi tiết bản phối tùy chỉnh của bộ trang phục trong Lookbook
 */
export function extractCustomizationDetails(item: LookbookItem): CostumeCustomizationDetails {
  const parts = item.customizationData?.parts || item.appliedPayload?.customizationColors;
  
  const primaryRobeHex = parts?.primaryRobeColor || '#BA7A2A';
  const innerCollarHex = parts?.innerCollarColor || '#D4A043';
  const bottomHex = parts?.bottomColor || '#F0E7D8';
  const sashHex = parts?.sashColor || '#58734D';

  const patternKey = item.customizationData?.pattern || item.appliedPayload?.pattern || 'lotus';
  const patternName = PATTERN_NAMES_VI[patternKey] || 'Hoa Sen Quốc Hoa';

  const accKeys = item.customizationData?.accessories || item.appliedPayload?.accessories || ['folding_fan'];
  const accessoryNames = accKeys.map((k) => ACCESSORY_NAMES_VI[k] || k);

  const gender = item.gender || item.customizationData?.gender || 'female';
  const genderText = gender === 'female' ? 'Nữ giới' : 'Nam giới';

  const culturalNote = item.culturalNote || item.note || `Trang phục truyền thống ${item.costumeName} mang đậm bản sắc văn hóa Việt Nam.`;

  return {
    primaryRobeColorName: getVietnameseColorName(primaryRobeHex),
    primaryRobeHex,
    innerCollarColorName: getVietnameseColorName(innerCollarHex),
    innerCollarHex,
    bottomColorName: getVietnameseColorName(bottomHex),
    bottomHex,
    sashColorName: getVietnameseColorName(sashHex),
    sashHex,
    patternName,
    accessoryNames,
    genderText,
    culturalNote,
  };
}

/**
 * Tạo URL chia sẻ trang phục kèm mã băm định danh bộ đồ
 */
export function generateLookbookShareUrl(item: LookbookItem): string {
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const hash = `#lookbook-item-${item.id}`;
    return `${origin}${pathname}${hash}`;
  } catch {
    return `https://vietphucki.app#lookbook-item-${item.id}`;
  }
}

/**
 * Tạo bài viết/caption hoàn chỉnh mang đậm chất Gen Z và tôn trọng văn hóa
 */
export function generateSocialCaption(item: LookbookItem, shareUrl: string, albumName?: string): string {
  const details = extractCustomizationDetails(item);
  const albumText = albumName ? ` [Album: ${albumName}]` : '';

  const accessoriesLine = details.accessoryNames.length > 0 
    ? `\n👑 Phụ kiện Gen Z: ${details.accessoryNames.join(', ')}`
    : '';

  return `🌸 Chiêm ngưỡng tác phẩm "${item.customName}" (${item.costumeName})${albumText} trong Lookbook Việt Phục GenZ!

✨ Bản phối hòa sắc ngũ hành:
- Vạt áo chính: ${details.primaryRobeColorName} (${details.primaryRobeHex})
- Cổ áo / Yếm: ${details.innerCollarColorName} (${details.innerCollarHex})
- Dải thắt lưng: ${details.sashColorName} (${details.sashHex})
- Quần / Váy: ${details.bottomColorName} (${details.bottomHex})
🎨 Họa tiết: ${details.patternName}${accessoriesLine}
📜 Ý nghĩa: "${details.culturalNote}"

👉 Khám phá và tùy phối Việt phục của bạn tại:
${shareUrl}

#VietPhucGenZ #CoPhucVietNam #Lookbook #VietPhucKy #GenZHeritage #TrangPhucTruyenThong`;
}

/**
 * Kiểm tra xem trình duyệt có hỗ trợ Web Share API không
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Kiểm tra xem trình duyệt có hỗ trợ chia sẻ tệp tin hình ảnh qua Web Share API không
 */
export function isWebShareFilesSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.canShare === 'function';
}

/**
 * Chuyển đổi URL hoặc Data URL thành File đối tượng để đính kèm vào Web Share API
 */
export async function urlToFile(urlOrDataUrl: string, filename: string): Promise<File | null> {
  try {
    if (!urlOrDataUrl) return null;

    if (urlOrDataUrl.startsWith('data:')) {
      const arr = urlOrDataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }

    // Nếu là URL tĩnh / blob
    const response = await fetch(urlOrDataUrl, { mode: 'cors' });
    const blob = await response.blob();
    const type = blob.type || 'image/jpeg';
    return new File([blob], filename, { type });
  } catch (err) {
    console.warn('Không thể chuyển đổi ảnh thành File cho Web Share:', err);
    return null;
  }
}

export type WebShareResult = 
  | { success: true; method: 'web-share'; fileAttached: boolean }
  | { success: false; method: 'cancelled' }
  | { success: false; method: 'unsupported' | 'error'; error: string };

/**
 * Thực thi chia sẻ tác phẩm tùy chỉnh qua Web Share API
 */
export async function shareCustomizationViaWebShare(
  item: LookbookItem,
  albumName?: string
): Promise<WebShareResult> {
  if (!isWebShareSupported()) {
    return {
      success: false,
      method: 'unsupported',
      error: 'Trình duyệt của bạn không hỗ trợ Web Share API trực tiếp.',
    };
  }

  const shareUrl = generateLookbookShareUrl(item);
  const caption = generateSocialCaption(item, shareUrl, albumName);
  const title = `[Việt Phục GenZ] Tác phẩm "${item.customName}" · ${item.costumeName}`;

  try {
    const shareData: ShareData = {
      title,
      text: caption,
      url: shareUrl,
    };

    let fileAttached = false;
    // Thử đính kèm file ảnh nếu Web Share Files được hỗ trợ
    if (isWebShareFilesSupported() && item.imageUrl) {
      try {
        const file = await urlToFile(item.imageUrl, `vietphuc-${item.costumeId}-${Date.now()}.jpg`);
        if (file && navigator.canShare({ files: [file] })) {
          shareData.files = [file];
          fileAttached = true;
        }
      } catch (fErr) {
        console.warn('Bỏ qua đính kèm ảnh Web Share:', fErr);
      }
    }

    await navigator.share(shareData);
    return { success: true, method: 'web-share', fileAttached };
  } catch (err: any) {
    if (err && (err.name === 'AbortError' || err.message?.includes('AbortError') || err.message?.includes('canceled'))) {
      return { success: false, method: 'cancelled' };
    }

    console.warn('Lỗi khi gọi Web Share API:', err);
    return {
      success: false,
      method: 'error',
      error: err?.message || 'Không thể mở hộp thoại chia sẻ của hệ thống.',
    };
  }
}

/**
 * Sao chép văn bản vào bộ nhớ đệm
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export interface SocialDirectLink {
  id: string;
  name: string;
  url: string;
  iconType: 'facebook' | 'zalo' | 'twitter' | 'telegram' | 'whatsapp' | 'pinterest';
  color: string;
  badgeText: string;
}

/**
 * Tạo danh sách các đường dẫn chia sẻ trực tiếp lên các mạng xã hội phổ biến
 */
export function getSocialDirectLinks(
  item: LookbookItem,
  shareUrl: string,
  caption: string
): SocialDirectLink[] {
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(caption);
  const encodedShortText = encodeURIComponent(
    `Chiêm ngưỡng tác phẩm "${item.customName}" (${item.costumeName}) trong Lookbook Việt Phục GenZ!`
  );
  const encodedImage = encodeURIComponent(item.imageUrl || '');

  return [
    {
      id: 'facebook',
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      iconType: 'facebook',
      color: '#1877F2',
      badgeText: 'Bảng tin & Nhóm',
    },
    {
      id: 'zalo',
      name: 'Zalo',
      url: `https://sp.zalo.me/share_inline?link=${encodedUrl}`,
      iconType: 'zalo',
      color: '#0068FF',
      badgeText: 'Tin nhắn & Nhật ký',
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      url: `https://twitter.com/intent/tweet?text=${encodedShortText}&url=${encodedUrl}&hashtags=VietPhucGenZ,CoPhucVietNam`,
      iconType: 'twitter',
      color: '#000000',
      badgeText: 'Đăng Tweet',
    },
    {
      id: 'telegram',
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      iconType: 'telegram',
      color: '#24A1DE',
      badgeText: 'Gửi tin nhắn',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      iconType: 'whatsapp',
      color: '#25D366',
      badgeText: 'Trò chuyện',
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedShortText}`,
      iconType: 'pinterest',
      color: '#E60023',
      badgeText: 'Ghim bộ ảnh',
    },
  ];
}
