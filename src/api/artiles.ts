import { get, post } from '../ajax/quest';

// 获取分类
export function getAllCategories(params: any) {
  return post(`/v1/api/articles/category/page`, {
    data: { ...params },
    page: 1,
    size: 10,
  });
}

// 获取分类下的文章
export function getArticlesByCategories(data: any) {
  return post(`/v1/api/articles/page`, {
    data: {
      ...data,
    },
    page: 1,
    size: 10,
  });
}

// 获取文章详情
export function getInfoById(id: string) {
  return get(`/v1/api/articles/${id}`);
}
