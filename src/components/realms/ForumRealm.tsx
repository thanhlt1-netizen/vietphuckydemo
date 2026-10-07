import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Heart, 
  Star, 
  Send, 
  Share2, 
  Sliders, 
  Shirt, 
  Camera, 
  Filter, 
  Search, 
  Sparkles, 
  Check, 
  X, 
  Trash2, 
  User, 
  Calendar,
  Layers,
  Award,
  PlusCircle,
  ArrowRight,
  BookmarkCheck
} from 'lucide-react';
import { CommunityPost, OutfitCustomization } from '../../types/customization';
import { CommunityForumService } from '../../services/communityForumService';
import { COSTUME_DATABASE } from '../../services/recommendationService';
import { CommunityForumModal } from '../customizer/CommunityForumModal';

interface ForumRealmProps {
  currentCustomization: OutfitCustomization | null;
  onApplyOutfit: (outfit: OutfitCustomization) => void;
  onTryOnOutfit: (outfit: OutfitCustomization) => void;
  onNavigateToCustomizer: () => void;
}

export const ForumRealm: React.FC<ForumRealmProps> = ({
  currentCustomization,
  onApplyOutfit,
  onTryOnOutfit,
  onNavigateToCustomizer,
}) => {
  const [posts, setPosts] = useState<CommunityPost[]>(() => CommunityForumService.getCommunityPosts());
  
  // Filter states
  const [activeTab, setActiveTab] = useState<'all' | 'my_designs' | 'top_rated'>('all');
  const [selectedCostumeFilter, setSelectedCostumeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal chia sẻ bài viết mới
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Modal xem chi tiết & đánh giá
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  // Form viết đánh giá mới
  const [reviewAuthor, setReviewAuthor] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewStars, setReviewStars] = useState<number>(5);
  const [reviewToast, setReviewToast] = useState<string | null>(null);

  // Thả tim
  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = CommunityForumService.toggleLikePost(id);
    setPosts(updated);
    if (selectedPost && selectedPost.id === id) {
      const refreshed = updated.find((p) => p.id === id) || null;
      setSelectedPost(refreshed);
    }
  };

  // Xóa bài viết (nếu là bài của mình)
  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc muốn xóa bài đăng này khỏi Diễn đàn?')) {
      const updated = CommunityForumService.deletePost(id);
      setPosts(updated);
      if (selectedPost?.id === id) setSelectedPost(null);
    }
  };

  // Gửi đánh giá cho bài đăng
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !reviewComment.trim()) return;

    const updated = CommunityForumService.addReviewToPost(
      selectedPost.id,
      reviewAuthor.trim() || 'Bạn (Nhà thẩm mỹ)',
      reviewComment.trim(),
      reviewStars
    );

    setPosts(updated);
    const refreshed = updated.find((p) => p.id === selectedPost.id) || null;
    setSelectedPost(refreshed);

    setReviewComment('');
    setReviewToast('Cảm ơn bạn đã gửi đánh giá cho bản thiết kế này!');
    setTimeout(() => setReviewToast(null), 2500);
  };

  // Lọc bài viết
  const filteredPosts = posts.filter((post) => {
    if (activeTab === 'my_designs' && !post.isMyDesign) {
      return false;
    }
    if (selectedCostumeFilter !== 'all' && post.customization.costumeId !== selectedCostumeFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = post.title.toLowerCase().includes(q);
      const matchesAuthor = post.authorName.toLowerCase().includes(q);
      const matchesCostume = post.customization.costumeName.toLowerCase().includes(q);
      const matchesTags = post.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesTitle && !matchesAuthor && !matchesCostume && !matchesTags) return false;
    }
    return true;
  }).sort((a, b) => {
    if (activeTab === 'top_rated') {
      return (b.rating || 5) - (a.rating || 5) || b.likesCount - a.likesCount;
    }
    return 0;
  });

  // Tìm ảnh minh họa demo cho từng bộ
  const getDemoImageForCostume = (costumeId: string): string => {
    const item = COSTUME_DATABASE.find((c) => c.id === costumeId);
    return item?.imageUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80';
  };

  const effectiveCustomization: OutfitCustomization = currentCustomization || {
    costumeId: 'nhat-binh',
    costumeName: 'Áo Nhật Bình Cung Đình',
    gender: 'female',
    parts: {
      primaryRobeColor: '#BA3424',
      innerCollarColor: '#D4A043',
      bottomColor: '#221C18',
      sashColor: '#58734D',
    },
    pattern: 'lotus',
    accessories: ['folding_fan', 'pearl_necklace'],
    lastUpdated: Date.now(),
  };

  const refreshPosts = () => {
    setPosts(CommunityForumService.getCommunityPosts());
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between pt-20 pb-24 md:pb-12 px-4 sm:px-8 md:pr-14 lg:pr-16 max-w-7xl mx-auto w-full z-10 select-none">
      {/* Toast thông báo */}
      <AnimatePresence>
        {reviewToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#1C261A] border border-[#465A3D] text-[#78976A] text-xs font-sans font-semibold shadow-2xl flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-[#78976A]" />
            <span>{reviewToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#241A13] border border-[#423023] mb-3"
        >
          <MessageSquare className="w-4 h-4 text-[#D4A043]" />
          <span className="text-xs font-sans text-[#F5EFE6]">
            Không Gian Giao Lưu Sáng Tạo & Đánh Giá
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl font-serif font-bold text-[#F5EFE6] tracking-tight mb-2"
        >
          Diễn Đàn Việt Phục Gen Z
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-xs sm:text-sm text-[#BAA796] font-serif italic"
        >
          Nơi thế hệ trẻ khoe những bản phối cổ phục cách tân, chiêm ngưỡng tác phẩm cộng đồng và bình chọn điểm phong cách
        </motion.p>
      </div>

      {/* 2. Action Bar & Filter Tabs */}
      <div className="bg-[#241A13]/90 backdrop-blur-md border border-[#423023] rounded-3xl p-4 sm:p-5 shadow-xl mb-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Main Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#1C140E] border border-[#3E2C1E] w-full md:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#465A3D] text-[#F5EFE6] shadow-sm'
                  : 'text-[#BAA796] hover:text-[#F5EFE6]'
              }`}
            >
              Tất Cả ({posts.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('my_designs')}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'my_designs'
                  ? 'bg-[#465A3D] text-[#F5EFE6] shadow-sm'
                  : 'text-[#BAA796] hover:text-[#F5EFE6]'
              }`}
            >
              Của Tôi Tạo ({posts.filter((p) => p.isMyDesign).length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('top_rated')}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeTab === 'top_rated'
                  ? 'bg-[#465A3D] text-[#F5EFE6] shadow-sm'
                  : 'text-[#BAA796] hover:text-[#F5EFE6]'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-[#D4A043] fill-current" />
              <span>Được Đánh Giá Cao</span>
            </button>
          </div>

          {/* Right Action: Button Khoe tác phẩm của mình */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4A043] via-[#BA7A2A] to-[#8C5417] text-[#140D08] font-bold text-xs sm:text-sm font-sans shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Khoe Tác Phẩm Của Tôi</span>
            </button>
          </div>
        </div>

        {/* Secondary Filter Row: Search & Costume Category Dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-[#322319]">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E7B6C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên thiết kế, tác giả, thẻ #Y2K, #NhatBinh..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#140D08] border border-[#3E2C1E] text-xs font-sans text-[#F5EFE6] placeholder-[#8E7B6C] focus:outline-none focus:border-[#78976A]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E7B6C] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Costume Filter Dropdown */}
          <div className="w-full sm:w-64 flex-shrink-0">
            <select
              value={selectedCostumeFilter}
              onChange={(e) => setSelectedCostumeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#140D08] border border-[#3E2C1E] text-xs font-sans text-[#F5EFE6] focus:outline-none focus:border-[#78976A] cursor-pointer"
            >
              <option value="all">Tất cả loại Việt phục ({COSTUME_DATABASE.length})</option>
              {COSTUME_DATABASE.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Community Showcase Gallery */}
      {filteredPosts.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-[#241A13]/60 border border-[#423023] rounded-3xl p-8 mb-8">
          <div className="w-16 h-16 rounded-3xl bg-[#1C140E] border border-[#423023] flex items-center justify-center text-[#8E7B6C]">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#F5EFE6]">
            Không tìm thấy bản thiết kế phù hợp
          </h3>
          <p className="text-xs sm:text-sm font-sans text-[#BAA796] max-w-md">
            {activeTab === 'my_designs'
              ? 'Bạn chưa đăng tác phẩm nào lên Diễn đàn. Hãy bấm nút "Khoe Tác Phẩm Của Tôi" để chia sẻ bản phối bạn vừa tạo nhé!'
              : 'Hãy thử đổi từ khóa tìm kiếm hoặc chọn loại trang phục khác.'}
          </p>
          {activeTab === 'my_designs' && (
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#536B49] text-white text-xs font-sans font-medium"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng Tác Phẩm Đầu Tiên</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredPosts.map((post) => {
            const demoImg = getDemoImageForCostume(post.customization.costumeId);
            const ratingValue = post.rating || 4.9;
            const reviewCount = post.ratingCount || post.reviews?.length || 12;

            return (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedPost(post)}
                className="group relative rounded-3xl overflow-hidden bg-[#241A13]/90 border border-[#423023] hover:border-[#678858] shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Visual Frame */}
                  <div className="relative aspect-[16/10] w-full bg-[#140D08] overflow-hidden">
                    <img
                      src={demoImg}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#140D08] via-transparent to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="text-[10px] font-sans font-bold bg-[#140D08]/85 text-[#F5EFE6] px-2.5 py-1 rounded-full border border-[#465A3D] backdrop-blur-sm">
                        {post.customization.costumeName}
                      </span>

                      {/* Cultural or Rating Badge */}
                      <span className="text-[10px] font-sans font-semibold bg-[#293623]/90 text-[#78976A] px-2.5 py-1 rounded-full border border-[#465A3D] flex items-center gap-1 backdrop-blur-sm">
                        <Star className="w-3 h-3 text-[#D4A043] fill-current" />
                        <span>{ratingValue} ({reviewCount})</span>
                      </span>
                    </div>

                    {/* Delete button if my design */}
                    {post.isMyDesign && (
                      <button
                        type="button"
                        onClick={(e) => handleDeletePost(post.id, e)}
                        className="absolute bottom-3 right-3 z-10 w-7 h-7 rounded-full bg-[#140D08]/85 hover:bg-[#872013] text-[#BAA796] hover:text-white flex items-center justify-center border border-[#423023] transition-colors"
                        title="Xóa bài đăng của bạn"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Color Swatches On Photo */}
                    <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 p-1.5 rounded-full bg-[#140D08]/80 border border-[#3E2C1E] backdrop-blur-sm">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/40"
                        title="Vạt áo ngoài"
                        style={{ backgroundColor: post.customization.parts.primaryRobeColor }}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/40"
                        title="Cổ áo trong"
                        style={{ backgroundColor: post.customization.parts.innerCollarColor }}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/40"
                        title="Quần/Váy"
                        style={{ backgroundColor: post.customization.parts.bottomColor }}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/40"
                        title="Thắt lưng"
                        style={{ backgroundColor: post.customization.parts.sashColor }}
                      />
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 sm:p-5 space-y-3">
                    {/* Author & Timestamp */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#1C140E] border border-[#3E2C1E] flex items-center justify-center text-sm">
                          {post.authorAvatar || '🌸'}
                        </div>
                        <div>
                          <p className="text-xs font-sans font-bold text-[#F5EFE6]">
                            {post.authorName}
                          </p>
                          <span className="text-[10px] font-sans text-[#8E7B6C]">
                            {post.createdAt}
                          </span>
                        </div>
                      </div>

                      {/* Like Button */}
                      <button
                        type="button"
                        onClick={(e) => handleLike(post.id, e)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans transition-all cursor-pointer ${
                          post.isLiked
                            ? 'bg-[#401812] text-[#E05243] border border-[#872013]'
                            : 'bg-[#1C140E] text-[#BAA796] hover:text-white border border-[#3E2C1E]'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span>{post.likesCount}</span>
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif font-bold text-base text-[#F5EFE6] leading-snug group-hover:text-[#F3C96B] transition-colors">
                      {post.title}
                    </h3>

                    {/* Description preview */}
                    {post.description && (
                      <p className="text-xs font-sans text-[#BAA796] line-clamp-2 leading-relaxed italic">
                        "{post.description}"
                      </p>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={`${post.id}-tag-${idx}`}
                          className="text-[10px] font-sans px-2 py-0.5 rounded bg-[#1C140E] text-[#78976A] border border-[#3E2C1E]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-4 pt-0 border-t border-[#322319] mt-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onApplyOutfit(post.customization);
                    }}
                    className="flex-1 py-2 px-3 rounded-full bg-[#1C140E] hover:bg-[#2A1D14] border border-[#423023] text-xs font-sans text-[#D8CCC0] hover:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Sao chép bản phối này sang xưởng tùy biến"
                  >
                    <Sliders className="w-3 h-3 text-[#D4A043]" />
                    <span>Lấy Bản Phối</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTryOnOutfit(post.customization);
                    }}
                    className="py-2 px-3.5 rounded-full bg-[#536B49] hover:bg-[#627C56] text-white text-xs font-sans font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    title="Ướm thử ngay trên ảnh chân dung"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Thử Đồ</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 4. Bottom Navigation Footer */}
      <div className="pt-4 border-t border-[#3E2C1E] flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onNavigateToCustomizer}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#1C140E] border border-[#423023] text-xs font-sans text-[#D8CCC0] hover:text-white transition-all cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-[#D4A043]" />
          <span>Về Xưởng Tùy Biến 2D</span>
        </button>

        <span className="text-xs font-sans text-[#8E7B6C] italic text-center">
          Dự án Việt Phục Gen Z · Nơi kết nối những tâm hồn yêu cổ phục Việt
        </span>
      </div>

      {/* 5. Modal Xem Chi Tiết & Viết Đánh Giá (Review Modal) */}
      <AnimatePresence>
        {selectedPost && (
          <div
            className="fixed inset-0 z-50 bg-[#0E0906]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="relative max-w-3xl w-full bg-[#1C140E] border border-[#423023] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#140D08]/80 text-[#BAA796] hover:text-white flex items-center justify-center border border-[#423023] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Scrollable Container */}
              <div className="overflow-y-auto p-6 space-y-6">
                {/* Hero Showcase Image */}
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#140D08] border border-[#3E2C1E]">
                  <img
                    src={getDemoImageForCostume(selectedPost.customization.costumeId)}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-[11px] font-sans font-bold bg-[#140D08]/85 text-[#F5EFE6] px-3 py-1 rounded-full border border-[#465A3D]">
                        {selectedPost.customization.costumeName}
                      </span>
                      <h3 className="font-serif font-bold text-2xl text-white mt-1.5 drop-shadow-md">
                        {selectedPost.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#293623] border border-[#465A3D] text-[#78976A] font-bold text-xs">
                      <Star className="w-3.5 h-3.5 text-[#D4A043] fill-current" />
                      <span>{selectedPost.rating || 4.9} / 5.0</span>
                    </div>
                  </div>
                </div>

                {/* Author Info & Badges */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#241A13] border border-[#423023]">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-1 bg-[#140D08] rounded-xl border border-[#3E2C1E]">
                      {selectedPost.authorAvatar || '🌸'}
                    </span>
                    <div>
                      <h4 className="text-sm font-sans font-bold text-[#F5EFE6]">
                        {selectedPost.authorName}
                      </h4>
                      <p className="text-xs font-sans text-[#8E7B6C]">
                        Đăng vào {selectedPost.createdAt} · {selectedPost.likesCount} lượt yêu thích
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleLike(selectedPost.id, e)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-sans font-medium transition-all ${
                        selectedPost.isLiked
                          ? 'bg-[#401812] text-[#E05243] border border-[#872013]'
                          : 'bg-[#140D08] text-[#BAA796] hover:text-white border border-[#3E2C1E]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${selectedPost.isLiked ? 'fill-current' : ''}`} />
                      <span>{selectedPost.isLiked ? 'Đã thích' : 'Thả tim'}</span>
                    </button>
                  </div>
                </div>

                {/* Description & Palette */}
                <div className="space-y-3">
                  <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#78976A]">
                    Ý Tưởng & Cảm Hứng Phối Đồ:
                  </h4>
                  <p className="text-sm font-sans text-[#D8CCC0] leading-relaxed">
                    {selectedPost.description || 'Bản phối mang tinh thần kết hợp hài hòa giữa nét cổ phong Đại Việt và thẩm mỹ đường phố Gen Z.'}
                  </p>

                  {/* Swatches breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                    <div className="p-2.5 rounded-xl bg-[#140D08] border border-[#3E2C1E] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border border-black/40" style={{ backgroundColor: selectedPost.customization.parts.primaryRobeColor }} />
                      <div className="overflow-hidden">
                        <span className="text-[10px] text-[#8E7B6C] block">Vạt áo ngoài</span>
                        <span className="text-xs font-sans text-white truncate block">{selectedPost.customization.parts.primaryRobeColor}</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#140D08] border border-[#3E2C1E] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border border-black/40" style={{ backgroundColor: selectedPost.customization.parts.innerCollarColor }} />
                      <div className="overflow-hidden">
                        <span className="text-[10px] text-[#8E7B6C] block">Cổ áo trong</span>
                        <span className="text-xs font-sans text-white truncate block">{selectedPost.customization.parts.innerCollarColor}</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#140D08] border border-[#3E2C1E] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border border-black/40" style={{ backgroundColor: selectedPost.customization.parts.bottomColor }} />
                      <div className="overflow-hidden">
                        <span className="text-[10px] text-[#8E7B6C] block">Quần / Váy</span>
                        <span className="text-xs font-sans text-white truncate block">{selectedPost.customization.parts.bottomColor}</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#140D08] border border-[#3E2C1E] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border border-black/40" style={{ backgroundColor: selectedPost.customization.parts.sashColor }} />
                      <div className="overflow-hidden">
                        <span className="text-[10px] text-[#8E7B6C] block">Thắt lưng</span>
                        <span className="text-xs font-sans text-white truncate block">{selectedPost.customization.parts.sashColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews & Community Rating Section */}
                <div className="space-y-3 pt-3 border-t border-[#322319]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#78976A]">
                      Đánh Giá & Nhận Xét Từ Cộng Đồng ({selectedPost.reviews?.length || 0}):
                    </h4>
                  </div>

                  {/* List of existing reviews */}
                  {selectedPost.reviews && selectedPost.reviews.length > 0 ? (
                    <div className="space-y-2.5">
                      {selectedPost.reviews.map((rev, revIdx) => (
                        <div key={rev.id || `rev-${revIdx}`} className="p-3.5 rounded-xl bg-[#140D08] border border-[#3E2C1E] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-sans font-bold text-[#F5EFE6]">
                              {rev.author}
                            </span>
                            <div className="flex items-center gap-0.5 text-[#D4A043]">
                              {[...Array(rev.stars)].map((_, sIdx) => (
                                <Star key={`star-${rev.id || revIdx}-${sIdx}`} className="w-3 h-3 fill-current" />
                              ))}
                              <span className="text-[10px] text-[#8E7B6C] ml-1.5">{rev.date}</span>
                            </div>
                          </div>
                          <p className="text-xs font-sans text-[#BAA796]">
                            {rev.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-sans text-[#8E7B6C] italic">
                      Chưa có đánh giá nào cho tác phẩm này. Hãy là người đầu tiên để lại nhận xét!
                    </p>
                  )}

                  {/* Form viết đánh giá */}
                  <form onSubmit={handleSubmitReview} className="p-4 rounded-2xl bg-[#241A13] border border-[#423023] space-y-3 mt-3">
                    <span className="text-xs font-sans font-bold text-[#F5EFE6] block">
                      Viết Đánh Giá Của Bạn:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        placeholder="Tên của bạn..."
                        className="px-3 py-2 rounded-xl bg-[#140D08] border border-[#3E2C1E] text-xs font-sans text-[#F5EFE6] focus:outline-none focus:border-[#78976A]"
                      />

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-sans text-[#BAA796]">Chấm điểm:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setReviewStars(s)}
                              className="cursor-pointer"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  s <= reviewStars ? 'text-[#D4A043] fill-current' : 'text-[#423023]'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={2}
                      placeholder="Nhận xét về hòa sắc, cách phối phụ kiện hoặc tính văn hóa của bộ đồ..."
                      className="w-full px-3 py-2 rounded-xl bg-[#140D08] border border-[#3E2C1E] text-xs font-sans text-[#F5EFE6] focus:outline-none focus:border-[#78976A]"
                      required
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-full bg-[#536B49] text-white text-xs font-sans font-medium flex items-center gap-1.5 shadow-sm hover:bg-[#627C56] cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Gửi Đánh Giá</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 border-t border-[#3E2C1E] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPost(null)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#140D08] border border-[#3E2C1E] text-xs font-sans text-[#BAA796] hover:text-white"
                  >
                    Đóng
                  </button>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        onApplyOutfit(selectedPost.customization);
                        setSelectedPost(null);
                      }}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#241A13] hover:bg-[#2A1D14] border border-[#423023] text-xs font-sans text-[#D8CCC0] hover:text-white cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5 text-[#D4A043]" />
                      <span>Áp Dụng Bản Phối Này</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onTryOnOutfit(selectedPost.customization);
                        setSelectedPost(null);
                      }}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-[#536B49] hover:bg-[#627C56] text-white text-xs font-sans font-semibold cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Thử Đồ Ảo</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Modal Đăng Tác Phẩm Lên Diễn Đàn */}
      <CommunityForumModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          refreshPosts();
        }}
        currentCustomization={effectiveCustomization}
        initialMode="publish"
        onPublished={refreshPosts}
        onApplyOutfit={(adopted) => {
          onApplyOutfit(adopted);
          setIsShareModalOpen(false);
        }}
        onTryOnOutfit={(tryOutfit) => {
          onTryOnOutfit(tryOutfit);
          setIsShareModalOpen(false);
        }}
      />
    </div>
  );
};
