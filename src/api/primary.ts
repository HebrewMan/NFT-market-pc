import { post } from '../ajax/quest';

export function getPrimaryActivityList(data: any) {
  return post('/v1/api/activity/page', {
    ...data,
  });
}

export function getActivityProduction(id: number, params: any) {
  return post('/v1/api/activity/detail/page', {
    data: {
      id,
    },
    ...params,
  });
}
