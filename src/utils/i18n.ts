import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Language } from './enum';
import enLocale from '../locales/en-US.json';
import zhLocale from '../locales/zh-CN.json';
import twLocale from '../locales/zh-TW.json';
import jpLocale from '../locales/ja-JP.json';
import tkLocale from '../locales/tr-TK.json';

const resources = {
  [Language.en]: { translation: enLocale },
  [Language.zh]: { translation: zhLocale },
  [Language.tw]: { translation: twLocale },
  [Language.jp]: { translation: jpLocale },
  [Language.tk]: { translation: tkLocale },
};

// 本地存储
export const LANG_CACHE_KEY = 'NFT_LANG_KEY';
export const changeLanguage = (lang: Language) => {
  i18n.changeLanguage(lang, () => {
    window.localStorage.setItem(LANG_CACHE_KEY, lang);
  });
};
const getInitLang = () => {
  const langCache = localStorage.getItem(LANG_CACHE_KEY);
  if (langCache) return langCache;
  const browseLang = navigator?.language?.substr(0, 2)?.toLowerCase();
  return browseLang.includes('zh') ? Language.zh : Language.en;
};

// 初始化
export const initI18n = () => {
  const initLang = getInitLang();
  localStorage.setItem(LANG_CACHE_KEY, initLang);
  return i18n.use(initReactI18next).init({
    resources,
    fallbackLng: initLang,
    debug: true,
    react: {
      useSuspense: false,
    },
    detection: {
      order: ['querystring', 'navigator', 'localStorage'],
      lookupQuerystring: 'lang',
    },
  });
};

export default i18n;
