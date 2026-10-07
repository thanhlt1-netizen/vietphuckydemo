import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  rotationEnd: number;
  opacity: number;
  swayDistance: number;
  type: 'bamboo-leaf' | 'petal' | 'stardust';
}

export const GoldParticles: React.FC = () => {
  // Tạo danh sách các hạt lá vàng và cánh hoa hoàng kim ổn định, phân bố đều theo chiều ngang
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const type: 'bamboo-leaf' | 'petal' | 'stardust' =
        i % 3 === 0 ? 'bamboo-leaf' : i % 3 === 1 ? 'petal' : 'stardust';

      const size =
        type === 'bamboo-leaf'
          ? 14 + (i % 4) * 2.2   // Lá trúc: 14px - 21px
          : type === 'petal'
          ? 11 + (i % 3) * 2.0   // Cánh hoa: 11px - 15px
          : 3.5 + (i % 3) * 1.2; // Bụi vàng: 3.5px - 5.9px

      return {
        id: i,
        x: (i * 4.15 + 4) % 94, // Rải đều từ 4% đến 94% chiều rộng màn hình
        delay: (i * 0.65) % 8,  // Khởi động so le nhịp nhàng
        duration: 15 + ((i * 1.7) % 9), // Rơi chậm 15s - 24s mang phong thái cổ phong thanh tịnh
        size,
        rotation: (i * 43) % 360,
        rotationEnd: (i % 2 === 0 ? 1 : -1) * (180 + (i % 4) * 60),
        opacity: type === 'stardust' ? 0.65 + (i % 3) * 0.1 : 0.5 + (i % 4) * 0.07, // Đủ rõ trên nền nâu đất tối mà không chói
        swayDistance: (i % 2 === 0 ? 1 : -1) * (3.5 + (i % 3) * 2.2), // Đung đưa nhẹ theo phương ngang (vw)
        type,
      };
    });
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-[5] select-none"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            y: '-8vh',
            x: `${p.x}vw`,
            opacity: 0,
            rotate: p.rotation,
          }}
          animate={{
            y: ['-8vh', '108vh'],
            x: [
              `${p.x}vw`,
              `${p.x + p.swayDistance}vw`,
              `${p.x - p.swayDistance * 0.5}vw`,
              `${p.x + p.swayDistance * 0.8}vw`,
            ],
            opacity: [0, p.opacity, p.opacity * 0.95, p.opacity * 0.8, 0],
            rotate: [p.rotation, p.rotation + p.rotationEnd * 0.5, p.rotation + p.rotationEnd],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
          className="absolute will-change-transform"
        >
          {p.type === 'bamboo-leaf' ? (
            // Silhouette Lá Trúc Vàng Hoàng Kim (Golden Bamboo Leaf)
            <div
              style={{
                width: `${p.size}px`,
                height: `${p.size * 1.65}px`,
              }}
              className="relative filter drop-shadow-[0_2px_5px_rgba(212,160,67,0.4)]"
            >
              <svg
                viewBox="0 0 24 38"
                fill="none"
                className="w-full h-full transform transition-transform"
              >
                <defs>
                  <linearGradient
                    id={`leaf-gold-${p.id}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#FFF2B2" />
                    <stop offset="35%" stopColor="#F3C96B" />
                    <stop offset="70%" stopColor="#D4A043" />
                    <stop offset="100%" stopColor="#A87522" />
                  </linearGradient>
                </defs>
                {/* Thân lá thon dài cong nhẹ duyên dáng */}
                <path
                  d="M12 1 C19 10, 23 23, 12 37 C1 23, 5 10, 12 1 Z"
                  fill={`url(#leaf-gold-${p.id})`}
                />
                {/* Gân lá ánh kim thanh mảnh */}
                <path
                  d="M12 2 Q12.6 19 12 35"
                  stroke="#FFFDF0"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                  opacity="0.65"
                />
              </svg>
            </div>
          ) : p.type === 'petal' ? (
            // Silhouette Cánh Hoa Đào / Hoa Mai Vàng Hoàng Kim (Golden Blossom Petal)
            <div
              style={{
                width: `${p.size}px`,
                height: `${p.size * 1.35}px`,
              }}
              className="relative filter drop-shadow-[0_2px_5px_rgba(243,201,107,0.35)]"
            >
              <svg viewBox="0 0 22 28" fill="none" className="w-full h-full">
                <defs>
                  <linearGradient
                    id={`petal-gold-${p.id}`}
                    x1="20%"
                    y1="0%"
                    x2="80%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#FFF9D6" />
                    <stop offset="40%" stopColor="#F3C96B" />
                    <stop offset="85%" stopColor="#D4A043" />
                    <stop offset="100%" stopColor="#B37E22" />
                  </linearGradient>
                </defs>
                {/* Đường cong mềm mại hình cánh hoa */}
                <path
                  d="M11 1 C18 6, 21 16, 11 27 C1 16, 4 6, 11 1 Z"
                  fill={`url(#petal-gold-${p.id})`}
                />
                <circle cx="11" cy="11" r="1.3" fill="#FFFDF0" opacity="0.6" />
              </svg>
            </div>
          ) : (
            // Hạt bụi vàng lấp lánh (Golden Stardust Fleck)
            <div
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
              }}
              className="rounded-full bg-gradient-to-tr from-[#E5B842] via-[#F3C96B] to-[#FFF9D6] shadow-[0_0_7px_2px_rgba(243,201,107,0.7)]"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

