import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookmarkCheck, 
  FolderPlus, 
  Check, 
  X, 
  Sparkles, 
  Camera, 
  Folder,
  Layers,
  ChevronRight,
  Plus
} from 'lucide-react';
import { LookbookAlbum, LookbookSourceType } from '../../types/lookbook';
import { LookbookService, getCostumeImage } from '../../services/lookbookService';
import { OutfitCustomization, TryOnRequestPayload } from '../../types/customization';

export interface SaveToLookbookPayload {
  type: LookbookSourceType;             // 'design' hoặc 'tryon'
  defaultName: string;
  costumeName: string;
  costumeId: string;
  imageUrl: string;
  portraitUrl?: string;
  customizationData?: OutfitCustomization;
  gender?: 'female' | 'male';
  culturalNote?: string;
  stylingNote?: string;
  appliedPayload?: TryOnRequestPayload;
  note?: string;
}

interface SaveToLookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: SaveToLookbookPayload | null;
  onSavedSuccess: (albumName: string, itemName: string) => void;
}

export const SaveToLookbookModal: React.FC<SaveToLookbookModalProps> = ({
  isOpen,
  onClose,
  payload,
  onSavedSuccess,
}) => {
  const [albums, setAlbums] = useState<LookbookAlbum[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('');
  const [itemName, setItemName] = useState<string>('');
  
  // Trạng thái tạo album mới ngay trong modal
  const [isCreatingNewAlbum, setIsCreatingNewAlbum] = useState<boolean>(false);
  const [newAlbumName, setNewAlbumName] = useState<string>('');
  const [newAlbumDesc, setNewAlbumDesc] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Khi modal mở, tải danh sách album và đặt tên mặc định
  useEffect(() => {
    if (isOpen && payload) {
      const existingAlbums = LookbookService.getAlbums();
      setAlbums(existingAlbums);

      // Mặc định chọn album đầu tiên nếu có
      if (existingAlbums.length > 0 && !selectedAlbumId) {
        setSelectedAlbumId(existingAlbums[0].id);
      }

      setItemName(payload.defaultName || `${payload.costumeName} Tùy Biến`);
      setIsCreatingNewAlbum(false);
      setNewAlbumName('');
      setNewAlbumDesc('');
      setErrorMsg(null);
    }
  }, [isOpen, payload]);

  if (!isOpen || !payload) return null;

  // Lấy ảnh hiển thị chính xác 100% (không bao giờ để trống)
  const displayImage = payload.imageUrl && payload.imageUrl.length > 5
    ? payload.imageUrl
    : getCostumeImage(payload.costumeId);

  // Xử lý tạo album mới nhanh
  const handleCreateAndSelectAlbum = () => {
    const trimmed = newAlbumName.trim();
    if (!trimmed) {
      setErrorMsg('Vui lòng nhập tên cho Lookbook mới!');
      return;
    }

    const created = LookbookService.createAlbum(trimmed, newAlbumDesc);
    const updatedAlbums = LookbookService.getAlbums();
    setAlbums(updatedAlbums);
    setSelectedAlbumId(created.id);
    setIsCreatingNewAlbum(false);
    setNewAlbumName('');
    setNewAlbumDesc('');
    setErrorMsg(null);
  };

  // Xác nhận lưu vào album
  const handleConfirmSave = () => {
    const trimmedItemName = itemName.trim();
    if (!trimmedItemName) {
      setErrorMsg('Vui lòng đặt tên cho bộ trang phục!');
      return;
    }

    // Nếu người dùng đang mở ô tạo album và chưa bấm "Tạo & Chọn", tự tạo luôn
    let targetAlbumId = selectedAlbumId;
    if (isCreatingNewAlbum && newAlbumName.trim()) {
      const created = LookbookService.createAlbum(newAlbumName.trim(), newAlbumDesc);
      targetAlbumId = created.id;
    } else if (!targetAlbumId) {
      if (albums.length > 0) {
        targetAlbumId = albums[0].id;
      } else {
        const created = LookbookService.createAlbum('Bộ Sưu Tập Của Tôi');
        targetAlbumId = created.id;
      }
    }

    setIsSubmitting(true);
    try {
      const result = LookbookService.saveItemToAlbum(targetAlbumId, {
        type: payload.type,
        customName: trimmedItemName,
        costumeName: payload.costumeName,
        costumeId: payload.costumeId,
        imageUrl: displayImage,
        portraitUrl: payload.portraitUrl,
        customizationData: payload.customizationData,
        gender: payload.gender,
        culturalNote: payload.culturalNote,
        stylingNote: payload.stylingNote,
        note: payload.note,
        appliedPayload: payload.appliedPayload,
      });

      onSavedSuccess(result.album.name, trimmedItemName);
      onClose();
    } catch (e) {
      console.error('Lỗi khi lưu vào Lookbook:', e);
      setErrorMsg('Đã có lỗi xảy ra khi lưu vào Lookbook.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#0E0906]/85 backdrop-blur-md flex items-center justify-center p-4 select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.94, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-lg w-full bg-gradient-to-b from-[#241A13] to-[#1C140E] border border-[#78976A]/50 rounded-3xl p-6 sm:p-7 shadow-2xl text-left overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Nút đóng */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-[#140D08]/80 text-[#BAA796] hover:text-white flex items-center justify-center border border-[#423023] hover:border-[#D4A043] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-2xl bg-[#36472F] border border-[#78976A]/60 flex items-center justify-center text-[#F3C96B] shadow-sm">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-[#F5EFE6]">
                Lưu Vào Lookbook
              </h3>
              <p className="text-xs font-sans text-[#BAA796]">
                Chọn album có sẵn hoặc tạo Lookbook mới để lưu giữ
              </p>
            </div>
          </div>

          {/* Error notice nếu có */}
          {errorMsg && (
            <div className="mb-3 px-3.5 py-2 rounded-xl bg-[#872013]/25 border border-[#872013]/70 text-[#F5C2BC] text-xs font-sans">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {/* THẺ PREVIEW BỘ ĐANG LƯU */}
            <div className="p-3.5 rounded-2xl bg-[#140D08]/90 border border-[#423023] flex items-center gap-3.5 shadow-inner">
              <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#1E150F] shrink-0 border border-[#423023]">
                <img
                  src={displayImage}
                  alt={payload.costumeName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full border ${
                    payload.type === 'design'
                      ? 'bg-[#1C261A] text-[#78976A] border-[#465A3D]'
                      : 'bg-[#2D2111] text-[#D4A043] border-[#7A5A20]'
                  }`}>
                    {payload.type === 'design' ? 'Bản Phối Thiết Kế' : 'Ảnh Thử Đồ Ảo'}
                  </span>
                  <span className="text-xs text-[#D8CCC0] font-sans">
                    {payload.costumeName}
                  </span>
                </div>

                {/* Ô đặt tên nhanh cho bộ */}
                <div>
                  <label className="text-[11px] font-sans text-[#8E7B6C] block mb-1">
                    Tên tác phẩm / khoảnh khắc:
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Nhập tên cho bộ trang phục..."
                    className="w-full px-3 py-1.5 rounded-xl bg-[#1E150F] border border-[#423023] focus:border-[#D4A043] text-xs font-sans text-[#F5EFE6] placeholder-[#6E5D4E] outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* DANH SÁCH CÁC ALBUM LOOKBOOK CÓ SẴN (PLAYLIST STYLE) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-sans font-semibold text-[#BAA796] uppercase tracking-wider flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-[#F3C96B]" />
                  <span>Chọn Lookbook (Album):</span>
                </label>

                {!isCreatingNewAlbum && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewAlbum(true)}
                    className="inline-flex items-center gap-1 text-xs font-sans font-medium text-[#78976A] hover:text-[#A1C990] cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo Lookbook mới</span>
                  </button>
                )}
              </div>

              {/* Form tạo album mới mở rộng */}
              {isCreatingNewAlbum && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3 p-3.5 rounded-2xl bg-[#1C140E] border border-[#78976A]/60 space-y-2.5 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-[#F5EFE6] flex items-center gap-1.5">
                      <FolderPlus className="w-3.5 h-3.5 text-[#78976A]" />
                      Tạo Lookbook Mới
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCreatingNewAlbum(false)}
                      className="text-[11px] font-sans text-[#BAA796] hover:text-white cursor-pointer"
                    >
                      Đóng
                    </button>
                  </div>

                  <input
                    type="text"
                    autoFocus
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    placeholder="Tên Lookbook (VD: Đi chơi Tết, Cưới hỏi...)"
                    className="w-full px-3 py-2 rounded-xl bg-[#140D08] border border-[#423023] focus:border-[#D4A043] text-xs font-sans text-[#F5EFE6] placeholder-[#6E5D4E] outline-none"
                  />

                  <input
                    type="text"
                    value={newAlbumDesc}
                    onChange={(e) => setNewAlbumDesc(e.target.value)}
                    placeholder="Mô tả ngắn (tùy chọn)..."
                    className="w-full px-3 py-1.5 rounded-xl bg-[#140D08] border border-[#423023] focus:border-[#D4A043] text-xs font-sans text-[#F5EFE6] placeholder-[#6E5D4E] outline-none"
                  />

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCreatingNewAlbum(false)}
                      className="px-3 py-1.5 rounded-xl bg-[#140D08] text-[11px] font-sans text-[#BAA796] hover:text-white"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateAndSelectAlbum}
                      className="px-3.5 py-1.5 rounded-xl bg-[#465A3D] hover:bg-[#536B49] text-white text-[11px] font-sans font-medium border border-[#78976A]/50 shadow-sm cursor-pointer"
                    >
                      Tạo & Chọn Album
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Danh sách các Album (chọn 1 album dạng playlist) */}
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {albums.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#BAA796] font-sans bg-[#140D08]/60 rounded-2xl border border-[#423023]">
                    Chưa có album nào. Hãy bấm "Tạo Lookbook mới" ở trên!
                  </div>
                ) : (
                  albums.map((album, idx) => {
                    const isSelected = selectedAlbumId === album.id;
                    const count = album.items?.length || 0;
                    return (
                      <div
                        key={`${album.id}-${idx}`}
                        onClick={() => setSelectedAlbumId(album.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#322318] border-[#D4A043] shadow-md'
                            : 'bg-[#18110B]/90 border-[#38271C] hover:border-[#536B49]/70 hover:bg-[#20160F]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Thumbnail album */}
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#241A13] shrink-0 border border-[#423023] flex items-center justify-center">
                            {album.coverImageUrl ? (
                              <img
                                src={album.coverImageUrl}
                                alt={album.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Folder className="w-5 h-5 text-[#8E7B6C]" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h4 className={`text-xs font-serif font-bold truncate ${
                              isSelected ? 'text-[#F5EFE6]' : 'text-[#D8CCC0]'
                            }`}>
                              {album.name}
                            </h4>
                            <p className="text-[10px] font-sans text-[#8E7B6C] flex items-center gap-1.5">
                              <span>{count} bộ trang phục</span>
                              {album.description && (
                                <>
                                  <span>·</span>
                                  <span className="truncate max-w-[140px]">{album.description}</span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Icon Radio Checkmark */}
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          isSelected
                            ? 'bg-[#D4A043] border-[#FFE082] text-[#140D08]'
                            : 'border-[#423023] bg-[#140D08]/60 text-transparent'
                        }`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Footer nút hành động */}
          <div className="pt-4 mt-3 border-t border-[#3E2C1E] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-full bg-[#1C140E] hover:bg-[#2A1D14] border border-[#423023] text-xs font-sans text-[#BAA796] hover:text-white transition-colors cursor-pointer"
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={handleConfirmSave}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#465A3D] to-[#36472F] hover:from-[#536B49] hover:to-[#42583A] text-white text-xs font-serif font-bold shadow-lg border border-[#78976A]/60 cursor-pointer hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              <BookmarkCheck className="w-4 h-4 text-[#F3C96B]" />
              <span>{isSubmitting ? 'Đang lưu...' : 'Lưu vào Lookbook'}</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
