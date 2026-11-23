import { Language } from './translations.ts';
import { UiWellnessDict, WLN_FR, WLN_EN, WLN_ES } from './uiWellnessDictWest.ts';
import { WLN_DE, WLN_IT, WLN_PT } from './uiWellnessDictSouth.ts';
import { WLN_NL, WLN_PL, WLN_NO } from './uiWellnessDictCentral.ts';
import { WLN_SV, WLN_DA, WLN_FI } from './uiWellnessDictNordic.ts';
import { WLN_RU, WLN_JA, WLN_ZH } from './uiWellnessDictAsia.ts';
import { WLN_AR, WLN_TR, WLN_EL } from './uiWellnessDictSouthEast.ts';
import { WLN_CS, WLN_RO, WLN_UK } from './uiWellnessDictEast.ts';

export type { UiWellnessDict };

export const UI_WELLNESS_I18N: Record<Language, UiWellnessDict> = {
  fr: WLN_FR,
  en: WLN_EN,
  es: WLN_ES,
  de: WLN_DE,
  it: WLN_IT,
  pt: WLN_PT,
  nl: WLN_NL,
  pl: WLN_PL,
  no: WLN_NO,
  sv: WLN_SV,
  da: WLN_DA,
  fi: WLN_FI,
  ru: WLN_RU,
  ja: WLN_JA,
  zh: WLN_ZH,
  ar: WLN_AR,
  tr: WLN_TR,
  el: WLN_EL,
  cs: WLN_CS,
  ro: WLN_RO,
  uk: WLN_UK,
};

export const getUiWellness = (lang: Language): UiWellnessDict => {
  return UI_WELLNESS_I18N[lang] || UI_WELLNESS_I18N.fr;
};
