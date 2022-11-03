import { OPENLOADINGS, CLOSELOADINGS, OPENLOADING, CLOSELOADING } from "./actionsType"

export interface openLoadings {
  type: OPENLOADINGS
}
export interface closeLoadings {
  type: CLOSELOADINGS
}

export type LoadingAction = openLoadings | closeLoadings
// export const openLoading = () => ({
//   type: OPENLOADING,
// });

// export const closeLoading = () => ({
//   type: CLOSELOADING,
// });

export function openLoading(): openLoadings {
  return {
    type: OPENLOADING,
  }
}

export function closeLoading(): closeLoadings {
  return {
    type: CLOSELOADING,
  }
}
