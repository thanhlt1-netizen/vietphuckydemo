import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AppSettings {
  // Âm thanh & Nhạc nền
  autoplaySoundscape: boolean;
  defaultTrackId: string;
  masterVolume: number;
  soundEffects: boolean;
  
  // Đồ họa & Hiệu ứng
  goldParticles: boolean;
  parallaxFog: boolean;
  performanceMode: 'high' | 'eco';
  
  // Xưởng Phục Trang & Tiện ích
  defaultModelGender: 'female' | 'male';
  autoSaveDrafts: boolean;
  soundscapeCollapsed: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  autoplaySoundscape: true,
  defaultTrackId: 'luu-thuy',
  masterVolume: 0.7,
  soundEffects: true,
  goldParticles: true,
  parallaxFog: true,
  performanceMode: 'high',
  defaultModelGender: 'female',
  autoSaveDrafts: true,
  soundscapeCollapsed: false,
};

const STORAGE_KEY = 'vietphuc_app_settings';

interface AppSettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  toggleSoundscapeCollapsed: () => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const toggleSoundscapeCollapsed = () => {
    setSettings((prev) => ({
      ...prev,
      soundscapeCollapsed: !prev.soundscapeCollapsed,
    }));
  };

  return (
    <AppSettingsContext.Provider
      value={{
        settings,
        updateSetting,
        updateSettings,
        resetSettings,
        toggleSoundscapeCollapsed,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = (): AppSettingsContextType => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};
