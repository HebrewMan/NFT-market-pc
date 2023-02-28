/* themeConfigProp */
export interface ThemeConfigProp {
  primary: string;
}

/* GlobalState */
export interface GlobalState {
  token: string;
  wallet: string;
  userInfo: any;
  language: string;
  connectMoadl:boolean
}

/* 搜索 */
export interface MenuState {
  openMenu: boolean;
  openSubMenu: boolean;
  keyword: string;
  showSearchNav: boolean;
  showSearchResult: boolean;
}

/* AuthState */
export interface AuthState {
  authButtons: {
    [propName: string]: any;
  };
  authRouter: string[];
}

// loading
export interface LoadState {
  loading: boolean;
}
