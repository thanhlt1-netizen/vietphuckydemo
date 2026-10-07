import React, { useId, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Sun, Moon, Wind } from 'lucide-react';
import { OutfitCustomization, PatternType } from '../../types/customization';
import { normalizeCostumeKey } from '../../data/costumeDefaults';

export const PATTERN_LABELS: Record<PatternType, string> = {
  plain: 'Trơn thanh nhã',
  lotus: 'Hoa Sen Quốc Hoa',
  clouds: 'Vân Mây Cung Đình',
  waves: 'Thủy Ba Sóng Nước',
  crane: 'Hạc Trắng Phiêu Diêu',
  plum_blossom: 'Hoa Mai Ngũ Phúc',
  bamboo: 'Trúc Quân Tử',
  dragon_phoenix: 'Long Phụng Cung Đình',
  dong_son: 'Họa tiết Trống Đồng Đông Sơn',
  custom_canvas: 'Họa Tiết Canvas Tự Tạo',
};
interface Character2DViewerProps {
  customization: OutfitCustomization;
  isEvaluating?: boolean;
}

/**
 * Utility: Tính toán độ sáng/tối để tạo khối chiều sâu và độ bóng cho chất liệu vải (Haute Couture Marker & Watercolor Lighting)
 */
function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return [180, 140, 100];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function shadeColor(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const newR = Math.max(0, Math.min(255, Math.round(r + (t - r) * p)));
  const newG = Math.max(0, Math.min(255, Math.round(g + (t - g) * p)));
  const newB = Math.max(0, Math.min(255, Math.round(b + (t - b) * p)));
  return `rgb(${newR}, ${newG}, ${newB})`;
}

/**
 * FASHION CROQUIS 2D VIEWER (Tham khảo từ bản vẽ phác thảo thời trang cao cấp của người dùng)
 * Đặc trưng:
 * - Đầu mannequin hình oval/egg croquis chuẩn phong cách phác thảo thời trang (faceless, gradient da ấm, cổ thiên nga thon dài).
 * - Tỷ lệ 10-heads siêu mẫu: Chân dài miên man chiếm hơn 55% chiều cao, eo cao, vai thanh mảnh buông nhẹ.
 * - Giày cao gót quai mảnh stiletto đen sang trọng (như trong ảnh mẫu).
 * - Tách biệt hoàn toàn Model Nữ (dáng mềm mại, vai nhỏ, chân dài thon) và Model Nam (vai rộng đĩnh đạc, ngực nở chữ V, chân thẳng).
 * - Thể hiện trung thực 9 bộ Việt phục theo chuẩn vietphuc.md với kỹ thuật vẽ màu nước/marker có highlight & shadow.
 */
export const Character2DViewer: React.FC<Character2DViewerProps> = ({
  customization,
  isEvaluating = false,
}) => {
  const uid = useId().replace(/:/g, '');
  const { gender, parts, pattern, accessories, costumeId } = customization;
  const [paperTheme, setPaperTheme] = useState<'paper' | 'velvet'>('paper');

  const isFemale = gender === 'female';

  // Danh mục phụ kiện Gen Z
  const hasFan = accessories.includes('folding_fan');
  const hasSunglasses = accessories.includes('sunglasses');
  const hasSneakers = accessories.includes('sneakers');
  const hasPearl = accessories.includes('pearl_necklace');
  const hasHairFlower = accessories.includes('hair_flower');
  const hasHeadphones = accessories.includes('headphones');
  const hasBaguette = accessories.includes('baguette_bag');
  const hasBracelet = accessories.includes('beaded_bracelet');
  const hasBucketHat = accessories.includes('bucket_hat');
  const hasChunkyBoots = accessories.includes('chunky_boots');

  // Nhận diện kiểu phom dáng cổ phục chuẩn theo vietphuc.md
  const normKey = normalizeCostumeKey(costumeId);
  const isAoDai = normKey === 'ao-dai';
  const isNguThan = normKey === 'ao-ngu-than';
  const isAoTac = normKey === 'ao-tac';
  const isNhatBinh = normKey === 'ao-nhat-binh';
  const isTuThan = normKey === 'ao-tu-than';
  const isAoBaBa = normKey === 'ao-ba-ba';
  const isGiaoLinh = normKey === 'ao-giao-linh';
  const isVienLinh = normKey === 'ao-vien-linh';
  const isYemVay = normKey === 'yem-vay';

  // Bảng phối màu thời trang đa tầng (Haute Couture Marker Wash)
  const robeHighlight = shadeColor(parts.primaryRobeColor, 45);
  const robeLight = shadeColor(parts.primaryRobeColor, 22);
  const robeMid = parts.primaryRobeColor;
  const robeDeep = shadeColor(parts.primaryRobeColor, -25);
  const robeShadow = shadeColor(parts.primaryRobeColor, -45);

  const innerLight = shadeColor(parts.innerCollarColor, 30);
  const innerMid = parts.innerCollarColor;
  const innerDeep = shadeColor(parts.innerCollarColor, -30);

  const bottomHighlight = shadeColor(parts.bottomColor, 40);
  const bottomLight = shadeColor(parts.bottomColor, 20);
  const bottomMid = parts.bottomColor;
  const bottomDeep = shadeColor(parts.bottomColor, -35);

  const sashLight = shadeColor(parts.sashColor, 35);
  const sashMid = parts.sashColor;
  const sashDeep = shadeColor(parts.sashColor, -35);

  return (
    <div
      className={`relative w-full aspect-[3/4.6] max-w-[440px] mx-auto flex items-center justify-center select-none overflow-hidden rounded-3xl border transition-colors duration-500 shadow-2xl p-2 sm:p-4 ${
        paperTheme === 'paper'
          ? 'bg-[#F9F6F0] border-[#E2D8C7] text-[#2C2117]'
          : 'bg-[#18110C] border-[#3E2C1E] text-[#F5EFE6]'
      }`}
    >
      {/* 1. Fashion Sketch Studio Ambient Backdrop */}
      {paperTheme === 'paper' ? (
        // Nền giấy phác thảo thời trang chuyên nghiệp (Croquis Sketchbook Paper)
        <>
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 35%, ${parts.primaryRobeColor}22, transparent 65%), radial-gradient(#D6C8B4 0.75px, transparent 0.75px)`,
              backgroundSize: '100% 100%, 20px 20px',
            }}
          />
          {/* Vệt màu nước mềm mại nghệ thuật */}
          <div
            className="absolute top-16 left-12 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: parts.primaryRobeColor }}
          />
          <div
            className="absolute bottom-24 right-10 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: parts.bottomColor }}
          />
        </>
      ) : (
        // Nền nhung đen sàn runway thời thượng
        <>
          <div
            className="absolute inset-0 pointer-events-none opacity-25 blur-3xl transition-colors duration-700"
            style={{
              background: `radial-gradient(ellipse at 50% 30%, ${parts.primaryRobeColor}, transparent 70%)`,
            }}
          />
          <div className="absolute inset-x-12 top-4 bottom-10 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent pointer-events-none rounded-t-full" />
        </>
      )}

      {/* Thước đo atelier watermark tinh tế */}
      <svg className="absolute w-[94%] h-[94%] opacity-20 pointer-events-none" viewBox="0 0 400 700">
        <line x1="200" y1="30" x2="200" y2="670" stroke={paperTheme === 'paper' ? '#8F7B66' : '#D4A043'} strokeWidth="0.6" strokeDasharray="3 6" />
        <circle cx="200" cy="350" r="170" fill="none" stroke={paperTheme === 'paper' ? '#C2B19D' : '#D4A043'} strokeWidth="0.5" strokeDasharray="4 8" />
        <ellipse cx="200" cy="655" rx="110" ry="12" fill="none" stroke={paperTheme === 'paper' ? '#A89680' : '#D4A043'} strokeWidth="0.6" strokeOpacity="0.6" />
      </svg>

      {/* Top Header Controls: Badge & Theme Switcher */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md shadow-sm border ${
          paperTheme === 'paper' ? 'bg-white/80 border-[#DECFC0] text-[#4A3928]' : 'bg-[#140D08]/90 border-[#423023] text-[#F5EFE6]'
        }`}>
          <Sparkles size={12} className={paperTheme === 'paper' ? 'text-[#966C20]' : 'text-[#D4A043]'} />
          <span className="text-[11px] font-sans font-medium tracking-wide">
            Croquis {isFemale ? 'Model Nữ (10-heads)' : 'Model Nam (9-heads)'} · {
              isAoDai ? 'Áo Dài' :
              isNguThan ? 'Áo Ngũ Thân' :
              isAoTac ? 'Áo Tấc' :
              isNhatBinh ? 'Áo Nhật Bình' :
              isTuThan ? 'Áo Tứ Thân' :
              isAoBaBa ? 'Áo Bà Ba' :
              isGiaoLinh ? 'Áo Giao Lĩnh' :
              isVienLinh ? 'Áo Viên Lĩnh' : 'Yếm + Váy'
            }
          </span>
        </div>

        {/* Nút chuyển đổi nền Giấy Bản Vẽ Phác Thảo / Sân Khấu Nhung Tối */}
        <button
          type="button"
          onClick={() => setPaperTheme(paperTheme === 'paper' ? 'velvet' : 'paper')}
          title="Chuyển đổi nền giấy phác thảo / sàn diễn tối"
          className={`p-1.5 rounded-full border shadow-sm transition-all cursor-pointer ${
            paperTheme === 'paper'
              ? 'bg-white/90 border-[#DECFC0] text-[#7A6249] hover:bg-[#F2ECE1]'
              : 'bg-[#22160E] border-[#423023] text-[#D4A043] hover:bg-[#2D1E14]'
          }`}
        >
          {paperTheme === 'paper' ? <Moon size={13} /> : <Sun size={13} />}
        </button>
      </div>

      {/* 2. Main Fashion Illustration Croquis SVG Canvas */}
      <motion.div
        animate={{
          y: isEvaluating ? [0, -4, 0] : [0, -2, 0],
          scale: isEvaluating ? 1.01 : 1,
        }}
        transition={{
          duration: isEvaluating ? 1.5 : 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-full h-full flex items-center justify-center pt-5 pb-2"
      >
        <svg
          id="vietphuc-character-svg"
          viewBox="0 0 400 700"
          className="w-full h-full drop-shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* GRADIENT DA THỜI TRANG CHUẨN CROQUIS (Warm Peachy Marker Wash) */}
            <linearGradient id={`${uid}-skin-female`} x1="15%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stopColor="#FFF3EA" />
              <stop offset="35%" stopColor="#F8D9C4" />
              <stop offset="70%" stopColor="#EBB89B" />
              <stop offset="100%" stopColor="#D59B7C" />
            </linearGradient>

            <linearGradient id={`${uid}-skin-female-highlight`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D59B7C" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#FFF7F0" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#D59B7C" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id={`${uid}-skin-male`} x1="15%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stopColor="#F9EDE2" />
              <stop offset="40%" stopColor="#ECCEB5" />
              <stop offset="75%" stopColor="#D7AE90" />
              <stop offset="100%" stopColor="#BC8C6E" />
            </linearGradient>

            {/* GRADIENTS VẢI LỤA / GẤM (Đổ bóng 3D mềm mại theo nét vẽ Gouache) */}
            <linearGradient id={`${uid}-robe-grad`} x1="15%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stopColor={robeHighlight} />
              <stop offset="28%" stopColor={robeLight} />
              <stop offset="65%" stopColor={robeMid} />
              <stop offset="88%" stopColor={robeDeep} />
              <stop offset="100%" stopColor={robeShadow} />
            </linearGradient>

            <linearGradient id={`${uid}-robe-panel-left`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={robeHighlight} />
              <stop offset="40%" stopColor={robeLight} />
              <stop offset="75%" stopColor={robeMid} />
              <stop offset="100%" stopColor={robeDeep} />
            </linearGradient>

            <linearGradient id={`${uid}-robe-panel-right`} x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={robeLight} />
              <stop offset="45%" stopColor={robeMid} />
              <stop offset="85%" stopColor={robeDeep} />
              <stop offset="100%" stopColor={robeShadow} />
            </linearGradient>

            {/* Gradient Cổ Áo & Vạt Yếm */}
            <linearGradient id={`${uid}-inner-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={innerLight} />
              <stop offset="55%" stopColor={innerMid} />
              <stop offset="100%" stopColor={innerDeep} />
            </linearGradient>

            {/* Gradient Quần Lụa & Váy Đen Bắc Bộ */}
            <linearGradient id={`${uid}-bottom-grad`} x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor={bottomHighlight} />
              <stop offset="30%" stopColor={bottomLight} />
              <stop offset="70%" stopColor={bottomMid} />
              <stop offset="100%" stopColor={bottomDeep} />
            </linearGradient>

            {/* Gradient Dải Lụa / Thắt Lưng */}
            <linearGradient id={`${uid}-sash-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={sashLight} />
              <stop offset="55%" stopColor={sashMid} />
              <stop offset="100%" stopColor={sashDeep} />
            </linearGradient>

            {/* Chỉ vàng & Gấm kim tuyến */}
            <linearGradient id={`${uid}-gold-trim`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="35%" stopColor="#D4A043" />
              <stop offset="70%" stopColor="#FFE082" />
              <stop offset="100%" stopColor="#966C20" />
            </linearGradient>

            {/* Khăn đóng nam truyền thống */}
            <linearGradient id={`${uid}-male-turban`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3C2A1E" />
              <stop offset="50%" stopColor="#221710" />
              <stop offset="100%" stopColor="#140D09" />
            </linearGradient>

            {/* BỘ LỌC ĐỔ BÓNG VÀ NÉT PHÁC THẢO */}
            <filter id={`${uid}-soft-shadow`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.35" />
            </filter>
            <filter id={`${uid}-floor-shadow`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" />
            </filter>

            {/* ÁNH SÁNG & ĐỘ SÂU CHẤT LIỆU LỤA / THE (Silk & Gossamer Lighting) */}
            <linearGradient id={`${uid}-silk-sheen`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.38" />
              <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.08" />
              <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id={`${uid}-fabric-depth`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" />
              <stop offset="50%" stopColor="rgba(0,0,0,0.12)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.36)" />
            </linearGradient>

            {/* CSS ANIMATION CHO CÁC LỚP VẢI LỤA / THE CHUYỂN ĐỘNG MỀM MẠI */}
            <style>{`
              @keyframes silkLeftSleeve_${uid} {
                0%, 100% {
                  transform: rotate(0deg) skewX(0deg) translateY(0);
                }
                50% {
                  transform: rotate(-1.5deg) skewX(-0.8deg) translateY(-2px);
                }
              }
              @keyframes silkRightSleeve_${uid} {
                0%, 100% {
                  transform: rotate(0deg) skewX(0deg) translateY(0);
                }
                50% {
                  transform: rotate(1.5deg) skewX(0.8deg) translateY(-2px);
                }
              }
              @keyframes silkHemFlow_${uid} {
                0%, 100% {
                  transform: scaleX(1) skewX(0deg) translateY(0);
                }
                33% {
                  transform: scaleX(1.015) skewX(0.9deg) translateY(-2.2px);
                }
                66% {
                  transform: scaleX(0.988) skewX(-0.8deg) translateY(-1px);
                }
              }
              @keyframes silkFrontFlap_${uid} {
                0%, 100% {
                  transform: skewX(0deg) translateY(0) rotate(0deg);
                }
                50% {
                  transform: skewX(1deg) translateY(-2.2px) rotate(0.6deg);
                }
              }
              @keyframes silkRibbon_${uid} {
                0%, 100% {
                  transform: rotate(0deg) translateX(0);
                }
                33% {
                  transform: rotate(2.4deg) translateX(2px);
                }
                66% {
                  transform: rotate(-2.2deg) translateX(-1.8px);
                }
              }
              @keyframes silkOffsetLayer_${uid} {
                0%, 100% {
                  transform: translate(0, 0);
                  opacity: 0.4;
                }
                50% {
                  transform: translate(1.8px, -1.2px);
                  opacity: 0.65;
                }
              }
              @keyframes silkSheenShimmer_${uid} {
                0%, 100% {
                  opacity: 0.16;
                  transform: translateY(0);
                }
                50% {
                  opacity: 0.45;
                  transform: translateY(-2.5px);
                }
              }

              .silk-sleeve-left-${uid} {
                transform-origin: 160px 180px;
                animation: silkLeftSleeve_${uid} 5.8s ease-in-out infinite;
              }
              .silk-sleeve-right-${uid} {
                transform-origin: 240px 180px;
                animation: silkRightSleeve_${uid} 6.2s ease-in-out infinite 0.7s;
              }
              .silk-hem-${uid} {
                transform-origin: 200px 320px;
                animation: silkHemFlow_${uid} 5.2s ease-in-out infinite;
              }
              .silk-flap-${uid} {
                transform-origin: 200px 220px;
                animation: silkFrontFlap_${uid} 5.6s ease-in-out infinite 0.4s;
              }
              .silk-ribbon-${uid} {
                transform-origin: 200px 260px;
                animation: silkRibbon_${uid} 4.2s ease-in-out infinite 0.3s;
              }
              .silk-offset-${uid} {
                animation: silkOffsetLayer_${uid} 6.2s ease-in-out infinite 0.3s;
                pointer-events: none;
              }
              .silk-sheen-${uid} {
                animation: silkSheenShimmer_${uid} 6.5s ease-in-out infinite;
                pointer-events: none;
              }
            `}</style>

            {/* HỌA TIẾT TRUYỀN THỐNG VIỆT NAM */}
            <pattern id={`${uid}-pat-lotus`} width="36" height="36" patternUnits="userSpaceOnUse">
              <path
                d="M18 6 C14 14, 11 19, 18 26 C25 19, 22 14, 18 6 Z M11 16 C6 21, 9 26, 18 26 M25 16 C30 21, 27 26, 18 26"
                fill="none"
                stroke="rgba(255,255,255,0.32)"
                strokeWidth="1.2"
              />
            </pattern>
            <pattern id={`${uid}-pat-clouds`} width="44" height="32" patternUnits="userSpaceOnUse">
              <path
                d="M8 22 C4 18, 7 11, 15 13 C19 8, 28 8, 32 14 C38 12, 42 18, 38 23 C34 27, 13 27, 8 22 Z"
                fill="none"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="1.2"
              />
            </pattern>
            <pattern id={`${uid}-pat-waves`} width="36" height="24" patternUnits="userSpaceOnUse">
              <path
                d="M0 12 Q9 6, 18 12 T36 12 M0 20 Q9 14, 18 20 T36 20"
                fill="none"
                stroke="rgba(255,255,255,0.26)"
                strokeWidth="1.2"
              />
            </pattern>
            <pattern id={`${uid}-pat-crane`} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 10 L28 22 L20 20 L12 22 Z M20 20 L20 32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
            </pattern>
            <pattern id={`${uid}-pat-plum_blossom`} width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="16" cy="16" r="2.5" fill="rgba(255,255,255,0.35)" />
              <circle cx="16" cy="10" r="3.5" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
              <circle cx="22" cy="14" r="3.5" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
              <circle cx="20" cy="21" r="3.5" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
              <circle cx="12" cy="21" r="3.5" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
              <circle cx="10" cy="14" r="3.5" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
            </pattern>
            <pattern id={`${uid}-pat-bamboo`} width="28" height="42" patternUnits="userSpaceOnUse">
              <line x1="14" y1="2" x2="14" y2="40" stroke="rgba(255,255,255,0.25)" strokeWidth="1.6" />
              <path d="M14 14 Q22 10, 24 18 M14 26 Q6 22, 4 30" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
            </pattern>
            <pattern id={`${uid}-pat-dragon_phoenix`} width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M12 24 Q24 8, 36 24 Q24 40, 12 24 Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
            </pattern>
            <pattern id={`${uid}-pat-dong_son`} width="44" height="44" patternUnits="userSpaceOnUse">
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.2" />
              <circle cx="22" cy="22" r="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            </pattern>
            {customization.customPatternDataUrl && (
              <pattern id={`${uid}-pat-custom_canvas`} width="96" height="96" patternUnits="userSpaceOnUse">
                <image
                  href={customization.customPatternDataUrl}
                  width="96"
                  height="96"
                  preserveAspectRatio="none"
                />
              </pattern>
            )}
          </defs>

          {/* ======================================================== */}
          {/* LỚP 0: BÓNG ĐỔ DƯỚI CHÂN MODEL (SKETCH FLOOR SHADOW)      */}
          {/* ======================================================== */}
          <ellipse
            cx="200"
            cy="654"
            rx={isFemale ? 65 : 78}
            ry="8"
            fill={paperTheme === 'paper' ? 'rgba(80,60,40,0.22)' : 'rgba(0,0,0,0.55)'}
            filter={`url(#${uid}-floor-shadow)`}
          />

          {/* ======================================================== */}
          {/* LỚP 1: TAY ÁO BÊN TRONG / PHÍA SAU (BACK SLEEVES)         */}
          {/* ======================================================== */}
          <g id="back-sleeves">
            {isAoTac ? (
              // ÁO TẤC: TAY THỤNG BUÔNG RỘNG CỰC ĐẠI THEO PHONG CÁCH CAPE CỦA ẢNH MẪU
              <g id="ao-tac-broad-sleeves">
                {/* Lớp bóng độ sâu vải lụa offset */}
                <path
                  d={isFemale
                    ? "M166 172 L100 248 L86 425 Q135 445 162 375 L170 235 Z"
                    : "M152 172 L78 248 L64 435 Q124 455 154 385 L164 235 Z"
                  }
                  fill={robeShadow}
                  opacity="0.35"
                  transform="translate(1.5, 2)"
                  className={`silk-sleeve-left-${uid}`}
                />
                <path
                  d={isFemale
                    ? "M166 172 L100 248 L86 425 Q135 445 162 375 L170 235 Z"
                    : "M152 172 L78 248 L64 435 Q124 455 154 385 L164 235 Z"
                  }
                  fill={`url(#${uid}-robe-panel-left)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-sleeve-left-${uid}`}
                />
                <path
                  d={isFemale
                    ? "M234 172 L300 248 L314 425 Q265 445 238 375 L230 235 Z"
                    : "M248 172 L322 248 L336 435 Q276 455 246 385 L236 235 Z"
                  }
                  fill={robeShadow}
                  opacity="0.35"
                  transform="translate(-1.5, 2)"
                  className={`silk-sleeve-right-${uid}`}
                />
                <path
                  d={isFemale
                    ? "M234 172 L300 248 L314 425 Q265 445 238 375 L230 235 Z"
                    : "M248 172 L322 248 L336 435 Q276 455 246 385 L236 235 Z"
                  }
                  fill={`url(#${uid}-robe-panel-right)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-sleeve-right-${uid}`}
                />
                {/* Lớp ánh sáng the lụa óng ánh */}
                <path
                  d={isFemale
                    ? "M166 172 L100 248 L86 425 Q135 445 162 375 L170 235 Z"
                    : "M152 172 L78 248 L64 435 Q124 455 154 385 L164 235 Z"
                  }
                  fill={`url(#${uid}-silk-sheen)`}
                  className={`silk-sleeve-left-${uid} silk-sheen-${uid}`}
                />
                <path
                  d={isFemale
                    ? "M234 172 L300 248 L314 425 Q265 445 238 375 L230 235 Z"
                    : "M248 172 L322 248 L336 435 Q276 455 246 385 L236 235 Z"
                  }
                  fill={`url(#${uid}-silk-sheen)`}
                  className={`silk-sleeve-right-${uid} silk-sheen-${uid}`}
                />
                {/* Viền tay thụng 1 tấc */}
                <path d={isFemale ? "M86 425 Q135 445 162 375" : "M64 435 Q124 455 154 385"} fill="none" stroke={`url(#${uid}-gold-trim)`} strokeWidth="2.2" className={`silk-sleeve-left-${uid}`} />
                <path d={isFemale ? "M314 425 Q265 445 238 375" : "M336 435 Q276 455 246 385"} fill="none" stroke={`url(#${uid}-gold-trim)`} strokeWidth="2.2" className={`silk-sleeve-right-${uid}`} />
                {/* Nếp gấp rủ vải mềm mại */}
                <path d={isFemale ? "M94 365 Q124 395 156 355" : "M76 375 Q114 405 150 365"} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1.6" className={`silk-sleeve-left-${uid}`} />
                <path d={isFemale ? "M306 365 Q276 395 244 355" : "M324 375 Q286 405 250 365"} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1.6" className={`silk-sleeve-right-${uid}`} />
              </g>
            ) : isNhatBinh ? (
              // ÁO NHẬT BÌNH: TAY RỘNG HOÀNG GIA VIỀN DẢI NGŨ SẮC
              <g id="nhat-binh-royal-sleeves">
                <path
                  d="M168 170 L108 245 L98 402 Q144 418 166 358 L172 230 Z"
                  fill={robeShadow}
                  opacity="0.32"
                  transform="translate(1.2, 1.8)"
                  className={`silk-sleeve-left-${uid}`}
                />
                <path
                  d="M168 170 L108 245 L98 402 Q144 418 166 358 L172 230 Z"
                  fill={`url(#${uid}-robe-panel-left)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-sleeve-left-${uid}`}
                />
                <path
                  d="M232 170 L292 245 L302 402 Q256 418 234 358 L228 230 Z"
                  fill={robeShadow}
                  opacity="0.32"
                  transform="translate(-1.2, 1.8)"
                  className={`silk-sleeve-right-${uid}`}
                />
                <path
                  d="M232 170 L292 245 L302 402 Q256 418 234 358 L228 230 Z"
                  fill={`url(#${uid}-robe-panel-right)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-sleeve-right-${uid}`}
                />
                {/* Lớp the óng ánh */}
                <path
                  d="M168 170 L108 245 L98 402 Q144 418 166 358 L172 230 Z"
                  fill={`url(#${uid}-silk-sheen)`}
                  className={`silk-sleeve-left-${uid} silk-sheen-${uid}`}
                />
                <path
                  d="M232 170 L292 245 L302 402 Q256 418 234 358 L228 230 Z"
                  fill={`url(#${uid}-silk-sheen)`}
                  className={`silk-sleeve-right-${uid} silk-sheen-${uid}`}
                />
                <path d="M98 402 Q144 418 166 358" fill="none" stroke="#BA3424" strokeWidth="3" className={`silk-sleeve-left-${uid}`} />
                <path d="M100 396 Q146 412 167 352" fill="none" stroke="#D4A043" strokeWidth="2" className={`silk-sleeve-left-${uid}`} />
                <path d="M302 402 Q256 418 234 358" fill="none" stroke="#BA3424" strokeWidth="3" className={`silk-sleeve-right-${uid}`} />
                <path d="M300 396 Q254 412 233 352" fill="none" stroke="#D4A043" strokeWidth="2" className={`silk-sleeve-right-${uid}`} />
              </g>
            ) : isAoDai || isNguThan ? (
              // ÁO DÀI / ÁO NGŨ THÂN: TAY CHẼN ÔM THON THEO DÁNG TAY CROQUIS
              <g id="tay-chen-slim-sleeves">
                <path
                  d={isFemale
                    ? "M170 172 L128 252 L120 355 Q132 360 142 352 L168 240 Z"
                    : "M156 172 L106 256 L96 362 Q112 368 124 358 L154 240 Z"
                  }
                  fill={`url(#${uid}-robe-panel-left)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-sleeve-left-${uid}`}
                />
                <path
                  d={isFemale
                    ? "M230 172 L272 252 L280 355 Q268 360 258 352 L232 240 Z"
                    : "M244 172 L294 256 L304 362 Q288 368 276 358 L246 240 Z"
                  }
                  fill={`url(#${uid}-robe-panel-right)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-sleeve-right-${uid}`}
                />
                <line x1={isFemale ? 120 : 96} y1={isFemale ? 355 : 362} x2={isFemale ? 142 : 124} y2={isFemale ? 352 : 358} stroke={`url(#${uid}-gold-trim)`} strokeWidth="1.8" className={`silk-sleeve-left-${uid}`} />
                <line x1={isFemale ? 258 : 276} y1={isFemale ? 352 : 358} x2={isFemale ? 280 : 304} y2={isFemale ? 355 : 362} stroke={`url(#${uid}-gold-trim)`} strokeWidth="1.8" className={`silk-sleeve-right-${uid}`} />
              </g>
            ) : isAoBaBa ? (
              // ÁO BÀ BA: TAY DÀI VỪA VẶN MỀM MẠI
              <g id="ao-ba-ba-sleeves">
                <path
                  d={isFemale
                    ? "M170 174 L130 250 L124 345 Q134 350 144 344 L166 236 Z"
                    : "M156 174 L110 252 L104 352 Q116 358 128 350 L154 236 Z"
                  }
                  fill={`url(#${uid}-robe-panel-left)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-sleeve-left-${uid}`}
                />
                <path
                  d={isFemale
                    ? "M230 174 L270 250 L276 345 Q266 350 256 344 L234 236 Z"
                    : "M244 174 L290 252 L296 352 Q284 358 272 350 L246 236 Z"
                  }
                  fill={`url(#${uid}-robe-panel-right)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-sleeve-right-${uid}`}
                />
              </g>
            ) : isYemVay ? (
              // YẾM VÁY: BỜ VAI VÀ CÁNH TAY TRẦN THANH MẢNH NHƯ ẢNH MẪU
              <g id="bare-slender-arms">
                {/* Cánh tay trái thon dài */}
                <path
                  d="M174 174 Q144 240 134 336 Q140 344 148 338 Q156 250 178 192 Z"
                  fill={`url(#${uid}-skin-female)`}
                  stroke="#38291F"
                  strokeWidth="1"
                />
                {/* Cánh tay phải thanh thoát */}
                <path
                  d="M226 174 Q256 240 266 336 Q260 344 252 338 Q244 250 222 192 Z"
                  fill={`url(#${uid}-skin-female)`}
                  stroke="#38291F"
                  strokeWidth="1"
                />
              </g>
            ) : isGiaoLinh ? (
              // ÁO GIAO LĨNH: TAY RỘNG CỔ PHONG
              <g id="giao-linh-sleeves">
                <path
                  d="M166 172 L104 242 L92 410 Q138 425 164 365 L170 230 Z"
                  fill={robeShadow}
                  opacity="0.3"
                  transform="translate(1.2, 1.8)"
                  className={`silk-sleeve-left-${uid}`}
                />
                <path
                  d="M166 172 L104 242 L92 410 Q138 425 164 365 L170 230 Z"
                  fill={`url(#${uid}-robe-panel-left)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-sleeve-left-${uid}`}
                />
                <path
                  d="M234 172 L296 242 L308 410 Q262 425 236 365 L230 230 Z"
                  fill={robeShadow}
                  opacity="0.3"
                  transform="translate(-1.2, 1.8)"
                  className={`silk-sleeve-right-${uid}`}
                />
                <path
                  d="M234 172 L296 242 L308 410 Q262 425 236 365 L230 230 Z"
                  fill={`url(#${uid}-robe-panel-right)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-sleeve-right-${uid}`}
                />
                <path d="M92 410 Q138 425 164 365" fill="none" stroke={`url(#${uid}-gold-trim)`} strokeWidth="1.8" className={`silk-sleeve-left-${uid}`} />
                <path d="M308 410 Q262 425 236 365" fill="none" stroke={`url(#${uid}-gold-trim)`} strokeWidth="1.8" className={`silk-sleeve-right-${uid}`} />
              </g>
            ) : (
              // ÁO TỨ THÂN / VIÊN LĨNH
              <g id="standard-flowing-sleeves">
                <path
                  d="M168 172 L114 242 L104 385 Q144 400 166 348 L170 232 Z"
                  fill={`url(#${uid}-robe-panel-left)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-sleeve-left-${uid}`}
                />
                <path
                  d="M232 172 L286 242 L296 385 Q256 400 234 348 L230 232 Z"
                  fill={`url(#${uid}-robe-panel-right)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-sleeve-right-${uid}`}
                />
              </g>
            )}
          </g>

          {/* ======================================================== */}
          {/* LỚP 2: BÀN TAY VÀ PHỤ KIỆN TRÊN TAY (HANDS & PROPS)       */}
          {/* ======================================================== */}
          <g id="hands-and-props">
            {/* Bàn tay phác thảo thời trang vuốt dài ngón tay (Fashion Sketch Hands) */}
            <g id="left-hand">
              <path
                d={isFemale
                  ? "M132 352 C130 366, 134 382, 136 390 C138 390, 142 374, 140 354 Z"
                  : "M112 358 C110 374, 116 392, 120 396 C123 396, 126 380, 124 360 Z"
                }
                fill={`url(#${isFemale ? uid + '-skin-female' : uid + '-skin-male'})`}
                stroke="#38291F"
                strokeWidth="0.9"
              />
            </g>
            <g id="right-hand">
              <path
                d={isFemale
                  ? "M268 352 C270 366, 266 382, 264 390 C262 390, 258 374, 260 354 Z"
                  : "M288 358 C290 374, 284 392, 280 396 C277 396, 274 380, 276 360 Z"
                }
                fill={`url(#${isFemale ? uid + '-skin-female' : uid + '-skin-male'})`}
                stroke="#38291F"
                strokeWidth="0.9"
              />
            </g>

            {/* Quạt xếp truyền thống */}
            {hasFan && (
              <g id="prop-folding-fan" transform={`translate(${isFemale ? 262 : 278}, ${isFemale ? 355 : 362}) rotate(-24)`}>
                <path d="M0 0 L-28 -48 A56 56 0 0 1 28 -48 Z" fill="#D4A043" stroke="#FFE082" strokeWidth="1.2" />
                <line x1="0" y1="0" x2="-20" y2="-50" stroke="#875638" strokeWidth="0.8" />
                <line x1="0" y1="0" x2="0" y2="-56" stroke="#875638" strokeWidth="0.8" />
                <line x1="0" y1="0" x2="20" y2="-50" stroke="#875638" strokeWidth="0.8" />
                <circle cx="0" cy="0" r="2.6" fill="#BA3424" />
                <path d="M0 2 L-2 24 L2 24 Z" fill="#BA3424" />
              </g>
            )}

            {/* Túi Baguette Gen Z */}
            {hasBaguette && (
              <g id="prop-baguette" transform="translate(114, 256) rotate(12)" filter={`url(#${uid}-soft-shadow)`}>
                <ellipse cx="18" cy="12" rx="20" ry="11" fill="#140D08" stroke="#D4A043" strokeWidth="1.2" />
                <path d="M5 10 C5 -8, 31 -8, 31 10" fill="none" stroke="#D4A043" strokeWidth="1.5" />
                <circle cx="18" cy="13" r="3" fill="#D4A043" />
              </g>
            )}

            {/* Vòng tay đính hạt */}
            {hasBracelet && (
              <circle
                cx={isFemale ? 136 : 118}
                cy={isFemale ? 362 : 368}
                r="6.5"
                fill="none"
                stroke="#D4A043"
                strokeWidth="2.5"
                strokeDasharray="2.5 2"
              />
            )}
          </g>

          {/* ======================================================== */}
          {/* LỚP 3: CHÂN SIÊU MẪU & GIÀY CAO GÓT QUAI MẢNH (STILETTO)  */}
          {/* (Chuẩn theo 5 model trong ảnh mẫu: Chân dài miên man, gót nhọn kiêu kỳ) */}
          {/* ======================================================== */}
          <g id="legs-and-footwear">
            {isFemale ? (
              /* MODEL NỮ: CHÂN DÀI THANH MẢNH, BỜ HÔNG CAO, GIÀY CAO GÓT NHỌN QUAI MẢNH ĐEN */
              <g id="female-legs-croquis">
                {/* Chân trái: Đùi thon, đầu gối điểm nhẹ, bắp chân dài thon vút xuống cổ chân */}
                <path
                  d="M182 460 L176 560 L173 635 Q175 640 180 635 L186 560 L190 460 Z"
                  fill={`url(#${uid}-skin-female)`}
                  stroke="#38291F"
                  strokeWidth="0.9"
                />
                {/* Điểm nhấn đầu gối nhẹ chuẩn croquis */}
                <path d="M174 555 Q181 559 188 555" fill="none" stroke="#D59B7C" strokeWidth="1" strokeDasharray="3 3" />

                {/* Chân phải: Dáng đứng vắt chéo nhẹ kiêu sa */}
                <path
                  d="M218 460 L224 560 L227 635 Q225 640 220 635 L214 560 L210 460 Z"
                  fill={`url(#${uid}-skin-female)`}
                  stroke="#38291F"
                  strokeWidth="0.9"
                />
                <path d="M212 555 Q219 559 226 555" fill="none" stroke="#D59B7C" strokeWidth="1" strokeDasharray="3 3" />

                {/* GIÀY CAO GÓT QUAI MẢNH ĐEN (Black Ankle-Strap Stiletto Heels như ảnh mẫu) */}
                {!hasSneakers && !hasChunkyBoots && (
                  <g id="female-stiletto-heels" filter={`url(#${uid}-soft-shadow)`}>
                    {/* Chân trái */}
                    {/* Quai quấn mắt cá chân mảnh (Ankle strap) */}
                    <path d="M171 630 Q176 633 182 630" stroke="#140D08" strokeWidth="1.8" fill="none" />
                    {/* Thân giày & gót nhọn (Stiletto) */}
                    <path d="M173 635 L170 653 L178 654 L180 635 Z" fill="#140D08" />
                    <line x1="171" y1="637" x2="171" y2="655" stroke="#140D08" strokeWidth="1.8" />
                    {/* Mũi giày nhọn quai vắt ngang ngón chân */}
                    <path d="M169 644 Q176 648 183 644" stroke="#140D08" strokeWidth="2.2" fill="none" />

                    {/* Chân phải */}
                    <path d="M218 630 Q223 633 229 630" stroke="#140D08" strokeWidth="1.8" fill="none" />
                    <path d="M220 635 L222 653 L230 654 L227 635 Z" fill="#140D08" />
                    <line x1="229" y1="637" x2="229" y2="655" stroke="#140D08" strokeWidth="1.8" />
                    <path d="M217 644 Q224 648 231 644" stroke="#140D08" strokeWidth="2.2" fill="none" />
                  </g>
                )}
              </g>
            ) : (
              /* MODEL NAM: DÁNG ĐỨNG ĐĨNH ĐẠC, CHÂN THẲNG DÀI, GIÀY DA / HIA CỔ PHONG */
              <g id="male-legs-croquis">
                <path
                  d="M174 450 L168 550 L164 630 L184 630 L186 550 L188 450 Z"
                  fill={`url(#${uid}-skin-male)`}
                  stroke="#38291F"
                  strokeWidth="0.9"
                />
                <path
                  d="M226 450 L232 550 L236 630 L216 630 L214 550 L212 450 Z"
                  fill={`url(#${uid}-skin-male)`}
                  stroke="#38291F"
                  strokeWidth="0.9"
                />

                {/* Giày da đen hoặc Hia cổ phong */}
                {!hasSneakers && !hasChunkyBoots && (
                  <g id="male-dress-shoes" filter={`url(#${uid}-soft-shadow)`}>
                    <path d="M160 626 L158 652 L186 652 L186 626 Z" fill="#140D08" stroke={`url(#${uid}-gold-trim)`} strokeWidth="1" />
                    <path d="M214 626 L214 652 L242 652 L240 626 Z" fill="#140D08" stroke={`url(#${uid}-gold-trim)`} strokeWidth="1" />
                  </g>
                )}
              </g>
            )}

            {/* Sneaker Gen Z đương đại */}
            {hasSneakers && (
              <g id="prop-sneakers" filter={`url(#${uid}-soft-shadow)`}>
                <rect x="158" y="632" width="32" height="18" rx="6" fill="#FAFAFA" stroke="#BAA796" strokeWidth="1.2" />
                <path d="M160 644 L188 644" stroke="#465A3D" strokeWidth="3" />
                <rect x="210" y="632" width="32" height="18" rx="6" fill="#FAFAFA" stroke="#BAA796" strokeWidth="1.2" />
                <path d="M212 644 L240 644" stroke="#465A3D" strokeWidth="3" />
              </g>
            )}

            {/* Bốt Chunky Y2K */}
            {hasChunkyBoots && (
              <g id="prop-chunky-boots" filter={`url(#${uid}-soft-shadow)`}>
                <rect x="156" y="618" width="34" height="32" rx="5" fill="#140D08" stroke="#423023" strokeWidth="1.5" />
                <rect x="210" y="618" width="34" height="32" rx="5" fill="#140D08" stroke="#423023" strokeWidth="1.5" />
                <line x1="156" y1="642" x2="190" y2="642" stroke="#D4A043" strokeWidth="2.5" />
                <line x1="210" y1="642" x2="244" y2="642" stroke="#D4A043" strokeWidth="2.5" />
              </g>
            )}
          </g>

          {/* ======================================================== */}
          {/* LỚP 4: PHẦN DƯỚI (QUẦN LỤA ỐNG RỘNG / VÁY QUẤN XẾP LY)   */}
          {/* ======================================================== */}
          <g id="lower-garment">
            {isTuThan || isYemVay ? (
              // CHÂN VÁY QUẤN BẮC BỘ: Váy đen rủ mềm mại, nếp gấp chuyển màu nước
              <g id="northern-wrap-skirt" className={`silk-hem-${uid}`}>
                {/* Lớp bóng đổ chiều sâu dưới chân váy (Offset Shadow Layer) */}
                <path
                  d={isFemale
                    ? "M172 260 Q200 268 228 260 L262 630 Q200 645 138 630 Z"
                    : "M166 265 Q200 274 234 265 L270 630 Q200 648 130 630 Z"
                  }
                  fill={bottomDeep}
                  opacity="0.32"
                  transform="translate(1.5, 2)"
                />
                {/* Lớp vải chính */}
                <path
                  d={isFemale
                    ? "M172 260 Q200 268 228 260 L262 630 Q200 645 138 630 Z"
                    : "M166 265 Q200 274 234 265 L270 630 Q200 648 130 630 Z"
                  }
                  fill={`url(#${uid}-bottom-grad)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                />
                {/* Lớp the/lụa hai tầng offset nhẹ tạo độ bồng bềnh */}
                <path
                  d={isFemale
                    ? "M174 263 Q200 271 226 263 L259 628 Q200 642 141 628 Z"
                    : "M168 268 Q200 277 232 268 L267 628 Q200 645 133 628 Z"
                  }
                  fill={bottomLight}
                  className={`silk-offset-${uid}`}
                />
                {/* Lớp ánh sáng the óng ánh mềm mại */}
                <path
                  d={isFemale
                    ? "M172 260 Q200 268 228 260 L262 630 Q200 645 138 630 Z"
                    : "M166 265 Q200 274 234 265 L270 630 Q200 648 130 630 Z"
                  }
                  fill={`url(#${uid}-silk-sheen)`}
                  className={`silk-sheen-${uid}`}
                />
                {/* Nếp gấp lụa tự nhiên (Fabric Folds) */}
                <path d="M182 268 Q174 440 162 632" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2.2" />
                <path d="M200 270 L200 640" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.8" />
                <path d="M218 268 Q226 440 238 632" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2.2" />
                {/* Viền gấu váy */}
                <path
                  d={isFemale ? "M138 630 Q200 645 262 630" : "M130 630 Q200 648 270 630"}
                  fill="none"
                  stroke={`url(#${uid}-gold-trim)`}
                  strokeWidth="1.4"
                  strokeOpacity="0.75"
                />
              </g>
            ) : isAoDai ? (
              // ÁO DÀI: QUẦN LỤA ỐNG RỘNG DÀI PHẾT ĐẤT NHƯ MODEL 1 TRONG ẢNH
              <g id="ao-dai-wide-leg-palazzo" className={`silk-hem-${uid}`}>
                {/* Ống quần trái - Layered offset */}
                <path
                  d={isFemale
                    ? "M174 252 L144 632 L192 632 L198 320 Z"
                    : "M172 260 L142 632 L192 632 L198 330 Z"
                  }
                  fill={bottomDeep}
                  opacity="0.28"
                  transform="translate(1.5, 2)"
                />
                <path
                  d={isFemale
                    ? "M174 252 L144 632 L192 632 L198 320 Z"
                    : "M172 260 L142 632 L192 632 L198 330 Z"
                  }
                  fill={`url(#${uid}-bottom-grad)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                />
                <path
                  d={isFemale
                    ? "M174 252 L144 632 L192 632 L198 320 Z"
                    : "M172 260 L142 632 L192 632 L198 330 Z"
                  }
                  fill={`url(#${uid}-silk-sheen)`}
                  className={`silk-sheen-${uid}`}
                />
                <path d="M160 340 Q150 480 146 632" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="2.2" />
                <path d="M174 340 L170 632" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.6" />

                {/* Ống quần phải - Layered offset */}
                <path
                  d={isFemale
                    ? "M202 320 L208 632 L256 632 L226 252 Z"
                    : "M202 330 L208 632 L258 632 L228 260 Z"
                  }
                  fill={bottomDeep}
                  opacity="0.28"
                  transform="translate(-1.5, 2)"
                />
                <path
                  d={isFemale
                    ? "M202 320 L208 632 L256 632 L226 252 Z"
                    : "M202 330 L208 632 L258 632 L228 260 Z"
                  }
                  fill={`url(#${uid}-bottom-grad)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                />
                <path
                  d={isFemale
                    ? "M202 320 L208 632 L256 632 L226 252 Z"
                    : "M202 330 L208 632 L258 632 L228 260 Z"
                  }
                  fill={`url(#${uid}-silk-sheen)`}
                  className={`silk-sheen-${uid}`}
                />
                <path d="M240 340 Q250 480 254 632" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="2.2" />
                <path d="M226 340 L230 632" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.6" />

                {/* Gấu quần lụa */}
                <line x1="144" y1="632" x2="192" y2="632" stroke={`url(#${uid}-gold-trim)`} strokeWidth="1.4" />
                <line x1="208" y1="632" x2="256" y2="632" stroke={`url(#${uid}-gold-trim)`} strokeWidth="1.4" />
              </g>
            ) : isAoBaBa ? (
              // ÁO BÀ BA: QUẦN SUÔNG LỤA
              <g id="ao-ba-ba-trousers" className={`silk-hem-${uid}`}>
                <path d="M176 305 L152 632 L192 632 L198 350 Z" fill={`url(#${uid}-bottom-grad)`} stroke="#261C14" strokeWidth="1.2" />
                <path d="M202 350 L208 632 L248 632 L224 305 Z" fill={`url(#${uid}-bottom-grad)`} stroke="#261C14" strokeWidth="1.2" />
              </g>
            ) : (
              // CÁC BỘ KHÁC: QUẦN CỔ PHỤC SUÔNG
              <g id="palace-trousers" className={`silk-hem-${uid}`}>
                <path
                  d={isFemale
                    ? "M174 260 L148 632 L192 632 L198 330 Z"
                    : "M168 265 L142 632 L192 632 L198 340 Z"
                  }
                  fill={`url(#${uid}-bottom-grad)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                />
                <path
                  d={isFemale
                    ? "M202 330 L208 632 L252 632 L226 260 Z"
                    : "M202 340 L208 632 L258 632 L232 265 Z"
                  }
                  fill={`url(#${uid}-bottom-grad)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                />
              </g>
            )}
          </g>

          {/* ======================================================== */}
          {/* LỚP 5: THÂN ÁO CHUẨN MỰC TỪNG BỘ VIỆT PHỤC (vietphuc.md) */}
          {/* ======================================================== */}
          <g id="torso-garments">
            {/* Lớp lót ngực trong */}
            <path
              d={isFemale ? "M180 168 L200 220 L220 168 Z" : "M176 168 L200 230 L224 168 Z"}
              fill={`url(#${uid}-inner-grad)`}
            />

            {/* 1. YẾM VÁY */}
            {isYemVay && (
              <g id="yem-vay-garment" className={`silk-flap-${uid}`}>
                {/* Lớp bóng đổ vải yếm lụa offset */}
                <path
                  d="M182 170 Q200 160 218 170 L238 270 Q200 292 162 270 Z"
                  fill={robeShadow}
                  opacity="0.3"
                  transform="translate(1.2, 1.8)"
                />
                {/* Thân Yếm hình quả trám thon gọn khoe trọn bờ vai và lưng trần */}
                <path
                  d="M182 170 Q200 160 218 170 L238 270 Q200 292 162 270 Z"
                  fill={`url(#${uid}-robe-grad)`}
                  stroke={`url(#${uid}-gold-trim)`}
                  strokeWidth="2.2"
                />
                {/* Lớp the óng ánh trên ngực yếm */}
                <path
                  d="M182 170 Q200 160 218 170 L238 270 Q200 292 162 270 Z"
                  fill={`url(#${uid}-silk-sheen)`}
                  className={`silk-sheen-${uid}`}
                />
                {/* Dây yếm quàng qua cổ thanh lịch */}
                <path d="M182 170 Q178 154 188 149" fill="none" stroke={`url(#${uid}-gold-trim)`} strokeWidth="1.8" />
                <path d="M218 170 Q222 154 212 149" fill="none" stroke={`url(#${uid}-gold-trim)`} strokeWidth="1.8" />
                <path d="M178 235 Q200 248 222 235" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="1.8" />
              </g>
            )}

            {/* 2. ÁO BÀ BA */}
            {isAoBaBa && (
              <g id="ao-ba-ba-garment" className={`silk-flap-${uid}`}>
                {/* Lớp bóng offset */}
                <path
                  d={isFemale
                    ? "M170 174 L186 164 L214 164 L230 174 L226 315 L208 322 L200 270 L192 322 L174 315 Z"
                    : "M156 174 L180 164 L220 164 L244 174 L238 325 L214 332 L200 275 L186 332 L162 325 Z"
                  }
                  fill={robeShadow}
                  opacity="0.28"
                  transform="translate(1.2, 1.8)"
                />
                <path
                  d={isFemale
                    ? "M170 174 L186 164 L214 164 L230 174 L226 315 L208 322 L200 270 L192 322 L174 315 Z"
                    : "M156 174 L180 164 L220 164 L244 174 L238 325 L214 332 L200 275 L186 332 L162 325 Z"
                  }
                  fill={`url(#${uid}-robe-grad)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                />
                <path
                  d={isFemale
                    ? "M170 174 L186 164 L214 164 L230 174 L226 315 L208 322 L200 270 L192 322 L174 315 Z"
                    : "M156 174 L180 164 L220 164 L244 174 L238 325 L214 332 L200 275 L186 332 L162 325 Z"
                  }
                  fill={`url(#${uid}-silk-sheen)`}
                  className={`silk-sheen-${uid}`}
                />
                {/* Hàng cúc giữa ngực */}
                <line x1="200" y1="168" x2="200" y2={isFemale ? 312 : 320} stroke={`url(#${uid}-gold-trim)`} strokeWidth="2" />
                {[178, 200, 222, 244, 266, 288, 308].map((yVal, idx) => (
                  <circle key={idx} cx="200" cy={yVal} r="2.8" fill={`url(#${uid}-gold-trim)`} />
                ))}
                {/* Hai túi nhỏ xinh xắn */}
                <rect x={isFemale ? 178 : 168} y={isFemale ? 285 : 292} width="18" height="20" rx="3" fill="none" stroke={`url(#${uid}-gold-trim)`} strokeWidth="1.2" />
                <rect x={isFemale ? 214 : 214} y={isFemale ? 285 : 292} width="18" height="20" rx="3" fill="none" stroke={`url(#${uid}-gold-trim)`} strokeWidth="1.2" />
              </g>
            )}

            {/* 3. ÁO TỨ THÂN */}
            {isTuThan && (
              <g id="ao-tu-than-garment">
                {/* Áo Yếm lộ ra ở ngực */}
                <path
                  d="M182 170 Q200 160 218 170 L228 250 Q200 270 172 250 Z"
                  fill={`url(#${uid}-inner-grad)`}
                  stroke={`url(#${uid}-gold-trim)`}
                  strokeWidth="1.6"
                />
                {/* Lớp bóng áo tứ thân offset */}
                <path
                  d={isFemale
                    ? "M168 174 L184 162 L192 162 L188 260 L158 450 Q178 460 190 385 L196 280 L200 290 L204 280 L210 385 Q222 460 242 450 L212 260 L208 162 L216 162 L232 174 L244 455 Q200 470 156 455 Z"
                    : "M156 174 L178 162 L188 162 L182 265 L148 460 Q170 470 186 395 L194 285 L200 295 L206 285 L214 395 Q230 470 252 460 L218 265 L212 162 L222 162 L244 174 L258 465 Q200 480 142 465 Z"
                  }
                  fill={robeShadow}
                  opacity="0.32"
                  transform="translate(1.4, 2)"
                  className={`silk-flap-${uid}`}
                />
                {/* Áo 4 thân khoác ngoài */}
                <path
                  d={isFemale
                    ? "M168 174 L184 162 L192 162 L188 260 L158 450 Q178 460 190 385 L196 280 L200 290 L204 280 L210 385 Q222 460 242 450 L212 260 L208 162 L216 162 L232 174 L244 455 Q200 470 156 455 Z"
                    : "M156 174 L178 162 L188 162 L182 265 L148 460 Q170 470 186 395 L194 285 L200 295 L206 285 L214 395 Q230 470 252 460 L218 265 L212 162 L222 162 L244 174 L258 465 Q200 480 142 465 Z"
                  }
                  fill={`url(#${uid}-robe-grad)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-flap-${uid}`}
                />
                {/* Lớp the tơ tằm óng ánh */}
                <path
                  d={isFemale
                    ? "M168 174 L184 162 L192 162 L188 260 L158 450 Q178 460 190 385 L196 280 L200 290 L204 280 L210 385 Q222 460 242 450 L212 260 L208 162 L216 162 L232 174 L244 455 Q200 470 156 455 Z"
                    : "M156 174 L178 162 L188 162 L182 265 L148 460 Q170 470 186 395 L194 285 L200 295 L206 285 L214 395 Q230 470 252 460 L218 265 L212 162 L222 162 L244 174 L258 465 Q200 480 142 465 Z"
                  }
                  fill={`url(#${uid}-silk-sheen)`}
                  className={`silk-flap-${uid} silk-sheen-${uid}`}
                />
                {/* Hai vạt trước thắt nút chữ V duyên dáng trước eo - Chuyển động lụa */}
                <g className={`silk-ribbon-${uid}`}>
                  <path d="M186 270 Q200 284 214 270 L216 288 Q200 302 184 288 Z" fill={`url(#${uid}-sash-grad)`} />
                  <path d="M195 288 L188 395 L196 398 L203 288 Z" fill={`url(#${uid}-sash-grad)`} />
                  <path d="M201 288 L208 388 L216 390 L209 288 Z" fill={`url(#${uid}-sash-grad)`} />
                  <rect x="180" y="260" width="40" height="10" rx="3" fill={`url(#${uid}-sash-grad)`} stroke={`url(#${uid}-gold-trim)`} strokeWidth="1" />
                </g>
              </g>
            )}

            {/* 4. ÁO NHẬT BÌNH */}
            {isNhatBinh && (
              <g id="ao-nhat-binh-garment">
                {/* Lớp bóng áo offset */}
                <path
                  d={isFemale
                    ? "M166 174 L184 158 L216 158 L234 174 L248 460 Q200 478 152 460 Z"
                    : "M154 174 L178 158 L222 158 L246 174 L260 470 Q200 488 140 470 Z"
                  }
                  fill={robeShadow}
                  opacity="0.32"
                  transform="translate(1.4, 2)"
                  className={`silk-hem-${uid}`}
                />
                <path
                  d={isFemale
                    ? "M166 174 L184 158 L216 158 L234 174 L248 460 Q200 478 152 460 Z"
                    : "M154 174 L178 158 L222 158 L246 174 L260 470 Q200 488 140 470 Z"
                  }
                  fill={`url(#${uid}-robe-grad)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-hem-${uid}`}
                />
                {/* Lớp the óng ánh mềm mại */}
                <path
                  d={isFemale
                    ? "M166 174 L184 158 L216 158 L234 174 L248 460 Q200 478 152 460 Z"
                    : "M154 174 L178 158 L222 158 L246 174 L260 470 Q200 488 140 470 Z"
                  }
                  fill={`url(#${uid}-silk-sheen)`}
                  className={`silk-hem-${uid} silk-sheen-${uid}`}
                />
                {/* CỔ ÁO HÌNH CHỮ NHẬT TO BẢN ĐẶC TRƯNG CHẠY DỌC XUỐNG NGỰC */}
                <path
                  d="M184 158 L216 158 L216 312 L202 312 L202 180 L198 180 L198 312 L184 312 Z"
                  fill={`url(#${uid}-inner-grad)`}
                  stroke={`url(#${uid}-gold-trim)`}
                  strokeWidth="2.4"
                />
                {/* Dải ngũ sắc viền mép cổ */}
                <line x1="188" y1="164" x2="188" y2="308" stroke="#BA3424" strokeWidth="2.6" />
                <line x1="192" y1="164" x2="192" y2="308" stroke="#D4A043" strokeWidth="2" />
                <line x1="208" y1="164" x2="208" y2="308" stroke="#D4A043" strokeWidth="2" />
                <line x1="212" y1="164" x2="212" y2="308" stroke="#4A7F9D" strokeWidth="2.6" />
                {/* Khuy ngọc cài nối 2 nẹp cổ */}
                <circle cx="200" cy="195" r="3" fill="#D4A043" stroke="#FFE082" strokeWidth="1" />
                <circle cx="200" cy="222" r="3" fill="#D4A043" stroke="#FFE082" strokeWidth="1" />
                <circle cx="200" cy="248" r="3" fill="#D4A043" stroke="#FFE082" strokeWidth="1" />
                {/* Dải nơ buộc trước ngực - Bay mềm mại */}
                <g className={`silk-ribbon-${uid}`}>
                  <path d="M196 258 L190 365 L197 368 L199 258 Z" fill="#BA3424" />
                  <path d="M204 258 L210 358 L217 361 L207 258 Z" fill="#58734D" />
                </g>
              </g>
            )}

            {/* 5. ÁO GIAO LĨNH */}
            {isGiaoLinh && (
              <g id="ao-giao-linh-garment">
                <path
                  d={isFemale
                    ? "M166 174 L184 158 L216 158 L234 174 L246 462 Q200 480 154 462 Z"
                    : "M154 174 L178 158 L222 158 L246 174 L258 472 Q200 490 142 472 Z"
                  }
                  fill={robeShadow}
                  opacity="0.3"
                  transform="translate(1.4, 2)"
                  className={`silk-hem-${uid}`}
                />
                <path
                  d={isFemale
                    ? "M166 174 L184 158 L216 158 L234 174 L246 462 Q200 480 154 462 Z"
                    : "M154 174 L178 158 L222 158 L246 174 L258 472 Q200 490 142 472 Z"
                  }
                  fill={`url(#${uid}-robe-grad)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-hem-${uid}`}
                />
                <path
                  d={isFemale
                    ? "M166 174 L184 158 L216 158 L234 174 L246 462 Q200 480 154 462 Z"
                    : "M154 174 L178 158 L222 158 L246 174 L258 472 Q200 490 142 472 Z"
                  }
                  fill={`url(#${uid}-silk-sheen)`}
                  className={`silk-hem-${uid} silk-sheen-${uid}`}
                />
                {/* Cổ chéo hình chữ Y vạt trái đè lên vạt phải */}
                <path d="M184 158 L226 250 L236 236 L194 148 Z" fill={`url(#${uid}-inner-grad)`} stroke={`url(#${uid}-gold-trim)`} strokeWidth="2" />
                <path d="M216 158 L174 250 L164 236 L206 148 Z" fill="none" stroke={`url(#${uid}-gold-trim)`} strokeWidth="1.4" />
                {/* Thắt lưng to bản */}
                <g className={`silk-ribbon-${uid}`}>
                  <rect x="170" y="250" width="60" height="13" rx="3" fill={`url(#${uid}-sash-grad)`} stroke={`url(#${uid}-gold-trim)`} strokeWidth="1.2" />
                  <path d="M195 263 L190 388 L198 391 L201 263 Z" fill={`url(#${uid}-sash-grad)`} />
                </g>
              </g>
            )}

            {/* 6. ÁO VIÊN LĨNH */}
            {isVienLinh && (
              <g id="ao-vien-linh-garment">
                <path
                  d={isFemale
                    ? "M166 174 L184 158 L216 158 L234 174 L246 462 Q200 480 154 462 Z"
                    : "M154 174 L178 158 L222 158 L246 174 L258 472 Q200 490 142 472 Z"
                  }
                  fill={robeShadow}
                  opacity="0.3"
                  transform="translate(1.4, 2)"
                  className={`silk-hem-${uid}`}
                />
                <path
                  d={isFemale
                    ? "M166 174 L184 158 L216 158 L234 174 L246 462 Q200 480 154 462 Z"
                    : "M154 174 L178 158 L222 158 L246 174 L258 472 Q200 490 142 472 Z"
                  }
                  fill={`url(#${uid}-robe-grad)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-hem-${uid}`}
                />
                <path
                  d={isFemale
                    ? "M166 174 L184 158 L216 158 L234 174 L246 462 Q200 480 154 462 Z"
                    : "M154 174 L178 158 L222 158 L246 174 L258 472 Q200 490 142 472 Z"
                  }
                  fill={`url(#${uid}-silk-sheen)`}
                  className={`silk-hem-${uid} silk-sheen-${uid}`}
                />
                {/* Cổ tròn viên lĩnh cài khuy vai phải */}
                <path d="M184 156 Q200 172 216 156 Q200 148 184 156 Z" fill={`url(#${uid}-inner-grad)`} stroke={`url(#${uid}-gold-trim)`} strokeWidth="2.4" />
                <path d="M216 156 Q226 164 236 182" fill="none" stroke={`url(#${uid}-gold-trim)`} strokeWidth="2" />
                <circle cx="228" cy="172" r="3" fill={`url(#${uid}-gold-trim)`} />
                {/* Bổ tử ngực */}
                <rect x="184" y="186" width="32" height="32" rx="4" fill="none" stroke={`url(#${uid}-gold-trim)`} strokeWidth="1.6" strokeDasharray="3 2" />
              </g>
            )}

            {/* 7. ÁO DÀI (QUỐC PHỤC HIỆN ĐẠI / TÂN THỜI) */}
            {isAoDai && (
              <g id="ao-dai-garment">
                {/* THÂN ÁO ÔM SÁT ĐƯỜNG CONG, DÁNG ĐỒNG HỒ CÁT, TÀ CHẠM ĐẤT - LỚP BÓNG OFFSET */}
                <path
                  d={isFemale
                    ? "M168 174 L184 158 L216 158 L232 174 L222 250 L246 605 Q200 622 154 605 L178 250 Z"
                    : "M156 174 L178 158 L222 158 L244 174 L234 260 L252 510 Q200 526 148 510 L166 260 Z"
                  }
                  fill={robeShadow}
                  opacity="0.28"
                  transform="translate(1.5, 2.5)"
                  className={`silk-flap-${uid}`}
                />
                {/* TÀ ÁO DÀI CHÍNH LỤA TƠ TẰM BAY NHẸ */}
                <path
                  d={isFemale
                    ? "M168 174 L184 158 L216 158 L232 174 L222 250 L246 605 Q200 622 154 605 L178 250 Z"
                    : "M156 174 L178 158 L222 158 L244 174 L234 260 L252 510 Q200 526 148 510 L166 260 Z"
                  }
                  fill={`url(#${uid}-robe-grad)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-flap-${uid}`}
                />
                {/* LỚP THE SA LỤA OFFSET TẠO CHIỀU SÂU ĐA TẦNG VẢI */}
                <path
                  d={isFemale
                    ? "M170 176 L184 160 L216 160 L230 176 L220 250 L243 602 Q200 619 157 602 L180 250 Z"
                    : "M158 176 L178 160 L222 160 L242 176 L232 260 L249 507 Q200 523 151 507 L168 260 Z"
                  }
                  fill={robeLight}
                  className={`silk-offset-${uid}`}
                />
                {/* LỚP ÁNH SÁNG THE ÓNG ÁNH */}
                <path
                  d={isFemale
                    ? "M168 174 L184 158 L216 158 L232 174 L222 250 L246 605 Q200 622 154 605 L178 250 Z"
                    : "M156 174 L178 158 L222 158 L244 174 L234 260 L252 510 Q200 526 148 510 L166 260 Z"
                  }
                  fill={`url(#${uid}-silk-sheen)`}
                  className={`silk-flap-${uid} silk-sheen-${uid}`}
                />
                {/* ĐƯỜNG XẺ TÀ CAO 2 BÊN HÔNG BẮT ĐẦU TỪ EO */}
                <path
                  d={isFemale ? "M178 250 L154 605" : "M166 260 L148 510"}
                  stroke={`url(#${uid}-gold-trim)`}
                  strokeWidth="2"
                  strokeOpacity="0.85"
                  className={`silk-flap-${uid}`}
                />
                <path
                  d={isFemale ? "M222 250 L246 605" : "M234 260 L252 510"}
                  stroke={`url(#${uid}-gold-trim)`}
                  strokeWidth="2"
                  strokeOpacity="0.85"
                  className={`silk-flap-${uid}`}
                />
                {/* Sống áo giữa tà lụa bay nhẹ */}
                <line x1="200" y1="174" x2="200" y2={isFemale ? 614 : 518} stroke="rgba(255,255,255,0.22)" strokeWidth="1.4" className={`silk-flap-${uid}`} />

                {/* Cổ áo dài đứng thấp */}
                <path
                  d="M186 158 Q200 166 214 158 L210 178 L190 178 Z"
                  fill={`url(#${uid}-inner-grad)`}
                  stroke={`url(#${uid}-gold-trim)`}
                  strokeWidth="1.6"
                />
                <path d="M200 162 Q214 170 226 188" fill="none" stroke={`url(#${uid}-gold-trim)`} strokeWidth="1.4" />
                <circle cx="208" cy="168" r="2.2" fill={`url(#${uid}-gold-trim)`} />
                <circle cx="220" cy="180" r="2.2" fill={`url(#${uid}-gold-trim)`} />
              </g>
            )}

            {/* 8. ÁO NGŨ THÂN (TAY CHẼN) */}
            {isNguThan && (
              <g id="ao-ngu-than-garment">
                {/* Lớp bóng offset */}
                <path
                  d={isFemale
                    ? "M168 174 L184 158 L216 158 L232 174 L242 465 Q200 484 158 465 Z"
                    : "M156 174 L178 158 L222 158 L244 174 L254 472 Q200 490 146 472 Z"
                  }
                  fill={robeShadow}
                  opacity="0.32"
                  transform="translate(1.4, 2)"
                  className={`silk-hem-${uid}`}
                />
                <path
                  d={isFemale
                    ? "M168 174 L184 158 L216 158 L232 174 L242 465 Q200 484 158 465 Z"
                    : "M156 174 L178 158 L222 158 L244 174 L254 472 Q200 490 146 472 Z"
                  }
                  fill={`url(#${uid}-robe-grad)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-hem-${uid}`}
                />
                {/* Lớp the thâm óng ánh */}
                <path
                  d={isFemale
                    ? "M168 174 L184 158 L216 158 L232 174 L242 465 Q200 484 158 465 Z"
                    : "M156 174 L178 158 L222 158 L244 174 L254 472 Q200 490 146 472 Z"
                  }
                  fill={`url(#${uid}-silk-sheen)`}
                  className={`silk-hem-${uid} silk-sheen-${uid}`}
                />
                {/* CỔ ĐỨNG (LẬP LĨNH) CAO TRANG NGHIÊM */}
                <rect x="186" y="148" width="28" height="15" rx="3" fill={`url(#${uid}-inner-grad)`} stroke={`url(#${uid}-gold-trim)`} strokeWidth="1.8" />
                {/* CÀI 5 NÚT BÊN PHẢI (NGŨ THƯỜNG) */}
                <path d="M200 156 Q215 167 226 189 L222 265" fill="none" stroke={`url(#${uid}-gold-trim)`} strokeWidth="1.6" />
                <circle cx="201" cy="156" r="3" fill={`url(#${uid}-gold-trim)`} />
                <circle cx="212" cy="168" r="3" fill={`url(#${uid}-gold-trim)`} />
                <circle cx="222" cy="186" r="3" fill={`url(#${uid}-gold-trim)`} />
                <circle cx="224" cy="218" r="3" fill={`url(#${uid}-gold-trim)`} />
                <circle cx="224" cy="250" r="3" fill={`url(#${uid}-gold-trim)`} />
                <line x1="200" y1="162" x2="200" y2="470" stroke="rgba(255,255,255,0.2)" strokeWidth="1.4" className={`silk-hem-${uid}`} />
              </g>
            )}

            {/* 9. ÁO TẤC (TAY THỤNG) */}
            {isAoTac && (
              <g id="ao-tac-garment">
                {/* Lớp bóng offset */}
                <path
                  d={isFemale
                    ? "M166 174 L184 158 L216 158 L234 174 L246 470 Q200 488 154 470 Z"
                    : "M154 174 L178 158 L222 158 L246 174 L258 478 Q200 495 142 478 Z"
                  }
                  fill={robeShadow}
                  opacity="0.32"
                  transform="translate(1.4, 2)"
                  className={`silk-hem-${uid}`}
                />
                <path
                  d={isFemale
                    ? "M166 174 L184 158 L216 158 L234 174 L246 470 Q200 488 154 470 Z"
                    : "M154 174 L178 158 L222 158 L246 174 L258 478 Q200 495 142 478 Z"
                  }
                  fill={`url(#${uid}-robe-grad)`}
                  stroke="#261C14"
                  strokeWidth="1.2"
                  className={`silk-hem-${uid}`}
                />
                {/* Lớp gấm lụa bề thế óng ánh */}
                <path
                  d={isFemale
                    ? "M166 174 L184 158 L216 158 L234 174 L246 470 Q200 488 154 470 Z"
                    : "M154 174 L178 158 L222 158 L246 174 L258 478 Q200 495 142 478 Z"
                  }
                  fill={`url(#${uid}-silk-sheen)`}
                  className={`silk-hem-${uid} silk-sheen-${uid}`}
                />
                <rect x="186" y="148" width="28" height="15" rx="3" fill={`url(#${uid}-inner-grad)`} stroke={`url(#${uid}-gold-trim)`} strokeWidth="1.8" />
                <circle cx="201" cy="156" r="3" fill={`url(#${uid}-gold-trim)`} />
                <circle cx="212" cy="168" r="3" fill={`url(#${uid}-gold-trim)`} />
                <circle cx="222" cy="186" r="3" fill={`url(#${uid}-gold-trim)`} />
                <circle cx="224" cy="218" r="3" fill={`url(#${uid}-gold-trim)`} />
                <circle cx="224" cy="250" r="3" fill={`url(#${uid}-gold-trim)`} />
                <path d={isFemale ? "M154 470 Q200 488 246 470" : "M142 478 Q200 495 258 478"} fill="none" stroke={`url(#${uid}-gold-trim)`} strokeWidth="2.4" className={`silk-hem-${uid}`} />
              </g>
            )}

            {/* Họa tiết văn hoa nếu có */}
            {pattern !== 'plain' && !isYemVay && (
              <path
                d={isFemale
                  ? "M166 174 L184 158 L216 158 L234 174 L246 470 Q200 488 154 470 Z"
                  : "M154 174 L178 158 L222 158 L246 174 L258 478 Q200 495 142 478 Z"
                }
                fill={`url(#${uid}-pat-${pattern})`}
                opacity="0.85"
                pointerEvents="none"
              />
            )}
          </g>

          {/* ======================================================== */}
          {/* LỚP 6: VÒNG CỔ & PHỤ KIỆN VÙNG CỔ / NGỰC                  */}
          {/* ======================================================== */}
          {hasPearl && (
            <g id="prop-pearl-necklace" filter={`url(#${uid}-soft-shadow)`}>
              <path d="M184 165 Q200 185 216 165" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeDasharray="3.5 4" />
              <circle cx="200" cy="177" r="3.4" fill="#FFFDE8" stroke="#D4A043" strokeWidth="0.9" />
            </g>
          )}

          {hasHeadphones && (
            <g id="prop-headphones" transform="translate(164, 118)">
              <path d="M4 18 C4 -4, 68 -4, 68 18" fill="none" stroke="#221C18" strokeWidth="4.2" />
              <rect x="0" y="14" width="10" height="16" rx="3" fill="#D4A043" stroke="#FFF" strokeWidth="1" />
              <rect x="62" y="14" width="10" height="16" rx="3" fill="#D4A043" stroke="#FFF" strokeWidth="1" />
            </g>
          )}

          {/* ======================================================== */}
          {/* LỚP 7: MODEL MANNEQUIN CROQUIS (THEO ĐÚNG ẢNH MẪU CỦA USER) */}
          {/* ĐẦU OVAL MANNEQUIN THỜI TRANG, CỔ NGẮN THANH THOÁT VỪA VẶN  */}
          {/* ======================================================== */}
          {isFemale ? (
            /* ===== MODEL NỮ: CROQUIS MANNEQUIN NỮ CAO CẤP (10-HEADS) ===== */
            <g id="female-croquis-head">
              {/* Cổ nữ gọn gàng, thanh thoát vừa vặn nối liền vai */}
              <path
                d="M195 138 L193 162 Q200 166 207 162 L205 138 Z"
                fill={`url(#${uid}-skin-female)`}
                stroke="#38291F"
                strokeWidth="0.9"
              />

              {/* Choker đen quàng cổ tao nhã quai mảnh ôm sát */}
              <path
                d="M194 148 Q200 151 206 148"
                fill="none"
                stroke="#140D08"
                strokeWidth="2.2"
              />
              {/* Nơ choker nhỏ xinh */}
              <circle cx="200" cy="150" r="1.7" fill="#140D08" />

              {/* Xương quai xanh (Collarbones) mảnh mai */}
              <path d="M182 166 Q193 170 198 166" fill="none" stroke="#D59B7C" strokeWidth="1.2" />
              <path d="M218 166 Q207 170 202 166" fill="none" stroke="#D59B7C" strokeWidth="1.2" />

              {/* ĐẦU MANNEQUIN THỜI TRANG HÌNH OVAL / EGG HOÀN HẢO (Faceless Croquis đúng như ảnh mẫu) */}
              {/* Bóng đổ đầu mannequin */}
              <path
                d="M184 100 C184 74, 216 74, 216 100 C216 124, 208 142, 200 142 C192 142, 184 124, 184 100 Z"
                fill={`url(#${uid}-skin-female)`}
                stroke="#38291F"
                strokeWidth="1.2"
                filter={`url(#${uid}-soft-shadow)`}
              />

              {/* Vệt sáng trung tâm trên gương mặt phác thảo */}
              <ellipse cx="200" cy="108" rx="7" ry="18" fill={`url(#${uid}-skin-female-highlight)`} pointerEvents="none" />

              {/* Đường nét phác thảo đường cằm tinh tế (Fine Chin Sketch Stroke) */}
              <path d="M192 130 Q200 139 208 130" fill="none" stroke="#D59B7C" strokeWidth="1" />

              {/* Hoa cài tóc thanh lịch nếu chọn */}
              {hasHairFlower && (
                <g id="prop-hair-flower" transform="translate(208, 80)">
                  <circle cx="0" cy="0" r="4.5" fill="#E8617D" />
                  <circle cx="0" cy="0" r="1.8" fill="#FFE082" />
                  <circle cx="-3" cy="-3" r="2.8" fill="#FF8BA7" opacity="0.85" />
                  <circle cx="3" cy="-3" r="2.8" fill="#FF8BA7" opacity="0.85" />
                </g>
              )}
            </g>
          ) : (
            /* ===== MODEL NAM: CROQUIS MANNEQUIN NAM ĐĨNH ĐẠC (9-HEADS) ===== */
            <g id="male-croquis-head">
              {/* Cổ nam gọn gàng, dày dặn, đĩnh đạc nối liền vai */}
              <path
                d="M191 136 L189 164 Q200 168 211 164 L209 136 Z"
                fill={`url(#${uid}-skin-male)`}
                stroke="#38291F"
                strokeWidth="0.9"
              />
              <line x1="193" y1="142" x2="193" y2="160" stroke="#BC8C6E" strokeWidth="1" />
              <line x1="207" y1="142" x2="207" y2="160" stroke="#BC8C6E" strokeWidth="1" />

              {/* Đầu Mannequin Nam góc cạnh, quai hàm đĩnh đạc */}
              <path
                d="M182 96 C182 72, 218 72, 218 96 C218 118, 212 140, 200 140 C188 140, 182 118, 182 96 Z"
                fill={`url(#${uid}-skin-male)`}
                stroke="#38291F"
                strokeWidth="1.3"
                filter={`url(#${uid}-soft-shadow)`}
              />
              <path d="M186 116 L192 132 L200 138 L208 132 L214 116" fill="none" stroke="#BC8C6E" strokeWidth="1" />

              {/* KHĂN ĐÓNG TRUYỀN THỐNG ĐÀNG TRONG */}
              <g id="male-turban">
                <path
                  d="M178 88 C178 68, 222 68, 222 88 C222 96, 178 96, 178 88 Z"
                  fill={`url(#${uid}-male-turban)`}
                  stroke={`url(#${uid}-gold-trim)`}
                  strokeWidth="1.3"
                />
                <path d="M180 84 Q200 78 220 84" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
                <path d="M182 90 Q200 85 218 90" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <ellipse cx="200" cy="70" rx="10" ry="7" fill={`url(#${uid}-male-turban)`} />
                <circle cx="200" cy="70" r="2.8" fill={`url(#${uid}-gold-trim)`} />
              </g>
            </g>
          )}

          {/* ======================================================== */}
          {/* LỚP 8: KÍNH RÂM HOẶC NÓN BUCKET GEN Z                     */}
          {/* ======================================================== */}
          {hasSunglasses && (
            <g id="prop-sunglasses" filter={`url(#${uid}-soft-shadow)`}>
              <rect x="185" y="102" width="12" height="8" rx="3" fill="#140D08" stroke="#D4A043" strokeWidth="1" />
              <rect x="203" y="102" width="12" height="8" rx="3" fill="#140D08" stroke="#D4A043" strokeWidth="1" />
              <line x1="197" y1="104" x2="203" y2="104" stroke="#D4A043" strokeWidth="1.2" />
              <line x1="181" y1="104" x2="185" y2="104" stroke="#D4A043" strokeWidth="1" />
              <line x1="215" y1="104" x2="219" y2="104" stroke="#D4A043" strokeWidth="1" />
            </g>
          )}

          {hasBucketHat && (
            <g id="prop-bucket-hat" transform="translate(172, 62)" filter={`url(#${uid}-soft-shadow)`}>
              <path d="M6 24 L14 8 L42 8 L50 24 Z" fill="#2E231C" stroke="#78976A" strokeWidth="1.4" />
              <ellipse cx="28" cy="24" rx="28" ry="6" fill="#241A13" stroke="#D4A043" strokeWidth="1.2" />
              <path d="M16 16 L40 16" stroke="#D4A043" strokeWidth="1.8" strokeDasharray="3 2" />
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
};

/**
 * Trích xuất hình ảnh thực tế của người mẫu 2D croquis vừa được phối màu/phụ kiện
 * Trả về ảnh PNG chất lượng cao hoặc SVG data URL
 */
export async function captureCroquisModelImage(): Promise<string> {
  const svgElement = document.getElementById('vietphuc-character-svg') as SVGSVGElement | null;
  if (!svgElement) return '';

  try {
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);

    return new Promise((resolve) => {
      const img = new Image();
      const fallbackTimer = setTimeout(() => {
        resolve(svgDataUrl);
      }, 450);

      img.onload = () => {
        clearTimeout(fallbackTimer);
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 600;
          canvas.height = 850;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#F9F6F0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const pngDataUrl = canvas.toDataURL('image/png');
            resolve(pngDataUrl);
            return;
          }
        } catch {
          // fallback
        }
        resolve(svgDataUrl);
      };

      img.onerror = () => {
        clearTimeout(fallbackTimer);
        resolve(svgDataUrl);
      };

      img.src = svgDataUrl;
    });
  } catch (err) {
    console.warn('Lỗi khi capture người mẫu croquis:', err);
    return '';
  }
}
