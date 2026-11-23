import { Language } from './translations.ts';
import { UiAuthBillingDict, AB_FR, AB_EN, AB_ES, AB_DE } from './uiAuthBillingDict.ts';
import { AB_IT, AB_PT, AB_NL, AB_PL } from './uiAuthBillingDictWest.ts';
import { AB_NO, AB_SV, AB_DA } from './uiAuthBillingDictNordic.ts';
import { AB_FI, AB_RU, AB_JA } from './uiAuthBillingDictMore.ts';
import { AB_ZH, AB_AR } from './uiAuthBillingDictEast.ts';
import { AB_TR, AB_EL, AB_CS, AB_RO, AB_UK } from './uiAuthBillingDictSouth.ts';

export type { UiAuthBillingDict };

export const UI_AUTH_BILLING_I18N: Record<Language, UiAuthBillingDict> = {
  fr: AB_FR,
  en: AB_EN,
  es: AB_ES,
  de: AB_DE,
  it: AB_IT,
  pt: AB_PT,
  nl: AB_NL,
  pl: AB_PL,
  no: AB_NO,
  sv: AB_SV,
  da: AB_DA,
  fi: AB_FI,
  ru: AB_RU,
  ja: AB_JA,
  zh: AB_ZH,
  ar: AB_AR,
  tr: AB_TR,
  el: AB_EL,
  cs: AB_CS,
  ro: AB_RO,
  uk: AB_UK,
};

export const getUiAuthBilling = (lang: Language): UiAuthBillingDict => {
  return UI_AUTH_BILLING_I18N[lang] || UI_AUTH_BILLING_I18N.fr;
};
