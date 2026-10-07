import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface AppLogoProps {
  variant?: 'hero' | 'standard' | 'compact' | 'badge' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSubtitle?: boolean;
  showSlogan?: boolean;
}

/**
 * Biểu tượng & Logo thương hiệu "Việt Phục Ký"
 * Kết hợp triện son cổ truyền, mặt trời trống đồng Đông Sơn 12 cánh và mỹ thuật cung đình hoàng gia.
 */
export const AppLogo: React.FC<AppLogoProps> = ({
  variant = 'standard',
  size = 'md',
  className = '',
  showSubtitle = true,
  showSlogan,
}) => {
  const { t, language } = useLanguage();
  const isVi = language === 'vi';
  const displaySubtitle = showSlogan !== undefined ? showSlogan : showSubtitle;
  const isHorizontal = variant === 'horizontal' || variant === 'standard';
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        {/* Emblem Crest Icon */}
        <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4A043] via-[#BA3424] to-[#1C140E] p-[1.5px] shadow-md shadow-black/40 flex-shrink-0">
          <div className="w-full h-full bg-[#18100A] rounded-[10px] flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-5 h-5">
              {/* Vòng nhật hoa & mặt trời trống đồng */}
              <circle cx="50" cy="50" r="42" fill="none" stroke="#D4A043" strokeWidth="3" strokeDasharray="3 3" />
              <polygon points="50,16 57,36 78,36 62,50 68,70 50,58 32,70 38,50 22,36 43,36" fill="#F3C96B" />
              <circle cx="50" cy="50" r="8" fill="#BA3424" />
              <circle cx="50" cy="50" r="4" fill="#FFE59E" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="font-serif font-bold text-sm tracking-wide text-[#F5EFE6]">
            Việt Phục Ký
          </span>
          {showSubtitle && (
            <span className="text-[9px] font-sans text-[#D4A043] tracking-widest uppercase">
              {isVi ? 'Ngàn Năm Di Sản' : 'Heritage Legacy'}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {/* Large Imperial Crest */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#F3C96B] via-[#D4A043] to-[#872013] p-[2.5px] shadow-2xl shadow-black/80 mb-3 group transition-transform hover:scale-105">
          {/* Inner royal dark background */}
          <div className="w-full h-full bg-[#160E09] rounded-[22px] flex items-center justify-center relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-radial from-[#D4A043]/20 via-transparent to-transparent opacity-80" />

            {/* Trống đồng Đông Sơn & Hào khí cung đình SVG */}
            <svg viewBox="0 0 120 120" className="w-14 h-14 sm:w-16 sm:h-16 text-[#F3C96B]">
              {/* Khung triện bát giác ngoài */}
              <polygon 
                points="60,6 98,22 114,60 98,98 60,114 22,98 6,60 22,22" 
                fill="#20130B" 
                stroke="#D4A043" 
                strokeWidth="2.5" 
              />
              <polygon 
                points="60,12 92,26 106,60 92,94 60,108 28,94 14,60 28,26" 
                fill="none" 
                stroke="#BA3424" 
                strokeWidth="1.2" 
                strokeDasharray="2 2"
              />

              {/* Ngôi sao mặt trời trống đồng 12 tia */}
              <circle cx="60" cy="60" r="32" fill="none" stroke="#D4A043" strokeWidth="1.5" />
              <g fill="#F3C96B" stroke="#D4A043" strokeWidth="0.5">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <polygon
                    key={deg}
                    points="60,34 63,52 57,52"
                    transform={`rotate(${deg} 60 60)`}
                  />
                ))}
              </g>

              {/* Tâm triện Chu Sa */}
              <circle cx="60" cy="60" r="11" fill="#BA3424" stroke="#F3C96B" strokeWidth="1" />
              <circle cx="60" cy="60" r="5" fill="#FFEAA7" />
            </svg>
          </div>
        </div>

        {/* Brand Name Typography */}
        <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[#F5EFE6] tracking-tight flex items-center justify-center gap-2">
          <span>Việt Phục Ký</span>
          <span className="text-[10px] sm:text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-[#382619] border border-[#D4A043]/50 text-[#F3C96B]">
            2026
          </span>
        </h1>

        {displaySubtitle && (
          <p className="text-xs sm:text-sm font-serif italic text-[#D8CCC0] mt-1 tracking-wide">
            {t('brand.slogan')}
          </p>
        )}
      </div>
    );
  }

  // Standard variant
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Emblem Crest */}
      <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F3C96B] via-[#D4A043] to-[#872013] p-[1.5px] shadow-lg shadow-black/50 flex-shrink-0">
        <div className="w-full h-full bg-[#160E09] rounded-[14px] flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-6 h-6">
            <polygon points="50,6 82,19 94,50 82,81 50,94 18,81 6,50 18,19" fill="#20130B" stroke="#D4A043" strokeWidth="2.5" />
            <polygon points="50,18 56,38 77,38 60,51 66,71 50,59 34,71 40,51 23,38 44,38" fill="#F3C96B" />
            <circle cx="50" cy="50" r="8" fill="#BA3424" />
            <circle cx="50" cy="50" r="3.5" fill="#FFEAA7" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-serif font-bold text-base sm:text-lg text-[#F5EFE6] tracking-wide">
            Việt Phục Ký
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4A043]" />
        </div>
        {displaySubtitle && (
          <span className="text-[10px] font-sans text-[#BAA796] tracking-wider uppercase">
            {isVi ? 'Cổ Phục & Đương Đại' : 'Heritage & Modernity'}
          </span>
        )}
      </div>
    </div>
  );
};
