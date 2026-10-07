import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Download, 
  BookmarkCheck, 
  ArrowLeft, 
  RefreshCw, 
  Check, 
  User, 
  Shirt, 
  Layers, 
  Info,
  Sliders,
  Eye,
  CheckCircle2,
  Palette,
  Sparkle,
  AlertTriangle
} from 'lucide-react';
import { OutfitCustomization, TryOnRecord, TryOnRequestPayload, GenderType } from '../../types/customization';
import { RecommendedCostume } from '../../types/context';
import { COSTUME_DATABASE } from '../../services/recommendationService';
import { TryOnService, PRESET_PORTRAITS } from '../../services/tryOnService';
import { LookbookService } from '../../services/lookbookService';
import { SaveToLookbookModal, SaveToLookbookPayload } from '../lookbook/SaveToLookbookModal';
import { ACCESSORIES_CATALOG, PATTERNS_CATALOG } from '../../services/aiEvaluationService';
import { normalizeCostumeKey } from '../../data/costumeDefaults';
import { useLanguage } from '../../contexts/LanguageContext';

interface VirtualTryOnRealmProps {
  customization: OutfitCustomization | null;
  selectedCostume: RecommendedCostume | null;
  onNavigateToLookbook: () => void;
  onBackToCustomizer: () => void;
}

export const VirtualTryOnRealm: React.FC<VirtualTryOnRealmProps> = ({
  customization,
  selectedCostume,
  onNavigateToLookbook,
  onBackToCustomizer,
}) => {
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  // Ảnh chân dung được chọn (file upload hoặc preset)
  const [userPortrait, setUserPortrait] = useState<string>(PRESET_PORTRAITS[0].imageUrl);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_PORTRAITS[0].id);

  // Bộ phục trang được chọn để thử: ID trang phục
  const [targetCostumeId, setTargetCostumeId] = useState<string>(
    customization?.costumeId || selectedCostume?.id || 'nhat-binh'
  );
  // Có ưu tiên dùng cấu hình tùy biến không
  const [useCustomizedDesign, setUseCustomizedDesign] = useState<boolean>(true);

  // Giới tính thử đồ (Nam / Nữ)
  const [selectedGender, setSelectedGender] = useState<GenderType>(
    customization?.gender || 'female'
  );

  // Trạng thái AI Try-on
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [loadingPercent, setLoadingPercent] = useState<number>(0);

  // Kết quả đã sinh
  const [tryOnResult, setTryOnResult] = useState<TryOnRecord | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'after' | 'before'>('after');

  // Modal Lưu Lookbook Try-on
  const [isSaveLookbookOpen, setIsSaveLookbookOpen] = useState(false);
  const [lookbookTryOnName, setLookbookTryOnName] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Xử lý upload file ảnh chân dung của người dùng
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        setUserPortrait(dataUrl);
        setSelectedPresetId('custom_upload');
        setTryOnResult(null); // Reset kết quả cũ
      }
    };
    reader.readAsDataURL(file);
  };

  // Chọn ảnh mẫu có sẵn
  const handleSelectPreset = (preset: typeof PRESET_PORTRAITS[0]) => {
    setUserPortrait(preset.imageUrl);
    setSelectedPresetId(preset.id);
    setSelectedGender(preset.gender);
    setTryOnResult(null);
  };

  // Tự động đồng bộ hóa trang phục mục tiêu khi customization từ bên ngoài thay đổi (ví dụ: Thử đồ nhanh từ Lookbook)
  useEffect(() => {
    if (customization) {
      if (customization.costumeId) {
        setTargetCostumeId(customization.costumeId);
      }
      if (customization.gender) {
        setSelectedGender(customization.gender);
      }
      setUseCustomizedDesign(true);
      setTryOnResult(null);
    }
  }, [customization]);

  const currentCostume = COSTUME_DATABASE.find(
    (c) => c.id === targetCostumeId || normalizeCostumeKey(c.id) === normalizeCostumeKey(targetCostumeId)
  ) || COSTUME_DATABASE[0];

  const isMatchCostume = Boolean(
    customization && (
      customization.costumeId === targetCostumeId || 
      normalizeCostumeKey(customization.costumeId) === normalizeCostumeKey(targetCostumeId)
    )
  );

  // Thiết kế đang áp dụng (hoặc từ Atelier hoặc từ template mặc định của bộ đã chọn)
  const activeCustomization: OutfitCustomization = (useCustomizedDesign && isMatchCostume && customization)
    ? { ...customization, gender: selectedGender }
    : {
        costumeId: targetCostumeId,
        costumeName: currentCostume.name,
        gender: selectedGender,
        parts: {
          primaryRobeColor: currentCostume.accentColor || '#BA3424',
          innerCollarColor: '#D4A043',
          bottomColor: '#F0E7D8',
          sashColor: '#58734D',
        },
        pattern: 'lotus',
        accessories: ['folding_fan'],
        lastUpdated: Date.now(),
      };

  const activePatternObj = PATTERNS_CATALOG.find((p) => p.id === activeCustomization.pattern);
  const activeAccessoryNames = activeCustomization.accessories.map((aId) => {
    const found = ACCESSORIES_CATALOG.find((item) => item.id === aId);
    return found ? found.name : aId;
  });

  // Kích hoạt Thử đồ ảo mang trọn vẹn context thiết kế
  const handleGenerateTryOn = async () => {
    setIsLoading(true);
    setLoadingPercent(10);
    setLoadingStep(isVi ? 'Bắt đầu khởi tạo diện mạo di sản...' : 'Synthesizing heritage portrait...');
    setSavedSuccess(false);

    try {
      const payload: TryOnRequestPayload = {
        userPortraitUrl: userPortrait,
        costumeId: targetCostumeId,
        costumeName: currentCostume.name,
        gender: selectedGender,
        customizationColors: activeCustomization.parts,
        pattern: activeCustomization.pattern,
        patternName: activePatternObj?.name || (isVi ? 'Hoa Sen Quốc Hoa' : 'National Lotus'),
        accessories: activeCustomization.accessories,
        accessoryNames: activeAccessoryNames,
        referenceMockupUrl: currentCostume.imageUrl,
        timestamp: Date.now(),
      };

      const result = await TryOnService.synthesizeTryOn(payload, (step, pct) => {
        setLoadingStep(step);
        setLoadingPercent(pct);
      });

      setTryOnResult(result);
      setViewMode('after');
    } catch (e) {
      console.error('Lỗi khi thử đồ ảo:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Mở modal lưu vào Lookbook album
  const handleOpenSaveLookbook = () => {
    if (!tryOnResult) return;
    setIsSaveLookbookOpen(true);
  };

  const handleLookbookSaveSuccess = (albumName: string, itemName: string) => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Tải ảnh về máy
  const handleDownload = () => {
    if (!tryOnResult) return;
    TryOnService.downloadImage(
      tryOnResult.resultImageUrl,
      `vietphuc-${tryOnResult.costumeId}-${Date.now()}.jpg`
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between pt-4 sm:pt-16 pb-28 md:pb-12 px-3 sm:px-8 md:pr-14 lg:pr-16 max-w-6xl mx-auto w-full z-10 select-none">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#241A13]/90 border border-[#D4A043]/40 text-[#F3C96B] text-xs font-serif mb-2.5 shadow-sm"
        >
          <Camera className="w-3.5 h-3.5 text-[#78976A]" />
          <span>{t('tryon.badge')}</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl sm:text-4xl font-serif font-bold text-[#F5EFE6] tracking-tight mb-1.5"
        >
          {t('tryon.heading')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-xs sm:text-sm text-[#BAA796] font-serif italic"
        >
          {isVi
            ? 'Giữ nguyên khuôn mặt, tỷ lệ cơ thể và ánh sáng chân dung – ướm trọn vẹn màu sắc & họa tiết thiết kế'
            : 'Preserve natural facial features and lighting – seamlessly fit authentic Việt Phục and custom colors'}
        </motion.p>
      </div>

      {/* Main Try-On Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start mb-6 sm:mb-8">
        {/* Left Column: Portrait Selection & Costume Picker (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5">
          {/* 1. Chọn hoặc Tải lên Chân Dung */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#241A13]/90 border border-[#423023] shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#78976A] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {t('tryon.step1.title')}
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-sans text-[#D4A043] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>{t('tryon.step1.upload_btn')}</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Portrait Preview Frame */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#140D08] border border-[#3E2C1E] mb-3 group">
              <img
                src={userPortrait}
                alt="Chân dung"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-full bg-[#140D08]/90 text-xs font-sans text-white border border-[#423023] flex items-center gap-1.5 hover:bg-[#241A13]"
                >
                  <Upload className="w-3 h-3 text-[#78976A]" />
                  <span>{t('tryon.step1.change_btn')}</span>
                </button>
              </div>
            </div>

            {/* Preset Model Portraits */}
            <div>
              <span className="text-[11px] font-sans text-[#8E7B6C] block mb-2">
                {t('tryon.step1.preset_hint')}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_PORTRAITS.map((p) => {
                  const isSelected = selectedPresetId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1C140E] border-[#78976A] ring-1 ring-[#78976A]'
                          : 'bg-[#1C140E]/60 border-[#3E2C1E] hover:border-[#594232]'
                      }`}
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#423023]"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-sans font-semibold text-[#F5EFE6] truncate">
                          {p.name}
                        </p>
                        <p className="text-[10px] font-sans text-[#BAA796] truncate">
                          {p.gender === 'female' ? (isVi ? 'Nữ (Duyên dáng)' : 'Female (Graceful)') : (isVi ? 'Nam (Đĩnh đạc)' : 'Male (Dignified)')}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Chọn Bộ Việt Phục Cần Thử & Xem trước Context */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#241A13]/90 border border-[#423023] shadow-lg space-y-3">
            <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#78976A] flex items-center gap-1.5">
              <Shirt className="w-3.5 h-3.5" />
              {t('tryon.step2.title')}
            </label>

            {/* Option A: Bộ vừa thiết kế ở Tùy biến */}
            {customization && (
              <div
                onClick={() => setUseCustomizedDesign(true)}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  useCustomizedDesign
                    ? 'bg-[#1C261A] border-[#465A3D] ring-1 ring-[#78976A]'
                    : 'bg-[#1C140E]/60 border-[#3E2C1E] hover:border-[#594232]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#293623] text-[#78976A] flex items-center justify-center border border-[#465A3D]">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-sans font-bold text-[#F5EFE6]">
                      {t('tryon.step2.custom_option')}
                    </h4>
                    <p className="text-[11px] font-sans text-[#BAA796]">
                      {customization.costumeName} · {activeAccessoryNames.length} {isVi ? 'phụ kiện' : 'accessories'}
                    </p>
                  </div>
                </div>
                {useCustomizedDesign && <Check className="w-4 h-4 text-[#78976A]" />}
              </div>
            )}

            {/* Option B: Chọn từ danh sách 9 bộ cổ phục */}
            <div>
              <span className="text-[11px] font-sans text-[#8E7B6C] block mb-2">
                {t('tryon.step2.catalog_hint')}
              </span>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {COSTUME_DATABASE.map((item) => {
                  const isSelected = !useCustomizedDesign && targetCostumeId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setTargetCostumeId(item.id);
                        setUseCustomizedDesign(false);
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1C140E] border-[#D4A043] ring-1 ring-[#D4A043]'
                          : 'bg-[#1C140E]/60 border-[#3E2C1E] hover:border-[#594232]'
                      }`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-7 h-7 rounded-lg object-cover flex-shrink-0"
                      />
                      <span className="text-xs font-sans text-[#F5EFE6] font-medium truncate">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DỮ LIỆU CONTEXT THIẾT KẾ TRUYỀN SANG AI (Context Spec Panel) */}
            <div className="p-3 rounded-2xl bg-[#140D08]/90 border border-[#3E2C1E] space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-sans font-semibold text-[#D4A043] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F3C96B]" />
                  {isVi ? 'Dữ liệu thiết kế truyền sang AI:' : 'AI Design Context Spec:'}
                </span>
                <span className="text-[10px] font-sans text-[#78976A] bg-[#1C261A] px-2 py-0.5 rounded-md border border-[#465A3D]">
                  {selectedGender === 'female' ? (isVi ? 'Model Nữ' : 'Feminine') : (isVi ? 'Model Nam' : 'Masculine')}
                </span>
              </div>

              {/* 4 Màu tùy chỉnh */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                <div className="flex flex-col items-center gap-1 p-1 rounded-lg bg-[#1C140E]">
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-white/20" 
                    style={{ backgroundColor: activeCustomization.parts.primaryRobeColor }}
                  />
                  <span className="text-[9px] text-[#BAA796]">{isVi ? 'Vạt áo' : 'Robe'}</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-1 rounded-lg bg-[#1C140E]">
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-white/20" 
                    style={{ backgroundColor: activeCustomization.parts.innerCollarColor }}
                  />
                  <span className="text-[9px] text-[#BAA796]">{isVi ? 'Cổ/Yếm' : 'Collar'}</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-1 rounded-lg bg-[#1C140E]">
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-white/20" 
                    style={{ backgroundColor: activeCustomization.parts.sashColor }}
                  />
                  <span className="text-[9px] text-[#BAA796]">{isVi ? 'Thắt lưng' : 'Sash'}</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-1 rounded-lg bg-[#1C140E]">
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-white/20" 
                    style={{ backgroundColor: activeCustomization.parts.bottomColor }}
                  />
                  <span className="text-[9px] text-[#BAA796]">{isVi ? 'Quần/Váy' : 'Bottom'}</span>
                </div>
              </div>

              {/* Họa tiết & Phụ kiện */}
              <div className="text-[10px] font-sans text-[#BAA796] flex items-center justify-between pt-1 border-t border-[#3E2C1E]/60">
                <span>{isVi ? 'Họa tiết' : 'Motif'}: <strong className="text-[#F5EFE6]">{activePatternObj?.name || (isVi ? 'Hoa Sen' : 'Lotus')}</strong></span>
                <span>{isVi ? 'Phụ kiện' : 'Accs'}: <strong className="text-[#F5EFE6]">{activeAccessoryNames.length} {isVi ? 'món' : 'items'}</strong></span>
              </div>
            </div>

            {/* Big Action Button: Hóa thân cổ phục */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGenerateTryOn}
              className="w-full mt-2 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#536B49] via-[#465A3D] to-[#36482F] hover:from-[#5C7752] hover:to-[#3E5136] text-[#F5EFE6] text-xs sm:text-sm font-sans font-semibold tracking-wide shadow-md shadow-[#2B3825]/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-[#F3C96B]" />
                  <span>{isVi ? 'Đang Tạo Dựng Chân Dung...' : 'Generating Portrait...'}</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 text-[#F3C96B]" />
                  <span>{t('tryon.generate_btn')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Try-on Display Showcase & Actions (7 cols) */}
        <div className="lg:col-span-7 bg-[#241A13]/90 backdrop-blur-md border border-[#423023] rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col justify-between min-h-[440px]">
          <div>
            <div className="flex flex-wrap items-center justify-between border-b border-[#3E2C1E] pb-3 mb-4 gap-2">
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#F5EFE6]">
                  {tryOnResult 
                    ? (tryOnResult.isDemoMode ? (isVi ? 'Bản Mẫu Tham Khảo (Chế độ Demo)' : 'Reference Heritage Model (Demo Mode)') : (isVi ? 'Kết Quả Thử Đồ Ảo' : 'Virtual Try-On Result')) 
                    : (isVi ? 'Khung Xem Trước' : 'Live Preview')}
                </h3>
                <p className="text-xs font-sans text-[#BAA796]">
                  {tryOnResult
                    ? (tryOnResult.isDemoMode
                        ? (isVi ? `Bản phục dựng cổ phong mẫu của ${tryOnResult.costumeName}` : `Authentic reference look for ${tryOnResult.costumeName}`)
                        : (isVi ? `Đã ướm thử ${tryOnResult.costumeName} trên chân dung của bạn` : `Fitted ${tryOnResult.costumeName} seamlessly onto your portrait`))
                    : (isVi ? 'Bấm nút để khởi tạo' : 'Click generate to begin')}
                </p>
              </div>

              {/* View Mode Toggle (Before / After) */}
              {tryOnResult && (
                <div className="inline-flex p-1 rounded-full bg-[#1C140E] border border-[#3E2C1E]">
                  <button
                    type="button"
                    onClick={() => setViewMode('after')}
                    className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-all ${
                      viewMode === 'after'
                        ? 'bg-[#465A3D] text-white shadow-sm'
                        : 'text-[#BAA796] hover:text-[#F5EFE6]'
                    }`}
                  >
                    {t('tryon.view_after')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('before')}
                    className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-all ${
                      viewMode === 'before'
                        ? 'bg-[#465A3D] text-white shadow-sm'
                        : 'text-[#BAA796] hover:text-[#F5EFE6]'
                    }`}
                  >
                    {t('tryon.view_before')}
                  </button>
                </div>
              )}
            </div>

            {/* Display Canvas or Loading State */}
            {isLoading ? (
              <div className="aspect-[4/3] rounded-2xl bg-[#140D08] border border-[#3E2C1E] flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#293623] border border-[#465A3D] flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-[#78976A] animate-spin" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <p className="text-sm font-sans font-medium text-[#F5EFE6]">
                    {loadingStep}
                  </p>
                  <p className="text-xs font-sans text-[#8E7B6C]">
                    {isVi ? 'Hệ thống đang đối chiếu diện mạo di sản và thông số màu sắc' : 'Matching heritage attire contours with facial lighting'}
                  </p>
                </div>
                {/* Progress Bar */}
                <div className="w-64 h-1.5 rounded-full bg-[#241A13] overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#D4A043] to-[#78976A]"
                    style={{ width: `${loadingPercent}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                </div>
              </div>
            ) : tryOnResult ? (
              <div>
                {/* Photo Showcase */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#140D08] border border-[#423023] shadow-lg mb-4">
                  <img
                    src={viewMode === 'after' ? tryOnResult.resultImageUrl : tryOnResult.portraitUrl}
                    alt="Kết quả thử đồ"
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
                    <span className="text-[11px] font-sans font-bold bg-[#140D08]/85 text-[#F5EFE6] px-3 py-1 rounded-full border border-[#465A3D]">
                      {viewMode === 'after' ? tryOnResult.costumeName : (isVi ? 'Ảnh chân dung gốc' : 'Original portrait')}
                    </span>

                    {viewMode === 'after' && tryOnResult.isDemoMode && (
                      <span className="text-[10px] font-sans font-bold bg-[#3E2415]/90 text-[#F3C96B] px-2.5 py-1 rounded-full border border-[#D4A043]/70 shadow-sm flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-[#D4A043]" />
                        <span>{isVi ? 'CHẾ ĐỘ DEMO · ẢNH MẪU' : 'DEMO REFERENCE'}</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom Cultural Summary in Photo */}
                  <div className="absolute bottom-3 left-4 right-4 z-10">
                    <p className="text-xs font-sans text-[#D8CCC0] line-clamp-2 italic drop-shadow-md">
                      "{tryOnResult.culturalNote}"
                    </p>
                  </div>
                </div>

                {/* Info Note with Demo Notice */}
                <div className="p-3.5 rounded-xl bg-[#1C140E] border border-[#3E2C1E] text-xs font-sans text-[#BAA796] space-y-1.5">
                  <div className="flex items-center gap-2 text-[#78976A] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[#F3C96B]" />
                    <span>{isVi ? 'Chi tiết diện mạo đã áp dụng:' : 'Applied Styling Summary:'}</span>
                  </div>
                  <p className="text-[#D8CCC0] text-[11px] leading-relaxed">
                    {tryOnResult.stylingNote}
                  </p>
                </div>
              </div>
            ) : (
              // Empty State
              <div className="aspect-[4/3] rounded-2xl bg-[#140D08] border border-[#3E2C1E] flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1C140E] border border-[#3E2C1E] flex items-center justify-center text-[#8E7B6C]">
                  <Eye className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-serif font-bold text-[#F5EFE6]">
                  {isVi ? 'Chưa khởi tạo chân dung thử đồ' : 'No Try-On Generated Yet'}
                </h4>
                <p className="text-xs font-sans text-[#8E7B6C] max-w-xs">
                  {isVi
                    ? 'Vui lòng chọn ảnh chân dung và trang phục ở cột bên trái, sau đó nhấn "Hóa Thân Thử Đồ Ngay".'
                    : 'Select your portrait and preferred Việt Phục on the left, then click Generate.'}
                </p>
              </div>
            )}
          </div>

          {/* Action Footer: Tải ảnh về & Lưu Lookbook */}
          <div className="pt-4 border-t border-[#3E2C1E] mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Back Button */}
            <button
              type="button"
              onClick={onBackToCustomizer}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1C140E] border border-[#423023] text-xs font-sans text-[#D8CCC0] hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isVi ? 'Về Xưởng Tùy Biến' : 'Back to Atelier'}</span>
            </button>

            {tryOnResult && (
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                {/* Download Button */}
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1C140E] hover:bg-[#251B13] border border-[#423023] text-xs font-sans text-[#D8CCC0] hover:text-[#F5EFE6] transition-all cursor-pointer"
                  title={isVi ? 'Tải ảnh diện mạo xuống máy' : 'Download image'}
                >
                  <Download className="w-3.5 h-3.5 text-[#D4A043]" />
                  <span>{t('btn.download')}</span>
                </button>

                {/* Save Lookbook Button */}
                <button
                  type="button"
                  onClick={handleOpenSaveLookbook}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-sans font-medium transition-all cursor-pointer ${
                    savedSuccess
                      ? 'bg-[#293623] text-[#78976A] border border-[#465A3D]'
                      : 'bg-gradient-to-r from-[#536B49] to-[#3B4D33] text-white hover:scale-105 active:scale-95 shadow-md border border-[#78976A]/40'
                  }`}
                >
                  {savedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#78976A]" />
                      <span>{isVi ? 'Đã Lưu Lookbook!' : 'Saved to Lookbook!'}</span>
                    </>
                  ) : (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-[#F3C96B]" />
                      <span>{t('btn.save_lookbook')}</span>
                    </>
                  )}
                </button>

                {/* Navigate to Lookbook */}
                <button
                  type="button"
                  onClick={onNavigateToLookbook}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#241A13] hover:bg-[#342418] border border-[#423023] text-xs font-sans text-[#D8CCC0] hover:text-white transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#F3C96B]" />
                  <span>{isVi ? 'Xem Lookbook' : 'View Lookbook'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Lưu Vào Lookbook (Album / Playlist Style) */}
      <SaveToLookbookModal
        isOpen={isSaveLookbookOpen && !!tryOnResult}
        onClose={() => setIsSaveLookbookOpen(false)}
        payload={tryOnResult ? {
          type: 'tryon',
          defaultName: `${tryOnResult.costumeName} - Khoảnh Khắc Mới`,
          costumeName: tryOnResult.costumeName,
          costumeId: tryOnResult.costumeId,
          imageUrl: tryOnResult.resultImageUrl,
          portraitUrl: tryOnResult.portraitUrl,
          gender: tryOnResult.gender,
          culturalNote: tryOnResult.culturalNote,
          stylingNote: tryOnResult.stylingNote,
          appliedPayload: tryOnResult.appliedPayload,
        } : null}
        onSavedSuccess={handleLookbookSaveSuccess}
      />
    </div>
  );
};
