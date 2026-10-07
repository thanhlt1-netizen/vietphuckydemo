import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Shirt, 
  Palette, 
  ShieldCheck, 
  BookmarkCheck, 
  Home,
  User,
  Camera,
  MessageSquare,
  MapPin,
  Landmark
} from 'lucide-react';
import { RealmScene } from '../types/scenes';
import { useLanguage } from '../contexts/LanguageContext';

interface RightActionDockProps {
  currentScene: RealmScene;
  onNavigate: (scene: RealmScene) => void;
  avatarUrl?: string;
}

interface NavItem {
  id: RealmScene;
  labelKey: string;
  shortLabelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  isProfile?: boolean;
}

export const RightActionDock: React.FC<RightActionDockProps> = ({
  currentScene,
  onNavigate,
  avatarUrl,
}) => {
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  const navItems: NavItem[] = [
    { id: 'gate', labelKey: 'nav.home', shortLabelKey: isVi ? 'Chính' : 'Gate', icon: Home },
    { id: 'resonance', labelKey: 'nav.resonance', shortLabelKey: isVi ? 'Bối Cảnh' : 'Context', icon: Compass },
    { id: 'sanctuary', labelKey: 'nav.sanctuary', shortLabelKey: 'Việt Phục', icon: Shirt },
    { id: 'museum', labelKey: 'nav.museum', shortLabelKey: isVi ? 'Bảo Tàng' : 'Museum', icon: Landmark },
    { id: 'atelier', labelKey: 'nav.atelier', shortLabelKey: isVi ? 'Tùy Biến' : 'Atelier', icon: Palette },
    { id: 'tryon', labelKey: 'nav.tryon', shortLabelKey: isVi ? 'Thử Đồ' : 'Try-On', icon: Camera },
    { id: 'forum', labelKey: 'nav.forum', shortLabelKey: isVi ? 'Diễn Đàn' : 'Forum', icon: MessageSquare },
    { id: 'chronicle', labelKey: 'nav.chronicle', shortLabelKey: 'Lookbook', icon: BookmarkCheck },
    { id: 'tailor', labelKey: 'nav.tailor', shortLabelKey: isVi ? 'Đặt May' : 'Tailor', icon: MapPin },
    { id: 'profile', labelKey: 'nav.profile', shortLabelKey: isVi ? 'Hồ Sơ' : 'Profile', icon: User, isProfile: true },
  ];

  return (
    <>
      {/* 1. Desktop Vertical Dock (Chỉ hiện trên md trở lên, không che phủ nội dung trên màn hình nhỏ) */}
      <aside 
        aria-label="Điều hướng tính năng (Desktop)"
        className="hidden md:flex fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3 select-none"
      >
        <div className="flex flex-col items-center gap-2 p-2 rounded-2xl bg-[#241A13]/95 backdrop-blur-md border border-[#423023] shadow-2xl shadow-black/50 ring-1 ring-[#D4A043]/15">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScene === item.id;

            return (
              <React.Fragment key={item.id}>
                {/* Divider before Profile Icon */}
                {item.isProfile && (
                  <div className="w-6 h-[1px] bg-gradient-to-r from-transparent via-[#5A402D] to-transparent my-1" aria-hidden="true" />
                )}

                <div className="relative group flex items-center">
                  {/* Tooltip on hover */}
                  <div className="pointer-events-none absolute right-full mr-3.5 px-3 py-1.5 rounded-xl bg-[#150E09]/95 text-[#F5EFE6] text-xs font-sans font-medium tracking-wide shadow-xl opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap z-50 border border-[#78976A]/40 backdrop-blur-md flex items-center gap-2">
                    <span>{t(item.labelKey)}</span>
                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-[#78976A] shadow-[0_0_8px_#78976A] animate-pulse" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4A043]/40 group-hover:bg-[#D4A043]" />
                    )}
                  </div>

                  {/* Tactile Framer Motion Icon Button */}
                  <motion.button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    whileHover={{ scale: isActive ? 1.05 : 1.10 }}
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78976A] will-change-transform ${
                      isActive
                        ? 'bg-gradient-to-br from-[#5A754E] via-[#465A3D] to-[#303F29] text-[#FFF] border border-[#8FB57F] shadow-lg shadow-[#2B3825]/80 ring-2 ring-[#78976A]/30'
                        : 'text-[#BAA796] border border-transparent hover:border-[#5A402D]/60 hover:text-[#FFF8EE] hover:bg-gradient-to-b hover:from-[#3A281C] hover:to-[#2B1D14] active:bg-[#1E140D] hover:shadow-md'
                    }`}
                    aria-label={t(item.labelKey)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.isProfile && avatarUrl ? (
                      <div className={`w-6 h-6 rounded-full overflow-hidden border transition-transform duration-200 ${isActive ? 'border-[#8FB57F] ring-1 ring-[#8FB57F]/60 scale-105' : 'border-[#5A402D] group-hover:border-[#BAA796]'}`}>
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <Icon className={`w-5 h-5 transition-all duration-200 ${isActive ? 'scale-110 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]' : 'group-hover:scale-110 group-hover:text-[#FFF8EE]'}`} />
                    )}

                    {/* Active Decorative Indicator */}
                    {isActive && (
                      <>
                        <span className="absolute -left-1.5 w-1.5 h-4 rounded-full bg-gradient-to-b from-[#A3C293] to-[#536B49] shadow-[0_0_8px_#78976A]" />
                        <span className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-white/10 to-transparent pointer-events-none" />
                      </>
                    )}
                  </motion.button>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </aside>

      {/* 2. Mobile Bottom Navigation Bar (Gọn gàng, dễ chạm, phản hồi xúc giác mượt mà) */}
      <nav
        aria-label="Điều hướng tính năng (Mobile)"
        className="flex md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#1A120C]/95 backdrop-blur-md border-t border-[#423023] px-2 py-1 shadow-2xl select-none"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.35rem)' }}
      >
        <div className="flex items-center justify-between w-full max-w-lg mx-auto overflow-x-auto scrollbar-none py-0.5 px-1 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScene === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                className={`relative flex flex-col items-center justify-center min-w-[50px] py-1.5 px-1.5 rounded-xl transition-all duration-150 cursor-pointer will-change-transform ${
                  isActive
                    ? 'bg-gradient-to-t from-[#374730]/90 to-[#4F6544]/90 text-[#FFF] border border-[#78976A]/80 shadow-[0_0_12px_rgba(120,151,106,0.35)] ring-1 ring-[#78976A]/40'
                    : 'text-[#BAA796] hover:text-[#FFF8EE] hover:bg-[#2C1F15] active:bg-[#20150E]'
                }`}
                aria-label={t(item.labelKey)}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.isProfile && avatarUrl ? (
                  <div className={`w-5 h-5 rounded-full overflow-hidden border mb-0.5 transition-transform duration-200 ${isActive ? 'border-[#8FB57F] ring-1 ring-[#8FB57F]' : 'border-[#5A402D]'}`}>
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <Icon className={`w-4 h-4 mb-0.5 transition-transform duration-200 ${isActive ? 'text-white scale-110 drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]' : 'text-[#BAA796]'}`} />
                )}
                <span className={`text-[9px] font-sans font-medium whitespace-nowrap leading-tight transition-colors duration-200 ${isActive ? 'text-white font-semibold' : 'text-[#BAA796]'}`}>
                  {item.shortLabelKey}
                </span>

                {/* Active Tiny Pulse Dot */}
                {isActive && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#8FB57F] shadow-[0_0_6px_#8FB57F]" />
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
