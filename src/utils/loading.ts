import { openLoading, closeLoading } from 'Src/store/modules/load/actions';
import { store } from 'Src/store'
const instanceLoading = {
  service: () => {
    store.dispatch(openLoading());
  },
  close: () => {
    store.dispatch(closeLoading());
  },
};
export default instanceLoading;
