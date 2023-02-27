import * as types from 'Src/store/mutation-types';
import { AnyAction } from 'redux';
import produce from 'immer';
import { LoadState } from 'Src/store/interface/index';

const defaultStatus = {
  loading: false,
};

const load = (state: LoadState = defaultStatus, action: AnyAction): LoadState =>
  produce(state, (draftState) => {
    switch (action.type) {
      case types.OPEN_LOADING:
        draftState.loading = true;
        break;
      case types.CLOSE_LOADING:
        draftState.loading = false;
        break;
      default:
        return draftState;
    }
  });

export default load;
