import { OPENLOADING, CLOSELOADING } from './actionsType';
import { LoadingAction } from './actions';
export interface StoreState {
  loading: boolean;
}
const defaultStatus = {
  loading: false,
};

export function actionReducer(
  state: StoreState = defaultStatus,
  action: LoadingAction,
): StoreState {
  const newState = { ...state };
  switch (action.type) {
    case OPENLOADING:
      newState.loading = true;
      return newState;
    case CLOSELOADING:
      newState.loading = false;
      return newState;
    default:
      return state;
  }
}
