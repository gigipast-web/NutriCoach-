import { Language } from './translations.ts';
import { UiCoreDict, CORE_FR, CORE_EN, CORE_ES, CORE_DE, CORE_IT, CORE_PT, CORE_NL } from './uiCoreDict.ts';
import { CORE_PL, CORE_NO, CORE_SV, CORE_DA, CORE_FI, CORE_RU, CORE_JA } from './uiCoreDictMore.ts';
import { CORE_ZH, CORE_AR, CORE_TR, CORE_EL, CORE_CS, CORE_RO, CORE_UK } from './uiCoreDictEast.ts';

export type { UiCoreDict };

export const UI_CORE_I18N: Record<Language, UiCoreDict> = {
  fr: CORE_FR,
  en: CORE_EN,
  es: CORE_ES,
  de: CORE_DE,
  it: CORE_IT,
  pt: CORE_PT,
  nl: CORE_NL,
  pl: CORE_PL,
  no: CORE_NO,
  sv: CORE_SV,
  da: CORE_DA,
  fi: CORE_FI,
  ru: CORE_RU,
  ja: CORE_JA,
  zh: CORE_ZH,
  ar: CORE_AR,
  tr: CORE_TR,
  el: CORE_EL,
  cs: CORE_CS,
  ro: CORE_RO,
  uk: CORE_UK,
};

export const getUiCore = (lang: Language): UiCoreDict => {
  return UI_CORE_I18N[lang] || UI_CORE_I18N.fr;
};
