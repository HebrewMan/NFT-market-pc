/*
 * @Author: kiki.zeng
 * @Date: 2022-11-4 17:30
 * @Description: 定义一些全局枚举值
 */
// 多语言相关
export enum Language {
  en = 'en-US',
  zh = 'zh-CN',
  tw = 'zh-TW',
  jp = 'zh-JP',
  tk = 'tr-TK',
}

export const LanguageNames = {
  [Language.en]: 'English',
  [Language.zh]: '简体中文',
  [Language.tw]: '繁體中文',
  [Language.jp]: '日本語',
  [Language.tk]: 'Türkçe, Türk dil',
};

export const LanguageNamesMobile = {
  [Language.en]: 'EN',
  [Language.zh]: 'CN',
  [Language.tw]: 'TW',
  [Language.jp]: 'JP',
  [Language.tk]: 'TK',
};
