import { openLoading, closeLoading } from '../store/actions';
import store from '../store/store';
const instanceLoading = {
  service: () => {
    store.dispatch(openLoading());
  },
  close: () => {
    store.dispatch(closeLoading());
  },
};
export default instanceLoading;
