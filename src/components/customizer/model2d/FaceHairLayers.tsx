import React from 'react';

interface FaceHairProps {
  isMale: boolean;
}

/**
 * Lớp Khuôn Mặt Anime Cao Cấp & Mái Tóc Thời Thượng
 * - Thiết kế bo tròn mềm mại, loại bỏ hoàn toàn các góc nhọn hoắt
 * - Tỷ lệ ngũ quan anime thời trang hài hòa, mắt long lanh đa sắc
 * - Tóc có volume bồng bềnh và dải highlight ánh sáng mượt mà
 */
export const FaceFeatures: React.FC<FaceHairProps> = ({ isMale }) => {
  if (isMale) {
    return (
      <g id="male-face-features">
        {/* Khuôn mặt nam: Đường cằm bo tròn mềm mại, đường quai hàm thanh tú */}
        <path
          d="M185,74 C185,55 215,55 215,74 C215,95 210,111 205,117 C203,120 197,120 195,117 C190,111 185,95 185,74 Z"
          fill="url(#skin-male)"
          stroke="#7A5C4C"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />

        {/* Hai tai cân đối bo tròn */}
        <path d="M184,82 C181,84 181,94 185,96" stroke="#7A5C4C" strokeWidth="0.7" fill="url(#skin-male)" strokeLinecap="round" />
        <path d="M216,82 C219,84 219,94 215,96" stroke="#7A5C4C" strokeWidth="0.7" fill="url(#skin-male)" strokeLinecap="round" />

        {/* Lông mày kiếm ngang nam tính, cong nhẹ phong nhã */}
        <path d="M188,83 Q193,81 197,82" stroke="#251C17" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M203,82 Q207,81 212,83" stroke="#251C17" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Đôi mắt Anime Nam: Nâu hổ phách, sắc nét, con ngươi phản chiếu ánh sáng */}
        <path d="M188,87 Q193,85 198,88" stroke="#140D09" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <ellipse cx="193" cy="90.5" rx="3.5" ry="4" fill="url(#eye-iris-male-amber)" />
        <circle cx="192" cy="89" r="1.2" fill="#FFFFFF" />
        <circle cx="194.5" cy="92" r="0.7" fill="#FFFFFF" opacity="0.6" />

        <path d="M202,88 Q207,85 212,87" stroke="#140D09" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <ellipse cx="207" cy="90.5" rx="3.5" ry="4" fill="url(#eye-iris-male-amber)" />
        <circle cx="206" cy="89" r="1.2" fill="#FFFFFF" />
        <circle cx="208.5" cy="92" r="0.7" fill="#FFFFFF" opacity="0.6" />

        {/* Sống mũi thẳng cao thanh thoát */}
        <path d="M199,90 Q200,95 200,98" stroke="#BA8A68" strokeWidth="0.8" fill="none" strokeLinecap="round" />

        {/* Môi nam giới mỉm nhẹ bo tròn */}
        <path d="M196,108 Q200,110 204,108" stroke="#9A624E" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </g>
    );
  }

  // === MẶT & NGŨ QUAN NỮ GIỚI: ĐƯỜNG CẰM TRÁI XOAN BO TRÒN DỊU DÀNG, MẮT TÍM LONG LANH ===
  return (
    <g id="female-face-features">
      {/* Khuôn mặt nữ trái xoan thanh tú với cằm bo tròn mềm mại (Không nhọn) */}
      <path
        d="M187,74 C187,55 213,55 213,74 C213,95 208,109 204,115 C202,117 198,117 196,115 C192,109 187,95 187,74 Z"
        fill="url(#skin-female)"
        stroke="#8C6552"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />

      {/* Tai anime bo tròn xinh xắn */}
      <path d="M186,80 C182,82 182,92 187,94" stroke="#8C6552" strokeWidth="0.6" fill="url(#skin-female)" strokeLinecap="round" />
      <path d="M214,80 C218,82 218,92 213,94" stroke="#8C6552" strokeWidth="0.6" fill="url(#skin-female)" strokeLinecap="round" />

      {/* Phấn má hồng đào ngọt ngào */}
      <circle cx="189" cy="97" r="4.5" fill="#F59B9B" opacity="0.35" filter="blur(2px)" />
      <circle cx="211" cy="97" r="4.5" fill="#F59B9B" opacity="0.35" filter="blur(2px)" />

      {/* Lông mày lá liễu thanh mảnh uốn cong nhẹ */}
      <path d="M188,81 Q193,79 197,81" stroke="#3C281F" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M203,81 Q207,79 212,81" stroke="#3C281F" strokeWidth="1.1" fill="none" strokeLinecap="round" />

      {/* Đôi mắt tím Violet lung linh bo tròn mềm mại */}
      <path d="M187,85 Q193,83 198,86" stroke="#251638" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M188,83 Q193,81 197,84" stroke="#6C45A8" strokeWidth="0.6" fill="none" strokeLinecap="round" />
      <ellipse cx="193" cy="89.5" rx="4" ry="4.5" fill="url(#eye-iris-female-violet)" />
      <circle cx="191.5" cy="87.5" r="1.5" fill="#FFFFFF" />
      <circle cx="194.5" cy="91.5" r="1" fill="#FFFFFF" opacity="0.85" />
      <path d="M189,93.5 Q193,94.5 197,92.5" stroke="#3C2458" strokeWidth="0.7" fill="none" strokeLinecap="round" />

      <path d="M202,86 Q207,83 213,85" stroke="#251638" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M203,84 Q207,81 212,83" stroke="#6C45A8" strokeWidth="0.6" fill="none" strokeLinecap="round" />
      <ellipse cx="207" cy="89.5" rx="4" ry="4.5" fill="url(#eye-iris-female-violet)" />
      <circle cx="205.5" cy="87.5" r="1.5" fill="#FFFFFF" />
      <circle cx="208.5" cy="91.5" r="1" fill="#FFFFFF" opacity="0.85" />
      <path d="M203,92.5 Q207,94.5 211,93.5" stroke="#3C2458" strokeWidth="0.7" fill="none" strokeLinecap="round" />

      {/* Sống mũi dọc dừa nhỏ nhắn */}
      <circle cx="200" cy="97" r="0.7" fill="#C98864" />

      {/* Miệng cười duyên ngọt ngào với cánh môi bo tròn căng mọng */}
      <path d="M197,105 Q200,108 203,105" stroke="#D14848" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M198,105.5 Q200,107.5 202,105.5" fill="#E86E6E" />
    </g>
  );
};

export const BackHair: React.FC<FaceHairProps> = ({ isMale }) => {
  return (
    <g id="layer-back-hair">
      {isMale ? (
        <path d="M180,74 C178,50 222,50 220,74 C222,96 178,96 180,74 Z" fill="url(#hair-male-grad)" />
      ) : (
        <ellipse cx="200" cy="48" rx="20" ry="18" fill="url(#hair-female-gold)" stroke="#8C5C26" strokeWidth="0.8" />
      )}
    </g>
  );
};

export const FrontHair: React.FC<FaceHairProps> = ({ isMale }) => {
  if (isMale) {
    return (
      <g id="male-front-hair">
        {/* Tóc mái nam nhiều lớp thanh lịch */}
        <path d="M184,65 Q192,76 195,84 Q193,76 198,72 Q204,80 206,84 Q208,76 216,70" fill="url(#hair-male-grad)" />
        <path d="M186,64 Q200,60 214,64" stroke="#7A5640" strokeWidth="1.1" fill="none" opacity="0.7" strokeLinecap="round" />
        {/* Khăn xếp nam truyền thống bo góc tròn */}
        <rect x="178" y="58" width="44" height="18" rx="8" fill="#20150E" stroke="#D4A043" strokeWidth="0.8" />
        <path d="M182,67 Q200,69 218,67" stroke="#D4A043" strokeWidth="0.7" opacity="0.8" strokeLinecap="round" fill="none" />
      </g>
    );
  }

  return (
    <g id="female-front-hair">
      {/* Trâm cài hoa sen với chuỗi ngọc buông rủ */}
      <line x1="206" y1="46" x2="228" y2="34" stroke="#D4A043" strokeWidth="2" strokeLinecap="round" />
      <circle cx="228" cy="34" r="3.8" fill="#BA3424" stroke="#D4A043" strokeWidth="0.8" />
      <path d="M228,38 Q232,50 230,62" stroke="#D4A043" strokeWidth="1" strokeDasharray="1.5,1.5" fill="none" strokeLinecap="round" />
      <circle cx="230" cy="63" r="1.8" fill="#38A169" />

      {/* Lọn tóc mai mềm mại hai bên má bo tròn nhẹ */}
      <path d="M185,72 C181,88 182,100 186,108" stroke="#A87538" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M215,72 C219,88 218,100 214,108" stroke="#A87538" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Mái lưa thưa bồng bềnh thanh lịch */}
      <path d="M188,68 Q194,76 196,82" stroke="#C99853" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M212,68 Q206,76 204,82" stroke="#C99853" strokeWidth="1.1" fill="none" strokeLinecap="round" />

      {/* Mấn nhung cung đình bo góc tròn quý phái */}
      <rect x="178" y="56" width="44" height="18" rx="8" fill="#20150E" stroke="#D4A043" strokeWidth="1" />
      <path d="M182,65 Q200,67 218,65" stroke="#D4A043" strokeWidth="0.7" opacity="0.8" strokeLinecap="round" fill="none" />
    </g>
  );
};
