import { get, post } from '../ajax/quest';

// 首页展示的推荐合集
export function getRecommendCollection(params: any) {
  return post('/v1/api/collections/recommend', params);
}

// 根据id查询合集详情
export function getCollectionDetails(id: string | number) {
  return get(`/v1/api/collections/${id}`);
}

// 获取我集合列表和收益总和
export function getMyGatherList() {
  return get(`/v1/api/collections/listAndSummary`);
}

// 更新编辑集合
export function EditMyGatherList() {
  return get(`/v1/api/collections/update`);
}

// 