import React from 'react';
import { motion } from 'motion/react';

export interface ParallaxFogOverlayProps {
  isContentScreen?: boolean;
}

export const ParallaxFogOverlay: React.FC<ParallaxFogOverlayProps> = ({
  isContentScreen = false,
}) => {
  return (
    <div className={`fixed inset-0 pointer-events-none z-[2] overflow-hidden select-none transition-opacity duration-700 ${isContentScreen ? 'opacity-60' : 'opacity-100'}`}>
      {/* Upper subtle mist drift */}
      <motion.div
        animate={{
          x: ['-5%', '5%', '-5%'],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-0 -left-[20%] w-[140%] h-[40vh] bg-gradient-to-b from-[#2E2015]/20 to-transparent blur-3xl"
      />

      {/* Lower subtle warm ground mist */}
      <motion.div
        animate={{
          x: ['5%', '-5%', '5%'],
          opacity: [0.18, 0.3, 0.18],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-0 -left-[20%] w-[140%] h-[35vh] bg-gradient-to-t from-[#1C140E]/30 to-transparent blur-3xl"
      />
    </div>
  );
};
