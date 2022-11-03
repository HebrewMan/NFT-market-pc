import { get, post } from '../ajax/quest';

// 首页展示的推荐合集
export function getRecommendCollection(params: any) {
  return post('/v1/api/collections/recommend', params);
}

// 根据id查询合集详情
export function getCollectionDetails(id: string | number) {
  return get(`/v1/api/collections/${id}`);
}
