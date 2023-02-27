import { AnyAction } from 'redux';
import { GlobalState } from 'Src/store/interface';
import produce from 'immer';
import * as types from 'Src/store/mutation-types';

const globalState: GlobalState = {
  token: '232323',
  wallet: '', // 钱包地址
  userInfo: '',
  language: '',
  connectMoadl:false,
};

// global reducer
const global = (state: GlobalState = globalState, action: AnyAction) =>
  produce(state, (draftState) => {
    switch (action.type) {
      case types.SET_TOKEN:
        draftState.token = action.token;
        break;
      case types.SET_WALLET:
        draftState.wallet = action.wallet;
        break;
      case types.SET_LANGUAGE:
        draftState.language = action.language;
        break;
      case types.SET_CONNECTMODAL:
        draftState.connectMoadl = action.connectMoadl;
        break;
      default:
        return draftState;
    }
  });

export default global;
