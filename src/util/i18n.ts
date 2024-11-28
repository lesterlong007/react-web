import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import LanguageDetector from 'i18next-browser-languagedetector';
import resources from '../i18n';

// language code see https://www.alchemysoftware.com/livedocs/ezscript/ezScript.htm#Topics/Catalyst/Language.htm
export enum AppLan {
  EN = 'en', // English
  ZH = 'zh', // Simplified Chinese
  ZH_S = 'zh-Hans', // Simplified Chinese
  ZH_T = 'zh-Hant', // Traditional Chinese
  MS = 'ms',
  ID = 'id',
  KM = 'km',
  VI = 'vi',
  TH = 'th'
}

export enum Region {
  MO = 'MO',
  HK = 'HK',
  MY = 'MY',
  ID = 'ID',
  KH = 'KH',
  SG = 'SG',
  VN = 'VN',
  PH = 'PH',
  TH = 'TH'
}

const languageMap: Record<string, string> = {
  zh: AppLan.ZH,
  zh_CN: AppLan.ZH_S,
  zh_HK: AppLan.ZH_T,
  zh_TW: AppLan.ZH_T,
  zh_MO: AppLan.ZH_T,
  ID: AppLan.ID,
  KH: AppLan.KM
};

export const getAppLanguage = (): string => {
  const cachedLan = localStorage.getItem('neo_language');
  if (cachedLan) {
    return cachedLan.replace('_', '-');
  } else {
    const originLan = window.navigator.language || AppLan.EN;
    const language = originLan.replace('-', '_').replace(/^en_.*/, AppLan.EN);
    return languageMap[language] || AppLan.EN;
  }
};

i18n
  .use(LanguageDetector)
  .use(intervalPlural)
  .use(initReactI18next)
  .init({
    resources,
    lng: getAppLanguage(),
    debug: false,
    fallbackLng: AppLan.EN,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
