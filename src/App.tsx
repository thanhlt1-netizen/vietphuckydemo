import React, { useState, useCallback, useEffect } from 'react';
import { TailorRealm } from './components/realms/TailorRealm';
import { motion, AnimatePresence } from 'motion/react';
import { VietnameseMotifs } from './components/VietnameseMotifs';
import { ImperialRealmBackground, preloadRealmBackgrounds } from './components/ImperialRealmBackground';
import { GoldParticles } from './components/GoldParticles';
import { ParallaxFogOverlay } from './components/ParallaxFogOverlay';
import { RightActionDock } from './components/RightActionDock';
import { HomeRealm } from './components/realms/HomeRealm';
import { AboutRealm } from './components/realms/AboutRealm';
import { SilkRibbonTransition } from './components/transitions/SilkRibbonTransition';
import { LoginRealm } from './components/realms/LoginRealm';
import { GateRealm } from './components/realms/GateRealm';
import { ResonanceRealm } from './components/realms/ResonanceRealm';
import { CostumesRealm } from './components/realms/CostumesRealm';
import { ProfileRealm } from './components/realms/ProfileRealm';
import { AtelierRealm } from './components/realms/AtelierRealm';
import { OracleRealm } from './components/realms/OracleRealm';
import { VirtualTryOnRealm } from './components/realms/VirtualTryOnRealm';
import { ForumRealm } from './components/realms/ForumRealm';
import { ChronicleRealm } from './components/realms/ChronicleRealm';
import { RealmPlaceholderStage } from './components/realms/RealmPlaceholderStage';
import { RealmScene, SCENES } from './types/scenes';
import { UserProfile } from './types/auth';
import { ContextSelection, RecommendedCostume } from './types/context';
import { AIEvaluationSummary, OutfitCustomization } from './types/customization';
import { getCostumeDefaultColors } from './data/costumeDefaults';
import { DEFAULT_FEATURED_COSTUMES } from './services/recommendationService';
import { LanguageProvider } from './contexts/LanguageContext';
import { AppSettingsProvider, useAppSettings } from './contexts/AppSettingsContext';
import { SoundscapeProvider } from './contexts/SoundscapeContext';
import { SoundscapeManager } from './components/audio/SoundscapeManager';

const SCENE_FLOW: RealmScene[] = [
  'gate',
  'home',
  'resonance',
  'sanctuary',
  'atelier',
  'oracle',
  'tryon',
  'forum',
  'tailor',
  'chronicle',
  'profile',
  'about',
];

function AppContent() {
  const { settings } = useAppSettings();

  // Authentication state with local persistence
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('vietphuc_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Preload toàn bộ ảnh nền di sản ngay khi ứng dụng khởi chạy
  useEffect(() => {
    preloadRealmBackgrounds();
  }, []);

  // Điều hướng đến Lookbook khi mở liên kết chia sẻ có chứa hash #lookbook
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (hash && hash.includes('lookbook') && user) {
        setCurrentScene('chronicle');
      }
    };
    handleHashNavigation();
    window.addEventListener('hashchange', handleHashNavigation);
    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, [user]);

  // Multicolored Silk Ribbon Transition State
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Context & Costume Recommendation state with persistence
  const [currentContext, setCurrentContext] = useState<ContextSelection | null>(() => {
    try {
      const saved = localStorage.getItem('vietphuc_context');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [recommendedCostumes, setRecommendedCostumes] = useState<RecommendedCostume[]>(() => {
    try {
      const saved = localStorage.getItem('vietphuc_recommendations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedCostume, setSelectedCostume] = useState<RecommendedCostume | null>(() => {
    try {
      const saved = localStorage.getItem('vietphuc_selected_costume');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [latestCustomization, setLatestCustomization] = useState<OutfitCustomization | null>(() => {
    try {
      const saved = localStorage.getItem('vietphuc_current_customization');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [latestAIEvaluation, setLatestAIEvaluation] = useState<AIEvaluationSummary | null>(() => {
    try {
      const saved = localStorage.getItem('vietphuc_latest_ai_evaluation');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentScene, setCurrentScene] = useState<RealmScene>('gate');

  const currentIndex = SCENE_FLOW.indexOf(currentScene);

  /**
   * Kích hoạt chuyển cảnh Cinematic Tối Ưu Hiệu Năng (Thời lượng ~0.36s)
   */
  const triggerTransition = useCallback((action: () => void) => {
    setIsTransitioning(true);
    setPendingAction(() => action);
  }, []);

  const handleTransitionMidpoint = useCallback(() => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // Điều hướng chuyển trang mượt mà qua hiệu ứng Dải Lụa Đa Sắc
  const navigateTo = useCallback(
    (nextScene: RealmScene) => {
      if (nextScene === currentScene || isTransitioning) return;

      triggerTransition(() => {
        setCurrentScene(nextScene);
      });
    },
    [currentScene, isTransitioning, triggerTransition]
  );

  const handleNextScene = useCallback(() => {
    if (currentIndex < SCENE_FLOW.length - 2) {
      navigateTo(SCENE_FLOW[currentIndex + 1]);
    } else {
      navigateTo('gate');
    }
  }, [currentIndex, navigateTo]);

  const handlePreviousScene = useCallback(() => {
    if (currentIndex > 0) {
      navigateTo(SCENE_FLOW[currentIndex - 1]);
    }
  }, [currentIndex, navigateTo]);

  // Thanh điều hướng dọc chỉ hiển thị khi người dùng vào các chức năng sau màn hình chính
  const showDock =
    Boolean(user) &&
    currentScene !== 'gate' &&
    currentScene !== 'home';

  // Đăng nhập thành công
  const handleLoginSuccess = useCallback(
    (authenticatedUser: UserProfile) => {
      triggerTransition(() => {
        setUser(authenticatedUser);
        try {
          localStorage.setItem('vietphuc_user', JSON.stringify(authenticatedUser));
        } catch {}
        setCurrentScene('gate');
      });
    },
    [triggerTransition]
  );

  // Đăng xuất
  const handleLogout = useCallback(() => {
    triggerTransition(() => {
      setUser(null);
      try {
        localStorage.removeItem('vietphuc_user');
      } catch {}
      setCurrentScene('gate');
    });
  }, [triggerTransition]);

  // Profile Update Handler
  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    try {
      localStorage.setItem('vietphuc_user', JSON.stringify(updatedUser));
    } catch {}
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!user) return;
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === 'ArrowRight' && currentScene !== 'profile') {
        handleNextScene();
      } else if (e.key === 'ArrowLeft' && currentScene !== 'gate') {
        handlePreviousScene();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextScene, handlePreviousScene, user, currentScene]);

  // Cinematic soft fade
  const realmVariants = {
    enter: {
      opacity: 0,
      scale: 0.995,
      y: 6,
    },
    center: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.26,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.995,
      y: -4,
      transition: {
        duration: 0.16,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    },
  };

  const isContentScreen = user ? currentScene !== 'gate' : false;

  return (
    <div className="relative min-h-screen bg-[#1C140E] text-[#F5EFE6] selection:bg-[#465A3D]/60 selection:text-[#F5EFE6] overflow-x-hidden flex flex-col justify-between">
      {/* 1. Global Ambient Soundscape Manager & Language Switcher */}
      <SoundscapeManager />

      {/* 2. Deep Atmospheric Warm Motifs */}
      <VietnameseMotifs />

      {/* 3. Ancient Vietnamese Imperial Scenery & Swaying Lanterns */}
      <ImperialRealmBackground
        currentScene={currentScene}
        isLoggedIn={Boolean(user)}
      />

      {/* 4. Parallax Fog Overlay */}
      {settings.parallaxFog && <ParallaxFogOverlay isContentScreen={isContentScreen} />}

      {/* 5. Floating Golden Dust & Petals */}
      {settings.goldParticles && <GoldParticles />}

      {/* 6. Right Vertical Action Column */}
      {showDock && (
        <RightActionDock
          currentScene={currentScene}
          onNavigate={navigateTo}
          avatarUrl={user?.avatarUrl || user?.avatar}
        />
      )}

      {/* 7. Main Stage Content View */}
      <main className={`flex-1 flex flex-col justify-center relative z-10 w-full transition-all duration-300 ${
        showDock ? 'pb-24 md:pb-8 md:pr-16 lg:pr-20' : 'pb-6'
      }`}>
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div
              key="auth-login-screen"
              variants={realmVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex-1 flex flex-col justify-center"
            >
              <LoginRealm onLoginSuccess={handleLoginSuccess} />
            </motion.div>
          ) : (
            <motion.div
              key={currentScene}
              variants={realmVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex-1 flex flex-col justify-center"
            >
              {currentScene === 'gate' ? (
                <GateRealm
                  onEnterWorld={() => navigateTo('home')}
                />
              ) : currentScene === 'home' ? (
                <HomeRealm onNavigate={navigateTo} />
              ) : currentScene === 'about' ? (
                <AboutRealm onBack={() => navigateTo('home')} />
              ) : currentScene === 'resonance' ? (
                <ResonanceRealm
                  initialSelection={currentContext}
                  onContinue={(selection, recommendations) => {
                    setCurrentContext(selection);
                    setRecommendedCostumes(recommendations);
                    if (recommendations.length > 0) {
                      setSelectedCostume(recommendations[0]);
                    }
                    try {
                      localStorage.setItem('vietphuc_context', JSON.stringify(selection));
                      localStorage.setItem(
                        'vietphuc_recommendations',
                        JSON.stringify(recommendations)
                      );
                      if (recommendations.length > 0) {
                        localStorage.setItem(
                          'vietphuc_selected_costume',
                          JSON.stringify(recommendations[0])
                        );
                      }
                    } catch {}
                    navigateTo('sanctuary');
                  }}
                  onBack={handlePreviousScene}
                />
              ) : currentScene === 'sanctuary' ? (
                <CostumesRealm
                  contextSelection={currentContext}
                  recommendedCostumes={recommendedCostumes}
                  selectedCostumeId={selectedCostume?.id}
                  selectedCostume={selectedCostume}
                  onSelectCostume={(costume) => {
                    setSelectedCostume(costume);
                    setLatestAIEvaluation(null);
                    try {
                      localStorage.removeItem('vietphuc_latest_ai_evaluation');
                    } catch {}

                    const spec = getCostumeDefaultColors(costume.id);
                    const newCustom: OutfitCustomization = {
                      costumeId: costume.id,
                      costumeName: costume.name,
                      gender: latestCustomization?.gender || 'female',
                      parts: {
                        primaryRobeColor: spec.primaryRobeColor,
                        innerCollarColor: spec.innerCollarColor,
                        bottomColor: spec.bottomColor,
                        sashColor: spec.sashColor,
                      },
                      pattern: spec.defaultPattern,
                      accessories: spec.defaultAccessories as any[],
                      lastUpdated: Date.now(),
                    };
                    setLatestCustomization(newCustom);

                    try {
                      localStorage.setItem('vietphuc_selected_costume', JSON.stringify(costume));
                      localStorage.setItem('vietphuc_current_customization', JSON.stringify(newCustom));
                    } catch {}
                  }}
                  onContinue={() => navigateTo('atelier')}
                  onBack={handlePreviousScene}
                />
              ) : currentScene === 'atelier' ? (
                <AtelierRealm
                  selectedCostume={selectedCostume}
                  onSendForAIEvaluation={(evaluation, customDesign) => {
                    setLatestAIEvaluation(evaluation);
                    setLatestCustomization(customDesign);
                    navigateTo('oracle');
                  }}
                  onContinueDirect={(customDesign) => {
                    setLatestCustomization(customDesign);
                    navigateTo('tryon');
                  }}
                  onNavigateToForum={() => navigateTo('forum')}
                  onBack={() => navigateTo('sanctuary')}
                  onNavigateToTailor={(customDesign) => {
                    setLatestCustomization(customDesign);
                    navigateTo('tailor');
                  }}
                  onNavigateToLookbook={() => navigateTo('chronicle')}
                />
              ) : currentScene === 'oracle' ? (
                <OracleRealm
                  evaluation={latestAIEvaluation}
                  customization={latestCustomization}
                  selectedCostume={selectedCostume}
                  onModify={() => navigateTo('atelier')}
                  onProceedToTryOn={() => navigateTo('tryon')}
                  onSaveToLookbook={() => navigateTo('chronicle')}
                  onSaveEvaluation={(evalSummary) => {
                    setLatestAIEvaluation(evalSummary);
                    setLatestCustomization(evalSummary.customizationSnapshot);
                  }}
                />
              ) : currentScene === 'tryon' ? (
                <VirtualTryOnRealm
                  customization={latestCustomization}
                  selectedCostume={selectedCostume}
                  onNavigateToLookbook={() => navigateTo('chronicle')}
                  onBackToCustomizer={() => navigateTo('atelier')}
                />
              ) : currentScene === 'tailor' ? (
                <TailorRealm
                  currentCustomization={latestCustomization}
                  onBack={() => navigateTo('atelier')}
                />
              ) : currentScene === 'forum' ? (
                <ForumRealm
                  currentCustomization={latestCustomization}
                  onApplyOutfit={(outfit) => {
                    setLatestCustomization(outfit);
                    try {
                      localStorage.setItem(
                        'vietphuc_current_customization',
                        JSON.stringify(outfit)
                      );
                    } catch {}
                    navigateTo('atelier');
                  }}
                  onTryOnOutfit={(outfit) => {
                    setLatestCustomization(outfit);
                    try {
                      localStorage.setItem(
                        'vietphuc_current_customization',
                        JSON.stringify(outfit)
                      );
                    } catch {}
                    navigateTo('tryon');
                  }}
                  onNavigateToCustomizer={() => navigateTo('atelier')}
                />
              ) : currentScene === 'chronicle' ? (
                <ChronicleRealm
                  onBackToTryOn={() => navigateTo('tryon')}
                  onBackToHome={() => navigateTo('gate')}
                  onNavigateToAtelier={() => navigateTo('atelier')}
                  onQuickTryOn={(customDesign) => {
                    setLatestCustomization(customDesign);
                    if (customDesign.costumeId) {
                      const matched = DEFAULT_FEATURED_COSTUMES.find(
                        (c) => c.id === customDesign.costumeId
                      );
                      if (matched) {
                        setSelectedCostume(matched);
                        try {
                          localStorage.setItem('vietphuc_selected_costume', JSON.stringify(matched));
                        } catch {}
                      }
                    }
                    try {
                      localStorage.setItem(
                        'vietphuc_current_customization',
                        JSON.stringify(customDesign)
                      );
                    } catch {}
                    navigateTo('tryon');
                  }}
                />
              ) : currentScene === 'profile' ? (
                <ProfileRealm
                  user={user}
                  onUpdateProfile={handleUpdateProfile}
                  onLogout={handleLogout}
                  onBack={() => navigateTo('gate')}
                />
              ) : (
                <RealmPlaceholderStage
                  scene={SCENES[currentScene]}
                  selectedCostume={selectedCostume}
                  onContinue={handleNextScene}
                  onBack={handlePreviousScene}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 8. Hiệu ứng Chuyển Cảnh Cinematic */}
      <SilkRibbonTransition
        isTransitioning={isTransitioning}
        onMidpoint={handleTransitionMidpoint}
        onComplete={handleTransitionComplete}
        duration={0.36}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppSettingsProvider>
        <SoundscapeProvider>
          <AppContent />
        </SoundscapeProvider>
      </AppSettingsProvider>
    </LanguageProvider>
  );
}
