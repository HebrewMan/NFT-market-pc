export const defaultParams = {
  // 初始化参数数据
  data: {
    type: 2, // 1 一级市场，2 二级市场
    status: 2, // 已上架
    // belongs: null,
    sort: null,
  },
  page: 1,
  size: 12,
};
export const blindType = [
  { value: 1, name: '盲盒' },
  { value: 0, name: '非盲盒' },
];
