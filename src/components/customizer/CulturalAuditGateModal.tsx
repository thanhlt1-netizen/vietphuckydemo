import React, { useState, useEffect, useCallback } from 'react';
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
  Check,
  Camera,
  MapPin,
  BookmarkCheck,
  Share2,
  MessageSquare,
  Scissors,
  ExternalLink
} from 'lucide-react';
import { OutfitCustomization, AIEvaluationSummary } from '../../types/customization';
import { AIEvaluationService } from '../../services/aiEvaluationService';
import { LookbookService, getCostumeImage } from '../../services/lookbookService';
import { CommunityForumService } from '../../services/communityForumService';
import { useLanguage } from '../../contexts/LanguageContext';

export type AuditActionType = 'tryon' | 'tailor' | 'lookbook' | 'forum';

interface CulturalAuditGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  customization: OutfitCustomization;
  onActionSelect: (action: AuditActionType, auditResult: AIEvaluationSummary) => void;
  onResetToDefaultColors?: () => void;
  onNavigateToScene?: (scene: 'tryon' | 'tailor' | 'lookbook' | 'forum') => void;
}

// Hàm kích hoạt phản hồi rung xúc giác (Haptic Feedback)
const triggerHapticFeedback = (pattern: number[] = [15, 30, 20]) => {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Ignore environments without vibration support
  }
};

export const CulturalAuditGateModal: React.FC<CulturalAuditGateModalProps> = ({
  isOpen,
  onClose,
  customization,
  onActionSelect,
  onResetToDefaultColors,
  onNavigateToScene,
}) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [evaluation, setEvaluation] = useState<AIEvaluationSummary | null>(null);

  // Trạng thái thực hiện từng tác vụ trong trung tâm tác vụ (Action Hub)
  const [actionStatuses, setActionStatuses] = useState<{
    tailor: { done: boolean; message: string };
    tryon: { done: boolean; message: string };
    forum: { done: boolean; message: string };
    lookbook: { done: boolean; message: string };
  }>({
    tailor: { done: false, message: '' },
    tryon: { done: false, message: '' },
    forum: { done: false, message: '' },
    lookbook: { done: false, message: '' },
  });

  const [lastActionToast, setLastActionToast] = useState<string | null>(null);

  // Lắng nghe phím ESC để đóng modal theo đúng yêu cầu người dùng
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

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
          triggerHapticFeedback([30, 50]);
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

  // Tự động ẩn toast thông báo sau 3.5s
  useEffect(() => {
    if (!lastActionToast) return;
    const timer = setTimeout(() => {
      setLastActionToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [lastActionToast]);

  const score = evaluation?.cultural.score ?? 88;
  const isHighHeritage = score >= 88;
  const isModerateHeritage = score >= 75 && score < 88;
  const isWarning = score < 75;

  // Xử lý thực hiện tác vụ ĐẶT MAY NGHỆ NHÂN (giữ nguyên modal)
  const handleActionTailor = useCallback(() => {
    if (!evaluation) return;
    triggerHapticFeedback([25, 45, 25]);

    try {
      localStorage.setItem('vietphuc_current_customization', JSON.stringify(customization));
      localStorage.setItem(
        'vietphuc_tailor_order_draft',
        JSON.stringify({
          costumeName: customization.costumeName,
          costumeId: customization.costumeId,
          customization,
          evaluationScore: score,
          badge: evaluation.cultural.badge,
          createdAt: new Date().toISOString(),
        })
      );
    } catch {}

    setActionStatuses((prev) => ({
      ...prev,
      tailor: {
        done: true,
        message: isVi ? 'Đã tạo hồ sơ may đo & lưu thông số' : 'Tailor dossier created & saved',
      },
    }));

    setLastActionToast(
      isVi
        ? '✓ Đã lưu hồ sơ may đo thủ công! Trung tâm tác vụ vẫn sẵn sàng cho các thao tác tiếp theo.'
        : '✓ Artisan tailor dossier saved! Direct Action Hub remains active.'
    );

    onActionSelect('tailor', evaluation);
  }, [evaluation, customization, score, isVi, onActionSelect]);

  // Xử lý thực hiện tác vụ THỬ ĐỒ ẢO AI (giữ nguyên modal)
  const handleActionTryOn = useCallback(() => {
    if (!evaluation) return;
    triggerHapticFeedback([25, 45, 25]);

    try {
      localStorage.setItem('vietphuc_current_customization', JSON.stringify(customization));
      localStorage.setItem('vietphuc_tryon_target_outfit', JSON.stringify(customization));
    } catch {}

    setActionStatuses((prev) => ({
      ...prev,
      tryon: {
        done: true,
        message: isVi ? 'Đã nạp trang phục vào buồng thử đồ' : 'Outfit loaded to dressing room',
      },
    }));

    setLastActionToast(
      isVi
        ? '✓ Đã đồng bộ trang phục vào Buồng Thử Đồ Ảo AI! Bạn có thể tiếp tục thao tác hoặc chuyển trang.'
        : '✓ Outfit synced to AI Try-On! You can continue actions or navigate.'
    );

    onActionSelect('tryon', evaluation);
  }, [evaluation, customization, isVi, onActionSelect]);

  // Xử lý thực hiện tác vụ ĐĂNG LÊN DIỄN ĐÀN (giữ nguyên modal)
  const handleActionForum = useCallback(() => {
    if (!evaluation) return;
    triggerHapticFeedback([25, 45, 25]);

    try {
      const authorTags = [
        `#${customization.costumeName.replace(/\s+/g, '')}`,
        '#VietPhucGenZ',
        '#CoPhucVietNam',
        evaluation.cultural.badge ? `#${evaluation.cultural.badge.replace(/\s+/g, '')}` : '#DiSan',
      ];

      CommunityForumService.publishPost(
        `${customization.costumeName} - ${evaluation.cultural.badge || 'Phong Cách Cổ Phong'}`,
        `Bản phối ${customization.costumeName} vừa hoàn tất kiểm duyệt văn hóa AI (${score}/100đ). Cùng chia sẻ cảm nghĩ và góp ý nhé!`,
        customization,
        authorTags
      );
    } catch (e) {
      console.warn('Lỗi đăng bài diễn đàn:', e);
    }

    setActionStatuses((prev) => ({
      ...prev,
      forum: {
        done: true,
        message: isVi ? 'Đã đăng bài lên Diễn Đàn Gen Z' : 'Published to Gen Z Forum',
      },
    }));

    setLastActionToast(
      isVi
        ? '✓ Đã đăng tải tác phẩm lên Diễn đàn cộng đồng Gen Z thành công!'
        : '✓ Outfit published to Gen Z Community Forum successfully!'
    );

    onActionSelect('forum', evaluation);
  }, [evaluation, customization, score, isVi, onActionSelect]);

  // Xử lý thực hiện tác vụ LƯU VÀO LOOKBOOK (giữ nguyên modal)
  const handleActionLookbook = useCallback(() => {
    if (!evaluation) return;
    triggerHapticFeedback([25, 45, 25]);

    try {
      const albums = LookbookService.getAlbums();
      const targetAlbumId = albums[0]?.id || 'album_genz_vibes';
      const imgSrc = getCostumeImage(customization.costumeId);

      LookbookService.saveItemToAlbum(targetAlbumId, {
        type: 'design',
        customName: `${customization.costumeName} - Bản Phối ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
        costumeName: customization.costumeName,
        costumeId: customization.costumeId,
        imageUrl: imgSrc,
        customizationData: customization,
        note: `Đạt kiểm duyệt văn hóa: ${score}/100đ · ${evaluation.cultural.badge || 'Chuẩn di sản'}.`,
      });
    } catch (e) {
      console.warn('Lỗi lưu vào Lookbook:', e);
    }

    setActionStatuses((prev) => ({
      ...prev,
      lookbook: {
        done: true,
        message: isVi ? 'Đã lưu vào album Lookbook' : 'Archived in Lookbook Album',
      },
    }));

    setLastActionToast(
      isVi
        ? '✓ Đã lưu tác phẩm vào Lookbook cá nhân thành công!'
        : '✓ Saved to personal Lookbook album successfully!'
    );

    onActionSelect('lookbook', evaluation);
  }, [evaluation, customization, score, isVi, onActionSelect]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        onClick={(e) => {
          // Bấm ra ngoài vùng nền (backdrop) để tắt modal
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#251A13] via-[#1E140E] to-[#150E09] border border-[#6B4D36] rounded-3xl shadow-2xl shadow-black/90 overflow-hidden my-auto select-none"
        >
          {/* Top Banner Ribbon */}
          <div className="relative px-5 py-4 sm:px-6 sm:py-5 border-b border-[#3E2C1E] bg-[#1C140E]/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#BA3424] to-[#872013] text-[#F5EFE6] shadow-lg ring-1 ring-[#D4A043]/40 shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#F5EFE6] tracking-wide">
                    {isVi ? 'Thẩm Định Di Sản & Tác Vụ Trực Tiếp' : 'Heritage Audit & Direct Action Hub'}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#3E2C1E] text-[#D4A043] border border-[#5A402D]">
                    {customization.costumeName}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs font-sans text-[#BAA796] mt-0.5">
                  {isVi
                    ? 'Thực hiện 4 tác vụ bên dưới tùy ý. Bấm ESC, nút [X] hoặc nhấp ra ngoài để đóng.'
                    : 'Execute 4 actions below freely. Press ESC, [X] or click outside to close.'}
                </p>
              </div>
            </div>

            {/* Nút X to rõ ràng để tắt modal */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-[#BAA796] hover:text-[#F5EFE6] hover:bg-[#3E2C1E] active:scale-90 transition-all cursor-pointer ring-1 ring-[#5A402D]/40"
              title={isVi ? 'Đóng (ESC)' : 'Close (ESC)'}
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toast thông báo nhanh bên trong modal */}
          <AnimatePresence>
            {lastActionToast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-4 mt-3 px-4 py-2 rounded-xl bg-[#202E1B] border border-[#5A754E] text-[#8FB57F] text-xs font-sans font-semibold flex items-center justify-between shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8FB57F] shrink-0" />
                  <span>{lastActionToast}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLastActionToast(null)}
                  className="text-[#8FB57F] hover:text-white ml-2 text-xs"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Body Content */}
          <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4 custom-scrollbar">
            {isLoading ? (
              <div className="py-14 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-3 border-[#D4A043]/20 border-t-[#D4A043] animate-spin" />
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
                {/* Heritage Evaluation Result Banner */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                    isHighHeritage
                      ? 'bg-gradient-to-r from-[#202E1B]/95 via-[#273820]/95 to-[#182314]/95 border-[#5A754E] text-[#8FB57F]'
                      : isModerateHeritage
                      ? 'bg-gradient-to-r from-[#332516]/95 via-[#3D2C1B]/95 to-[#261B10]/95 border-[#8A6730] text-[#D4A043]'
                      : 'bg-gradient-to-r from-[#381815]/95 via-[#421E1A]/95 to-[#2A1210]/95 border-[#873127] text-[#E06A5D]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 text-center sm:text-left">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#150E09]/80 border border-current text-2xl shrink-0 shadow-lg">
                      {isHighHeritage ? '📜' : isModerateHeritage ? '✨' : '⚠️'}
                    </div>
                    <div>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-[11px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#150E09]/70 border border-current">
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
                  <div className="flex flex-col items-center justify-center px-4 py-2.5 rounded-2xl bg-[#150E09]/90 border border-current shrink-0 min-w-[105px] shadow-md">
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#BAA796]">
                      {isVi ? 'Điểm Di Sản' : 'Heritage Score'}
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#FFF8EE]">
                      {score}
                      <span className="text-xs font-normal text-[#BAA796]">/100</span>
                    </span>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* TRUNG TÂM TÁC VỤ TRỰC TIẾP (DIRECT ACTION HUB - 4 NÚT LỰA CHỌN TO & PHẢN HỒI XÚC GIÁC) */}
                {/* ========================================================================= */}
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#1C140E] to-[#140E0A] border-2 border-[#D4A043]/50 space-y-3.5 shadow-xl ring-1 ring-[#D4A043]/20">
                  <div className="flex items-center justify-between border-b border-[#3E2C1E] pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#D4A043] animate-ping" />
                      <h4 className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wider text-[#F3C96B] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#D4A043]" />
                        <span>{isVi ? 'Trung Tâm Tác Vụ Trực Tiếp' : 'Direct Action Hub'}</span>
                      </h4>
                    </div>
                    <span className="text-[10px] font-sans text-[#BAA796] italic bg-[#241A13] px-2.5 py-0.5 rounded-full border border-[#423023]">
                      {isVi ? 'Thao tác liên tục không tắt modal' : 'Active continuous hub'}
                    </span>
                  </div>

                  {/* 4 Nút Tác Vụ To, Rõ Ràng, Phản Hồi Xúc Giác & Đổi Trạng Thái Ngay Trên Nút */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* NÚT 1: ĐẶT MAY NGHỆ NHÂN */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.025, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleActionTailor}
                      className={`p-3.5 sm:p-4 rounded-2xl text-left flex items-center gap-3.5 transition-all cursor-pointer group shadow-lg border relative overflow-hidden ${
                        actionStatuses.tailor.done
                          ? 'bg-gradient-to-r from-[#23351E] to-[#182614] border-[#78976A] ring-1 ring-[#78976A]/50'
                          : 'bg-gradient-to-r from-[#2F2116] to-[#20150E] hover:from-[#3D2C1E] hover:to-[#2A1D14] border-[#78976A]/60 hover:border-[#78976A]'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center text-lg shrink-0 transition-all ${
                          actionStatuses.tailor.done
                            ? 'bg-[#78976A] border-[#9FC48F] text-white shadow-md'
                            : 'bg-[#465A3D]/40 border-[#78976A] text-[#8FB57F] group-hover:scale-110'
                        }`}
                      >
                        {actionStatuses.tailor.done ? <Check className="w-6 h-6 stroke-[3]" /> : <Scissors className="w-5 h-5" />}
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-xs sm:text-sm font-sans font-bold text-[#F5EFE6] group-hover:text-white truncate">
                            {isVi ? '1. Đặt May Nghệ Nhân' : '1. Artisan Tailoring'}
                          </h5>
                          {actionStatuses.tailor.done && (
                            <span className="text-[9px] font-sans font-bold px-1.5 py-0.5 rounded bg-[#78976A]/30 text-[#A6D495] border border-[#78976A]">
                              ✓ {isVi ? 'Đã tạo' : 'Ready'}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-[11px] font-sans text-[#BAA796] mt-0.5 truncate">
                          {actionStatuses.tailor.done
                            ? actionStatuses.tailor.message
                            : isVi
                            ? 'Gửi thông số cho nhà may cổ phục'
                            : 'Export specs to artisan houses'}
                        </p>
                      </div>

                      {actionStatuses.tailor.done && onNavigateToScene && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToScene('tailor');
                            onClose();
                          }}
                          className="p-1 rounded-lg bg-[#3E5234] hover:bg-[#526D45] text-white text-[10px] flex items-center gap-0.5 cursor-pointer shrink-0"
                          title={isVi ? 'Mở trang nhà may' : 'Open Tailor Map'}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </motion.button>

                    {/* NÚT 2: THỬ ĐỒ ẢO AI */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.025, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleActionTryOn}
                      className={`p-3.5 sm:p-4 rounded-2xl text-left flex items-center gap-3.5 transition-all cursor-pointer group shadow-lg border relative overflow-hidden ${
                        actionStatuses.tryon.done
                          ? 'bg-gradient-to-r from-[#1E2C38] to-[#131F2A] border-[#5A87A6] ring-1 ring-[#5A87A6]/50'
                          : 'bg-gradient-to-r from-[#2F2116] to-[#20150E] hover:from-[#3D2C1E] hover:to-[#2A1D14] border-[#4A7F9D]/60 hover:border-[#5A87A6]'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center text-lg shrink-0 transition-all ${
                          actionStatuses.tryon.done
                            ? 'bg-[#4A7F9D] border-[#72A6C4] text-white shadow-md'
                            : 'bg-[#4A7F9D]/30 border-[#4A7F9D] text-[#72A6C4] group-hover:scale-110'
                        }`}
                      >
                        {actionStatuses.tryon.done ? <Check className="w-6 h-6 stroke-[3]" /> : <Camera className="w-5 h-5" />}
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-xs sm:text-sm font-sans font-bold text-[#F5EFE6] group-hover:text-white truncate">
                            {isVi ? '2. Thử Đồ Ảo AI' : '2. Virtual Try-On'}
                          </h5>
                          {actionStatuses.tryon.done && (
                            <span className="text-[9px] font-sans font-bold px-1.5 py-0.5 rounded bg-[#4A7F9D]/30 text-[#92C7E5] border border-[#4A7F9D]">
                              ✓ {isVi ? 'Đã nạp' : 'Synced'}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-[11px] font-sans text-[#BAA796] mt-0.5 truncate">
                          {actionStatuses.tryon.done
                            ? actionStatuses.tryon.message
                            : isVi
                            ? 'Ướm trang phục đã duyệt lên chân dung'
                            : 'Fit outfit onto your portrait'}
                        </p>
                      </div>

                      {actionStatuses.tryon.done && onNavigateToScene && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToScene('tryon');
                            onClose();
                          }}
                          className="p-1 rounded-lg bg-[#304B5E] hover:bg-[#436780] text-white text-[10px] flex items-center gap-0.5 cursor-pointer shrink-0"
                          title={isVi ? 'Mở phòng thử đồ' : 'Open Try-On'}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </motion.button>

                    {/* NÚT 3: ĐĂNG LÊN DIỄN ĐÀN */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.025, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleActionForum}
                      className={`p-3.5 sm:p-4 rounded-2xl text-left flex items-center gap-3.5 transition-all cursor-pointer group shadow-lg border relative overflow-hidden ${
                        actionStatuses.forum.done
                          ? 'bg-gradient-to-r from-[#3D2D15] to-[#2B1D0C] border-[#D4A043] ring-1 ring-[#D4A043]/50'
                          : 'bg-gradient-to-r from-[#2F2116] to-[#20150E] hover:from-[#3D2C1E] hover:to-[#2A1D14] border-[#D4A043]/60 hover:border-[#D4A043]'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center text-lg shrink-0 transition-all ${
                          actionStatuses.forum.done
                            ? 'bg-[#D4A043] border-[#F3C96B] text-[#1E140E] shadow-md font-bold'
                            : 'bg-[#D4A043]/25 border-[#D4A043] text-[#F3C96B] group-hover:scale-110'
                        }`}
                      >
                        {actionStatuses.forum.done ? <Check className="w-6 h-6 stroke-[3]" /> : <MessageSquare className="w-5 h-5" />}
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-xs sm:text-sm font-sans font-bold text-[#F5EFE6] group-hover:text-white truncate">
                            {isVi ? '3. Đăng Lên Diễn Đàn' : '3. Post to Forum'}
                          </h5>
                          {actionStatuses.forum.done && (
                            <span className="text-[9px] font-sans font-bold px-1.5 py-0.5 rounded bg-[#D4A043]/30 text-[#F3C96B] border border-[#D4A043]">
                              ✓ {isVi ? 'Đã đăng' : 'Posted'}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-[11px] font-sans text-[#BAA796] mt-0.5 truncate">
                          {actionStatuses.forum.done
                            ? actionStatuses.forum.message
                            : isVi
                            ? 'Chia sẻ bản phối cùng cộng đồng Gen Z'
                            : 'Share styling looks with scholars'}
                        </p>
                      </div>

                      {actionStatuses.forum.done && onNavigateToScene && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToScene('forum');
                            onClose();
                          }}
                          className="p-1 rounded-lg bg-[#59421A] hover:bg-[#735522] text-white text-[10px] flex items-center gap-0.5 cursor-pointer shrink-0"
                          title={isVi ? 'Mở diễn đàn' : 'Open Forum'}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </motion.button>

                    {/* NÚT 4: LƯU VÀO LOOKBOOK */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.025, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleActionLookbook}
                      className={`p-3.5 sm:p-4 rounded-2xl text-left flex items-center gap-3.5 transition-all cursor-pointer group shadow-lg border relative overflow-hidden ${
                        actionStatuses.lookbook.done
                          ? 'bg-gradient-to-r from-[#3B1C19] to-[#2A1210] border-[#BA3424] ring-1 ring-[#BA3424]/50'
                          : 'bg-gradient-to-r from-[#2F2116] to-[#20150E] hover:from-[#3D2C1E] hover:to-[#2A1D14] border-[#BA3424]/60 hover:border-[#BA3424]'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center text-lg shrink-0 transition-all ${
                          actionStatuses.lookbook.done
                            ? 'bg-[#BA3424] border-[#E06A5D] text-white shadow-md'
                            : 'bg-[#BA3424]/25 border-[#BA3424] text-[#E06A5D] group-hover:scale-110'
                        }`}
                      >
                        {actionStatuses.lookbook.done ? <Check className="w-6 h-6 stroke-[3]" /> : <BookmarkCheck className="w-5 h-5" />}
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-xs sm:text-sm font-sans font-bold text-[#F5EFE6] group-hover:text-white truncate">
                            {isVi ? '4. Lưu Vào Lookbook' : '4. Save to Lookbook'}
                          </h5>
                          {actionStatuses.lookbook.done && (
                            <span className="text-[9px] font-sans font-bold px-1.5 py-0.5 rounded bg-[#BA3424]/30 text-[#F5A196] border border-[#BA3424]">
                              ✓ {isVi ? 'Đã lưu' : 'Saved'}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-[11px] font-sans text-[#BAA796] mt-0.5 truncate">
                          {actionStatuses.lookbook.done
                            ? actionStatuses.lookbook.message
                            : isVi
                            ? 'Lưu vào album bộ sưu tập cá nhân'
                            : 'Archive to personal album'}
                        </p>
                      </div>

                      {actionStatuses.lookbook.done && onNavigateToScene && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToScene('lookbook');
                            onClose();
                          }}
                          className="p-1 rounded-lg bg-[#57221C] hover:bg-[#732C24] text-white text-[10px] flex items-center gap-0.5 cursor-pointer shrink-0"
                          title={isVi ? 'Mở Lookbook' : 'Open Lookbook'}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Chi Tiết 4 Trụ Cột Đánh Giá Di Sản */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Trụ cột 1: Kiểu dáng & Cắt may */}
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

                  {/* Trụ cột 2: Màu sắc & Ngũ Hành */}
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

                  {/* Trụ cột 3: Hoa văn & Chất liệu */}
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

                  {/* Trụ cột 4: Phụ kiện Gen Z */}
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
                </div>
              </>
            ) : null}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 border-t border-[#3E2C1E] bg-[#1C140E]/95 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#241A13] hover:bg-[#322319] active:scale-95 border border-[#423023] text-xs font-sans font-semibold text-[#BAA796] hover:text-[#F5EFE6] transition-all cursor-pointer"
              >
                <span>{isVi ? '← Đóng / Tiếp Tục Tùy Biến (ESC)' : '← Close / Return (ESC)'}</span>
              </button>
            </div>

            {isWarning && onResetToDefaultColors && (
              <button
                type="button"
                onClick={() => {
                  onResetToDefaultColors();
                  onClose();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#381815] hover:bg-[#4E211D] active:scale-95 border border-[#873127] text-xs font-sans text-[#F5C2BC] transition-all cursor-pointer"
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
