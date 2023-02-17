import { post,get } from '../ajax/quest';

export function getPrimaryActivityList(data: any) {
  return post('/v1/api/activity/page', {
    ...data,
  });
}

// 活动详情
export function getPrimaryActivityDetail(id:string) {
  return get(`/v1/api/activity/detail/${id}`);
}

export function getActivityProduction(id: number, params: any) {
  return post('/v1/api/activity/detail/page', {
    data: {
      id,
    },
    ...params,
  });
}
