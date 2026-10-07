import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, User, Key, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { UserProfile } from '../../types/scenes';
import { AppLogo } from '../brand/AppLogo';
import { useLanguage } from '../../contexts/LanguageContext';

interface LoginRealmProps {
  onLoginSuccess: (user: UserProfile) => void;
  onClose?: () => void;
  closeButtonText?: string;
  isOverlay?: boolean;
}

export const LoginRealm: React.FC<LoginRealmProps> = ({ 
  onLoginSuccess,
  onClose,
  closeButtonText,
  isOverlay = false,
}) => {
  const { t, language } = useLanguage();
  const isVi = language === 'vi';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleGuestLogin = () => {
    const guestImg = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';
    const guestUser: UserProfile = {
      id: 'guest-' + Date.now(),
      name: 'Lữ Khách Cố Đô',
      handle: '@lukhadien',
      avatar: guestImg,
      avatarUrl: guestImg,
      dynastyAffinity: 'Triều Nguyễn & Hậu Lê',
      rank: 'Tập Sự Cổ Phục',
      savedOutfits: 3,
      stylePreferences: ['Giao Lĩnh', 'Cung Đình', 'Cách Tân Gen Z'],
    };
    onLoginSuccess(guestUser);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userImg = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop';
    const user: UserProfile = {
      id: 'user-' + Date.now(),
      name: username.trim() || 'Nhà Thiết Kế Gen Z',
      handle: '@' + (username.trim().toLowerCase().replace(/\s+/g, '') || 'vietphuc_genz'),
      avatar: userImg,
      avatarUrl: userImg,
      dynastyAffinity: 'Triều Lý – Trần & Nguyễn',
      rank: 'Nhà Phối Sắc Di Sản',
      savedOutfits: 7,
      stylePreferences: ['Áo Tấc', 'Nhật Bình', 'Tối Giản'],
    };
    onLoginSuccess(user);
  };

  return (
    <div className={`relative flex items-center justify-center px-4 py-6 sm:py-8 select-none z-10 ${isOverlay ? 'w-full' : 'min-h-[85vh]'}`}>
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm sm:max-w-md p-6 sm:p-10 rounded-3xl bg-[#1C140E]/95 border border-[#D4A043]/60 backdrop-blur-2xl shadow-2xl shadow-black/90 flex flex-col items-center"
      >
        {/* Nút Tắt / Ẩn Login (Xem tiếp video) khi ở chế độ overlay trên video */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#241A13]/90 hover:bg-[#342418] border border-[#D4A043]/50 text-xs font-sans text-[#D8CCC0] hover:text-[#F5EFE6] transition-all cursor-pointer shadow-md"
            aria-label={isVi ? 'Tắt hoặc ẩn form đăng nhập để tiếp tục xem video' : 'Close or minimize login form'}
            title={isVi ? 'Tắt / Ẩn Login để xem tiếp video' : 'Minimize login'}
          >
            <X className="w-3.5 h-3.5 text-[#F3C96B]" />
            <span>{closeButtonText || (isVi ? 'Xem tiếp video' : 'Watch video')}</span>
          </button>
        )}

        {/* Emblem Crest & Logo Việt Phục Ký */}
        <AppLogo variant="hero" showSubtitle={false} className="mb-2" />
        <p className="text-xs sm:text-sm font-serif italic text-[#BAA796] text-center mb-1">
          {t('login.tagline')}
        </p>

        {/* Traditional Form */}
        <form onSubmit={handleSubmit} className="w-full mt-5 sm:mt-6 space-y-3.5 sm:space-y-4">
          <div>
            <label className="block text-xs font-serif text-[#D8CCC0] mb-1.5 pl-1">
              {t('login.username_label')}
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-[#BAA796]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('login.username_placeholder')}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-[#261A13]/90 border border-[#423023] focus:border-[#D4A043] focus:ring-1 focus:ring-[#D4A043] text-sm text-[#F5EFE6] placeholder-[#8E7B6C] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-serif text-[#D8CCC0] mb-1.5 pl-1">
              {t('login.password_label')}
            </label>
            <div className="relative flex items-center">
              <Key className="absolute left-3.5 w-4 h-4 text-[#BAA796]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-[#261A13]/90 border border-[#423023] focus:border-[#D4A043] focus:ring-1 focus:ring-[#D4A043] text-sm text-[#F5EFE6] placeholder-[#8E7B6C] outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 sm:py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#678858] via-[#48683B] to-[#253820] hover:from-[#78976A] hover:to-[#384C32] border border-[#D4A043]/70 text-[#F5EFE6] font-serif font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-black/50 transition-all cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>{t('login.submit_btn')}</span>
            <ArrowRight className="w-4 h-4 text-[#F3C96B] group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Divider */}
        <div className="w-full flex items-center gap-3 my-4 sm:my-5">
          <div className="flex-1 h-[1px] bg-[#382619]" />
          <span className="text-[11px] font-serif text-[#8E7B6C] uppercase tracking-wider">{t('login.or')}</span>
          <div className="flex-1 h-[1px] bg-[#382619]" />
        </div>

        {/* Fast Guest Experience */}
        <button
          type="button"
          onClick={handleGuestLogin}
          className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#241A13]/85 hover:bg-[#322319] border border-[#423023] hover:border-[#678858] text-xs font-serif text-[#D8CCC0] hover:text-[#F5EFE6] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F3C96B]" />
          <span>{t('login.quick_enter')}</span>
        </button>

        <div className="mt-4 sm:mt-5 flex items-center gap-2 text-[11px] text-[#8E7B6C] font-serif">
          <ShieldCheck className="w-3.5 h-3.5 text-[#678858]" />
          <span>{t('login.security_guarantee')}</span>
        </div>
      </motion.div>
    </div>
  );
};
