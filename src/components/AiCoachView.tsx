import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Camera,
  BookOpen,
  Loader2,
  CheckCircle,
  Plus,
  Bot,
  User as UserIcon,
  Image as ImageIcon,
  Globe,
  Bold,
  ChevronDown,
  Check,
  Search,
  X,
  Volume2,
  VolumeX,
  Mic,
  MoreHorizontal,
  AlertCircle,
  Upload,
} from 'lucide-react';
import { UserProfile, UserMetrics, ChatMessage, MealEntry, MealType } from '../types.ts';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { LANGUAGES, POPULAR_LANGUAGE_CODES, Language } from '../i18n/translations.ts';
import { playMealVoiceReminder, speakText, stopSpeaking } from '../utils/voiceCoach.ts';
import { compressImageFileToDataUrl, captureVideoFrameToDataUrl } from '../utils/imageCompressor.ts';
import { RobotCoachMascot } from './RobotCoachMascot.tsx';
import {
  BlossomFlower,
  CornerFloralFlourish,
  FlowerGardenCluster,
} from './FloralDecorations.tsx';

interface AiCoachViewProps {
  user: UserProfile;
  metrics: UserMetrics;
  messages: ChatMessage[];
  initialSubTab?: 'chat' | 'photo' | 'generator';
  subTabTrigger?: number;
  onSendMessage: (text: string) => Promise<void>;
  onAnalyzeMealPhoto: (imageBase64: string, description?: string) => Promise<any>;
  onGenerateMenu: (targetCalories: number, preference: string) => Promise<any>;
  onAddMealFromAi: (
    meal: Pick<MealEntry, 'foodName' | 'calories' | 'protein' | 'carbs' | 'fat'> & {
      mealType?: MealType;
      portionGrams?: number;
    }
  ) => void;
  isDarkMode: boolean;
}

export const AiCoachView: React.FC<AiCoachViewProps> = ({
  user,
  metrics,
  messages,
  initialSubTab,
  subTabTrigger,
  onSendMessage,
  onAnalyzeMealPhoto,
  onGenerateMenu,
  onAddMealFromAi,
  isDarkMode,
}) => {
  const { language, setLanguage, triggerGoogleTranslate } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [subTab, setSubTab] = useState<'chat' | 'photo' | 'generator'>(initialSubTab || 'chat');

  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab, subTabTrigger]);

  // Coach Polyglot dropdown menu state
  const [isCoachLangOpen, setIsCoachLangOpen] = useState(false);
  const [coachLangSearch, setCoachLangSearch] = useState('');
  const coachLangDropdownRef = useRef<HTMLDivElement>(null);
  const coachLangSearchInputRef = useRef<HTMLInputElement>(null);

  // Close Coach dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        coachLangDropdownRef.current &&
        !coachLangDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCoachLangOpen(false);
      }
    };
    if (isCoachLangOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => coachLangSearchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCoachLangOpen]);

  // Close Coach dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCoachLangOpen) {
        setIsCoachLangOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCoachLangOpen]);

  // Bold text mode state (persisted in localStorage, defaults to true)
  const [isBoldMode, setIsBoldMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('nutricoach_chat_bold');
    return saved === null ? true : saved === 'true';
  });

  const toggleBoldMode = () => {
    setIsBoldMode((prev) => {
      const next = !prev;
      localStorage.setItem('nutricoach_chat_bold', String(next));
      return next;
    });
  };

  // Voice speech state
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (speakingMessageId === msgId) {
      stopSpeaking();
      setSpeakingMessageId(null);
      return;
    }

    setSpeakingMessageId(msgId);
    speakText(text, {
      language: language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : language === 'de' ? 'de-DE' : language === 'it' ? 'it-IT' : 'fr-FR',
      onEnd: () => setSpeakingMessageId(null),
      onError: () => setSpeakingMessageId(null),
    });
  };

  const handleTriggerMealVoiceReminder = () => {
    if (speakingMessageId === 'coach-meal-question') {
      stopSpeaking();
      setSpeakingMessageId(null);
      return;
    }

    setSpeakingMessageId('coach-meal-question');
    playMealVoiceReminder(user.name, language, {
      onEnd: () => setSpeakingMessageId(null),
      onError: () => setSpeakingMessageId(null),
    });
  };

  // Photo scan state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [photoDescription, setPhotoDescription] = useState('');
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [photoAnalysisResult, setPhotoAnalysisResult] = useState<any | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoAddedSuccess, setPhotoAddedSuccess] = useState(false);
  const [photoMealType, setPhotoMealType] = useState<MealType>(() => {
    const h = new Date().getHours();
    if (h < 11) return 'petit_dejeuner';
    if (h < 15) return 'dejeuner';
    if (h < 18) return 'collation';
    return 'diner';
  });
  const [isPhotoCameraOpen, setIsPhotoCameraOpen] = useState(false);
  const [photoCameraError, setPhotoCameraError] = useState<string | null>(null);

  // Menu generator state
  const [generatorCalories, setGeneratorCalories] = useState(metrics.targetCalories || 1500);
  const [generatorPreference, setGeneratorPreference] = useState('standard');
  const [isGeneratingMenu, setIsGeneratingMenu] = useState(false);
  const [generatedMenu, setGeneratedMenu] = useState<any | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraFileInputRef = useRef<HTMLInputElement>(null);
  const photoVideoRef = useRef<HTMLVideoElement | null>(null);
  const photoStreamRef = useRef<MediaStream | null>(null);

  const stopPhotoCamera = () => {
    if (photoStreamRef.current) {
      photoStreamRef.current.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {}
      });
      photoStreamRef.current = null;
    }
    if (photoVideoRef.current) {
      photoVideoRef.current.srcObject = null;
    }
    setIsPhotoCameraOpen(false);
  };

  useEffect(() => {
    if (subTab !== 'photo') {
      stopPhotoCamera();
    }
    return () => {
      if (photoStreamRef.current) {
        photoStreamRef.current.getTracks().forEach((t) => {
          try {
            t.stop();
          } catch {}
        });
      }
    };
  }, [subTab]);

  const handleOpenLiveCamera = async () => {
    setPhotoCameraError(null);
    setPhotoError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      cameraFileInputRef.current?.click();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      photoStreamRef.current = stream;
      setIsPhotoCameraOpen(true);
      setTimeout(() => {
        if (photoVideoRef.current) {
          photoVideoRef.current.srcObject = stream;
          photoVideoRef.current.play().catch(() => {});
        }
      }, 60);
    } catch {
      setPhotoCameraError("Caméra en direct bloquée. Ouverture du sélecteur photo...");
      cameraFileInputRef.current?.click();
    }
  };

  const handleCapturePhotoFromCamera = () => {
    if (!photoVideoRef.current) return;
    const dataUrl = captureVideoFrameToDataUrl(photoVideoRef.current, 1024, 0.85);
    if (dataUrl) {
      setSelectedImage(dataUrl);
      setPhotoAnalysisResult(null);
      setPhotoAddedSuccess(false);
      setPhotoError(null);
      stopPhotoCamera();
    } else {
      setPhotoCameraError("Impossible de capturer l'image. Réessayez.");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;
    const text = inputText;
    setInputText('');
    setIsSending(true);
    await onSendMessage(text);
    setIsSending(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setPhotoError(null);
    setPhotoAddedSuccess(false);
    setPhotoAnalysisResult(null);
    stopPhotoCamera();

    try {
      const compressed = await compressImageFileToDataUrl(file, 1024, 0.85);
      setSelectedImage(compressed);
    } catch (err: any) {
      setPhotoError(err?.message || "Impossible de charger cette image.");
    }
  };

  const handleAnalyzePhoto = async () => {
    if (!selectedImage && !photoDescription.trim()) return;
    setIsAnalyzingPhoto(true);
    setPhotoError(null);
    setPhotoAddedSuccess(false);
    try {
      const res = await onAnalyzeMealPhoto(selectedImage || '', photoDescription);
      setPhotoAnalysisResult({
        foodName: res.foodName || 'Repas analysé',
        estimatedCalories: Number(res.calories) ?? 0,
        protein: Number(res.protein) ?? 0,
        carbs: Number(res.carbs) ?? 0,
        fat: Number(res.fat) ?? 0,
        portionGrams: Number(res.portionGrams) || 250,
        portionDescription: res.portionGrams ? `${res.portionGrams}g` : 'Portion standard',
        detectedItems: Array.isArray(res.detectedItems) ? res.detectedItems : [],
        feedback: res.analysis || res.advice || 'Repas analysé avec succès.',
        advice: res.advice || '',
      });
    } catch (err: any) {
      console.error(err);
      setPhotoError(
        err?.message || "Impossible d'analyser cette photo pour le moment. Vérifiez votre image ou réessayez."
      );
    } finally {
      setIsAnalyzingPhoto(false);
    }
  };

  const handleGenerateMenu = async () => {
    setIsGeneratingMenu(true);
    try {
      const res = await onGenerateMenu(generatorCalories, generatorPreference);
      if (res && res.dayPlan) {
        setGeneratedMenu({
          totalCalories: generatorCalories,
          coachTip: res.tips || 'Privilégiez une bonne mastication et une hydratation continue.',
          meals: [
            {
              mealType: 'Petit-déjeuner',
              title: res.dayPlan.breakfast?.foodName || "Porridge d'avoine aux fruits",
              description: 'Riche en fibres pour un réveil énergisant sans pic glycémique',
              calories: res.dayPlan.breakfast?.calories || 340,
            },
            {
              mealType: 'Déjeuner',
              title: res.dayPlan.lunch?.foodName || 'Poulet grillé, quinoa & brocolis',
              description: 'Équilibre parfait protéines et glucides lents pour éviter le coup de fatigue',
              calories: res.dayPlan.lunch?.calories || 520,
            },
            {
              mealType: 'Collation',
              title: res.dayPlan.snack?.foodName || 'Pomme & amandes brutes',
              description: 'Collation saine régulant la satiété jusqu’au dîner',
              calories: res.dayPlan.snack?.calories || 160,
            },
            {
              mealType: 'Dîner',
              title: res.dayPlan.dinner?.foodName || 'Poisson blanc & légumes vapeur',
              description: 'Repas léger favorisant un sommeil réparateur et la combustion nocturne',
              calories: res.dayPlan.dinner?.calories || 380,
            },
          ],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingMenu(false);
    }
  };

  const suggestionsByLang: Record<string, string[]> = {
    fr: [
      'Propose-moi un menu sans gluten 🌾',
      'Que puis-je manger ce soir ? 🍽️',
      'Crée-moi un menu équilibré à 1500 kcal 🥗',
      'Comment perdre 5 kg durablement ? 🎯',
      'Idée de collation saine à moins de 150 kcal 🍎',
    ],
    en: [
      'What should I eat for dinner tonight? 🍽️',
      'Create a balanced 1,500 kcal daily plan 🥗',
      'How to lose 5 kg sustainably? 🎯',
      'Healthy snack idea under 150 kcal 🍎',
    ],
    es: [
      '¿Qué puedo cenar esta noche? 🍽️',
      'Crea un menú equilibrado de 1500 kcal 🥗',
      '¿Cómo perder 5 kg de forma saludable? 🎯',
      'Idea de merienda saludable de menos de 150 kcal 🍎',
    ],
    de: [
      'Was kann ich heute Abend essen? 🍽️',
      'Erstelle mir einen 1500 kcal Tagesplan 🥗',
      'Wie nehme ich 5 kg gesund und nachhaltig ab? 🎯',
      'Gesunder Snack unter 150 kcal 🍎',
    ],
    it: [
      'Cosa posso mangiare stasera? 🍽️',
      'Creami un menu equilibrato da 1500 kcal 🥗',
      'Come perdere 5 kg in modo sostenibile? 🎯',
      'Idea per uno snack sano sotto i 150 kcal 🍎',
    ],
    pt: [
      'O que posso jantar hoje? 🍽️',
      'Crie um plano diário equilibrado de 1500 kcal 🥗',
      'Como perder 5 kg de forma saudável? 🎯',
      'Ideia de lanche saudável com menos de 150 kcal 🍎',
    ],
    nl: [
      'Wat kan ik vanavond eten? 🍽️',
      'Maak een uitgebalanceerd menu van 1500 kcal 🥗',
      'Hoe kan ik duurzaam 5 kg afvallen? 🎯',
      'Gezonde snack onder de 150 kcal 🍎',
    ],
    pl: [
      'Co mogę zjeść na kolację? 🍽️',
      'Stwórz zbilansowane menu 1500 kcal 🥗',
      'Jak trwale schudnąć 5 kg? 🎯',
      'Pomysł na zdrową przekąskę poniżej 150 kcal 🍎',
    ],
    no: [
      'Hva kan jeg spise til middag i kveld? 🍽️',
      'Lag en balansert dagsmeny på 1500 kcal 🥗',
      'Hvordan gå ned 5 kg på en sunn måte? 🎯',
      'Sunn mellommåltid under 150 kcal 🍎',
    ],
    sv: [
      'Vad kan jag äta till middag ikväll? 🍽️',
      'Skapa en balanserad meny på 1500 kcal 🥗',
      'Hur går jag ner 5 kg hållbart? 🎯',
      'Nyttigt mellanmål under 150 kcal 🍎',
    ],
    da: [
      'Hvad kan jeg spise til aften i dag? 🍽️',
      'Lav en afbalanceret menu på 1500 kcal 🥗',
      'Hvordan taber jeg 5 kg holdbart? 🎯',
      'Sund snack under 150 kcal 🍎',
    ],
    fi: [
      'Mitä voisin syödä illalliseksi? 🍽️',
      'Luo minulle tasapainoinen 1500 kcal ateriasuunnitelma 🥗',
      'Miten pudottaa 5 kg kestävästi? 🎯',
      'Terveellinen välipala alle 150 kcal 🍎',
    ],
    ru: [
      'Что приготовить на ужин? 🍽️',
      'Составь сбалансированное меню на 1500 ккал 🥗',
      'Как сбросить 5 кг без вреда для здоровья? 🎯',
      'Идея полезного перекуса до 150 ккал 🍎',
    ],
    ja: [
      '今夜は何を食べればいいですか？ 🍽️',
      '1500 kcalのバランスの良い献立を作って 🥗',
      '健康的に5kg痩せるには？ 🎯',
      '150 kcal未満のヘルシーな間食のアイデア 🍎',
    ],
    zh: [
      '今晚我该吃什么？ 🍽️',
      '为我定制一份1500大卡的均衡食谱 🥗',
      '如何健康持久地减重5公斤？ 🎯',
      '150大卡以内的健康加餐推荐 🍎',
    ],
    ar: [
      'ماذا يمكنني أن آكل على العشاء الليلة؟ 🍽️',
      'أنشئ لي خطة وجبات متوازنة بـ 1500 سعرة حرارية 🥗',
      'كيف أخسر 5 كجم بطريقة صحية ومستدامة؟ 🎯',
      'فكرة وجبة خفيفة صحية أقل من 150 سعرة حرارية 🍎',
    ],
    tr: [
      'Bu akşam ne yiyebilirim? 🍽️',
      'Bana 1500 kalorilik dengeli bir menü hazırla 🥗',
      'Sağlıklı şekilde 5 kg nasıl verebilirim? 🎯',
      '150 kalori altı sağlıklı atıştırmalık fikri 🍎',
    ],
    el: [
      'Τι μπορώ να φάω για βραδινό; 🍽️',
      'Φτιάξε μου ένα ισορροπημένο μενού 1500 kcal 🥗',
      'Πώς να χάσω 5 κιλά με υγιεινό τρόπο; 🎯',
      'Ιδέα για υγιεινό σνακ κάτω από 150 kcal 🍎',
    ],
    cs: [
      'Co si mohu dát dnes k večeři? 🍽️',
      'Vytvoř mi vyvážený jídelníček na 1500 kcal 🥗',
      'Jak zdravě a trvale zhubnout 5 kg? 🎯',
      'Tip na zdravou svačinu pod 150 kcal 🍎',
    ],
    ro: [
      'Ce pot mânca la cină în această seară? 🍽️',
      'Creează-mi un meniu echilibrat de 1500 kcal 🥗',
      'Cum să slăbesc 5 kg sănătos și sustenabil? 🎯',
      'Idee de gustare sănătoasă sub 150 kcal 🍎',
    ],
    uk: [
      'Що приготувати на вечерю? 🍽️',
      'Склади мені збалансоване меню на 1500 ккал 🥗',
      'Як здорово скинути 5 кг? 🎯',
      'Ідея корисного перекусу до 150 ккал 🍎',
    ],
  };

  const suggestions = suggestionsByLang[language] || suggestionsByLang.fr;

  const placeholdersByLang: Record<string, string> = {
    fr: 'Posez votre question nutritionnelle en français ou dans toute autre langue...',
    en: 'Ask your nutrition question in English or any language...',
    es: 'Haz tu pregunta de nutrición en español o en cualquier idioma...',
    de: 'Stelle deine Ernährungsfrage auf Deutsch oder in einer anderen Sprache...',
    it: 'Fai la tua domanda sulla nutrizione in italiano o in qualsiasi lingua...',
    pt: 'Faça sua pergunta nutricional em português ou em qualquer idioma...',
    nl: 'Stel je voedingsvraag in het Nederlands of in een andere taal...',
    pl: 'Zadaj pytanie dotyczące odżywiania po polsku lub w innym języku...',
    no: 'Still ditt ernæringsspørsmål på norsk eller hvilket som helst språk...',
    sv: 'Ställ din näringsfråga på svenska eller vilket språk som helst...',
    da: 'Stil dit ernæringsspørgsmål på dansk eller et andet sprog...',
    fi: 'Kysy ravitsemusneuvoa suomeksi tai millä tahansa kielellä...',
    ru: 'Задайте вопрос по питанию на русском или любом другом языке...',
    ja: '日本語またはお好みの言語で栄養について質問してください...',
    zh: '使用中文或任意语言向AI营养教练提问...',
    ar: 'اطرح سؤالك الغذائي بالعربية أو بأي لغة تفضلها...',
    tr: 'Beslenme sorunuzu Türkçe veya dilediğiniz dilde sorun...',
    el: 'Κάντε την ερώτησή σας στα ελληνικά ή σε οποιαδήποτε γλώσσα...',
    cs: 'Zeptejte se na výživu v češtině nebo v jakémkoli jiném jazyce...',
    ro: 'Adresează întrebarea ta nutrițională în română sau în orice altă limbă...',
    uk: 'Поставте своє запитання щодо харчування українською або будь-якою мовою...',
  };

  const currentPlaceholder =
    placeholdersByLang[language] || 'Posez votre question dans n’importe quelle langue...';

  const currentLanguageOption =
    LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const filteredCoachLanguages = LANGUAGES.filter(
    (l) =>
      l.label.toLowerCase().includes(coachLangSearch.toLowerCase()) ||
      l.native.toLowerCase().includes(coachLangSearch.toLowerCase()) ||
      l.code.toLowerCase().includes(coachLangSearch.toLowerCase())
  );

  const handleSelectCoachLang = (code: Language) => {
    setLanguage(code);
    setIsCoachLangOpen(false);
    setCoachLangSearch('');
  };

  /**
   * Renders message text with full support for Markdown bold (**text** / __text__),
   * headers (### ), bullet lists, numbered lists, and bold mode enforcement.
   */
  const renderFormattedMessageText = (rawText: string, isUserMsg: boolean, isForceBold: boolean) => {
    const lines = rawText.split('\n');

    return (
      <div
        className={`space-y-1.5 leading-relaxed ${
          isForceBold ? 'font-extrabold tracking-wide' : 'font-semibold tracking-normal'
        }`}
      >
        {lines.map((line, lineIdx) => {
          const trimmed = line.trim();

          if (!trimmed) {
            return <div key={lineIdx} className="h-1.5" />;
          }

          // Section headers (### Titre or ## Titre or # Titre)
          if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
            const headerTitle = trimmed.replace(/^#+\s*/, '');
            return (
              <div
                key={lineIdx}
                className={`font-black text-xs sm:text-sm pt-1.5 pb-0.5 uppercase tracking-wider ${
                  isUserMsg
                    ? 'text-white underline decoration-emerald-200 decoration-2'
                    : 'text-emerald-700 dark:text-emerald-300 font-black'
                }`}
              >
                {headerTitle}
              </div>
            );
          }

          // Bullet line (- , * , • ) or numbered line (1. , 2. )
          const listMatch = trimmed.match(/^([-*•]|\d+\.)\s+(.*)$/);
          const isListItem = !!listMatch;
          const listPrefix = listMatch ? listMatch[1] : '';
          const lineContent = listMatch ? listMatch[2] : line;

          // Split markdown bold (**text** or __text__)
          const parts = lineContent.split(/(\*\*[\s\S]*?\*\*|__[\s\S]*?__)/g);

          const renderedLineParts = parts.map((part, partIdx) => {
            if (
              (part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
              (part.startsWith('__') && part.endsWith('__') && part.length >= 4)
            ) {
              const inner = part.slice(2, -2);
              return (
                <strong
                  key={partIdx}
                  className={`font-black ${
                    isUserMsg
                      ? 'text-white underline decoration-emerald-200 decoration-2 font-black'
                      : isDarkMode
                      ? 'text-emerald-300 font-black bg-emerald-950/80 border border-emerald-700/60 px-1.5 py-0.5 rounded-md inline-block my-0.5'
                      : 'text-emerald-950 font-black bg-emerald-100/90 border border-emerald-300/80 px-1.5 py-0.5 rounded-md inline-block my-0.5 shadow-2xs'
                  }`}
                >
                  {inner}
                </strong>
              );
            }
            return part;
          });

          if (isListItem) {
            return (
              <div key={lineIdx} className="flex items-start gap-2 pl-1">
                <span
                  className={`text-xs font-black mt-0.5 shrink-0 ${
                    isUserMsg ? 'text-emerald-200' : 'text-emerald-500 dark:text-emerald-400'
                  }`}
                >
                  {listPrefix.endsWith('.') ? listPrefix : '●'}
                </span>
                <span className={`flex-1 ${isForceBold ? 'font-extrabold' : 'font-semibold'}`}>
                  {renderedLineParts}
                </span>
              </div>
            );
          }

          return (
            <div key={lineIdx} className={isForceBold ? 'font-extrabold' : 'font-semibold'}>
              {renderedLineParts}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div id="ai-coach-view" className="space-y-6 pb-12">
      {/* Multilingual universal coach banner with centered dropdown menu */}
      <div className="relative z-30 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/70 p-3.5 sm:p-4 shadow-xs text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
              <Globe className="w-4 h-4 animate-[spin_24s_linear_infinite]" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <span className="font-extrabold text-xs sm:text-sm text-emerald-950 dark:text-emerald-100">
                Coach Polyglotte Universel :
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300">
                21+ langues
              </span>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-emerald-700/90 dark:text-emerald-300/90 text-center max-w-md">
            Comprend, analyse et converse couramment dans toutes les langues
          </p>

          {/* Centered Dropdown Menu (Menu Déroulant) for Coach Language */}
          <div className="relative flex justify-center mt-1" ref={coachLangDropdownRef}>
            <button
              type="button"
              id="coach-polyglot-dropdown-btn"
              onClick={() => setIsCoachLangOpen(!isCoachLangOpen)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-slate-800 dark:text-slate-100 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ring-offset-2 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              aria-expanded={isCoachLangOpen}
              aria-haspopup="listbox"
              title="Menu déroulant : choisir la langue du Coach polyglotte"
            >
              <span className="text-base leading-none">{currentLanguageOption.flag}</span>
              <span className="font-extrabold">{currentLanguageOption.native}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-black">
                {currentLanguageOption.code}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isCoachLangOpen ? 'rotate-180 text-emerald-600' : ''
                }`}
              />
            </button>

            {/* Popover Dropdown Menu - Centered below button */}
            {isCoachLangOpen && (
              <div
                id="coach-polyglot-menu"
                className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 sm:w-84 max-w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left"
              >
                {/* Header */}
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/60 dark:bg-emerald-950/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-white block leading-tight">
                        Langue du Coach IA
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {LANGUAGES.length} langues disponibles
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCoachLangOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    aria-label="Fermer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Search bar */}
                <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      ref={coachLangSearchInputRef}
                      type="text"
                      value={coachLangSearch}
                      onChange={(e) => setCoachLangSearch(e.target.value)}
                      placeholder="Rechercher une langue..."
                      className="w-full pl-9 pr-7 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                    {coachLangSearch && (
                      <button
                        type="button"
                        onClick={() => setCoachLangSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick popular picks */}
                {!coachLangSearch && (
                  <div className="px-3 pt-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                      Accès rapide :
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {POPULAR_LANGUAGE_CODES.slice(0, 8).map((pCode) => {
                        const pLang = LANGUAGES.find((l) => l.code === pCode);
                        if (!pLang) return null;
                        const isCur = language === pCode;
                        return (
                          <button
                            key={pCode}
                            type="button"
                            onClick={() => handleSelectCoachLang(pCode)}
                            className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              isCur
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60'
                            }`}
                          >
                            <span>{pLang.flag}</span>
                            <span className="uppercase text-[10px]">{pLang.code}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Scrollable language options */}
                <div className="p-2 overflow-y-auto max-h-56 space-y-1 scrollbar-thin">
                  {filteredCoachLanguages.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      Aucune langue trouvée pour "{coachLangSearch}"
                    </div>
                  ) : (
                    filteredCoachLanguages.map((opt) => {
                      const isSelected = language === opt.code;
                      return (
                        <button
                          key={opt.code}
                          type="button"
                          onClick={() => handleSelectCoachLang(opt.code)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-extrabold border border-emerald-300 dark:border-emerald-700'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl leading-none">{opt.flag}</span>
                            <div className="leading-tight">
                              <div className="text-xs">{opt.native}</div>
                              <div className="text-[10px] text-slate-400 font-normal">
                                {opt.label}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                              {opt.code}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Universal Google Translate Option */}
                <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                  <button
                    type="button"
                    onClick={() => {
                      triggerGoogleTranslate();
                      setIsCoachLangOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Traduction Universelle (130+ langues)</span>
                  </button>
                  <p className="mt-1.5 text-[10px] text-center text-slate-500 dark:text-slate-400">
                    💡 Le coach IA répondra immédiatement dans cette langue.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Header (Screen 4: Mon coach IA) */}
      <div
        className={`p-4 sm:p-5 rounded-[28px] border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#E2ECE2]'
        } shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3`}
      >
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-[#DCE8DC] dark:border-slate-700 flex items-center justify-center text-[#163321] dark:text-emerald-300 font-bold shadow-xs">
              ‹
            </div>
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#163321] dark:text-white tracking-tight flex items-center gap-2">
                  <span>Mon coach IA</span>
                  <BlossomFlower size={20} palette="pink" />
                </h1>
                <span className="text-[11px] text-[#5A7363] dark:text-emerald-400 font-bold block">
                  En ligne • Conseils personnalisés
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="w-9 h-9 rounded-full bg-[#F4F7F4] dark:bg-slate-800 flex items-center justify-center text-[#5A7363] hover:text-[#163321] cursor-pointer"
            title="Options supplémentaires"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation Modes */}
        <div
          className={`p-1 rounded-2xl border w-full sm:w-auto grid grid-cols-3 sm:inline-flex items-center gap-1 ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            id="subtab-chat"
            onClick={() => setSubTab('chat')}
            className={`px-1.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer text-center truncate ${
              subTab === 'chat'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            💬 Chat
          </button>
          <button
            id="subtab-photo"
            onClick={() => setSubTab('photo')}
            className={`px-1.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer text-center truncate ${
              subTab === 'photo'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            📸 Scan
          </button>
          <button
            id="subtab-generator"
            onClick={() => setSubTab('generator')}
            className={`px-1.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer text-center truncate ${
              subTab === 'generator'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🥗 Menu
          </button>
        </div>
      </div>

      {/* Mode 1: Chat with AI */}
      {subTab === 'chat' && (
        <div
          id="chat-container"
          className={`rounded-3xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } shadow-sm flex flex-col h-[600px] overflow-hidden`}
        >
          {/* Top Controls: Bold Mode Toggle + Suggestion pills */}
          <div
            className={`p-3 border-b ${
              isDarkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-100'
            } flex items-center justify-between gap-3 flex-wrap`}
          >
            {/* Bold Mode Toggle */}
            <button
              id="btn-toggle-bold-mode"
              type="button"
              onClick={toggleBoldMode}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                isBoldMode
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400/40'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title="Activer ou désactiver le formatage en texte gras"
            >
              <Bold className="w-3.5 h-3.5" />
              <span>Texte en gras : {isBoldMode ? 'ACTIVÉ' : 'DÉSACTIVÉ'}</span>
            </button>

            {/* Coach Voice Prompt Button */}
            <button
              id="btn-coach-voice-ask-meal"
              type="button"
              onClick={handleTriggerMealVoiceReminder}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                speakingMessageId === 'coach-meal-question'
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-95'
              }`}
              title="Le Coach vous demande de vive voix ce que vous allez manger"
            >
              {speakingMessageId === 'coach-meal-question' ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Arrêter la voix</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>🎙️ Que vas-tu manger ? (Vocal)</span>
                </>
              )}
            </button>

            {/* Suggestions */}
            <div className="flex-1 min-w-0 overflow-x-auto flex items-center gap-2 text-xs scrollbar-none">
              <span className="font-bold text-slate-400 shrink-0 text-[11px] uppercase tracking-wider">
                Suggestions :
              </span>
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(suggestion)}
                  className={`shrink-0 px-3 py-1 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                    isDarkMode
                      ? 'border-slate-700 bg-slate-800 hover:bg-emerald-950/60 hover:border-emerald-500 text-slate-200'
                      : 'border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-700'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className="shrink-0">
                    {isUser ? (
                      <div className="w-8 h-8 rounded-full bg-[#1F6F43] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        {user.name ? user.name.charAt(0) : <UserIcon className="w-4 h-4" />}
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#E5EFE5] dark:bg-slate-800 flex items-center justify-center p-0.5 shadow-xs">
                        <RobotCoachMascot size={32} waving={false} mood="happy" />
                      </div>
                    )}
                  </div>
                  <div
                    className={`max-w-[85%] rounded-[22px] p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-[#DDECDD] dark:bg-emerald-950 text-[#163321] dark:text-emerald-100 rounded-tr-xs font-bold border border-[#CDE1CD] dark:border-emerald-800'
                        : isDarkMode
                        ? 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-xs'
                        : 'bg-white border border-[#E2ECE2] text-[#163321] rounded-tl-xs'
                    }`}
                  >
                    {renderFormattedMessageText(msg.text, isUser, isBoldMode)}

                    {/* Smart Food Suggestion Card if bot advises a snack/yogurt */}
                    {!isUser && (msg.text.toLowerCase().includes('yaourt') || msg.text.toLowerCase().includes('fringale') || msg.text.toLowerCase().includes('gourmande')) && (
                      <div className="mt-3 rounded-2xl overflow-hidden border border-[#E2ECE2] dark:border-slate-700 bg-[#F9FAF9] dark:bg-slate-800 shadow-2xs">
                        <img
                          src="https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80"
                          alt="Yaourt aux fruits et amandes"
                          className="w-full h-32 object-cover"
                          loading="lazy"
                        />
                        <div className="p-2.5 flex items-center justify-between">
                          <span className="text-[11px] font-black text-[#163321] dark:text-white">
                            Yaourt nature, fruits & amandes (~160 kcal)
                          </span>
                          <button
                            type="button"
                            onClick={() => onAddMealFromAi({
                              foodName: 'Yaourt nature, fruits frais & amandes',
                              calories: 160,
                              protein: 10,
                              carbs: 18,
                              fat: 5,
                            })}
                            className="text-[10px] font-black text-white bg-[#1F6F43] hover:bg-[#175834] px-2.5 py-1 rounded-full cursor-pointer"
                          >
                            + Noter
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => handleSpeakMessage(msg.id, msg.text)}
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                            speakingMessageId === msg.id
                              ? 'bg-amber-500 text-white animate-pulse'
                              : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/70 dark:hover:bg-slate-700'
                          }`}
                          title="Écouter ce conseil de vive voix"
                        >
                          {speakingMessageId === msg.id ? (
                            <>
                              <VolumeX className="w-3 h-3" />
                              <span>Arrêter</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>Écouter la voix</span>
                            </>
                          )}
                        </button>
                      )}
                      <span
                        className={`text-[10px] ${
                          isUser ? 'text-[#1F6F43] dark:text-emerald-300 text-right w-full font-bold' : 'text-slate-400'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {isSending && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div
                  className={`rounded-2xl p-4 text-xs leading-relaxed ${
                    isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                    <span>NutriCoach réfléchit...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input footer pill matching Screen 4 */}
          <div
            className={`p-3.5 border-t ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#E2ECE2]'
            } flex items-center gap-2`}
          >
            <button
              id="btn-footer-toggle-bold"
              type="button"
              onClick={toggleBoldMode}
              className={`p-2.5 rounded-full border transition-all cursor-pointer shrink-0 ${
                isBoldMode
                  ? 'bg-[#1F6F43] text-white border-[#1F6F43] shadow-xs'
                  : 'bg-[#F4F7F4] dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-[#DCE8DC] dark:border-slate-700 hover:text-[#1F6F43]'
              }`}
              title={isBoldMode ? 'Texte en gras activé' : 'Activer le texte en gras'}
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <div className="flex-1 relative flex items-center">
              <input
                id="input-coach-chat-message"
                type="text"
                placeholder="Posez-moi une question..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                className={`w-full py-3 pl-4 pr-12 rounded-full border text-xs sm:text-sm ${
                  isBoldMode ? 'font-bold' : 'font-medium'
                } outline-none focus:ring-2 focus:ring-[#1F6F43] transition-all shadow-xs ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
                    : 'bg-[#F9FAF9] border-[#E2ECE2] text-[#163321] placeholder:text-[#5A7363]'
                }`}
              />
              <button
                id="btn-send-coach-chat"
                onClick={handleSend}
                disabled={!inputText.trim() || isSending}
                className="absolute right-1.5 w-9 h-9 rounded-full bg-[#1F6F43] hover:bg-[#175834] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                title="Envoyer la question"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Photo Meal Scan */}
      {subTab === 'photo' && (
        <div
          id="photo-scan-container"
          className={`p-5 sm:p-6 rounded-3xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } shadow-sm space-y-5`}
        >
          <div>
            <h2 className="text-lg font-black text-black dark:text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              Scanner Photo IA
            </h2>
            <p className="text-xs text-black/75 dark:text-slate-300">
              Prenez une photo de votre assiette ou importez une image pour estimer automatiquement les calories et macronutriments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input
                id="file-input-meal-photo"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                id="camera-input-meal-photo"
                type="file"
                accept="image/*"
                capture="environment"
                ref={cameraFileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Action buttons for Camera vs Gallery */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="btn-open-photo-camera"
                  onClick={handleOpenLiveCamera}
                  className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Camera className="w-4 h-4" />
                  <span>Prendre une photo</span>
                </button>
                <button
                  type="button"
                  id="btn-open-photo-gallery"
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-3 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer border ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                      : 'bg-emerald-50 border-emerald-200 text-black hover:bg-emerald-100'
                  }`}
                >
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Galerie / Fichier</span>
                </button>
              </div>

              {isPhotoCameraOpen ? (
                <div className="rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-950 relative">
                  <video
                    ref={photoVideoRef}
                    playsInline
                    muted
                    autoPlay
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-2.5 bg-slate-900/90 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={stopPhotoCamera}
                      className="px-3 py-2 rounded-xl bg-slate-700 text-white text-xs font-bold cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      id="btn-capture-meal-camera"
                      onClick={handleCapturePhotoFromCamera}
                      className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capturer mon assiette</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  id="dropzone-meal-photo"
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                    selectedImage
                      ? 'border-emerald-500 bg-emerald-50/20'
                      : isDarkMode
                      ? 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                      : 'border-slate-300 hover:border-emerald-400 bg-slate-50'
                  }`}
                >
                  {selectedImage ? (
                    <div className="space-y-2.5">
                      <img
                        src={selectedImage}
                        alt="Repas"
                        className="max-h-48 rounded-xl mx-auto object-cover shadow-sm"
                      />
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        Photo prête ! Cliquez pour changer ou lancez l'analyse ci-dessous.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-xs text-black dark:text-slate-200 block">
                        Appuyez ici pour choisir une photo de votre repas
                      </span>
                      <span className="text-[11px] text-black/60 dark:text-slate-400 block">
                        JPG, PNG, WebP • Compression automatique
                      </span>
                    </div>
                  )}
                </div>
              )}

              {photoCameraError && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs font-bold text-amber-900 dark:text-amber-200">
                  {photoCameraError}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-black dark:text-slate-300 block mb-1">
                  Précision complémentaire (facultatif)
                </label>
                <input
                  id="input-photo-meal-description"
                  type="text"
                  placeholder="ex: Pavé de saumon grillé, riz basmati et légumes"
                  value={photoDescription}
                  onChange={(e) => setPhotoDescription(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm font-medium outline-none ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
                      : 'bg-slate-50 border-slate-200 text-black placeholder:text-slate-500'
                  }`}
                />
              </div>

              {photoError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-start gap-2 text-xs font-bold text-rose-800 dark:text-rose-200">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{photoError}</span>
                </div>
              )}

              <button
                id="btn-analyze-meal-photo-action"
                type="button"
                onClick={handleAnalyzePhoto}
                disabled={isAnalyzingPhoto || (!selectedImage && !photoDescription.trim())}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-black p-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {isAnalyzingPhoto ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyse diététique par l'IA en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" /> Analyser mon repas
                  </>
                )}
              </button>
            </div>

            {/* Analysis Result Card */}
            <div
              className={`p-5 rounded-2xl border ${
                isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <h3 className="font-extrabold text-sm text-black dark:text-slate-200 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Résultat d'analyse nutritionnelle
              </h3>

              {photoAnalysisResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700 gap-2">
                    <div className="min-w-0">
                      <h4 className="font-black text-base text-black dark:text-white leading-snug">
                        {photoAnalysisResult.foodName}
                      </h4>
                      <p className="text-xs text-black/70 dark:text-slate-400">
                        Portion estimée : {photoAnalysisResult.portionDescription || 'Portion standard'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                        {photoAnalysisResult.estimatedCalories} kcal
                      </span>
                    </div>
                  </div>

                  {photoAnalysisResult.detectedItems && photoAnalysisResult.detectedItems.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {photoAnalysisResult.detectedItems.map((item: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold">
                      <span className="text-[10px] block text-black/65 dark:text-slate-400 uppercase">Protéines</span>
                      <span className="text-sm font-black">{photoAnalysisResult.protein}g</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold">
                      <span className="text-[10px] block text-black/65 dark:text-slate-400 uppercase">Glucides</span>
                      <span className="text-sm font-black">{photoAnalysisResult.carbs}g</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-700 dark:text-sky-400 font-bold">
                      <span className="text-[10px] block text-black/65 dark:text-slate-400 uppercase">Lipides</span>
                      <span className="text-sm font-black">{photoAnalysisResult.fat}g</span>
                    </div>
                  </div>

                  <p className="text-xs text-black dark:text-slate-200 bg-white/80 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                    "{photoAnalysisResult.feedback}"
                  </p>

                  {/* Meal category selector */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-extrabold text-black dark:text-slate-300 block">
                      Enregistrer dans :
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(
                        [
                          { type: 'petit_dejeuner', label: 'Petit-déj.' },
                          { type: 'dejeuner', label: 'Déjeuner' },
                          { type: 'collation', label: 'Collation' },
                          { type: 'diner', label: 'Dîner' },
                        ] as Array<{ type: MealType; label: string }>
                      ).map((opt) => (
                        <button
                          key={opt.type}
                          type="button"
                          onClick={() => setPhotoMealType(opt.type)}
                          className={`py-1.5 px-1 rounded-xl text-[10px] font-black cursor-pointer transition-all truncate ${
                            photoMealType === opt.type
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : isDarkMode
                              ? 'bg-slate-900 text-slate-300 border border-slate-700'
                              : 'bg-white text-black border border-slate-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    id="btn-add-analyzed-meal-to-journal"
                    type="button"
                    onClick={() => {
                      onAddMealFromAi({
                        foodName: photoAnalysisResult.foodName,
                        calories: photoAnalysisResult.estimatedCalories,
                        protein: photoAnalysisResult.protein,
                        carbs: photoAnalysisResult.carbs,
                        fat: photoAnalysisResult.fat,
                        mealType: photoMealType,
                        portionGrams: photoAnalysisResult.portionGrams,
                      });
                      setPhotoAddedSuccess(true);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black p-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {photoAddedSuccess ? (
                      <>
                        <Check className="w-4 h-4" /> Ajouté avec succès au journal !
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Ajouter ce repas à mon journal
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center text-black/65 dark:text-slate-400 text-xs">
                  Prenez ou importez une photo de votre assiette puis cliquez sur « Analyser mon repas ».
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Custom Menu Generator */}
      {subTab === 'generator' && (
        <div
          id="menu-generator-container"
          className={`p-6 rounded-3xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } shadow-sm space-y-6`}
        >
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Générateur de Menus Sur-Mesure
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Générez un menu équilibré complet (Petit-déjeuner, Déjeuner, Collation, Dîner) adapté exactement à vos
              calories cibles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Cible Calorique (kcal)</label>
              <input
                id="input-generator-calories"
                type="number"
                value={generatorCalories}
                onChange={(e) => setGeneratorCalories(parseInt(e.target.value, 10) || 1500)}
                className={`w-full p-3 rounded-xl border text-sm font-bold outline-none ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Préférence Alimentaire</label>
              <select
                id="select-generator-preference"
                value={generatorPreference}
                onChange={(e) => setGeneratorPreference(e.target.value)}
                className={`w-full p-3 rounded-xl border text-sm font-bold outline-none ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <option value="standard">Standard Équilibré</option>
                <option value="vegetarien">Végétarien</option>
                <option value="sans_gluten">Sans Gluten</option>
                <option value="keto">Low Carb / Proteiné</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                id="btn-generate-menu-action"
                onClick={handleGenerateMenu}
                disabled={isGeneratingMenu}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold p-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer h-[46px]"
              >
                {isGeneratingMenu ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                )}
                Générer mon Menu
              </button>
            </div>
          </div>

          {generatedMenu && (
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Menu suggéré (~{generatedMenu.totalCalories} kcal)
                </h3>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                  Conseil IA : {generatedMenu.coachTip}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {generatedMenu.meals?.map((meal: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border ${
                      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    } space-y-2`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                      {meal.mealType}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">{meal.title}</h4>
                    <p className="text-xs text-slate-500 leading-snug">{meal.description}</p>
                    <span className="text-xs font-black text-slate-900 dark:text-white block pt-1">
                      {meal.calories} kcal
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
