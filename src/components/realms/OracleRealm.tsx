import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Palette, 
  Wand2, 
  Info,
  RefreshCw,
  Camera,
  FileCheck,
  Globe,
  Loader2,
  ExternalLink,
  Search
} from 'lucide-react';
import { AIEvaluationSummary, OutfitCustomization } from '../../types/customization';
import { RecommendedCostume } from '../../types/context';
import { Character2DViewer } from '../customizer/Character2DViewer';
import { AIEvaluationService } from '../../services/aiEvaluationService';
import { HeritageSearchService, SearchGroundingResult } from '../../services/heritageSearchService';
import { normalizeCostumeKey, getCostumeDefaultColors } from '../../data/costumeDefaults';
import { useLanguage } from '../../contexts/LanguageContext';

interface OracleRealmProps {
  evaluation: AIEvaluationSummary | null;
  customization: OutfitCustomization | null;
  selectedCostume?: RecommendedCostume | null;
  onModify: () => void;
  onProceedToTryOn: () => void;
  onSaveToLookbook?: () => void;
  onSaveEvaluation?: (evalSummary: AIEvaluationSummary) => void;
  onNavigateToTailor?: () => void;
}

export const OracleRealm: React.FC<OracleRealmProps> = ({
  evaluation,
  customization,
  selectedCostume,
  onModify,
  onProceedToTryOn,
  onSaveEvaluation,
}) => {
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  // Xác định chính xác bộ trang phục và thông số đang active
  const activeCostumeId = customization?.costumeId || selectedCostume?.id || 'ao-dai';
  const activeCostumeName = customization?.costumeName || selectedCostume?.name || 'Áo Dài';

  // Khởi tạo active customization chuẩn mực từ trang phục đang chọn
  const defaultColors = getCostumeDefaultColors(activeCostumeId);
  const activeCustomization: OutfitCustomization = customization || {
    costumeId: activeCostumeId,
    costumeName: activeCostumeName,
    gender: 'female',
    parts: {
      primaryRobeColor: defaultColors.primaryRobeColor,
      innerCollarColor: defaultColors.innerCollarColor,
      bottomColor: defaultColors.bottomColor,
      sashColor: defaultColors.sashColor,
    },
    pattern: defaultColors.defaultPattern,
    accessories: defaultColors.defaultAccessories as any[],
    lastUpdated: Date.now(),
  };

  // QUY TẮC CỐT LÕI: Kết quả đánh giá PHẢI KHỚP ĐÚNG bộ trang phục đang active!
  const isMatchingEvaluation = Boolean(
    evaluation &&
    normalizeCostumeKey(evaluation.customizationSnapshot.costumeId) === normalizeCostumeKey(activeCostumeId)
  );

  const [currentEval, setCurrentEval] = useState<AIEvaluationSummary | null>(() => {
    return isMatchingEvaluation ? evaluation : null;
  });

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search Grounding state for live historical verification
  const [groundingResult, setGroundingResult] = useState<SearchGroundingResult | null>(null);
  const [isLoadingGrounding, setIsLoadingGrounding] = useState(false);
  const [isGroundingExpanded, setIsGroundingExpanded] = useState(false);

  const fetchHeritageGrounding = async () => {
    if (isLoadingGrounding) return;
    setIsLoadingGrounding(true);
    setIsGroundingExpanded(true);
    try {
      const q = `Quy chuẩn điển chế và đặc trưng lịch sử của ${activeCostumeName} trong văn hóa truyền thống Việt Nam`;
      const result = await HeritageSearchService.searchHeritageGrounding(q);
      setGroundingResult(result);
    } catch (err) {
      console.warn('Lỗi tra cứu di sản:', err);
    } finally {
      setIsLoadingGrounding(false);
    }
  };

  // Đồng bộ khi prop evaluation hoặc active costume thay đổi
  useEffect(() => {
    if (isMatchingEvaluation) {
      setCurrentEval(evaluation);
    } else {
      setCurrentEval(null);
    }
  }, [evaluation, activeCostumeId, isMatchingEvaluation]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Bắt đầu đánh giá trực tiếp nếu người dùng vào thẳng từ Dock
  const handleTriggerAIEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const summary = await AIEvaluationService.evaluateOutfit(activeCustomization);
      setCurrentEval(summary);
      if (onSaveEvaluation) {
        onSaveEvaluation(summary);
      }
      showToast(isVi ? `Đã hoàn tất thẩm định di sản cho ${activeCostumeName}!` : `Evaluation completed for ${activeCostumeName}!`);
    } catch (e) {
      console.error('Lỗi khi đánh giá:', e);
      showToast(isVi ? 'Không thể thực hiện thẩm định AI lúc này.' : 'AI evaluation service unavailable.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const isPassed = currentEval?.cultural.isPassed ?? false;

  return (
    <div className="relative min-h-screen flex flex-col justify-between pt-4 sm:pt-16 pb-28 md:pb-12 px-3 sm:px-8 md:pr-14 lg:pr-16 max-w-6xl mx-auto w-full z-10 select-none">
      {/* Toast Notification Popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#1C261A]/95 border border-[#465A3D] text-[#78976A] text-xs font-sans font-semibold shadow-2xl flex items-center gap-3 backdrop-blur-md max-w-[90vw] text-center"
          >
            <CheckCircle2 className="w-4 h-4 text-[#78976A] shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#241A13]/90 border border-[#D4A043]/40 text-[#F3C96B] text-xs font-serif mb-2.5 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4A043]" />
          <span>{t('oracle.badge')}</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl sm:text-4xl font-serif font-bold text-[#F5EFE6] tracking-tight mb-1.5"
        >
          {currentEval ? (isVi ? 'Kết Quả Thẩm Định' : 'Evaluation Results') : (isVi ? 'Kiểm Duyệt Văn Hóa' : 'AI Cultural Guardian')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-xs sm:text-sm text-[#BAA796] font-serif italic"
        >
          {currentEval
            ? (isVi ? `Đánh giá chuẩn mực di sản & hòa sắc thẩm mỹ cho ${activeCostumeName}` : `Authenticity & styling harmony report for ${activeCostumeName}`)
            : (isVi ? `Đang chuẩn bị thẩm định cho bộ trang phục: ${activeCostumeName}` : `Ready to evaluate design specifications for ${activeCostumeName}`)}
        </motion.p>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start mb-6 sm:mb-8">
        {/* Left Column: Outfit Snapshot (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full max-w-[280px] sm:max-w-[340px]">
            <Character2DViewer customization={activeCustomization} />
          </div>

          <div className="mt-3 text-center">
            <h4 className="font-serif font-bold text-base text-[#F5EFE6]">
              {activeCustomization.costumeName}
            </h4>
            <p className="text-xs font-sans text-[#BAA796]">
              {isVi ? 'Bản phối đang chọn' : 'Current active styling'} · {activeCustomization.gender === 'female' ? (isVi ? 'Model Nữ' : 'Feminine') : (isVi ? 'Model Nam' : 'Masculine')}
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Cultural & Aesthetic Score Report (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {currentEval ? (
            /* TRƯỜNG HỢP 1: ĐÃ CÓ KẾT QUẢ THẨM ĐỊNH KHỚP ĐÚNG BỘ ĐANG CHỌN */
            <>
              {/* 1. Cultural Compatibility Card (Tiêu chí A) */}
              <div
                className={`p-4 sm:p-6 rounded-3xl border transition-all ${
                  isPassed
                    ? 'bg-[#1C261A]/90 border-[#465A3D] shadow-lg shadow-[#1C261A]/50'
                    : 'bg-[#2A1814]/90 border-[#872013] shadow-lg shadow-[#2A1814]/50'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                        isPassed
                          ? 'bg-[#293623] border-[#465A3D] text-[#78976A]'
                          : 'bg-[#401812] border-[#872013] text-[#BA3424]'
                      }`}
                    >
                      {isPassed ? <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" /> : <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </div>
                    <div>
                      <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#8E7B6C] block">
                        {isVi ? 'Tiêu chuẩn di sản:' : 'Heritage Standard:'}
                      </span>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#F5EFE6]">
                        {isVi ? 'Kiểm Tra Văn Hóa' : 'Cultural Authenticity'}
                      </h3>
                    </div>
                  </div>

                  {/* Badge & Score */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-sans font-semibold px-3 py-1 rounded-full border ${
                        isPassed
                          ? 'bg-[#293623] text-[#78976A] border-[#465A3D]'
                          : 'bg-[#401812] text-[#BA3424] border-[#872013]'
                      }`}
                    >
                      {currentEval.cultural.badge}
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-serif font-bold text-[#F5EFE6]">
                        {currentEval.cultural.score}
                      </span>
                      <span className="text-xs font-sans text-[#8E7B6C]">/100</span>
                    </div>
                  </div>
                </div>

                {/* Cultural feedback */}
                <p className="text-xs sm:text-sm font-sans text-[#D8CCC0] leading-relaxed mb-4">
                  {currentEval.cultural.feedback}
                </p>

                {/* Preserved Features */}
                {currentEval.cultural.preservedFeatures.length > 0 && (
                  <div className="space-y-1.5 pt-3 border-t border-[#3E2C1E]/60">
                    <span className="text-[11px] font-sans font-semibold uppercase text-[#78976A] block">
                      {isVi ? 'Đặc trưng gốc bảo tồn chuẩn xác:' : 'Authentic features accurately preserved:'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentEval.cultural.preservedFeatures.map((feat, fIdx) => (
                        <div key={`pres-${fIdx}`} className="flex items-center gap-2 text-xs font-sans text-[#BAA796]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#78976A] flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Violations / Infractions if NOT passed */}
                {!isPassed && currentEval.cultural.violations.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#1C120F] border border-[#872013] mt-3">
                    <span className="text-xs font-sans font-bold uppercase text-[#E05243] block mb-1">
                      {isVi ? 'Chi tiết sai lệch cần điều chỉnh:' : 'Inconsistencies to adjust:'}
                    </span>
                    <ul className="text-xs font-sans text-[#E0CCC0] space-y-1 list-disc list-inside">
                      {currentEval.cultural.violations.map((violation, vIdx) => (
                        <li key={`viol-${vIdx}`} className="leading-relaxed">{violation}</li>
                      ))}
                    </ul>
                    {currentEval.cultural.improvementAdvice && (
                      <p className="text-xs font-sans text-[#D4A043] mt-2 italic">
                        💡 {currentEval.cultural.improvementAdvice}
                      </p>
                    )}
                  </div>
                )}

                {/* Google Search Grounding Verification Box */}
                <div className="mt-4 pt-3 border-t border-[#3E2C1E]/60">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (!groundingResult) {
                          fetchHeritageGrounding();
                        } else {
                          setIsGroundingExpanded(!isGroundingExpanded);
                        }
                      }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1A120C] hover:bg-[#2A1D14] border border-[#423023] hover:border-[#D4A043]/50 text-xs text-[#E5B869] font-sans font-medium transition-all cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#78976A]" />
                      <span>
                        {isLoadingGrounding
                          ? (isVi ? 'Đang đối chiếu Google Search...' : 'Searching with Google...')
                          : (isVi ? 'Đối chiếu tư liệu bảo tàng (Google Search Grounding)' : 'Verify with Google Search Grounding')}
                      </span>
                      {isLoadingGrounding && <Loader2 className="w-3 h-3 animate-spin text-[#D4A043]" />}
                    </button>

                    <span className="text-[10px] font-sans text-[#8A7561]">gemini-3.5-flash</span>
                  </div>

                  <AnimatePresence>
                    {isGroundingExpanded && groundingResult && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-4 rounded-2xl bg-[#140D08] border border-[#3E2C1E] space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs text-[#78976A] font-semibold border-b border-[#3E2C1E] pb-2">
                          <span>✓ Đối chiếu điển chế lịch sử & hiện vật bảo tàng:</span>
                        </div>
                        <p className="text-xs text-[#BAA796] font-sans whitespace-pre-line leading-relaxed">
                          {groundingResult.answer}
                        </p>

                        {groundingResult.sources && groundingResult.sources.length > 0 && (
                          <div className="pt-2 border-t border-[#3E2C1E]/60 space-y-1.5">
                            <span className="text-[10px] font-sans font-semibold text-[#8A7561] uppercase block">
                              {isVi ? 'Nguồn trích dẫn uy tín:' : 'Verified citations:'}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {groundingResult.sources.map((src, sIdx) => (
                                <a
                                  key={`oracle-src-${sIdx}`}
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1C140E] hover:bg-[#241A13] border border-[#3E2C1E] text-[11px] text-[#BAA796] hover:text-[#E5B869] transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3 text-[#78976A]" />
                                  <span className="truncate max-w-[200px]">{src.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* 2. Aesthetic & Color Harmony Assessment (Tiêu chí B) */}
              <div className="p-4 sm:p-6 rounded-3xl bg-[#241A13]/90 border border-[#423023] shadow-lg shadow-black/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#1C140E] border border-[#423023] flex items-center justify-center text-[#D4A043]">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#8E7B6C] block">
                        {isVi ? 'Độ hòa hợp thị giác:' : 'Visual Harmony:'}
                      </span>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#F5EFE6]">
                        {isVi ? 'Điểm Phối Đồ & Hòa Sắc' : 'Color Palette & Styling Score'}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Score Gauges */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                  {/* Color Harmony Score */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1C140E]/80 border border-[#3E2C1E] flex flex-col justify-between">
                    <span className="text-xs font-sans text-[#BAA796] mb-1">{isVi ? 'Hòa hợp màu sắc' : 'Color Harmony'}</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-[#D4A043]">
                        {currentEval.aesthetic.colorHarmonyScore}
                      </span>
                      <span className="text-xs font-sans text-[#8E7B6C]">/ 10</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#140D08] mt-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#BA3424] via-[#D4A043] to-[#78976A] rounded-full"
                        style={{ width: `${(currentEval.aesthetic.colorHarmonyScore / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Overall Styling Score */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1C140E]/80 border border-[#3E2C1E] flex flex-col justify-between">
                    <span className="text-xs font-sans text-[#BAA796] mb-1">{isVi ? 'Phối đồ tổng thể' : 'Overall Styling'}</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-[#78976A]">
                        {currentEval.aesthetic.stylingScore}
                      </span>
                      <span className="text-xs font-sans text-[#8E7B6C]">/ 10</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#140D08] mt-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#536B49] to-[#78976A] rounded-full"
                        style={{ width: `${(currentEval.aesthetic.stylingScore / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stylist feedback */}
                <p className="text-xs sm:text-sm font-sans text-[#D8CCC0] leading-relaxed mb-3 italic">
                  "{currentEval.aesthetic.overallComment}"
                </p>

                {/* Actionable suggestions */}
                {currentEval.aesthetic.actionableSuggestions.length > 0 && (
                  <div className="p-3 rounded-xl bg-[#1C140E] border border-[#3E2C1E]">
                    <span className="text-[11px] font-sans font-semibold uppercase text-[#D4A043] block mb-1">
                      {isVi ? 'Đề xuất chỉnh sửa để đẹp hơn:' : 'Styling enhancement tips:'}
                    </span>
                    <ul className="text-xs font-sans text-[#BAA796] space-y-1 list-disc list-inside">
                      {currentEval.aesthetic.actionableSuggestions.map((sug, sIdx) => (
                        <li key={`sug-${sIdx}`}>{sug}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons: Chỉnh sửa lại / Thử đồ ảo */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onModify}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1C140E] hover:bg-[#2A1D14] border border-[#423023] text-xs font-sans font-medium text-[#D8CCC0] hover:text-[#F5EFE6] transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Chỉnh Sửa Lại (Tùy biến)' : 'Edit in Atelier'}</span>
                </button>

                <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
                  {/* Nút Tiếp tục sang Thử đồ ảo (Virtual Try-on) */}
                  <button
                    type="button"
                    onClick={onProceedToTryOn}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#536B49] via-[#465A3D] to-[#36482F] hover:from-[#5C7752] hover:to-[#3E5136] text-[#F5EFE6] text-xs sm:text-sm font-sans font-semibold tracking-wide shadow-md shadow-[#2B3825]/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#F3C96B]" />
                    <span>{t('oracle.btn.proceed_tryon')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* TRƯỜNG HỢP 2: CHƯA THẨM ĐỊNH CHO BỘ NÀY (TRUY CẬP TỪ DOCK HOẶC VỪA ĐỔI BỘ) */
            <div className="p-6 sm:p-10 rounded-3xl bg-[#241A13]/90 border border-[#423023] shadow-xl text-center space-y-4 sm:space-y-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-[#1C140E] border border-[#423023] flex items-center justify-center text-[#D4A043] mx-auto shadow-inner">
                <FileCheck className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#F5EFE6]">
                  {isVi ? `Chưa Thẩm Định Cho ${activeCostumeName}` : `Awaiting Evaluation for ${activeCostumeName}`}
                </h3>
                <p className="text-xs sm:text-sm font-sans text-[#BAA796] leading-relaxed">
                  {isVi
                    ? `Bạn đang chuẩn bị bản phối cho ${activeCostumeName}. Hãy gửi bản thiết kế để AI rà soát chuẩn mực cổ phong, quy tắc phối ngũ hành và điểm thẩm mỹ.`
                    : `Ready to evaluate ${activeCostumeName}. Submit design to verify cultural codes, five-element palette balance, and styling harmony.`}
                </p>
              </div>

              {/* Thông số nhận diện nhanh */}
              <div className="p-4 rounded-2xl bg-[#1C140E]/80 border border-[#3E2C1E] max-w-sm mx-auto text-left space-y-2">
                <div className="text-[11px] font-sans font-semibold text-[#78976A] uppercase tracking-wider">
                  {isVi ? 'Thông số bản phối hiện tại:' : 'Current design specs:'}
                </div>
                <div className="flex items-center justify-between text-xs text-[#D8CCC0] font-sans">
                  <span>{isVi ? 'Trang phục:' : 'Attire:'}</span>
                  <span className="font-semibold text-white">{activeCostumeName}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#D8CCC0] font-sans">
                  <span>{isVi ? 'Họa tiết:' : 'Pattern:'}</span>
                  <span className="text-[#F3C96B]">{activeCustomization.pattern || (isVi ? 'Trơn' : 'Plain')}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#D8CCC0] font-sans">
                  <span>{isVi ? 'Phụ kiện:' : 'Accessories:'}</span>
                  <span>{activeCustomization.accessories.length} {isVi ? 'món' : 'items'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onModify}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1C140E] hover:bg-[#2A1D14] border border-[#423023] text-xs font-sans text-[#BAA796] hover:text-white transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Quay lại Xưởng Tùy Biến' : 'Back to Atelier'}</span>
                </button>

                <button
                  type="button"
                  disabled={isEvaluating}
                  onClick={handleTriggerAIEvaluation}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#BA3424] via-[#A82B1C] to-[#872013] hover:from-[#C73C2A] hover:to-[#962517] text-[#F5EFE6] text-xs sm:text-sm font-sans font-semibold shadow-lg shadow-[#872013]/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isEvaluating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-[#F3C96B]" />
                      <span>{isVi ? 'AI Đang Rà Soát Điển Chế...' : 'AI Evaluating Cultural Codes...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#F3C96B]" />
                      <span>{isVi ? `Bắt Đầu AI Thẩm Định ${activeCostumeName}` : `Start AI Review for ${activeCostumeName}`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
