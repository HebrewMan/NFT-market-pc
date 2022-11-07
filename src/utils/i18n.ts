import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { LANG } from './enum'
import EN from '../locales/en-US.json'
import ZH from '../locales/zh-CN.json'


// 本地存储
export const LANG_CACHE_KEY = 'GAME_LANG_KEY'
export const changeLanguage = (lang: LANG) => {
  i18n.changeLanguage(lang, () => {
    window.localStorage.setItem(LANG_CACHE_KEY, lang)
  })
}

// 初始化
export const initI18n = () => {
    return i18n
    .use(initReactI18next)
    .init({
        resources: {
        [LANG.EN]: { translation: EN },
        [LANG.CN]: { translation: ZH },
        },
        fallbackLng: [LANG.CN],
        debug: true,
        react: {
        useSuspense: false,
        },
        detection: {
        order: ['querystring', 'navigator', 'localStorage'],
        lookupQuerystring: 'lang',
        },
    })
}


export default i18n