import { Language } from './translations.ts';
import { UiTrackingDict, TRK_FR, TRK_EN, TRK_ES, TRK_DE } from './uiTrackingDictWest.ts';
import { TRK_IT, TRK_PT, TRK_NL } from './uiTrackingDictSouth.ts';
import { TRK_PL, TRK_NO, TRK_SV } from './uiTrackingDictCentral.ts';
import { TRK_DA, TRK_FI, TRK_RU } from './uiTrackingDictNordic.ts';
import { TRK_JA, TRK_ZH, TRK_AR } from './uiTrackingDictAsia.ts';
import { TRK_TR, TRK_EL, TRK_CS } from './uiTrackingDictSouthEast.ts';
import { TRK_RO, TRK_UK } from './uiTrackingDictEast.ts';

export type { UiTrackingDict };

export const UI_TRACKING_I18N: Record<Language, UiTrackingDict> = {
  fr: TRK_FR,
  en: TRK_EN,
  es: TRK_ES,
  de: TRK_DE,
  it: TRK_IT,
  pt: TRK_PT,
  nl: TRK_NL,
  pl: TRK_PL,
  no: TRK_NO,
  sv: TRK_SV,
  da: TRK_DA,
  fi: TRK_FI,
  ru: TRK_RU,
  ja: TRK_JA,
  zh: TRK_ZH,
  ar: TRK_AR,
  tr: TRK_TR,
  el: TRK_EL,
  cs: TRK_CS,
  ro: TRK_RO,
  uk: TRK_UK,
};

export const getUiTracking = (lang: Language): UiTrackingDict => {
  return UI_TRACKING_I18N[lang] || UI_TRACKING_I18N.fr;
};

export const getMealTypeLabelLocal = (
  lang: Language,
  type: 'petit-dejeuner' | 'petit_dejeuner' | 'dejeuner' | 'collation' | 'diner',
  short = false
): string => {
  const trk = getUiTracking(lang);
  switch (type) {
    case 'petit-dejeuner':
    case 'petit_dejeuner':
      return short ? trk.mealBreakfastShort : trk.mealBreakfast;
    case 'dejeuner':
      return trk.mealLunch;
    case 'collation':
      return trk.mealSnack;
    case 'diner':
      return trk.mealDinner;
  }
};
