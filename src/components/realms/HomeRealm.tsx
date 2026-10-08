import React from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  Shirt,
  Palette,
  ShieldCheck,
  Camera,
  MessageSquare,
  BookmarkCheck,
  MapPin,
  User,
  Info,
} from 'lucide-react';
import { RealmScene } from '../../types/scenes';
import { AppLogo } from '../brand/AppLogo';
import { useLanguage } from '../../contexts/LanguageContext';

interface HomeRealmProps {
  onNavigate: (scene: RealmScene) => void;
}

export const HomeRealm: React.FC<HomeRealmProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const menuItems: {
    id: RealmScene;
    label: string;
    desc: string;
    icon: React.ElementType;
  }[] = [
    {
      id: 'resonance',
      label: isVi ? 'Gợi Ý Bối Cảnh' : 'Context & Occasion',
      desc: isVi ? 'Chọn bối cảnh, sự kiện & nhận gợi ý phù hợp' : 'Select event, season & get curated Việt Phục recommendations',
      icon: Compass,
    },
    {
      id: 'sanctuary',
      label: isVi ? 'Kho Phục Trang' : 'Việt Phục Wardrobe',
      desc: isVi ? 'Khám phá 9 bộ Việt Phục chuẩn mực di sản' : 'Explore 9 historically accurate authentic Việt Phục styles',
      icon: Shirt,
    },
    {
      id: 'atelier',
      label: isVi ? 'Tùy Biến & Duyệt Văn Hóa AI' : 'Design & AI Cultural Audit',
      desc: isVi ? 'Phối ngũ hành, dệt họa tiết Canvas & thẩm định di sản bắt buộc' : 'Heritage palettes, Canvas patterns & mandatory cultural certification',
      icon: Palette,
    },
    {
      id: 'tryon',
      label: isVi ? 'Thử Đồ Ảo AI' : 'AI Virtual Try-On',
      desc: isVi ? 'Ướm Việt Phục đã duyệt lên chân dung thực tế' : 'Fit verified Việt Phục seamlessly onto your portrait',
      icon: Camera,
    },
    {
      id: 'forum',
      label: isVi ? 'Diễn Đàn Gen Z' : 'Gen Z Community',
      desc: isVi ? 'Cộng đồng chia sẻ và giao lưu bản phối' : 'Share styling looks, discuss culture and get feedback',
      icon: MessageSquare,
    },
    {
      id: 'chronicle',
      label: 'Lookbook',
      desc: isVi ? 'Bộ sưu tập trang phục và diện mạo đã lưu' : 'Archived creations, snapshots and saved styling cards',
      icon: BookmarkCheck,
    },
    {
      id: 'tailor',
      label: isVi ? 'Đặt May Nghệ Nhân' : 'Artisan Tailors',
      desc: isVi ? 'Kết nối nhà may & thợ thủ công cổ phục uy tín' : 'Connect with master craftsmen & renowned tailoring houses',
      icon: MapPin,
    },
    {
      id: 'profile',
      label: isVi ? 'Hồ Sơ Cá Nhân' : 'Scholar Profile',
      desc: isVi ? 'Quản lý tài khoản, tủ đồ và phong cách' : 'Manage your scholar pass, saved outfits & preferences',
      icon: User,
    },
    {
      id: 'about',
      label: isVi ? 'Giới Thiệu Di Sản' : 'About Project',
      desc: isVi ? 'Ý nghĩa văn hóa & sứ mệnh dự án Việt Phục' : 'Cultural mission & legacy of the Việt Phục initiative',
      icon: Info,
    },
  ];

  return (
    <div className="relative min-h-[100dvh] overflow-y-auto flex flex-col pt-6 sm:pt-10 pb-24 md:pb-16 px-4 sm:px-10 max-w-5xl mx-auto w-full z-10 select-none">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-8 flex flex-col items-center"
      >
        <AppLogo variant="hero" className="mb-2" />
        <p className="text-xs sm:text-sm text-[#BAA796] font-sans">
          {isVi 
            ? 'Chọn hành trình khám phá và sáng tạo Việt Phục' 
            : 'Choose your pathway to explore and customize Việt Phục'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 content-center">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => onNavigate(item.id)}
              className="flex items-start gap-4 p-5 rounded-2xl bg-[#241A13]/90 border border-[#423023] hover:border-[#536B49]/70 text-left transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#536B49]/25 border border-[#536B49]/40 flex items-center justify-center shrink-0 group-hover:bg-[#536B49]/40 transition-colors">
                <Icon className="w-5 h-5 text-[#78976A]" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-lg text-[#F5EFE6] mb-1">
                  {item.label}
                </h3>
                <p className="text-xs text-[#BAA796] font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};