import { Language } from '../i18n/translations.ts';

/**
 * Voice Coach Utility (Speech Synthesis / Web Speech API)
 * Allows NutriCoach to speak voice reminders and read answers aloud in all 21 languages.
 */

export interface VoiceState {
  isSpeaking: boolean;
  isSupported: boolean;
  selectedVoiceName?: string;
}

export const SPEECH_LOCALES: Record<Language, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  es: 'es-ES',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-PT',
  nl: 'nl-NL',
  pl: 'pl-PL',
  no: 'nb-NO',
  sv: 'sv-SE',
  da: 'da-DK',
  fi: 'fi-FI',
  ru: 'ru-RU',
  ja: 'ja-JP',
  zh: 'zh-CN',
  ar: 'ar-SA',
  tr: 'tr-TR',
  el: 'el-GR',
  cs: 'cs-CZ',
  ro: 'ro-RO',
  uk: 'uk-UA',
};

export const getSpeechLocale = (lang: string = 'fr'): string => {
  return SPEECH_LOCALES[lang as Language] || 'fr-FR';
};

export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

// Preload and cache available voices
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
    };
  }
}

/**
 * Find the best voice for the target language (e.g. 'fr' or 'nb-NO')
 */
export const getBestVoice = (langCode: string = 'fr'): SpeechSynthesisVoice | null => {
  if (!isSpeechSynthesisSupported()) return null;

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const resolvedLocale = getSpeechLocale(langCode).toLowerCase();
  const targetPrefix = (langCode === 'no' ? 'nb' : langCode).toLowerCase().split('-')[0];
  const altPrefix = langCode === 'no' ? 'no' : targetPrefix;

  const matchesLang = (vLang: string) => {
    const low = vLang.toLowerCase();
    return low === resolvedLocale || low.startsWith(targetPrefix) || low.startsWith(altPrefix);
  };

  const naturalMatch = voices.find(
    (v) =>
      matchesLang(v.lang) &&
      (v.name.includes('Natural') ||
        v.name.includes('Google') ||
        v.name.includes('Premium') ||
        v.name.includes('Siri') ||
        v.name.includes('Amelie') ||
        v.name.includes('Thomas') ||
        v.name.includes('Audrey'))
  );
  if (naturalMatch) return naturalMatch;

  const langMatch = voices.find((v) => matchesLang(v.lang));
  if (langMatch) return langMatch;

  return voices[0] || null;
};

/**
 * Play text aloud using browser SpeechSynthesis
 */
export const speakText = (
  text: string,
  options: {
    language?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  } = {}
): boolean => {
  if (!isSpeechSynthesisSupported()) {
    console.warn('Speech synthesis is not supported in this browser.');
    return false;
  }

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const rawLang = options.language || 'fr-FR';
    const lang = rawLang.includes('-') ? rawLang : getSpeechLocale(rawLang);
    utterance.lang = lang;
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;

    const voice = getBestVoice(lang);
    if (voice) {
      utterance.voice = voice;
    }

    if (options.onStart) {
      utterance.onstart = options.onStart;
    }

    utterance.onend = () => {
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error or blocked by autoplay policy:', e);
      if (options.onError) options.onError(e);
      if (options.onEnd) options.onEnd();
    };

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Failed to trigger speech synthesis:', err);
    if (options.onError) options.onError(err);
    return false;
  }
};

/**
 * Stop any current speech playback
 */
export const stopSpeaking = (): void => {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
};

const MEAL_REMINDER_TEMPLATES: Record<Language, (name: string) => string> = {
  fr: (n) => `Bonjour${n} ! C'est ton Coach NutriCoach. Que vas-tu manger aujourd'hui ? Prends 30 secondes pour noter ou photographier ton repas afin de garder le cap sur tes calories !`,
  en: (n) => `Hello${n}! It's your NutriCoach. What are you going to eat today? Remember to log your meal to stay on track with your goals!`,
  es: (n) => `¡Hola${n}! Es tu NutriCoach. ¿Qué vas a comer hoy? ¡Recuerda registrar tu comida para mantener el equilibrio!`,
  de: (n) => `Hallo${n}! Hier ist dein NutriCoach. Was wirst du heute essen? Vergiss nicht, deine Mahlzeit einzutragen!`,
  it: (n) => `Ciao${n}! È il tuo NutriCoach. Cosa mangerai oggi? Ricordati di registrare il tuo pasto per raggiungere i tuoi obiettivi!`,
  pt: (n) => `Olá${n}! Aqui é o seu NutriCoach. O que você vai comer hoje? Lembre-se de registrar sua refeição para manter o foco!`,
  nl: (n) => `Hallo${n}! Dit is je NutriCoach. Wat ga je vandaag eten? Vergeet niet je maaltijd te loggen om op schema te blijven!`,
  pl: (n) => `Cześć${n}! Tu Twój NutriCoach. Co dzisiaj zjesz? Pamiętaj, aby zapisać posiłek i utrzymać cel kaloryczny!`,
  no: (n) => `Hei${n}! Dette er din NutriCoach. Hva skal du spise i dag? Husk å logge måltidet ditt for å holde kursen!`,
  sv: (n) => `Hej${n}! Det här är din NutriCoach. Vad ska du äta idag? Glöm inte att logga din måltid för att nå dina mål!`,
  da: (n) => `Hej${n}! Det er din NutriCoach. Hvad skal du spise i dag? Husk at logge dit måltid for at nå dine mål!`,
  fi: (n) => `Hei${n}! Tässä on NutriCoach. Mitä aiot syödä tänään? Muista kirjata ateriasi pysyäksesi tavoitteessasi!`,
  ru: (n) => `Привет${n}! Это твой NutriCoach. Что ты будешь есть сегодня? Не забудь записать приём пищи, чтобы держаться плана!`,
  ja: (n) => `こんにちは${n}さん！NutriCoachです。今日は何を食べますか？目標達成のために食事を記録しましょう！`,
  zh: (n) => `你好${n}！我是你的 NutriCoach 教练。今天打算吃什么？别忘了记录你的饮食，保持目标进度！`,
  ar: (n) => `مرحباً${n}! معك مدربك NutriCoach. ماذا ستأكل اليوم؟ تذكر تسجيل وجبتك للحفاظ على هدفك!`,
  tr: (n) => `Merhaba${n}! Ben NutriCoach koçun. Bugün ne yiyeceksin? Hedefinde kalmak için öğününü kaydetmeyi unutma!`,
  el: (n) => `Γεια σου${n}! Είμαι ο NutriCoach σου. Τι θα φας σήμερα; Θυμήσου να καταγράψεις το γεύμα σου!`,
  cs: (n) => `Ahoj${n}! Tady tvůj NutriCoach. Co si dnes dáš k jídlu? Nezapomeň si zapsat své jídlo!`,
  ro: (n) => `Bună${n}! Sunt NutriCoach. Ce vei mânca astăzi? Nu uita să îți notezi masa pentru a rămâne în obiectiv!`,
  uk: (n) => `Привіт${n}! Це твій NutriCoach. Що ти їстимеш сьогодні? Не забудь записати прийом їжі!`,
};

const WELCOME_VOICE_TEMPLATES: Record<Language, (name: string, isEvening: boolean) => string> = {
  fr: (n, eve) => `${eve ? 'Bonsoir' : 'Bonjour'}${n} ! C'est votre Coach NutriCoach. Que vas-tu manger aujourd'hui ? Prends 30 secondes pour noter ou photographier ton repas afin de garder le cap !`,
  en: (n) => `Welcome back${n}! It's your NutriCoach. What are you going to eat today? I'm here to help you stay on track!`,
  es: (n) => `¡Hola${n}! Es tu NutriCoach. ¿Qué vas a comer hoy? ¡Estoy a tu lado para ayudarte!`,
  de: (n) => `Willkommen zurück${n}! Hier ist dein NutriCoach. Was wirst du heute essen? Ich bin für dich da!`,
  it: (n) => `Bentornato${n}! È il tuo NutriCoach. Cosa mangerai oggi? Sono qui per aiutarti!`,
  pt: (n) => `Bem-vindo de volta${n}! É o seu NutriCoach. O que você vai comer hoje? Estou aqui para ajudar!`,
  nl: (n) => `Welkom terug${n}! Dit is je NutriCoach. Wat ga je vandaag eten? Ik help je graag op koers te blijven!`,
  pl: (n) => `Witaj ponownie${n}! Tu Twój NutriCoach. Co dziś zjesz? Jestem tu, aby Ci pomóc!`,
  no: (n) => `Velkommen tilbake${n}! Dette er din NutriCoach. Hva skal du spise i dag? Jeg er her for å hjelpe deg!`,
  sv: (n) => `Välkommen tillbaka${n}! Det här är din NutriCoach. Vad ska du äta idag? Jag hjälper dig att hålla kursen!`,
  da: (n) => `Velkommen tilbage${n}! Det er din NutriCoach. Hvad skal du spise i dag? Jeg er her for at hjælpe dig!`,
  fi: (n) => `Tervetuloa takaisin${n}! Tässä on NutriCoach. Mitä syöt tänään? Autan sinua pysymään tavoitteessa!`,
  ru: (n) => `С возвращением${n}! Это твой NutriCoach. Что ты будешь есть сегодня? Я рядом, чтобы помочь!`,
  ja: (n) => `おかえりなさい${n}さん！NutriCoachです。今日は何を食べますか？目標達成をサポートします！`,
  zh: (n) => `欢迎回来${n}！我是 NutriCoach。今天打算吃什么？我会一直陪伴并帮助你实现目标！`,
  ar: (n) => `أهلاً بعودتك${n}! معك مدربك NutriCoach. ماذا ستأكل اليوم؟ أنا هنا لمساعدتك على الاستمرار!`,
  tr: (n) => `Tekrar hoş geldin${n}! Ben NutriCoach. Bugün ne yiyeceksin? Hedefine ulaşman için buradayım!`,
  el: (n) => `Καλώς ήρθες πίσω${n}! Είμαι ο NutriCoach. Τι θα φας σήμερα; Είμαι εδώ για να σε βοηθήσω!`,
  cs: (n) => `Vítej zpět${n}! Tady tvůj NutriCoach. Co budeš dnes jíst? Jsem tu, abych ti pomohl!`,
  ro: (n) => `Bine ai revenit${n}! Sunt NutriCoach. Ce vei mânca azi? Sunt aici să te ajut să rămâi pe drumul cel bun!`,
  uk: (n) => `З поверненням${n}! Це твій NutriCoach. Що ти їстимеш сьогодні? Я поруч, щоб допомогти!`,
};

/**
 * Get standard localized text for "Que vas-tu manger aujourd'hui ?"
 */
export const getMealReminderText = (userName?: string, lang: string = 'fr'): string => {
  const name = userName && userName !== 'Invité' && userName.trim() ? ` ${userName.trim()}` : '';
  const tpl = MEAL_REMINDER_TEMPLATES[lang as Language] || MEAL_REMINDER_TEMPLATES.fr;
  return tpl(name);
};

/**
 * Trigger the voice reminder "Que vas-tu manger aujourd'hui ?"
 */
export const playMealVoiceReminder = (
  userName?: string,
  lang: string = 'fr',
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): boolean => {
  const text = getMealReminderText(userName, lang);
  return speakText(text, {
    language: getSpeechLocale(lang),
    onStart: callbacks?.onStart,
    onEnd: callbacks?.onEnd,
    onError: callbacks?.onError,
  });
};

/**
 * Welcome greeting spoken automatically when opening the application
 */
export const getWelcomeVoiceText = (userName?: string, lang: string = 'fr'): string => {
  const name = userName && userName !== 'Invité' && userName.trim() ? ` ${userName.trim()}` : '';
  const isEvening = new Date().getHours() >= 18;
  const tpl = WELCOME_VOICE_TEMPLATES[lang as Language] || WELCOME_VOICE_TEMPLATES.fr;
  return tpl(name, isEvening);
};

export const playWelcomeVoiceGreeting = (
  userName?: string,
  lang: string = 'fr',
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): boolean => {
  const text = getWelcomeVoiceText(userName, lang);
  return speakText(text, {
    language: getSpeechLocale(lang),
    onStart: callbacks?.onStart,
    onEnd: callbacks?.onEnd,
    onError: callbacks?.onError,
  });
};
