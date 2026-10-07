import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  Layers, 
  Shirt, 
  Check, 
  Sliders, 
  BookmarkCheck,
  Share2,
  Camera,
  CheckCircle2,
  Globe,
  MapPin,
  Scissors,
  Star,
  Wand2,
  Eye,
  Info,
  X,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';
import { RecommendedCostume } from '../../types/context';
import { 
  OutfitCustomization, 
  GenderType, 
  PatternType, 
  AccessoryId,
  AIEvaluationSummary,
  TryOnRecord
} from '../../types/customization';
import { Character2DViewer, captureCroquisModelImage, PATTERN_LABELS } from '../customizer/Character2DViewer';
import { 
  ACCESSORIES_CATALOG, 
  AIEvaluationService 
} from '../../services/aiEvaluationService';
import { TryOnService } from '../../services/tryOnService';
import { LookbookService, getCostumeImage } from '../../services/lookbookService';
import { CommunityForumModal } from '../customizer/CommunityForumModal';
import { SaveToLookbookModal, SaveToLookbookPayload } from '../lookbook/SaveToLookbookModal';
import { CostumeService } from '../../services/costumeService';
import { getCostumeDefaultColors, normalizeCostumeKey, TRADITIONAL_COSTUME_DEFAULTS } from '../../data/costumeDefaults';
import imgNhatBinh from '../../assets/images/ao_nhat_binh_1790402840330.jpg';
import { ALL_CUSTOM_FABRICS, TRADITIONAL_FABRICS, TraditionalFabric } from '../../data/traditionalFabrics';
import { AnimeFashionStarModal } from '../customizer/AnimeFashionStarModal';
import { PatternGeneratorModal } from '../customizer/PatternGeneratorModal';
import { ShareToSocialModal } from '../lookbook/ShareToSocialModal';
import { CulturalAuditGateModal, AuditActionType } from '../customizer/CulturalAuditGateModal';
import { useLanguage } from '../../contexts/LanguageContext';

interface AtelierRealmProps {
  selectedCostume: RecommendedCostume | null;
  onSendForAIEvaluation: (evaluation: AIEvaluationSummary, currentCustomization: OutfitCustomization) => void;
  onBack: () => void;
  onContinueDirect?: (currentCustomization: OutfitCustomization) => void;
  onNavigateToForum?: () => void;
  onNavigateToTailor?: (currentCustomization: OutfitCustomization) => void;
  onNavigateToLookbook?: () => void;
}

export const AtelierRealm: React.FC<AtelierRealmProps> = ({
  selectedCostume,
  onSendForAIEvaluation,
  onBack,
  onContinueDirect,
  onNavigateToForum,
  onNavigateToTailor,
  onNavigateToLookbook,
}) => {
  // Nguồn dữ liệu duy nhất cho bộ trang phục đang tùy biến
  const currentCostumeFromSource = selectedCostume || CostumeService.getSelectedCostume();
  const effectiveCostumeId = currentCostumeFromSource?.id || 'ao-nhat-binh';
  const effectiveCostumeName = currentCostumeFromSource?.name || 'Áo Nhật Bình Cung Đình';

  // Modal Lưu Lookbook Design
  const [isSaveLookbookOpen, setIsSaveLookbookOpen] = useState(false);
  const [lookbookDesignName, setLookbookDesignName] = useState('');
  const [capturedDesignImage, setCapturedDesignImage] = useState<string | null>(null);

  // Modal Kiểm Duyệt Văn Hóa AI (Bắt buộc trước khi thực hiện tác vụ)
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [verifiedAudit, setVerifiedAudit] = useState<AIEvaluationSummary | null>(() => {
    try {
      const saved = localStorage.getItem('vietphuc_latest_ai_evaluation');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && normalizeCostumeKey(parsed.customizationSnapshot?.costumeId) === normalizeCostumeKey(effectiveCostumeId)) {
          return parsed;
        }
      }
    } catch {}
    return null;
  });
  const [isAuditVerified, setIsAuditVerified] = useState<boolean>(Boolean(verifiedAudit));

  const [customization, setCustomization] = useState<OutfitCustomization>(() => {
    const defaultColors = getCostumeDefaultColors(effectiveCostumeId);
    try {
      const saved = localStorage.getItem('vietphuc_current_customization');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          normalizeCostumeKey(parsed.costumeId) === normalizeCostumeKey(effectiveCostumeId) &&
          parsed.parts
        ) {
          return {
            ...parsed,
            costumeId: effectiveCostumeId,
            costumeName: effectiveCostumeName,
          };
        }
      }
    } catch {
      // ignore
    }

    return {
      costumeId: effectiveCostumeId,
      costumeName: effectiveCostumeName,
      gender: 'female',
      parts: {
        primaryRobeColor: defaultColors.primaryRobeColor,
        innerCollarColor: defaultColors.innerCollarColor,
        bottomColor: defaultColors.bottomColor,
        sashColor: defaultColors.sashColor,
      },
      pattern: defaultColors.defaultPattern,
      accessories: defaultColors.defaultAccessories as AccessoryId[],
      lastUpdated: Date.now(),
    };
  });

  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  const [activeTab, setActiveTab] = useState<'colors' | 'accessories'>('colors');
  const [activePart, setActivePart] = useState<'primary' | 'inner' | 'bottom' | 'sash'>('primary');
  const [applyMode, setApplyMode] = useState<'part' | 'full'>('part');
  
  const PART_LABELS: Record<'primary' | 'inner' | 'bottom' | 'sash', string> = {
    primary: isVi ? 'Vạt Áo Ngoài' : 'Outer Robe',
    inner: isVi ? 'Cổ / Lớp Trong' : 'Inner Collar',
    bottom: isVi ? 'Quần / Váy' : 'Pants / Skirt',
    sash: isVi ? 'Khăn / Thắt Lưng' : 'Sash / Belt',
  };

  // Panel vải: dí lâu mới hiện, popover kính nhỏ, không che model
  const [hoveredFabric, setHoveredFabric] = useState<TraditionalFabric | null>(null);
  const isOverPanelRef = React.useRef<boolean>(false);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const openHoverTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressRef = React.useRef<boolean>(false);

  // Đóng panel khi bấm phím ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setHoveredFabric(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Modal tạo Model 2D Anime Ngôi Sao Thời Trang
  const [isAnimeModalOpen, setIsAnimeModalOpen] = useState<boolean>(false);
  const [isPatternGeneratorOpen, setIsPatternGeneratorOpen] = useState<boolean>(false);
  const [sharingLookbookItem, setSharingLookbookItem] = useState<any>(null);

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  
  // State thông báo toast khi lưu
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State mở Modal Diễn Đàn
  const [isForumOpen, setIsForumOpen] = useState<boolean>(false);
  const [forumInitialMode, setForumInitialMode] = useState<'browse' | 'publish'>('browse');

  // Đánh dấu thiết kế đã thay đổi -> cần tái kiểm duyệt văn hóa
  const markCustomizationChanged = () => {
    setIsAuditVerified(false);
  };

  const handleApplyCustomCanvasPattern = (result: {
    patternType: PatternType;
    baseColor: string;
    motifColor: string;
    patternName: string;
    canvasDataUrl: string;
  }) => {
    markCustomizationChanged();
    setCustomization((prev) => ({
      ...prev,
      pattern: result.patternType,
      customPatternDataUrl: result.canvasDataUrl,
      customPatternName: result.patternName,
      parts: {
        ...prev.parts,
        primaryRobeColor: result.baseColor,
      },
      lastUpdated: Date.now(),
    }));
  };

  useEffect(() => {
    try {
      localStorage.setItem('vietphuc_current_customization', JSON.stringify(customization));
    } catch {
      // ignore
    }
  }, [customization]);

  // Tự động hiệu chỉnh màu sắc ban đầu của trang phục về đúng màu gốc / đặc trưng khi selectedCostume đổi
  useEffect(() => {
    const activeCostume = selectedCostume || CostumeService.getSelectedCostume();
    if (activeCostume) {
      const activeNorm = normalizeCostumeKey(activeCostume.id);
      const currentNorm = normalizeCostumeKey(customization.costumeId);
      if (activeCostume.id !== customization.costumeId || activeNorm !== currentNorm) {
        const spec = getCostumeDefaultColors(activeCostume.id);
        markCustomizationChanged();

        setCustomization((prev) => ({
          ...prev,
          costumeId: activeCostume.id,
          costumeName: activeCostume.name,
          parts: {
            primaryRobeColor: spec.primaryRobeColor,
            innerCollarColor: spec.innerCollarColor,
            bottomColor: spec.bottomColor,
            sashColor: spec.sashColor,
          },
          pattern: spec.defaultPattern,
          accessories: spec.defaultAccessories as AccessoryId[],
          lastUpdated: Date.now(),
        }));
      }
    }
  }, [selectedCostume?.id, selectedCostume?.name]);

  // Đóng panel khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      if (hoveredFabric) setHoveredFabric(null);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (openHoverTimerRef.current) clearTimeout(openHoverTimerRef.current);
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, [hoveredFabric]);

  // Áp dụng loại vải (đơn sắc hoặc cổ truyền) trong Tự Phối Màu
  const handleSelectFabric = (fabric: TraditionalFabric, forcedMode?: 'part' | 'full') => {
    markCustomizationChanged();
    const mode = forcedMode || applyMode;
    const fabricColor = fabric.solidColorHex || fabric.defaultColors.primaryRobeColor;
    const partLabel = PART_LABELS[activePart];

    const isSolid = Boolean(fabric.isSolid || fabric.id.startsWith('vai-don-sac'));
    const assignedPattern: PatternType = isSolid ? 'plain' : fabric.defaultPattern;

    if (mode === 'full') {
      setCustomization((prev) => ({
        ...prev,
        selectedFabricId: fabric.id,
        customFabricImage: isSolid ? undefined : fabric.fullImage,
        parts: {
          primaryRobeColor: fabricColor,
          innerCollarColor: fabric.defaultColors.innerCollarColor,
          bottomColor: fabric.defaultColors.bottomColor,
          sashColor: fabric.defaultColors.sashColor,
        },
        pattern: assignedPattern,
        lastUpdated: Date.now(),
      }));
      setToastMessage(
        isSolid
          ? `Đã áp dụng trọn bộ "${fabric.name}" (Vải đơn sắc thuần khiết, không tự tạo họa tiết)`
          : `Đã áp dụng trọn bộ "${fabric.name}" & tự động tạo họa tiết ${PATTERN_LABELS[assignedPattern] || assignedPattern}`
      );
    } else {
      setCustomization((prev) => {
        const newParts = { ...prev.parts };
        if (activePart === 'primary') newParts.primaryRobeColor = fabricColor;
        if (activePart === 'inner') newParts.innerCollarColor = fabricColor;
        if (activePart === 'bottom') newParts.bottomColor = fabricColor;
        if (activePart === 'sash') newParts.sashColor = fabricColor;

        return {
          ...prev,
          ...(activePart === 'primary'
            ? {
                selectedFabricId: fabric.id,
                customFabricImage: isSolid ? undefined : fabric.fullImage,
                pattern: assignedPattern,
              }
            : {}),
          parts: newParts,
          lastUpdated: Date.now(),
        };
      });
      setToastMessage(
        activePart === 'primary'
          ? isSolid
            ? `Đã phối "${fabric.name}" cho ${partLabel} (Vải đơn sắc, không tạo họa tiết)`
            : `Đã phối "${fabric.name}" & tự động tạo họa tiết ${PATTERN_LABELS[assignedPattern] || assignedPattern}`
          : `Đã phối màu "${fabric.name}" cho ${partLabel}`
      );
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Hover ổn định 320ms mới mở panel; rê nhanh không bật
  const handleOvalMouseEnter = (fabric: TraditionalFabric) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (openHoverTimerRef.current) clearTimeout(openHoverTimerRef.current);
    openHoverTimerRef.current = setTimeout(() => {
      setHoveredFabric(fabric);
    }, 320);
  };

  const handleOvalMouseLeave = () => {
    if (openHoverTimerRef.current) {
      clearTimeout(openHoverTimerRef.current);
      openHoverTimerRef.current = null;
    }
    closeTimerRef.current = setTimeout(() => {
      if (!isOverPanelRef.current) setHoveredFabric(null);
    }, 200);
  };

  const handlePanelMouseEnter = () => {
    isOverPanelRef.current = true;
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handlePanelMouseLeave = () => {
    isOverPanelRef.current = false;
    setHoveredFabric(null);
  };

  // Mobile: nhấn giữ 320ms xem chi tiết; chạm nhanh = chọn vải
  const handleTouchStart = (fabric: TraditionalFabric, _e: React.TouchEvent<HTMLButtonElement>) => {
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setHoveredFabric(fabric);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
    }, 320);
  };

  const handleTouchEnd = (fabric: TraditionalFabric) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (!isLongPressRef.current) {
      handleSelectFabric(fabric);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Khôi phục bộ màu gốc chuẩn di sản theo đúng chuẩn gợi ý AI trong VirtualTryOn
  const handleResetTraditionalColors = () => {
    markCustomizationChanged();
    const spec = getCostumeDefaultColors(customization.costumeId);
    setCustomization((prev) => ({
      ...prev,
      parts: {
        primaryRobeColor: spec.primaryRobeColor,
        innerCollarColor: spec.innerCollarColor,
        bottomColor: spec.bottomColor,
        sashColor: spec.sashColor,
      },
      lastUpdated: Date.now(),
    }));
    setToastMessage(`Đã khôi phục sắc màu gốc chuẩn xác của ${customization.costumeName || 'trang phục'} (đồng bộ gợi ý gửi AI)`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Chuyển đổi nhanh sang bộ Việt phục khác và tự động áp dụng màu gốc đặc trưng
  const handleSwitchCostume = (costumeKey: string) => {
    markCustomizationChanged();
    const spec = getCostumeDefaultColors(costumeKey);
    const all = CostumeService.getAllCostumes();
    const matched = all.find((c) => c.id === spec.id || c.id === costumeKey);
    if (matched) {
      CostumeService.saveSelectedCostume(matched);
    }
    setCustomization((prev) => ({
      ...prev,
      costumeId: spec.id,
      costumeName: spec.name,
      parts: {
        primaryRobeColor: spec.primaryRobeColor,
        innerCollarColor: spec.innerCollarColor,
        bottomColor: spec.bottomColor,
        sashColor: spec.sashColor,
      },
      pattern: spec.defaultPattern,
      accessories: spec.defaultAccessories as AccessoryId[],
      lastUpdated: Date.now(),
    }));
    setToastMessage(`Đã chọn ${spec.name} với sắc màu gốc di sản!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleColorChange = (hex: string) => {
    markCustomizationChanged();
    setCustomization((prev) => {
      const newParts = { ...prev.parts };
      if (activePart === 'primary') newParts.primaryRobeColor = hex;
      if (activePart === 'inner') newParts.innerCollarColor = hex;
      if (activePart === 'bottom') newParts.bottomColor = hex;
      if (activePart === 'sash') newParts.sashColor = hex;

      return {
        ...prev,
        parts: newParts,
        lastUpdated: Date.now(),
      };
    });
  };

  const handleToggleAccessory = (accId: AccessoryId) => {
    markCustomizationChanged();
    setCustomization((prev) => {
      const exists = prev.accessories.includes(accId);
      const newAccessories = exists
        ? prev.accessories.filter((a) => a !== accId)
        : [...prev.accessories, accId];

      return {
        ...prev,
        accessories: newAccessories,
        lastUpdated: Date.now(),
      };
    });
  };

  const handleGenderToggle = (gen: GenderType) => {
    markCustomizationChanged();
    setCustomization((prev) => ({
      ...prev,
      gender: gen,
      lastUpdated: Date.now(),
    }));
  };

  const handleReset = () => {
    markCustomizationChanged();
    const targetId = customization.costumeId || effectiveCostumeId;
    const spec = getCostumeDefaultColors(targetId);
    setCustomization({
      costumeId: targetId,
      costumeName: customization.costumeName || effectiveCostumeName,
      gender: customization.gender || 'female',
      parts: {
        primaryRobeColor: spec.primaryRobeColor,
        innerCollarColor: spec.innerCollarColor,
        bottomColor: spec.bottomColor,
        sashColor: spec.sashColor,
      },
      pattern: spec.defaultPattern,
      accessories: spec.defaultAccessories as AccessoryId[],
      lastUpdated: Date.now(),
    });
    showToast(`Đã đặt lại cấu hình gốc của ${customization.costumeName || effectiveCostumeName}`);
  };

  // Lấy màu hex của phần đang được chọn
  const getCurrentPartColor = () => {
    if (activePart === 'primary') return customization.parts.primaryRobeColor;
    if (activePart === 'inner') return customization.parts.innerCollarColor;
    if (activePart === 'bottom') return customization.parts.bottomColor;
    return customization.parts.sashColor;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Mở modal lưu vào Lookbook album (YouTube Playlist style)
  const handleOpenSaveLookbook = async () => {
    try {
      const captured = await captureCroquisModelImage();
      if (captured && captured.length > 50) {
        setCapturedDesignImage(captured);
      }
    } catch (e) {
      console.warn('Lỗi trích xuất model design:', e);
    }
    setIsSaveLookbookOpen(true);
  };

  const handleLookbookSaveSuccess = (albumName: string, itemName: string) => {
    showToast(`Đã lưu "${itemName}" vào Lookbook "${albumName}" thành công!`);
  };

  // Mở modal đăng diễn đàn
  const handleOpenPublishForum = () => {
    setForumInitialMode('publish');
    setIsForumOpen(true);
  };

  // Mở modal duyệt bài cộng đồng
  const handleOpenBrowseForum = () => {
    setForumInitialMode('browse');
    setIsForumOpen(true);
  };

  // === CÁC TÁC VỤ BẮT BUỘC KIỂM DUYỆT VĂN HÓA TRƯỚC KHI THỰC HIỆN ===
  const handleRequestTryOn = () => {
    if (!isAuditVerified) {
      setIsAuditModalOpen(true);
    } else if (onContinueDirect) {
      onContinueDirect(customization);
    }
  };

  const handleRequestTailor = () => {
    if (!isAuditVerified) {
      setIsAuditModalOpen(true);
    } else if (onNavigateToTailor) {
      try {
        localStorage.setItem(
          'vietphuc_current_customization',
          JSON.stringify(customization)
        );
      } catch {}
      onNavigateToTailor(customization);
    }
  };

  const handleRequestSaveLookbook = () => {
    if (!isAuditVerified) {
      setIsAuditModalOpen(true);
    } else {
      handleOpenSaveLookbook();
    }
  };

  const handleRequestPublishForum = () => {
    if (!isAuditVerified) {
      setIsAuditModalOpen(true);
    } else {
      handleOpenPublishForum();
    }
  };

  const handleRequestAnimeModel = () => {
    if (!isAuditVerified) {
      setIsAuditModalOpen(true);
    } else {
      setIsAnimeModalOpen(true);
    }
  };

  const handleRequestManualAudit = () => {
    setIsAuditModalOpen(true);
  };

  // Xử lý khi AI hoàn tất kiểm duyệt và người dùng chọn tác vụ trực tiếp trên modal
  const handleAuditActionSelect = (action: AuditActionType, auditResult: AIEvaluationSummary) => {
    setVerifiedAudit(auditResult);
    setIsAuditVerified(true);
    setIsAuditModalOpen(false);

    try {
      localStorage.setItem('vietphuc_latest_ai_evaluation', JSON.stringify(auditResult));
    } catch {}

    const badgeTitle = auditResult.cultural.badge || (isVi ? 'Đạt Chuẩn Di Sản' : 'Heritage Approved');
    showToast(isVi ? `✓ Đã kiểm duyệt: ${auditResult.cultural.score}/100đ · ${badgeTitle}` : `✓ Cultural audit passed: ${auditResult.cultural.score}/100pts`);

    // Chuyển ngay tới tác vụ được chọn
    if (action === 'tryon' && onContinueDirect) {
      setTimeout(() => onContinueDirect(customization), 150);
    } else if (action === 'tailor' && onNavigateToTailor) {
      try {
        localStorage.setItem(
          'vietphuc_current_customization',
          JSON.stringify(customization)
        );
      } catch {}
      setTimeout(() => onNavigateToTailor(customization), 150);
    } else if (action === 'lookbook') {
      setTimeout(() => handleOpenSaveLookbook(), 150);
    } else if (action === 'forum') {
      setTimeout(() => handleOpenPublishForum(), 150);
    } else if (action === 'anime') {
      setTimeout(() => setIsAnimeModalOpen(true), 150);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between pt-4 sm:pt-16 pb-24 md:pb-12 px-2.5 sm:px-6 md:pr-14 lg:pr-16 max-w-6xl mx-auto w-full z-10 select-none">
      {/* Toast Notification Popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#1C261A]/95 border border-[#465A3D] text-[#78976A] text-xs font-sans font-semibold shadow-2xl flex items-center gap-2.5 backdrop-blur-md max-w-[90vw] text-center"
          >
            <CheckCircle2 className="w-4 h-4 text-[#78976A] shrink-0" />
            <span className="truncate">{toastMessage}</span>
            {onNavigateToLookbook && (
              <button
                type="button"
                onClick={onNavigateToLookbook}
                className="px-2 py-0.5 rounded-full bg-[#384C32] hover:bg-[#48683B] text-[#F3C96B] hover:text-white text-[10px] font-sans font-medium transition-colors cursor-pointer border border-[#78976A]/50 shrink-0"
              >
                Xem
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-2.5 sm:mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#241A13]/90 border border-[#423023] mb-1 sm:mb-2.5"
        >
          <Shirt className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#78976A]" />
          <span className="text-[11px] sm:text-xs font-sans text-[#D8CCC0]">
            Phục trang: <strong className="text-[#F5EFE6]">{customization.costumeName || effectiveCostumeName}</strong>
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-xl sm:text-3xl md:text-4xl font-serif font-bold text-[#F5EFE6] tracking-tight mb-0.5 sm:mb-2"
        >
          Tùy Biến Diện Mạo 2D
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[11px] sm:text-sm text-[#BAA796] font-serif italic line-clamp-1 sm:line-clamp-none"
        >
          Vải dệt cổ truyền, tự phối ngũ hành và phụ kiện di sản
        </motion.p>
      </div>

      {/* Main Workspace Grid (Left: 2D Model Viewer / Right: Customizer Studio) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-8 items-start mb-3 sm:mb-8">
        {/* Left Column: 2D Model Studio (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <Character2DViewer customization={customization} isEvaluating={isEvaluating} />

          {/* CULTURAL VERIFICATION STATUS PILL (Con Dấu Kiểm Duyệt Di Sản) */}
          <div className="w-full max-w-[260px] sm:max-w-[420px] mt-2 sm:mt-3 px-1">
            {isAuditVerified && verifiedAudit ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRequestManualAudit}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#1D2B1A] via-[#243521] to-[#172315] border border-[#5A754E] text-[#8FB57F] text-xs font-sans shadow-lg shadow-[#1D2B1A]/50 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-6 h-6 rounded-lg bg-[#2D3E29] flex items-center justify-center text-xs shrink-0 border border-[#5A754E]">
                    📜
                  </div>
                  <div className="flex flex-col text-left truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#FFF8EE] text-[11px] sm:text-xs truncate">
                        {isVi ? `Đã Kiểm Duyệt: ${verifiedAudit.cultural.score}/100đ` : `Audit Passed: ${verifiedAudit.cultural.score}/100pts`}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#A6C998] font-medium truncate">
                      {verifiedAudit.cultural.badge || (isVi ? 'Chuẩn Cổ Phục' : 'Heritage Certified')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#D4A043] font-semibold uppercase tracking-wider shrink-0 bg-[#140D08]/60 px-2 py-0.5 rounded-full border border-[#D4A043]/30">
                  <span>{isVi ? 'Chi tiết' : 'Report'}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRequestManualAudit}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#2B1B12] via-[#352216] to-[#22150E] border border-[#8A5A2B] text-[#E5B56E] text-xs font-sans shadow-lg shadow-black/50 cursor-pointer transition-all group ring-1 ring-[#D4A043]/30"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-6 h-6 rounded-lg bg-[#3E2819] flex items-center justify-center text-xs shrink-0 border border-[#8A5A2B]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4A043] animate-pulse" />
                  </div>
                  <div className="flex flex-col text-left truncate">
                    <span className="font-bold text-[#FFF8EE] text-[11px] sm:text-xs truncate">
                      {isVi ? 'Chưa Kiểm Duyệt Văn Hóa' : 'Pending Cultural Audit'}
                    </span>
                    <span className="text-[10px] text-[#BAA796] truncate">
                      {isVi ? 'Bắt buộc trước khi thử đồ, đặt may, xuất bản' : 'Required before try-on, tailoring & publishing'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#F3C96B] font-bold uppercase tracking-wider shrink-0 bg-[#BA3424]/40 px-2 py-0.5 rounded-full border border-[#BA3424]">
                  <span>{isVi ? 'Duyệt Ngay' : 'Audit'}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </motion.button>
            )}
          </div>

          {/* Model Gender Toggle + Reset + Community Quick Buttons */}
          <div className="flex flex-col gap-2 w-full max-w-[260px] sm:max-w-[420px] mt-2 px-1">
            <div className="flex items-center justify-between w-full">
              {/* Gender Toggle */}
              <div className="inline-flex p-0.5 rounded-full bg-[#1C140E]/90 border border-[#423023]">
                <button
                  type="button"
                  onClick={() => handleGenderToggle('female')}
                  className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-sans font-medium transition-all cursor-pointer ${
                    customization.gender === 'female'
                      ? 'bg-[#536B49] text-white shadow-sm'
                      : 'text-[#BAA796] hover:text-[#F5EFE6]'
                  }`}
                >
                  {isVi ? 'Model Nữ' : 'Female'}
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderToggle('male')}
                  className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-sans font-medium transition-all cursor-pointer ${
                    customization.gender === 'male'
                      ? 'bg-[#536B49] text-white shadow-sm'
                      : 'text-[#BAA796] hover:text-[#F5EFE6]'
                  }`}
                >
                  {isVi ? 'Model Nam' : 'Male'}
                </button>
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1C140E]/80 hover:bg-[#2A1D14] border border-[#423023] text-[11px] sm:text-xs font-sans text-[#BAA796] hover:text-[#F5EFE6] transition-colors cursor-pointer"
                title={isVi ? 'Khôi phục màu và kiểu dáng gốc' : 'Reset to default colors'}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isVi ? 'Đặt lại' : 'Reset'}</span>
              </button>
            </div>

            {/* NÚT TẠO HỌA TIẾT CANVAS & TẠO MODEL 2D ANIME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsPatternGeneratorOpen(true)}
                className="py-2.5 px-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#2A1E14] via-[#352518] to-[#20150E] hover:from-[#3E2C1E] hover:to-[#2A1D14] text-[#F3C96B] font-serif font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer border border-[#D4A043]/50"
                title={isVi ? 'Tự do vẽ hoa sen, mây cung đình, hoa cúc... bằng Canvas và phủ lên phục trang' : 'Create procedural custom Canvas patterns (Lotus, Clouds, Flowers)'}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4A043]" />
                <span>{isVi ? 'Dệt Họa Tiết Canvas' : 'Pattern Generator'}</span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRequestAnimeModel}
                className="py-2.5 px-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#D4A043] via-[#BA8A30] to-[#8E6319] hover:from-[#E2B155] hover:to-[#A37320] text-[#140D08] font-serif font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,160,67,0.3)] cursor-pointer border border-[#F3C96B]"
                title={isVi ? 'Tạo hình ảnh model 2D style anime phong cách Ngôi Sao Thời Trang' : 'Generate 2D Anime Star Model'}
              >
                <Star className="w-3.5 h-3.5 fill-[#140D08]" />
                <span>{isVi ? 'Tạo Model 2D Anime' : '2D Anime Star Model'}</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Panel Tabs (7 cols) */}
        <div className="lg:col-span-7 bg-[#241A13]/90 backdrop-blur-md border border-[#423023] rounded-2xl sm:rounded-3xl p-3 sm:p-5 lg:p-7 shadow-xl shadow-black/40 flex flex-col justify-between">
          <div>
            {/* Category Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-[#3E2C1E] pb-2 mb-3 sm:pb-3 sm:mb-6 flex-wrap gap-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* TAB 1: TỰ PHỐI MÀU & VẢI (5 MÀU ĐƠN SẮC & VẢI CỔ TRUYỀN) */}
                <button
                  type="button"
                  onClick={() => setActiveTab('colors')}
                  className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-sans font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'colors'
                      ? 'bg-[#465A3D] text-[#F5EFE6] shadow-md border border-[#627C56]/40'
                      : 'text-[#BAA796] hover:text-[#F5EFE6] hover:bg-[#322319]'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-[#F3C96B]" />
                  <span>{isVi ? `Phối Màu & Vải (${ALL_CUSTOM_FABRICS.length})` : `Colors & Fabrics (${ALL_CUSTOM_FABRICS.length})`}</span>
                </button>

                {/* TAB 2: PHỤ KIỆN GEN Z */}
                <button
                  type="button"
                  onClick={() => setActiveTab('accessories')}
                  className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-sans font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'accessories'
                      ? 'bg-[#465A3D] text-[#F5EFE6] shadow-md border border-[#627C56]/40'
                      : 'text-[#BAA796] hover:text-[#F5EFE6] hover:bg-[#322319]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#78976A]" />
                  <span>{isVi ? 'Phụ Kiện' : 'Accessories'}</span>
                  {customization.accessories.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#BA3424] text-white text-[9.5px] flex items-center justify-center font-bold">
                      {customization.accessories.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Nút xem diễn đàn cộng đồng */}
              <button
                type="button"
                onClick={onNavigateToForum || handleOpenBrowseForum}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C140E] hover:bg-[#2A1D14] border border-[#423023] text-xs font-sans text-[#D4A043] hover:text-[#F5EFE6] transition-colors cursor-pointer"
                title={isVi ? 'Đến trang Diễn Đàn Cộng Đồng' : 'Explore Community Forum'}
              >
                <Globe className="w-3.5 h-3.5 text-[#D4A043]" />
                <span>{isVi ? 'Diễn đàn Gen Z' : 'Gen Z Forum'}</span>
              </button>
            </div>

            {/* TAB: TỰ PHỐI MÀU (TÍCH HỢP 5 MÀU ĐƠN SẮC & TOÀN BỘ VẢI CỔ TRUYỀN THÀNH 1 DANH SÁCH DUY NHẤT) */}
            {activeTab === 'colors' && (() => {
              const currentSpec = getCostumeDefaultColors(customization.costumeId);
              return (
                <div className="space-y-6">
                  {/* 0. Banner Màu Gốc Đặc Trưng Chuẩn Di Sản */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#241A13] via-[#1C140E] to-[#20150E] border border-[#78976A]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#D4A043] animate-pulse" />
                        <span className="text-xs font-serif font-bold text-[#F5EFE6]">
                          {isVi ? `Tự Phối Màu & Màu Gốc Chuẩn Xác (${currentSpec.name}):` : `Custom Palette & Authentic Colors (${currentSpec.name}):`}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#BAA796] leading-relaxed">
                        {currentSpec.colorDescription}
                      </p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[10px] text-[#8E7B6C] font-mono">{isVi ? 'Bảng màu gốc:' : 'Heritage palette:'}</span>
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: currentSpec.primaryRobeColor }} title={`${PART_LABELS.primary}: ${currentSpec.primaryRobeColor}`} />
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: currentSpec.innerCollarColor }} title={`${PART_LABELS.inner}: ${currentSpec.innerCollarColor}`} />
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: currentSpec.sashColor }} title={`${PART_LABELS.sash}: ${currentSpec.sashColor}`} />
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: currentSpec.bottomColor }} title={`${PART_LABELS.bottom}: ${currentSpec.bottomColor}`} />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetTraditionalColors}
                      className="px-3 py-1.5 rounded-xl bg-[#2A1E15] hover:bg-[#38281C] border border-[#78976A]/50 text-[#E8D5B5] hover:text-white text-xs font-sans font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap self-end sm:self-center"
                      title={isVi ? 'Khôi phục về đúng bảng màu sắc gốc chuẩn xác' : 'Restore original authentic color palette'}
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#D4A043]" />
                      <span>{isVi ? 'Khôi phục màu gốc' : 'Restore Original'}</span>
                    </button>
                  </div>

                  {/* 0.5. Banner Dệt Họa Tiết Canvas Độc Bản */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#2B1D14] via-[#382619] to-[#25180F] border border-[#D4A043]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#D4A043] animate-ping" />
                        <span className="text-xs font-serif font-bold text-[#F3C96B]">
                          {isVi ? 'Xưởng Dệt Họa Tiết Canvas (Pattern Generator):' : 'Canvas Pattern Generator Studio:'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#D8CCC0] leading-relaxed">
                        {customization.pattern === 'custom_canvas' && customization.customPatternName
                          ? (isVi ? `Đang dệt: ${customization.customPatternName}` : `Currently applied: ${customization.customPatternName}`)
                          : (isVi ? 'Tự chọn màu nền & vẽ hoa sen, mây cung đình, hoa cúc, hạc tiên... phủ lên phục trang.' : 'Customize base color & procedural motifs (lotus, clouds, flora) onto costume.')}
                      </p>
                      {customization.customPatternDataUrl && (
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-[10px] text-[#A89685]">{isVi ? 'Mẫu hoa văn hiện tại:' : 'Current Swatch:'}</span>
                          <img
                            src={customization.customPatternDataUrl}
                            alt=""
                            className="w-5 h-5 rounded-md border border-[#D4A043] object-cover shadow-sm"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPatternGeneratorOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4A043] to-[#BA8A30] hover:from-[#E2B155] hover:to-[#A37320] text-[#140D08] text-xs font-serif font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer whitespace-nowrap self-end sm:self-center"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-[#140D08]" />
                      <span>{customization.pattern === 'custom_canvas' ? (isVi ? 'Chỉnh Sửa Họa Tiết' : 'Edit Pattern') : (isVi ? 'Tạo Họa Tiết Riêng' : 'Generate Pattern')}</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#F3C96B] uppercase tracking-wider text-[11px]">
                        {isVi ? 'Bộ phận trang phục:' : 'Garment Parts:'}
                      </span>
                      {/* Chế độ áp dụng */}
                      <div className="inline-flex p-0.5 rounded-lg bg-[#140D08] border border-[#3E2C1E] text-[10px]">
                        <button
                          type="button"
                          onClick={() => setApplyMode('part')}
                          className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                            applyMode === 'part'
                              ? 'bg-[#536B49] text-white font-bold'
                              : 'text-[#8E7B6C] hover:text-[#D8CCC0]'
                          }`}
                        >
                          {isVi ? 'Từng phần' : 'Single Part'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setApplyMode('full')}
                          className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                            applyMode === 'full'
                              ? 'bg-[#536B49] text-white font-bold'
                              : 'text-[#8E7B6C] hover:text-[#D8CCC0]'
                          }`}
                        >
                          {isVi ? 'Cả bộ' : 'Full Set'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                      {[
                        { id: 'primary', label: PART_LABELS.primary, color: customization.parts.primaryRobeColor },
                        { id: 'inner', label: PART_LABELS.inner, color: customization.parts.innerCollarColor },
                        { id: 'bottom', label: PART_LABELS.bottom, color: customization.parts.bottomColor },
                        { id: 'sash', label: PART_LABELS.sash, color: customization.parts.sashColor },
                      ].map((part) => (
                        <button
                          key={part.id}
                          type="button"
                          onClick={() => setActivePart(part.id as any)}
                          className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border flex items-center gap-1.5 sm:gap-2 text-left transition-all cursor-pointer ${
                            activePart === part.id
                              ? 'bg-[#1C140E] border-[#78976A] shadow-md ring-1 ring-[#78976A]/50'
                              : 'bg-[#1C140E]/60 border-[#3E2C1E] hover:border-[#594232]'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-white/20 shadow-inner flex-shrink-0"
                            style={{ backgroundColor: part.color }}
                          />
                          <span className="text-[10.5px] sm:text-xs font-sans text-[#F5EFE6] font-medium truncate">
                            {part.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Danh sách vải tự phối (5 Vải đơn sắc & Vải cổ truyền) */}
                  <div className="relative p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#1C140E]/90 border border-[#3E2C1E] space-y-2.5">
                    <div className="flex items-center justify-between border-b border-[#322319] pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-[#D4A043]" />
                        <span className="text-[11px] font-sans font-bold text-[#F5EFE6] uppercase tracking-wider">
                          {isVi ? `Bảng vải (${ALL_CUSTOM_FABRICS.length} loại):` : `Fabrics Catalog (${ALL_CUSTOM_FABRICS.length}):`}
                        </span>
                      </div>
                      <span className="text-[10px] font-sans text-[#8E7B6C]">
                        {isVi ? '5 Đơn Sắc • 11 Cổ Truyền' : '5 Monochromes • 11 Heritage'}
                      </span>
                    </div>

                    {/* LƯỚI CÁC Ô OVAL: TRÊN MOBILE CHUẨN 4 CỘT CÂN ĐỐI NHƯ ỨNG DỤNG THẬT */}
                    <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-2 sm:gap-3.5 justify-items-center sm:justify-start py-1">
                      {ALL_CUSTOM_FABRICS.map((fabric) => {
                        const currentColor = getCurrentPartColor();
                        const isMatchCurrentPart = fabric.solidColorHex
                          ? currentColor.toLowerCase() === fabric.solidColorHex.toLowerCase()
                          : (customization.selectedFabricId === fabric.id || currentColor.toLowerCase() === fabric.defaultColors.primaryRobeColor.toLowerCase());

                        const isSelected = isMatchCurrentPart;

                        return (
                          <div key={fabric.id} className="relative group w-full flex justify-center sm:w-auto">
                            <button
                              type="button"
                              onMouseEnter={() => handleOvalMouseEnter(fabric)}
                              onMouseLeave={handleOvalMouseLeave}
                              onTouchStart={(e) => handleTouchStart(fabric, e)}
                              onTouchEnd={() => handleTouchEnd(fabric)}
                              onTouchMove={handleTouchMove}
                              onClick={() => handleSelectFabric(fabric)}
                              className={`relative w-full max-w-[68px] h-10 sm:w-24 sm:h-14 sm:max-w-none rounded-full overflow-hidden border-0 p-0 cursor-pointer transition-all duration-300 transform active:scale-95 shadow-md ${
                                isSelected
                                  ? 'ring-2 sm:ring-3 ring-[#D4A043] shadow-[0_0_15px_rgba(212,160,67,0.7)] scale-105'
                                  : 'hover:shadow-[0_0_10px_rgba(0,0,0,0.8)]'
                              }`}
                              title={`${fabric.name} · Nhấp chọn · Dí giữ để xem chi tiết`}
                            >
                              <img
                                src={fabric.fullImage}
                                alt=""
                                className="w-full h-full object-cover scale-150 group-hover:scale-175 transition-transform duration-500 pointer-events-none"
                              />
                              {isSelected && (
                                <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                                  <div className="w-4 h-4 rounded-full bg-[#D4A043] text-[#140D08] flex items-center justify-center shadow-md">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                </div>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-center text-[10px] font-sans text-[#8E7B6C] flex items-center justify-center gap-1">
                      <Info className="w-3 h-3 text-[#D4A043] shrink-0" />
                      <span>Rê giữ ~0.3s xem chi tiết · Nhấp nhanh để chọn vải.</span>
                    </div>
                  </div>

                  {/* Popover vải kính nhỏ — neo trong cột vải, không che model */}
                  <AnimatePresence>
                    {hoveredFabric && (
                      <div className="absolute z-50 top-12 right-2 left-2 sm:left-auto sm:right-3 sm:w-[300px] pointer-events-none">
                        <motion.div
                          key={hoveredFabric.id}
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.18 }}
                          onMouseEnter={handlePanelMouseEnter}
                          onMouseLeave={handlePanelMouseLeave}
                          className="pointer-events-auto max-h-[min(52vh,420px)] overflow-y-auto rounded-2xl bg-[#1A120D]/55 backdrop-blur-md border border-[#D4A043]/30 shadow-[0_12px_40px_rgba(0,0,0,0.35)] p-3 space-y-2.5 text-left"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[10px] uppercase tracking-wider text-[#D4A043]/90">
                                {hoveredFabric.isSolid ? 'Đơn sắc' : 'Di sản'} · {hoveredFabric.origin}
                              </p>
                              <h4 className="text-sm font-bold text-[#F3E6D0] truncate">{hoveredFabric.name}</h4>
                              <p className="text-[11px] text-[#BAA796] line-clamp-1">{hoveredFabric.subtitle}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setHoveredFabric(null)}
                              className="shrink-0 w-7 h-7 rounded-full bg-black/20 hover:bg-black/35 text-[#E8D5B5] flex items-center justify-center cursor-pointer"
                              aria-label="Đóng"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="rounded-xl overflow-hidden border border-[#3E2C1E]/50 h-24 bg-[#140D08]/40">
                            <img
                              src={hoveredFabric.fullImage}
                              alt={hoveredFabric.name}
                              className="w-full h-full object-cover opacity-90"
                            />
                          </div>

                          <p className="text-[11px] text-[#E0D5C7] leading-relaxed line-clamp-2">
                            {hoveredFabric.description}
                          </p>
                          {hoveredFabric.culturalNote ? (
                            <p className="text-[10px] italic text-[#BAA796] line-clamp-2 border-l-2 border-[#D4A043]/50 pl-2">
                              {hoveredFabric.culturalNote}
                            </p>
                          ) : null}

                          <div className="flex flex-wrap gap-2 text-[10px] text-[#E0D5C7]">
                            <span className="inline-flex items-center gap-1">
                              <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: hoveredFabric.solidColorHex || hoveredFabric.defaultColors.primaryRobeColor }} />
                              Áo
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: hoveredFabric.defaultColors.innerCollarColor }} />
                              Cổ
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: hoveredFabric.defaultColors.sashColor }} />
                              Đai
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: hoveredFabric.defaultColors.bottomColor }} />
                              Dưới
                            </span>
                          </div>

                          {!hoveredFabric.isSolid && (
                            <p className="text-[10px] text-[#BAA796]">
                              Họa tiết:{' '}
                              <strong className="text-[#F3C96B]">
                                {PATTERN_LABELS[hoveredFabric.defaultPattern] || hoveredFabric.defaultPattern}
                              </strong>
                            </p>
                          )}

                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#3E2C1E]/50">
                            <button
                              type="button"
                              onClick={() => {
                                handleSelectFabric(hoveredFabric, 'part');
                                setHoveredFabric(null);
                              }}
                              className="py-2 px-2 rounded-xl bg-[#322319]/80 hover:bg-[#423023] text-[#E8D5B5] text-[11px] font-bold border border-[#78976A]/50 cursor-pointer"
                            >
                              Áp {PART_LABELS[activePart]}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleSelectFabric(hoveredFabric, 'full');
                                setHoveredFabric(null);
                              }}
                              className="py-2 px-2 rounded-xl bg-[#465A3D]/90 hover:bg-[#536B49] text-white text-[11px] font-bold border border-[#78976A] cursor-pointer"
                            >
                              Áp cả bộ
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              ); })()}

            {/* TAB 2: PHỤ KIỆN GEN Z ĐA DẠNG */}
            {activeTab === 'accessories' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#78976A]">
                    Phụ kiện Gen Z & Cổ phong ({ACCESSORIES_CATALOG.length} món):
                  </label>
                  <span className="text-[11px] font-sans text-[#BAA796] italic">
                    Bấm để Thêm / Bỏ phụ kiện
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
                  {ACCESSORIES_CATALOG.map((acc) => {
                    const isEquipped = customization.accessories.includes(acc.id);
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => handleToggleAccessory(acc.id)}
                        className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          isEquipped
                            ? 'bg-[#1C140E] border-[#627C56] shadow-md ring-1 ring-[#627C56]'
                            : 'bg-[#1C140E]/60 border-[#3E2C1E] hover:border-[#594232]'
                        }`}
                      >
                        <div className="text-xl flex-shrink-0 p-1 bg-[#140D08] rounded-xl border border-[#3E2C1E]">
                          {acc.icon}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between mb-0.5">
                            <h4 className="text-xs font-sans font-bold text-[#F5EFE6] truncate">
                              {acc.name}
                            </h4>
                            <span
                              className={`text-[9px] font-sans px-2 py-0.5 rounded-full border ${
                                isEquipped
                                  ? 'bg-[#293623] text-[#78976A] border-[#465A3D]'
                                  : 'bg-[#140D08] text-[#8E7B6C] border-[#3E2C1E]'
                              }`}
                            >
                              {isEquipped ? 'Đã chọn' : '+'}
                            </span>
                          </div>
                          <p className="text-[10px] font-sans text-[#BAA796] leading-relaxed line-clamp-1 mb-0.5">
                            {acc.description}
                          </p>
                          <p className="text-[10px] font-sans text-[#78976A] italic truncate">
                            💡 {acc.culturalFit}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer: Điều hướng, Thử đồ, Kiểm duyệt văn hóa, Đặt may */}
          <div className="mt-8 pt-5 border-t border-[#3E2C1E] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1C140E] border border-[#423023] text-xs font-sans text-[#D8CCC0] hover:bg-[#2A1D14] hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isVi ? 'Đổi Phục Trang' : 'Change Costume'}</span>
            </button>

            <div className="flex flex-wrap items-center justify-end gap-2.5 w-full sm:w-auto">
              {/* Nút Thử đồ ảo (Try-on) - Bắt buộc duyệt văn hóa */}
              {onContinueDirect && (
                <button
                  type="button"
                  onClick={handleRequestTryOn}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#241A13] hover:bg-[#322319] border border-[#423023] text-xs font-sans text-[#D8CCC0] hover:text-[#F5EFE6] transition-all cursor-pointer"
                  title={isVi ? 'Kiểm duyệt văn hóa & chuyển sang thử đồ ảo' : 'Audit & proceed to Virtual Try-On'}
                >
                  <Camera className="w-3.5 h-3.5 text-[#D4A043]" />
                  <span>{isVi ? 'Thử Đồ Ảo' : 'Virtual Try-On'}</span>
                </button>
              )}

              {/* Nút Kiểm Duyệt Văn Hóa AI (Bắt Buộc) */}
              <button
                type="button"
                onClick={handleRequestManualAudit}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-full bg-gradient-to-r from-[#BA3424] via-[#A82B1C] to-[#872013] hover:from-[#C73C2A] hover:to-[#962517] text-[#F5EFE6] text-xs sm:text-sm font-sans font-semibold shadow-lg shadow-[#872013]/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ring-1 ring-[#D4A043]/30"
              >
                <ShieldCheck className="w-4 h-4 text-[#F3C96B]" />
                <span>{isVi ? 'Kiểm Duyệt Văn Hóa AI' : 'AI Cultural Audit'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Nút Đặt May Nghệ Nhân - Bắt buộc duyệt văn hóa */}
              {onNavigateToTailor && (
                <button
                  type="button"
                  onClick={handleRequestTailor}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#241A13] hover:bg-[#322319] border border-[#536B49]/50 text-xs font-sans text-[#D8CCC0] hover:text-[#F5EFE6] transition-all cursor-pointer"
                  title={isVi ? 'Kiểm duyệt văn hóa & gửi may đo nghệ nhân' : 'Audit & send to tailor'}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#78976A]" />
                  <span>{isVi ? 'Đặt May Bộ Này' : 'Custom Tailor'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL KIỂM DUYỆT VĂN HÓA AI (GATED AUDIT MODAL) */}
      <CulturalAuditGateModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        customization={customization}
        onActionSelect={handleAuditActionSelect}
        onResetToDefaultColors={handleResetTraditionalColors}
      />

      {/* Community Forum Modal Drawer */}
      <CommunityForumModal
        isOpen={isForumOpen}
        onClose={() => setIsForumOpen(false)}
        currentCustomization={customization}
        initialMode={forumInitialMode}
        onApplyOutfit={(adoptedOutfit) => {
          setCustomization(adoptedOutfit);
          markCustomizationChanged();
          showToast(`Đã áp dụng bản phối: ${adoptedOutfit.costumeName}`);
        }}
        onTryOnOutfit={(tryOutfit) => {
          setCustomization(tryOutfit);
          markCustomizationChanged();
          if (onContinueDirect) {
            onContinueDirect(tryOutfit);
          }
        }}
      />

      {/* Modal Lưu Vào Lookbook (Album / Playlist Style) */}
      <SaveToLookbookModal
        isOpen={isSaveLookbookOpen}
        onClose={() => setIsSaveLookbookOpen(false)}
        payload={{
          type: 'design',
          defaultName: `${customization.costumeName} - Bản Phối Mới`,
          costumeName: customization.costumeName,
          costumeId: customization.costumeId,
          imageUrl: capturedDesignImage || getCostumeImage(customization.costumeId),
          customizationData: customization,
          note: `Bản phối sắc phục với ${customization.accessories.length} phụ kiện thời thượng. Đã qua thẩm định di sản AI.`,
        }}
        onSavedSuccess={handleLookbookSaveSuccess}
      />

      {/* Modal Tạo Model 2D Anime Phong Cách Ngôi Sao Thời Trang */}
      <AnimeFashionStarModal
        isOpen={isAnimeModalOpen}
        onClose={() => setIsAnimeModalOpen(false)}
        customization={customization}
        selectedFabric={ALL_CUSTOM_FABRICS.find((f) => f.id === customization.selectedFabricId) || null}
        onSaveToLookbook={(animeImg) => {
          setCapturedDesignImage(animeImg);
          setIsAnimeModalOpen(false);
          setIsSaveLookbookOpen(true);
        }}
        onShareToSocial={(animeImg) => {
          const itemToShare = {
            id: `anime_star_${Date.now()}`,
            albumId: 'album_genz_vibes',
            type: 'design' as const,
            customName: `${customization.costumeName} - Anime Star`,
            costumeName: customization.costumeName,
            costumeId: customization.costumeId,
            imageUrl: animeImg,
            savedAt: 'Vừa tạo',
            customizationData: customization,
            note: 'Model 2D Anime style Ngôi Sao Thời Trang mặc trang phục cách tân. Đã qua thẩm định di sản AI.',
          };
          setSharingLookbookItem(itemToShare);
          setIsAnimeModalOpen(false);
        }}
        onToast={showToast}
      />

      {/* Modal Chia Sẻ Mạng Xã Hội */}
      {sharingLookbookItem && (
        <ShareToSocialModal
          isOpen={Boolean(sharingLookbookItem)}
          onClose={() => setSharingLookbookItem(null)}
          item={sharingLookbookItem}
          albumName="Bộ Sưu Tập Anime Star"
          onToast={showToast}
        />
      )}

      {/* Modal Xưởng Dệt Họa Tiết Canvas Cổ Phong */}
      <PatternGeneratorModal
        isOpen={isPatternGeneratorOpen}
        onClose={() => setIsPatternGeneratorOpen(false)}
        currentCustomization={customization}
        onApplyPattern={handleApplyCustomCanvasPattern}
        onToast={showToast}
      />
    </div>
  );
};
