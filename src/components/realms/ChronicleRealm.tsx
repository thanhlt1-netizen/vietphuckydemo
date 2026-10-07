import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookmarkCheck, 
  Download, 
  Trash2, 
  ArrowLeft, 
  Camera, 
  Sparkles, 
  Calendar,
  X,
  Share2,
  Edit3,
  Eye,
  Plus,
  FolderPlus,
  Folder,
  Layers,
  CheckCircle2,
  ChevronRight,
  Palette,
  ExternalLink,
  MoreVertical,
  Search,
  ArrowRight,
  Wand2
} from 'lucide-react';
import { LookbookAlbum, LookbookItem, LookbookSourceType } from '../../types/lookbook';
import { LookbookService, getCostumeImage } from '../../services/lookbookService';
import { OutfitCustomization } from '../../types/customization';
import { getCostumeDefaultColors } from '../../data/costumeDefaults';
import { ShareToSocialModal } from '../lookbook/ShareToSocialModal';

interface ChronicleRealmProps {
  onBackToTryOn?: () => void;
  onBackToHome: () => void;
  onNavigateToAtelier?: () => void;
  onQuickTryOn?: (customization: OutfitCustomization) => void;
}

export const ChronicleRealm: React.FC<ChronicleRealmProps> = ({
  onBackToTryOn,
  onBackToHome,
  onNavigateToAtelier,
  onQuickTryOn,
}) => {
  // Danh sách các album
  const [albums, setAlbums] = useState<LookbookAlbum[]>([]);
  // Album đang được chọn để xem chi tiết (nếu null -> hiển thị danh sách tất cả Album)
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  // Bộ lọc bên trong Album chi tiết
  const [filterSource, setFilterSource] = useState<'all' | LookbookSourceType>('all');

  // Modal tạo album mới
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState<boolean>(false);
  const [newAlbumName, setNewAlbumName] = useState<string>('');
  const [newAlbumDesc, setNewAlbumDesc] = useState<string>('');

  // Modal đổi tên album
  const [editingAlbum, setEditingAlbum] = useState<LookbookAlbum | null>(null);
  const [editAlbumNameValue, setEditAlbumNameValue] = useState<string>('');
  const [editAlbumDescValue, setEditAlbumDescValue] = useState<string>('');

  // Modal xóa album
  const [deletingAlbum, setDeletingAlbum] = useState<LookbookAlbum | null>(null);

  // Modal xem chi tiết mục (Lightbox)
  const [viewingItem, setViewingItem] = useState<LookbookItem | null>(null);

  // Modal đổi tên mục trang phục
  const [editingItem, setEditingItem] = useState<{ albumId: string; item: LookbookItem } | null>(null);
  const [editItemNameValue, setEditItemNameValue] = useState<string>('');

  // Modal xóa mục trang phục
  const [deletingItem, setDeletingItem] = useState<{ albumId: string; item: LookbookItem } | null>(null);

  // Modal Thử Đồ Nhanh (Quick Try-on)
  const [isQuickTryOnModalOpen, setIsQuickTryOnModalOpen] = useState<boolean>(false);
  const [quickTryOnSearch, setQuickTryOnSearch] = useState<string>('');
  const [quickTryOnFilter, setQuickTryOnFilter] = useState<'all' | LookbookSourceType>('all');

  // Modal Chia Sẻ Lên Mạng Xã Hội (Share to Social / Web Share API)
  const [sharingItemData, setSharingItemData] = useState<{ item: LookbookItem; albumName?: string } | null>(null);

  // Toast thông báo
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tải danh sách album từ service
  const loadAlbums = () => {
    const list = LookbookService.getAlbums();
    setAlbums(list);
  };

  useEffect(() => {
    loadAlbums();

    // Hỗ trợ mở trực tiếp tác phẩm được chia sẻ qua URL Hash (#lookbook-item-xxx)
    const checkHashForSharedItem = () => {
      try {
        const hash = window.location.hash;
        if (hash && hash.includes('lookbook-item-')) {
          const itemId = hash.replace('#lookbook-item-', '').trim();
          const allItems = LookbookService.getAllItems();
          const found = allItems.find((i) => i.id === itemId);
          if (found) {
            setViewingItem(found);
            if (found.albumId) {
              setSelectedAlbumId(found.albumId);
            }
            showToast(`Đang hiển thị tác phẩm chia sẻ: "${found.customName}"`);
          }
        }
      } catch (err) {
        console.warn('Lỗi đọc URL hash:', err);
      }
    };

    checkHashForSharedItem();
    window.addEventListener('hashchange', checkHashForSharedItem);
    return () => window.removeEventListener('hashchange', checkHashForSharedItem);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Album hiện tại đang xem (nếu có)
  const currentAlbum = albums.find((a) => a.id === selectedAlbumId);

  // ==========================================
  // XỬ LÝ ALBUM
  // ==========================================

  const handleOpenCreateAlbum = () => {
    setNewAlbumName('');
    setNewAlbumDesc('');
    setIsCreateAlbumOpen(true);
  };

  const handleConfirmCreateAlbum = () => {
    const trimmed = newAlbumName.trim();
    if (!trimmed) {
      showToast('Vui lòng nhập tên cho Lookbook!');
      return;
    }

    const created = LookbookService.createAlbum(trimmed, newAlbumDesc);
    loadAlbums();
    setIsCreateAlbumOpen(false);
    showToast(`Đã tạo Lookbook "${created.name}" thành công!`);
    // Tự động mở album vừa tạo
    setSelectedAlbumId(created.id);
  };

  const handleOpenRenameAlbum = (album: LookbookAlbum, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingAlbum(album);
    setEditAlbumNameValue(album.name);
    setEditAlbumDescValue(album.description || '');
  };

  const handleConfirmRenameAlbum = () => {
    if (!editingAlbum) return;
    const trimmed = editAlbumNameValue.trim();
    if (!trimmed) {
      showToast('Tên album không được để trống!');
      return;
    }

    LookbookService.updateAlbum(editingAlbum.id, trimmed, editAlbumDescValue);
    loadAlbums();
    setEditingAlbum(null);
    showToast('Đã đổi tên Lookbook thành công!');
  };

  const handleOpenDeleteAlbum = (album: LookbookAlbum, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDeletingAlbum(album);
  };

  const handleConfirmDeleteAlbum = () => {
    if (!deletingAlbum) return;
    LookbookService.deleteAlbum(deletingAlbum.id);
    loadAlbums();
    if (selectedAlbumId === deletingAlbum.id) {
      setSelectedAlbumId(null);
    }
    setDeletingAlbum(null);
    showToast('Đã xóa Lookbook!');
  };

  // ==========================================
  // XỬ LÝ MỤC TRONG ALBUM
  // ==========================================

  const handleOpenRenameItem = (albumId: string, item: LookbookItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingItem({ albumId, item });
    setEditItemNameValue(item.customName);
  };

  const handleConfirmRenameItem = () => {
    if (!editingItem) return;
    const trimmed = editItemNameValue.trim();
    if (!trimmed) {
      showToast('Tên tác phẩm không được để trống!');
      return;
    }

    LookbookService.updateItemName(editingItem.albumId, editingItem.item.id, trimmed);
    loadAlbums();
    if (viewingItem?.id === editingItem.item.id) {
      setViewingItem((prev) => prev ? { ...prev, customName: trimmed } : null);
    }
    setEditingItem(null);
    showToast('Đã đổi tên thành công!');
  };

  const handleOpenDeleteItem = (albumId: string, item: LookbookItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDeletingItem({ albumId, item });
  };

  const handleConfirmDeleteItem = () => {
    if (!deletingItem) return;
    LookbookService.deleteItem(deletingItem.albumId, deletingItem.item.id);
    loadAlbums();
    if (viewingItem?.id === deletingItem.item.id) {
      setViewingItem(null);
    }
    setDeletingItem(null);
    showToast('Đã xóa mục khỏi Lookbook!');
  };

  const handleShareItem = (item: LookbookItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const album = albums.find((a) => a.id === (item.albumId || selectedAlbumId));
    setSharingItemData({ item, albumName: album?.name });
  };

  const handleDownloadItem = (item: LookbookItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const filename = `vietphuc-${item.type}-${item.costumeId}-${Date.now()}.jpg`;
    LookbookService.downloadImage(item.imageUrl, filename);
    showToast('Đang tải ảnh xuống máy...');
  };

  // Lọc items trong album hiện tại
  const filteredItems = currentAlbum
    ? currentAlbum.items.filter((item) => {
        if (filterSource === 'all') return true;
        return item.type === filterSource;
      })
    : [];

  // Tập hợp toàn bộ tác phẩm đã lưu trong tất cả album cho tính năng Thử Đồ Nhanh
  const allSavedItems: LookbookItem[] = albums.flatMap((a) =>
    a.items.map((it) => ({ ...it, albumId: it.albumId || a.id }))
  );

  // Chuyển đổi một LookbookItem thành OutfitCustomization để đưa vào Virtual Try-On
  const convertItemToCustomization = (item: LookbookItem): OutfitCustomization => {
    if (item.customizationData && item.customizationData.parts) {
      return {
        ...item.customizationData,
        costumeId: item.customizationData.costumeId || item.costumeId,
        costumeName: item.customizationData.costumeName || item.costumeName,
        gender: item.customizationData.gender || item.gender || 'female',
        lastUpdated: Date.now(),
      };
    }
    if (item.appliedPayload && item.appliedPayload.customizationColors) {
      return {
        costumeId: item.appliedPayload.costumeId || item.costumeId,
        costumeName: item.appliedPayload.costumeName || item.costumeName,
        gender: item.appliedPayload.gender || item.gender || 'female',
        parts: item.appliedPayload.customizationColors,
        pattern: item.appliedPayload.pattern || 'lotus',
        accessories: item.appliedPayload.accessories || [],
        lastUpdated: Date.now(),
      };
    }
    const defaultColors = getCostumeDefaultColors(item.costumeId);
    return {
      costumeId: item.costumeId,
      costumeName: item.costumeName,
      gender: item.gender || 'female',
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
  };

  // Kích hoạt tính năng Thử Đồ Nhanh (Quick Try-on)
  const handleQuickTryOn = (item: LookbookItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const customDesign = convertItemToCustomization(item);
    showToast(`Đang áp dụng "${item.customName}" vào phòng Thử Đồ Ảo...`);
    setIsQuickTryOnModalOpen(false);
    setViewingItem(null);
    setTimeout(() => {
      if (onQuickTryOn) {
        onQuickTryOn(customDesign);
      } else if (onBackToTryOn) {
        onBackToTryOn();
      }
    }, 280);
  };

  // Lọc danh sách trang phục cho modal Thử Đồ Nhanh
  const filteredQuickTryOnItems = allSavedItems.filter((item) => {
    if (quickTryOnFilter !== 'all' && item.type !== quickTryOnFilter) {
      return false;
    }
    if (quickTryOnSearch.trim()) {
      const q = quickTryOnSearch.toLowerCase().trim();
      const nameMatch = item.customName?.toLowerCase().includes(q);
      const costumeMatch = item.costumeName?.toLowerCase().includes(q);
      const noteMatch = (item.note || item.culturalNote || '')?.toLowerCase().includes(q);
      return Boolean(nameMatch || costumeMatch || noteMatch);
    }
    return true;
  });

  // Lắng nghe phím Escape để đóng các modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (sharingItemData) {
          setSharingItemData(null);
        } else if (isQuickTryOnModalOpen) {
          setIsQuickTryOnModalOpen(false);
        } else if (viewingItem) {
          setViewingItem(null);
        } else if (isCreateAlbumOpen) {
          setIsCreateAlbumOpen(false);
        } else if (editingAlbum) {
          setEditingAlbum(null);
        } else if (deletingAlbum) {
          setDeletingAlbum(null);
        } else if (editingItem) {
          setEditingItem(null);
        } else if (deletingItem) {
          setDeletingItem(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    sharingItemData,
    isQuickTryOnModalOpen,
    viewingItem,
    isCreateAlbumOpen,
    editingAlbum,
    deletingAlbum,
    editingItem,
    deletingItem,
  ]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between pt-20 pb-24 md:pb-12 px-4 sm:px-8 md:pr-14 lg:pr-16 max-w-6xl mx-auto w-full z-10 select-none">
      {/* Toast thông báo */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#241A13]/95 border border-[#D4A043]/70 text-[#F5EFE6] text-xs font-sans shadow-2xl backdrop-blur-md flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#78976A]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* HEADER SECTION & BREADCRUMB                                               */}
      {/* ========================================================================= */}
      <div className="text-center max-w-4xl mx-auto mb-6">
        {/* Breadcrumb khi đang xem Album chi tiết */}
        {selectedAlbumId && currentAlbum ? (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <button
              type="button"
              onClick={() => setSelectedAlbumId(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1C140E] hover:bg-[#2A1D14] border border-[#423023] hover:border-[#78976A] text-xs font-sans text-[#D8CCC0] hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Tất cả Lookbook</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsQuickTryOnModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D4A043] to-[#BA8A30] hover:from-[#E2B155] text-[#140D08] text-xs font-serif font-bold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#F3C96B]/60"
                title="Mở bảng Thử Đồ Nhanh"
              >
                <Wand2 className="w-3.5 h-3.5 text-[#140D08]" />
                <span>Thử Đồ Nhanh</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenRenameAlbum(currentAlbum)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C140E] hover:bg-[#2F2117] border border-[#423023] text-xs font-sans text-[#BAA796] hover:text-[#F3C96B] transition-colors cursor-pointer"
                title="Đổi tên album này"
              >
                <Edit3 className="w-3 h-3" />
                <span className="hidden sm:inline">Đổi tên album</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenDeleteAlbum(currentAlbum)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C140E] hover:bg-[#872013] border border-[#423023] text-xs font-sans text-[#BAA796] hover:text-white transition-colors cursor-pointer"
                title="Xóa album này"
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden sm:inline">Xóa album</span>
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#241A13] border border-[#423023] mb-3 shadow-md"
          >
            <BookmarkCheck className="w-4 h-4 text-[#D4A043]" />
            <span className="text-xs font-sans text-[#F5EFE6]">
              Bộ Sưu Tập Lookbook Việt Phục
            </span>
          </motion.div>
        )}

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl font-serif font-bold text-[#F5EFE6] tracking-tight mb-2"
        >
          {selectedAlbumId && currentAlbum ? currentAlbum.name : 'Lookbook Theo Album'}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-xs sm:text-sm text-[#BAA796] font-serif italic mb-6 max-w-2xl mx-auto"
        >
          {selectedAlbumId && currentAlbum
            ? (currentAlbum.description || `Bộ sưu tập gồm ${currentAlbum.items.length} bộ trang phục`)
            : 'Tổ chức các tác phẩm Tùy chỉnh (Design) và Thử đồ ảo (Try-on) theo từng album riêng biệt'}
        </motion.p>

        {/* NÚT THAO TÁC / BỘ LỌC PHÙ HỢP CHO TỪNG GIAO DIỆN */}
        {!selectedAlbumId ? (
          // Ở màn hình tất cả Album: Nút "Thử Đồ Nhanh" & "+ Tạo Lookbook mới"
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsQuickTryOnModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4A043] via-[#BA8A30] to-[#8E6319] hover:from-[#E2B155] hover:to-[#A37320] text-[#140D08] text-xs font-serif font-bold border border-[#F3C96B]/80 shadow-[0_0_20px_rgba(212,160,67,0.35)] cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <Wand2 className="w-4 h-4 text-[#140D08]" />
              <span>Thử Đồ Nhanh (Quick Try-on)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/25 text-[#140D08] font-mono font-bold">
                {allSavedItems.length}
              </span>
            </button>

            <button
              type="button"
              onClick={handleOpenCreateAlbum}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#465A3D] to-[#36472F] hover:from-[#536B49] hover:to-[#42583A] text-white text-xs font-serif font-bold border border-[#78976A]/60 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <FolderPlus className="w-4 h-4 text-[#F3C96B]" />
              <span>Tạo Lookbook Mới</span>
            </button>
          </div>
        ) : (
          // Ở màn hình chi tiết Album: Bộ lọc phân loại Nguồn Design / Try-on
          <div className="inline-flex p-1.5 rounded-2xl bg-[#1C140E]/90 border border-[#423023] shadow-lg">
            <button
              type="button"
              onClick={() => setFilterSource('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                filterSource === 'all'
                  ? 'bg-gradient-to-r from-[#465A3D] to-[#36472F] text-white shadow-md border border-[#78976A]/50'
                  : 'text-[#BAA796] hover:text-[#F5EFE6] hover:bg-[#241A13]/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#F3C96B]" />
              <span>Tất cả</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/40 text-[#F5EFE6]">
                {currentAlbum ? currentAlbum.items.length : 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterSource('design')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                filterSource === 'design'
                  ? 'bg-gradient-to-r from-[#465A3D] to-[#36472F] text-white shadow-md border border-[#78976A]/50'
                  : 'text-[#BAA796] hover:text-[#F5EFE6] hover:bg-[#241A13]/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#78976A]" />
              <span>Bản Phối Thiết Kế</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/40 text-[#F5EFE6]">
                {currentAlbum ? currentAlbum.items.filter((i) => i.type === 'design').length : 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterSource('tryon')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                filterSource === 'tryon'
                  ? 'bg-gradient-to-r from-[#465A3D] to-[#36472F] text-white shadow-md border border-[#78976A]/50'
                  : 'text-[#BAA796] hover:text-[#F5EFE6] hover:bg-[#241A13]/60'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-[#D4A043]" />
              <span>Ảnh Thử Đồ Ảo</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/40 text-[#F5EFE6]">
                {currentAlbum ? currentAlbum.items.filter((i) => i.type === 'tryon').length : 0}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* NỘI DUNG CHÍNH (MAIN WORKSPACE)                                           */}
      {/* ========================================================================= */}
      <div className="flex-1 mb-8">
        {!selectedAlbumId ? (
          // ================= VIEW 1: DANH SÁCH CÁC ALBUM (PLAYLISTS GRID) =================
          albums.length === 0 ? (
            <div className="my-auto py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#241A13] border border-[#423023] flex items-center justify-center text-[#D4A043] shadow-inner">
                <FolderPlus className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#F5EFE6]">
                Chưa có Lookbook nào
              </h3>
              <p className="text-sm font-sans text-[#BAA796] max-w-md">
                Bấm vào nút bên dưới để tạo album Lookbook đầu tiên của bạn.
              </p>
              <button
                type="button"
                onClick={handleOpenCreateAlbum}
                className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#536B49] to-[#3B4D33] text-white text-xs font-sans font-medium shadow-md hover:scale-105 transition-all cursor-pointer border border-[#78976A]/40"
              >
                <Plus className="w-4 h-4 text-[#F3C96B]" />
                <span>Tạo Lookbook Mới</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album, aIdx) => {
                const count = album.items?.length || 0;
                const designCount = album.items?.filter((i) => i.type === 'design').length || 0;
                const tryonCount = album.items?.filter((i) => i.type === 'tryon').length || 0;

                return (
                  <motion.div
                    key={`${album.id}-${aIdx}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setSelectedAlbumId(album.id)}
                    className="group relative rounded-3xl overflow-hidden bg-[#241A13]/90 border border-[#423023] hover:border-[#D4A043]/70 shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    {/* Bìa Album (Cover Thumbnail) */}
                    <div className="relative aspect-[16/10] w-full bg-[#140D08] overflow-hidden">
                      {album.coverImageUrl ? (
                        <img
                          src={album.coverImageUrl}
                          alt={album.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#1A120C] text-[#8E7B6C]">
                          <Folder className="w-12 h-12 stroke-[1.2]" />
                          <span className="text-xs font-sans mt-2">Album trống</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />

                      {/* Badge số lượng bộ bên trong (Góc trên phải) */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center gap-1.5 text-xs font-sans font-bold bg-[#140D08]/90 text-[#F5EFE6] px-3 py-1 rounded-full border border-[#D4A043]/70 shadow-md backdrop-blur-md">
                          <Layers className="w-3.5 h-3.5 text-[#F3C96B]" />
                          <span>{count} bộ</span>
                        </span>
                      </div>

                      {/* Nút hành động nhanh trên Album (Đổi tên / Xóa) */}
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => handleOpenRenameAlbum(album, e)}
                          className="w-7 h-7 rounded-full bg-[#140D08]/85 hover:bg-[#342418] text-[#BAA796] hover:text-[#F3C96B] flex items-center justify-center transition-colors cursor-pointer border border-[#423023]"
                          title="Đổi tên album"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenDeleteAlbum(album, e)}
                          className="w-7 h-7 rounded-full bg-[#140D08]/85 hover:bg-[#872013] text-[#BAA796] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#423023]"
                          title="Xóa album"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Phân loại nhanh Design & Try-on ở đáy ảnh bìa */}
                      <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-xs text-[#D8CCC0]">
                        <div className="flex items-center gap-2 text-[11px] font-sans">
                          {designCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-[#1C261A]/90 text-[#78976A] border border-[#465A3D]">
                              {designCount} Design
                            </span>
                          )}
                          {tryonCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-[#2D2111]/90 text-[#D4A043] border border-[#7A5A20]">
                              {tryonCount} Try-on
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-[#8E7B6C] flex items-center gap-1 font-sans">
                          <Calendar className="w-3 h-3" />
                          {album.createdAt}
                        </span>
                      </div>
                    </div>

                    {/* Thông tin mô tả Album */}
                    <div className="p-4 space-y-1 text-left flex-1">
                      <h3 className="font-serif font-bold text-lg text-[#F5EFE6] tracking-wide group-hover:text-[#F3C96B] transition-colors line-clamp-1">
                        {album.name}
                      </h3>
                      <p className="text-xs font-sans text-[#BAA796] line-clamp-2 leading-relaxed">
                        {album.description || 'Bộ sưu tập trang phục truyền thống Việt Nam'}
                      </p>
                    </div>

                    {/* Nút Khám Phá Album */}
                    <div className="px-4 pb-4 pt-1 flex items-center justify-between text-xs font-sans text-[#D4A043] font-medium border-t border-[#3E2C1E]/50">
                      <span>Khám phá toàn bộ album</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )
        ) : (
          // ================= VIEW 2: CHI TIẾT CÁC BỘ TRONG 1 ALBUM =================
          filteredItems.length === 0 ? (
            <div className="my-auto py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#241A13] border border-[#423023] flex items-center justify-center text-[#78976A] shadow-inner">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#F5EFE6]">
                Lookbook này chưa có bộ trang phục nào
              </h3>
              <p className="text-sm font-sans text-[#BAA796] max-w-md">
                Hãy đến trang <strong>Tùy chỉnh</strong> để sáng tạo hoặc trang <strong>Thử đồ ảo</strong> để chụp diện mạo, rồi lưu vào album này!
              </p>
              <div className="flex items-center gap-3 pt-2">
                {onNavigateToAtelier && (
                  <button
                    type="button"
                    onClick={onNavigateToAtelier}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#536B49] to-[#3B4D33] text-white text-xs font-sans font-medium shadow-md hover:scale-105 transition-all cursor-pointer border border-[#78976A]/40"
                  >
                    <Sparkles className="w-4 h-4 text-[#F3C96B]" />
                    <span>Đến Xưởng Tùy Chỉnh</span>
                  </button>
                )}
                {onBackToTryOn && (
                  <button
                    type="button"
                    onClick={onBackToTryOn}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C140E] hover:bg-[#2A1D14] text-[#D8CCC0] hover:text-white text-xs font-sans font-medium shadow-sm transition-all cursor-pointer border border-[#423023]"
                  >
                    <Camera className="w-4 h-4 text-[#D4A043]" />
                    <span>Thử Đồ Ảo Ngay</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={`${item.id}-${item.albumId || 'album'}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setViewingItem(item)}
                  className="group relative rounded-3xl overflow-hidden bg-[#241A13]/90 border border-[#423023] hover:border-[#D4A043]/70 shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  {/* Khung ảnh đúng của bộ */}
                  <div className="relative aspect-[4/3] w-full bg-[#140D08] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.customName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35" />

                    {/* Badge phân biệt rõ nguồn: Design hoặc Try-on + Nút thao tác nhanh */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className={`text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md shadow-sm ${
                        item.type === 'design'
                          ? 'bg-[#1C261A]/90 text-[#78976A] border-[#465A3D]'
                          : 'bg-[#2D2111]/90 text-[#D4A043] border-[#7A5A20]'
                      }`}>
                        {item.type === 'design' ? 'Bản Phối Thiết Kế' : 'Ảnh Thử Đồ Ảo'} · {item.costumeName}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleQuickTryOn(item, e)}
                          className="w-7 h-7 rounded-full bg-gradient-to-r from-[#D4A043] to-[#BA8A30] hover:from-[#E2B155] text-[#140D08] flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-md"
                          title="Thử đồ nhanh bộ này ngay"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenRenameItem(item.albumId || currentAlbum?.id || '', item, e)}
                          className="w-7 h-7 rounded-full bg-[#140D08]/85 hover:bg-[#342418] text-[#BAA796] hover:text-[#F3C96B] flex items-center justify-center transition-colors cursor-pointer border border-[#423023]"
                          title="Đổi tên bộ này"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenDeleteItem(item.albumId || currentAlbum?.id || '', item, e)}
                          className="w-7 h-7 rounded-full bg-[#140D08]/85 hover:bg-[#872013] text-[#BAA796] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#423023]"
                          title="Xóa khỏi album"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Ngày lưu & Chi tiết phụ */}
                    <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-white text-xs">
                      {/* Nếu là Design: bảng 4 màu thu nhỏ */}
                      {item.type === 'design' && item.customizationData?.parts && (
                        <div className="flex items-center gap-1.5 bg-[#140D08]/80 px-2 py-1 rounded-full border border-[#423023]">
                          <span 
                            className="w-3 h-3 rounded-full border border-white/30" 
                            style={{ backgroundColor: item.customizationData.parts.primaryRobeColor }}
                            title="Vạt áo"
                          />
                          <span 
                            className="w-3 h-3 rounded-full border border-white/30" 
                            style={{ backgroundColor: item.customizationData.parts.innerCollarColor }}
                            title="Cổ / Yếm"
                          />
                          <span 
                            className="w-3 h-3 rounded-full border border-white/30" 
                            style={{ backgroundColor: item.customizationData.parts.sashColor }}
                            title="Thắt lưng"
                          />
                          <span 
                            className="w-3 h-3 rounded-full border border-white/30" 
                            style={{ backgroundColor: item.customizationData.parts.bottomColor }}
                            title="Quần/Váy"
                          />
                        </div>
                      )}

                      {/* Nếu là Try-on: badge chân dung */}
                      {item.type === 'tryon' && (
                        <span className="text-[10px] font-sans text-[#D8CCC0] bg-[#140D08]/80 px-2 py-0.5 rounded-full border border-[#423023] flex items-center gap-1">
                          <Camera className="w-3 h-3 text-[#F3C96B]" />
                          <span>Chân dung</span>
                        </span>
                      )}

                      <span className="text-[10px] font-sans text-[#BAA796] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#78976A]" />
                        {item.savedAt}
                      </span>
                    </div>
                  </div>

                  {/* Thông tin chi tiết */}
                  <div className="p-4 space-y-1.5 text-left">
                    <h3 className="font-serif font-bold text-base text-[#F5EFE6] tracking-wide line-clamp-1 group-hover:text-[#F3C96B] transition-colors">
                      {item.customName}
                    </h3>
                    <p className="text-xs font-sans text-[#BAA796] line-clamp-1">
                      {item.note || item.culturalNote || `Trang phục ${item.costumeName} lưu trữ trong ${currentAlbum?.name || 'Lookbook'}`}
                    </p>
                  </div>

                  {/* Hàng nút hành động: Xem ảnh, Thử đồ, Đổi tên, Tải xuống, Chia sẻ, Xóa */}
                  <div className="px-4 pb-4 pt-2 border-t border-[#3E2C1E]/60 flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => setViewingItem(item)}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-[#1C140E] hover:bg-[#2F2117] text-[#D8CCC0] hover:text-[#F5EFE6] text-xs font-sans flex items-center justify-center gap-1 border border-[#423023] transition-colors"
                      title="Xem ảnh chi tiết"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#F3C96B]" />
                      <span>Xem ảnh</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleQuickTryOn(item, e)}
                      className="py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-[#D4A043] to-[#BA8A30] hover:from-[#E2B155] hover:to-[#A37320] text-[#140D08] hover:text-[#000] text-xs font-serif font-bold flex items-center justify-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      title="Áp dụng ngay vào mô hình thử đồ ảo"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Thử đồ</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleOpenRenameItem(item.albumId || currentAlbum?.id || '', item, e)}
                      className="p-1.5 rounded-xl bg-[#1C140E] hover:bg-[#2F2117] text-[#BAA796] hover:text-[#F3C96B] border border-[#423023] transition-colors"
                      title="Đổi tên bộ trang phục"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleShareItem(item, e)}
                      className="p-1.5 rounded-xl bg-[#1C140E] hover:bg-[#2A3B24] text-[#78976A] hover:text-[#A1C990] border border-[#423023] hover:border-[#78976A] transition-all cursor-pointer shadow-sm hover:scale-110 active:scale-95"
                      title="Chia sẻ lên Mạng Xã Hội (Web Share API)"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDownloadItem(item, e)}
                      className="p-1.5 rounded-xl bg-[#1C140E] hover:bg-[#2F2117] text-[#BAA796] hover:text-[#F5EFE6] border border-[#423023] transition-colors"
                      title="Tải ảnh xuống máy"
                    >
                      <Download className="w-3.5 h-3.5 text-[#D4A043]" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleOpenDeleteItem(item.albumId || currentAlbum?.id || '', item, e)}
                      className="p-1.5 rounded-xl bg-[#1C140E] hover:bg-[#872013] text-[#BAA796] hover:text-white border border-[#423023] transition-colors"
                      title="Xóa mục này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>

      {/* ========================================================================= */}
      {/* FOOTER NAVIGATION                                                         */}
      {/* ========================================================================= */}
      <div className="pt-4 border-t border-[#3E2C1E] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedAlbumId ? (
            <button
              type="button"
              onClick={() => setSelectedAlbumId(null)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C140E] border border-[#423023] text-xs font-sans text-[#D8CCC0] hover:text-white transition-all cursor-pointer hover:border-[#78976A]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Danh Sách Lookbook</span>
            </button>
          ) : onNavigateToAtelier ? (
            <button
              type="button"
              onClick={onNavigateToAtelier}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C140E] border border-[#423023] text-xs font-sans text-[#D8CCC0] hover:text-white transition-all cursor-pointer hover:border-[#78976A]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F3C96B]" />
              <span>Đến Xưởng Tùy Chỉnh</span>
            </button>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#465A3D] to-[#36472F] hover:from-[#536B49] hover:to-[#42583A] border border-[#78976A]/60 text-xs font-serif font-bold text-[#F5EFE6] transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
        >
          <span>Về Màn Hình Chính</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: TẠO LOOKBOOK MỚI NGAY TRÊN TRANG                                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCreateAlbumOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0E0906]/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsCreateAlbumOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative max-w-md w-full bg-[#241A13] border border-[#78976A]/60 rounded-3xl p-6 shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-2xl bg-[#36472F] flex items-center justify-center text-[#F3C96B]">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#F5EFE6]">
                  Tạo Lookbook Mới
                </h3>
              </div>
              <p className="text-xs font-sans text-[#BAA796] mb-4">
                Tạo một album mới để nhóm các bộ trang phục theo chủ đề riêng:
              </p>

              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-[11px] font-sans text-[#BAA796] block mb-1">
                    Tên Lookbook (bắt buộc):
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    placeholder="VD: Đi chơi Tết 2026, Chụp ảnh Hội An..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1C140E] border border-[#423023] focus:border-[#D4A043] text-sm text-[#F5EFE6] placeholder-[#6E5D4E] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-sans text-[#BAA796] block mb-1">
                    Mô tả ngắn (tùy chọn):
                  </label>
                  <input
                    type="text"
                    value={newAlbumDesc}
                    onChange={(e) => setNewAlbumDesc(e.target.value)}
                    placeholder="VD: Tuyển tập các bức ảnh áo tấc và áo dài cưới..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1C140E] border border-[#423023] focus:border-[#D4A043] text-sm text-[#F5EFE6] placeholder-[#6E5D4E] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateAlbumOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#1C140E] border border-[#423023] text-xs font-sans text-[#BAA796] hover:text-white cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCreateAlbum}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-[#465A3D] to-[#36472F] hover:from-[#536B49] text-white text-xs font-sans font-medium border border-[#78976A]/50 shadow-md cursor-pointer"
                >
                  Tạo Lookbook
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: ĐỔI TÊN ALBUM                                                    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0E0906]/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setEditingAlbum(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative max-w-md w-full bg-[#241A13] border border-[#D4A043]/60 rounded-3xl p-6 shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif font-bold text-lg text-[#F5EFE6] mb-1">
                Đổi Tên Lookbook
              </h3>
              <p className="text-xs font-sans text-[#BAA796] mb-4">
                Chỉnh sửa tên và mô tả của album:
              </p>

              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-[11px] font-sans text-[#BAA796] block mb-1">
                    Tên album:
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={editAlbumNameValue}
                    onChange={(e) => setEditAlbumNameValue(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1C140E] border border-[#423023] focus:border-[#D4A043] text-sm text-[#F5EFE6] placeholder-[#6E5D4E] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-sans text-[#BAA796] block mb-1">
                    Mô tả:
                  </label>
                  <input
                    type="text"
                    value={editAlbumDescValue}
                    onChange={(e) => setEditAlbumDescValue(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1C140E] border border-[#423023] focus:border-[#D4A043] text-sm text-[#F5EFE6] placeholder-[#6E5D4E] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingAlbum(null)}
                  className="px-4 py-2 rounded-full bg-[#1C140E] border border-[#423023] text-xs font-sans text-[#BAA796] hover:text-white cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRenameAlbum}
                  className="px-5 py-2 rounded-full bg-[#465A3D] hover:bg-[#536B49] text-white text-xs font-sans font-medium border border-[#78976A]/50 shadow-md cursor-pointer"
                >
                  Cập nhật
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: XÓA ALBUM                                                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {deletingAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0E0906]/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setDeletingAlbum(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative max-w-sm w-full bg-[#241A13] border border-[#872013]/60 rounded-3xl p-6 shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif font-bold text-lg text-[#F5EFE6] mb-1">
                Xóa Lookbook Này?
              </h3>
              <p className="text-xs font-sans text-[#BAA796] leading-relaxed mb-5">
                Bạn có chắc chắn muốn xóa album <strong className="text-[#F5EFE6]">"{deletingAlbum.name}"</strong> cùng toàn bộ {deletingAlbum.items?.length || 0} bộ trang phục bên trong?
              </p>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeletingAlbum(null)}
                  className="px-4 py-2 rounded-full bg-[#1C140E] border border-[#423023] text-xs font-sans text-[#BAA796] hover:text-white cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteAlbum}
                  className="px-5 py-2 rounded-full bg-[#872013] hover:bg-[#A32818] text-white text-xs font-sans font-medium shadow-md cursor-pointer"
                >
                  Xác nhận Xóa Album
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 4: XEM ẢNH CHI TIẾT (LIGHTBOX)                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {viewingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0E0906]/92 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setViewingItem(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              className="relative max-w-2xl w-full bg-[#241A13] border border-[#423023] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#140D08]/85 text-white flex items-center justify-center border border-[#423023] hover:border-[#D4A043] cursor-pointer"
              >
                <X className="w-4 h-4 text-[#F3C96B]" />
              </button>

              <div className="relative aspect-[16/11] w-full bg-[#140D08] overflow-hidden">
                <img
                  src={viewingItem.imageUrl}
                  alt={viewingItem.customName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-4 text-left">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[11px] font-sans font-semibold px-2.5 py-0.5 rounded-full border ${
                        viewingItem.type === 'design'
                          ? 'bg-[#1C261A] text-[#78976A] border-[#465A3D]'
                          : 'bg-[#2D2111] text-[#D4A043] border-[#7A5A20]'
                      }`}>
                        {viewingItem.type === 'design' ? 'Bản Phối Thiết Kế' : 'Ảnh Thử Đồ Ảo'}
                      </span>
                      <span className="text-xs font-serif text-[#D8CCC0]">
                        {viewingItem.costumeName}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-2xl text-[#F5EFE6]">
                      {viewingItem.customName}
                    </h3>
                  </div>

                  <span className="text-xs font-sans text-[#BAA796] flex items-center gap-1 shrink-0 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-[#78976A]" />
                    {viewingItem.savedAt}
                  </span>
                </div>

                {/* Nếu là Design: chi tiết màu sắc */}
                {viewingItem.type === 'design' && viewingItem.customizationData?.parts && (
                  <div className="p-3.5 rounded-2xl bg-[#1C140E]/90 border border-[#3E2C1E] space-y-2">
                    <span className="text-xs font-sans font-semibold text-[#BAA796] flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-[#F3C96B]" />
                      Bảng màu tùy biến:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: viewingItem.customizationData.parts.primaryRobeColor }}
                        />
                        <span className="text-[#D8CCC0] text-[11px]">Vạt áo chính</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: viewingItem.customizationData.parts.innerCollarColor }}
                        />
                        <span className="text-[#D8CCC0] text-[11px]">Cổ / Yếm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: viewingItem.customizationData.parts.sashColor }}
                        />
                        <span className="text-[#D8CCC0] text-[11px]">Dải thắt lưng</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: viewingItem.customizationData.parts.bottomColor }}
                        />
                        <span className="text-[#D8CCC0] text-[11px]">Quần / Váy</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nếu là Try-on: hiển thị ghi chú văn hóa */}
                {viewingItem.type === 'tryon' && viewingItem.culturalNote && (
                  <p className="text-xs sm:text-sm font-sans text-[#D8CCC0] leading-relaxed italic bg-[#1C140E]/60 p-3 rounded-2xl border border-[#3E2C1E]">
                    "{viewingItem.culturalNote}"
                  </p>
                )}

                {/* Thanh nút thao tác trong modal */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#3E2C1E]">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickTryOn(viewingItem)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#D4A043] via-[#C4922F] to-[#9E6D18] hover:from-[#E2B155] hover:to-[#B37E22] text-[#140D08] text-xs font-serif font-bold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#F3C96B]"
                      title="Áp dụng ngay bộ này vào phòng thử đồ ảo"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-[#140D08]" />
                      <span>Thử Đồ Nhanh</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (currentAlbum) handleOpenRenameItem(currentAlbum.id, viewingItem);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1C140E] hover:bg-[#2F2117] border border-[#423023] text-xs font-sans text-[#D8CCC0] hover:text-[#F3C96B] transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Đổi tên</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (currentAlbum) handleOpenDeleteItem(currentAlbum.id, viewingItem);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1C140E] hover:bg-[#872013] border border-[#423023] text-xs font-sans text-[#BAA796] hover:text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleShareItem(viewingItem)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#2B3A25] to-[#1E2B1A] hover:from-[#374C30] hover:to-[#283C22] border border-[#78976A]/80 text-xs font-serif font-bold text-[#F5EFE6] transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                      title="Chia sẻ tác phẩm lên Mạng Xã Hội qua Web Share API"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#F3C96B]" />
                      <span>Chia sẻ Mạng Xã Hội (Web Share)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadItem(viewingItem)}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-[#465A3D] to-[#36472F] hover:from-[#536B49] hover:to-[#42583A] text-white text-xs font-serif font-bold shadow-md cursor-pointer border border-[#78976A]/60"
                    >
                      <Download className="w-3.5 h-3.5 text-[#F3C96B]" />
                      <span>Tải ảnh về máy</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 5: ĐỔI TÊN MỤC TRANG PHỤC                                           */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0E0906]/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setEditingItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="relative max-w-md w-full bg-[#241A13] border border-[#D4A043]/50 rounded-3xl p-6 shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif font-bold text-lg text-[#F5EFE6] mb-1">
                Đổi Tên Tác Phẩm
              </h3>
              <p className="text-xs font-sans text-[#BAA796] mb-4">
                Nhập tên mới cho bộ {editingItem.item.costumeName} của bạn:
              </p>

              <input
                type="text"
                autoFocus
                value={editItemNameValue}
                onChange={(e) => setEditItemNameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmRenameItem();
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1C140E] border border-[#423023] focus:border-[#D4A043] text-sm text-[#F5EFE6] placeholder-[#8E7B6C] outline-none mb-5"
                placeholder="Nhập tên mới..."
              />

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-full bg-[#1C140E] border border-[#423023] text-xs font-sans text-[#BAA796] hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRenameItem}
                  className="px-5 py-2 rounded-full bg-[#465A3D] hover:bg-[#536B49] text-white text-xs font-sans font-medium border border-[#78976A]/50 shadow-md cursor-pointer"
                >
                  Cập nhật tên
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 6: XÁC NHẬN XÓA MỤC TRANG PHỤC                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {deletingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0E0906]/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setDeletingItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="relative max-w-sm w-full bg-[#241A13] border border-[#872013]/60 rounded-3xl p-6 shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif font-bold text-lg text-[#F5EFE6] mb-1">
                Xóa khỏi Lookbook?
              </h3>
              <p className="text-xs font-sans text-[#BAA796] leading-relaxed mb-5">
                Bạn có chắc chắn muốn xóa bộ <strong className="text-[#F5EFE6]">"{deletingItem.item.customName}"</strong> khỏi album này? Thao tác này không thể hoàn tác.
              </p>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeletingItem(null)}
                  className="px-4 py-2 rounded-full bg-[#1C140E] border border-[#423023] text-xs font-sans text-[#BAA796] hover:text-white cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteItem}
                  className="px-5 py-2 rounded-full bg-[#872013] hover:bg-[#A32818] text-white text-xs font-sans font-medium shadow-md cursor-pointer"
                >
                  Xác nhận Xóa
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 7: THỬ ĐỒ NHANH (QUICK TRY-ON DIALOG)                               */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isQuickTryOnModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0E0906]/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setIsQuickTryOnModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 15 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-[#1E150F] border border-[#D4A043]/70 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header của Modal */}
              <div className="p-5 sm:p-6 border-b border-[#3E2C1E] bg-[#241A13]/80 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4A043] to-[#8E6319] flex items-center justify-center text-[#140D08] shadow-md shrink-0">
                    <Wand2 className="w-5 h-5 text-[#140D08]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#F5EFE6]">
                        Thử Đồ Nhanh
                      </h3>
                      <span className="text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-[#D4A043]/20 border border-[#D4A043]/60 text-[#F3C96B]">
                        Quick Try-on
                      </span>
                    </div>
                    <p className="text-xs font-sans text-[#BAA796] mt-0.5">
                      Xem lại danh sách tất cả các bộ trang phục đã lưu và nạp tức thì vào mô hình thử đồ ảo.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsQuickTryOnModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#140D08]/90 text-[#BAA796] hover:text-white flex items-center justify-center border border-[#423023] hover:border-[#D4A043] cursor-pointer transition-colors shrink-0"
                  title="Đóng cửa sổ"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Thanh Tìm Kiếm & Bộ Lọc */}
              <div className="px-5 sm:px-6 py-3.5 bg-[#170F0A] border-b border-[#3E2C1E] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Ô tìm kiếm */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8E7B6C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={quickTryOnSearch}
                    onChange={(e) => setQuickTryOnSearch(e.target.value)}
                    placeholder="Tìm theo tên bộ, loại áo (Áo Dài, Nhật Bình, Áo Tấc...)..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#241A13] border border-[#423023] focus:border-[#D4A043] text-xs text-[#F5EFE6] placeholder-[#8E7B6C] outline-none"
                  />
                  {quickTryOnSearch && (
                    <button
                      type="button"
                      onClick={() => setQuickTryOnSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E7B6C] hover:text-white text-xs cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Tabs phân loại Nguồn */}
                <div className="inline-flex p-1 rounded-xl bg-[#241A13] border border-[#423023] shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setQuickTryOnFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all cursor-pointer ${
                      quickTryOnFilter === 'all'
                        ? 'bg-gradient-to-r from-[#465A3D] to-[#36472F] text-white font-medium shadow-sm'
                        : 'text-[#BAA796] hover:text-white'
                    }`}
                  >
                    Tất cả ({allSavedItems.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickTryOnFilter('design')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all cursor-pointer ${
                      quickTryOnFilter === 'design'
                        ? 'bg-gradient-to-r from-[#465A3D] to-[#36472F] text-white font-medium shadow-sm'
                        : 'text-[#BAA796] hover:text-white'
                    }`}
                  >
                    Thiết kế ({allSavedItems.filter((i) => i.type === 'design').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickTryOnFilter('tryon')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all cursor-pointer ${
                      quickTryOnFilter === 'tryon'
                        ? 'bg-gradient-to-r from-[#465A3D] to-[#36472F] text-white font-medium shadow-sm'
                        : 'text-[#BAA796] hover:text-white'
                    }`}
                  >
                    Thử đồ ({allSavedItems.filter((i) => i.type === 'tryon').length})
                  </button>
                </div>
              </div>

              {/* Danh Sách Lưới Trang Phục */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {filteredQuickTryOnItems.length === 0 ? (
                  <div className="py-14 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#241A13] border border-[#423023] flex items-center justify-center text-[#8E7B6C]">
                      <Layers className="w-7 h-7" />
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#F5EFE6]">
                      Không tìm thấy bộ trang phục nào
                    </h4>
                    <p className="text-xs font-sans text-[#BAA796] max-w-sm">
                      {quickTryOnSearch
                        ? `Không có kết quả nào khớp với "${quickTryOnSearch}". Hãy thử từ khóa khác.`
                        : 'Bạn chưa có trang phục nào được lưu trong Lookbook.'}
                    </p>
                    {quickTryOnSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setQuickTryOnSearch('');
                          setQuickTryOnFilter('all');
                        }}
                        className="px-4 py-1.5 rounded-full bg-[#241A13] border border-[#423023] text-xs font-sans text-[#D4A043] hover:text-white cursor-pointer"
                      >
                        Đặt lại tìm kiếm
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredQuickTryOnItems.map((item, idx) => (
                      <div
                        key={`${item.id}-${item.albumId || 'quick'}-${idx}`}
                        className="group relative rounded-2xl overflow-hidden bg-[#241A13] border border-[#3E2C1E] hover:border-[#D4A043]/70 shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                      >
                        {/* Hình ảnh trang phục */}
                        <div className="relative aspect-[4/3] w-full bg-[#140D08] overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.customName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

                          {/* Badge loại trang phục */}
                          <div className="absolute top-2.5 left-2.5 z-10">
                            <span
                              className={`text-[9px] font-sans font-semibold px-2 py-0.5 rounded-full border backdrop-blur-md shadow-sm ${
                                item.type === 'design'
                                  ? 'bg-[#1C261A]/90 text-[#78976A] border-[#465A3D]'
                                  : 'bg-[#2D2111]/90 text-[#D4A043] border-[#7A5A20]'
                              }`}
                            >
                              {item.type === 'design' ? 'Thiết Kế' : 'Thử Đồ'} · {item.costumeName}
                            </span>
                          </div>

                          {/* Màu sắc nếu là bản thiết kế */}
                          {item.type === 'design' && item.customizationData?.parts && (
                            <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 bg-[#140D08]/85 px-1.5 py-0.5 rounded-full border border-white/10">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-white/20"
                                style={{ backgroundColor: item.customizationData.parts.primaryRobeColor }}
                                title="Vạt áo chính"
                              />
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-white/20"
                                style={{ backgroundColor: item.customizationData.parts.innerCollarColor }}
                                title="Cổ / Yếm"
                              />
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-white/20"
                                style={{ backgroundColor: item.customizationData.parts.sashColor }}
                                title="Thắt lưng"
                              />
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-white/20"
                                style={{ backgroundColor: item.customizationData.parts.bottomColor }}
                                title="Quần / Váy"
                              />
                            </div>
                          )}

                          <span className="absolute bottom-2.5 right-2.5 z-10 text-[10px] font-sans text-[#BAA796]">
                            {item.savedAt}
                          </span>
                        </div>

                        {/* Tiêu đề & Thông tin */}
                        <div className="p-3.5 space-y-1 text-left flex-1">
                          <h4 className="font-serif font-bold text-sm text-[#F5EFE6] line-clamp-1 group-hover:text-[#F3C96B] transition-colors">
                            {item.customName}
                          </h4>
                          <p className="text-[11px] font-sans text-[#BAA796] line-clamp-1">
                            {item.note || item.culturalNote || `Trang phục ${item.costumeName}`}
                          </p>
                        </div>

                        {/* Nút hành động Áp dụng vào Thử đồ ảo */}
                        <div className="p-3 pt-0">
                          <button
                            type="button"
                            onClick={(e) => handleQuickTryOn(item, e)}
                            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#D4A043] via-[#BA8A30] to-[#8E6319] hover:from-[#E2B155] hover:to-[#A37320] text-[#140D08] font-serif font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-[#F3C96B]/60"
                          >
                            <Wand2 className="w-3.5 h-3.5 text-[#140D08]" />
                            <span>Áp dụng Thử Đồ Ngay</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer của Modal */}
              <div className="p-4 px-6 border-t border-[#3E2C1E] bg-[#170F0A] flex items-center justify-between">
                <span className="text-xs font-sans text-[#8E7B6C] hidden sm:inline">
                  Trang phục được chọn sẽ tự động nạp màu sắc, cổ áo và phụ kiện vào phòng Thử Đồ Ảo.
                </span>

                <button
                  type="button"
                  onClick={() => setIsQuickTryOnModalOpen(false)}
                  className="px-5 py-2 rounded-full bg-[#241A13] hover:bg-[#342418] border border-[#423023] text-xs font-sans text-[#D8CCC0] hover:text-white cursor-pointer ml-auto transition-colors"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 8: CHIA SẺ LÊN MẠNG XÃ HỘI (WEB SHARE API + MẠNG XÃ HỘI)             */}
      {/* ========================================================================= */}
      <ShareToSocialModal
        isOpen={Boolean(sharingItemData)}
        onClose={() => setSharingItemData(null)}
        item={sharingItemData?.item || null}
        albumName={sharingItemData?.albumName}
        onToast={showToast}
      />
    </div>
  );
};
