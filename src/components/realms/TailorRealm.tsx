import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Star, Navigation, Scissors, ArrowLeft, Eye, Sparkles } from 'lucide-react';
import { TAILOR_SHOPS } from '../../data/tailors';
import { OutfitCustomization } from '../../types/customization';
import { Character2DViewer } from '../customizer/Character2DViewer';
import { useLanguage } from '../../contexts/LanguageContext';

interface TailorRealmProps {
  currentCustomization?: OutfitCustomization | null;
  onBack?: () => void;
}

export const TailorRealm: React.FC<TailorRealmProps> = ({
  currentCustomization,
  onBack,
}) => {
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [showIllustration, setShowIllustration] = useState(true);

  const regions = [
    { id: 'all', label: isVi ? 'Tất cả' : 'All Regions' },
    { id: 'Miền Bắc', label: isVi ? 'Miền Bắc' : 'Northern Vietnam' },
    { id: 'Miền Trung', label: isVi ? 'Miền Trung' : 'Central Vietnam' },
    { id: 'Miền Nam', label: isVi ? 'Miền Nam' : 'Southern Vietnam' },
  ];

  const filteredShops = useMemo(() => {
    if (selectedRegion === 'all') return TAILOR_SHOPS;
    return TAILOR_SHOPS.filter((shop) => shop.region === selectedRegion);
  }, [selectedRegion]);

  return (
    <div className="w-full min-h-screen max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-28 md:pb-12 flex flex-col relative z-10 select-none">
      {/* Header section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {onBack && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-[#2A1F17]/80 border border-[#423023] flex items-center justify-center text-[#E8D5B5] hover:bg-[#3A2E22] transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
            </motion.button>
          )}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-[#241A13]/90 border border-[#D4A043]/40 text-[#F3C96B] text-xs font-serif mb-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>{t('tailor.badge')}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-serif text-[#F5EFE6] tracking-wide font-bold">
              {t('tailor.heading')}
            </h1>
            <p className="text-xs sm:text-sm text-[#BAA796] mt-0.5">
              {t('tailor.subheading')}
            </p>
          </div>
        </div>

        {/* Haute Couture Croquis preview card if customization exists */}
        {currentCustomization && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 sm:p-5 rounded-3xl bg-[#241A13]/90 border border-[#536B49]/40 shadow-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-[#78976A] text-xs sm:text-sm font-medium">
                <Scissors size={16} />
                <span>{isVi ? 'Bản Phác Thảo Thời Trang May Đo (Haute Couture Croquis)' : 'Bespoke Haute Couture Fashion Sketch'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#2A1F17] text-[#E8D5B5] border border-[#423023]">
                  {currentCustomization.gender === 'female' ? (isVi ? 'Model Nữ' : 'Feminine Model') : (isVi ? 'Model Nam' : 'Masculine Model')}
                </span>
                <button
                  type="button"
                  onClick={() => setShowIllustration(!showIllustration)}
                  className="p-1.5 rounded-lg bg-[#1C140E] border border-[#423023] text-[#BAA796] hover:text-[#F5EFE6] text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Eye size={13} />
                  <span>{showIllustration ? (isVi ? 'Thu gọn' : 'Collapse') : (isVi ? 'Xem mẫu' : 'Expand')}</span>
                </button>
              </div>
            </div>

            {showIllustration && (
              <div className="flex flex-col md:flex-row gap-5 items-center pt-2">
                <div className="w-full md:w-56 max-w-[240px]">
                  <Character2DViewer customization={currentCustomization} />
                </div>
                <div className="flex-1 space-y-2 text-left">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F5EFE6]">
                    {currentCustomization.costumeName || (isVi ? 'Bộ Việt Phục tùy chỉnh' : 'Custom Việt Phục Design')}
                  </h3>
                  <p className="text-xs text-[#BAA796] leading-relaxed">
                    {isVi
                      ? 'Bản phác thảo phong cách Fashion Illustration với tỷ lệ thanh thoát, thể hiện đúng phom dáng cổ truyền kết hợp sắc độ vải lụa mềm mại có chiều sâu.'
                      : 'High-fashion croquis illustration displaying authentic historical silhouettes and coordinated fabric drapery for tailor reference.'}
                  </p>
                  <div className="flex items-center gap-2 pt-2 border-t border-[#3E2C1E]/60 flex-wrap">
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: currentCustomization.parts.primaryRobeColor }} title="Vạt áo" />
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: currentCustomization.parts.innerCollarColor }} title="Cổ/Yếm" />
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: currentCustomization.parts.sashColor }} title="Thắt lưng" />
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: currentCustomization.parts.bottomColor }} title="Quần/Váy" />
                    <span className="text-[11px] text-[#D8CCC0] font-sans ml-1">
                      {currentCustomization.accessories.length} {isVi ? 'phụ kiện' : 'accessories'} · {isVi ? 'Họa tiết' : 'Motif'}: {currentCustomization.pattern}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Region Filter Buttons */}
      <div className="mb-5 flex gap-2 flex-wrap">
        {regions.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRegion(r.id)}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              selectedRegion === r.id
                ? 'bg-[#536B49] text-[#F5EFE6] shadow-md border border-[#78976A]/40'
                : 'bg-[#2A1F17]/80 text-[#BAA796] border border-[#423023] hover:border-[#536B49]/50 hover:text-white'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Tailor Shop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredShops.map((shop, index) => (
          <motion.div
            key={`${shop.id}-${index}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="p-4 sm:p-5 rounded-2xl bg-[#241A13]/90 border border-[#423023] hover:border-[#536B49]/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2.5">
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#F5EFE6]">{shop.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[#78976A] text-xs font-medium">
                    <MapPin size={13} />
                    <span>{shop.region}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-[#536B49]/20 px-2.5 py-1 rounded-lg border border-[#627C56]/30">
                  <Star size={13} className="text-[#D4A043] fill-[#D4A043]" />
                  <span className="text-xs font-bold text-[#F5EFE6]">{shop.rating}</span>
                </div>
              </div>

              <p className="text-xs text-[#BAA796] mb-3 flex items-start gap-1.5">
                <MapPin size={13} className="mt-0.5 shrink-0 text-[#8E7B6C]" />
                <span className="line-clamp-2">{shop.address}</span>
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {shop.specialties.map((spec, sIdx) => (
                  <span
                    key={`${shop.id}-spec-${sIdx}`}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#3A2E22] text-[#E8D5B5] border border-[#423023]"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2.5 pt-3 border-t border-[#3E2C1E]/50">
              <a
                href={`tel:${shop.phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#536B49] text-[#F5EFE6] text-xs font-medium hover:bg-[#627C56] transition-colors"
              >
                <Phone size={14} />
                <span>{isVi ? `Gọi ${shop.phone}` : `Call ${shop.phone}`}</span>
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${shop.location.lat},${shop.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#2A1F17] border border-[#423023] text-[#E8D5B5] text-xs hover:border-[#536B49]/60 hover:text-white transition-colors"
              >
                <Navigation size={14} />
                <span>{isVi ? 'Chỉ đường' : 'Maps'}</span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};