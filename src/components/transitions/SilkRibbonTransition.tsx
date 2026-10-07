import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface TransitionProps {
  isTransitioning: boolean;
  onMidpoint?: () => void;
  onComplete?: () => void;
  duration?: number; // Mặc định 0.36s: Nhanh, mượt, tối ưu hiệu năng tối đa
}

/**
 * Hiệu ứng chuyển cảnh Cinematic Minimalist cao cấp:
 * - KHÔNG dùng dải lụa phức tạp gây vướng mắt hoặc tốn tài nguyên.
 * - Ưu tiên hiệu năng 60 FPS tuyệt đối trên mọi thiết bị (chỉ dùng CSS GPU transform & opacity).
 * - Sử dụng ánh sương hoàng kim / hổ phách thanh nhã (tông nâu đất, vàng nghệ, kem be truyền thống).
 * - Trải nghiệm người dùng tức thì, mượt mà như game Genshin Impact.
 */
export const CinematicTransition: React.FC<TransitionProps> = ({
  isTransitioning,
  onMidpoint,
  onComplete,
  duration = 0.18,
}) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!isTransitioning) {
      setActive(false);
      return;
    }

    setActive(true);
    const totalMs = Math.round(duration * 1000);
    const midMs = Math.round(totalMs * 0.45);

    // Kích hoạt đổi màn hình tại điểm giữa (nhanh, không trễ)
    const midTimer = setTimeout(() => {
      if (onMidpoint) onMidpoint();
    }, midMs);

    // Hoàn tất chuyển cảnh
    const endTimer = setTimeout(() => {
      setActive(false);
      if (onComplete) onComplete();
    }, totalMs);

    return () => {
      clearTimeout(midTimer);
      clearTimeout(endTimer);
    };
  }, [isTransitioning, duration, onMidpoint, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="cinematic-ambient-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: duration * 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pointer-events-none fixed inset-0 z-[120] overflow-hidden select-none"
          aria-hidden="true"
        >
          {/* Lớp màn sương hổ phách thanh thoát (ấm áp, không tối đen, giữ tone nâu đất & kem be) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 0] }}
            transition={{
              duration: duration,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-[#1C140E]/35 backdrop-blur-[3px]"
          />

          {/* Ánh hào quang hoàng kim nhẹ ở trung tâm (Genshin-style golden ambient flare) */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
              scale: [0.95, 1.05, 1.1],
              opacity: [0, 0.35, 0],
            }}
            transition={{
              duration: duration,
              ease: 'easeOut',
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-[60vw] h-[40vh] rounded-full bg-gradient-to-r from-transparent via-[#D4A043]/15 to-transparent blur-3xl" />
          </motion.div>

          {/* Đường chỉ sáng tơ vàng viền ngang đỉnh & đáy tinh tế */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 0.8], opacity: [0, 0.6, 0] }}
            transition={{ duration: duration, ease: 'easeInOut' }}
            className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#F3C96B]/50 to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Export alias để tương thích ngược hoàn toàn
export const SilkRibbonTransition = CinematicTransition;
export default CinematicTransition;
