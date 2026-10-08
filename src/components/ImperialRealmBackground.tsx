import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RealmScene } from '../types/scenes';

import bgGate from '../assets/images/hub_living_landscape_1790419114444.jpg';
import bgResonance from '../assets/images/bright_garden_resonance_1790412486989.jpg';
import bgSanctuary from '../assets/images/bright_sanctuary_hall_1790412501898.jpg';
import bgAtelier from '../assets/images/bright_atelier_craft_1790412520132.jpg';
import bgOracle from '../assets/images/bright_oracle_archive_1790412537614.jpg';
import bgChronicle from '../assets/images/bright_chronicle_lookbook_1790412552336.jpg';
import bgProfile from '../assets/images/bright_profile_study_1790412571728.jpg';

export type RealmBackgroundKey = RealmScene | 'login';

interface ImperialRealmBackgroundProps {
  currentScene: RealmScene;
  isLoggedIn: boolean;
}

interface LanternConfig {
  id: string;
  xPos: string;
  topOffset: string;
  cordLength: number;
  scale: number;
  duration: number;
  delay: number;
  maxAngle: number;
  lanternType: 'imperial-gold' | 'royal-jade' | 'cinnabar-amber';
}

interface SceneTheme {
  title: string;
  image: string;
  lanterns: LanternConfig[];
}

const SCENE_THEMES: Record<RealmBackgroundKey, SceneTheme> = {
  gate: {
    title: 'Hoàng Thành Khởi Nguyên Sáng Rạng',
    image: bgGate,
    lanterns: [
      {
        id: 'gate-l1',
        xPos: 'left-6 sm:left-12 md:left-20',
        topOffset: '-top-6',
        cordLength: 95,
        scale: 1,
        duration: 5.4,
        delay: 0,
        maxAngle: 3.8,
        lanternType: 'imperial-gold',
      },
      {
        id: 'gate-l2',
        xPos: 'left-24 sm:left-36 md:left-52',
        topOffset: '-top-10',
        cordLength: 70,
        scale: 0.8,
        duration: 4.8,
        delay: 0.7,
        maxAngle: 3.2,
        lanternType: 'royal-jade',
      },
      {
        id: 'gate-r1',
        xPos: 'right-16 sm:right-28 md:right-40',
        topOffset: '-top-6',
        cordLength: 105,
        scale: 1.05,
        duration: 5.8,
        delay: 0.4,
        maxAngle: 4.0,
        lanternType: 'cinnabar-amber',
      },
      {
        id: 'gate-r2',
        xPos: 'right-36 sm:right-56 md:right-72',
        topOffset: '-top-12',
        cordLength: 65,
        scale: 0.75,
        duration: 4.5,
        delay: 1.1,
        maxAngle: 3.0,
        lanternType: 'royal-jade',
      },
    ],
  },
    home: {
    title: 'Màn Hình Chính',
    image: bgGate,
    lanterns: [
      {
        id: 'home-l1',
        xPos: 'left-6 sm:left-12 md:left-20',
        topOffset: '-top-6',
        cordLength: 95,
        scale: 1,
        duration: 5.4,
        delay: 0,
        maxAngle: 3.8,
        lanternType: 'imperial-gold',
      },
      {
        id: 'home-l2',
        xPos: 'left-24 sm:left-36 md:left-52',
        topOffset: '-top-10',
        cordLength: 70,
        scale: 0.8,
        duration: 4.8,
        delay: 0.7,
        maxAngle: 3.2,
        lanternType: 'royal-jade',
      },
      {
        id: 'home-r1',
        xPos: 'right-16 sm:right-28 md:right-40',
        topOffset: '-top-6',
        cordLength: 105,
        scale: 1.05,
        duration: 5.8,
        delay: 0.4,
        maxAngle: 4.0,
        lanternType: 'cinnabar-amber',
      },
      {
        id: 'home-r2',
        xPos: 'right-36 sm:right-56 md:right-72',
        topOffset: '-top-12',
        cordLength: 65,
        scale: 0.75,
        duration: 4.5,
        delay: 1.1,
        maxAngle: 3.0,
        lanternType: 'royal-jade',
      },
    ],
  },
  about: {
    title: 'Thông Tin Ứng Dụng',
    image: bgProfile,
    lanterns: [
      {
        id: 'about-l1',
        xPos: 'left-6 sm:left-14 md:left-24',
        topOffset: '-top-6',
        cordLength: 90,
        scale: 0.95,
        duration: 5.3,
        delay: 0.2,
        maxAngle: 3.5,
        lanternType: 'imperial-gold',
      },
      {
        id: 'about-r1',
        xPos: 'right-8 sm:right-16 md:right-24',
        topOffset: '-top-6',
        cordLength: 95,
        scale: 0.95,
        duration: 5.6,
        delay: 0.6,
        maxAngle: 3.6,
        lanternType: 'royal-jade',
      },
    ],
  },
  resonance: {
    title: 'Nguyệt Kiều Bối Cảnh Trong Lành',
    image: bgResonance,
    lanterns: [
      {
        id: 'res-l1',
        xPos: 'left-8 sm:left-16 md:left-24',
        topOffset: '-top-8',
        cordLength: 85,
        scale: 0.95,
        duration: 5.0,
        delay: 0.2,
        maxAngle: 3.5,
        lanternType: 'royal-jade',
      },
      {
        id: 'res-r1',
        xPos: 'right-14 sm:right-24 md:right-36',
        topOffset: '-top-6',
        cordLength: 90,
        scale: 1.0,
        duration: 5.6,
        delay: 0.8,
        maxAngle: 3.6,
        lanternType: 'imperial-gold',
      },
      {
        id: 'res-r2',
        xPos: 'right-32 sm:right-52 md:right-64',
        topOffset: '-top-12',
        cordLength: 60,
        scale: 0.7,
        duration: 4.6,
        delay: 1.3,
        maxAngle: 2.8,
        lanternType: 'cinnabar-amber',
      },
    ],
  },
  sanctuary: {
    title: 'Đại Điện Y Phục Lộng Lẫy',
    image: bgSanctuary,
    lanterns: [
      {
        id: 'sanc-l1',
        xPos: 'left-6 sm:left-14 md:left-24',
        topOffset: '-top-6',
        cordLength: 100,
        scale: 1.05,
        duration: 5.7,
        delay: 0.3,
        maxAngle: 3.8,
        lanternType: 'cinnabar-amber',
      },
      {
        id: 'sanc-r1',
        xPos: 'right-12 sm:right-24 md:right-36',
        topOffset: '-top-8',
        cordLength: 95,
        scale: 0.95,
        duration: 5.2,
        delay: 0.9,
        maxAngle: 3.4,
        lanternType: 'imperial-gold',
      },
    ],
  },
  atelier: {
    title: 'Phòng Thêu Tùy Biến Nắng Mai',
    image: bgAtelier,
    lanterns: [
      {
        id: 'atel-l1',
        xPos: 'left-8 sm:left-16 md:left-28',
        topOffset: '-top-8',
        cordLength: 80,
        scale: 0.9,
        duration: 4.9,
        delay: 0.1,
        maxAngle: 3.2,
        lanternType: 'royal-jade',
      },
      {
        id: 'atel-r1',
        xPos: 'right-16 sm:right-28 md:right-44',
        topOffset: '-top-6',
        cordLength: 90,
        scale: 0.95,
        duration: 5.3,
        delay: 0.6,
        maxAngle: 3.6,
        lanternType: 'imperial-gold',
      },
    ],
  },
  oracle: {
    title: 'Tàng Thư AI Duyệt Thanh Nhã',
    image: bgOracle,
    lanterns: [
      {
        id: 'orac-l1',
        xPos: 'left-10 sm:left-20 md:left-32',
        topOffset: '-top-6',
        cordLength: 110,
        scale: 1.05,
        duration: 6.0,
        delay: 0.5,
        maxAngle: 3.4,
        lanternType: 'imperial-gold',
      },
      {
        id: 'orac-r1',
        xPos: 'right-14 sm:right-28 md:right-40',
        topOffset: '-top-8',
        cordLength: 85,
        scale: 0.85,
        duration: 4.8,
        delay: 1.0,
        maxAngle: 3.0,
        lanternType: 'royal-jade',
      },
    ],
  },
  chronicle: {
    title: 'Hành Lang Lookbook Ngập Ánh Sáng',
    image: bgChronicle,
    lanterns: [
      {
        id: 'chron-l1',
        xPos: 'left-6 sm:left-14 md:left-24',
        topOffset: '-top-6',
        cordLength: 90,
        scale: 0.95,
        duration: 5.2,
        delay: 0.4,
        maxAngle: 3.6,
        lanternType: 'cinnabar-amber',
      },
      {
        id: 'chron-r1',
        xPos: 'right-16 sm:right-28 md:right-40',
        topOffset: '-top-8',
        cordLength: 95,
        scale: 1.0,
        duration: 5.5,
        delay: 0.9,
        maxAngle: 3.5,
        lanternType: 'royal-jade',
      },
    ],
  },
  profile: {
    title: 'Thư Phòng An Nhiên Tràn Nắng',
    image: bgProfile,
    lanterns: [
      {
        id: 'prof-l1',
        xPos: 'left-8 sm:left-16 md:left-28',
        topOffset: '-top-8',
        cordLength: 80,
        scale: 0.9,
        duration: 5.0,
        delay: 0.2,
        maxAngle: 3.2,
        lanternType: 'royal-jade',
      },
      {
        id: 'prof-r1',
        xPos: 'right-14 sm:right-26 md:right-36',
        topOffset: '-top-6',
        cordLength: 90,
        scale: 0.95,
        duration: 5.6,
        delay: 0.7,
        maxAngle: 3.5,
        lanternType: 'imperial-gold',
      },
    ],
  },
  tryon: {
    title: 'Phòng Thử Đồ Chân Dung Di Sản',
    image: bgSanctuary,
    lanterns: [
      {
        id: 'tryon-l1',
        xPos: 'left-6 sm:left-12 md:left-20',
        topOffset: '-top-6',
        cordLength: 90,
        scale: 0.95,
        duration: 5.2,
        delay: 0.1,
        maxAngle: 3.4,
        lanternType: 'imperial-gold',
      },
      {
        id: 'tryon-r1',
        xPos: 'right-8 sm:right-16 md:right-24',
        topOffset: '-top-6',
        cordLength: 95,
        scale: 0.95,
        duration: 5.5,
        delay: 0.5,
        maxAngle: 3.6,
        lanternType: 'cinnabar-amber',
      },
    ],
  },
  forum: {
    title: 'Diễn Đàn Cổ Phục Sáng Tạo',
    image: bgResonance,
    lanterns: [
      {
        id: 'forum-l1',
        xPos: 'left-6 sm:left-14 md:left-24',
        topOffset: '-top-6',
        cordLength: 90,
        scale: 0.95,
        duration: 5.4,
        delay: 0.2,
        maxAngle: 3.5,
        lanternType: 'imperial-gold',
      },
      {
        id: 'forum-r1',
        xPos: 'right-8 sm:right-16 md:right-24',
        topOffset: '-top-6',
        cordLength: 95,
        scale: 0.95,
        duration: 5.7,
        delay: 0.6,
        maxAngle: 3.7,
        lanternType: 'cinnabar-amber',
      },
    ],
  },
    tailor: {
    title: 'Xưởng May Cổ Phục Toàn Quốc',
    image: bgAtelier,          // dùng lại ảnh có sẵn, không cần thêm ảnh mới
    lanterns: [
      {
        id: 'tailor-l1',
        xPos: 'left-6 sm:left-14 md:left-24',
        topOffset: '-top-6',
        cordLength: 90,
        scale: 0.95,
        duration: 5.3,
        delay: 0.2,
        maxAngle: 3.5,
        lanternType: 'imperial-gold',
      },
      {
        id: 'tailor-r1',
        xPos: 'right-8 sm:right-16 md:right-24',
        topOffset: '-top-6',
        cordLength: 95,
        scale: 0.95,
        duration: 5.6,
        delay: 0.6,
        maxAngle: 3.6,
        lanternType: 'royal-jade',
      },
    ],
  },
  login: {
    title: 'Cổng Triều Đình Cổ Phong Rực Rỡ',
    image: bgGate,
    lanterns: [
      {
        id: 'login-l1',
        xPos: 'left-6 sm:left-14 md:left-24',
        topOffset: '-top-6',
        cordLength: 100,
        scale: 1.0,
        duration: 5.5,
        delay: 0.2,
        maxAngle: 3.8,
        lanternType: 'imperial-gold',
      },
      {
        id: 'login-r1',
        xPos: 'right-6 sm:right-14 md:right-24',
        topOffset: '-top-6',
        cordLength: 100,
        scale: 1.0,
        duration: 5.3,
        delay: 0.8,
        maxAngle: 3.6,
        lanternType: 'cinnabar-amber',
      },
    ],
  },
};

// 1. Tập hợp danh sách các ảnh nền độc nhất cần preload
export const ALL_BACKGROUND_IMAGES: string[] = Array.from(
  new Set(Object.values(SCENE_THEMES).map((theme) => theme.image))
);

// Cache lưu trữ trạng thái đã tải của ảnh
const preloadedImageCache = new Set<string>();
let isGlobalPreloadExecuted = false;

/**
 * Preload tất cả ảnh nền trong SCENE_THEMES vào cache trình duyệt (chỉ thực hiện một lần duy nhất)
 */
export function preloadRealmBackgrounds(): void {
  if (typeof window === 'undefined' || isGlobalPreloadExecuted) return;
  isGlobalPreloadExecuted = true;
  Object.values(SCENE_THEMES).forEach((theme) => {
    if (theme.image) {
      const img = new Image();
      img.src = theme.image;
      img.onload = () => {
        preloadedImageCache.add(theme.image);
      };
      if (img.decode) {
        img.decode().then(() => {
          preloadedImageCache.add(theme.image);
        }).catch(() => {
          preloadedImageCache.add(theme.image);
        });
      }
    }
  });
}

// Khởi chạy preload ngay khi file được nạp
preloadRealmBackgrounds();

/**
 * Component hiển thị một lớp ảnh nền kèm chuyển động thở chậm và các lớp vignette
 */
interface BackgroundImageLayerProps {
  image: string;
  title: string;
  onLoaded?: () => void;
}

const BackgroundImageLayer: React.FC<BackgroundImageLayerProps> = ({
  image,
  title,
  onLoaded,
}) => {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Breathing Cinematic Camera Drift */}
      <motion.div
        animate={{
          scale: [1.01, 1.04, 1.01],
          y: ['0%', '-1%', '0%'],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-full h-full"
      >
        <img
          src={image}
          alt={title}
          decoding="async"
          onLoad={onLoaded}
          className="w-full h-full object-cover object-center opacity-80 filter brightness-[1.04] contrast-[1.02] saturate-[1.08]"
        />
      </motion.div>

      {/* Gentle, Translucent Radial Vignette (Preserves bright center and azure sky) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C140E]/85 via-transparent to-[#1C140E]/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1C140E]/60 via-transparent to-[#1C140E]/60 pointer-events-none" />
      {/* Subtle golden ambient morning radiance */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#FAF3E6]/10 to-transparent pointer-events-none" />
    </div>
  );
};

export const ImperialRealmBackground: React.FC<ImperialRealmBackgroundProps> = ({
  currentScene,
  isLoggedIn,
}) => {
  const activeKey: RealmBackgroundKey = !isLoggedIn ? 'login' : currentScene;
  const currentTheme = SCENE_THEMES[activeKey] || SCENE_THEMES.gate;

  // Lớp ảnh nền trước đó (Outgoing Layer): Giữ nguyên 100% opacity ở dưới để màn hình KHÔNG BAO GIỜ bị trống
  const [prevTheme, setPrevTheme] = useState<SceneTheme | null>(null);

  // Lớp ảnh nền hiện tại (Active/Incoming Layer)
  const [activeTheme, setActiveTheme] = useState<SceneTheme>(currentTheme);

  // Trạng thái ảnh hiện tại đã sẵn sàng để hiển thị mượt mà chưa
  const [isCurrentReady, setIsCurrentReady] = useState<boolean>(() => {
    return preloadedImageCache.has(currentTheme.image);
  });

  // 1. Preload tất cả theme.image trong SCENE_THEMES ngay khi component mount (chỉ một lần duy nhất)
  useEffect(() => {
    preloadRealmBackgrounds();
  }, []);

  // 2. Chuyển scene: khi currentTheme.image thay đổi, giữ ảnh cũ làm prevTheme cho đến khi ảnh mới sẵn sàng
  useEffect(() => {
    if (currentTheme.image === activeTheme.image) {
      return;
    }

    // Đưa theme đang hiển thị xuống lớp nền bảo vệ bên dưới (prevTheme)
    setPrevTheme(activeTheme);
    setActiveTheme(currentTheme);

    if (preloadedImageCache.has(currentTheme.image)) {
      setIsCurrentReady(true);
    } else {
      setIsCurrentReady(false);
      const img = new Image();
      img.src = currentTheme.image;
      img.onload = () => {
        preloadedImageCache.add(currentTheme.image);
        setIsCurrentReady(true);
      };
      if (img.decode) {
        img.decode().then(() => {
          preloadedImageCache.add(currentTheme.image);
          setIsCurrentReady(true);
        }).catch(() => {
          preloadedImageCache.add(currentTheme.image);
          setIsCurrentReady(true);
        });
      }
    }
  }, [currentTheme.image]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Lớp nền cũ (Outgoing Base Layer): Luôn giữ 100% opacity đến khi ảnh mới fade-in hoàn tất, không để màn hình trống */}
      {prevTheme && (
        <div className="absolute inset-0 z-0">
          <BackgroundImageLayer
            image={prevTheme.image}
            title={prevTheme.title}
          />
        </div>
      )}

      {/* Lớp nền mới (Active/Incoming Layer): Crossfade mượt mà đè lên lớp cũ */}
      <motion.div
        key={`theme-layer-${activeTheme.image}`}
        initial={prevTheme ? { opacity: 0 } : false}
        animate={{ opacity: isCurrentReady ? 1 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => {
          // Khi ảnh mới đã đạt 100% opacity, gỡ bỏ an toàn lớp ảnh cũ phía sau mà không gây chớp giật
          if (isCurrentReady && prevTheme) {
            setPrevTheme(null);
          }
        }}
        className="absolute inset-0 z-[1]"
      >
        <BackgroundImageLayer
          image={activeTheme.image}
          title={activeTheme.title}
          onLoaded={() => {
            preloadedImageCache.add(activeTheme.image);
            setIsCurrentReady(true);
          }}
        />
      </motion.div>

      {/* 3. Lớp đèn lồng đung đưa tương ứng từng Realm */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`lanterns-${activeKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full relative"
          >
            {currentTheme.lanterns.map((lantern) => (
              <SwingingLantern key={lantern.id} config={lantern} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

interface SwingingLanternProps {
  config: LanternConfig;
}

const SwingingLantern: React.FC<SwingingLanternProps> = ({ config }) => {
  const { xPos, topOffset, cordLength, scale, duration, delay, maxAngle, lanternType } = config;

  const isJade = lanternType === 'royal-jade';
  const isCinnabar = lanternType === 'cinnabar-amber';

  const bodyGradient = isJade
    ? 'from-[#628555] via-[#48623F] to-[#2E4028]'
    : isCinnabar
    ? 'from-[#A65335] via-[#854025] to-[#592917]'
    : 'from-[#B89244] via-[#8F6C25] to-[#5C4314]';

  const glowShadow = isJade
    ? '0 0 28px rgba(125, 172, 105, 0.55)'
    : isCinnabar
    ? '0 0 30px rgba(225, 115, 75, 0.55)'
    : '0 0 30px rgba(245, 190, 80, 0.6)';

  const ribColor = isJade ? '#A4C694' : isCinnabar ? '#F0A384' : '#F5D48A';
  const tasselColor = isJade ? '#5F8050' : isCinnabar ? '#9E4429' : '#AB8334';

  return (
    <div className={`absolute ${topOffset} ${xPos} z-10`} style={{ transform: `scale(${scale})` }}>
      {/* Upper Attachment Pivot with Swaying */}
      <motion.div
        animate={{
          rotate: [-maxAngle, maxAngle, -maxAngle],
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          transformOrigin: 'top center',
        }}
        className="flex flex-col items-center will-change-transform"
      >
        {/* Hanging Golden Silk Cord */}
        <div
          style={{ height: `${cordLength}px` }}
          className="w-[1.5px] bg-gradient-to-b from-[#3D2C1F] via-[#B8935A] to-[#E5C68A] relative shadow-xs"
        >
          <div className="absolute bottom-2 -left-[2.5px] w-1.5 h-1.5 rounded-full bg-[#F5D898] shadow-xs" />
        </div>

        {/* Ornate Top Wooden Crown / Eave Bracket */}
        <div className="relative flex flex-col items-center">
          <div className="w-14 h-3 bg-gradient-to-r from-[#241A13] via-[#4F3926] to-[#241A13] rounded-t-lg border-t border-b border-[#8C6D49] shadow-sm flex items-center justify-center">
            <div className="w-8 h-1 bg-[#D4B37B] rounded-full opacity-90" />
          </div>
          <div className="absolute -left-1.5 top-0 w-2 h-2 border-t-2 border-l-2 border-[#D4B37B] -rotate-45" />
          <div className="absolute -right-1.5 top-0 w-2 h-2 border-t-2 border-r-2 border-[#D4B37B] rotate-45" />
        </div>

        {/* Glowing Imperial Lantern Body */}
        <div className="relative my-0.5">
          {/* Pulsating Candlelight Core Glow */}
          <motion.div
            animate={{
              opacity: [0.8, 1, 0.82, 0.96, 0.8],
              scale: [0.97, 1.03, 0.98, 1.02, 0.97],
            }}
            transition={{
              duration: 3.0,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ boxShadow: glowShadow }}
            className="absolute inset-1 rounded-full blur-[9px] pointer-events-none"
          />

          {/* Traditional Polygonal / Melon Silk Body */}
          <div
            className={`relative w-16 h-20 rounded-[26px] bg-gradient-to-b ${bodyGradient} border border-[#F5D48A]/60 shadow-lg flex items-center justify-center overflow-hidden`}
          >
            {/* Silk rib frame lines */}
            <div
              style={{ borderColor: ribColor }}
              className="absolute inset-0 opacity-50 border-l border-r border-dashed"
            />
            <div
              style={{ borderColor: ribColor }}
              className="absolute inset-0 opacity-40 border-l-2 border-r-2 rounded-[22px] mx-2"
            />
            <div
              style={{ borderColor: ribColor }}
              className="absolute inset-0 opacity-45 border-t border-b mx-1 my-3"
            />

            {/* Inner Golden Silhouette Motif */}
            <svg
              className="w-7 h-7 opacity-85 drop-shadow-[0_0_6px_rgba(255,230,160,0.8)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFF1D0"
              strokeWidth="1.3"
            >
              <path d="M12 4 C10 8, 7 10, 5 14 C7 17, 10 18, 12 20 C14 18, 17 17, 19 14 C17 10, 14 8, 12 4 Z" />
              <circle cx="12" cy="14" r="2" fill="#FFF1D0" />
            </svg>
          </div>
        </div>

        {/* Lower Base Cap & Knot Ring */}
        <div className="w-10 h-2.5 bg-gradient-to-r from-[#241A13] via-[#4F3926] to-[#241A13] rounded-b-md border-b border-[#8C6D49] flex items-center justify-center">
          <div className="w-5 h-1 bg-[#D4B37B] rounded-full" />
        </div>

        {/* Brass Hanging Ring */}
        <div className="w-3 h-3 rounded-full border border-[#D4B37B] -mt-0.5 flex items-center justify-center" />

        {/* Swaying Silk Tassel with Secondary Pendulum Inertia */}
        <motion.div
          animate={{
            rotate: [-maxAngle * 1.6, maxAngle * 1.6, -maxAngle * 1.6],
          }}
          transition={{
            duration: duration * 0.95,
            delay: delay + 0.15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: 'top center' }}
          className="flex flex-col items-center -mt-0.5 will-change-transform"
        >
          <div className="w-[1.2px] h-3.5 bg-[#D4B37B]" />
          <div className="w-2 h-2 rounded-full bg-[#F5D898] shadow-xs" />
          <div
            style={{ backgroundColor: tasselColor }}
            className="w-2.5 h-10 rounded-b-sm opacity-95 shadow-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/15" />
            <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-t from-[#F5D898]/60 to-transparent" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
