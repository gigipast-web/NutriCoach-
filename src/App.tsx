import React, { useState, useEffect } from 'react';
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
import { Footer } from './components/Footer.tsx';
import { useLanguage } from './i18n/LanguageContext.tsx';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertCircle, X, Volume2, VolumeX, Mic } from 'lucide-react';
import { playWelcomeVoiceGreeting, stopSpeaking } from './utils/voiceCoach.ts';

export default function App() {
  const { language } = useLanguage();

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('nutricoach_theme');
    return saved ? saved === 'dark' : false;
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Payment notification banner
  const [paymentNotice, setPaymentNotice] = useState<{
    type: 'success' | 'cancelled';
    message: string;
  } | null>(null);

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nutricoach_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.isLoggedIn && parsed.name && parsed.name !== 'Invité') {
          if (!parsed.trialStartDate) {
            parsed.trialStartDate = new Date().toISOString();
          }
          const startMs = new Date(parsed.trialStartDate).getTime();
          if (!isNaN(startMs)) {
            const daysPassed = Math.floor((Date.now() - startMs) / (1000 * 60 * 60 * 24));
            parsed.trialDaysRemaining = Math.max(0, 30 - daysPassed);
          }
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return initialUser;
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
          setActiveTab('aicoach');
        } else if (decoded.includes('barcode') || decoded.includes('codebarre')) {
          setIsBarcodeModalOpen(true);
        }
      }

      // 3. Quick action parameters (?action=scan, ?action=barcode, ?action=water, etc.)
      if (action === 'scan' || action === 'camera') {
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
            if (data.isPremium || data.verified) {
              setUser((prev) => ({
                ...prev,
                isPremium: true,
                trialDaysRemaining: 30,
                email: data.customerEmail || prev.email,
              }));

              confetti({
                particleCount: 120,
                spread: 90,
                origin: { y: 0.4 },
              });

              setPaymentNotice({
                type: 'success',
                message:
                  'Paiement Stripe validé avec succès ! Votre accès NutriCoach Premium est désormais activé.',
              });
            }
          })
          .catch((err) => {
            console.error('Erreur vérification session Stripe:', err);
            // Graceful unlock
            setUser((prev) => ({ ...prev, isPremium: true }));
          })
          .finally(() => {
            // Clean URL query parameters
            window.history.replaceState({}, document.title, window.location.pathname);
          });
      } else if (paymentStatus === 'cancelled') {
        setPaymentNotice({
          type: 'cancelled',
          message: 'Paiement Stripe annulé. Aucun débit n’a été effectué.',
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

  // Automatic Coach Voice Greeting on First User Touch or Click (browser autoplay compliant)
  useEffect(() => {
    if (user.autoVoiceGreeting === false) {
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

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });

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
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
  };

  const handleResetTodayMeals = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setMeals((prev) => prev.filter((m) => !m.timestamp?.startsWith(todayStr)));
  };

  const handleAddWeightEntry = (entry: Omit<WeightEntry, 'id'>) => {
    const newEntry: WeightEntry = {
      ...entry,
      id: `w_${Date.now()}`,
    };
    setWeightHistory((prev) => [...prev, newEntry]);
    setUser((prev) => ({ ...prev, currentWeightKg: entry.weightKg }));
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
  };

  const handleAddActivity = (newAct: Omit<ActivityEntry, 'id'>) => {
    const actWithId: ActivityEntry = {
      ...newAct,
      id: `act_${Date.now()}`,
    };

    const isWatchSync =
      newAct.title.includes('Montre') ||
      newAct.title.includes('Apple') ||
      newAct.title.includes('Garmin') ||
      newAct.title.includes('Samsung') ||
      newAct.title.includes('Fitbit') ||
      newAct.title.includes('Withings') ||
      newAct.title.includes('Bluetooth');

    if (isWatchSync) {
      const todayStr = new Date().toISOString().split('T')[0];
      // Replace prior watch sync for today so the watch measurement is accurate and not duplicated
      setActivities((prev) => {
        const withoutPriorWatchToday = prev.filter(
          (a) =>
            !(
              a.timestamp?.startsWith(todayStr) &&
              (a.title.includes('Montre') ||
                a.title.includes('Apple') ||
                a.title.includes('Garmin') ||
                a.title.includes('Samsung') ||
                a.title.includes('Fitbit') ||
                a.title.includes('Withings') ||
                a.title.includes('Bluetooth'))
            )
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

  const handleScannedFood = (food: FoodItem) => {
    handleAddMeal({
      mealType: 'collation',
      foodName: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      portionGrams: 100,
      timestamp: new Date().toISOString(),
    });
  };

  const handleAddMealFromAi = (meal: Pick<MealEntry, 'foodName' | 'calories' | 'protein' | 'carbs' | 'fat'>) => {
    handleAddMeal({
      mealType: 'dejeuner',
      foodName: meal.foodName,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      portionGrams: 200,
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
    if (!res.ok) {
      throw new Error("Erreur lors de l'analyse");
    }
    return res.json();
  };

  const handleGenerateMenu = async (targetCalories: number, preference: string) => {
    const res = await fetch('/api/ai/generate-menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetCalories, preference, user, language }),
    });
    if (!res.ok) {
      throw new Error('Erreur lors de la génération');
    }
    return res.json();
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev: any[]) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleRegisterUser = (newUserUpdates: Partial<UserProfile>) => {
    const updatedUser: UserProfile = {
      ...user,
      ...newUserUpdates,
      isLoggedIn: true,
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
        text: `Bonjour ${updatedUser.name} ! 🎉 Félicitations pour votre inscription. Votre profil a été configuré avec succès : métabolisme de base (BMR) et calories cibles calculés. Je suis votre Coach IA, prêt à vous accompagner au quotidien pour atteindre vos objectifs de santé et de silhouette !`,
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
    setUser(demoUser);
    setMeals(initialMeals);
    setWeightHistory(initialWeightHistory);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleLogout = () => {
    setUser(initialUser);
    localStorage.removeItem('nutricoach_user');
    setActiveTab('dashboard');
  };

  return (
    <div
      id="nutricoach-app-root"
      className={`min-h-screen transition-colors duration-200 font-semibold ${
        isDarkMode ? 'bg-[#0A160F] text-slate-100' : 'bg-[#EDF3ED] text-[#163321]'
      }`}
    >
      {/* Top Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenPremium={() => setIsPremiumModalOpen(true)}
        isDarkMode={isDarkMode}
        toggleDarkMode={handleToggleDarkMode}
        streakDays={streakDays}
        onTriggerVoiceCoach={handleTriggerWelcomeVoice}
        isVoiceSpeaking={isVoiceSpeakingGreeting}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      {/* Welcome Voice Greeting Prompt Banner */}
      {user.autoVoiceGreeting !== false && showVoiceGreetingNotice && !isVoiceSpeakingGreeting && (
        <div
          id="top-coach-voice-welcome-card"
          className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-bounce">
              <Volume2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold block text-sm">
                🎙️ Votre Coach NutriCoach vous salue !
              </span>
              <span className="opacity-95 text-[11px]">
                « Bonjour {user.name || ''} ! Que vas-tu manger aujourd'hui ? »
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="btn-play-welcome-voice-top"
              onClick={handleTriggerWelcomeVoice}
              className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>🔊 Écouter le Coach</span>
            </button>
            <button
              type="button"
              id="btn-close-welcome-voice-banner"
              onClick={() => setShowVoiceGreetingNotice(false)}
              className="p-1 rounded-lg text-white/70 hover:text-white cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
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
              aria-label="Fermer la notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-24 lg:pb-12">
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
              onNavigate={setActiveTab}
              onOpenAddMeal={() => setActiveTab('journal')}
              onAddWater={handleAddWater}
              onAddActivity={handleAddActivity}
              onOpenWeighIn={() => setActiveTab('progress')}
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
            onOpenAiScan={() => setActiveTab('aicoach')}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'aicoach' && (
          <AiCoachView
            user={user}
            metrics={metrics}
            messages={messages}
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
          />
        )}
      </main>

      {/* App Footer: Une création de L'ESCAPADE DE JOS */}
      <Footer
        isDarkMode={isDarkMode}
        onOpenPremium={() => setIsPremiumModalOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

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
          setUser((prev) => ({ ...prev, isPremium: true, trialDaysRemaining: 30 }));
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
          setUser((prev) => ({ ...prev, ...updates }));
        }}
        isDarkMode={isDarkMode}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      <OfflineIndicator />

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
            <strong className="block font-black text-sm">Le Coach vous accueille de vive voix...</strong>
            <span className="opacity-95 text-[11px]">« Que vas-tu manger aujourd'hui ? »</span>
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
            Couper
          </button>
        </div>
      )}
    </div>
  );
}
