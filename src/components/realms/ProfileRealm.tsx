import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogOut, 
  ArrowLeft, 
  Sparkles, 
  Award, 
  Bookmark, 
  ShieldCheck, 
  Save, 
  Edit3, 
  X, 
  User, 
  Mail, 
  Calendar, 
  Heart,
  Settings,
  Music2,
  Volume2,
  Sliders,
  Eye,
  Zap,
  Check,
  RotateCcw,
  Palette,
  Layers,
  Sparkle
} from 'lucide-react';
import { UserProfile, STYLE_TAGS } from '../../types/auth';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppSettings } from '../../contexts/AppSettingsContext';
import { useSoundscape } from '../../contexts/SoundscapeContext';
import { SOUNDSCAPE_TRACKS } from '../../services/soundscapeEngine';

interface ProfileRealmProps {
  user: UserProfile | null;
  onUpdateProfile: (user: UserProfile) => void;
  onLogout: () => void;
  onBack: () => void;
}

export const ProfileRealm: React.FC<ProfileRealmProps> = ({
  user,
  onUpdateProfile,
  onLogout,
  onBack,
}) => {
  const { t, language, setLanguage } = useLanguage();
  const isVi = language === 'vi';
  
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<UserProfile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { settings, updateSetting, resetSettings } = useAppSettings();
  const { 
    setTrack, 
    setMasterVolume, 
    isPlaying, 
    play, 
    pause 
  } = useSoundscape();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (user) {
      setForm({ ...user });
    }
  }, [user]);

  if (!user || !form) return null;

  const handleChange = (field: keyof UserProfile, value: string) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const toggleStyle = (tag: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      const current = prev.stylePreferences || [];
      const exists = current.includes(tag);
      return {
        ...prev,
        stylePreferences: exists
          ? current.filter((t) => t !== tag)
          : [...current, tag],
      };
    });
  };

  const handleSave = () => {
    if (form) {
      onUpdateProfile(form);
      setIsEditing(false);
      showToast(isVi ? 'Đã lưu thông tin hồ sơ học giả thành công!' : 'Scholar profile updated successfully!');
    }
  };

  const handleCancel = () => {
    setForm({ ...user });
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setForm((prev) =>
        prev ? { ...prev, avatar: result, avatarUrl: result } : prev
      );
    };
    reader.readAsDataURL(file);
  };

  const handleResetAllSettings = () => {
    resetSettings();
    showToast(isVi ? 'Đã khôi phục cài đặt mặc định thành công!' : 'Settings restored to default!');
  };

  return (
    <div className="relative min-h-screen max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28 md:pb-12 flex flex-col justify-between select-none z-10">
      <div>
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#1C140E]/95 border border-[#D4A043] text-[#F5EFE6] text-xs font-serif shadow-2xl flex items-center gap-2 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4A043]" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Navigation & Tab Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#241A13]/90 border border-[#D4A043]/40 text-[#F3C96B] text-xs font-serif mb-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isVi ? 'Tài Khoản & Cài Đặt Ứng Dụng' : 'Scholar Profile & App Settings'}</span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-4xl text-[#F5EFE6]">
              {activeTab === 'profile' ? (isVi ? 'Hồ Sơ Học Giả' : 'Scholar Profile') : (isVi ? 'Cài Đặt Hệ Thống' : 'App Settings')}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="inline-flex p-1 rounded-full bg-[#241A13] border border-[#423023]">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#536B49] text-[#F5EFE6] shadow-sm'
                    : 'text-[#BAA796] hover:text-[#F5EFE6]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{isVi ? 'Hồ Sơ' : 'Profile'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#536B49] text-[#F5EFE6] shadow-sm'
                    : 'text-[#BAA796] hover:text-[#F5EFE6]'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{isVi ? 'Cài Đặt' : 'Settings'}</span>
              </button>
            </div>

            {activeTab === 'profile' && (
              !isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#536B49] hover:bg-[#627C56] border border-[#78976A] text-xs text-[#F5EFE6] cursor-pointer shadow-md transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t('btn.edit')}</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#241A13] hover:bg-[#322319] border border-[#423023] text-xs text-[#D8CCC0] hover:text-[#F5EFE6] cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{t('btn.cancel')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#536B49] hover:bg-[#627C56] border border-[#78976A] text-xs text-[#F5EFE6] cursor-pointer shadow-md transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{t('btn.save')}</span>
                  </button>
                </>
              )
            )}

            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#241A13]/90 hover:bg-[#322319] border border-[#423023] text-xs text-[#D8CCC0] hover:text-[#F5EFE6] cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('nav.home')}</span>
            </button>
          </div>
        </div>

        {/* TAB 1: HỒ SƠ HỌC GIẢ */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Profile Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1C140E]/90 border border-[#D4A043]/50 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              {/* Avatar + Upload */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#D4A043] shadow-xl flex-shrink-0 group">
                <img
                  src={form.avatar || form.avatarUrl}
                  alt={form.name}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-[11px] text-white font-medium">{isVi ? 'Đổi ảnh' : 'Change photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>

              <div className="flex-1 w-full text-center sm:text-left space-y-3">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-[#BAA796] block mb-1">{isVi ? 'Họ và tên / Danh xưng' : 'Full Name / Scholar Title'}</label>
                      <input
                        type="text"
                        value={form.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#241A13] border border-[#423023] text-[#F5EFE6] text-sm focus:outline-none focus:border-[#536B49]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#BAA796] block mb-1">Email</label>
                      <input
                        type="email"
                        value={form.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#241A13] border border-[#423023] text-[#F5EFE6] text-sm focus:outline-none focus:border-[#536B49]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-[#BAA796] block mb-1">{isVi ? 'Giới tính' : 'Gender'}</label>
                        <select
                          value={form.gender || ''}
                          onChange={(e) => handleChange('gender', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#241A13] border border-[#423023] text-[#F5EFE6] text-sm focus:outline-none focus:border-[#536B49]"
                        >
                          <option value="Không công khai">{isVi ? 'Không công khai' : 'Private'}</option>
                          <option value="Nam">{isVi ? 'Nam' : 'Male'}</option>
                          <option value="Nữ">{isVi ? 'Nữ' : 'Female'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] text-[#BAA796] block mb-1">{isVi ? 'Ngày sinh' : 'Date of birth'}</label>
                        <input
                          type="date"
                          value={form.birthDate || ''}
                          onChange={(e) => handleChange('birthDate', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#241A13] border border-[#423023] text-[#F5EFE6] text-sm focus:outline-none focus:border-[#536B49]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-2xl text-[#F5EFE6]">{form.name}</h3>
                    <span className="text-xs font-sans text-[#78976A] font-semibold block">{form.handle}</span>
                    <p className="text-xs sm:text-sm text-[#BAA796]">{form.email || 'scholar@vietphucký.vn'}</p>
                    <div className="pt-2 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <span className="text-[11px] px-3 py-0.5 rounded-full bg-[#241A13] text-[#D8CCC0] border border-[#423023]">
                        {form.dynastyAffinity || 'Triều Lý – Trần & Nguyễn'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sở thích phong cách */}
            <div className="mb-8">
              <h4 className="font-serif font-bold text-base sm:text-lg text-[#F5EFE6] mb-3">
                {isVi ? 'Sở thích & Phong cách cổ phục' : 'Style & Heritage Preferences'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {STYLE_TAGS.map((tag) => {
                  const active = (form.stylePreferences || []).includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      disabled={!isEditing}
                      onClick={() => isEditing && toggleStyle(tag)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-sans border transition-all ${
                        active
                          ? 'bg-[#536B49]/40 border-[#78976A] text-[#F5EFE6] shadow-sm'
                          : 'bg-[#1C140E] border-[#382619] text-[#BAA796]'
                      } ${isEditing ? 'cursor-pointer hover:border-[#78976A]' : 'cursor-default'}`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              <div className="p-4 rounded-2xl bg-[#1C140E]/90 border border-[#382619]">
                <span className="text-[10px] text-[#BAA796] uppercase tracking-wider block">{t('profile.scholar_rank')}</span>
                <span className="font-serif font-bold text-sm text-[#F3C96B] mt-1 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#D4A043]" /> {form.rank || (isVi ? 'Nhà Phối Sắc' : 'Heritage Stylist')}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#1C140E]/90 border border-[#382619]">
                <span className="text-[10px] text-[#BAA796] uppercase tracking-wider block">{t('profile.saved_outfits')}</span>
                <span className="font-serif font-bold text-sm text-[#F5EFE6] mt-1 flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-[#78976A]" /> {form.savedOutfits ?? 0} {isVi ? 'bộ' : 'outfits'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#1C140E]/90 border border-[#382619] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#BAA796] uppercase tracking-wider block">{isVi ? 'Bảo chứng điển chế' : 'Authenticity Seal'}</span>
                <span className="font-serif font-bold text-xs sm:text-sm text-[#78976A] mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#78976A]" /> {isVi ? 'Đạt chuẩn di sản' : 'Heritage Certified'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: CÀI ĐẶT ỨNG DỤNG & ÂM NHẠC */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* 1. ÂM THANH & NHẠC NỀN */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#1C140E]/90 border border-[#D4A043]/40 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#382619] pb-3">
                <div className="w-7 h-7 rounded-lg bg-[#2C1D13] border border-[#D4A043]/40 flex items-center justify-center text-[#D4A043]">
                  <Music2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#F5EFE6]">
                    {isVi ? 'Âm Thanh & Nhạc Nền Cổ Truyền' : 'Traditional Soundscape & Audio'}
                  </h3>
                  <p className="text-[11px] text-[#BAA796]">
                    {isVi ? 'Tùy chỉnh tự động phát âm thanh, giai điệu đàn tranh và mức âm lượng' : 'Manage auto-play on startup, default instrument melody and volume'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Tự động phát khi vào app */}
                <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#241A13]/80 border border-[#3E2C1E]">
                  <div className="space-y-0.5">
                    <span className="text-xs font-sans font-bold text-[#F5EFE6] block">
                      {isVi ? 'Luôn luôn tự động phát nhạc khi vào App' : 'Always auto-play music on app entry'}
                    </span>
                    <span className="text-[11px] text-[#BAA796] block">
                      {isVi ? 'Tự động ngân vang tiếng Đàn Tranh, Sáo Trúc ngay khi bạn mở ứng dụng' : 'Seamlessly starts traditional instrument soundscape as soon as you enter the app'}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.autoplaySoundscape}
                      onChange={(e) => {
                        updateSetting('autoplaySoundscape', e.target.checked);
                        if (e.target.checked && !isPlaying) {
                          play();
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#3E2C1E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#536B49]"></div>
                  </label>
                </div>

                {/* Thu gọn thanh nhạc thành biểu tượng */}
                <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#241A13]/80 border border-[#3E2C1E]">
                  <div className="space-y-0.5">
                    <span className="text-xs font-sans font-bold text-[#F5EFE6] block">
                      {isVi ? 'Thu gọn thanh âm nhạc thành biểu tượng nhỏ' : 'Collapse music player into mini orb icon'}
                    </span>
                    <span className="text-[11px] text-[#BAA796] block">
                      {isVi ? 'Thu nhỏ player thành biểu tượng đĩa nhạc tinh tế góc màn hình' : 'Display an elegant floating music disc instead of full widget'}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.soundscapeCollapsed}
                      onChange={(e) => updateSetting('soundscapeCollapsed', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#3E2C1E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#536B49]"></div>
                  </label>
                </div>

                {/* Chọn bài nhạc mặc định */}
                <div className="p-3 rounded-2xl bg-[#241A13]/80 border border-[#3E2C1E] space-y-2">
                  <span className="text-xs font-sans font-bold text-[#F5EFE6] block">
                    {isVi ? 'Giai điệu khởi động mặc định:' : 'Default Starter Melody:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SOUNDSCAPE_TRACKS.map((t) => {
                      const isSelected = settings.defaultTrackId === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            updateSetting('defaultTrackId', t.id);
                            setTrack(t.id);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#322319] border-[#D4A043] text-white ring-1 ring-[#D4A043]'
                              : 'bg-[#1C140E] border-[#3E2C1E] text-[#BAA796] hover:text-[#F5EFE6]'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-serif font-bold block">{isVi ? t.titleVi : t.titleEn}</span>
                            <span className="text-[10px] text-[#8E7B6C] block">{isVi ? t.instrumentVi : t.instrumentEn}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#D4A043]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Âm lượng tổng */}
                <div className="p-3 rounded-2xl bg-[#241A13]/80 border border-[#3E2C1E] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#F5EFE6] flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-[#D4A043]" />
                      <span>{isVi ? 'Âm lượng tổng:' : 'Master Volume:'}</span>
                    </span>
                    <span className="font-mono text-[#F3C96B]">{Math.round(settings.masterVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.masterVolume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      updateSetting('masterVolume', val);
                      setMasterVolume(val);
                    }}
                    className="w-full accent-[#D4A043]"
                  />
                </div>
              </div>
            </div>

            {/* 2. ĐỒ HỌA & HIỆU NĂNG */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#1C140E]/90 border border-[#382619] space-y-4">
              <div className="flex items-center gap-2 border-b border-[#382619] pb-3">
                <div className="w-7 h-7 rounded-lg bg-[#2C1D13] border border-[#D4A043]/40 flex items-center justify-center text-[#D4A043]">
                  <Sparkle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#F5EFE6]">
                    {isVi ? 'Đồ Họa & Không Gian Hoàng Cung' : 'Visual Ambiance & Performance'}
                  </h3>
                  <p className="text-[11px] text-[#BAA796]">
                    {isVi ? 'Điều chỉnh hiệu ứng hạt bụi vàng, sương mù động và chế độ hiển thị' : 'Configure floating gold dust, parallax fog and graphical smoothness'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Hạt bụi vàng */}
                <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#241A13]/80 border border-[#3E2C1E]">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#F5EFE6] block">
                      {isVi ? 'Bụi vàng hoàng cung' : 'Floating Gold Particles'}
                    </span>
                    <span className="text-[10px] text-[#BAA796] block">
                      {isVi ? 'Các đốm bụi vàng lấp lánh trong không gian' : 'Ethereal ambient golden dust particles'}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.goldParticles}
                      onChange={(e) => updateSetting('goldParticles', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#3E2C1E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#536B49]"></div>
                  </label>
                </div>

                {/* Sương mù Parallax */}
                <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#241A13]/80 border border-[#3E2C1E]">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#F5EFE6] block">
                      {isVi ? 'Sương mù động Parallax' : 'Parallax Fog Overlay'}
                    </span>
                    <span className="text-[10px] text-[#BAA796] block">
                      {isVi ? 'Lớp mây sương uốn lượn huyền ảo' : 'Multi-layered gentle mist effects'}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.parallaxFog}
                      onChange={(e) => updateSetting('parallaxFog', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#3E2C1E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#536B49]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* 3. TIỆN ÍCH & TỰ ĐỘNG HÓA */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#1C140E]/90 border border-[#382619] space-y-4">
              <div className="flex items-center gap-2 border-b border-[#382619] pb-3">
                <div className="w-7 h-7 rounded-lg bg-[#2C1D13] border border-[#D4A043]/40 flex items-center justify-center text-[#D4A043]">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#F5EFE6]">
                    {isVi ? 'Xưởng Phục Trang & Tiện Ích Tự Động' : 'Studio Preferences & Automation'}
                  </h3>
                  <p className="text-[11px] text-[#BAA796]">
                    {isVi ? 'Mặc định mô hình khi vào Xưởng và tự động lưu bản nháp thiết kế' : 'Default studio mannequin model and draft auto-saving'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Tự động lưu nháp */}
                <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#241A13]/80 border border-[#3E2C1E]">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#F5EFE6] block">
                      {isVi ? 'Tự động lưu bản phối nháp' : 'Auto-save design drafts'}
                    </span>
                    <span className="text-[10px] text-[#BAA796] block">
                      {isVi ? 'Lưu màu sắc và họa tiết vào bộ nhớ tạm' : 'Preserve custom colors & accessories'}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.autoSaveDrafts}
                      onChange={(e) => updateSetting('autoSaveDrafts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#3E2C1E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#536B49]"></div>
                  </label>
                </div>

                {/* Giới tính Model mặc định */}
                <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#241A13]/80 border border-[#3E2C1E]">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#F5EFE6] block">
                      {isVi ? 'Giới tính Model mặc định' : 'Default Mannequin Gender'}
                    </span>
                    <span className="text-[10px] text-[#BAA796] block">
                      {isVi ? 'Khởi tạo phác thảo Nữ hoặc Nam' : 'Starting model in Atelier customizer'}
                    </span>
                  </div>
                  <div className="inline-flex p-0.5 rounded-lg bg-[#140D08] border border-[#3E2C1E] text-[11px]">
                    <button
                      type="button"
                      onClick={() => updateSetting('defaultModelGender', 'female')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        settings.defaultModelGender === 'female'
                          ? 'bg-[#536B49] text-white font-bold'
                          : 'text-[#8E7B6C] hover:text-[#D8CCC0]'
                      }`}
                    >
                      {isVi ? 'Nữ' : 'Female'}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSetting('defaultModelGender', 'male')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        settings.defaultModelGender === 'male'
                          ? 'bg-[#536B49] text-white font-bold'
                          : 'text-[#8E7B6C] hover:text-[#D8CCC0]'
                      }`}
                    >
                      {isVi ? 'Nam' : 'Male'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Nút Khôi Phục Cài Đặt Gốc */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleResetAllSettings}
                  className="px-4 py-2 rounded-xl bg-[#241A13] hover:bg-[#322319] border border-[#423023] text-xs text-[#BAA796] hover:text-[#F5EFE6] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#D4A043]" />
                  <span>{isVi ? 'Khôi phục cài đặt gốc' : 'Reset to Defaults'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Logout */}
      <div className="pt-6 border-t border-[#382619] mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs font-serif text-[#8E7B6C]">
          Việt Phục Ký · {isVi ? 'Tài khoản bảo lưu di sản' : 'Heritage Scholar Pass'}
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#241A13] hover:bg-[#341814] border border-[#423023] hover:border-[#D65E49] text-xs font-serif text-[#D8CCC0] hover:text-[#FFA090] transition-all cursor-pointer shadow-md"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </div>
  );
};
