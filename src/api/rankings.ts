import { post } from '../ajax/quest';

export function getRankingsList(data: any) {
  return post('/v1/api/collections/collectionCount', {
    ...data,
  });
}
