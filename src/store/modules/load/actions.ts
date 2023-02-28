import * as types from 'Src/store/mutation-types';

export const openLoading = () => ({
  type: types.OPEN_LOADING,
});

export const closeLoading = () => ({
  type: types.CLOSE_LOADING,
});
