import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Landmark,
  Search,
  BookOpen,
  Sparkles,
  Info,
  Layers,
  Scroll,
  ExternalLink,
  ChevronRight,
  Filter,
  Volume2,
  VolumeX,
  Palette,
  Camera,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  Eye,
  X
} from 'lucide-react';
import {
  MUSEUM_ARTIFACTS,
  MUSEUM_TIMELINE,
  MuseumArtifact,
  MuseumDynastyTimeline
} from '../../data/museumData';
import { RealmScene } from '../../types/scenes';
import { useLanguage } from '../../contexts/LanguageContext';

interface MuseumRealmProps {
  onNavigateToCostume?: (costumeId: string) => void;
  onNavigateToAtelier?: (costumeId?: string) => void;
  onNavigateToTryOn?: (costumeId?: string) => void;
  onBack?: () => void;
}

type TabMode = 'artifacts' | 'timeline' | 'anatomy' | 'quiz';

export const MuseumRealm: React.FC<MuseumRealmProps> = ({
  onNavigateToCostume,
  onNavigateToAtelier,
  onNavigateToTryOn,
  onBack
}) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const [activeTab, setActiveTab] = useState<TabMode>('artifacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArtifact, setSelectedArtifact] = useState<MuseumArtifact | null>(null);
  const [isAudioGuideActive, setIsAudioGuideActive] = useState(false);
  const [selectedTimelineEra, setSelectedTimelineEra] = useState<string>(MUSEUM_TIMELINE[0].id);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const categories = [
    { id: 'all', label: isVi ? 'Tất Cả Hiện Vật' : 'All Artifacts' },
    { id: 'imperial', label: isVi ? 'Hoàng Cung & Triều Phục' : 'Imperial & Court' },
    { id: 'ceremonial', label: isVi ? 'Lễ Phục & Áo Tấc' : 'Ceremonial Robes' },
    { id: 'folk', label: isVi ? 'Dân Gian & Đời Thường' : 'Folk & Daily Attire' },
    { id: 'document', label: isVi ? 'Tư Liệu & Mộc Bản Cổ' : 'Historical Documents' },
    { id: 'textile', label: isVi ? 'Tơ Lụa & Nghề Dệt' : 'Textile & Weaving' },
  ];

  const filteredArtifacts = useMemo(() => {
    return MUSEUM_ARTIFACTS.filter((artifact) => {
      const matchCategory =
        selectedCategory === 'all' || artifact.category === selectedCategory;
      const matchQuery =
        searchQuery.trim() === '' ||
        artifact.vietnameseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artifact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artifact.dynasty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artifact.museumLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artifact.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const quizQuestions = [
    {
      question: isVi
        ? 'Ý nghĩa của 5 nút áo trên Áo Ngũ Thân tượng trưng cho điều gì trong văn hóa truyền thống?'
        : 'What do the 5 buttons on the Five-Panel Robe (Áo Ngũ Thân) represent?',
      options: isVi
        ? [
            'Ngũ Thường (Nhân - Lễ - Nghĩa - Trí - Tín)',
            'Ngũ Vị trong ẩm thực cung đình',
            '5 vị vua đầu tiên của triều Nguyễn',
            'Ngũ Cung trong âm nhạc cổ truyền'
          ]
        : [
            'Five Constant Virtues (Benevolence, Propriety, Righteousness, Wisdom, Faith)',
            'Five flavors in royal cuisine',
            'First five kings of the Nguyen dynasty',
            'Five pentatonic scales in ancient music'
          ],
      correctIndex: 0,
      explanation: isVi
        ? '5 cúc áo tượng trưng cho Ngũ Thường (Nhân - Lễ - Nghĩa - Trí - Tín), đồng thời 5 thân tượng trưng cho Tứ thân phụ mẫu và Bản thân người mặc.'
        : 'The 5 buttons signify the Five Confucian Virtues (Benevolence, Propriety, Righteousness, Wisdom, Faithfulness).'
    },
    {
      question: isVi
        ? 'Áo Nhật Bình có đặc điểm nhận diện nổi bật nhất ở phần nào?'
        : 'What is the most distinct signature feature of the Nhật Bình Robe?',
      options: isVi
        ? [
            'Cổ áo hình chữ nhật to bản viền hoa văn và dải ngũ sắc trước ngực',
            'Cổ áo tròn may khép kín cài khuy bên trái',
            'Không có tay áo, chỉ khoác ngoài dạng choàng',
            'Chỉ có duy nhất một màu đen tuyền'
          ]
        : [
            'A large rectangular collar bordered with embroidery and five-color chest bands',
            'A circular collar buttoned on the left side',
            'Sleeveless cape design',
            'Strictly single pitch-black color'
          ],
      correctIndex: 0,
      explanation: isVi
        ? 'Áo Nhật Bình có phần cổ hình chữ nhật to bản (tên gọi "Nhật Bình" bắt nguồn từ hình dáng chữ nhật của cổ áo) kèm hoa văn phụng loan và dải ngũ sắc.'
        : 'Nhật Bình is named after its iconic rectangular collar ("Nhật" form) with phoenix emblems and five-element color ribbons.'
    },
    {
      question: isVi
        ? 'Ai là người ban chiếu cải cách y phục Đàng Trong vào năm 1744, đặt nền móng cho Áo Ngũ Thân?'
        : 'Who issued the 1744 dress reform in Đàng Trong that shaped the Five-Panel Robe?',
      options: isVi
        ? [
            'Chúa Nguyễn Phúc Khoát (Vũ Vương)',
            'Vua Quang Trung',
            'Họa sĩ Nguyễn Cát Tường (Le Mur)',
            'Vua Lê Thánh Tông'
          ]
        : [
            'Lord Nguyễn Phúc Khoát (Vũ Vương)',
            'Emperor Quang Trung',
            'Artist Nguyễn Cát Tường (Le Mur)',
            'King Lê Thánh Tông'
          ],
      correctIndex: 0,
      explanation: isVi
        ? 'Năm 1744, Chúa Nguyễn Phúc Khoát xưng Vương và ban hành quy chế cải cách y phục Đàng Trong, định hình nên chiếc Áo Ngũ Thân tiền thân của Áo Dài ngày nay.'
        : 'In 1744, Lord Nguyễn Phúc Khoát reformed costumes in Đàng Trong, giving birth to the Five-Panel Robe.'
    }
  ];

  const handleQuizAnswer = (optionIdx: number) => {
    if (selectedQuizOption !== null) return;
    setSelectedQuizOption(optionIdx);
    if (optionIdx === quizQuestions[currentQuizIndex].correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedQuizOption(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedQuizOption(null);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="relative min-h-[100dvh] overflow-y-auto pt-6 pb-28 md:pb-16 px-3 sm:px-8 max-w-7xl mx-auto w-full z-10 select-none">
      {/* Header Banner Bảo Tàng Số */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#241A13]/95 via-[#2E2017]/95 to-[#1A120C]/95 border border-[#5A402D]/60 shadow-2xl backdrop-blur-md mb-8 overflow-hidden ring-1 ring-[#D4A043]/20"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A043]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#78976A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A043]/15 border border-[#D4A043]/30 text-[#E5B869] text-xs font-semibold tracking-wider uppercase mb-3 shadow-inner">
              <Landmark className="w-3.5 h-3.5" />
              <span>{isVi ? 'Bảo Tàng Số Di Sản Cổ Phục' : 'Digital Heritage Museum'}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#F5EFE6] tracking-tight mb-2">
              {isVi ? 'Không Gian Trưng Bày & Tư Liệu Xác Thực' : 'Exhibition Gallery & Verified Archives'}
            </h1>
            <p className="text-xs sm:text-sm text-[#BAA796] font-sans max-w-2xl leading-relaxed">
              {isVi
                ? 'Khảo cứu hiện vật phục dựng từ Bảo tàng Cổ vật Cung đình Huế, Bảo tàng Lịch sử Quốc gia, tư liệu mộc bản Henri Oger (1908) và điển lệ Khâm định Đại Nam Hội điển sự lệ.'
                : 'Curated historical relics from Hue Imperial Museum, National History Museum, Henri Oger woodcut archives (1908), and royal court decrees.'}
            </p>
          </div>

          {/* Quick Actions / Audio Guide */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAudioGuideActive(!isAudioGuideActive)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-sans font-semibold transition-all cursor-pointer shadow-lg active:scale-95 ${
                isAudioGuideActive
                  ? 'bg-[#536B49] text-white border-[#8FB57F] shadow-[#536B49]/40'
                  : 'bg-[#1F1610] text-[#D4A043] border-[#423023] hover:border-[#D4A043]/60'
              }`}
            >
              {isAudioGuideActive ? (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse text-white" />
                  <span>{isVi ? 'Thuyết Minh Âm Thanh: Bật' : 'Audio Guide: ON'}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-[#BAA796]" />
                  <span>{isVi ? 'Bật Thuyết Minh Bảo Tàng' : 'Audio Guide'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audio Guide Player Pill when active */}
        <AnimatePresence>
          {isAudioGuideActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-[#423023] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#E5B869] bg-[#140D08]/60 p-3 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#78976A] animate-ping" />
                <span>
                  {isVi
                    ? 'Đang phát: Âm thanh không gian nhã nhạc & diễn giải lịch sử di sản trang phục'
                    : 'Playing: Royal Court ambient soundscape & heritage narrative'}
                </span>
              </div>
              <span className="text-[11px] text-[#BAA796]">
                {isVi ? 'Nhã nhạc cung đình Huế · Bản quyền di sản' : 'Hue Royal Court Music'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 mb-6 border-b border-[#3E2C1E]">
        {[
          { id: 'artifacts', label: isVi ? 'Kho Hiện Vật Quý' : 'Relics & Artifacts', icon: Landmark },
          { id: 'timeline', label: isVi ? 'Dòng Thời Gian Y Phục' : 'Dynasty Timeline', icon: Clock },
          { id: 'anatomy', label: isVi ? 'Giải Phẫu Cấu Trúc Áo' : 'Robes Anatomy', icon: Layers },
          { id: 'quiz', label: isVi ? 'Đố Vui Tri Thức Di Sản' : 'Heritage Trivia Quiz', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabMode)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-serif text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#536B49] to-[#3B4C34] text-white border border-[#8FB57F] shadow-md shadow-black/40'
                  : 'bg-[#241A13]/80 text-[#BAA796] border border-[#3E2C1E] hover:text-[#F5EFE6] hover:border-[#5A402D]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ARTIFACTS GALLERY */}
      {activeTab === 'artifacts' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Search & Category Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7561]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isVi
                    ? 'Tìm hiện vật, triều đại, hoa văn, bảo tàng...'
                    : 'Search artifact, dynasty, pattern, museum...'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#241A13] border border-[#3E2C1E] text-xs sm:text-sm text-[#F5EFE6] placeholder-[#8A7561] focus:outline-none focus:border-[#D4A043] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7561] hover:text-[#F5EFE6]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#D4A043] text-[#1A120C] font-semibold shadow-md'
                      : 'bg-[#1C140E] text-[#BAA796] border border-[#3E2C1E] hover:text-[#F5EFE6]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Artifacts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtifacts.map((artifact, idx) => (
              <motion.div
                key={`${artifact.id}-${idx}`}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedArtifact(artifact)}
                className="group relative rounded-2xl overflow-hidden bg-[#241A13]/90 border border-[#3E2C1E] hover:border-[#D4A043]/80 shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Image Showcase */}
                <div className="relative aspect-[4/3] w-full bg-[#140D08] overflow-hidden">
                  <img
                    src={artifact.imageUrl}
                    alt={artifact.vietnameseName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#E5B869] border border-[#D4A043]/40 shadow-sm flex items-center gap-1">
                      <Landmark className="w-2.5 h-2.5" />
                      {artifact.era}
                    </span>
                    <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-[#536B49]/80 backdrop-blur-md text-white border border-[#8FB57F]/50">
                      {artifact.dynasty.split('(')[0].trim()}
                    </span>
                  </div>

                  {/* Museum Location Pill */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-1 text-[11px] text-[#E5B869] font-sans truncate bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#423023]">
                      <MapPin className="w-3 h-3 text-[#D4A043] shrink-0" />
                      <span className="truncate">{artifact.museumLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#F5EFE6] group-hover:text-[#E5B869] transition-colors line-clamp-1 mb-1">
                      {artifact.vietnameseName}
                    </h3>
                    <p className="text-xs text-[#BAA796] font-sans line-clamp-2 leading-relaxed">
                      {artifact.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-[#3E2C1E]/60">
                    {artifact.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={`${artifact.id}-tag-${tIdx}`}
                        className="text-[10px] font-sans px-2 py-0.5 rounded-md bg-[#18110B] text-[#A69383] border border-[#3E2C1E]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* View Details Prompt */}
                  <div className="pt-1 flex items-center justify-between text-xs text-[#D4A043] font-sans font-semibold">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {isVi ? 'Xem Hồ Sơ Hiện Vật' : 'View Artifact File'}
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredArtifacts.length === 0 && (
            <div className="text-center py-16 px-4 bg-[#241A13]/50 rounded-2xl border border-[#3E2C1E]">
              <Search className="w-12 h-12 text-[#5A402D] mx-auto mb-3" />
              <p className="font-serif text-lg text-[#F5EFE6] mb-1">
                {isVi ? 'Không tìm thấy hiện vật phù hợp' : 'No matching artifacts found'}
              </p>
              <p className="text-xs text-[#BAA796]">
                {isVi
                  ? 'Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác'
                  : 'Try adjusting your search filters or keywords'}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* TAB 2: TIMELINE */}
      {activeTab === 'timeline' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Timeline Era Selector Cards */}
            {MUSEUM_TIMELINE.map((era, eraIdx) => {
              const isSelected = selectedTimelineEra === era.id;
              return (
                <button
                  key={`${era.id}-${eraIdx}`}
                  type="button"
                  onClick={() => setSelectedTimelineEra(era.id)}
                  className={`p-5 rounded-2xl text-left transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#2E2017] border-[#D4A043] shadow-lg ring-1 ring-[#D4A043]/30'
                      : 'bg-[#241A13]/80 border-[#3E2C1E] hover:border-[#5A402D]'
                  }`}
                >
                  <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-[#536B49]/40 text-[#8FB57F] border border-[#8FB57F]/30 mb-2 inline-block">
                    {era.period}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#F5EFE6] mb-1">
                    {era.name}
                  </h3>
                  <p className="text-xs text-[#BAA796] font-sans line-clamp-2">
                    {era.definingFeatures}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Selected Era Deep Dive */}
          {(() => {
            const currentEra = MUSEUM_TIMELINE.find((e) => e.id === selectedTimelineEra) || MUSEUM_TIMELINE[0];
            return (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#241A13]/95 border border-[#423023] shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#3E2C1E] pb-4">
                  <div>
                    <span className="text-xs font-sans text-[#D4A043] uppercase tracking-wider font-semibold">
                      {currentEra.period}
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-[#F5EFE6]">
                      {currentEra.name}
                    </h2>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-[#1A120C] border border-[#3E2C1E] text-xs text-[#8FB57F] font-semibold">
                    {isVi ? 'Đặc trưng: ' : 'Signature: '}
                    <span className="text-[#F5EFE6]">{currentEra.definingFeatures}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Historical Context */}
                  <div className="space-y-3 bg-[#1A120C] p-5 rounded-2xl border border-[#3E2C1E]">
                    <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#E5B869]">
                      <BookOpen className="w-4 h-4 text-[#D4A043]" />
                      <span>{isVi ? 'Bối Cảnh Lịch Sử & Văn Hóa' : 'Historical Context'}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#BAA796] font-sans leading-relaxed">
                      {currentEra.historicalContext}
                    </p>
                  </div>

                  {/* Costume Highlights */}
                  <div className="space-y-3 bg-[#1A120C] p-5 rounded-2xl border border-[#3E2C1E]">
                    <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#8FB57F]">
                      <Sparkles className="w-4 h-4 text-[#78976A]" />
                      <span>{isVi ? 'Các Loại Cổ Phục Tiêu Biểu' : 'Key Robe Styles'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentEra.costumeHighlights.map((hl, hlIdx) => (
                        <div
                          key={`era-hl-${hlIdx}`}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-[#241A13] border border-[#3E2C1E] text-xs text-[#F5EFE6] font-sans"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#78976A] shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* TAB 3: ANATOMY EXPLORER */}
      {activeTab === 'anatomy' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#241A13] border border-[#3E2C1E] text-center max-w-2xl mx-auto mb-6">
            <h2 className="font-serif text-xl font-bold text-[#F5EFE6] mb-2">
              {isVi ? 'Giải Phẫu Cấu Trúc Y Phục Cổ Truyền' : 'Vietnamese Costume Anatomy Explorer'}
            </h2>
            <p className="text-xs text-[#BAA796] font-sans">
              {isVi
                ? 'Hiểu rõ từng chi tiết cấu thành nên linh hồn của tà áo cổ truyền Việt Nam'
                : 'Understand each structural component defining authentic traditional attire'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: isVi ? '1. Hệ Thống Cổ Áo (Lĩnh)' : '1. Collar Styles (Lĩnh)',
                desc: isVi
                  ? 'Gồm Lập Lĩnh (cổ đứng cao 3-4cm kín đáo), Giao Lĩnh (cổ chéo Y), Viên Lĩnh (cổ tròn) và Nhật Bình (cổ chữ nhật quý tộc).'
                  : 'Including Lap Linh (mandarin high collar), Giao Linh (cross collar), Vien Linh (round collar) and Nhat Binh (rectangular imperial collar).',
                features: ['Lập Lĩnh', 'Giao Lĩnh', 'Viên Lĩnh', 'Nhật Bình'],
                color: '#D4A043'
              },
              {
                title: isVi ? '2. Cấu Trúc Thân & Tà Áo' : '2. Body & Panels',
                desc: isVi
                  ? 'Áo 5 thân tượng trưng cho Tứ thân phụ mẫu + Bản thân người mặc. Đường may trung phùng sống lưng biểu trưng cho sự ngay thẳng, liêm chính.'
                  : '5 panels symbolize parents from both sides + wearer. The back center seam stands for integrity and righteousness.',
                features: ['5 Thân Áo', 'Tứ Thân Phụ Mẫu', 'Đường Sống Lưng', 'Xẻ Tà Cao'],
                color: '#78976A'
              },
              {
                title: isVi ? '3. Tay Áo & Ống Tay' : '3. Sleeves Variety',
                desc: isVi
                  ? 'Tay chẽn (ôm gọn năng động cho thường phục) vs Tay thụng / Áo tấc (rộng 1 tấc biểu trưng cho sự trang nghiêm trong tế lễ).'
                  : 'Narrow sleeves for active daily life vs. Wide ceremonial sleeves (Áo Tấc) for solemn state rituals and celebrations.',
                features: ['Tay Chẽn (Hẹp)', 'Tay Thụng (Rộng)', 'Dải Ngũ Sắc', 'Cửa Tay 1 Tấc'],
                color: '#A3C293'
              },
              {
                title: isVi ? '4. Nút Khuy & Hoa Văn' : '4. Buttons & Motifs',
                desc: isVi
                  ? '5 hạt nút tượng trưng Ngũ Thường (Nhân - Lễ - Nghĩa - Trí - Tín). Kết hợp hoa văn Phượng Loan, Sóng Thủy Ba và Tam Đa cát tường.'
                  : '5 buttons embody the 5 Confucian virtues. Decorated with phoenix emblems, water waves (Thủy Ba) and auspicious symbols.',
                features: ['Ngũ Thường', 'Khuy Đồi Mồi', 'Sóng Thủy Ba', 'Phụng Ổ - Loan Ổ'],
                color: '#E5B869'
              },
            ].map((section, sIdx) => (
              <div
                key={`anatomy-${sIdx}`}
                className="p-5 rounded-2xl bg-[#241A13]/90 border border-[#3E2C1E] flex flex-col justify-between space-y-4 hover:border-[#D4A043]/50 transition-colors"
              >
                <div>
                  <h3
                    className="font-serif font-bold text-base mb-2"
                    style={{ color: section.color }}
                  >
                    {section.title}
                  </h3>
                  <p className="text-xs text-[#BAA796] font-sans leading-relaxed">
                    {section.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#3E2C1E]">
                  {section.features.map((feat, fIdx) => (
                    <span
                      key={`feat-${sIdx}-${fIdx}`}
                      className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-md bg-[#18110B] text-[#F5EFE6] border border-[#3E2C1E]"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 4: HERITAGE TRIVIA QUIZ */}
      {activeTab === 'quiz' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
          {!quizCompleted ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#241A13] border border-[#423023] shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#3E2C1E] pb-4">
                <div className="flex items-center gap-2 text-xs font-sans text-[#E5B869] font-semibold">
                  <Award className="w-4 h-4 text-[#D4A043]" />
                  <span>
                    {isVi ? `Câu hỏi ${currentQuizIndex + 1} / ${quizQuestions.length}` : `Question ${currentQuizIndex + 1} of ${quizQuestions.length}`}
                  </span>
                </div>
                <span className="text-xs font-sans text-[#78976A] font-bold">
                  {isVi ? `Điểm: ${quizScore}` : `Score: ${quizScore}`}
                </span>
              </div>

              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#F5EFE6] leading-snug">
                {quizQuestions[currentQuizIndex].question}
              </h3>

              <div className="space-y-3">
                {quizQuestions[currentQuizIndex].options.map((opt, optIdx) => {
                  const isSelected = selectedQuizOption === optIdx;
                  const isCorrect = optIdx === quizQuestions[currentQuizIndex].correctIndex;

                  let btnStyle = 'bg-[#1C140E] border-[#3E2C1E] text-[#BAA796] hover:text-[#F5EFE6] hover:border-[#5A402D]';
                  if (selectedQuizOption !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-[#536B49] border-[#8FB57F] text-white shadow-md shadow-[#536B49]/40';
                    } else if (isSelected) {
                      btnStyle = 'bg-[#4A201A] border-[#8B3A2B] text-white';
                    }
                  }

                  return (
                    <button
                      key={`quiz-opt-${optIdx}`}
                      type="button"
                      onClick={() => handleQuizAnswer(optIdx)}
                      disabled={selectedQuizOption !== null}
                      className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-sans transition-all cursor-pointer border flex items-center justify-between gap-3 ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {selectedQuizOption !== null && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next */}
              {selectedQuizOption !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-4 border-t border-[#3E2C1E]"
                >
                  <div className="p-3.5 rounded-xl bg-[#140D08] border border-[#3E2C1E] text-xs text-[#BAA796] font-sans leading-relaxed">
                    <span className="font-bold text-[#E5B869] block mb-1">
                      {isVi ? '💡 Điển cố văn hóa:' : '💡 Cultural insight:'}
                    </span>
                    {quizQuestions[currentQuizIndex].explanation}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextQuiz}
                    className="w-full py-3 rounded-xl bg-[#D4A043] text-[#1A120C] font-serif font-bold text-sm hover:bg-[#E5B869] transition-all cursor-pointer shadow-lg active:scale-98"
                  >
                    {currentQuizIndex < quizQuestions.length - 1
                      ? isVi ? 'Câu Tiếp Theo →' : 'Next Question →'
                      : isVi ? 'Xem Kết Quả Thử Thách' : 'See Results'}
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#241A13] border border-[#423023] shadow-2xl text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#D4A043]/20 border border-[#D4A043] flex items-center justify-center mx-auto text-[#D4A043]">
                <Award className="w-8 h-8" />
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#F5EFE6]">
                {isVi ? 'Chúc Mừng Học Giả Di Sản!' : 'Heritage Scholar Certified!'}
              </h3>

              <p className="text-sm text-[#BAA796] font-sans">
                {isVi
                  ? `Bạn đã đạt ${quizScore} / ${quizQuestions.length} câu hỏi chính xác.`
                  : `You scored ${quizScore} out of ${quizQuestions.length} questions correctly.`}
              </p>

              <div className="p-4 rounded-2xl bg-[#1A120C] border border-[#3E2C1E] text-xs text-[#E5B869] font-sans">
                {isVi
                  ? '🏅 Nhận Huy Hiệu: "Nhà Khảo Cứu Cổ Phục Gen Z"'
                  : '🏅 Badge Earned: "Gen Z Heritage Researcher"'}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetQuiz}
                  className="flex-1 py-3 rounded-xl bg-[#2E2017] text-[#BAA796] hover:text-[#F5EFE6] border border-[#3E2C1E] text-xs font-semibold cursor-pointer"
                >
                  {isVi ? 'Làm Lại' : 'Try Again'}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateToAtelier?.()}
                  className="flex-1 py-3 rounded-xl bg-[#536B49] text-white hover:bg-[#68865C] border border-[#8FB57F] text-xs font-semibold cursor-pointer"
                >
                  {isVi ? 'Tùy Biến Cổ Phục Ngay' : 'Customize Now'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ARTIFACT DETAIL MODAL */}
      <AnimatePresence>
        {selectedArtifact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1F1610] border border-[#5A402D] shadow-2xl p-5 sm:p-8 space-y-6 text-[#F5EFE6]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedArtifact(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#140D08]/80 text-[#BAA796] hover:text-white border border-[#423023] hover:border-[#D4A043] transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Image showcase */}
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#140D08] border border-[#423023]">
                    <img
                      src={selectedArtifact.imageUrl}
                      alt={selectedArtifact.vietnameseName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 text-xs text-[#E5B869] font-sans flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#423023]">
                      <MapPin className="w-3.5 h-3.5 text-[#D4A043] shrink-0" />
                      <span>{selectedArtifact.museumLocation}</span>
                    </div>
                  </div>

                  {/* Historical Quote if available */}
                  {selectedArtifact.historicalQuotes && (
                    <div className="p-4 rounded-xl bg-[#140D08] border border-[#3E2C1E] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-[#D4A043] font-serif font-bold">
                        <Scroll className="w-3.5 h-3.5" />
                        <span>{selectedArtifact.historicalQuotes.source}</span>
                      </div>
                      <p className="text-xs text-[#BAA796] italic font-sans leading-relaxed">
                        "{selectedArtifact.historicalQuotes.quote}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Info & Specs */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-sans text-[#78976A] font-semibold uppercase tracking-wider block mb-1">
                      {selectedArtifact.dynasty} · {selectedArtifact.era}
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-[#F5EFE6] leading-tight mb-2">
                      {selectedArtifact.vietnameseName}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#BAA796] font-sans leading-relaxed">
                      {selectedArtifact.description}
                    </p>
                  </div>

                  {/* Key Cultural Values */}
                  <div className="space-y-2 pt-2 border-t border-[#3E2C1E]">
                    <span className="text-xs font-serif font-bold text-[#E5B869] block">
                      {isVi ? 'Giá trị lịch sử & di sản cốt lõi:' : 'Core heritage values:'}
                    </span>
                    <ul className="space-y-1.5">
                      {selectedArtifact.culturalValues.map((val, vIdx) => (
                        <li
                          key={`val-${vIdx}`}
                          className="text-xs text-[#D5C6B7] font-sans flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#78976A] shrink-0 mt-0.5" />
                          <span>{val}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Structural Specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-sans pt-2 border-t border-[#3E2C1E]">
                    <div className="p-2.5 rounded-lg bg-[#140D08] border border-[#3E2C1E]">
                      <span className="text-[#8A7561] block text-[10px] uppercase font-semibold">
                        {isVi ? 'Cổ áo:' : 'Collar:'}
                      </span>
                      <span className="text-[#F5EFE6] font-medium">{selectedArtifact.features.collar}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#140D08] border border-[#3E2C1E]">
                      <span className="text-[#8A7561] block text-[10px] uppercase font-semibold">
                        {isVi ? 'Ống tay:' : 'Sleeves:'}
                      </span>
                      <span className="text-[#F5EFE6] font-medium">{selectedArtifact.features.sleeves}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#140D08] border border-[#3E2C1E]">
                      <span className="text-[#8A7561] block text-[10px] uppercase font-semibold">
                        {isVi ? 'Hệ cúc nút:' : 'Buttons:'}
                      </span>
                      <span className="text-[#F5EFE6] font-medium">{selectedArtifact.features.buttons}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#140D08] border border-[#3E2C1E]">
                      <span className="text-[#8A7561] block text-[10px] uppercase font-semibold">
                        {isVi ? 'Chất liệu:' : 'Material:'}
                      </span>
                      <span className="text-[#F5EFE6] font-medium">{selectedArtifact.features.material}</span>
                    </div>
                  </div>

                  {/* Action Buttons: Try On & Customize */}
                  <div className="flex items-center gap-3 pt-4 border-t border-[#3E2C1E]">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedArtifact(null);
                        onNavigateToAtelier?.(selectedArtifact.relatedCostumeId);
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#536B49] hover:bg-[#648258] text-white font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
                    >
                      <Palette className="w-4 h-4" />
                      <span>{isVi ? 'Phối Lại Trong Tùy Biến' : 'Customize Style'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedArtifact(null);
                        onNavigateToTryOn?.(selectedArtifact.relatedCostumeId);
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#D4A043] hover:bg-[#E5B869] text-[#1A120C] font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{isVi ? 'Thử Đồ Ảo AI' : 'Virtual Try-On'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
