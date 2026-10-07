import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundscapeEngine, TrackInfo, SOUNDSCAPE_TRACKS } from '../services/soundscapeEngine';

interface SoundscapeContextType {
  isPlaying: boolean;
  isMuted: boolean;
  currentTrack: TrackInfo;
  tracks: TrackInfo[];
  masterVolume: number;
  windLevel: number;
  streamLevel: number;
  birdsLevel: number;
  chimesLevel: number;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  setTrack: (trackId: string) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setMasterVolume: (vol: number) => void;
  setWindLevel: (val: number) => void;
  setStreamLevel: (val: number) => void;
  setBirdsLevel: (val: number) => void;
  setChimesLevel: (val: number) => void;
}

const SoundscapeContext = createContext<SoundscapeContextType | undefined>(undefined);

export const SoundscapeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(() => soundscapeEngine.getState());

  useEffect(() => {
    const unsubscribe = soundscapeEngine.subscribe(() => {
      setState(soundscapeEngine.getState());
    });
    return unsubscribe;
  }, []);

  // Tự động phát âm thanh khi vào app (nếu không bị tắt trong Cài đặt)
  useEffect(() => {
    let autoplayAllowed = true;
    try {
      const saved = localStorage.getItem('vietphuc_app_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.autoplaySoundscape === false) {
          autoplayAllowed = false;
        }
        if (parsed.defaultTrackId) {
          soundscapeEngine.setTrack(parsed.defaultTrackId);
        }
        if (typeof parsed.masterVolume === 'number') {
          soundscapeEngine.setMasterVolume(parsed.masterVolume);
        }
      }
    } catch {}

    if (autoplayAllowed && !soundscapeEngine.getState().isPlaying) {
      // Thử phát ngay lập tức
      soundscapeEngine.play();

      // Nếu trình duyệt chặn AudioContext vì chưa có user gesture, lắng nghe tương tác đầu tiên của người dùng
      const handleFirstInteraction = () => {
        let currentAllowed = true;
        try {
          const saved = localStorage.getItem('vietphuc_app_settings');
          if (saved && JSON.parse(saved).autoplaySoundscape === false) {
            currentAllowed = false;
          }
        } catch {}

        if (currentAllowed && !soundscapeEngine.getState().isPlaying) {
          soundscapeEngine.play();
        }
        cleanupListeners();
      };

      const cleanupListeners = () => {
        window.removeEventListener('pointerdown', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
        window.removeEventListener('click', handleFirstInteraction);
      };

      window.addEventListener('pointerdown', handleFirstInteraction, { passive: true, once: true });
      window.addEventListener('touchstart', handleFirstInteraction, { passive: true, once: true });
      window.addEventListener('keydown', handleFirstInteraction, { passive: true, once: true });
      window.addEventListener('click', handleFirstInteraction, { passive: true, once: true });

      return cleanupListeners;
    }
  }, []);

  return (
    <SoundscapeContext.Provider
      value={{
        isPlaying: state.isPlaying,
        isMuted: state.isMuted,
        currentTrack: state.currentTrack,
        tracks: SOUNDSCAPE_TRACKS,
        masterVolume: state.masterVolume,
        windLevel: state.windLevel,
        streamLevel: state.streamLevel,
        birdsLevel: state.birdsLevel,
        chimesLevel: state.chimesLevel,
        play: () => soundscapeEngine.play(),
        pause: () => soundscapeEngine.pause(),
        togglePlay: () => soundscapeEngine.togglePlay(),
        toggleMute: () => soundscapeEngine.toggleMute(),
        setTrack: (id: string) => soundscapeEngine.setTrack(id),
        nextTrack: () => soundscapeEngine.nextTrack(),
        prevTrack: () => soundscapeEngine.prevTrack(),
        setMasterVolume: (v: number) => soundscapeEngine.setMasterVolume(v),
        setWindLevel: (v: number) => soundscapeEngine.setWindLevel(v),
        setStreamLevel: (v: number) => soundscapeEngine.setStreamLevel(v),
        setBirdsLevel: (v: number) => soundscapeEngine.setBirdsLevel(v),
        setChimesLevel: (v: number) => soundscapeEngine.setChimesLevel(v),
      }}
    >
      {children}
    </SoundscapeContext.Provider>
  );
};

export const useSoundscape = (): SoundscapeContextType => {
  const context = useContext(SoundscapeContext);
  if (!context) {
    throw new Error('useSoundscape must be used within a SoundscapeProvider');
  }
  return context;
};
