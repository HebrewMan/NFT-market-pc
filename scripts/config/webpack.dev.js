const Webpack = require('webpack');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const paths = require('../paths');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  target: 'web',
  output: {
    filename: 'js/[name].js',
    path: paths.appHtml,
  },
  devServer: {
    compress: true,
    stats: 'errors-only',
    clientLogLevel: 'silent',
    open: true,
    hot: true,
    noInfo: true,
    proxy: {
      ...require(paths.appProxySetup),
    },
  },
  plugins: [new Webpack.HotModuleReplacementPlugin(), new ErrorOverlayPlugin()],
  optimization: {
    minimize: false,
    // minimizer: [   
    //   new TerserPlugin({
    //     terserOptions: {
    //       compress: {
    //         drop_console: false,
    //         drop_debugger: false,

    //       }
    //     }
    //   })
    // ],
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      
    },
  },
});
