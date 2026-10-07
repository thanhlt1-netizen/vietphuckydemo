import React from 'react';

export interface RiggingAnchors {
  N1: { x: number; y: number; label: string };
  S1: { x: number; y: number; label: string };
  S2: { x: number; y: number; label: string };
  W1: { x: number; y: number; label: string };
  H1: { x: number; y: number; label: string };
  H2: { x: number; y: number; label: string };
  F1: { x: number; y: number; label: string };
  F2: { x: number; y: number; label: string };
  F3: { x: number; y: number; label: string };
  F4: { x: number; y: number; label: string };
  F5: { x: number; y: number; label: string };
}

export const RIGGING_ANCHORS: RiggingAnchors = {
  N1: { x: 200, y: 142, label: 'N1 (Collar Anchor / Chân cổ)' },
  S1: { x: 146, y: 160, label: 'S1 (Left Shoulder / Khớp vai trái)' },
  S2: { x: 254, y: 160, label: 'S2 (Right Shoulder / Khớp vai phải)' },
  W1: { x: 200, y: 268, label: 'W1 (Waist Anchor / Xẻ tà & Thắt vạt)' },
  H1: { x: 200, y: 440, label: 'H1 (Knee Hem / Ngang gối)' },
  H2: { x: 200, y: 585, label: 'H2 (Ankle Hem / Mu bàn chân)' },
  F1: { x: 200, y: 152, label: 'F1 (Khuy cổ)' },
  F2: { x: 214, y: 168, label: 'F2 (Khuy quai xanh)' },
  F3: { x: 228, y: 192, label: 'F3 (Khuy nách)' },
  F4: { x: 228, y: 222, label: 'F4 (Khuy sườn trên)' },
  F5: { x: 228, y: 258, label: 'F5 (Khuy sườn eo)' },
};

/**
 * Hiển thị hệ thống Invisible Rigging Anchors khi người dùng bật chế độ kiểm tra tọa độ
 */
export const RiggingAnchorsOverlay: React.FC = () => {
  return (
    <g id="layer-rigging-anchors" className="transition-opacity duration-300">
      {/* Đường nối khung xương rigging chính */}
      <line x1={RIGGING_ANCHORS.S1.x} y1={RIGGING_ANCHORS.S1.y} x2={RIGGING_ANCHORS.S2.x} y2={RIGGING_ANCHORS.S2.y} stroke="#00FFFF" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
      <line x1={RIGGING_ANCHORS.N1.x} y1={RIGGING_ANCHORS.N1.y} x2={RIGGING_ANCHORS.W1.x} y2={RIGGING_ANCHORS.W1.y} stroke="#00FFFF" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
      <line x1={RIGGING_ANCHORS.W1.x} y1={RIGGING_ANCHORS.W1.y} x2={RIGGING_ANCHORS.H1.x} y2={RIGGING_ANCHORS.H1.y} stroke="#00FFFF" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
      <line x1={RIGGING_ANCHORS.H1.x} y1={RIGGING_ANCHORS.H1.y} x2={RIGGING_ANCHORS.H2.x} y2={RIGGING_ANCHORS.H2.y} stroke="#00FFFF" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
      
      {/* Đường nẹp khuy F1 -> F5 */}
      <path
        d={`M${RIGGING_ANCHORS.F1.x},${RIGGING_ANCHORS.F1.y} Q${RIGGING_ANCHORS.F2.x},${RIGGING_ANCHORS.F2.y} ${RIGGING_ANCHORS.F3.x},${RIGGING_ANCHORS.F3.y} L${RIGGING_ANCHORS.F4.x},${RIGGING_ANCHORS.F4.y} L${RIGGING_ANCHORS.F5.x},${RIGGING_ANCHORS.F5.y}`}
        fill="none"
        stroke="#FFB800"
        strokeWidth="1.2"
        strokeDasharray="2,2"
      />

      {/* Render từng mỏ neo với halo phát sáng */}
      {Object.entries(RIGGING_ANCHORS).map(([key, point]) => (
        <g key={key}>
          <circle cx={point.x} cy={point.y} r="6" fill="#00FFFF" opacity="0.25" />
          <circle cx={point.x} cy={point.y} r="2.5" fill="#00FFFF" stroke="#FFFFFF" strokeWidth="0.8" />
          <text
            x={point.x + 8}
            y={point.y + 4}
            fill="#FFFFFF"
            fontSize="9"
            fontFamily="sans-serif"
            fontWeight="bold"
            filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))"
          >
            {key}
          </text>
        </g>
      ))}
    </g>
  );
};

interface ZLayerProps {
  costumeKey: string;
  isMale: boolean;
  isBreezeActive: boolean;
  innerCollarColor: string;
  isSolid: boolean;
  pattern: string;
}

/**
 * [Z1]: UNDERGARMENTS (Nội y & Lớp Lót Cổ Truyền)
 * - Yếm: Hình quả trám, buộc dây quanh cổ (N1) và lưng, lộ vai trang nhã
 * - Áo Lót: Cổ áo trắng/lụa lót bên trong bảo đảm thẩm mỹ và văn hóa
 */
export const Z1Undergarments: React.FC<{
  costumeKey: string;
  innerCollarColor: string;
}> = ({ costumeKey, innerCollarColor }) => {
  if (costumeKey === 'ao-tu-than' || costumeKey === 'yem-vay') {
    return (
      <g id="layer-z1-undergarments">
        {/* Yếm đào quả trám: Buộc ở chân cổ N1 (200, 142) và ôm xuống eo W1 (200, 268) */}
        <path
          d="M186,148 Q200,136 214,148 C222,180 226,215 224,248 C210,250 190,250 176,248 C174,215 178,180 186,148 Z"
          fill={innerCollarColor}
          stroke="#D4A043"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Dây yếm mềm buộc quanh cổ N1 */}
        <path d="M192,142 Q200,132 208,142" stroke={innerCollarColor} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* Họa tiết hoa sen tâm yếm thêu vàng */}
        <circle cx="200" cy="180" r="4.5" fill="none" stroke="#D4A043" strokeWidth="1" />
        <path d="M200,175 L200,185 M195,180 L205,180" stroke="#D4A043" strokeWidth="0.8" strokeLinecap="round" />
      </g>
    );
  }

  if (costumeKey === 'ao-giao-linh') {
    return (
      <g id="layer-z1-undergarments">
        {/* Áo lót trắng giao lĩnh: Giao chữ Y Left over Right từ chân cổ N1 */}
        <path
          d="M182,142 C188,160 196,182 200,196 C204,182 212,160 218,142 C212,138 206,138 200,170 C194,138 188,138 182,142 Z"
          fill={innerCollarColor}
          stroke="#D4A043"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path d="M184,146 Q194,172 203,196" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.8" fill="none" strokeLinecap="round" />
      </g>
    );
  }

  // Áo lót cổ đứng trắng bên trong cho Áo Dài, Ngũ Thân, Áo Tấc, Viên Lĩnh, Bà Ba
  return (
    <g id="layer-z1-undergarments">
      <rect x="188" y="136" width="24" height="18" rx="6" fill={innerCollarColor} stroke="#D4A043" strokeWidth="0.8" />
      <path d="M190,144 Q200,146 210,144" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" fill="none" strokeLinecap="round" />
    </g>
  );
};

/**
 * [Z2]: LOWER GARMENTS (Hạ Y: Quần Lụa Ống Suông hoặc Váy Đụp Xếp Ly)
 * - Tọa độ: Bắt đầu từ Waist Anchor W1 (y=268) thả dài đến Ankle Anchor H2 (y=585)
 * - Đúng phân loại: Áo Giao Lĩnh, Áo Tứ Thân, Yếm Váy -> Mặc Váy (Váy lụa / Váy đụp), không mặc quần
 * - Áo Dài, Ngũ Thân, Bà Ba, Viên Lĩnh -> Quần lụa ống suông
 * - Dưới gấu quần/váy có Đôi Hài Thêu Cung Đình / Giày Gấm che kín hoàn toàn bàn chân
 */
export const Z2LowerGarments: React.FC<{
  costumeKey: string;
  isBreezeActive: boolean;
  isMale?: boolean;
}> = ({ costumeKey, isBreezeActive }) => {
  const isSkirt = costumeKey === 'ao-giao-linh' || costumeKey === 'ao-tu-than' || costumeKey === 'yem-vay';

  return (
    <g id="layer-z2-lower-garments">
      {isSkirt ? (
        /* Váy lụa / Váy đụp tối màu xếp ly mềm mại buông rủ từ W1 (268) tới H2 (585) */
        <g id="lower-skirt-garment">
          <path
            d={`M164,268 C160,380 146,505 ${isBreezeActive ? '136' : '140'},588 C176,596 224,596 ${isBreezeActive ? '264' : '260'},588 C254,505 240,380 236,268 Z`}
            fill="url(#silk-sheen-bottom)"
            stroke="#1A120D"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          <path d="M180,310 Q176,460 172,586" stroke="#000000" strokeWidth="1" opacity="0.35" fill="none" strokeLinecap="round" />
          <path d="M200,300 Q200,460 200,588" stroke="#000000" strokeWidth="1.2" opacity="0.4" fill="none" strokeLinecap="round" />
          <path d="M220,310 Q224,460 228,586" stroke="#000000" strokeWidth="1" opacity="0.35" fill="none" strokeLinecap="round" />
        </g>
      ) : (
        /* Quần lụa ống suông rộng rãi quý phái từ W1 (268) tới H2 (585) */
        <g id="lower-pants-garment">
          <path
            d={`M170,268 C164,375 158,485 ${isBreezeActive ? '152' : '156'},588 C166,592 186,592 195,588 C197,485 198,375 198,335 Z`}
            fill="url(#silk-sheen-bottom)"
            stroke="#1A120D"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          <path
            d={`M230,268 C236,375 242,485 ${isBreezeActive ? '248' : '244'},588 C234,592 214,592 205,588 C203,485 202,375 202,335 Z`}
            fill="url(#silk-sheen-bottom)"
            stroke="#1A120D"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          <path d="M178,350 Q176,465 175,578" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.3" fill="none" strokeLinecap="round" />
          <path d="M222,350 Q224,465 225,578" stroke="#000000" strokeWidth="0.8" opacity="0.3" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* Đôi Hài Thêu Lụa / Giày Gấm Truyền Thống che kín hoàn toàn bàn chân */}
      <g id="traditional-shoes">
        <ellipse cx="174" cy="590" rx="15" ry="7" fill="#1C140E" stroke="#D4A043" strokeWidth="0.8" />
        <path d="M163,590 Q174,586 185,590" stroke="#BA3424" strokeWidth="0.9" fill="none" />
        <circle cx="174" cy="588" r="1.8" fill="#D4A043" />

        <ellipse cx="226" cy="590" rx="15" ry="7" fill="#1C140E" stroke="#D4A043" strokeWidth="0.8" />
        <path d="M215,590 Q226,586 237,590" stroke="#BA3424" strokeWidth="0.9" fill="none" />
        <circle cx="226" cy="588" r="1.8" fill="#D4A043" />
      </g>
    </g>
  );
};

/**
 * [Z3]: MAIN TUNIC / ROBE (Thân Áo Chính)
 * - Tuân thủ nghiêm ngặt quy tắc phom dáng từng bộ theo taxonomy di sản:
 *   + Áo Dài: Cổ đứng, tay raglan từ S1/S2, xẻ tà chính xác tại Waist Anchor W1 (268)
 *   + Áo Ngũ Thân: Dáng suông không ôm sát eo, 5 nút cài ngọc (Ngũ Thường) chạy từ cổ qua nách phải (F1 -> F5)
 *   + Áo Giao Lĩnh: Cổ chéo bắt buộc TRÁI ĐÈ LÊN PHẢI (Left over Right), tay thụng rủ mềm
 *   + Áo Tứ Thân: 4 vạt, 2 vạt trước buộc nút nơ tại W1 để lộ Yếm Z1 và Váy Z2
 *   + Áo Bà Ba, Áo Viên Lĩnh, Yếm Váy
 */
export const Z3MainTunic: React.FC<ZLayerProps> = ({
  costumeKey,
  isMale,
  isBreezeActive,
  isSolid,
  pattern,
}) => {
  // Áo Nhật Bình & Áo Tấc là Z4 (Outerwear), ở Z3 chỉ hiển thị áo nền nếu có hoặc chuyển sang Z4
  if (costumeKey === 'ao-nhat-binh' || costumeKey === 'ao-tac') {
    return (
      <g id="layer-z3-inner-robe-under-outerwear">
        {/* Lớp áo trong trang nghiêm lót dưới áo khoác đại lễ Z4 */}
        <path
          d="M164,158 Q200,154 236,158 C238,280 240,400 238,530 C215,534 185,534 162,530 C160,400 162,280 164,158 Z"
          fill="url(#silk-sheen-secondary)"
          opacity="0.9"
          stroke="#1A120D"
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
      </g>
    );
  }

  return (
    <g id="layer-z3-main-tunic">
      {costumeKey === 'ao-ngu-than' ? (
        // === ÁO NGŨ THÂN (NGUYỄN DYNASTY) ===
        // Phom suông rộng rãi không ôm eo, 5 hạt khuy Ngũ Thường F1 -> F5
        <g id="robe-ngu-than">
          {/* Tay chẽn ôm cổ tay mềm mại */}
          <path d="M162,158 C150,205 140,250 136,295 C140,298 143,298 146,300 C154,260 162,230 172,220 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
          <path d="M238,158 C250,205 260,250 264,295 C260,298 257,298 254,300 C246,260 238,230 228,220 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
          {/* Thân áo 5 thân dài quá gối (H1), vạt xòe nhẹ thanh nhã */}
          <path d="M162,158 Q200,154 238,158 C240,280 244,400 242,518 C215,522 185,522 158,518 C156,400 160,280 162,158 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
          
          {/* Đường khuy nẹp lượn cong F1 -> F2 -> F3 -> F4 -> F5 sang sườn phải */}
          <path
            d={`M${RIGGING_ANCHORS.F1.x},${RIGGING_ANCHORS.F1.y} C206,164 212,170 ${RIGGING_ANCHORS.F3.x},${RIGGING_ANCHORS.F3.y} L${RIGGING_ANCHORS.F4.x},${RIGGING_ANCHORS.F4.y} L${RIGGING_ANCHORS.F5.x},${RIGGING_ANCHORS.F5.y}`}
            stroke="#D4A043"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          {/* 5 Hạt khuy ngọc Ngũ Thường (Nhân, Lễ, Nghĩa, Trí, Tín) */}
          <circle cx={RIGGING_ANCHORS.F1.x} cy={RIGGING_ANCHORS.F1.y} r="2.5" fill="#D4A043" stroke="#2A1B14" strokeWidth="0.6" />
          <circle cx={RIGGING_ANCHORS.F2.x} cy={RIGGING_ANCHORS.F2.y} r="2.5" fill="#D4A043" stroke="#2A1B14" strokeWidth="0.6" />
          <circle cx={RIGGING_ANCHORS.F3.x} cy={RIGGING_ANCHORS.F3.y} r="2.5" fill="#D4A043" stroke="#2A1B14" strokeWidth="0.6" />
          <circle cx={RIGGING_ANCHORS.F4.x} cy={RIGGING_ANCHORS.F4.y} r="2.5" fill="#D4A043" stroke="#2A1B14" strokeWidth="0.6" />
          <circle cx={RIGGING_ANCHORS.F5.x} cy={RIGGING_ANCHORS.F5.y} r="2.5" fill="#D4A043" stroke="#2A1B14" strokeWidth="0.6" />
        </g>
      ) : costumeKey === 'ao-giao-linh' ? (
        // === ÁO GIAO LĨNH (LÊ - NGUYỄN) ===
        // Bắt buộc vạt Trái đè lên vạt Phải (Left over Right). Tay áo thụng rộng rủ mềm.
        <g id="robe-giao-linh">
          <path d="M162,158 C135,195 115,230 110,260 C118,300 126,340 134,365 C148,320 158,280 165,240 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
          <path d="M238,158 C265,195 285,230 290,260 C282,300 274,340 266,365 C252,320 242,280 235,240 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
          
          {/* Vạt bên phải (ẩn phía trong) */}
          <path d="M238,158 C225,180 205,210 178,250 L172,525 C190,528 215,528 236,525 Z" fill="url(#silk-sheen-primary)" opacity="0.75" />
          {/* Vạt bên TRÁI bắt chéo đè lên vạt PHẢI (Left over Right) sang tận sườn phải W1 */}
          <path
            d="M162,158 C176,150 196,146 200,144 C214,175 226,210 234,258 C238,340 240,430 238,525 C215,530 185,530 164,525 C162,420 162,320 162,158 Z"
            fill="url(#silk-sheen-primary)"
            stroke="#1A120D"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          {/* Đường viền nẹp cổ giao lĩnh Left over Right rõ ràng */}
          <path d="M164,158 C182,185 204,222 232,260" stroke="#D4A043" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>
      ) : costumeKey === 'ao-tu-than' ? (
        // === ÁO TỨ THÂN (NORTHERN FOLK) ===
        // Không khuy. 2 vạt sau khâu liền, 2 vạt trước buông tự do buộc tại W1 (268) để lộ Yếm Z1 & Váy Z2
        <g id="robe-tu-than">
          {/* Vạt sau lửng buông dài */}
          <path d="M162,158 Q200,154 238,158 C242,270 246,380 244,495 C215,500 185,500 156,495 C154,380 158,270 162,158 Z" fill="url(#silk-sheen-primary)" opacity="0.85" strokeLinejoin="round" />
          <path d="M162,158 C148,200 135,240 130,280 C135,285 139,286 143,288 C150,255 158,230 168,220 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.7" strokeLinejoin="round" />
          <path d="M238,158 C252,200 265,240 270,280 C265,285 261,286 257,288 C250,255 242,230 232,220 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.7" strokeLinejoin="round" />
          
          {/* 2 Vạt trước mở rộng để lộ Yếm Đào Z1, bắt chéo và thắt nút tại W1 (200, 268) */}
          <path d="M162,162 C172,200 180,235 200,268 C194,320 188,360 178,392 C173,388 175,380 180,275 C168,245 160,215 156,230 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
          <path d="M238,162 C228,200 220,235 200,268 C206,320 212,360 222,392 C227,388 225,380 220,275 C232,245 240,215 244,230 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
          {/* Nút thắt vạt lụa tại W1 */}
          <circle cx="200" cy="268" r="5.5" fill="#3D2817" stroke="#D4A043" strokeWidth="1" />
        </g>
      ) : costumeKey === 'ao-ba-ba' ? (
        // === ÁO BÀ BA (NAM BỘ) ===
        // Áo ngắn ngang hông, nẹp cúc ngọc giữa, 2 túi tròn vạt trước
        <g id="robe-ba-ba">
          <path d="M162,158 C150,205 140,250 136,295 C140,298 143,298 146,300 C154,260 162,230 172,220 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.7" strokeLinejoin="round" />
          <path d="M238,158 C250,205 260,250 264,295 C260,298 257,298 254,300 C246,260 238,230 228,220 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.7" strokeLinejoin="round" />
          <path d="M162,158 Q200,154 238,158 C238,225 240,300 238,364 C226,368 214,368 200,364 C186,368 174,368 162,364 C160,300 162,225 162,158 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
          <line x1="200" y1="154" x2="200" y2="364" stroke="#22150D" strokeWidth="1" strokeLinecap="round" />
          <circle cx="200" cy="180" r="2.2" fill="#FFFFFF" stroke="#D4A043" strokeWidth="0.6" />
          <circle cx="200" cy="215" r="2.2" fill="#FFFFFF" stroke="#D4A043" strokeWidth="0.6" />
          <circle cx="200" cy="250" r="2.2" fill="#FFFFFF" stroke="#D4A043" strokeWidth="0.6" />
          <circle cx="200" cy="285" r="2.2" fill="#FFFFFF" stroke="#D4A043" strokeWidth="0.6" />
          <circle cx="200" cy="320" r="2.2" fill="#FFFFFF" stroke="#D4A043" strokeWidth="0.6" />
          <rect x="170" y="322" width="18" height="20" rx="4" fill="none" stroke="#D4A043" strokeWidth="0.8" opacity="0.7" />
          <rect x="212" y="322" width="18" height="20" rx="4" fill="none" stroke="#D4A043" strokeWidth="0.8" opacity="0.7" />
        </g>
      ) : costumeKey === 'ao-vien-linh' ? (
        // === ÁO VIÊN LĨNH (CUNG ĐÌNH) ===
        // Cổ tròn ôm khít N1, khuy cài vai, bổ tử rồng phượng tròn ở ngực
        <g id="robe-vien-linh">
          <path d="M162,158 C140,195 125,230 120,260 C128,300 136,340 144,365 C154,320 160,280 165,240 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
          <path d="M238,158 C260,195 275,230 280,260 C272,300 264,340 256,365 C246,320 240,280 235,240 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
          <path d="M162,158 Q200,154 238,158 C242,280 244,410 242,535 C215,540 185,540 158,535 C156,410 158,280 162,158 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
          <circle cx="218" cy="156" r="3.6" fill="#D4A043" stroke="#1A120D" strokeWidth="0.8" />
          <circle cx="200" cy="225" r="18" fill="none" stroke="#D4A043" strokeWidth="1.2" strokeDasharray="3,2" />
          <circle cx="200" cy="225" r="8" fill="none" stroke="#D4A043" strokeWidth="0.8" />
        </g>
      ) : costumeKey === 'yem-vay' ? (
        // === YẾM VÀ VÁY (DÂN GIAN / CUNG NỮ) ===
        // Yếm thoi mềm ôm ngực, lộ bờ vai trần thanh lịch (kín đáo chuẩn mực)
        <g id="robe-yem-vay">
          <path d="M186,150 Q200,136 214,150 C222,185 226,220 224,252 C210,254 190,254 176,252 C174,220 178,185 186,150 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
        </g>
      ) : (
        // === ÁO DÀI (QUỐC PHỤC) ===
        // Thân ôm ngực và eo, raglan từ S1/S2, xẻ tà chính xác tại Waist Anchor W1 (268)
        <g id="robe-ao-dai">
          {/* Tay raglan ôm thon */}
          <path d="M162,158 C150,205 140,250 136,295 C140,298 143,298 146,300 C154,260 162,230 174,215 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.7" strokeLinejoin="round" />
          <path d="M238,158 C250,205 260,250 264,295 C260,298 257,298 254,300 C246,260 238,230 226,215 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.7" strokeLinejoin="round" />
          {/* Thân áo xẻ tà tại W1 (268) thả dài đến H2 (585) */}
          <path
            d={`M162,158 Q200,154 238,158 C236,190 234,225 232,240 C234,255 ${isMale ? '236' : '240'},265 ${isMale ? '236' : '240'},268 C${isMale ? '238' : '242'},370 ${isBreezeActive ? '256,490 250,565' : '244,490 240,565'} C${isBreezeActive ? '215,570 185,570' : '210,570 190,570'} 160,565 C${isBreezeActive ? '166,490 158,370' : '156,490 160,370'} ${isMale ? '164' : '168'},268 C${isMale ? '164' : '168'},265 166,255 168,240 C166,225 164,190 162,158 Z`}
            fill="url(#silk-sheen-primary)"
            stroke="#1A120D"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          {/* Đường xẻ tà 2 bên hông tại W1 (268) */}
          <path d={`M${isMale ? '164' : '168'},268 Q160,420 160,565`} stroke="#000000" strokeWidth="0.8" opacity="0.3" fill="none" strokeLinecap="round" />
          <path d={`M${isMale ? '236' : '240'},268 Q244,420 244,565`} stroke="#000000" strokeWidth="0.8" opacity="0.3" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* Hoa văn di sản phủ lên vạt áo */}
      {!isSolid && pattern !== 'plain' && (
        <rect
          x="100"
          y="140"
          width="200"
          height="425"
          fill={`url(#pat-${pattern})`}
          opacity="0.88"
          className="pointer-events-none"
        />
      )}
    </g>
  );
};

/**
 * [Z4]: OUTER WEAR (Áo Khoác Ngoài: Áo Nhật Bình & Áo Tấc)
 * - Áo Nhật Bình: Cổ chữ nhật bo viền, khuy cài ngực + tua rua, cửa tay có dải ngũ sắc (Xanh, Vàng, Lam, Trắng, Đỏ)
 * - Áo Tấc: Tay thụng đại lễ cực rộng buông thõng qua tay
 */
export const Z4Outerwear: React.FC<{
  costumeKey: string;
  isBreezeActive: boolean;
  innerCollarColor: string;
}> = ({ costumeKey, isBreezeActive, innerCollarColor }) => {
  if (costumeKey === 'ao-nhat-binh') {
    return (
      <g id="layer-z4-outerwear-nhat-binh">
        {/* Tay thụng rộng xòe lượn sóng */}
        <path d="M162,158 C135,195 105,230 92,260 C100,310 110,355 120,385 C135,340 150,295 160,255 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
        {/* 5 Dải Ngũ Sắc ở Cửa Tay Trái: Xanh lục, Vàng, Xanh lam, Trắng, Đỏ */}
        <path d="M92,260 Q106,322 120,385" stroke="#38A169" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M95,262 Q109,324 123,387" stroke="#D4A043" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M98,264 Q112,326 126,389" stroke="#2B5482" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M101,266 Q115,328 129,391" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M104,268 Q118,330 132,393" stroke="#BA3424" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Tay phải */}
        <path d="M238,158 C265,195 295,230 308,260 C300,310 290,355 280,385 C265,340 250,295 240,255 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
        {/* 5 Dải Ngũ Sắc ở Cửa Tay Phải */}
        <path d="M308,260 Q294,322 280,385" stroke="#38A169" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M305,262 Q291,324 277,387" stroke="#D4A043" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M302,264 Q288,326 274,389" stroke="#2B5482" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M299,266 Q285,328 271,391" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M296,268 Q282,330 268,393" stroke="#BA3424" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Thân áo ngoài Nhật Bình uy nghi */}
        <path d="M162,158 L182,148 L182,246 C180,340 178,430 176,515 C166,517 156,517 152,515 C148,430 148,340 148,260 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
        <path d="M238,158 L218,148 L218,246 C220,340 222,430 224,515 C234,517 244,517 248,515 C252,430 252,340 252,260 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />

        {/* CỔ NHẬT BÌNH CHỮ NHẬT CUNG ĐÌNH RỦ SONG SONG TRƯỚC NGỰC */}
        <rect x="182" y="148" width="36" height="96" rx="5" fill={innerCollarColor} stroke="#D4A043" strokeWidth="1.2" />
        <rect x="185" y="152" width="30" height="88" rx="3" fill="none" stroke="#BA3424" strokeWidth="1.2" />
        <line x1="182" y1="170" x2="218" y2="170" stroke="#38A169" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="182" y1="188" x2="218" y2="188" stroke="#D4A043" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="182" y1="206" x2="218" y2="206" stroke="#2B5482" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="182" y1="224" x2="218" y2="224" stroke="#8C4A78" strokeWidth="1.2" strokeLinecap="round" />

        {/* Khuy thắt nơ buộc ngực & 2 dải lụa tua rua rủ mềm */}
        <path d="M182,246 Q200,260 218,246" stroke="#BA3424" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M195,254 Q192,310 190,360 Q194,361 197,358 Q198,310 200,254 Z" fill="#BA3424" stroke="#D4A043" strokeWidth="0.6" strokeLinejoin="round" />
        <path d="M205,254 Q208,310 210,360 Q206,361 203,358 Q202,310 200,254 Z" fill="#BA3424" stroke="#D4A043" strokeWidth="0.6" strokeLinejoin="round" />
      </g>
    );
  }

  if (costumeKey === 'ao-tac') {
    return (
      <g id="layer-z4-outerwear-ao-tac">
        {/* Áo Tấc (Áo Thụng): Cánh tay thụng rộng 1 tấc buông thõng qua tay */}
        <path d="M162,158 C130,200 95,235 80,270 C90,325 100,380 110,425 C130,365 148,315 160,265 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
        <path d="M238,158 C270,200 305,235 320,270 C310,325 300,380 290,425 C270,365 252,315 240,265 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
        {/* Thân áo lễ trang trọng phủ ngoài */}
        <path d="M162,158 Q200,154 238,158 C242,280 246,410 246,535 C215,540 185,540 154,535 C154,410 158,280 162,158 Z" fill="url(#silk-sheen-primary)" stroke="#1A120D" strokeWidth="0.8" strokeLinejoin="round" />
        <line x1="200" y1="154" x2="200" y2="300" stroke="#D4A043" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="200" cy="168" r="2.2" fill="#D4A043" />
        <circle cx="200" cy="198" r="2.2" fill="#D4A043" />
        <circle cx="200" cy="228" r="2.2" fill="#D4A043" />
        <circle cx="200" cy="258" r="2.2" fill="#D4A043" />
      </g>
    );
  }

  return null;
};

/**
 * Dải thắt lưng & Dải nơ lụa (thuộc Z3 / Z4)
 */
export const SashBelt: React.FC<{ costumeKey: string; isBreezeActive: boolean }> = ({
  costumeKey,
  isBreezeActive,
}) => {
  if (costumeKey === 'ao-tu-than' || costumeKey === 'ao-giao-linh' || costumeKey === 'yem-vay') {
    return (
      <g id="layer-sash-belt">
        <rect x="174" y="268" width="52" height="15" rx="5" fill="url(#silk-sheen-sash)" stroke="#D4A043" strokeWidth="0.8" />
        <path
          d={`M194,283 Q${isBreezeActive ? '186' : '190'},350 ${isBreezeActive ? '184' : '188'},415 Q192,412 198,410 Q199,350 202,283 Z`}
          fill="url(#silk-sheen-sash)"
          stroke="#D4A043"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        <path
          d={`M206,283 Q${isBreezeActive ? '214' : '210'},350 ${isBreezeActive ? '218' : '212'},425 Q210,422 202,420 Q201,350 198,283 Z`}
          fill="url(#silk-sheen-sash)"
          stroke="#D4A043"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      </g>
    );
  }

  if (costumeKey === 'ao-ba-ba') {
    return (
      <g id="layer-sash-belt">
        {/* Khăn rằn Nam Bộ đặc trưng vắt chéo qua vai mềm mại */}
        <path d="M172,154 C164,190 158,225 158,252 C164,255 170,256 174,256 C176,225 180,190 184,162 Z" fill="#EAE5DC" stroke="#22150D" strokeWidth="0.8" strokeLinejoin="round" />
        <line x1="170" y1="170" x2="182" y2="175" stroke="#1A120D" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="167" y1="190" x2="179" y2="195" stroke="#1A120D" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="164" y1="210" x2="176" y2="215" stroke="#1A120D" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="161" y1="230" x2="173" y2="235" stroke="#1A120D" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    );
  }

  return (
    <g id="layer-sash-belt">
      <rect x="176" y="262" width="48" height="9" rx="4" fill="url(#silk-sheen-sash)" stroke="#D4A043" strokeWidth="0.7" />
      <circle cx="218" cy="266" r="5" fill="#D4A043" stroke="#BA3424" strokeWidth="0.8" />
      <circle cx="223" cy="264" r="3.5" fill="#E2B155" stroke="#8C5C26" strokeWidth="0.6" />
      <path d="M218,271 Q222,300 220,335" stroke="#D4A043" strokeWidth="1.2" strokeDasharray="1.5,2" fill="none" strokeLinecap="round" />
      <circle cx="220" cy="336" r="2" fill="#BA3424" />
    </g>
  );
};

export const FlowingTrain: React.FC<{ costumeKey: string; isBreezeActive: boolean }> = ({
  costumeKey,
  isBreezeActive,
}) => {
  const hasTrain = [
    'ao-dai',
    'ao-tac',
    'ao-nhat-binh',
    'ao-giao-linh',
    'ao-tu-than',
  ].includes(costumeKey);

  if (!hasTrain) return null;

  return (
    <g id="layer-flowing-train">
      <path
        d={`M174,270 C${isBreezeActive ? '135' : '145'},340 ${isBreezeActive ? '80' : '90'},470 ${isBreezeActive ? '65' : '75'},595 C${isBreezeActive ? '95' : '105'},616 ${isBreezeActive ? '145' : '150'},614 185,580 C180,480 178,360 180,275 Z`}
        fill="url(#silk-sheen-secondary)"
        opacity="0.88"
        stroke="#D4A043"
        strokeWidth="0.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M110,480 Q130,520 120,560"
        stroke="#D4A043"
        strokeWidth="1.2"
        strokeDasharray="2,3"
        fill="none"
        opacity="0.7"
        strokeLinecap="round"
      />
      <circle cx="120" cy="520" r="14" fill="none" stroke="#D4A043" strokeWidth="0.9" opacity="0.5" />
      <circle cx="120" cy="520" r="6" fill="none" stroke="#D4A043" strokeWidth="0.6" opacity="0.6" />
    </g>
  );
};
