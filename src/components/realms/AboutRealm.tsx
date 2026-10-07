import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  Compass, 
  ScrollText, 
  Layers,
  Award,
  Music2
} from 'lucide-react';
import { AppLogo } from '../brand/AppLogo';
import { useLanguage } from '../../contexts/LanguageContext';

interface AboutRealmProps {
  onBack: () => void;
}

export const AboutRealm: React.FC<AboutRealmProps> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  const pillars = [
    {
      icon: ShieldCheck,
      title: isVi ? 'Chuẩn Mực Điển Chế' : 'Historical Accuracy',
      desc: isVi 
        ? 'Dữ liệu được đúc kết từ điển chế trang phục cung đình và dân gian các triều đại Lý, Trần, Lê, Nguyễn.'
        : 'Reconstructed following imperial dress codes and traditional records from Lý, Trần, Lê, and Nguyễn eras.',
    },
    {
      icon: Sparkles,
      title: isVi ? 'Hơi Thở Gen Z' : 'Gen Z Modernity',
      desc: isVi
        ? 'Tự do kết hợp chất liệu cổ truyền, sắc màu thời thượng và phụ kiện hiện đại mà vẫn giữ hồn cốt di sản.'
        : 'Freely blend traditional silks, contemporary color palettes, and Gen Z aesthetics with cultural respect.',
    },
    {
      icon: Music2,
      title: isVi ? 'Âm Hưởng Dân Tộc' : 'Traditional Soundscape',
      desc: isVi
        ? 'Không gian âm thanh Đàn Tranh, Đàn Bầu, Sáo Trúc nguyên bản hòa quyện cùng từng chuyển động khám phá.'
        : 'Authentic Vietnamese acoustic instruments (Đàn Tranh, Đàn Bầu, Bamboo Flute) looping seamlessly across realms.',
    },
    {
      icon: HeartHandshake,
      title: isVi ? 'Tôn Vinh Làng Nghề' : 'Honoring Craft Villages',
      desc: isVi
        ? 'Tôn vinh nghệ nhân Lụa Vạn Phúc, Lãnh Mỹ A, Gấm Thượng Uyển và kết nối xưởng may cổ phục Việt.'
        : 'Honoring legendary silk villages like Vạn Phúc, Lãnh Mỹ A, and connecting users with master tailors nationwide.',
    },
  ];

  return (
    <div className="relative min-h-screen max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12 pb-28 md:pb-12 z-10 select-none">
      {/* Back button */}
      <motion.button
        type="button"
        onClick={onBack}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-4 py-2 rounded-full bg-[#241A13]/90 hover:bg-[#322319] border border-[#423023] text-xs font-sans text-[#D8CCC0] hover:text-[#F5EFE6] cursor-pointer shadow-md transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-[#F3C96B]" />
        <span>{t('btn.back')}</span>
      </motion.button>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#241A13]/90 border border-[#D4A043]/40 text-[#F3C96B] text-xs font-serif mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('about.badge')}</span>
        </div>

        <AppLogo variant="hero" className="mb-4 justify-center" />

        <h1 className="font-serif font-bold text-2xl sm:text-4xl text-[#F5EFE6] mb-3">
          {t('about.heading')}
        </h1>
        <p className="text-xs sm:text-sm text-[#BAA796] font-sans leading-relaxed max-w-2xl mx-auto">
          {t('about.intro')}
        </p>
      </motion.div>

      {/* 4 Cultural Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
              className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#241A13]/90 border border-[#423023] shadow-lg shadow-black/40 hover:border-[#678858]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#1C140E] border border-[#D4A043]/40 flex items-center justify-center text-[#F3C96B] mb-3.5 shadow-inner">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#F5EFE6] mb-1.5">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#BAA796] font-sans leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Heritage Ethics & Attribution */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1E1510] via-[#241A13] to-[#17100A] border border-[#D4A043]/40 shadow-xl text-center space-y-3"
      >
        <div className="flex items-center justify-center gap-2 text-xs font-serif font-bold text-[#F3C96B] uppercase tracking-wider">
          <Award className="w-4 h-4 text-[#D4A043]" />
          <span>{isVi ? 'Tuyên Ngôn Văn Hóa Việt Phục Ký' : 'Việt Phục Ký Cultural Manifesto'}</span>
        </div>
        <p className="text-xs sm:text-sm text-[#D8CCC0] font-serif italic leading-relaxed max-w-xl mx-auto">
          {isVi
            ? '“Trang phục là tấm gương phản chiếu tâm hồn và văn hiến một dân tộc. Sáng tạo đương đại chỉ thăng hoa trọn vẹn khi đặt trên nền tảng hiểu biết và lòng tôn kính tiền nhân.”'
            : '“Attire is the mirror reflecting the spirit and civilization of a nation. Contemporary creativity flourishes only when rooted in deep understanding and profound respect for ancestral heritage.”'}
        </p>
        <div className="pt-2 text-[11px] text-[#8E7B6C] font-mono">
          Việt Phục Ký © 2026 · AI Lead Architecture · Vietnam Heritage Initiative
        </div>
      </motion.div>
    </div>
  );
};