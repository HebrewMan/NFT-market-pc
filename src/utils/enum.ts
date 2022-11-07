/*
 * @Author: kiki.zeng
 * @Date: 2022-11-4 17:30
 * @Description: 定义一些全局枚举值
 */
// 多语言相关
export enum LANG {
  EN = 'en-US',
  JP = 'ja-JP',
  CN = 'zh-CN',
}
export const LanguageNames = {
  [LANG.EN]: 'English',
  [LANG.CN]: '简体中文',
  [LANG.JP]: '日本語',
}