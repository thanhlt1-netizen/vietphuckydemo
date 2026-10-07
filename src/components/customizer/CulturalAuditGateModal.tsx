import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  X,
  ArrowRight,
  RotateCcw,
  Palette,
  Layers,
  Shirt,
  Info,
  Check,
  Camera,
  MapPin,
  BookmarkCheck,
  Share2,
  FileCheck,
  Star,
  MessageSquare,
  Scissors
} from 'lucide-react';
import { OutfitCustomization, AIEvaluationSummary } from '../../types/customization';
import { AIEvaluationService } from '../../services/aiEvaluationService';
import { useLanguage } from '../../contexts/LanguageContext';

export type AuditActionType = 'tryon' | 'tailor' | 'lookbook' | 'forum' | 'anime';

interface CulturalAuditGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  customization: OutfitCustomization;
  onActionSelect: (action: AuditActionType, auditResult: AIEvaluationSummary) => void;
  onResetToDefaultColors?: () => void;
}

export const CulturalAuditGateModal: React.FC<CulturalAuditGateModalProps> = ({
  isOpen,
  onClose,
  customization,
  onActionSelect,
  onResetToDefaultColors,
}) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [evaluation, setEvaluation] = useState<AIEvaluationSummary | null>(null);

  // Kích hoạt thẩm định mỗi khi modal mở ra
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);

    const performAudit = async () => {
      try {
        const result = await AIEvaluationService.evaluateOutfit(customization);
        if (isMounted) {
          setEvaluation(result);
          try {
            localStorage.setItem('vietphuc_latest_ai_evaluation', JSON.stringify(result));
          } catch {}
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Lỗi thẩm định văn hóa:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    performAudit();

    return () => {
      isMounted = false;
    };
  }, [isOpen, customization]);

  if (!isOpen) return null;

  const score = evaluation?.cultural.score ?? 88;
  const isHighHeritage = score >= 88;
  const isModerateHeritage = score >= 75 && score < 88;
  const isWarning = score < 75;

  const handleTriggerAction = (action: AuditActionType) => {
    if (evaluation) {
      onActionSelect(action, evaluation);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#251A13] via-[#1E140E] to-[#150E09] border border-[#5A402D] rounded-3xl shadow-2xl shadow-black/80 overflow-hidden my-auto"
        >
          {/* Imperial Top Ribbon Bar */}
          <div className="relative px-5 py-4 sm:px-6 sm:py-5 border-b border-[#3E2C1E] bg-[#1C140E]/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#BA3424] to-[#872013] text-[#F5EFE6] shadow-md ring-1 ring-[#D4A043]/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#F5EFE6] tracking-wide">
                    {isVi ? 'Kết Quả Kiểm Duyệt Văn Hóa AI' : 'AI Cultural Audit Result'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#3E2C1E] text-[#D4A043] border border-[#5A402D]">
                    {customization.costumeName}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs font-sans text-[#BAA796]">
                  {isVi
                    ? 'Thẩm định hoàn tất – bạn có thể đăng bài, lưu lookbook hoặc đặt may ngay bên dưới'
                    : 'Audit completed – you can post to forum, save to lookbook or order tailor directly below'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-[#BAA796] hover:text-[#F5EFE6] hover:bg-[#3E2C1E] transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body Content */}
          <div className="p-4 sm:p-6 max-h-[72vh] overflow-y-auto space-y-4">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-[#D4A043]/20 border-t-[#D4A043] animate-spin" />
                  <Sparkles className="w-7 h-7 text-[#D4A043] animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-serif font-bold text-[#F5EFE6]">
                    {isVi ? 'Cố Vấn Di Sản Đang Thẩm Định...' : 'Heritage Guardian Is Auditing...'}
                  </h4>
                  <p className="text-xs font-sans text-[#BAA796] mt-1 max-w-sm">
                    {isVi
                      ? 'Đối chiếu kiểu may, sắc màu ngũ hành, điển chế cổ phục và tính hài hòa của phụ kiện Gen Z...'
                      : 'Verifying historical cuts, five-elements color balance, and Gen Z styling harmony...'}
                  </p>
                </div>
              </div>
            ) : evaluation ? (
              <>
                {/* Cultural Evaluation Result Banner */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                    isHighHeritage
                      ? 'bg-gradient-to-r from-[#202E1B]/90 via-[#273820]/90 to-[#182314]/90 border-[#5A754E] text-[#8FB57F]'
                      : isModerateHeritage
                      ? 'bg-gradient-to-r from-[#332516]/90 via-[#3D2C1B]/90 to-[#261B10]/90 border-[#8A6730] text-[#D4A043]'
                      : 'bg-gradient-to-r from-[#381815]/90 via-[#421E1A]/90 to-[#2A1210]/90 border-[#873127] text-[#E06A5D]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 text-center sm:text-left">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#150E09]/80 border border-current text-2xl shrink-0 shadow-lg">
                      {isHighHeritage ? '📜' : isModerateHeritage ? '✨' : '⚠️'}
                    </div>
                    <div>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-xs font-sans font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#150E09]/60 border border-current">
                          {isHighHeritage
                            ? isVi
                              ? 'Chuẩn Cổ Phục Hoàng Cung'
                              : 'Authentic Imperial Standard'
                            : isModerateHeritage
                            ? isVi
                              ? 'Cách Tân Nhã Nhặn Gen Z'
                              : 'Elegant Modernized Fusion'
                            : isVi
                            ? 'Cần Chỉnh Sửa Lệch Chuẩn'
                            : 'Heritage Discrepancy Alert'}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-serif font-bold text-[#FFF8EE] mt-1">
                        {evaluation.cultural.badge}
                      </h4>
                      <p className="text-xs font-sans text-[#E0D4C5] mt-0.5 opacity-90 line-clamp-2">
                        {evaluation.cultural.feedback}
                      </p>
                    </div>
                  </div>

                  {/* Heritage Score Pill */}
                  <div className="flex flex-col items-center justify-center px-4 py-2.5 rounded-2xl bg-[#150E09]/90 border border-current shrink-0 min-w-[100px] shadow-md">
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#BAA796]">
                      {isVi ? 'Điểm Văn Hóa' : 'Heritage Score'}
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#FFF8EE]">
                      {score}
                      <span className="text-xs font-normal text-[#BAA796]">/100</span>
                    </span>
                  </div>
                </div>

                {/* DIRECT ACTION HUB (BẢNG THAO TÁC TRỰC TIẾP NGAY SAU KHI DUYỆT) */}
                <div className="p-4 rounded-2xl bg-[#17100B] border border-[#5A402D] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-[#F3C96B] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isVi ? 'Thực Hiện Tác Vụ Ngay Với Thiết Kế Này:' : 'Perform Actions Directly With This Design:'}</span>
                    </h4>
                    <span className="text-[10px] font-sans text-[#BAA796] italic">
                      {isVi ? 'Bấm để chuyển ngay' : 'Click to proceed'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Action 1: Đặt May Nghệ Nhân */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTriggerAction('tailor')}
                      className="p-3 rounded-xl bg-gradient-to-r from-[#2F2116] to-[#20150E] hover:from-[#3D2C1E] hover:to-[#2A1D14] border border-[#78976A]/60 text-left flex items-center gap-3 transition-all cursor-pointer group shadow-md"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#465A3D]/40 border border-[#78976A] flex items-center justify-center text-[#8FB57F] group-hover:scale-105 transition-transform shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="text-xs font-sans font-bold text-[#F5EFE6] group-hover:text-white truncate">
                          {isVi ? 'Đặt May Nghệ Nhân' : 'Custom Tailor Order'}
                        </h5>
                        <p className="text-[10px] font-sans text-[#BAA796] truncate">
                          {isVi ? 'Gửi thông số cho nhà may cổ phục uy tín' : 'Send specs to artisan tailoring houses'}
                        </p>
                      </div>
                    </motion.button>

                    {/* Action 2: Đăng Lên Diễn Đàn */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTriggerAction('forum')}
                      className="p-3 rounded-xl bg-gradient-to-r from-[#2F2116] to-[#20150E] hover:from-[#3D2C1E] hover:to-[#2A1D14] border border-[#D4A043]/60 text-left flex items-center gap-3 transition-all cursor-pointer group shadow-md"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#D4A043]/20 border border-[#D4A043] flex items-center justify-center text-[#D4A043] group-hover:scale-105 transition-transform shrink-0">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="text-xs font-sans font-bold text-[#F5EFE6] group-hover:text-white truncate">
                          {isVi ? 'Đăng Lên Diễn Đàn' : 'Post to Community'}
                        </h5>
                        <p className="text-[10px] font-sans text-[#BAA796] truncate">
                          {isVi ? 'Chia sẻ và giao lưu cùng cộng đồng Gen Z' : 'Share styling looks with Gen Z scholars'}
                        </p>
                      </div>
                    </motion.button>

                    {/* Action 3: Lưu Vào Lookbook */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTriggerAction('lookbook')}
                      className="p-3 rounded-xl bg-gradient-to-r from-[#2F2116] to-[#20150E] hover:from-[#3D2C1E] hover:to-[#2A1D14] border border-[#BA3424]/60 text-left flex items-center gap-3 transition-all cursor-pointer group shadow-md"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#BA3424]/20 border border-[#BA3424] flex items-center justify-center text-[#E06A5D] group-hover:scale-105 transition-transform shrink-0">
                        <BookmarkCheck className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="text-xs font-sans font-bold text-[#F5EFE6] group-hover:text-white truncate">
                          {isVi ? 'Lưu Vào Lookbook' : 'Save to Lookbook'}
                        </h5>
                        <p className="text-[10px] font-sans text-[#BAA796] truncate">
                          {isVi ? 'Lưu trữ vào album bộ sưu tập cá nhân' : 'Archive to personal lookbook album'}
                        </p>
                      </div>
                    </motion.button>

                    {/* Action 4: Thử Đồ Ảo AI */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTriggerAction('tryon')}
                      className="p-3 rounded-xl bg-gradient-to-r from-[#2F2116] to-[#20150E] hover:from-[#3D2C1E] hover:to-[#2A1D14] border border-[#4A7F9D]/60 text-left flex items-center gap-3 transition-all cursor-pointer group shadow-md"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#4A7F9D]/20 border border-[#4A7F9D] flex items-center justify-center text-[#72A6C4] group-hover:scale-105 transition-transform shrink-0">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="text-xs font-sans font-bold text-[#F5EFE6] group-hover:text-white truncate">
                          {isVi ? 'Thử Đồ Ảo AI' : 'Virtual Try-On'}
                        </h5>
                        <p className="text-[10px] font-sans text-[#BAA796] truncate">
                          {isVi ? 'Ướm trang phục đã duyệt lên chân dung thực' : 'Fit costume onto your portrait'}
                        </p>
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Detailed 4 Cultural Pillars Audit Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Pillar 1: Kiểu dáng & Cắt may */}
                  <div className="p-3.5 rounded-2xl bg-[#1C140E]/80 border border-[#3E2C1E]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Shirt className="w-4 h-4 text-[#78976A]" />
                      <h5 className="text-xs font-sans font-bold text-[#F5EFE6]">
                        {isVi ? 'Kiểu Dáng & Điển Chế' : 'Robe Cut & Silhouette'}
                      </h5>
                    </div>
                    <p className="text-[11px] font-sans text-[#BAA796] leading-relaxed">
                      {evaluation.cultural.preservedFeatures.length > 0
                        ? evaluation.cultural.preservedFeatures.join('. ')
                        : `Thiết kế giữ vững dáng áo đặc trưng của ${customization.costumeName}.`}
                    </p>
                  </div>

                  {/* Pillar 2: Màu sắc & Ngũ Hành */}
                  <div className="p-3.5 rounded-2xl bg-[#1C140E]/80 border border-[#3E2C1E]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Palette className="w-4 h-4 text-[#D4A043]" />
                      <h5 className="text-xs font-sans font-bold text-[#F5EFE6]">
                        {isVi ? 'Ngũ Hành & Bảng Màu' : 'Five Elements & Palette'}
                      </h5>
                    </div>
                    <p className="text-[11px] font-sans text-[#BAA796] leading-relaxed">
                      {evaluation.aesthetic.overallComment}
                    </p>
                  </div>

                  {/* Pillar 3: Hoa văn & Chất liệu */}
                  <div className="p-3.5 rounded-2xl bg-[#1C140E]/80 border border-[#3E2C1E]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Layers className="w-4 h-4 text-[#4A7F9D]" />
                      <h5 className="text-xs font-sans font-bold text-[#F5EFE6]">
                        {isVi ? 'Hoa Văn & Chất Liệu' : 'Textile & Motif'}
                      </h5>
                    </div>
                    <p className="text-[11px] font-sans text-[#BAA796] leading-relaxed">
                      {customization.customPatternName
                        ? `Họa tiết Canvas: "${customization.customPatternName}". Phù hợp tinh thần cổ phong.`
                        : `Dệt gấm & hoa văn chuẩn nét ${customization.costumeName}.`}
                    </p>
                  </div>

                  {/* Pillar 4: Phụ kiện Gen Z */}
                  <div className="p-3.5 rounded-2xl bg-[#1C140E]/80 border border-[#3E2C1E]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="w-4 h-4 text-[#C46D7D]" />
                      <h5 className="text-xs font-sans font-bold text-[#F5EFE6]">
                        {isVi ? 'Phụ Kiện Đi Kèm' : 'Accessories & Modern Accents'}
                      </h5>
                    </div>
                    <p className="text-[11px] font-sans text-[#BAA796] leading-relaxed">
                      {customization.accessories.length > 0
                        ? `Đã phối ${customization.accessories.length} phụ kiện (Điểm phối đồ: ${evaluation.aesthetic.stylingScore}/10).`
                        : 'Phong cách tối giản thuần khiết, tập trung trọn vẹn vào phom dáng cổ phục.'}
                    </p>
                  </div>
                </div>

                {/* Cultural Advisor Commentary */}
                <div className="p-4 rounded-2xl bg-[#17100B] border border-[#5A402D]/60 relative">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">💡</span>
                    <h5 className="text-xs font-sans font-bold text-[#D4A043] uppercase tracking-wide">
                      {isVi ? 'Lời Khuyên Từ Cố Vấn Văn Hóa Di Sản' : 'Cultural Guardian Guidance'}
                    </h5>
                  </div>
                  <p className="text-xs font-sans text-[#D8CCC0] leading-relaxed italic">
                    "{evaluation.cultural.improvementAdvice || evaluation.cultural.feedback}"
                  </p>

                  {evaluation.aesthetic.actionableSuggestions && evaluation.aesthetic.actionableSuggestions.length > 0 && (
                    <div className="mt-2.5 pt-2.5 border-t border-[#3E2C1E] flex flex-wrap gap-2">
                      {evaluation.aesthetic.actionableSuggestions.map((sug: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-sans bg-[#241A13] text-[#78976A] border border-[#423023]"
                        >
                          ✓ {sug}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 border-t border-[#3E2C1E] bg-[#1C140E]/90 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#241A13] hover:bg-[#322319] border border-[#423023] text-xs font-sans text-[#BAA796] hover:text-[#F5EFE6] transition-all cursor-pointer"
            >
              <span>{isVi ? '← Quay Lại Tùy Chỉnh Thêm' : '← Back to Atelier'}</span>
            </button>

            {isWarning && onResetToDefaultColors && (
              <button
                type="button"
                onClick={() => {
                  onResetToDefaultColors();
                  onClose();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#381815] hover:bg-[#4E211D] border border-[#873127] text-xs font-sans text-[#F5C2BC] transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isVi ? 'Khôi Phục Màu Gốc' : 'Restore Authentic'}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
