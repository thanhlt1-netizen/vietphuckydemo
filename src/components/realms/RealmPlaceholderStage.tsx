import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, Shirt, Sparkles } from 'lucide-react';
import { SceneMeta } from '../../types/scenes';
import { RecommendedCostume } from '../../types/context';

interface RealmPlaceholderStageProps {
  scene: SceneMeta;
  selectedCostume?: RecommendedCostume | null;
  onContinue: () => void;
  onBack: () => void;
}

export const RealmPlaceholderStage: React.FC<RealmPlaceholderStageProps> = ({
  scene,
  selectedCostume,
  onContinue,
  onBack,
}) => {
  return (
    <div className="relative min-h-screen flex flex-col justify-between pt-28 pb-14 px-4 sm:px-8 max-w-5xl mx-auto w-full z-10">
      {/* Central Immersive Stage - Clean & Focused */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-6xl font-serif font-bold text-[#F5EFE6] tracking-tight mb-4"
        >
          {scene.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg sm:text-xl text-[#BAA796] font-serif italic mb-8"
        >
          {scene.tagline}
        </motion.p>

        {/* Selected Costume Context Badge if on Atelier/Tùy biến */}
        {selectedCostume && scene.id === 'atelier' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#1C140E]/90 border border-[#465A3D]/50 shadow-md"
          >
            {selectedCostume.imageUrl && (
              <img
                src={selectedCostume.imageUrl}
                alt={selectedCostume.name}
                className="w-7 h-7 rounded-full object-cover border border-[#627C56]"
              />
            )}
            <div className="flex items-center gap-2 text-xs font-sans text-[#F5EFE6]">
              <Shirt className="w-3.5 h-3.5 text-[#78976A]" />
              <span>Đang tùy biến: <strong>{selectedCostume.name}</strong></span>
              <span className="text-[#8E7B6C]">({selectedCostume.dynasty})</span>
            </div>
            <span className="text-[10px] font-sans text-[#78976A] bg-[#293623] px-2 py-0.5 rounded-full border border-[#465A3D]">
              {selectedCostume.matchScore}% tương thích
            </span>
          </motion.div>
        )}

        {/* Ambient Canvas Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="w-full bg-[#241A13]/90 backdrop-blur-md border border-[#423023] rounded-3xl p-10 sm:p-12 shadow-xl shadow-black/40 mb-12 relative overflow-hidden text-center"
        >
          {/* Subtle Military Green corner brackets */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#627C56]/50" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#627C56]/50" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#627C56]/50" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#627C56]/50" />

          <p className="text-base sm:text-lg font-sans text-[#D8CCC0] leading-relaxed">
            {scene.subTitle}
          </p>
        </motion.div>

        {/* Navigation Action Triggers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex items-center gap-4"
        >
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#241A13] border border-[#423023] text-[#D8CCC0] text-sm font-sans font-medium hover:bg-[#322319] hover:border-[#627C56] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#627C56]"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2.5 px-8 py-3 rounded-full bg-gradient-to-r from-[#536B49] via-[#465A3D] to-[#36482F] hover:from-[#5C7752] hover:to-[#3E5136] text-[#F5EFE6] text-sm font-sans font-medium tracking-wide shadow-md shadow-[#2B3825]/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78976A]"
            aria-label="Tiếp tục"
          >
            <span>Tiến bước</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};
