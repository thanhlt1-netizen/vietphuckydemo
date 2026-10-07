import React from 'react';
import { AccessoryId } from '../../../types/customization';

interface AccessoriesLayerProps {
  hasAccessory: (id: AccessoryId) => boolean;
  costumeKey?: string;
  isMale?: boolean;
}

/**
 * [Z5]: ACCESSORIES (Phụ Kiện Cung Đình & Gen Z Đương Đại)
 * - Khăn Đóng / Khăn Xếp, Mấn Nhung
 * - Nón Quai Thao / Nón Lá
 * - Ngọc Bội (Jade Pendant): Dải ngọc bội ngọc bích viền vàng treo bên hông
 * - 11 Phụ kiện thời thượng: Kính râm, Quạt xếp, Túi tote, Sneakers, Chuỗi ngọc, v.v.
 */
export const AccessoriesLayer: React.FC<AccessoriesLayerProps> = ({ 
  hasAccessory, 
  costumeKey,
}) => {
  // Ngọc bội truyền thống (Z5): Xuất hiện cho các trang phục cung đình (Áo Tấc, Nhật Bình, Viên Lĩnh, Giao Lĩnh)
  // hoặc khi có phụ kiện chuỗi hạt / ngọc
  const showNgocBoi = 
    hasAccessory('beaded_bracelet') || 
    costumeKey === 'ao-nhat-binh' || 
    costumeKey === 'ao-tac' || 
    costumeKey === 'ao-vien-linh';

  return (
    <g id="layer-z5-accessories">
      {/* 1. Kính râm retro bo góc mềm */}
      {hasAccessory('sunglasses') && (
        <g id="acc-sunglasses">
          <rect x="187" y="87" width="11" height="7" rx="3.5" fill="#120B07" stroke="#D4A043" strokeWidth="0.9" />
          <rect x="202" y="87" width="11" height="7" rx="3.5" fill="#120B07" stroke="#D4A043" strokeWidth="0.9" />
          <line x1="198" y1="90" x2="202" y2="90" stroke="#D4A043" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      )}

      {/* 2. Quạt xếp dát vàng cầm tay bo tròn nan quạt */}
      {hasAccessory('folding_fan') && (
        <g id="acc-folding-fan">
          <path d="M256,300 L286,262 A26,26 0 0,0 248,262 Z" fill="#D4A043" stroke="#BA3424" strokeWidth="0.9" strokeLinejoin="round" />
          <line x1="256" y1="300" x2="267" y2="262" stroke="#7A4C1E" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="256" y1="300" x2="278" y2="270" stroke="#7A4C1E" strokeWidth="0.8" strokeLinecap="round" />
          <path d="M256,300 Q260,316 258,328" stroke="#BA3424" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* 3. Túi tote thổ cẩm đeo vai bo góc mềm */}
      {hasAccessory('tote_bag') && (
        <g id="acc-tote-bag">
          <rect x="128" y="240" width="24" height="34" rx="6" fill="#78482E" stroke="#D4A043" strokeWidth="0.8" />
          <path d="M134,240 Q148,180 162,175" stroke="#58734D" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <rect x="131" y="270" width="18" height="36" rx="3" fill="none" stroke="#F3C96B" strokeWidth="0.8" strokeDasharray="2,2" />
        </g>
      )}

      {/* 4. Giày sneaker đương đại bo tròn đế */}
      {hasAccessory('sneakers') && (
        <g id="acc-sneakers">
          <rect x="150" y="588" width="28" height="14" rx="6" fill="#F0E7D8" stroke="#D4A043" strokeWidth="0.8" />
          <rect x="222" y="588" width="28" height="14" rx="6" fill="#F0E7D8" stroke="#D4A043" strokeWidth="0.8" />
          <line x1="156" y1="594" x2="172" y2="594" stroke="#58734D" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="228" y1="594" x2="244" y2="594" stroke="#58734D" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      )}

      {/* 5. Chuỗi ngọc trai cổ điển bo tròn mềm mại */}
      {hasAccessory('pearl_necklace') && (
        <g id="acc-pearl-necklace">
          <path
            d="M189,146 Q200,166 211,146"
            stroke="#FFFFFF"
            strokeWidth="2.6"
            strokeDasharray="2.5,3"
            fill="none"
            filter="drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* 6. Hoa cài tóc tơ tằm */}
      {hasAccessory('hair_flower') && (
        <g id="acc-hair-flower">
          <circle cx="218" cy="62" r="5.5" fill="#E26D75" stroke="#FFFFFF" strokeWidth="0.8" />
          <circle cx="218" cy="62" r="2.2" fill="#F3C96B" />
        </g>
      )}

      {/* 7. Tai nghe Y2K đeo cổ bo tròn */}
      {hasAccessory('headphones') && (
        <g id="acc-headphones">
          <path d="M180,134 Q200,146 220,134" stroke="#C0C0C0" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <rect x="177" y="127" width="8" height="14" rx="4" fill="#EAE5DC" stroke="#333333" strokeWidth="0.8" />
          <rect x="215" y="127" width="8" height="14" rx="4" fill="#EAE5DC" stroke="#333333" strokeWidth="0.8" />
        </g>
      )}

      {/* 8. Túi kẹp nách baguette bo tròn */}
      {hasAccessory('baguette_bag') && (
        <g id="acc-baguette-bag">
          <rect x="134" y="240" width="24" height="15" rx="6" fill="#3D2817" stroke="#D4A043" strokeWidth="0.9" />
          <path d="M137,240 Q145,214 153,240" stroke="#D4A043" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* 9. Vòng chuỗi ngọc ngũ hành */}
      {hasAccessory('beaded_bracelet') && (
        <g id="acc-beaded-bracelet">
          <ellipse cx="142" cy="303" rx="4.5" ry="2.2" stroke="#58734D" strokeWidth="2.2" fill="none" />
        </g>
      )}

      {/* 10. Nón bucket thổ cẩm bo tròn viền */}
      {hasAccessory('bucket_hat') && (
        <g id="acc-bucket-hat">
          <path d="M180,62 Q200,59 220,62 L226,76 Q200,78 174,76 Z" fill="#465A3D" stroke="#D4A043" strokeWidth="0.9" strokeLinejoin="round" />
          <ellipse cx="200" cy="76" rx="28" ry="7" fill="#3A4D32" stroke="#D4A043" strokeWidth="0.9" />
        </g>
      )}

      {/* 11. Bốt chunky streetwear bo tròn mũi giày */}
      {hasAccessory('chunky_boots') && (
        <g id="acc-chunky-boots">
          <rect x="148" y="580" width="24" height="24" rx="6" fill="#1C140E" stroke="#58734D" strokeWidth="1.2" />
          <rect x="228" y="580" width="24" height="24" rx="6" fill="#1C140E" stroke="#58734D" strokeWidth="1.2" />
          <rect x="146" y="602" width="28" height="7" rx="3.5" fill="#3A281C" />
          <rect x="226" y="602" width="28" height="7" rx="3.5" fill="#3A281C" />
        </g>
      )}

      {/* [Z5 TRUYỀN THỐNG]: NGỌC BỘI HOÀNG TỘC (JADE PENDANT) */}
      {showNgocBoi && (
        <g id="acc-ngoc-boi">
          {/* Dây lụa treo ngọc bội từ thắt lưng W1 */}
          <line x1="222" y1="272" x2="222" y2="295" stroke="#BA3424" strokeWidth="1.2" strokeLinecap="round" />
          {/* Miếng ngọc bích chạm khắc hoa sen / song phụng */}
          <circle cx="222" cy="302" r="5" fill="#3D7B52" stroke="#D4A043" strokeWidth="0.8" />
          <circle cx="222" cy="302" r="2" fill="#58A874" />
          {/* Tua rua đỏ may mắn buông dài */}
          <line x1="222" y1="307" x2="222" y2="330" stroke="#BA3424" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="222" cy="331" r="1.5" fill="#D4A043" />
        </g>
      )}
    </g>
  );
};
