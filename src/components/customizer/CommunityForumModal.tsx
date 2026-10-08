import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Heart, 
  Send, 
  Sparkles, 
  Share2, 
  Tag, 
  Check, 
  Layers, 
  Sliders, 
  Shirt,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { CommunityPost, OutfitCustomization } from '../../types/customization';
import { CommunityForumService } from '../../services/communityForumService';

interface CommunityForumModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCustomization: OutfitCustomization;
  onApplyOutfit: (outfit: OutfitCustomization) => void;
  onTryOnOutfit?: (outfit: OutfitCustomization) => void;
  initialMode?: 'publish' | 'browse';
  onPublished?: () => void;
}

export const CommunityForumModal: React.FC<CommunityForumModalProps> = ({
  isOpen,
  onClose,
  currentCustomization,
  onApplyOutfit,
  onTryOnOutfit,
  initialMode = 'browse',
  onPublished,
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'publish'>(initialMode);
  const [posts, setPosts] = useState<CommunityPost[]>(() => CommunityForumService.getCommunityPosts());

  // Form đăng bài
  const [publishTitle, setPublishTitle] = useState(
    `${currentCustomization.costumeName} Phối Màu Đương Đại`
  );
  const [publishAuthor, setPublishAuthor] = useState('GenZ Stylist');
  const [publishDesc, setPublishDesc] = useState('');
  const [selectedTag, setSelectedTag] = useState('#CachTanGenZ');
  const [isPublishedSuccess, setIsPublishedSuccess] = useState(false);

  const availableTags = [
    '#CachTanGenZ',
    '#VietPhuc',
    '#Streetwear',
    '#NhatBinh',
    '#AoTac',
    '#Y2K',
    '#Tet2026',
    '#DiSan'
  ];

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = CommunityForumService.toggleLikePost(id);
    setPosts(updated);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publishTitle.trim()) return;

    CommunityForumService.publishPost(
      publishTitle.trim(),
      publishAuthor.trim() || 'Bạn (Nhà thiết kế)',
      currentCustomization,
      [selectedTag, '#VietPhucGenZ'],
      publishDesc.trim()
    );

    setPosts(CommunityForumService.getCommunityPosts());
    setIsPublishedSuccess(true);
    onPublished?.();

    setTimeout(() => {
      setIsPublishedSuccess(false);
      setActiveTab('browse');
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#0E0906]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative max-w-4xl w-full bg-[#1C140E] border border-[#423023] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#322319] bg-[#241A13]/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#293623] border border-[#465A3D] flex items-center justify-center text-[#78976A]">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#F5EFE6]">
                  Diễn Đàn Cổ Phục Gen Z
                </h3>
                <p className="text-xs font-sans text-[#BAA796]">
                  Cộng đồng chia sẻ các bản phối cách tân Việt phục đương đại
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#140D08]/80 hover:bg-[#2A1D14] text-[#BAA796] hover:text-white flex items-center justify-center border border-[#423023] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Bar: Khám phá vs Đăng bài */}
          <div className="flex items-center justify-between px-6 py-3 bg-[#18100A] border-b border-[#322319]">
            <div className="inline-flex p-1 rounded-full bg-[#241A13] border border-[#423023]">
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className={`px-4 py-1.5 rounded-full text-xs font-sans font-medium transition-all cursor-pointer ${
                  activeTab === 'browse'
                    ? 'bg-[#536B49] text-white shadow-sm'
                    : 'text-[#BAA796] hover:text-[#F5EFE6]'
                }`}
              >
                Khám Phá Diễn Đàn ({posts.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('publish')}
                className={`px-4 py-1.5 rounded-full text-xs font-sans font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'publish'
                    ? 'bg-[#536B49] text-white shadow-sm'
                    : 'text-[#BAA796] hover:text-[#F5EFE6]'
                }`}
              >
                <Send className="w-3 h-3 text-[#D4A043]" />
                <span>Đăng Bản Thiết Kế Này</span>
              </button>
            </div>

            <span className="text-[11px] font-sans text-[#8E7B6C] hidden sm:inline">
              Đang tùy biến: <strong className="text-[#D8CCC0]">{currentCustomization.costumeName}</strong>
            </span>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'publish' ? (
              // FORM ĐĂNG BÀI LÊN DIỄN ĐÀN
              <form onSubmit={handlePublish} className="max-w-xl mx-auto space-y-4 text-left">
                {isPublishedSuccess ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-[#293623] text-[#78976A] flex items-center justify-center border border-[#465A3D]">
                      <Check className="w-7 h-7 stroke-[3]" />
                    </div>
                    <h4 className="font-serif font-bold text-lg text-[#F5EFE6]">
                      Đăng Lên Diễn Đàn Thành Công!
                    </h4>
                    <p className="text-xs font-sans text-[#BAA796]">
                      Bản phối của bạn đã được xuất hiện trên cộng đồng Việt Phục Gen Z.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-2xl bg-[#241A13] border border-[#423023] flex items-center gap-3">
                      <div className="flex -space-x-1">
                        <span
                          className="w-5 h-5 rounded-full border border-black/40"
                          style={{ backgroundColor: currentCustomization.parts.primaryRobeColor }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-black/40"
                          style={{ backgroundColor: currentCustomization.parts.innerCollarColor }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-black/40"
                          style={{ backgroundColor: currentCustomization.parts.bottomColor }}
                        />
                      </div>
                      <div className="text-xs font-sans text-[#D8CCC0]">
                        <span>Thiết kế gốc: <strong>{currentCustomization.costumeName}</strong></span>
                        <span className="text-[#8E7B6C] ml-1.5">({currentCustomization.accessories.length} phụ kiện)</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#78976A] block mb-1.5">
                        Tiêu đề bản phối cách tân:
                      </label>
                      <input
                        type="text"
                        value={publishTitle}
                        onChange={(e) => setPublishTitle(e.target.value)}
                        placeholder="Ví dụ: Áo Tấc Xanh Thiên Thanh Dạo Phố..."
                        className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-[#3E2C1E] text-sm text-[#F5EFE6] focus:outline-none focus:border-[#78976A]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#78976A] block mb-1.5">
                          Tên của bạn (Tác giả):
                        </label>
                        <input
                          type="text"
                          value={publishAuthor}
                          onChange={(e) => setPublishAuthor(e.target.value)}
                          placeholder="Tên hoặc biệt danh..."
                          className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-[#3E2C1E] text-sm text-[#F5EFE6] focus:outline-none focus:border-[#78976A]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#78976A] block mb-1.5">
                          Chủ đề / Thẻ tag:
                        </label>
                        <select
                          value={selectedTag}
                          onChange={(e) => setSelectedTag(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-[#3E2C1E] text-sm text-[#F5EFE6] focus:outline-none focus:border-[#78976A]"
                        >
                          {availableTags.map((tag) => (
                            <option key={tag} value={tag} className="bg-[#1C140E]">
                              {tag}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#78976A] block mb-1.5">
                        Cảm hứng thiết kế (tùy chọn):
                      </label>
                      <textarea
                        value={publishDesc}
                        onChange={(e) => setPublishDesc(e.target.value)}
                        rows={3}
                        placeholder="Chia sẻ lý do bạn chọn bảng màu này hoặc dịp phù hợp để diện..."
                        className="w-full px-4 py-2.5 rounded-xl bg-[#140D08] border border-[#3E2C1E] text-sm text-[#F5EFE6] focus:outline-none focus:border-[#78976A]"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('browse')}
                        className="px-5 py-2.5 rounded-full bg-[#140D08] border border-[#3E2C1E] text-xs font-sans text-[#BAA796] hover:text-[#F5EFE6]"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-7 py-2.5 rounded-full bg-gradient-to-r from-[#536B49] to-[#3B4D33] text-white text-xs font-sans font-semibold shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Đăng Lên Cộng Đồng Ngay</span>
                      </button>
                    </div>
                  </>
                )}
              </form>
            ) : (
              // DANH SÁCH BÀI ĐĂNG CỦA CỘNG ĐỒNG
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-5 rounded-2xl bg-[#241A13]/90 border border-[#423023] hover:border-[#594232] transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Author & Time */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl p-1 bg-[#140D08] rounded-full border border-[#3E2C1E]">
                            {post.authorAvatar || '🌸'}
                          </span>
                          <div>
                            <h4 className="text-xs font-sans font-bold text-[#F5EFE6]">
                              {post.authorName}
                            </h4>
                            <span className="text-[10px] font-sans text-[#8E7B6C]">
                              {post.createdAt}
                            </span>
                          </div>
                        </div>

                        {/* Like Button */}
                        <button
                          type="button"
                          onClick={(e) => handleLike(post.id, e)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-sans transition-all cursor-pointer ${
                            post.isLiked
                              ? 'bg-[#401812] text-[#E05243] border border-[#872013]'
                              : 'bg-[#140D08] text-[#BAA796] hover:text-white border border-[#3E2C1E]'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span>{post.likesCount}</span>
                        </button>
                      </div>

                      {/* Post Title */}
                      <h3 className="font-serif font-bold text-base text-[#F5EFE6] mb-1">
                        {post.title}
                      </h3>

                      {post.description && (
                        <p className="text-xs font-sans text-[#BAA796] leading-relaxed mb-3 line-clamp-2">
                          {post.description}
                        </p>
                      )}

                      {/* Color Palette Preview Swatches */}
                      <div className="flex items-center gap-2 mb-3 p-2.5 rounded-xl bg-[#140D08] border border-[#3E2C1E]">
                        <span className="text-[10px] font-sans text-[#8E7B6C]">Bảng màu:</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-4 h-4 rounded-full border border-black/40 shadow-inner"
                            title="Vạt ngoài"
                            style={{ backgroundColor: post.customization.parts.primaryRobeColor }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black/40 shadow-inner"
                            title="Lớp trong"
                            style={{ backgroundColor: post.customization.parts.innerCollarColor }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black/40 shadow-inner"
                            title="Quần/Váy"
                            style={{ backgroundColor: post.customization.parts.bottomColor }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black/40 shadow-inner"
                            title="Thắt lưng"
                            style={{ backgroundColor: post.customization.parts.sashColor }}
                          />
                        </div>
                        <span className="text-[10px] font-sans text-[#BAA796] ml-auto">
                          {post.customization.costumeName}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-sans px-2 py-0.5 rounded bg-[#1C140E] text-[#78976A] border border-[#3E2C1E]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-[#322319] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onApplyOutfit(post.customization);
                          onClose();
                        }}
                        className="flex-1 py-2 px-3 rounded-full bg-[#1C140E] hover:bg-[#2A1D14] border border-[#423023] text-xs font-sans text-[#D8CCC0] hover:text-[#F5EFE6] flex items-center justify-center gap-1 cursor-pointer"
                        title="Sao chép các màu và phụ kiện này vào xưởng của bạn"
                      >
                        <Sliders className="w-3 h-3 text-[#D4A043]" />
                        <span>Áp dụng bản phối này</span>
                      </button>

                      {onTryOnOutfit && (
                        <button
                          type="button"
                          onClick={() => {
                            onTryOnOutfit(post.customization);
                            onClose();
                          }}
                          className="py-2 px-3.5 rounded-full bg-[#536B49] hover:bg-[#627C56] text-white text-xs font-sans font-medium shadow-sm flex items-center gap-1 cursor-pointer"
                          title="Chuyển thẳng sang Thử đồ ảo"
                        >
                          <Shirt className="w-3 h-3" />
                          <span>Thử Đồ</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
