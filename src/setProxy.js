const proxySettings = {
  // 接口代理1
  '/v1/api': {
    // target: 'http://192.168.1.59:4000/',
    target: 'http://nft-pre.diffgalaxy.com/',
    changeOrigin: true,
    secure: false,
  },
  // 接口代理2
  // '/api-2/': {
  //   target: 'http://198.168.111.111:3002',
  //   changeOrigin: true,
  //   pathRewrite: {
  //     '^/api-2': '',
  //   },
  // },
  // .....
};

module.exports = proxySettings;
//
