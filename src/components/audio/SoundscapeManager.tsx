import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Sliders, 
  X, 
  Wind, 
  Sparkles, 
  Waves, 
  BellRing,
  Music2,
  Disc3,
  Globe,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  GripVertical,
  Move
} from 'lucide-react';
import { useSoundscape } from '../../contexts/SoundscapeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppSettings } from '../../contexts/AppSettingsContext';

export const SoundscapeManager: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dragConstraintsRef = useRef<HTMLDivElement>(null);
  const { language, toggleLanguage, t } = useLanguage();
  const { settings, toggleSoundscapeCollapsed, updateSetting } = useAppSettings();
  const {
    isPlaying,
    isMuted,
    currentTrack,
    tracks,
    masterVolume,
    windLevel,
    streamLevel,
    birdsLevel,
    chimesLevel,
    togglePlay,
    toggleMute,
    setTrack,
    nextTrack,
    prevTrack,
    setMasterVolume,
    setWindLevel,
    setStreamLevel,
    setBirdsLevel,
    setChimesLevel,
  } = useSoundscape();

  const isVi = language === 'vi';
  const isCollapsed = settings.soundscapeCollapsed;

  return (
    <>
      {/* Invisible Viewport Bounds Boundary for Dragging */}
      <div 
        ref={dragConstraintsRef} 
        className="fixed inset-0 pointer-events-none z-40 overflow-hidden" 
        aria-hidden="true" 
      />

      {/* 1. Global Floating Top Control Bar (Language Switcher + Draggable Soundscape Mini Player / Collapsed Orb) */}
      <div className="fixed top-3 left-3 sm:top-5 sm:left-6 z-40 flex items-center gap-2 select-none pointer-events-none">
        {/* Language Switcher Pill (Fixed Top Left) */}
        <motion.button
          type="button"
          onClick={toggleLanguage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#241A13]/90 hover:bg-[#322319] border border-[#4D382A] text-[#F5EFE6] text-xs font-sans font-medium shadow-lg backdrop-blur-md transition-colors cursor-pointer"
          title={t('lang.switch_title')}
        >
          <Globe className="w-3.5 h-3.5 text-[#D4A043]" />
          <span className="font-semibold text-[#F3C96B]">{language.toUpperCase()}</span>
          <span className="text-[10px] text-[#A69485] hidden sm:inline">
            {isVi ? 'Tiếng Việt' : 'English'}
          </span>
        </motion.button>

        {/* DRAGGABLE Ambient Soundscape Widget (Full pill or Collapsed glowing music orb) */}
        {isCollapsed ? (
          /* ===== BIỂU TƯỢNG ÂM NHẠC THU GỌN KÉO THẢ (DRAGGABLE COLLAPSED MINI ORB) ===== */
          <motion.div
            drag
            dragConstraints={dragConstraintsRef}
            dragElastic={0.08}
            dragMomentum={false}
            whileDrag={{ scale: 1.12, cursor: 'grabbing', zIndex: 60 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="pointer-events-auto flex items-center gap-1 cursor-grab active:cursor-grabbing touch-none group"
            title={isVi ? 'Nhấn & kéo để di chuyển vị trí thanh nhạc' : 'Click & drag to move player anywhere'}
          >
            <motion.button
              type="button"
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border shadow-lg backdrop-blur-md cursor-pointer transition-all ${
                isPlaying && !isMuted
                  ? 'bg-gradient-to-br from-[#38281C] to-[#241A13] border-[#D4A043] shadow-[0_0_15px_rgba(212,160,67,0.35)] ring-1 ring-[#D4A043]/30'
                  : 'bg-[#241A13]/90 border-[#4D382A] text-[#8E7B6C]'
              }`}
              title={isVi ? `Âm cảnh: ${currentTrack.titleVi} (Bấm để mở, kéo để di chuyển)` : `Soundscape: ${currentTrack.titleEn} (Click to open, drag to move)`}
            >
              {/* Rotating Lute/Disc icon when playing */}
              <Disc3
                className={`w-4 h-4 ${
                  isPlaying && !isMuted 
                    ? 'text-[#F3C96B] animate-spin' 
                    : 'text-[#8E7B6C]'
                }`}
                style={{ animationDuration: '6s' }}
              />

              {/* Pulsing playing indicator ring */}
              {isPlaying && !isMuted && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4A043] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#536B49]"></span>
                </span>
              )}
            </motion.button>

            {/* Quick Un-collapse Arrow Button */}
            <button
              type="button"
              onClick={toggleSoundscapeCollapsed}
              className="w-6 h-8 rounded-lg bg-[#241A13]/80 hover:bg-[#322319] border border-[#4D382A] text-[#8E7B6C] hover:text-[#F5EFE6] flex items-center justify-center transition-colors cursor-pointer"
              title={isVi ? 'Mở rộng thanh âm nhạc' : 'Expand music player'}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ) : (
          /* ===== THANH ÂM NHẠC ĐẦY ĐỦ KÉO THẢ TỰ DO (DRAGGABLE EXPANDED MINI PLAYER) ===== */
          <motion.div 
            drag
            dragConstraints={dragConstraintsRef}
            dragElastic={0.08}
            dragMomentum={false}
            whileDrag={{ 
              scale: 1.04, 
              cursor: 'grabbing', 
              zIndex: 60,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 20px rgba(212, 160, 67, 0.35)' 
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="pointer-events-auto flex items-center rounded-xl bg-[#241A13]/95 border border-[#4D382A] hover:border-[#D4A043]/60 shadow-xl backdrop-blur-md overflow-hidden p-1 gap-1 group/bar touch-none cursor-grab active:cursor-grabbing transition-colors ring-1 ring-black/30"
          >
            {/* Drag Handle Icon with Tooltip */}
            <div 
              className="flex items-center justify-center px-1 text-[#8E7B6C] hover:text-[#F3C96B] transition-colors cursor-grab active:cursor-grabbing py-1"
              title={isVi ? 'Kéo để di chuyển thanh nhạc trên màn hình' : 'Drag to reposition soundscape bar'}
            >
              <GripVertical className="w-3.5 h-3.5" />
            </div>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                isPlaying 
                  ? 'bg-gradient-to-br from-[#536B49] to-[#3B4D33] text-[#F5EFE6] shadow-sm' 
                  : 'bg-[#322319] text-[#D4A043] hover:text-[#F5EFE6]'
              }`}
              title={isPlaying ? t('sound.pause') : t('sound.play')}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>

            {/* Track Name & Waveform (Click to open full panel) */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 px-2 py-1 hover:bg-[#322319] rounded-lg transition-colors cursor-pointer text-left"
              title={isVi ? 'Bấm để mở bảng hòa âm chi tiết' : 'Click to open full soundscape console'}
            >
              {/* Animated Sound Wave Bars */}
              <div className="flex items-end gap-0.5 h-3.5 w-3.5 justify-center">
                {[0.6, 1, 0.4, 0.8].map((factor, i) => (
                  <span
                    key={i}
                    className={`w-0.5 rounded-full transition-all duration-300 ${
                      isPlaying && !isMuted ? 'bg-[#D4A043] animate-pulse' : 'bg-[#6B5A4E] h-1'
                    }`}
                    style={{
                      height: isPlaying && !isMuted ? `${factor * 100}%` : '4px',
                      animationDelay: `${i * 150}ms`,
                    }}
                  />
                ))}
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-serif font-bold text-[#F5EFE6] leading-tight max-w-[100px] sm:max-w-[150px] truncate">
                  {isVi ? currentTrack.titleVi : currentTrack.titleEn}
                </span>
                <span className="text-[9px] font-sans text-[#D4A043] leading-tight">
                  {isVi ? currentTrack.instrumentVi : currentTrack.instrumentEn}
                </span>
              </div>

              <Sliders className="w-3.5 h-3.5 text-[#BAA796] ml-1 hidden sm:inline" />
            </button>

            {/* Quick Mute Toggle */}
            <button
              type="button"
              onClick={toggleMute}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#BAA796] hover:text-[#F5EFE6] hover:bg-[#322319] transition-colors cursor-pointer"
              title={isMuted ? t('sound.unmute') : t('sound.mute')}
            >
              {isMuted || masterVolume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-[#E05252]" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#D4A043]" />
              )}
            </button>

            {/* Collapse to Icon Button */}
            <button
              type="button"
              onClick={toggleSoundscapeCollapsed}
              className="w-6 h-7 rounded-lg flex items-center justify-center text-[#8E7B6C] hover:text-[#F5EFE6] hover:bg-[#322319] transition-colors cursor-pointer"
              title={isVi ? 'Thu gọn thành biểu tượng' : 'Collapse to icon'}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </div>

      {/* 2. Expanded Soundscape Control Center Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm">
            {/* Backdrop dismiss */}
            <div 
              className="absolute inset-0" 
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl max-h-[88vh] overflow-y-auto bg-gradient-to-b from-[#241A13] to-[#17100A] border border-[#523E2E] rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black/80 text-[#F5EFE6] z-10 custom-scrollbar"
            >
              {/* Subtle imperial glow background pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#D4A043]/10 to-transparent pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#3D2C20] pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A043] to-[#8C2C20] p-0.5 flex items-center justify-center shadow-md">
                    <div className="w-full h-full bg-[#18110B] rounded-[10px] flex items-center justify-center text-[#F3C96B]">
                      <Music2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#F5EFE6] leading-snug">
                      {t('sound.title')}
                    </h3>
                    <p className="text-xs font-sans text-[#D4A043]">
                      {t('sound.subtitle')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-full bg-[#322319] hover:bg-[#463123] text-[#D8CCC0] hover:text-[#F5EFE6] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Player Display */}
              <div className="bg-[#1C140E] border border-[#423023] rounded-2xl p-4 sm:p-5 mb-5 flex flex-col sm:flex-row items-center gap-5">
                {/* Rotating Emblem Disc Visualizer */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: isPlaying && !isMuted ? 360 : 0 }}
                    transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                    className="w-full h-full rounded-full bg-gradient-to-tr from-[#3A281C] via-[#523E2E] to-[#20150E] border-2 border-[#D4A043]/60 flex items-center justify-center shadow-lg"
                  >
                    <Disc3 className="w-12 h-12 text-[#D4A043]" />
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="w-4 h-4 rounded-full bg-[#BA3424] border-2 border-[#F3C96B]" />
                  </div>
                </div>

                {/* Track Info & Main Play Controls */}
                <div className="flex-1 w-full flex flex-col justify-center text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#382619] border border-[#D4A043]/30 text-[#F3C96B] text-[10px] font-sans font-medium w-fit mx-auto sm:mx-0 mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{isVi ? currentTrack.instrumentVi : currentTrack.instrumentEn}</span>
                  </div>
                  <h4 className="font-serif font-bold text-xl text-[#F5EFE6] leading-tight">
                    {isVi ? currentTrack.titleVi : currentTrack.titleEn}
                  </h4>
                  <p className="text-xs font-sans text-[#BAA796] mt-1 line-clamp-2">
                    {isVi ? currentTrack.descriptionVi : currentTrack.descriptionEn}
                  </p>

                  {/* Playback Buttons */}
                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                    <button
                      type="button"
                      onClick={prevTrack}
                      className="w-8 h-8 rounded-lg bg-[#2A1D15] hover:bg-[#3D2C20] text-[#D8CCC0] flex items-center justify-center transition-colors cursor-pointer"
                      title="Bài trước"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={togglePlay}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#536B49] to-[#3B4D33] hover:from-[#627C56] hover:to-[#465A3D] text-[#F5EFE6] font-medium text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>{t('sound.pause')}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          <span>{t('sound.play')}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={nextTrack}
                      className="w-8 h-8 rounded-lg bg-[#2A1D15] hover:bg-[#3D2C20] text-[#D8CCC0] flex items-center justify-center transition-colors cursor-pointer"
                      title="Bài kế tiếp"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        isMuted 
                          ? 'bg-[#4A201A] text-[#E05252]' 
                          : 'bg-[#2A1D15] text-[#D4A043] hover:bg-[#3D2C20]'
                      }`}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Master Volume Slider */}
              <div className="mb-5 bg-[#1B130E] border border-[#3D2C20] rounded-xl p-3.5">
                <div className="flex items-center justify-between text-xs font-sans text-[#D8CCC0] mb-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Volume2 className="w-3.5 h-3.5 text-[#D4A043]" />
                    {t('sound.volume')}
                  </span>
                  <span className="font-mono text-[#F3C96B]">
                    {isMuted ? 'MUTE' : `${Math.round(masterVolume * 100)}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : masterVolume}
                  onChange={(e) => {
                    if (isMuted) toggleMute();
                    setMasterVolume(parseFloat(e.target.value));
                  }}
                  className="w-full h-1.5 bg-[#322319] rounded-lg appearance-none cursor-pointer accent-[#D4A043]"
                />
              </div>

              {/* Ambient Layers Sound Mixer */}
              <div className="mb-5">
                <h5 className="font-serif font-semibold text-sm text-[#F5EFE6] mb-2.5 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#D4A043]" />
                  {t('sound.atmosphere')}
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Wind */}
                  <div className="bg-[#1C140E] border border-[#382619] rounded-xl p-2.5 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] text-[#BAA796]">
                      <span className="flex items-center gap-1">
                        <Wind className="w-3 h-3 text-[#78976A]" />
                        {isVi ? 'Gió' : 'Wind'}
                      </span>
                      <span className="font-mono text-[10px] text-[#D4A043]">{Math.round(windLevel * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={windLevel}
                      onChange={(e) => setWindLevel(parseFloat(e.target.value))}
                      className="w-full h-1 bg-[#322319] rounded-lg appearance-none cursor-pointer accent-[#78976A]"
                    />
                  </div>

                  {/* Stream */}
                  <div className="bg-[#1C140E] border border-[#382619] rounded-xl p-2.5 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] text-[#BAA796]">
                      <span className="flex items-center gap-1">
                        <Waves className="w-3 h-3 text-[#4EA8DE]" />
                        {isVi ? 'Suối' : 'Stream'}
                      </span>
                      <span className="font-mono text-[10px] text-[#D4A043]">{Math.round(streamLevel * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={streamLevel}
                      onChange={(e) => setStreamLevel(parseFloat(e.target.value))}
                      className="w-full h-1 bg-[#322319] rounded-lg appearance-none cursor-pointer accent-[#4EA8DE]"
                    />
                  </div>

                  {/* Birds */}
                  <div className="bg-[#1C140E] border border-[#382619] rounded-xl p-2.5 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] text-[#BAA796]">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#F3C96B]" />
                        {isVi ? 'Chim' : 'Birds'}
                      </span>
                      <span className="font-mono text-[10px] text-[#D4A043]">{Math.round(birdsLevel * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={birdsLevel}
                      onChange={(e) => setBirdsLevel(parseFloat(e.target.value))}
                      className="w-full h-1 bg-[#322319] rounded-lg appearance-none cursor-pointer accent-[#F3C96B]"
                    />
                  </div>

                  {/* Chimes */}
                  <div className="bg-[#1C140E] border border-[#382619] rounded-xl p-2.5 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] text-[#BAA796]">
                      <span className="flex items-center gap-1">
                        <BellRing className="w-3 h-3 text-[#D4A043]" />
                        {isVi ? 'Chuông' : 'Chimes'}
                      </span>
                      <span className="font-mono text-[10px] text-[#D4A043]">{Math.round(chimesLevel * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={chimesLevel}
                      onChange={(e) => setChimesLevel(parseFloat(e.target.value))}
                      className="w-full h-1 bg-[#322319] rounded-lg appearance-none cursor-pointer accent-[#D4A043]"
                    />
                  </div>
                </div>
              </div>

              {/* Playlist Tracks Selection */}
              <div>
                <h5 className="font-serif font-semibold text-sm text-[#F5EFE6] mb-2 flex items-center gap-1.5">
                  <Music2 className="w-3.5 h-3.5 text-[#D4A043]" />
                  {t('sound.track')}
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tracks.map((track) => {
                    const isSelected = track.id === currentTrack.id;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => {
                          setTrack(track.id);
                          if (!isPlaying) togglePlay();
                        }}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#382619] border-[#D4A043] text-[#F5EFE6] shadow-sm'
                            : 'bg-[#1C140E] border-[#382619] text-[#BAA796] hover:text-[#F5EFE6] hover:bg-[#2A1D15]'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected ? 'bg-[#536B49] text-white' : 'bg-[#2A1D15] text-[#D4A043]'
                        }`}>
                          {isSelected && isPlaying ? (
                            <Pause className="w-3 h-3 fill-current" />
                          ) : (
                            <Play className="w-3 h-3 fill-current ml-0.5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-serif font-bold truncate">
                            {isVi ? track.titleVi : track.titleEn}
                          </p>
                          <p className="text-[10px] text-[#D4A043] truncate font-sans">
                            {isVi ? track.instrumentVi : track.instrumentEn}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer hint */}
              <div className="mt-4 pt-3 border-t border-[#382619] flex items-center justify-between text-[11px] text-[#BAA796]">
                <span>{t('sound.tip')}</span>
                <span className="text-[#D4A043] font-semibold">Web Audio 60fps</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
