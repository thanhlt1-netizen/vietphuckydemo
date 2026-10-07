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
  ExternalLink,
  Send,
  Tag,
  Heart,
  Plus
} from 'lucide-react';
import { OutfitCustomization, AIEvaluationSummary } from '../../types/customization';
import { AIEvaluationService } from '../../services/aiEvaluationService';
import { LookbookService, getCostumeImage } from '../../services/lookbookService';
import { CommunityForumService } from '../../services/communityForumService';
import { SaveToLookbookModal, SaveToLookbookPayload } from '../lookbook/SaveToLookbookModal';
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

  // Trạng thái mở popup Lưu Lookbook (cho phép chọn album, tạo album mới, đặt tên)
  const [isSaveLookbookOpen, setIsSaveLookbookOpen] = useState<boolean>(false);

  // Trạng thái mở modal Đăng Diễn Đàn (soạn status, chọn hashtag, preview)
  const [isForumPublishOpen, setIsForumPublishOpen] = useState<boolean>(false);
  const [forumTitle, setForumTitle] = useState<string>('');
  const [forumAuthor, setForumAuthor] = useState<string>('GenZ Stylist');
  const [forumStatusContent, setForumStatusContent] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('#CachTanGenZ');
  const [isPublishingToForum, setIsPublishingToForum] = useState<boolean>(false);

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
        // Nếu các modal con đang mở, ưu tiên đóng modal con trước
        if (isSaveLookbookOpen) {
          setIsSaveLookbookOpen(false);
          return;
        }
        if (isForumPublishOpen) {
          setIsForumPublishOpen(false);
          return;
        }
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isSaveLookbookOpen, isForumPublishOpen, onClose]);

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

          // Khởi tạo nội dung mặc định cho status đăng diễn đàn
          setForumTitle(`${customization.costumeName} - ${result.cultural.badge || 'Phong Cách Cổ Phong'}`);
          setForumStatusContent(
            `Bản phối ${customization.costumeName} vừa hoàn tất kiểm duyệt di sản AI (${result.cultural.score}/100đ). Cùng chia sẻ cảm nghĩ và góp ý nhé!`
          );
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

  // Tự động ẩn toast thông báo sau 4s
  useEffect(() => {
    if (!lastActionToast) return;
    const timer = setTimeout(() => {
      setLastActionToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [lastActionToast]);

  const score = evaluation?.cultural.score ?? 88;
  const isHighHeritage = score >= 88;
  const isModerateHeritage = score >= 75 && score < 88;
  const isWarning = score < 75;

  // 1. TÁC VỤ ĐẶT MAY NGHỆ NHÂN: LƯU HỒ SƠ & CHUYỂN SANG TRANG ĐẶT MAY THEO YÊU CẦU
  const handleActionTailor = useCallback(() => {
    if (!evaluation) return;
    triggerHapticFeedback([25, 50, 35]);

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
        message: isVi ? 'Đã tạo hồ sơ may đo & chuyển trang' : 'Dossier created & navigating to tailor',
      },
    }));

    onActionSelect('tailor', evaluation);

    // Chuyển trực tiếp sang trang Đặt May
    if (onNavigateToScene) {
      onNavigateToScene('tailor');
      onClose();
    }
  }, [evaluation, customization, score, isVi, onActionSelect, onNavigateToScene, onClose]);

  // 2. TÁC VỤ THỬ ĐỒ ẢO AI: ĐỒNG BỘ TRANG PHỤC VÀO PHÒNG THỬ (GIỮ NGUYÊN TAB)
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
        ? '✓ Đã nạp trang phục vào Buồng Thử Đồ Ảo AI! Bạn có thể tiếp tục thao tác tại đây hoặc vào thử đồ sau.'
        : '✓ Outfit synced to AI Try-On! You can continue actions or navigate later.'
    );

    onActionSelect('tryon', evaluation);
  }, [evaluation, customization, isVi, onActionSelect]);

  // 3. TÁC VỤ ĐĂNG LÊN DIỄN ĐÀN: MỞ MODAL SOẠN STATUS ĐĂNG BÀI
  const handleOpenForumPublishModal = useCallback(() => {
    if (!evaluation) return;
    triggerHapticFeedback([20, 35]);
    setIsForumPublishOpen(true);
  }, [evaluation]);

  // Xử lý khi người dùng ấn "Đăng Ngay" trong modal status diễn đàn -> ĐĂNG XONG GIỮ NGUYÊN TAB KIỂM DUYỆT
  const handleConfirmPublishForum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forumTitle.trim() || !evaluation) return;

    setIsPublishingToForum(true);
    triggerHapticFeedback([30, 60, 30]);

    try {
      const authorTags = [
        selectedTag,
        `#${customization.costumeName.replace(/\s+/g, '')}`,
        '#VietPhucGenZ',
        '#CoPhucVietNam',
        evaluation.cultural.badge ? `#${evaluation.cultural.badge.replace(/\s+/g, '')}` : '#DiSan',
      ];

      CommunityForumService.publishPost(
        forumTitle.trim(),
        forumAuthor.trim() || 'GenZ Stylist',
        customization,
        authorTags,
        forumStatusContent.trim()
      );

      setActionStatuses((prev) => ({
        ...prev,
        forum: {
          done: true,
          message: isVi ? 'Đã đăng bài lên Diễn Đàn Gen Z' : 'Published to Gen Z Forum',
        },
      }));

      setLastActionToast(
        isVi
          ? `✓ Đã đăng bài "${forumTitle.trim()}" lên Diễn Đàn Gen Z thành công! Vẫn giữ nguyên ở trang kiểm duyệt.`
          : `✓ Post published to Gen Z Forum! Retaining current audit view.`
      );

      onActionSelect('forum', evaluation);
      setIsForumPublishOpen(false);
    } catch (err) {
      console.warn('Lỗi đăng bài diễn đàn:', err);
    } finally {
      setIsPublishingToForum(false);
    }
  };

  // 4. TÁC VỤ LƯU VÀO LOOKBOOK: MỞ POPUP LƯU LOOKBOOK ĐẦY ĐỦ (CHỌN/TẠO ALBUM)
  const handleOpenSaveLookbookModal = useCallback(() => {
    if (!evaluation) return;
    triggerHapticFeedback([20, 35]);
    setIsSaveLookbookOpen(true);
  }, [evaluation]);

  // Khi lưu Lookbook thành công -> ĐÓNG POPUP LOOKBOOK NHƯNG GIỮ NGUYÊN Ở TAB KIỂM DUYỆT
  const handleLookbookSavedSuccess = (albumName: string, itemName: string) => {
    setIsSaveLookbookOpen(false);
    triggerHapticFeedback([25, 45]);

    setActionStatuses((prev) => ({
      ...prev,
      lookbook: {
        done: true,
        message: isVi ? `Đã lưu vào "${albumName}"` : `Saved to "${albumName}"`,
      },
    }));

    setLastActionToast(
      isVi
        ? `✓ Đã lưu tác phẩm "${itemName}" vào Lookbook "${albumName}"! Giữ nguyên tab kiểm duyệt.`
        : `✓ Saved "${itemName}" to Lookbook "${albumName}"! Retaining audit screen.`
    );

    if (evaluation) {
      onActionSelect('lookbook', evaluation);
    }
  };

  const availableTags = [
    '#CachTanGenZ',
    '#VietPhucGenZ',
    '#CoPhucVietNam',
    '#DiSan',
    '#Streetwear',
    '#NhatBinh',
    '#AoTac',
    '#AoDai',
    '#Y2K',
    '#Tet2026',
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        onClick={(e) => {
          // Bấm ra ngoài vùng nền (backdrop) để tắt modal
          if (e.target === e.currentTarget && !isSaveLookbookOpen && !isForumPublishOpen) {
            onClose();
          }
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md select-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#251A13] via-[#1E140E] to-[#150E09] border border-[#6B4D36] rounded-3xl shadow-2xl shadow-black/90 overflow-hidden my-auto"
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
                      {isVi ? 'Tác vụ độc lập & giữ nguyên tab' : 'Independent persistent hub'}
                    </span>
                  </div>

                  {/* 4 Nút Tác Vụ To, Rõ Ràng, Phản Hồi Xúc Giác & Đổi Trạng Thái Ngay Trên Nút */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* NÚT 1: ĐẶT MAY NGHỆ NHÂN (CHUYỂN SANG TRANG ĐẶT MAY) */}
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
                          <ArrowRight className="w-3.5 h-3.5 text-[#8FB57F] group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-[10px] sm:text-[11px] font-sans text-[#BAA796] mt-0.5 truncate">
                          {isVi ? 'Chuyển sang trang đặt may đo nghệ nhân' : 'Navigate to artisan tailor order'}
                        </p>
                      </div>
                    </motion.button>

                    {/* NÚT 2: THỬ ĐỒ ẢO AI (GIỮ NGUYÊN HOẶC CHUYỂN TRANG) */}
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
                            ? 'Nạp đồ vào buồng thử đồ ảo'
                            : 'Load outfit into virtual dressing room'}
                        </p>
                      </div>

                      {actionStatuses.tryon.done && onNavigateToScene && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToScene('tryon');
                            onClose();
                          }}
                          className="p-1.5 rounded-lg bg-[#304B5E] hover:bg-[#436780] text-white text-[10px] flex items-center gap-0.5 cursor-pointer shrink-0"
                          title={isVi ? 'Mở phòng thử đồ' : 'Open Try-On'}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </motion.button>

                    {/* NÚT 3: ĐĂNG LÊN DIỄN ĐÀN (MỞ POPUP STATUS & GIỮ NGUYÊN TAB SAU KHI ĐĂNG) */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.025, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleOpenForumPublishModal}
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
                            ? 'Soạn status & đăng lên cộng đồng'
                            : 'Compose status & publish to community'}
                        </p>
                      </div>
                    </motion.button>

                    {/* NÚT 4: LƯU VÀO LOOKBOOK (MỞ POPUP CHỌN/TẠO LOOKBOOK & GIỮ NGUYÊN TAB SAU KHI LƯU) */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.025, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleOpenSaveLookbookModal}
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
                            ? 'Chọn hoặc thêm album Lookbook mới'
                            : 'Select or create new Lookbook album'}
                        </p>
                      </div>
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

      {/* ========================================================================= */}
      {/* MODAL LƯU LOOKBOOK ĐẦY ĐỦ (CHO PHÉP CHỌN ALBUM, TẠO ALBUM MỚI, ĐỔI TÊN) */}
      {/* ========================================================================= */}
      <SaveToLookbookModal
        isOpen={isSaveLookbookOpen}
        onClose={() => setIsSaveLookbookOpen(false)}
        payload={{
          type: 'design',
          defaultName: `${customization.costumeName} - Bản Phối ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
          costumeName: customization.costumeName,
          costumeId: customization.costumeId,
          imageUrl: getCostumeImage(customization.costumeId),
          customizationData: customization,
          note: `Đạt thẩm định di sản: ${score}/100đ · ${evaluation?.cultural.badge || 'Chuẩn di sản'}.`,
        }}
        onSavedSuccess={handleLookbookSavedSuccess}
      />

      {/* ========================================================================= */}
      {/* MODAL SOẠN STATUS & ĐĂNG DIỄN ĐÀN (GIỮ NGUYÊN TAB KIỂM DUYỆT SAU KHI ĐĂNG) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isForumPublishOpen && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsForumPublishOpen(false);
              }
            }}
            className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="relative max-w-lg w-full bg-[#1C140E] border border-[#D4A043]/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#3E2C1E] bg-[#241A13]/95">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#3D2D15] border border-[#D4A043] flex items-center justify-center text-[#F3C96B]">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#F5EFE6]">
                      {isVi ? 'Đăng Status Lên Diễn Đàn Gen Z' : 'Post Status to Gen Z Forum'}
                    </h4>
                    <p className="text-[11px] font-sans text-[#BAA796]">
                      {isVi ? 'Chia sẻ cảm nghĩ & bản phối vừa kiểm duyệt' : 'Share your verified heritage outfit'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsForumPublishOpen(false)}
                  className="p-1.5 rounded-full text-[#BAA796] hover:text-white hover:bg-[#322319] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleConfirmPublishForum} className="p-5 space-y-4">
                {/* Outfit Info Preview Card */}
                <div className="p-3 rounded-2xl bg-[#140E0A] border border-[#3E2C1E] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={getCostumeImage(customization.costumeId)}
                      alt={customization.costumeName}
                      className="w-12 h-12 rounded-xl object-cover border border-[#5A402D]"
                    />
                    <div>
                      <h5 className="text-xs font-serif font-bold text-[#F5EFE6]">
                        {customization.costumeName}
                      </h5>
                      <span className="text-[10px] font-sans text-[#D4A043]">
                        {evaluation?.cultural.badge || 'Chuẩn Di Sản'}
                      </span>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-xl bg-[#241A13] border border-[#5A402D] text-right">
                    <span className="text-[9px] font-sans text-[#BAA796] block uppercase">Di sản</span>
                    <span className="text-sm font-serif font-bold text-[#78976A]">{score}/100</span>
                  </div>
                </div>

                {/* Tiêu đề bài đăng */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-semibold text-[#D8CCC0]">
                    {isVi ? 'Tiêu đề bài viết:' : 'Post Title:'}
                  </label>
                  <input
                    type="text"
                    value={forumTitle}
                    onChange={(e) => setForumTitle(e.target.value)}
                    placeholder={isVi ? 'Nhập tiêu đề ấn tượng...' : 'Enter post title...'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#140D08] border border-[#423023] focus:border-[#D4A043] text-xs font-sans text-[#F5EFE6] focus:outline-none"
                    required
                  />
                </div>

                {/* Tên tác giả */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-semibold text-[#D8CCC0]">
                    {isVi ? 'Tên tác giả / Bút danh:' : 'Author Name:'}
                  </label>
                  <input
                    type="text"
                    value={forumAuthor}
                    onChange={(e) => setForumAuthor(e.target.value)}
                    placeholder="GenZ Stylist"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#140D08] border border-[#423023] focus:border-[#D4A043] text-xs font-sans text-[#F5EFE6] focus:outline-none"
                  />
                </div>

                {/* Nội dung Status / Cảm nghĩ */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-semibold text-[#D8CCC0]">
                    {isVi ? 'Status / Cảm nghĩ phối đồ:' : 'Status / Styling Thoughts:'}
                  </label>
                  <textarea
                    value={forumStatusContent}
                    onChange={(e) => setForumStatusContent(e.target.value)}
                    rows={3}
                    placeholder={isVi ? 'Chia sẻ câu chuyện, cảm hứng phối màu của bạn...' : 'Share your styling thoughts...'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#140D08] border border-[#423023] focus:border-[#D4A043] text-xs font-sans text-[#F5EFE6] focus:outline-none resize-none"
                  />
                </div>

                {/* Hashtag Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-semibold text-[#D8CCC0] flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#D4A043]" />
                    <span>{isVi ? 'Chủ đề / Hashtag chính:' : 'Primary Hashtag:'}</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableTags.map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-sans transition-all cursor-pointer border ${
                          selectedTag === tag
                            ? 'bg-[#536B49] text-white border-[#78976A] font-semibold'
                            : 'bg-[#18100A] text-[#BAA796] border-[#3E2C1E] hover:border-[#D4A043]'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#3E2C1E]">
                  <button
                    type="button"
                    onClick={() => setIsForumPublishOpen(false)}
                    className="px-4 py-2 rounded-full bg-[#241A13] hover:bg-[#322319] border border-[#423023] text-xs font-sans text-[#BAA796] hover:text-white cursor-pointer"
                  >
                    {isVi ? 'Hủy' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={isPublishingToForum || !forumTitle.trim()}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-[#D4A043] to-[#B3802B] hover:from-[#E5B355] hover:to-[#C4913C] text-[#1E140E] text-xs font-sans font-bold shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {isPublishingToForum
                        ? isVi
                          ? 'Đang Đăng...'
                          : 'Publishing...'
                        : isVi
                        ? 'Đăng Status Ngay'
                        : 'Publish Status'}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};
