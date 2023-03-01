import { post } from '../ajax/quest';

// export function buyBlindBox(params: any) {
//   return post(`/hermes/api/v1/box/buy`, params);
// }

export function openBlindBox(params: any) {
  return post(`/hermes/api/v1/box/open`, params);
}
