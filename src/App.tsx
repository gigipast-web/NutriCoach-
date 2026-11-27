import React, { useState, useEffect, useRef } from 'react';
import {
  TabType,
  UserProfile,
  MealEntry,
  WeightEntry,
  WaterData,
  ActivityEntry,
  FoodItem,
  Recipe,
  ChatMessage,
  MealType,
} from './types.ts';
import {
  initialUser,
  demoUser,
  initialMeals,
  initialWeightHistory,
  initialActivities,
  defaultRecipes,
  initialBadges,
  initialReminders,
} from './data/initialData.ts';
import { ALL_SEASONAL_RECIPES } from './data/weeklyRecipes.ts';
import { calculateMetrics } from './utils/metrics.ts';
import { Navigation } from './components/Navigation.tsx';
import { RegistrationView } from './components/RegistrationView.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { JournalView } from './components/JournalView.tsx';
import { AiCoachView } from './components/AiCoachView.tsx';
import { ProgressView } from './components/ProgressView.tsx';
import { HydrationView } from './components/HydrationView.tsx';
import { RecipesView } from './components/RecipesView.tsx';
import { BadgesView } from './components/BadgesView.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { BarcodeScannerModal } from './components/BarcodeScannerModal.tsx';
import { PremiumModal } from './components/PremiumModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ShareModal } from './components/ShareModal.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { PWAInstallBanner } from './components/PWAInstallBanner.tsx';
import { TrialExpiredPaywall } from './components/TrialExpiredPaywall.tsx';
import { Footer } from './components/Footer.tsx';
import { usePWAInstall } from './hooks/usePWAInstall.ts';
import { useLanguage } from './i18n/LanguageContext.tsx';
import { useDecor } from './theme/DecorContext.tsx';
import { WinterSnowfallOverlay } from './components/WinterSnowfallOverlay.tsx';
import { getDashboardUi } from './i18n/dashboardI18n.ts';
import { getUiCore } from './i18n/uiCoreI18n.ts';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertCircle, X, Volume2, VolumeX, Mic } from 'lucide-react';
import { playWelcomeVoiceGreeting, stopSpeaking } from './utils/voiceCoach.ts';

export default function App() {
  const { language, locale } = useLanguage();
  const core = getUiCore(language);
  const languageRef = useRef(language);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);
  const { isInstalled: isStandaloneApp } = usePWAInstall();
  const { activeSeason } = useDecor();

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('nutricoach_theme');
    return saved ? saved === 'dark' : false;
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [coachSubTab, setCoachSubTab] = useState<'chat' | 'photo' | 'generator'>('chat');
  const [coachSubTabTrigger, setCoachSubTabTrigger] = useState(0);

  // Payment notification banner
  const [paymentNotice, setPaymentNotice] = useState<{
    type: 'success' | 'cancelled';
    message: string;
  } | null>(null);

  // Quick UX feedback toast (meals, water, steps, weigh-in)
  const [actionToast, setActionToast] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => {
      setActionToast((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // User Profile (with device-level 30-day trial start enforcement)
  const [user, setUser] = useState<UserProfile>(() => {
    const storedDeviceTrialStart = localStorage.getItem('nutricoach_trial_started_at');
    const computeRemaining = (startIso: string) => {
      const ms = new Date(startIso).getTime();
      if (isNaN(ms)) return 30;
      const daysPassed = Math.floor((Date.now() - ms) / (1000 * 60 * 60 * 24));
      return Math.max(0, 30 - daysPassed);
    };

    const saved = localStorage.getItem('nutricoach_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.isLoggedIn && parsed.name && parsed.name !== 'Invité') {
          if (!parsed.trialStartDate) {
            if (typeof parsed.trialDaysRemaining === 'number' && parsed.trialDaysRemaining <= 0) {
              const expiredStart = new Date();
              expiredStart.setDate(expiredStart.getDate() - 30);
              parsed.trialStartDate = expiredStart.toISOString();
            } else {
              parsed.trialStartDate = storedDeviceTrialStart || new Date().toISOString();
            }
          }
          if (storedDeviceTrialStart) {
            const deviceMs = new Date(storedDeviceTrialStart).getTime();
            const parsedMs = new Date(parsed.trialStartDate).getTime();
            if (!isNaN(deviceMs) && (isNaN(parsedMs) || deviceMs < parsedMs)) {
              parsed.trialStartDate = storedDeviceTrialStart;
            }
          }
          localStorage.setItem('nutricoach_trial_started_at', parsed.trialStartDate);

          const computedRemaining = computeRemaining(parsed.trialStartDate);
          parsed.trialDaysRemaining =
            typeof parsed.trialDaysRemaining === 'number'
              ? Math.min(parsed.trialDaysRemaining, computedRemaining)
              : computedRemaining;
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }

    const startDate = storedDeviceTrialStart || initialUser.trialStartDate || new Date().toISOString();
    localStorage.setItem('nutricoach_trial_started_at', startDate);
    return {
      ...initialUser,
      trialStartDate: startDate,
      trialDaysRemaining: computeRemaining(startDate),
    };
  });

  // Meals
  const [meals, setMeals] = useState<MealEntry[]>(() => {
    const saved = localStorage.getItem('nutricoach_meals');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Remove legacy mock meals m1 to m5 so morning starts with empty fields
          return parsed.filter((m) => !['m1', 'm2', 'm3', 'm4', 'm5'].includes(m.id));
        }
      } catch (e) {}
    }
    return initialMeals;
  });

  // Weight History
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>(() => {
    const saved = localStorage.getItem('nutricoach_weight_history');
    return saved ? JSON.parse(saved) : initialWeightHistory;
  });

  // Water Data
  const [water, setWater] = useState<WaterData>(() => {
    const saved = localStorage.getItem('nutricoach_water');
    const today = new Date().toISOString().split('T')[0];
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) return parsed;
    }
    return {
      date: today,
      glassesCount: 5,
      amountMl: 1250,
    };
  });

  // Activities
  const [activities, setActivities] = useState<ActivityEntry[]>(() => {
    const saved = localStorage.getItem('nutricoach_activities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Remove legacy mock activity 'a1' (Marche active du matin)
          return parsed.filter((a) => a.id !== 'a1' && a.title !== 'Marche active du matin');
        }
      } catch (e) {}
    }
    return initialActivities;
  });

  // Recipes with weekly seasonal rotation & custom AI generation
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('nutricoach_recipes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return ALL_SEASONAL_RECIPES;
  });

  const handleAddNewWeeklyRecipes = (newRecipes: Recipe[]) => {
    setRecipes((prev) => {
      const merged = [...newRecipes, ...prev.filter((p) => !newRecipes.some((n) => n.id === p.id))];
      try {
        localStorage.setItem('nutricoach_recipes', JSON.stringify(merged));
      } catch (e) {}
      return merged;
    });
  };

  // Badges
  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem('nutricoach_badges');
    return saved ? JSON.parse(saved) : initialBadges;
  });

  // Reminders
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('nutricoach_reminders');
    return saved ? JSON.parse(saved) : initialReminders;
  });

  // Chat Messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('nutricoach_chat');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    const now = new Date();
    const time1 = new Date(now.getTime() - 15 * 60000).toISOString();
    const time2 = new Date(now.getTime() - 12 * 60000).toISOString();
    const time3 = new Date(now.getTime() - 10 * 60000).toISOString();
    return [
      {
        id: 'msg_1',
        sender: 'assistant',
        text: `Bonjour ${user.name || 'Clara'} !\nComment vous sentez-vous aujourd'hui ?`,
        timestamp: time1,
      },
      {
        id: 'msg_2',
        sender: 'user',
        text: "Plutôt bien, mais j'ai une petite fringale ce matin...",
        timestamp: time2,
      },
      {
        id: 'msg_3',
        sender: 'assistant',
        text: "Pas de souci ! 😊\nVoici une idée saine et gourmande :\n\nUn yaourt nature avec des fruits et quelques amandes.\n\nCela vous apportera de l'énergie sans excès de calories.",
        timestamp: time3,
      },
    ];
  });

  // Modals state
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Streak state
  const [streakDays] = useState(7);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nutricoach_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nutricoach_theme', 'light');
    }
  }, [isDarkMode]);

  // Handle Deep Links, Web Links, and Custom Protocol Schemes (web+nutricoach)
  const handleDeepLink = (locationUrl: { search: string; hash?: string }) => {
    try {
      const searchParams = new URLSearchParams(locationUrl.search);
      const tab = searchParams.get('tab');
      const action = searchParams.get('action');
      const protocolAction = searchParams.get('protocol_action');

      // 1. Direct tab routing (e.g. ?tab=journal or ?tab=aicoach)
      if (tab) {
        const validTabs: TabType[] = [
          'dashboard',
          'journal',
          'aicoach',
          'progress',
          'hydration',
          'recipes',
          'badges',
          'profile',
        ];
        if (validTabs.includes(tab as TabType)) {
          setActiveTab(tab as TabType);
        }
      }

      // 2. Custom protocol scheme handling (web+nutricoach://...)
      if (protocolAction) {
        const decoded = decodeURIComponent(protocolAction).toLowerCase();
        if (decoded.includes('journal') || decoded.includes('repas') || decoded.includes('meal')) {
          setActiveTab('journal');
        } else if (decoded.includes('coach') || decoded.includes('ai') || decoded.includes('chat')) {
          setActiveTab('aicoach');
        } else if (decoded.includes('hydration') || decoded.includes('eau') || decoded.includes('water')) {
          setActiveTab('hydration');
        } else if (decoded.includes('recipe') || decoded.includes('recette')) {
          setActiveTab('recipes');
        } else if (decoded.includes('progress') || decoded.includes('poids') || decoded.includes('weight')) {
          setActiveTab('progress');
        } else if (decoded.includes('scan') || decoded.includes('scanner') || decoded.includes('photo')) {
          setCoachSubTab('photo');
          setCoachSubTabTrigger((c) => c + 1);
          setActiveTab('aicoach');
        } else if (decoded.includes('barcode') || decoded.includes('codebarre')) {
          setIsBarcodeModalOpen(true);
        }
      }

      // 3. Quick action parameters (?action=scan, ?action=barcode, ?action=water, etc.)
      if (action === 'scan' || action === 'camera') {
        setCoachSubTab('photo');
        setCoachSubTabTrigger((c) => c + 1);
        setActiveTab('aicoach');
      } else if (action === 'barcode') {
        setIsBarcodeModalOpen(true);
      } else if (action === 'water') {
        setActiveTab('hydration');
      } else if (action === 'meal') {
        setActiveTab('journal');
      }
    } catch (e) {
      console.warn('Error processing deep link:', e);
    }
  };

  useEffect(() => {
    // 1. Check current URL for deep links & custom protocol actions
    handleDeepLink(window.location);

    // 2. Support W3C / Chromium Launch Queue API for installed PWAs
    if (
      typeof window !== 'undefined' &&
      'launchQueue' in window &&
      typeof (window as any).launchQueue?.setConsumer === 'function'
    ) {
      (window as any).launchQueue.setConsumer((launchParams: any) => {
        if (launchParams?.targetURL) {
          try {
            const launchedUrl = new URL(launchParams.targetURL);
            handleDeepLink(launchedUrl);
          } catch (err) {
            console.warn('launchQueue error:', err);
          }
        }
      });
    }

    // 3. Register custom scheme web+nutricoach in browser if supported
    if (typeof navigator !== 'undefined' && 'registerProtocolHandler' in navigator) {
      try {
        navigator.registerProtocolHandler(
          'web+nutricoach',
          `${window.location.origin}/?protocol_action=%s`
        );
      } catch (err) {
        // Ignored if already registered or in restricted iframe
      }
    }
  }, []);

  // Handle Stripe return redirect (?session_id=...&payment_status=success)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const sessionId = searchParams.get('session_id');
      const paymentStatus = searchParams.get('payment_status');

      if (paymentStatus === 'success') {
        const verifyEndpoint = sessionId
          ? `/api/stripe/verify-session?sessionId=${encodeURIComponent(sessionId)}`
          : '/api/stripe/verify-session';

        fetch(verifyEndpoint)
          .then((res) => res.json())
          .then((data) => {
            if (data.isPremium && data.verified && !data.mock) {
              setUser((prev) => ({
                ...prev,
                isPremium: true,
                email: data.customerEmail || prev.email,
              }));

              confetti({
                particleCount: 120,
                spread: 90,
                origin: { y: 0.4 },
              });

              setPaymentNotice({
                type: 'success',
                message: getUiCore(languageRef.current).stripeSuccess,
              });
            } else {
              setPaymentNotice({
                type: 'cancelled',
                message: data.message || getUiCore(languageRef.current).stripeUnconfirmed,
              });
            }
          })
          .catch((err) => {
            console.error('Erreur vérification session Stripe:', err);
            setPaymentNotice({
              type: 'cancelled',
              message: getUiCore(languageRef.current).stripeVerifyError,
            });
          })
          .finally(() => {
            // Clean URL query parameters
            window.history.replaceState({}, document.title, window.location.pathname);
          });
      } else if (paymentStatus === 'cancelled') {
        setPaymentNotice({
          type: 'cancelled',
          message: getUiCore(languageRef.current).stripeCancelled,
        });
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      console.warn('URL params check error:', e);
    }
  }, []);

  // Persist user
  useEffect(() => {
    localStorage.setItem('nutricoach_user', JSON.stringify(user));
  }, [user]);

  // Persist meals
  useEffect(() => {
    localStorage.setItem('nutricoach_meals', JSON.stringify(meals));
  }, [meals]);

  // Persist weight history
  useEffect(() => {
    localStorage.setItem('nutricoach_weight_history', JSON.stringify(weightHistory));
  }, [weightHistory]);

  // Persist water
  useEffect(() => {
    localStorage.setItem('nutricoach_water', JSON.stringify(water));
  }, [water]);

  // Persist activities
  useEffect(() => {
    localStorage.setItem('nutricoach_activities', JSON.stringify(activities));
  }, [activities]);

  // Persist badges
  useEffect(() => {
    localStorage.setItem('nutricoach_badges', JSON.stringify(badges));
  }, [badges]);

  // Persist reminders
  useEffect(() => {
    localStorage.setItem('nutricoach_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Persist chat
  useEffect(() => {
    localStorage.setItem('nutricoach_chat', JSON.stringify(messages));
  }, [messages]);

  // Voice greeting states
  const [isVoiceSpeakingGreeting, setIsVoiceSpeakingGreeting] = useState(false);
  const [showVoiceGreetingNotice, setShowVoiceGreetingNotice] = useState(true);

  const handleTriggerWelcomeVoice = () => {
    if (isVoiceSpeakingGreeting) {
      stopSpeaking();
      setIsVoiceSpeakingGreeting(false);
      return;
    }

    setShowVoiceGreetingNotice(false);
    setIsVoiceSpeakingGreeting(true);

    playWelcomeVoiceGreeting(user.name, language, {
      onStart: () => setIsVoiceSpeakingGreeting(true),
      onEnd: () => setIsVoiceSpeakingGreeting(false),
      onError: () => setIsVoiceSpeakingGreeting(false),
    });
  };

  // Keep trial countdown synchronized live (especially when PWA resumes from background)
  useEffect(() => {
    const syncTrialClock = () => {
      const startIso = user.trialStartDate || localStorage.getItem('nutricoach_trial_started_at');
      if (!startIso) return;
      const startMs = new Date(startIso).getTime();
      if (isNaN(startMs)) return;
      const daysPassed = Math.floor((Date.now() - startMs) / (1000 * 60 * 60 * 24));
      const computedRemaining = Math.max(0, 30 - daysPassed);
      if (computedRemaining < user.trialDaysRemaining) {
        setUser((prev) =>
          computedRemaining < prev.trialDaysRemaining
            ? { ...prev, trialDaysRemaining: computedRemaining, trialStartDate: startIso }
            : prev
        );
      }
    };

    syncTrialClock();
    const interval = setInterval(syncTrialClock, 60_000);
    const onResume = () => {
      if (document.visibilityState === 'visible') syncTrialClock();
    };
    window.addEventListener('focus', syncTrialClock);
    document.addEventListener('visibilitychange', onResume);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', syncTrialClock);
      document.removeEventListener('visibilitychange', onResume);
    };
  }, [user.trialStartDate, user.trialDaysRemaining]);

  // Trial expiration lock state
  const isTrialExpired = Boolean(user.isLoggedIn && !user.isPremium && user.trialDaysRemaining <= 0);

  // Automatic Coach Voice Greeting on First User Touch or Click (browser autoplay compliant)
  useEffect(() => {
    if (user.autoVoiceGreeting === false || isTrialExpired) {
      return;
    }

    let hasInteracted = false;

    const handleFirstInteraction = () => {
      if (hasInteracted) return;
      hasInteracted = true;

      // Play immediately in response to user click or touch
      playWelcomeVoiceGreeting(user.name, language, {
        onStart: () => {
          setIsVoiceSpeakingGreeting(true);
          setShowVoiceGreetingNotice(false);
        },
        onEnd: () => setIsVoiceSpeakingGreeting(false),
        onError: () => setIsVoiceSpeakingGreeting(false),
      });

      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('pointerdown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('pointerdown', handleFirstInteraction);
    };
  }, [user.autoVoiceGreeting, user.name, language]);

  // Metrics computation
  const metrics = calculateMetrics(user);

  // Handlers
  const handleToggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const handleUpdateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const handleCancelSubscription = async () => {
    try {
      await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
    } catch (e) {
      console.warn('Erreur notification annulation:', e);
    }
    setUser((prev) => ({
      ...prev,
      isPremium: false,
    }));
  };

  const handleAddMeal = (newMeal: Omit<MealEntry, 'id'>) => {
    const mealWithId: MealEntry = {
      ...newMeal,
      id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    };
    setMeals((prev) => [mealWithId, ...prev]);
    triggerToast(core.toastMealAdded(newMeal.foodName, newMeal.calories));
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
  };

  const handleResetTodayMeals = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setMeals((prev) => prev.filter((m) => !m.timestamp?.startsWith(todayStr)));
    triggerToast(core.toastJournalReset);
  };

  const handleAddWeightEntry = (entry: Omit<WeightEntry, 'id'>) => {
    const newEntry: WeightEntry = {
      ...entry,
      id: `w_${Date.now()}`,
    };
    setWeightHistory((prev) => [...prev, newEntry]);
    setUser((prev) => ({ ...prev, currentWeightKg: entry.weightKg }));
    triggerToast(core.toastWeightSaved(String(entry.weightKg)));
  };

  const handleAddWater = (amountMl: number) => {
    setWater((prev) => {
      const nextAmount = Math.max(0, prev.amountMl + amountMl);
      const nextGlasses = Math.round(nextAmount / 250);
      return {
        ...prev,
        amountMl: nextAmount,
        glassesCount: nextGlasses,
      };
    });
    if (amountMl > 0) {
      triggerToast(core.toastWaterAdded(amountMl));
    }
  };

  const handleAddActivity = (newAct: Omit<ActivityEntry, 'id'>) => {
    const actWithId: ActivityEntry = {
      ...newAct,
      id: `act_${Date.now()}`,
    };
    if (newAct.stepsCount > 0) {
      triggerToast(core.toastStepsAdded(newAct.stepsCount.toLocaleString(locale)));
    }

    const WATCH_KEYWORDS = [
      'Montre',
      'Watch',
      'Apple',
      'Garmin',
      'Samsung',
      'Fitbit',
      'Withings',
      'Polar',
      'Suunto',
      'Xiaomi',
      'Amazfit',
      'Bluetooth',
    ];
    const isWatchTitle = (title: string) => WATCH_KEYWORDS.some((kw) => title.includes(kw));
    const isWatchSync = isWatchTitle(newAct.title);

    if (isWatchSync) {
      const todayStr = new Date().toISOString().split('T')[0];
      // Replace prior watch sync for today so the watch measurement is accurate and not duplicated
      setActivities((prev) => {
        const withoutPriorWatchToday = prev.filter(
          (a) => !(a.timestamp?.startsWith(todayStr) && isWatchTitle(a.title))
        );
        return [actWithId, ...withoutPriorWatchToday];
      });
    } else {
      setActivities((prev) => [actWithId, ...prev]);
    }
  };

  const handleResetTodaySteps = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setActivities((prev) => prev.filter((a) => !a.timestamp?.startsWith(todayStr)));
    setUser((prev) => {
      if (prev.connectedWatch) {
        return {
          ...prev,
          connectedWatch: {
            ...prev.connectedWatch,
            syncedStepsToday: 0,
            lastSync: undefined,
          },
        };
      }
      return prev;
    });
  };

  const handleDeleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddMealFromRecipe = (recipe: Recipe) => {
    handleAddMeal({
      mealType: 'dejeuner',
      foodName: recipe.title,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      portionGrams: 250,
      timestamp: new Date().toISOString(),
      imageUrl: recipe.imageUrl,
    });
  };

  const handleScannedFood = (food: FoodItem, mealType: MealType = 'collation', portionGrams = 100) => {
    handleAddMeal({
      mealType,
      foodName: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      portionGrams,
      timestamp: new Date().toISOString(),
    });
  };

  const handleAddMealFromAi = (
    meal: Pick<MealEntry, 'foodName' | 'calories' | 'protein' | 'carbs' | 'fat'> & {
      mealType?: MealType;
      portionGrams?: number;
    }
  ) => {
    handleAddMeal({
      mealType: meal.mealType || 'dejeuner',
      foodName: meal.foodName,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      portionGrams: meal.portionGrams || 200,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          user,
          metrics,
          recentMeals: meals.slice(0, 5),
          language,
        }),
      });
      const data = await res.json();
      const welcomeDict: Record<string, string> = {
        fr: "Je suis votre coach nutritionnel IA. Comment puis-je vous aider aujourd'hui ?",
        en: "I am your AI Nutrition Coach. How can I help you today?",
        es: "Soy tu coach nutricional IA. ¿Cómo puedo ayudarte hoy?",
        de: "Ich bin dein KI-Ernährungscoach. Wie kann ich dir heute helfen?",
        it: "Sono il tuo coach nutrizionale IA. Come posso aiutarti oggi?",
        pt: "Sou seu coach nutricional IA. Como posso te ajudar hoje?",
        no: "Jeg er din KI-ernæringscoach. Hvordan kan jeg hjelpe deg i dag?",
        nl: "Ik ben uw AI-voedingscoach. Hoe kan ik u vandaag helpen?",
        pl: "Jestem Twoim trenerem żywieniowym AI. W czym mogę Ci dzisiaj pomóc?",
        sv: "Jag är din AI-kostcoach. Hur kan jag hjälpa dig idag?",
        da: "Jeg er din AI-ernæringscoach. Hvordan kan jeg hjælpe dig i dag?",
        fi: "Olen tekoälyravitsemusvalmentajasi. Kuinka voin auttaa sinua tänään?",
        ru: "Я ваш ИИ-нутрициолог. Чем я могу помочь вам сегодня?",
        ja: "私はあなたのAI栄養コーチです。本日はどのようなご相談でしょうか？",
        zh: "我是您的AI营养健康教练。今天有什么我可以协助您的吗？",
        ar: "أنا مدربك الغذائي بالذكاء الاصطناعي. كيف يمكنني مساعدتك اليوم؟",
        tr: "Ben sizin yapay zeka beslenme koçunuzum. Bugün size nasıl yardımcı olabilirim?",
        el: "Είμαι ο AI διατροφικός σας σύμβουλος. Πώς μπορώ να σας βοηθήσω σήμερα;",
        cs: "Jsem váš nutriční poradce s AI. Jak vám mohu dnes pomoci?",
        ro: "Sunt nutriționistul tău AI. Cu ce te pot ajuta astăzi?",
        uk: "Я ваш ШІ-нутриціолог. Чим я можу допомогти вам сьогодні?",
      };

      const defaultWelcome = welcomeDict[language] || welcomeDict.fr;

      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'assistant',
        text: data.reply || defaultWelcome,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorDict: Record<string, string> = {
        fr: "Désolé, je rencontre des difficultés pour me connecter. Vérifiez votre connexion ou réessayez dans un instant.",
        en: "Sorry, I am having trouble connecting. Please check your connection or try again in a moment.",
        es: "Disculpa, tengo dificultades para conectarme. Por favor verifica tu conexión o inténtalo en un momento.",
        de: "Entschuldigung, Verbindungsprobleme. Bitte überprüfe deine Internetverbindung und versuche es erneut.",
        it: "Spiacente, riscontro difficoltà di connessione. Controlla la connessione e riprova tra poco.",
        pt: "Desculpe, estou com problemas de conexão. Verifique sua internet ou tente novamente em instantes.",
        no: "Beklager, jeg har problemer med å koble til. Vennligst sjekk tilkoblingen din og prøv igjen.",
        nl: "Sorry, ik heb verbindingsproblemen. Controleer uw verbinding en probeer het opnieuw.",
        pl: "Przepraszam, mam problem z połączeniem. Sprawdź swoje połączenie i spróbuj ponownie.",
        sv: "Beklagar, anslutningsproblem. Kontrollera din internetanslutning och försök igen.",
        da: "Beklager, forbindelsesproblem. Tjek din internetforbindelse og prøv igen.",
        fi: "Pahoittelut, yhteysongelma. Tarkista internetyhteytesi ja yritä hetken kuluttua uudelleen.",
        ru: "Извините, возникли трудности с подключением. Проверьте сеть и повторите попытку.",
        ja: "接続に問題が発生しました。インターネット接続を確認の上、再度お試しください。",
        zh: "抱歉，网络连接遇到困难。请检查您的网络连接或稍后再试。",
        ar: "عذراً، أواجه صعوبة في الاتصال. يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
        tr: "Üzgünüm, bağlantı sorunu oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.",
        el: "Λυπούμαστε, υπάρχει πρόβλημα σύνδεσης. Ελέγξτε τη σύνδεσή σας και δοκιμάστε ξανά.",
        cs: "Omlouváme se, došlo k potížím s připojením. Zkontrolujte připojení a zkuste to znovu.",
        ro: "Ne pare rău, întâmpinăm probleme de conexiune. Vă rugăm să reîncercați în câteva momente.",
        uk: "Вибачте, виникли труднощі зі з'єднанням. Перевірте мережу та повторіть спробу.",
      };
      const errorMsgText = errorDict[language] || errorDict.fr;

      const errorMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'assistant',
        text: errorMsgText,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleAnalyzeMealPhoto = async (imageBase64: string, description?: string) => {
    const res = await fetch('/api/ai/analyze-meal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, description, language }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error || core.photoAnalyzeError);
    }
    return data;
  };

  const handleGenerateMenu = async (targetCalories: number, preference: string) => {
    const res = await fetch('/api/ai/generate-menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetCalories, preference, user, language }),
    });
    if (!res.ok) {
      throw new Error(core.menuGenError);
    }
    return res.json();
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev: any[]) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleRegisterUser = (newUserUpdates: Partial<UserProfile>) => {
    const existingStart = localStorage.getItem('nutricoach_trial_started_at') || newUserUpdates.trialStartDate || new Date().toISOString();
    localStorage.setItem('nutricoach_trial_started_at', existingStart);
    const startMs = new Date(existingStart).getTime();
    const computedRemaining = !isNaN(startMs)
      ? Math.max(0, 30 - Math.floor((Date.now() - startMs) / (1000 * 60 * 60 * 24)))
      : 30;

    const updatedUser: UserProfile = {
      ...user,
      ...newUserUpdates,
      isLoggedIn: true,
      trialStartDate: existingStart,
      trialDaysRemaining: computedRemaining,
    };
    setUser(updatedUser);

    // Initialize starting weight in history
    if (updatedUser.currentWeightKg && updatedUser.currentWeightKg > 0) {
      const today = new Date().toISOString().split('T')[0];
      setWeightHistory([
        {
          id: `w_${Date.now()}`,
          date: today,
          weightKg: updatedUser.currentWeightKg,
        },
      ]);
    }

    // Personalized Coach AI greeting
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        sender: 'assistant',
        text: core.registerWelcome(updatedUser.name || ''),
        timestamp: new Date().toISOString(),
      },
    ]);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  const handleLoadDemo = () => {
    const existingStart = localStorage.getItem('nutricoach_trial_started_at') || demoUser.trialStartDate || new Date().toISOString();
    localStorage.setItem('nutricoach_trial_started_at', existingStart);
    const startMs = new Date(existingStart).getTime();
    const computedRemaining = !isNaN(startMs)
      ? Math.max(0, 30 - Math.floor((Date.now() - startMs) / (1000 * 60 * 60 * 24)))
      : 30;

    setUser({
      ...demoUser,
      trialStartDate: existingStart,
      trialDaysRemaining: computedRemaining,
    });
    setMeals(initialMeals);
    setWeightHistory(initialWeightHistory);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleLogout = () => {
    const preservedStart =
      user.trialStartDate || localStorage.getItem('nutricoach_trial_started_at') || new Date().toISOString();
    localStorage.setItem('nutricoach_trial_started_at', preservedStart);
    const startMs = new Date(preservedStart).getTime();
    const computedRemaining = !isNaN(startMs)
      ? Math.max(0, 30 - Math.floor((Date.now() - startMs) / (1000 * 60 * 60 * 24)))
      : user.trialDaysRemaining;

    localStorage.removeItem('nutricoach_user');
    setUser({
      ...initialUser,
      isLoggedIn: false,
      name: '',
      email: '',
      isPremium: false,
      trialStartDate: preservedStart,
      trialDaysRemaining: computedRemaining,
    });
    setActiveTab('dashboard');
  };

  const seasonalBackground = (() => {
    switch (activeSeason) {
      case 'winter':
        return isDarkMode
          ? 'linear-gradient(rgba(10, 19, 32, 0.88), rgba(11, 22, 36, 0.92)), url("/assets/winter_light_wallpaper.jpg")'
          : 'linear-gradient(rgba(244, 249, 253, 0.54), rgba(247, 250, 254, 0.64)), url("/assets/winter_light_wallpaper.jpg")';
      case 'summer':
        return isDarkMode
          ? 'linear-gradient(rgba(14, 22, 18, 0.89), rgba(14, 22, 18, 0.93)), url("/assets/summer_light_wallpaper.jpg")'
          : 'linear-gradient(rgba(254, 252, 244, 0.50), rgba(253, 250, 240, 0.60)), url("/assets/summer_light_wallpaper.jpg")';
      case 'autumn':
        return isDarkMode
          ? 'linear-gradient(rgba(23, 18, 13, 0.89), rgba(24, 19, 14, 0.93)), url("/assets/autumn_light_wallpaper.jpg")'
          : 'linear-gradient(rgba(253, 249, 243, 0.52), rgba(252, 247, 239, 0.62)), url("/assets/autumn_light_wallpaper.jpg")';
      case 'spring':
      default:
        return isDarkMode
          ? 'linear-gradient(rgba(10, 22, 15, 0.90), rgba(10, 22, 15, 0.93)), url("/assets/floral_light_wallpaper.jpg")'
          : 'linear-gradient(rgba(253, 252, 250, 0.50), rgba(253, 252, 250, 0.60)), url("/assets/floral_light_wallpaper.jpg")';
    }
  })();

  return (
    <div
      id="nutricoach-app-root"
      className={`min-h-screen transition-colors duration-200 font-semibold relative ${
        isDarkMode ? 'text-slate-100' : 'text-[#163321]'
      }`}
      style={{
        backgroundImage: seasonalBackground,
        backgroundRepeat: 'repeat',
        backgroundSize: '380px auto',
        backgroundPosition: 'center top',
      }}
    >
      <WinterSnowfallOverlay />
      {/* Top Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        user={user}
        onOpenPremium={() => setIsPremiumModalOpen(true)}
        isDarkMode={isDarkMode}
        toggleDarkMode={handleToggleDarkMode}
        streakDays={streakDays}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      {/* Welcome Voice Greeting Prompt Banner (compact single-row bar) */}
      {!isTrialExpired && user.autoVoiceGreeting !== false && showVoiceGreetingNotice && !isVoiceSpeakingGreeting && (
        <div
          id="top-coach-voice-welcome-card"
          className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-3 py-1.5 shadow-sm"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Volume2 className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="font-bold truncate text-xs leading-tight">
                🎙️ {getDashboardUi(language).coachTitle} :{' '}
                <span className="font-normal opacity-95">{getDashboardUi(language).topBannerTap}</span>
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                id="btn-play-welcome-voice-top"
                onClick={handleTriggerWelcomeVoice}
                className="px-2.5 py-1 rounded-lg bg-white text-emerald-800 hover:bg-emerald-50 font-extrabold text-[11px] transition-all shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Volume2 className="w-3 h-3 text-emerald-600" />
                <span>{getDashboardUi(language).coachGreetsYou.replace('🎙️ ', '')}</span>
              </button>
              <button
                type="button"
                id="btn-close-welcome-voice-banner"
                onClick={() => setShowVoiceGreetingNotice(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white cursor-pointer"
                aria-label={getDashboardUi(language).topBannerAria}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stripe Payment Notice Banner */}
      {paymentNotice && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-sm ${
              paymentNotice.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
            }`}
          >
            <div className="flex items-center gap-3">
              {paymentNotice.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              )}
              <p className="text-sm font-semibold">{paymentNotice.message}</p>
            </div>
            <button
              onClick={() => setPaymentNotice(null)}
              className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              aria-label={core.closeNoticeAria}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 main-app-padding">
        {isTrialExpired ? (
          <TrialExpiredPaywall
            isDarkMode={isDarkMode}
            userEmail={user.email}
            userName={user.name}
            onLogout={handleLogout}
            onPaymentSuccess={(customerEmail) => {
              setUser((prev) => ({
                ...prev,
                isPremium: true,
                email: customerEmail || prev.email,
              }));
              confetti({
                particleCount: 120,
                spread: 90,
                origin: { y: 0.4 },
              });
              setPaymentNotice({
                type: 'success',
                message: core.stripeSuccess,
              });
            }}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              !user.isLoggedIn ? (
                <RegistrationView
                  onRegister={handleRegisterUser}
                  onLoadDemo={handleLoadDemo}
                  onOpenLogin={() => setIsAuthModalOpen(true)}
                  isDarkMode={isDarkMode}
                />
              ) : (
                <DashboardView
                  user={user}
                  metrics={metrics}
                  meals={meals}
                  water={water}
                  activities={activities}
                  onNavigate={handleSelectTab}
                  onOpenAddMeal={() => handleSelectTab('journal')}
                  onOpenAiScan={() => {
                    setCoachSubTab('photo');
                    setCoachSubTabTrigger((c) => c + 1);
                    handleSelectTab('aicoach');
                  }}
                  onOpenBarcodeScanner={() => setIsBarcodeModalOpen(true)}
                  onAddWater={handleAddWater}
                  onAddActivity={handleAddActivity}
                  onOpenWeighIn={() => handleSelectTab('progress')}
                  isDarkMode={isDarkMode}
                />
              )
            )}

            {activeTab === 'journal' && (
              <JournalView
                user={user}
                meals={meals}
                onAddMeal={handleAddMeal}
                onDeleteMeal={handleDeleteMeal}
                onResetTodayMeals={handleResetTodayMeals}
                onOpenBarcodeScanner={() => setIsBarcodeModalOpen(true)}
                onOpenAiScan={() => {
                  setCoachSubTab('photo');
                  setCoachSubTabTrigger((c) => c + 1);
                  setActiveTab('aicoach');
                }}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === 'aicoach' && (
              <AiCoachView
                user={user}
                metrics={metrics}
                messages={messages}
                initialSubTab={coachSubTab}
                subTabTrigger={coachSubTabTrigger}
                onSendMessage={handleSendMessage}
                onAnalyzeMealPhoto={handleAnalyzeMealPhoto}
                onGenerateMenu={handleGenerateMenu}
                onAddMealFromAi={handleAddMealFromAi}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressView
                user={user}
                weightHistory={weightHistory}
                onAddWeightEntry={handleAddWeightEntry}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === 'hydration' && (
              <HydrationView
                user={user}
                water={water}
                activities={activities}
                onAddWater={handleAddWater}
                onAddActivity={handleAddActivity}
                onDeleteActivity={handleDeleteActivity}
                onUpdateUser={handleUpdateUser}
                onResetTodaySteps={handleResetTodaySteps}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === 'recipes' && (
              <RecipesView
                recipes={recipes}
                user={user}
                onAddMealFromRecipe={handleAddMealFromRecipe}
                onAddNewWeeklyRecipes={handleAddNewWeeklyRecipes}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === 'badges' && (
              <BadgesView
                badges={badges}
                reminders={reminders}
                onToggleReminder={handleToggleReminder}
                streakDays={streakDays}
                userName={user.name}
                isDarkMode={isDarkMode}
              />
            )}
            {activeTab === 'profile' && (
              <ProfileView
                user={user}
                metrics={metrics}
                onUpdateUser={handleUpdateUser}
                onAddActivity={handleAddActivity}
                onCancelSubscription={handleCancelSubscription}
                onOpenPremium={() => setIsPremiumModalOpen(true)}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onLogout={handleLogout}
                isDarkMode={isDarkMode}
                onOpenShare={() => setIsShareModalOpen(true)}
                onOpenBadges={() => handleSelectTab('badges')}
              />
            )}
          </>
        )}
      </main>

      {/* Website Footer: hidden on mobile & standalone/TWA app mode for true native feel */}
      {!isStandaloneApp && (
        <div className="hidden lg:block">
          <Footer
            isDarkMode={isDarkMode}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        </div>
      )}

      {/* Global Modals */}
      <BarcodeScannerModal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        onSelectFood={handleScannedFood}
        isDarkMode={isDarkMode}
      />

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onUpgrade={() => {
          setUser((prev) => ({ ...prev, isPremium: true }));
        }}
        onCancelSubscription={handleCancelSubscription}
        isDarkMode={isDarkMode}
        trialDaysLeft={user.trialDaysRemaining}
        userEmail={user.email}
        userName={user.name}
        isPremium={user.isPremium}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(updates) => {
          const existingStart =
            localStorage.getItem('nutricoach_trial_started_at') ||
            updates.trialStartDate ||
            user.trialStartDate ||
            new Date().toISOString();
          localStorage.setItem('nutricoach_trial_started_at', existingStart);
          const startMs = new Date(existingStart).getTime();
          const computedRemaining = !isNaN(startMs)
            ? Math.max(0, 30 - Math.floor((Date.now() - startMs) / (1000 * 60 * 60 * 24)))
            : 30;
          setUser((prev) => ({
            ...prev,
            ...updates,
            trialStartDate: existingStart,
            trialDaysRemaining: computedRemaining,
          }));
        }}
        isDarkMode={isDarkMode}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      <PWAInstallBanner />
      <OfflineIndicator />

      {/* Quick Action Toast Feedback */}
      {actionToast && (
        <div
          id="ux-action-toast"
          role="status"
          aria-live="polite"
          className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#163321] dark:bg-emerald-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-400/30 text-xs font-extrabold whitespace-nowrap max-w-[92vw] truncate animate-in fade-in slide-in-from-bottom-3"
        >
          {actionToast}
        </div>
      )}

      {/* Floating Voice Greeting Bar */}
      {isVoiceSpeakingGreeting && (
        <div
          id="banner-voice-greeting-active"
          className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 border border-emerald-400/40 max-w-[92vw]"
        >
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center animate-pulse shrink-0">
            <Volume2 className="w-5 h-5 text-white" />
          </div>
          <div className="text-xs">
            <strong className="block font-black text-sm">{core.voiceGreetingActiveTitle}</strong>
            <span className="opacity-95 text-[11px]">{core.voiceGreetingActiveSub}</span>
          </div>
          <button
            type="button"
            id="btn-dismiss-voice-greeting"
            onClick={() => {
              stopSpeaking();
              setIsVoiceSpeakingGreeting(false);
            }}
            className="ml-3 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-bold cursor-pointer transition-colors shrink-0"
          >
            {core.cutVoice}
          </button>
        </div>
      )}
    </div>
  );
}
