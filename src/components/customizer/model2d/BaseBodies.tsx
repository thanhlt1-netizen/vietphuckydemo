import React from 'react';

interface BaseBodyProps {
  isMale: boolean;
  isDressed?: boolean;
  costumeKey?: string;
}

/**
 * Hệ Base Body Chuẩn Tỷ Lệ Fashion Doll:
 * - Khi đang mặc trang phục (isDressed = true): Trang phục sẽ che kín toàn bộ cơ thể bên trong (thân, eo, đùi, chân),
 *   chỉ hiển thị phần cổ/gáy nối liền với cổ áo và đôi bàn tay búp măng thanh tao thò ra từ cửa tay áo.
 *   (Riêng với Yếm Váy, bờ vai và cánh tay trần trang nhã sẽ được hiển thị đúng đặc trưng văn hóa yếm đào).
 * - Khi không mặc trang phục (isDressed = false trong Layer Inspector Z0): Hiển thị toàn bộ mannequin thể hình
 *   với lớp lót trắng kín đáo 100% (Tube top & Shorts trắng) lịch sự.
 */
export const BaseBody: React.FC<BaseBodyProps> = ({ isMale, isDressed = true, costumeKey = 'ao-dai' }) => {
  const isYemVay = costumeKey === 'yem-vay';

  if (isMale) {
    return (
      <g id="male-base-body">
        {/* Cổ nam: Dáng đứng thẳng tự nhiên, bo tròn chân cổ nối liền N1 */}
        <path
          d="M189,122 C189,134 188,146 188,154 C196,156 204,156 212,154 C212,146 211,134 211,122 Z"
          fill="url(#skin-male)"
          stroke="#7A5C4C"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        <path
          d="M194,136 Q200,140 206,136"
          stroke="#BA8A68"
          strokeWidth="0.7"
          fill="none"
          opacity="0.5"
          strokeLinecap="round"
        />

        {/* Khi KHÔNG mặc trang phục: Hiển thị đầy đủ vai, ngực, cánh tay, quần lót và chân */}
        {(!isDressed || isYemVay) && (
          <g id="male-upper-body-unclothed">
            {/* Khung vai & thân trên nam: Bờ vai xuôi mềm, bo tròn êm dịu */}
            <path
              d="M144,160 C156,154 180,152 200,152 C220,152 244,154 256,160 C254,185 250,215 248,238 C232,242 168,242 152,238 C150,215 146,185 144,160 Z"
              fill="url(#skin-male)"
              stroke="#7A5C4C"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />
            <path
              d="M168,160 Q184,166 200,164 Q216,166 232,160"
              stroke="#BA8A68"
              strokeWidth="0.8"
              fill="none"
              opacity="0.6"
              strokeLinecap="round"
            />

            {/* Cánh tay trái nam */}
            <path
              d="M144,160 C136,184 132,214 132,238 C132,264 137,294 138,304 C142,305 146,303 148,300 C146,284 144,248 146,234 C150,208 152,184 154,166 Z"
              fill="url(#skin-male)"
              stroke="#7A5C4C"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />

            {/* Cánh tay phải nam */}
            <path
              d="M256,160 C264,184 268,214 268,238 C268,264 263,294 262,304 C258,305 254,303 252,300 C254,284 256,248 254,234 C250,208 248,184 246,166 Z"
              fill="url(#skin-male)"
              stroke="#7A5C4C"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* Bàn tay trái nam: Luôn hiển thị thanh nhã thò ra từ cổ tay áo */}
        <path
          d="M138,304 C135,314 134,324 137,330 C140,333 145,333 148,328 C149,322 149,313 148,300 Z"
          fill="url(#skin-male)"
          stroke="#7A5C4C"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />

        {/* Bàn tay phải nam */}
        <path
          d="M262,304 C265,314 266,324 263,330 C260,333 255,333 252,328 C251,322 251,313 252,300 Z"
          fill="url(#skin-male)"
          stroke="#7A5C4C"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />

        {/* Thân dưới nam: Chỉ hiển thị khi KHÔNG mặc đồ (người dùng tắt Z2/Z3 trong layer panel) */}
        {!isDressed && (
          <g id="male-lower-body-unclothed">
            <path
              d="M152,238 C158,255 163,272 166,285 C186,287 214,287 234,285 C237,272 242,255 248,238 Z"
              fill="url(#skin-male)"
              stroke="#7A5C4C"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />
            {/* Quần short lót nam màu trắng kín đáo */}
            <g id="male-under-shorts">
              <path
                d="M166,274 C186,271 214,271 234,274 C241,296 245,318 243,334 C224,336 206,336 202,324 C198,324 176,336 157,334 C155,318 159,296 166,274 Z"
                fill="#F7F7FA"
                stroke="#D0D0D8"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
              <line x1="200" y1="274" x2="200" y2="324" stroke="#D0D0D8" strokeWidth="0.8" strokeLinecap="round" />
            </g>

            {/* Chân trái nam */}
            <path
              d="M167,334 C163,400 161,480 161,585 C169,587 177,587 185,585 C187,480 189,400 189,334 Z"
              fill="url(#skin-male)"
              stroke="#7A5C4C"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />
            <path d="M169,436 Q175,440 181,436" stroke="#BA8A68" strokeWidth="0.7" fill="none" opacity="0.6" strokeLinecap="round" />
            <path
              d="M161,585 C159,595 157,604 159,610 C166,612 179,612 185,610 C185,604 185,595 185,585 Z"
              fill="url(#skin-male)"
              stroke="#7A5C4C"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />

            {/* Chân phải nam */}
            <path
              d="M233,334 C237,400 239,480 239,585 C231,587 223,587 215,585 C213,480 211,400 211,334 Z"
              fill="url(#skin-male)"
              stroke="#7A5C4C"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />
            <path d="M219,436 Q225,440 231,436" stroke="#BA8A68" strokeWidth="0.7" fill="none" opacity="0.6" strokeLinecap="round" />
            <path
              d="M239,585 C241,595 243,604 241,610 C234,612 221,612 215,610 C215,604 215,595 215,585 Z"
              fill="url(#skin-male)"
              stroke="#7A5C4C"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />
          </g>
        )}
      </g>
    );
  }

  // === MODEL NỮ: ĐƯỜNG CONG NỮ TÍNH MỀM MẠI ===
  return (
    <g id="female-base-body">
      {/* Cổ cao thanh tú 3 ngấn mềm mại nối liền chân cổ N1 */}
      <path
        d="M191,120 C191,132 190,144 190,154 C196,156 204,156 210,154 C210,144 209,132 209,120 Z"
        fill="url(#skin-female)"
        stroke="#8C6552"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <path
        d="M174,156 Q200,164 226,156"
        stroke="#D19E7B"
        strokeWidth="0.7"
        fill="none"
        opacity="0.65"
        strokeLinecap="round"
      />

      {/* Khi KHÔNG mặc trang phục HOẶC mặc Yếm Váy (lộ vai trần thanh lịch): Hiển thị bờ vai và cánh tay */}
      {(!isDressed || isYemVay) && (
        <g id="female-upper-body-unclothed">
          {/* Bờ vai thon mềm mại, eo thon cong nhẹ nhàng */}
          <path
            d="M152,160 C162,156 182,154 200,154 C218,154 238,156 248,160 C244,185 234,220 226,248 C216,250 184,250 174,248 C166,220 156,185 152,160 Z"
            fill="url(#skin-female)"
            stroke="#8C6552"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />

          {!isDressed && (
            <g id="female-tube-top">
              <path
                d="M154,176 C176,172 224,172 246,176 C242,192 240,202 238,206 C220,209 180,209 162,206 C158,202 156,192 154,176 Z"
                fill="#FFFFFF"
                stroke="#E0E0E6"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
              <path d="M162,206 Q200,209 238,206" stroke="#D4D4DC" strokeWidth="0.7" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* Cánh tay trái nữ */}
          <path
            d="M152,160 C144,184 140,214 140,238 C140,264 145,290 147,300 C150,301 152,299 153,296 C152,284 149,248 151,234 C154,208 156,184 158,166 Z"
            fill="url(#skin-female)"
            stroke="#8C6552"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />

          {/* Cánh tay phải nữ */}
          <path
            d="M248,160 C256,184 260,214 260,238 C260,264 255,290 253,300 C250,301 248,299 247,296 C248,284 251,248 249,234 C246,208 244,184 242,166 Z"
            fill="url(#skin-female)"
            stroke="#8C6552"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* Bàn tay trái nữ: Luôn hiển thị thanh thoát tự nhiên ở cổ tay */}
      <path
        d="M147,300 C143,310 141,322 144,330 C147,334 152,332 153,326 C155,318 154,308 153,296 Z"
        fill="url(#skin-female)"
        stroke="#8C6552"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />

      {/* Bàn tay phải nữ */}
      <path
        d="M253,300 C257,310 259,322 256,330 C253,334 248,332 247,326 C245,318 246,308 247,296 Z"
        fill="url(#skin-female)"
        stroke="#8C6552"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />

      {/* Thân dưới nữ: Chỉ hiển thị khi KHÔNG mặc đồ (người dùng tắt Z2/Z3 trong layer panel) */}
      {!isDressed && (
        <g id="female-lower-body-unclothed">
          <circle cx="200" cy="256" r="1.2" fill="#D19E7B" />
          <path d="M199,252 Q200,255 200,256" stroke="#D19E7B" strokeWidth="0.5" opacity="0.6" strokeLinecap="round" />

          {/* Quần lót trắng kín đáo ôm hông */}
          <g id="female-under-pant">
            <path
              d="M174,272 C190,270 210,270 226,272 C236,290 240,302 238,306 C220,314 180,314 162,306 C160,302 164,290 174,272 Z"
              fill="#FFFFFF"
              stroke="#E0E0E6"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
            <path d="M174,272 Q200,270 226,272" stroke="#D4D4DC" strokeWidth="0.7" fill="none" strokeLinecap="round" />
          </g>

          {/* Chân trái nữ */}
          <path
            d="M166,306 C162,380 162,470 163,585 C170,587 177,587 183,585 C186,470 188,380 188,308 Z"
            fill="url(#skin-female)"
            stroke="#8C6552"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
          <path d="M168,432 Q174,437 180,432" stroke="#E0B092" strokeWidth="0.7" fill="none" opacity="0.65" strokeLinecap="round" />
          <path
            d="M163,585 C161,595 160,604 162,609 C168,612 178,612 183,609 C183,603 183,595 183,585 Z"
            fill="url(#skin-female)"
            stroke="#8C6552"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />

          {/* Chân phải nữ */}
          <path
            d="M234,306 C238,380 238,470 237,585 C230,587 223,587 217,585 C214,470 212,380 212,308 Z"
            fill="url(#skin-female)"
            stroke="#8C6552"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
          <path d="M220,432 Q226,437 232,432" stroke="#E0B092" strokeWidth="0.7" fill="none" opacity="0.65" strokeLinecap="round" />
          <path
            d="M237,585 C239,595 240,604 238,609 C232,612 222,612 217,609 C217,603 217,595 217,585 Z"
            fill="url(#skin-female)"
            stroke="#8C6552"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </g>
      )}
    </g>
  );
};
