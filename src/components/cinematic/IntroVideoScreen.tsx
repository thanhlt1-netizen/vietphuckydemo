import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, ArrowRight, Play, Pause, Music } from 'lucide-react';
import { UserProfile } from '../../types/auth';
import { LoginRealm } from '../realms/LoginRealm';
import { AppLogo } from '../brand/AppLogo';

export interface IntroVideoOverlayProps {
  onDismiss: () => void;
  onLoginSuccess?: (authenticatedUser: UserProfile) => void;
  isLoggedIn?: boolean;
}

export const IntroVideoOverlay: React.FC<IntroVideoOverlayProps> = ({
  onDismiss,
  onLoginSuccess,
  isLoggedIn = false,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mở âm thanh và kích hoạt luồng phát nhạc
  const enableAudio = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    try {
      // Đánh thức Web Audio Context nếu trình duyệt đang giữ ở trạng thái suspended
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      }
    } catch {
      // ignore
    }

    video.muted = false;
    video.volume = 1.0;
    setIsMuted(false);
    setAudioBlocked(false);

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  }, []);

  // 1. Tự động phát video và mở âm thanh ngay lập tức (Unmuted Autoplay)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = 1.0;
    video.muted = false;

    // Thử phát ngay có âm thanh
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMuted(false);
          setAudioBlocked(false);
          setIsPlaying(true);
        })
        .catch(() => {
          // Trình duyệt (Chrome/Safari) chặn autoplay có âm thanh khi chưa tương tác:
          // Cho video chạy có hình (muted) trước và hiển thị thông báo hướng dẫn chạm để mở âm thanh ngay
          video.muted = true;
          setIsMuted(true);
          setAudioBlocked(true);
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        });
    }

    // Lắng nghe tương tác đầu tiên của người dùng ở bất kỳ đâu trên trang để mở tiếng ngay
    const handleUserGesture = () => {
      enableAudio();
    };

    window.addEventListener('click', handleUserGesture, { once: true });
    window.addEventListener('pointerdown', handleUserGesture, { once: true });
    window.addEventListener('touchstart', handleUserGesture, { once: true });
    window.addEventListener('keydown', handleUserGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('pointerdown', handleUserGesture);
      window.removeEventListener('touchstart', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
    };
  }, [enableAudio]);

  // 2. Sau 5 giây hiện Login overlay (nếu người dùng chưa đăng nhập)
  useEffect(() => {
    if (isLoggedIn) return;

    const timer = setTimeout(() => {
      setShowLoginOverlay(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  // 3. Tạm dừng / Tiếp tục video
  const togglePlayPause = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // 4. Bật / Tắt âm thanh thủ công
  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (isMuted) {
      enableAudio();
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
      onClick={enableAudio}
      className="fixed inset-0 z-50 bg-[#120C08] flex items-center justify-center overflow-hidden select-none cursor-pointer"
    >
      {/* 1. Video Intro phát full màn hình - Đúng nguồn /videointrovietphuc.mp4 */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          src="/videointrovietphuc.mp4"
          autoPlay
          playsInline
          loop={false}
          onEnded={onDismiss}
          className="w-full h-full object-cover filter brightness-[0.95]"
        />

        {/* Ambient Subtle Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#140E0A]/15 to-[#0F0A06]/60 pointer-events-none" />
      </div>

      {/* 2. Top Bar với nút Điều Khiển & Skip rõ ràng */}
      <header 
        onClick={(e) => e.stopPropagation()} 
        className="absolute top-5 left-6 right-6 flex items-center justify-between z-20 pointer-events-auto"
      >
        <div className="flex items-center gap-3">
          <AppLogo variant="standard" showSubtitle={false} />
        </div>

        <div className="flex items-center gap-2.5">
          {/* Nút Play / Pause */}
          <button
            type="button"
            onClick={togglePlayPause}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C140E]/85 border border-[#423023] hover:border-[#678858] text-xs text-[#D8CCC0] hover:text-[#F5EFE6] transition-all cursor-pointer backdrop-blur-md shadow-sm"
            aria-label={isPlaying ? 'Tạm dừng video' : 'Tiếp tục phát'}
            title={isPlaying ? 'Tạm dừng' : 'Phát tiếp'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#BAA796]" /> : <Play className="w-3.5 h-3.5 text-[#F3C96B]" />}
            <span className="hidden sm:inline">{isPlaying ? 'Tạm dừng' : 'Phát'}</span>
          </button>

          {/* Nút Âm thanh - Nổi bật khi âm thanh đang bị tắt */}
          <button
            type="button"
            onClick={toggleMute}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-sans transition-all cursor-pointer backdrop-blur-md shadow-md ${
              !isMuted 
                ? 'bg-[#384C32]/90 border-[#78976A] text-[#F3C96B]' 
                : 'bg-[#8F3E22]/90 border-[#E89265] text-[#FFE8D6] animate-pulse hover:bg-[#A34727]'
            }`}
            aria-label="Bật tắt âm thanh"
            title="Bật / tắt âm thanh"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#FFE8D6]" /> : <Volume2 className="w-3.5 h-3.5 text-[#F3C96B]" />}
            <span>{isMuted ? 'Bật âm thanh' : 'Nhã nhạc'}</span>
          </button>

          {/* Nút Bỏ Qua (Skip) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#384C32]/90 hover:bg-[#48683B] border border-[#D4A043]/60 text-xs font-serif font-bold text-[#F5EFE6] transition-all cursor-pointer shadow-lg backdrop-blur-md hover:scale-105 active:scale-95"
            aria-label="Bỏ qua video giới thiệu"
          >
            <span>Bỏ qua</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F3C96B]" />
          </button>
        </div>
      </header>

      {/* 3. Badge thông báo hỗ trợ mở âm thanh nếu trình duyệt tạm thời chặn */}
      <AnimatePresence>
        {audioBlocked && isMuted && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              e.stopPropagation();
              enableAudio();
            }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#241710]/95 border border-[#D4A043]/80 shadow-2xl backdrop-blur-md text-[#F3C96B] hover:text-white cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            <Music className="w-4 h-4 animate-bounce text-[#F3C96B]" />
            <span className="text-xs font-medium tracking-wide">
              Nhấn vào màn hình để bật Nhã Nhạc 🎵
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Lớp Login Overlay Fade In sau 5s (có nút Xem tiếp video để ẩn Login) */}
      <AnimatePresence>
        {showLoginOverlay && !isLoggedIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
          >
            <LoginRealm
              isOverlay={true}
              onClose={() => setShowLoginOverlay(false)}
              closeButtonText="Xem tiếp video"
              onLoginSuccess={(user) => {
                onLoginSuccess?.(user);
                onDismiss();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Dòng chú thích mờ bản quyền âm nhạc góc dưới trái */}
      <footer className="absolute bottom-4 left-6 max-w-2xl z-20 pointer-events-none select-none text-left">
        <p className="text-[10px] sm:text-[11px] leading-relaxed text-[#BAA796]/75 font-sans">
          Âm nhạc sử dụng trong bài thi: 无人之地no-mans-land - UM. Sản phẩm chỉ phục vụ cho mục đích phi thương mại, đánh giá kĩ thuật trong khuôn khổ cuộc thi AI ARENA 2026. Toàn bộ bản quyền âm nhạc thuộc về chủ sở hữu hợp pháp.
          <br />
          Audio track: 无人之地no-mans-land by UM. Used solely for non-commercial educational and competition evaluation under Fair Use principles. All rights belong to their respective copyright owners.
        </p>
      </footer>
    </motion.div>
  );
};

export const IntroVideoScreen = IntroVideoOverlay;
