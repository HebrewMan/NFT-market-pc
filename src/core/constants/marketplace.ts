export const defaultParams = {
  // 初始化参数数据
  // type: 2, // 1 一级市场，2 二级市场
  status: 0, // 0-正在出售；1-已售空；2-已取消
  // belongs: null,
  // sort: null,
  page: 1,
  size: 12,
};
export const blindType = [
  { value: 1, name: '盲盒' },
  { value: 0, name: '非盲盒' },
];
export const queryList = [
  { name: 'Recently listed', value: 'new' },
  { name: 'Price Low to High', value: 'low' },
  { name: 'Price High to Low', value: 'high' },
];
