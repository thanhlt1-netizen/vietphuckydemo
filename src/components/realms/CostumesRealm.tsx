import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Sun, 
  Maximize2, 
  X, 
  Info, 
  ScrollText, 
  Palette, 
  Loader2, 
  Compass,
  Layers,
  RotateCcw
} from 'lucide-react';
import { ContextSelection, RecommendedCostume, SEASONS_LIST, REGIONS_LIST } from '../../types/context';
import { CostumeService } from '../../services/costumeService';
import { getCostumeDefaultColors } from '../../data/costumeDefaults';
import { AccessoryId, OutfitCustomization } from '../../types/customization';
import { useLanguage } from '../../contexts/LanguageContext';

interface CostumesRealmProps {
  contextSelection?: ContextSelection | null;
  recommendedCostumes?: RecommendedCostume[];
  selectedCostumeId?: string;
  selectedCostume?: RecommendedCostume | null;
  onSelectCostume?: (costume: RecommendedCostume) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const CostumesRealm: React.FC<CostumesRealmProps> = ({
  contextSelection,
  recommendedCostumes = [],
  selectedCostumeId,
  selectedCostume,
  onSelectCostume,
  onContinue,
  onBack,
}) => {
  // State quản lý danh sách phục trang và trạng thái tải dữ liệu
  const [costumes, setCostumes] = useState<RecommendedCostume[]>([]);
  const [recommendedList, setRecommendedList] = useState<RecommendedCostume[]>([]);
  const [viewMode, setViewMode] = useState<'recommended' | 'all'>('recommended');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDefaultFallback, setIsDefaultFallback] = useState<boolean>(false);

  // ID trang phục được chọn hiện tại: Đồng bộ chặt chẽ với selectedCostumeId / selectedCostume
  const [activeId, setActiveId] = useState<string>(() => {
    return selectedCostumeId || selectedCostume?.id || CostumeService.getSelectedCostume()?.id || '';
  });
  const [previewCostume, setPreviewCostume] = useState<RecommendedCostume | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const modalCloseButtonRef = useRef<HTMLButtonElement | null>(null);

  // Đồng bộ activeId khi selectedCostume hoặc selectedCostumeId từ bên ngoài thay đổi
  useEffect(() => {
    const externalId = selectedCostumeId || selectedCostume?.id;
    if (externalId && externalId !== activeId) {
      setActiveId(externalId);
    }
  }, [selectedCostumeId, selectedCostume?.id]);

  // Xử lý Modal Lightbox xem ảnh lớn: khóa scroll body, phím Escape, quản lý focus
  useEffect(() => {
    if (!previewCostume) return;

    lastActiveElementRef.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      modalCloseButtonRef.current?.focus();
    }, 60);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewCostume(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      lastActiveElementRef.current?.focus?.();
    };
  }, [previewCostume]);

  // 1. Tải dữ liệu gợi ý từ Bối Cảnh hoặc fallback mặc định (Chỉ lấy top 3-4 bộ phù hợp nhất)
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    CostumeService.loadCostumesForDisplay(recommendedCostumes, contextSelection)
      .then(({ costumes: loadedList, isDefaultFallback: fallbackFlag }) => {
        if (!isMounted) return;
        const curatedList = loadedList.slice(0, 4);
        setRecommendedList(curatedList);
        setIsDefaultFallback(fallbackFlag);

        const allList = CostumeService.getAllCostumes();

        // Kiểm tra xem hiện tại đã có bộ trang phục nào được chọn trước đó chưa
        const currentActiveId = activeId || selectedCostumeId || selectedCostume?.id || CostumeService.getSelectedCostume()?.id;

        if (currentActiveId) {
          const found = allList.find((c) => c.id === currentActiveId)
            || curatedList.find((c) => c.id === currentActiveId);

          if (found) {
            setActiveId(found.id);
            CostumeService.saveSelectedCostume(found);
            if (viewMode === 'all') {
              setCostumes(allList);
            } else {
              setCostumes(curatedList);
            }
            return;
          }
        }

        // Nếu thực sự chưa có trang phục nào được chọn, khởi tạo bằng bộ gợi ý đầu tiên
        if (curatedList.length > 0) {
          const defaultInitial = curatedList[0];
          setActiveId(defaultInitial.id);
          CostumeService.saveSelectedCostume(defaultInitial);
          if (onSelectCostume) {
            onSelectCostume(defaultInitial);
          }
        }

        if (viewMode === 'all') {
          setCostumes(allList);
        } else {
          setCostumes(curatedList);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách phục trang:', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [contextSelection, recommendedCostumes]);

  // 2. Chuyển sang chế độ "Xem tất cả bộ Việt phục" (9 bộ có sẵn trong dữ liệu)
  const handleViewAll = useCallback(() => {
    const allCostumes = CostumeService.getAllCostumes();
    setCostumes(allCostumes);
    setViewMode('all');
    // Tuyệt đối không ghi đè activeId selection của người dùng
  }, []);

  // 3. Quay lại chế độ danh sách gợi ý ban đầu
  const handleBackToRecommendations = useCallback(() => {
    setCostumes(recommendedList);
    setViewMode('recommended');
    // Tuyệt đối không ghi đè activeId selection của người dùng
  }, [recommendedList]);

  // 4. Hàm đồng bộ duy nhất khi người dùng chọn bất kỳ bộ phục trang nào (gợi ý hoặc xem tất cả)
  const handleSelectCostume = useCallback((costume: RecommendedCostume, proceedImmediately: boolean = false) => {
    setActiveId(costume.id);
    CostumeService.saveSelectedCostume(costume);

    // Tự động hiệu chỉnh màu sắc ban đầu của trang phục về đúng màu gốc / màu đặc trưng theo chuẩn vietphuc.md
    const spec = getCostumeDefaultColors(costume.id);
    try {
      const initialCustomization: OutfitCustomization = {
        costumeId: costume.id,
        costumeName: costume.name,
        gender: 'female',
        parts: {
          primaryRobeColor: spec.primaryRobeColor,
          innerCollarColor: spec.innerCollarColor,
          bottomColor: spec.bottomColor,
          sashColor: spec.sashColor,
        },
        pattern: spec.defaultPattern,
        accessories: spec.defaultAccessories as AccessoryId[],
        lastUpdated: Date.now(),
      };
      localStorage.setItem('vietphuc_current_customization', JSON.stringify(initialCustomization));
      localStorage.setItem('vietphuc_selected_costume', JSON.stringify(costume));
    } catch {
      // ignore
    }

    // Ghi nhận trực tiếp vào nguồn sự thật duy nhất (selectedCostume trong state/context App)
    if (onSelectCostume) {
      onSelectCostume(costume);
    }

    if (proceedImmediately) {
      onContinue();
    }
  }, [onSelectCostume, onContinue]);

  // 5. Xử lý khi bấm nút "Tiến bước sang Tùy Biến" ở thanh hành động cuối trang
  const handleContinue = useCallback(() => {
    const allCostumes = CostumeService.getAllCostumes();
    const targetCostume = allCostumes.find((c) => c.id === activeId)
      || costumes.find((c) => c.id === activeId)
      || recommendedList.find((c) => c.id === activeId)
      || (selectedCostumeId ? allCostumes.find((c) => c.id === selectedCostumeId) : null)
      || selectedCostume
      || (allCostumes.length > 0 ? allCostumes[0] : null);

    if (!targetCostume) {
      return;
    }

    handleSelectCostume(targetCostume, true);
  }, [activeId, costumes, recommendedList, selectedCostumeId, selectedCostume, handleSelectCostume]);

  const { t, language, tDynasty } = useLanguage();
  const isVi = language === 'vi';

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const currentSeasonLabel = 
    contextSelection?.season === 'xuân' ? (isVi ? 'Xuân' : 'Spring') :
    contextSelection?.season === 'hạ' ? (isVi ? 'Hạ' : 'Summer') :
    contextSelection?.season === 'thu' ? (isVi ? 'Thu' : 'Autumn') :
    contextSelection?.season === 'đông' ? (isVi ? 'Đông' : 'Winter') :
    (isVi ? 'Xuân' : 'Spring');

  const currentRegionLabel = 
    contextSelection?.region === 'bắc' ? (isVi ? 'Miền Bắc' : 'Northern') :
    contextSelection?.region === 'trung' ? (isVi ? 'Miền Trung' : 'Central') :
    contextSelection?.region === 'nam' ? (isVi ? 'Miền Nam' : 'Southern') :
    (isVi ? 'Miền Bắc' : 'Northern');

  const currentEventLabel = contextSelection?.eventName || (isVi ? 'Đám cưới' : 'Wedding');

  return (
    <div className="relative min-h-screen flex flex-col justify-between pt-20 pb-24 md:pb-14 px-4 sm:px-8 md:pr-14 lg:pr-16 max-w-6xl mx-auto w-full z-10">
      {/* Header section */}
      <div className="text-center max-w-4xl mx-auto my-auto pt-2">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl font-serif font-bold text-[#F5EFE6] tracking-tight mb-2"
        >
          {isVi ? 'Phục Trang' : 'Việt Phục Wardrobe'}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm sm:text-base text-[#BAA796] font-serif italic mb-6"
        >
          {isVi 
            ? 'Tuyển tập Việt phục chuẩn mực và hòa sắc tương thích với bối cảnh của bạn' 
            : 'Treasury of authentic Việt Phục tailored to your selected context and occasion'}
        </motion.p>

        {/* Thanh Điều Hướng & Bộ Lọc Trạng Thái */}
        <div className="flex flex-col items-center gap-3 mb-8">
          {viewMode === 'all' ? (
            /* Trạng thái 1: Đang Xem Tất Cả 9 Bộ */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-full bg-[#241A13]/95 border border-[#D4A043]/60 shadow-lg shadow-black/40 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 text-xs font-sans text-[#F3C96B]">
                <Layers className="w-4 h-4 text-[#D4A043]" />
                <span>{isVi ? 'Đang hiển thị toàn bộ 9 bộ Việt phục di sản' : 'Displaying all 9 authentic Việt Phục styles'}</span>
              </div>
              <span className="text-[#5A4535]">·</span>
              <button
                type="button"
                onClick={handleBackToRecommendations}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#536B49] to-[#3B4D33] hover:from-[#627C56] hover:to-[#465A3D] text-[#F5EFE6] text-xs font-serif font-bold transition-all cursor-pointer border border-[#78976A]/70 shadow-sm hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#F3C96B]" />
                <span>{isVi ? 'Quay lại gợi ý' : 'Back to Recommendations'}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#23311E] text-[#D8CCC0]">
                  {recommendedList.length}
                </span>
              </button>
            </motion.div>
          ) : (
            /* Trạng thái 2: Đang Xem Gợi Ý Top 3-4 Bộ */
            <div className="flex flex-wrap items-center justify-center gap-3">
              {!isDefaultFallback && contextSelection ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-full bg-[#241A13]/90 border border-[#423023] shadow-md shadow-black/30"
                >
                  <div className="flex items-center gap-1.5 text-xs font-sans text-[#F5EFE6]">
                    <Calendar className="w-3.5 h-3.5 text-[#78976A]" />
                    <span className="font-semibold">{currentEventLabel}</span>
                  </div>
                  <span className="text-[#5A4535]">·</span>
                  <div className="flex items-center gap-1.5 text-xs font-sans text-[#D8CCC0]">
                    <MapPin className="w-3.5 h-3.5 text-[#8E7B6C]" />
                    <span>{currentRegionLabel}</span>
                  </div>
                  <span className="text-[#5A4535]">·</span>
                  <div className="flex items-center gap-1.5 text-xs font-sans text-[#D8CCC0]">
                    <Sun className="w-3.5 h-3.5 text-[#8E7B6C]" />
                    <span>{currentSeasonLabel}</span>
                  </div>
                  <span className="text-[#5A4535]">·</span>
                  <span className="text-[11px] font-sans font-medium text-[#78976A] bg-[#293623] px-2.5 py-0.5 rounded-full border border-[#465A3D]">
                    {costumes.length} {isVi ? 'bộ gợi ý' : 'curated styles'}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2 rounded-full bg-[#241A13]/95 border border-[#5A4535] shadow-md shadow-black/40"
                >
                  <div className="flex items-center gap-2 text-xs font-sans text-[#D8CCC0]">
                    <Info className="w-4 h-4 text-[#D4A043]" />
                    <span>{isVi ? `Đang hiển thị ${costumes.length} bộ cổ phục gợi ý tiêu biểu` : `Displaying ${costumes.length} curated Việt Phục styles`}</span>
                  </div>
                  <button
                    type="button"
                    onClick={onBack}
                    className="text-xs font-sans text-[#78976A] hover:text-[#97BD86] font-medium flex items-center gap-1 underline underline-offset-2 cursor-pointer transition-colors"
                  >
                    <Compass className="w-3 h-3" />
                    <span>{t('resonance.badge')}</span>
                  </button>
                </motion.div>
              )}

              {/* Nút Xem tất cả bộ Việt phục */}
              <motion.button
                type="button"
                onClick={handleViewAll}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#2F2116] via-[#241A13] to-[#1C140E] hover:from-[#442F1F] hover:to-[#2B1D13] border border-[#D4A043]/70 hover:border-[#F3C96B] text-xs font-serif font-bold text-[#F3C96B] hover:text-[#FFF] transition-all cursor-pointer shadow-md shadow-black/50"
              >
                <Layers className="w-3.5 h-3.5 text-[#D4A043]" />
                <span>{isVi ? 'Xem tất cả bộ Việt phục' : 'View All Việt Phục'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#140D08] text-[#D8CCC0] border border-[#423023]">
                  9
                </span>
              </motion.button>
            </div>
          )}
        </div>

        {/* Loading State khi đang nạp danh sách hoặc xử lý phân tích */}
        {isLoading ? (
          <div className="min-h-[380px] flex flex-col items-center justify-center gap-3 my-12">
            <Loader2 className="w-8 h-8 text-[#78976A] animate-spin" />
            <p className="text-sm font-sans text-[#BAA796] italic animate-pulse">
              Đang đối chiếu điển chế và hòa sắc trang phục...
            </p>
          </div>
        ) : (
          /* Curated Costumes Gallery Grid */
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10 text-left"
          >
            {costumes.map((item) => {
              const isSelected = activeId === item.id;
              const isImgLoaded = loadedImages[item.id];

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectCostume(item, false)}
                  onDoubleClick={() => handleSelectCostume(item, true)}
                  className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between bg-[#241A13]/90 backdrop-blur-md cursor-pointer ${
                    isSelected
                      ? 'border-[#627C56] shadow-xl shadow-black/50 ring-2 ring-[#465A3D]/40'
                      : 'border-[#423023] hover:border-[#594232] hover:shadow-lg hover:-translate-y-1'
                  }`}
                >
                  {/* 1. Top Image Showcase */}
                  <div className="relative aspect-[4/3] w-full bg-[#18100A] overflow-hidden">
                    {/* Image Skeleton / Loading placeholder */}
                    {!isImgLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#241A13] via-[#322319] to-[#241A13] animate-pulse flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-[#78976A]/40 animate-spin" />
                      </div>
                    )}

                    {/* High-Fidelity Cultural Image */}
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        onLoad={() => handleImageLoad(item.id)}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                          isImgLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    ) : null}

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#140D08]/90 via-transparent to-black/30 pointer-events-none" />

                    {/* Dynasty Badge (Top-Left) */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[10px] font-sans font-semibold uppercase tracking-wider bg-[#140D08]/85 text-[#F5EFE6] backdrop-blur-md px-2.5 py-1 rounded-md border border-[#465A3D]/40">
                        {item.dynasty}
                      </span>
                    </div>

                    {/* Match Score Badge & Magnifier (Top-Right) */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                      <span className="text-[11px] font-sans font-semibold text-[#F5EFE6] bg-gradient-to-r from-[#465A3D] to-[#36482F] px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-[#627C56]/40">
                        <Sparkles className="w-3 h-3 text-[#78976A]" />
                        {item.matchScore}%
                      </span>

                      {/* Magnifier / Expand Preview Button (mở chi tiết mà không chuyển trang) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewCostume(item);
                        }}
                        className="p-2 sm:p-1.5 min-w-[36px] min-h-[36px] rounded-full bg-[#140D08]/85 hover:bg-[#1C140E] text-white backdrop-blur-md transition-all cursor-pointer hover:scale-110 active:scale-95 border border-[#423023] flex items-center justify-center shadow-md focus-visible:ring-2 focus-visible:ring-[#78976A]"
                        aria-label={`Xem ảnh lớn và khảo cứu ${item.name}`}
                        title={`Xem ảnh lớn và khảo cứu văn hóa ${item.name}`}
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-[#78976A]" />
                      </button>
                    </div>

                    {/* Bottom Image Caption inside the Photo */}
                    <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-end justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-lg sm:text-xl text-[#F5EFE6] tracking-tight drop-shadow-sm">
                          {item.name}
                        </h3>
                        {item.aliasName && (
                          <p className="text-[11px] text-[#D8CCC0] font-sans italic truncate drop-shadow-sm">
                            {item.aliasName}
                          </p>
                        )}
                      </div>

                      {isSelected ? (
                        <span className="w-6 h-6 rounded-full bg-[#465A3D] text-white flex items-center justify-center shadow-md flex-shrink-0 border border-[#78976A]">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCostume(item, true);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-sans font-medium text-[#78976A] hover:text-[#97BD86] bg-[#140D08]/90 hover:bg-[#1C140E] px-2.5 py-1 rounded border border-[#465A3D]/50 cursor-pointer shadow-sm"
                        >
                          Chọn & Tùy chỉnh →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 2. Text Information Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Nguồn gốc ngắn từ dữ liệu */}
                      {item.originNote && (
                        <p className="text-xs text-[#BAA796] font-sans leading-relaxed mb-3 line-clamp-2 italic">
                          {item.originNote}
                        </p>
                      )}

                      {/* Đặc điểm thiết kế nổi bật */}
                      {item.designFeatures && item.designFeatures.length > 0 && (
                        <div className="mb-3 space-y-1">
                          <span className="text-[10px] font-sans font-semibold uppercase text-[#78976A] tracking-wider block">
                            Đặc điểm nhận diện:
                          </span>
                          <ul className="text-xs font-sans text-[#D8CCC0] space-y-0.5 list-disc list-inside">
                            {item.designFeatures.slice(0, 2).map((feat, fIdx) => (
                              <li key={fIdx} className="truncate">{feat}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Tương thích bối cảnh */}
                      <div className="p-2.5 rounded-xl bg-[#1C140E]/80 border border-[#3E2C1E] text-xs font-sans text-[#D8CCC0] leading-relaxed mb-3">
                        <span className="font-semibold text-[#78976A] mr-1">Tương thích:</span>
                        {item.recommendationReason}
                      </div>
                    </div>

                    {/* 3. Recommended Fabrics */}
                    {item.recommendedFabrics && item.recommendedFabrics.length > 0 && (
                      <div className="pt-2 border-t border-[#3E2C1E] flex flex-wrap items-center gap-1.5 mt-auto">
                        <span className="text-[10px] text-[#8E7B6C] font-sans font-medium mr-1">Chất liệu:</span>
                        {item.recommendedFabrics.map((fabric, fIdx) => (
                          <span
                            key={fIdx}
                            className="text-[10px] font-sans px-2 py-0.5 rounded bg-[#1C140E] text-[#BAA796] border border-[#3E2C1E]"
                          >
                            {fabric}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Navigation Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#241A13] border border-[#423023] text-[#D8CCC0] text-sm font-sans font-medium hover:bg-[#322319] hover:border-[#627C56] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#627C56]"
            aria-label="Quay lại chọn bối cảnh"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Chọn lại bối cảnh</span>
          </button>

          {viewMode === 'recommended' ? (
            <button
              type="button"
              onClick={handleViewAll}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#241A13]/90 border border-[#D4A043]/50 text-[#F3C96B] hover:text-white hover:border-[#F3C96B] hover:bg-[#322318] text-sm font-serif font-bold transition-all cursor-pointer shadow-md"
            >
              <Layers className="w-4 h-4 text-[#D4A043]" />
              <span>Xem tất cả bộ Việt phục (9 bộ)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBackToRecommendations}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#241A13]/90 border border-[#627C56]/60 text-[#D8CCC0] hover:text-[#F5EFE6] hover:border-[#78976A] hover:bg-[#2C3B26]/60 text-sm font-serif font-bold transition-all cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4 text-[#78976A]" />
              <span>Quay lại gợi ý ({recommendedList.length} bộ)</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-[#536B49] via-[#465A3D] to-[#36482F] hover:from-[#5C7752] hover:to-[#3E5136] text-[#F5EFE6] text-sm font-sans font-medium tracking-wide shadow-md shadow-[#2B3825]/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78976A]"
            aria-label="Tiến bước sang Tùy Biến"
          >
            <Palette className="w-4 h-4" />
            <span>Tiến bước sang Tùy Biến</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* 4. Lightbox Modal Khảo Cứu Chi Tiết */}
      <AnimatePresence>
        {previewCostume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#0E0906]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
            onClick={() => setPreviewCostume(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative max-w-2xl w-full bg-[#241A13] border border-[#423023] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92dvh] focus:outline-none"
              role="dialog"
              aria-modal="true"
              aria-labelledby="preview-costume-title"
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                ref={modalCloseButtonRef}
                type="button"
                onClick={() => setPreviewCostume(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-9 h-9 rounded-full bg-[#140D08]/90 hover:bg-[#1C140E] text-white flex items-center justify-center transition-colors cursor-pointer border border-[#423023] shadow-md focus-visible:ring-2 focus-visible:ring-[#78976A]"
                aria-label="Đóng cửa sổ xem ảnh (Phím Escape)"
                title="Đóng (Escape)"
              >
                <X className="w-4 h-4 text-[#78976A]" />
              </button>

              {/* Large Image Showcase */}
              <div className="relative aspect-[16/10] w-full bg-[#140D08] overflow-hidden">
                {previewCostume.imageUrl && (
                  <img
                    src={previewCostume.imageUrl}
                    alt={previewCostume.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#140D08]/95 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-sans uppercase font-bold tracking-wider bg-[#465A3D] text-[#F5EFE6] px-2.5 py-0.5 rounded border border-[#627C56]/40">
                      {previewCostume.dynasty}
                    </span>
                    <span className="text-xs font-sans text-[#BAA796]">
                      {previewCostume.matchScore}% Độ tương thích
                    </span>
                  </div>
                  <h3 id="preview-costume-title" className="font-serif font-bold text-2xl text-[#F5EFE6] tracking-tight">
                    {previewCostume.name}
                  </h3>
                  {previewCostume.aliasName && (
                    <p className="text-xs text-[#D8CCC0] font-sans italic">
                      Tên khác: {previewCostume.aliasName}
                    </p>
                  )}
                </div>
              </div>

              {/* Cultural Deep Dive Body */}
              <div className="p-6 overflow-y-auto space-y-4 text-left">
                {/* Nguồn gốc */}
                <div>
                  <h4 className="font-sans font-semibold text-xs text-[#78976A] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ScrollText className="w-3.5 h-3.5" />
                    Nguồn gốc & Điển chế
                  </h4>
                  <p className="text-sm font-sans text-[#D8CCC0] leading-relaxed">
                    {previewCostume.originNote}
                  </p>
                </div>

                {/* Đặc điểm thiết kế */}
                {previewCostume.designFeatures && (
                  <div>
                    <h4 className="font-sans font-semibold text-xs text-[#78976A] uppercase tracking-wider mb-1">
                      Đặc điểm thiết kế truyền thống
                    </h4>
                    <ul className="text-xs font-sans text-[#BAA796] space-y-1 list-disc list-inside">
                      {previewCostume.designFeatures.map((df, dfIdx) => (
                        <li key={dfIdx}>{df}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Ý nghĩa văn hóa */}
                {previewCostume.culturalMeaning && (
                  <div className="p-3.5 rounded-xl bg-[#1C140E]/80 border border-[#3E2C1E]">
                    <h4 className="font-sans font-semibold text-xs text-[#78976A] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      Ý nghĩa biểu trưng văn hóa
                    </h4>
                    <p className="text-xs font-sans text-[#D8CCC0] leading-relaxed">
                      {previewCostume.culturalMeaning}
                    </p>
                  </div>
                )}

                {/* Nút Chọn và Tùy chỉnh ngay */}
                <div className="flex items-center justify-between pt-2 border-t border-[#3E2C1E]">
                  <div className="text-xs text-[#BAA796] font-sans">
                    <span className="font-semibold text-[#F5EFE6]">Cổ áo:</span> {previewCostume.collarType}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleSelectCostume(previewCostume, true);
                      setPreviewCostume(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#536B49] to-[#3B4D33] text-[#F5EFE6] text-xs font-sans font-medium shadow-md shadow-[#2B3825]/40 cursor-pointer hover:scale-105 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Chọn & Sang Tùy Chỉnh</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
