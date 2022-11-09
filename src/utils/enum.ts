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
  [Language.zh]: '中文简体',
  [Language.tw]: '中文繁體',
  [Language.en]: 'English',
  [Language.jp]: '日本語',
  [Language.tk]: 'T ürkiye dili',
};

export const LanguageNamesMobile = {
  [Language.en]: 'en',
  [Language.zh]: 'zh',
  [Language.tw]: 'tw',
  [Language.jp]: 'jp',
  [Language.tk]: 'tk',
};
