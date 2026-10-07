import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Share2,
  X,
  Sparkles,
  Copy,
  Check,
  Download,
  ExternalLink,
  Palette,
  Layers,
  Calendar,
  BookmarkCheck,
  CheckCircle2,
  MessageCircle,
  Smartphone,
  Globe,
  Tag,
  ShieldCheck,
  Info
} from 'lucide-react';
import { LookbookItem } from '../../types/lookbook';
import {
  extractCustomizationDetails,
  generateLookbookShareUrl,
  generateSocialCaption,
  isWebShareSupported,
  isWebShareFilesSupported,
  shareCustomizationViaWebShare,
  copyToClipboard,
  getSocialDirectLinks,
  SocialDirectLink
} from '../../services/shareService';
import { LookbookService } from '../../services/lookbookService';

interface ShareToSocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: LookbookItem | null;
  albumName?: string;
  onToast?: (message: string) => void;
}

export const ShareToSocialModal: React.FC<ShareToSocialModalProps> = ({
  isOpen,
  onClose,
  item,
  albumName,
  onToast,
}) => {
  const [isSharingWebShare, setIsSharingWebShare] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'caption'>('quick');

  // Reset copy states khi modal mở/đóng
  useEffect(() => {
    if (isOpen) {
      setCopiedLink(false);
      setCopiedCaption(false);
      setIsSharingWebShare(false);
    }
  }, [isOpen, item]);

  // Lắng nghe phím ESC để đóng modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const webShareAvail = isWebShareSupported();
  const webShareFilesAvail = isWebShareFilesSupported();
  const shareUrl = generateLookbookShareUrl(item);
  const socialCaption = generateSocialCaption(item, shareUrl, albumName);
  const details = extractCustomizationDetails(item);
  const socialLinks = getSocialDirectLinks(item, shareUrl, socialCaption);

  /**
   * Kích hoạt Web Share API chính
   */
  const handleExecuteWebShare = async () => {
    if (isSharingWebShare) return;
    setIsSharingWebShare(true);

    try {
      const result = await shareCustomizationViaWebShare(item, albumName);

      if (result.success) {
        const fileMsg = result.fileAttached ? ' kèm ảnh' : '';
        const msg = `Đã chia sẻ thành công tác phẩm "${item.customName}"${fileMsg}!`;
        if (onToast) onToast(msg);
      } else if (result.method === 'cancelled') {
        // Người dùng tự đóng share sheet hệ thống
      } else if (result.method === 'unsupported' || result.method === 'error') {
        // Fallback tự động sao chép link
        const copied = await copyToClipboard(socialCaption);
        if (copied) {
          if (onToast) {
            onToast('Đã sao chép nội dung & link chia sẻ vào bộ nhớ đệm!');
          }
        }
      }
    } catch (err) {
      console.warn('Web Share API error:', err);
    } finally {
      setIsSharingWebShare(false);
    }
  };

  /**
   * Sao chép URL
   */
  const handleCopyLink = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopiedLink(true);
      if (onToast) onToast('Đã sao chép liên kết chia sẻ!');
      setTimeout(() => setCopiedLink(false), 2600);
    }
  };

  /**
   * Sao chép toàn bộ Caption mạng xã hội
   */
  const handleCopyCaption = async () => {
    const ok = await copyToClipboard(socialCaption);
    if (ok) {
      setCopiedCaption(true);
      if (onToast) onToast('Đã sao chép caption hoàn chỉnh vào bộ nhớ đệm!');
      setTimeout(() => setCopiedCaption(false), 2600);
    }
  };

  /**
   * Mở liên kết chia sẻ trực tiếp lên MXH
   */
  const handleOpenSocialLink = (link: SocialDirectLink) => {
    try {
      window.open(link.url, '_blank', 'noopener,noreferrer,width=640,height=580');
      if (onToast) onToast(`Đang mở trang chia sẻ lên ${link.name}...`);
    } catch {
      window.location.href = link.url;
    }
  };

  /**
   * Tải ảnh mockup về máy
   */
  const handleDownload = () => {
    const filename = `vietphuc-${item.type}-${item.costumeId}-${Date.now()}.jpg`;
    LookbookService.downloadImage(item.imageUrl, filename);
    if (onToast) onToast('Đang tải ảnh xuống thiết bị...');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#0E0906]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 16 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-2xl w-full bg-gradient-to-b from-[#241A13] via-[#1E150F] to-[#160E09] border border-[#D4A043]/70 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.85)] flex flex-col max-h-[92vh] overflow-hidden text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Nút đóng */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#140D08]/85 text-[#BAA796] hover:text-white flex items-center justify-center border border-[#423023] hover:border-[#D4A043] cursor-pointer transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-4 h-4 text-[#F3C96B]" />
          </button>

          {/* ========================================================================= */}
          {/* HEADER: PHONG CÁCH HOÀNG GIA DI SẢN                                       */}
          {/* ========================================================================= */}
          <div className="p-5 sm:p-6 pb-4 border-b border-[#3E2C1E] bg-[#241A13]/90 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D4A043] via-[#BA8A30] to-[#8E6319] border border-[#F3C96B]/80 flex items-center justify-center text-[#140D08] shadow-[0_0_15px_rgba(212,160,67,0.4)] shrink-0">
                <Share2 className="w-5 h-5 text-[#140D08]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#F5EFE6]">
                    Chia Sẻ Lên Mạng Xã Hội
                  </h3>
                  <span className="text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-[#D4A043]/20 border border-[#D4A043]/60 text-[#F3C96B]">
                    Share to Social
                  </span>
                </div>
                <p className="text-xs font-sans text-[#BAA796] mt-0.5">
                  Lan tỏa bản phối Việt phục cách tân và thẩm mỹ di sản đến bạn bè khắp mọi nơi
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* NỘI DUNG CUỘN CHÍNH                                                       */}
          {/* ========================================================================= */}
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
            {/* THẺ TỔNG QUAN TÁC PHẨM VÀ BẢN PHỐI MÀU (COSTUME CUSTOMIZATION CARD) */}
            <div className="p-4 rounded-2xl bg-[#170F0A]/95 border border-[#3E2C1E] flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-inner">
              {/* Ảnh thu nhỏ tác phẩm */}
              <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden bg-[#140D08] shrink-0 border border-[#423023] shadow-md group">
                <img
                  src={item.imageUrl}
                  alt={item.customName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className={`absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-sans font-bold text-center px-1 py-0.5 rounded border backdrop-blur-md ${
                  item.type === 'design'
                    ? 'bg-[#1C261A]/90 text-[#78976A] border-[#465A3D]'
                    : 'bg-[#2D2111]/90 text-[#D4A043] border-[#7A5A20]'
                }`}>
                  {item.type === 'design' ? 'Bản Phối' : 'Thử Đồ Ảo'}
                </span>
              </div>

              {/* Thông tin bản phối tùy biến */}
              <div className="flex-1 min-w-0 space-y-2 text-left w-full">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#F5EFE6] tracking-wide">
                      {item.customName}
                    </h4>
                    <span className="text-xs font-serif text-[#D4A043] font-medium">
                      {item.costumeName} {albumName ? `· ${albumName}` : ''}
                    </span>
                  </div>

                  <span className="text-[11px] font-sans text-[#8E7B6C] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#78976A]" />
                    {item.savedAt}
                  </span>
                </div>

                {/* Bảng 4 màu tùy biến (Color Palette Swatches) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {/* Vạt áo chính */}
                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#1F150E] border border-[#3E2C1E]">
                    <span
                      className="w-4 h-4 rounded-full border border-white/30 shrink-0 shadow-sm"
                      style={{ backgroundColor: details.primaryRobeHex }}
                      title={`Vạt áo: ${details.primaryRobeHex}`}
                    />
                    <div className="min-w-0 text-[10px] font-sans">
                      <span className="block text-[#8E7B6C] leading-none">Vạt áo</span>
                      <span className="font-medium text-[#D8CCC0] truncate block leading-tight">
                        {details.primaryRobeColorName}
                      </span>
                    </div>
                  </div>

                  {/* Cổ áo / Yếm */}
                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#1F150E] border border-[#3E2C1E]">
                    <span
                      className="w-4 h-4 rounded-full border border-white/30 shrink-0 shadow-sm"
                      style={{ backgroundColor: details.innerCollarHex }}
                      title={`Cổ áo: ${details.innerCollarHex}`}
                    />
                    <div className="min-w-0 text-[10px] font-sans">
                      <span className="block text-[#8E7B6C] leading-none">Cổ áo</span>
                      <span className="font-medium text-[#D8CCC0] truncate block leading-tight">
                        {details.innerCollarColorName}
                      </span>
                    </div>
                  </div>

                  {/* Dải thắt lưng */}
                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#1F150E] border border-[#3E2C1E]">
                    <span
                      className="w-4 h-4 rounded-full border border-white/30 shrink-0 shadow-sm"
                      style={{ backgroundColor: details.sashHex }}
                      title={`Thắt lưng: ${details.sashHex}`}
                    />
                    <div className="min-w-0 text-[10px] font-sans">
                      <span className="block text-[#8E7B6C] leading-none">Thắt lưng</span>
                      <span className="font-medium text-[#D8CCC0] truncate block leading-tight">
                        {details.sashColorName}
                      </span>
                    </div>
                  </div>

                  {/* Quần / Váy */}
                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#1F150E] border border-[#3E2C1E]">
                    <span
                      className="w-4 h-4 rounded-full border border-white/30 shrink-0 shadow-sm"
                      style={{ backgroundColor: details.bottomHex }}
                      title={`Quần/Váy: ${details.bottomHex}`}
                    />
                    <div className="min-w-0 text-[10px] font-sans">
                      <span className="block text-[#8E7B6C] leading-none">Quần/Váy</span>
                      <span className="font-medium text-[#D8CCC0] truncate block leading-tight">
                        {details.bottomColorName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Họa tiết & Phụ kiện Gen Z */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-sans">
                  <span className="px-2 py-0.5 rounded-full bg-[#2A1E15] border border-[#423023] text-[#D8CCC0] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#D4A043]" />
                    <span>Họa tiết: <strong>{details.patternName}</strong></span>
                  </span>

                  {details.accessoryNames.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#2A1E15] border border-[#423023] text-[#D8CCC0] flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#78976A]" />
                      <span>Phụ kiện: {details.accessoryNames.join(', ')}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* TÍNH NĂNG TRỌNG TÂM: WEB SHARE API HERO SECTION                           */}
            {/* ========================================================================= */}
            <div className="relative p-5 rounded-3xl bg-gradient-to-br from-[#2D2015] via-[#241A13] to-[#1C140E] border-2 border-[#D4A043] shadow-[0_0_30px_rgba(212,160,67,0.25)] space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#78976A] animate-pulse" />
                    <h4 className="font-serif font-bold text-base sm:text-lg text-[#F5EFE6]">
                      Chia Sẻ Qua Web Share API
                    </h4>
                  </div>
                  <p className="text-xs font-sans text-[#BAA796] leading-relaxed">
                    Kích hoạt trực tiếp hộp thoại chia sẻ của hệ điều hành (hỗ trợ Zalo, Messenger, Instagram, AirDrop, Tin nhắn...)
                  </p>
                </div>

                {/* Trạng thái hỗ trợ Web Share */}
                <span className={`text-[10px] font-sans font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                  webShareAvail
                    ? 'bg-[#1C261A] text-[#78976A] border-[#465A3D]'
                    : 'bg-[#2E1E17] text-[#D4A043] border-[#7A5A20]'
                }`}>
                  {webShareAvail ? 'Hệ thống hỗ trợ' : 'Chế độ tương thích'}
                </span>
              </div>

              {/* NÚT BẤM CHÍNH WEB SHARE API */}
              <button
                type="button"
                onClick={handleExecuteWebShare}
                disabled={isSharingWebShare}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D4A043] via-[#BA8A30] to-[#8E6319] hover:from-[#E2B155] hover:to-[#A37320] text-[#140D08] font-serif font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(212,160,67,0.4)] hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer border border-[#F3C96B] disabled:opacity-50"
              >
                <Smartphone className="w-5 h-5 text-[#140D08]" />
                <span>
                  {isSharingWebShare ? 'Đang mở menu chia sẻ...' : 'Mở Menu Chia Sẻ Thiết Bị (Web Share)'}
                </span>
                <Sparkles className="w-4 h-4 text-[#140D08]" />
              </button>

              <div className="flex items-center justify-between text-[11px] font-sans text-[#8E7B6C] pt-0.5">
                <span>
                  {webShareFilesAvail ? '✓ Hỗ trợ đính kèm hình ảnh và bản phối' : '✓ Tự động nạp lời tựa và thông tin di sản'}
                </span>
                <span className="italic">1 lần chạm để chia sẻ</span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* TÙY CHỌN 1-CLICK: MẠNG XÃ HỘI TRỰC TIẾP (FACEBOOK, ZALO, X, TELEGRAM...) */}
            {/* ========================================================================= */}
            <div className="space-y-3">
              <label className="text-xs font-sans font-semibold text-[#BAA796] uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#F3C96B]" />
                <span>Chia sẻ trực tiếp lên nền tảng:</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {socialLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleOpenSocialLink(link)}
                    className="p-3 rounded-2xl bg-[#1C140E] hover:bg-[#2A1D14] border border-[#3E2C1E] hover:border-[#D4A043]/70 transition-all flex items-center justify-between gap-2.5 text-left cursor-pointer group shadow-sm hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Icon từng mạng xã hội */}
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                        style={{ backgroundColor: link.color }}
                      >
                        {link.iconType === 'facebook' && 'f'}
                        {link.iconType === 'zalo' && 'Z'}
                        {link.iconType === 'twitter' && 'X'}
                        {link.iconType === 'telegram' && '✈'}
                        {link.iconType === 'whatsapp' && '💬'}
                        {link.iconType === 'pinterest' && 'P'}
                      </div>
                      <div className="min-w-0">
                        <span className="font-serif font-bold text-xs text-[#F5EFE6] block group-hover:text-[#F3C96B] transition-colors truncate">
                          {link.name}
                        </span>
                        <span className="text-[10px] font-sans text-[#8E7B6C] block truncate">
                          {link.badgeText}
                        </span>
                      </div>
                    </div>

                    <ExternalLink className="w-3.5 h-3.5 text-[#8E7B6C] group-hover:text-[#F3C96B] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* CÔNG CỤ TIỆN ÍCH: SAO CHÉP LINK & CAPTION HOÀN CHỈNH                      */}
            {/* ========================================================================= */}
            <div className="pt-2 border-t border-[#3E2C1E]/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans font-semibold text-[#BAA796] uppercase tracking-wider flex items-center gap-1.5">
                  <Copy className="w-3.5 h-3.5 text-[#78976A]" />
                  <span>Tiện ích sao chép & Tải ảnh:</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('quick')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-sans transition-all cursor-pointer ${
                      activeTab === 'quick'
                        ? 'bg-[#36472F] text-white font-medium'
                        : 'text-[#8E7B6C] hover:text-[#BAA796]'
                    }`}
                  >
                    Thao tác nhanh
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('caption')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-sans transition-all cursor-pointer ${
                      activeTab === 'caption'
                        ? 'bg-[#36472F] text-white font-medium'
                        : 'text-[#8E7B6C] hover:text-[#BAA796]'
                    }`}
                  >
                    Xem trước Caption
                  </button>
                </div>
              </div>

              {activeTab === 'quick' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Nút Sao chép liên kết */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-sans flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      copiedLink
                        ? 'bg-[#2E3D27] border-[#78976A] text-[#A1C990]'
                        : 'bg-[#1C140E] hover:bg-[#2A1D14] border-[#3E2C1E] text-[#D8CCC0] hover:text-white'
                    }`}
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-[#78976A]" /> : <Copy className="w-3.5 h-3.5 text-[#F3C96B]" />}
                    <span>{copiedLink ? 'Đã sao chép link!' : 'Sao chép liên kết'}</span>
                  </button>

                  {/* Nút Sao chép Caption */}
                  <button
                    type="button"
                    onClick={handleCopyCaption}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-sans flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      copiedCaption
                        ? 'bg-[#2E3D27] border-[#78976A] text-[#A1C990]'
                        : 'bg-[#1C140E] hover:bg-[#2A1D14] border-[#3E2C1E] text-[#D8CCC0] hover:text-white'
                    }`}
                  >
                    {copiedCaption ? <Check className="w-3.5 h-3.5 text-[#78976A]" /> : <MessageCircle className="w-3.5 h-3.5 text-[#78976A]" />}
                    <span>{copiedCaption ? 'Đã chép caption!' : 'Sao chép Caption'}</span>
                  </button>

                  {/* Nút Tải ảnh về máy */}
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="py-2.5 px-4 rounded-xl bg-[#1C140E] hover:bg-[#2A1D14] border border-[#3E2C1E] hover:border-[#D4A043] text-xs font-sans text-[#D8CCC0] hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D4A043]" />
                    <span>Tải ảnh về máy</span>
                  </button>
                </div>
              ) : (
                /* Tab Xem trước Caption chi tiết */
                <div className="p-3.5 rounded-2xl bg-[#140D08] border border-[#3E2C1E] space-y-2 text-left">
                  <div className="flex items-center justify-between text-[11px] text-[#8E7B6C]">
                    <span>Caption mẫu chia sẻ lên Instagram, Threads, Facebook:</span>
                    <button
                      type="button"
                      onClick={handleCopyCaption}
                      className="inline-flex items-center gap-1 text-[#F3C96B] hover:underline cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedCaption ? 'Đã sao chép' : 'Sao chép nội dung'}</span>
                    </button>
                  </div>
                  <pre className="text-xs font-sans text-[#D8CCC0] whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto bg-[#1C140E]/80 p-3 rounded-xl border border-[#3E2C1E]/50">
                    {socialCaption}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* FOOTER                                                                    */}
          {/* ========================================================================= */}
          <div className="p-4 px-6 border-t border-[#3E2C1E] bg-[#170F0A] flex items-center justify-between">
            <span className="text-xs font-sans text-[#8E7B6C] hidden sm:flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#78976A]" />
              <span>Bảo tồn nguyên bản văn hóa · Sáng tạo tự do theo phong cách Gen Z</span>
            </span>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-[#1C140E] hover:bg-[#2A1D14] border border-[#423023] text-xs font-sans text-[#D8CCC0] hover:text-white cursor-pointer ml-auto transition-colors"
            >
              Hoàn tất
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
