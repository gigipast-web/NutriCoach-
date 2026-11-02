/**
 * Voice Coach Utility (Speech Synthesis / Web Speech API)
 * Allows NutriCoach to speak voice reminders and read answers aloud.
 */

export interface VoiceState {
  isSpeaking: boolean;
  isSupported: boolean;
  selectedVoiceName?: string;
}

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
 * Find the best voice for the target language (e.g. 'fr' or 'fr-FR')
 */
export const getBestVoice = (langCode: string = 'fr'): SpeechSynthesisVoice | null => {
  if (!isSpeechSynthesisSupported()) return null;

  let voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const targetPrefix = langCode.toLowerCase().split('-')[0];

  // Try exact match with high quality / natural voices first
  const naturalMatch = voices.find(
    (v) =>
      v.lang.toLowerCase().startsWith(targetPrefix) &&
      (v.name.includes('Natural') ||
        v.name.includes('Google') ||
        v.name.includes('Premium') ||
        v.name.includes('Siri') ||
        v.name.includes('Amelie') ||
        v.name.includes('Thomas') ||
        v.name.includes('Audrey'))
  );
  if (naturalMatch) return naturalMatch;

  // Fallback to any voice matching prefix
  const langMatch = voices.find((v) => v.lang.toLowerCase().startsWith(targetPrefix));
  if (langMatch) return langMatch;

  // Default fallback
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
    // Resume in case browser speech engine was left paused
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    // Clean markdown formatting if present
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const lang = options.language || 'fr-FR';
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
    } catch (e) {
      // ignore
    }
  }
};

/**
 * Get standard localized text for "Que vas-tu manger aujourd'hui ?"
 */
export const getMealReminderText = (userName?: string, lang: string = 'fr'): string => {
  const name = userName && userName !== 'Invité' && userName.trim() ? ` ${userName.trim()}` : '';

  switch (lang) {
    case 'en':
      return `Hello${name}! It's your NutriCoach. What are you going to eat today? Remember to log your meal to stay on track with your goals!`;
    case 'es':
      return `¡Hola${name}! Es tu NutriCoach. ¿Qué vas a comer hoy? ¡Recuerda registrar tu comida para mantener el equilibrio!`;
    case 'de':
      return `Hallo${name}! Hier ist dein NutriCoach. Was wirst du heute essen? Vergiss nicht, deine Mahlzeit einzutragen!`;
    case 'it':
      return `Ciao${name}! È il tuo NutriCoach. Cosa mangerai oggi? Ricordati di registrare il tuo pasto per raggiungere i tuoi obiettivi!`;
    default:
      return `Bonjour${name} ! C'est ton Coach NutriCoach. Que vas-tu manger aujourd'hui ? Prends 30 secondes pour noter ou photographier ton repas afin de garder le cap sur tes calories !`;
  }
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
    language: lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : lang === 'de' ? 'de-DE' : lang === 'it' ? 'it-IT' : 'fr-FR',
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
  const hour = new Date().getHours();
  const salutation = hour >= 18 ? 'Bonsoir' : 'Bonjour';

  switch (lang) {
    case 'en':
      return `Welcome back${name}! It's your NutriCoach. What are you going to eat today? I'm here to help you stay on track!`;
    case 'es':
      return `¡Hola${name}! Es tu NutriCoach. ¿Qué vas a comer hoy? ¡Estoy a tu lado para ayudarte!`;
    case 'de':
      return `Willkommen zurück${name}! Hier ist dein NutriCoach. Was wirst du heute essen? Ich bin für dich da!`;
    case 'it':
      return `Bentornato${name}! È il tuo NutriCoach. Cosa mangerai oggi? Sono qui per aiutarti!`;
    default:
      return `${salutation}${name} ! C'est votre Coach NutriCoach. Que vas-tu manger aujourd'hui ? Prends 30 secondes pour noter ou photographier ton repas afin de garder le cap !`;
  }
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
    language: lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : lang === 'de' ? 'de-DE' : lang === 'it' ? 'it-IT' : 'fr-FR',
    onStart: callbacks?.onStart,
    onEnd: callbacks?.onEnd,
    onError: callbacks?.onError,
  });
};
