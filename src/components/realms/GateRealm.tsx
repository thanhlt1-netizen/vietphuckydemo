import React from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Compass, ArrowRight } from 'lucide-react';
import { AppLogo } from '../brand/AppLogo';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSoundscape } from '../../contexts/SoundscapeContext';

interface GateRealmProps {
  onEnterWorld: () => void;
}

export const GateRealm: React.FC<GateRealmProps> = ({ onEnterWorld }) => {
  const { t, language } = useLanguage();
  const { isPlaying, isMuted, togglePlay, toggleMute } = useSoundscape();
  const isVi = language === 'vi';

  return (
    <div className="relative min-h-[100dvh] overflow-y-auto flex flex-col justify-between py-4 sm:py-8 px-4 sm:px-12 max-w-7xl mx-auto w-full z-10 select-none">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center justify-between w-full pl-24 sm:pl-32"
      >
        <AppLogo size="md" variant="horizontal" showSlogan={true} />

        <button
          type="button"
          onClick={() => {
            if (!isPlaying) {
              togglePlay();
            } else {
              toggleMute();
            }
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#241A13]/85 border border-[#423023] text-[#D8CCC0] hover:text-[#F5EFE6] text-xs transition-all cursor-pointer shadow-md"
        >
          {isMuted || !isPlaying ? <VolumeX className="w-4 h-4 text-[#E05252]" /> : <Volume2 className="w-4 h-4 text-[#D4A043]" />}
          <span>{isMuted || !isPlaying ? (isVi ? 'Bật nhã nhạc' : 'Play Music') : (isVi ? 'Tắt tiếng' : 'Mute Music')}</span>
        </button>
      </motion.header>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 my-2 sm:my-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="max-w-xl py-2"
        >
          <h2 className="font-serif font-bold text-2xl sm:text-5xl text-[#F5EFE6] mb-2 sm:mb-4 leading-tight">
            {isVi ? 'Bước vào thế giới Việt Phục' : 'Enter the Realm of Việt Phục'}
          </h2>
          <p className="text-xs sm:text-base text-[#BAA796] mb-5 sm:mb-8 font-sans">
            {isVi 
              ? 'Khám phá, phối và cách tân trang phục truyền thống theo hơi thở Gen Z' 
              : 'Discover, coordinate, and modernize authentic Việt Phục tailored for Gen Z'}
          </p>

          <button
            type="button"
            onClick={onEnterWorld}
            className="inline-flex items-center gap-2.5 sm:gap-3 px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-gradient-to-r from-[#536B49] to-[#3B4D33] text-[#F5EFE6] text-sm sm:text-lg font-serif font-semibold shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-transform cursor-pointer border border-[#78976A]/40"
          >
            <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{isVi ? 'Khám phá Việt Phục' : 'Explore Việt Phục'}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </motion.div>
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-[11px] sm:text-xs text-[#8E7B6C] font-serif italic pt-2 sm:pt-4"
      >
        {isVi ? 'Việt Phục Ký · Dự án văn hóa di sản đương đại 2026' : 'Việt Phục Ký · Contemporary Vietnamese Heritage Project 2026'}
      </motion.footer>
    </div>
  );
};