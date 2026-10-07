import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Sun, 
  CloudRain, 
  Wind, 
  Snowflake, 
  MapPin, 
  Check, 
  Heart, 
  GraduationCap, 
  Flag, 
  Gift, 
  Compass, 
  Calendar 
} from 'lucide-react';
import { ContextSelection, RecommendedCostume } from '../../types/context';
import { DEFAULT_FEATURED_COSTUMES } from '../../services/recommendationService';
import { useLanguage } from '../../contexts/LanguageContext';

interface ResonanceRealmProps {
  initialSelection?: ContextSelection | null;
  onContinue: (selection: ContextSelection, recommendations: RecommendedCostume[]) => void;
  onBack: () => void;
}

export const ResonanceRealm: React.FC<ResonanceRealmProps> = ({
  initialSelection,
  onContinue,
  onBack,
}) => {
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  const SEASONS = [
    { id: 'xuân', label: isVi ? 'Xuân' : 'Spring', icon: Sun },
    { id: 'hạ', label: isVi ? 'Hạ' : 'Summer', icon: CloudRain },
    { id: 'thu', label: isVi ? 'Thu' : 'Autumn', icon: Wind },
    { id: 'đông', label: isVi ? 'Đông' : 'Winter', icon: Snowflake },
  ];

  const REGIONS = [
    { id: 'bắc', label: isVi ? 'Miền Bắc (Kinh Bắc - Thăng Long)' : 'Northern Vietnam (Thăng Long)' },
    { id: 'trung', label: isVi ? 'Miền Trung (Cố Đô Huế)' : 'Central Vietnam (Imperial Huế)' },
    { id: 'nam', label: isVi ? 'Miền Nam (Sông Nước Nam Bộ)' : 'Southern Vietnam (Mekong Delta)' },
  ];

  const OCCASIONS = [
    { id: 'cưới', label: isVi ? 'Đám cưới & Đại Hỷ' : 'Wedding & Nuptials', icon: Heart },
    { id: 'kỷ-yếu', label: isVi ? 'Kỷ yếu & Tốt nghiệp' : 'Graduation & Yearbook', icon: GraduationCap },
    { id: 'lễ-hội', label: isVi ? 'Lễ hội & Điển lễ' : 'Heritage Festivals', icon: Sparkles },
    { id: 'quốc-khánh', label: isVi ? 'Quốc Khánh & Đại Lễ' : 'National Celebrations', icon: Flag },
    { id: 'tết', label: isVi ? 'Tết Cổ Truyền' : 'Lunar New Year (Tết)', icon: Sun },
    { id: 'sinh-nhật', label: isVi ? 'Sinh nhật & Gặp gỡ' : 'Birthday & Gatherings', icon: Gift },
    { id: 'đi-chơi', label: isVi ? 'Dạo phố & Chụp ảnh' : 'Casual Stroll & Photos', icon: Compass },
  ];

  const [season, setSeason] = useState(initialSelection?.season || 'xuân');
  const [region, setRegion] = useState(initialSelection?.region || 'bắc');
  const [occasion, setOccasion] = useState(initialSelection?.occasion || initialSelection?.eventId || 'cưới');

  const handleRecommend = () => {
    let matched = [...DEFAULT_FEATURED_COSTUMES];

    if (occasion === 'cưới') {
      matched = matched.filter(c => ['ao-tac', 'nhat-binh', 'ngu-than'].includes(c.id));
    } else if (occasion === 'kỷ-yếu') {
      matched = matched.filter(c => ['ao-dai', 'ngu-than'].includes(c.id));
    } else if (occasion === 'lễ-hội') {
      if (region === 'bắc') {
        matched = matched.filter(c => ['tu-than', 'ao-tac', 'nhat-binh'].includes(c.id));
      } else {
        matched = matched.filter(c => ['nhat-binh', 'ao-tac', 'tu-than'].includes(c.id));
      }
    } else if (occasion === 'tết') {
      matched = matched.filter(c => ['ao-dai', 'ngu-than', 'ao-tac'].includes(c.id));
    } else if (occasion === 'quốc-khánh') {
      matched = matched.filter(c => ['ao-dai', 'ngu-than', 'ao-tac'].includes(c.id));
    } else if (occasion === 'sinh-nhật') {
      matched = matched.filter(c => ['ao-dai', 'ba-ba', 'ngu-than'].includes(c.id));
    } else if (occasion === 'đi-chơi') {
      if (region === 'nam') {
        matched = matched.filter(c => ['ba-ba', 'ao-dai', 'ngu-than'].includes(c.id));
      } else {
        matched = matched.filter(c => ['ao-dai', 'ba-ba', 'ngu-than'].includes(c.id));
      }
    }

    if (matched.length === 0) {
      matched = DEFAULT_FEATURED_COSTUMES.slice(0, 3);
    }

    const eventObj = OCCASIONS.find(o => o.id === occasion);

    const selection: ContextSelection = {
      season,
      region,
      occasion,
      eventId: occasion,
      eventName: eventObj ? eventObj.label : (isVi ? 'Đám cưới' : 'Wedding'),
    };

    onContinue(selection, matched);
  };

  return (
    <div className="relative min-h-[85vh] max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8 flex flex-col justify-between select-none z-10">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#241A13]/90 border border-[#D4A043]/40 text-[#F3C96B] text-xs font-serif mb-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('resonance.badge')}</span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-4xl text-[#F5EFE6]">
              {t('resonance.heading')}
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#BAA796] mt-1.5">
              {t('resonance.subheading')}
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#241A13]/90 border border-[#423023] hover:border-[#678858] text-xs text-[#D8CCC0] hover:text-[#F5EFE6] transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('btn.back')}</span>
          </button>
        </div>

        {/* 1. Chọn Mùa */}
        <div className="mb-7">
          <label className="flex items-center gap-2 text-xs font-serif font-bold text-[#F3C96B] uppercase tracking-wider mb-3">
            <Sun className="w-4 h-4 text-[#D4A043]" />
            <span>{t('resonance.step1')}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SEASONS.map((s) => {
              const Icon = s.icon;
              const isSelected = season === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSeason(s.id)}
                  className={`p-4 rounded-2xl flex items-center justify-between border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#384C32] to-[#253820] border-[#D4A043] shadow-lg shadow-black/40 text-[#F5EFE6] scale-[1.02]'
                      : 'bg-[#1C140E]/85 border-[#382619] hover:border-[#678858]/60 hover:bg-[#251B13] text-[#D8CCC0]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-[#F3C96B]' : 'text-[#8E7B6C]'}`} />
                    <span className="font-serif font-bold text-base">{s.label}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#F3C96B]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Chọn Khu Vực */}
        <div className="mb-7">
          <label className="flex items-center gap-2 text-xs font-serif font-bold text-[#F3C96B] uppercase tracking-wider mb-3">
            <MapPin className="w-4 h-4 text-[#D4A043]" />
            <span>{t('resonance.step2')}</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {REGIONS.map((r) => {
              const isSelected = region === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRegion(r.id)}
                  className={`p-4 rounded-2xl flex items-center justify-between border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#384C32] to-[#253820] border-[#D4A043] shadow-lg shadow-black/40 text-[#F5EFE6] scale-[1.02]'
                      : 'bg-[#1C140E]/85 border-[#382619] hover:border-[#678858]/60 hover:bg-[#251B13] text-[#D8CCC0]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#F3C96B]' : 'text-[#8E7B6C]'}`} />
                    <span className="font-serif font-bold text-base">{r.label}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#F3C96B]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Chọn Sự Kiện */}
        <div className="mb-8">
          <label className="flex items-center gap-2 text-xs font-serif font-bold text-[#F3C96B] uppercase tracking-wider mb-3">
            <Calendar className="w-4 h-4 text-[#D4A043]" />
            <span>{t('resonance.step3')}</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {OCCASIONS.map((o) => {
              const Icon = o.icon;
              const isSelected = occasion === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setOccasion(o.id)}
                  className={`p-3.5 rounded-2xl flex items-center justify-between border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#384C32] to-[#253820] border-[#D4A043] shadow-lg shadow-black/40 text-[#F5EFE6] scale-[1.02]'
                      : 'bg-[#1C140E]/85 border-[#382619] hover:border-[#678858]/60 hover:bg-[#251B13] text-[#D8CCC0]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#F3C96B]' : 'text-[#8E7B6C]'}`} />
                    <span className="font-sans font-semibold text-sm">{o.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#F3C96B]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end pt-5 border-t border-[#382619]">
        <button
          type="button"
          onClick={handleRecommend}
          className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#678858] via-[#48683B] to-[#253820] hover:from-[#78976A] hover:to-[#384C32] border border-[#D4A043]/70 text-[#F5EFE6] font-serif font-bold text-sm tracking-wide shadow-xl shadow-black/60 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>{t('resonance.cta')}</span>
          <ArrowRight className="w-4 h-4 text-[#F3C96B]" />
        </button>
      </div>
    </div>
  );
};
