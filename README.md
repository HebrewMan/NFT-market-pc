# 现在的是 webpack5 + react17 + Typescript 搭建版本

> 分支为 `master`

## ESLint 和 Prettier 的冲突

之前是只下载 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) 这个插件，并在 `.eslintrc.js` 中的配置如下：

```js
{
  extends: [
    // other configs ...
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
    'prettier/unicorn',
  ]
}
```

但根据[官方推荐](https://github.com/prettier/eslint-plugin-prettier#recommended-configuration)配置方法，既需要下载 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) 也需要下载 [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)，然后配置更简洁了：

```js
{
  extends: [
    // other extends ...
    'plugin:prettier/recommended',
  ],
  plugins: [
    // other plugins,
    'prettier'
  ],
}
```

## husky 版本注意

上一个版本使用的是 `husky@4` 版本，这个版本仍然选择使用该版本，`husky@5` 有点问题，不好用。

## 路径定义文件

独立出了一个专门导出路径的文件 `paths.js` ：

```js
const path = require('path');
const fs = require('fs');

// Get the working directory of the file executed by node
const appDirectory = fs.realpathSync(process.cwd());

/**
 * Resolve absolute path from relative path
 * @param {string} relativePath relative path
 */
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

// Default module extension
const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx'];

/**
 * Resolve module path
 * @param {function} resolveFn resolve function
 * @param {string} filePath file path
 */
function resolveModule(resolveFn, filePath) {
  // Check if the file exists
  const extension = moduleFileExtensions.find((ex) => fs.existsSync(resolveFn(`${filePath}.${ex}`)));

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }
  return resolveFn(`${filePath}.ts`); // default is .ts
}

module.exports = {
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appIndex: resolveModule(resolveApp, 'src/index'), // Package entry path
  appHtml: resolveApp('public/index.html'),
  appNodeModules: resolveApp('node_modules'), // node_modules path
  appSrc: resolveApp('src'),
  appSrcComponents: resolveApp('src/components'),
  appSrcUtils: resolveApp('src/utils'),
  appProxySetup: resolveModule(resolveApp, 'src/setProxy'),
  appPackageJson: resolveApp('package.json'),
  appTsConfig: resolveApp('tsconfig.json'),
  moduleFileExtensions,
};
```

## 环境变量文件

之前的环境变量定义在`constants.js` 中，现在独立出了一个文件 `env.js` ：

```js
const isDevelopment = process.env.NODE_ENV !== 'production';
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  isDevelopment,
  isProduction,
};
```

## 一些常用的变量配置文件

类似 `constants.js` 文件，现在更改为了 `conf.js` ，配置有稍许的不同：

```js
const path = require('path');

const PROJECT_PATH = path.resolve(__dirname, '../');
const PROJECT_NAME = path.parse(PROJECT_PATH).name;

// Dev server host and port
const SERVER_HOST = 'localhost';
const SERVER_PORT = 9000;

// Whether to enable bundle package analysis
const shouldOpenAnalyzer = false;
const ANALYZER_HOST = 'localhost';
const ANALYZER_PORT = '8888';

// Resource size limit
const imageInlineSizeLimit = 4 * 1024;

module.exports = {
  PROJECT_PATH,
  PROJECT_NAME,
  SERVER_HOST,
  SERVER_PORT,
  shouldOpenAnalyzer,
  ANALYZER_HOST,
  ANALYZER_PORT,
  imageInlineSizeLimit,
};
```

## 自定义 `webpack-dev-server` 启动服务

这个版本中，我们实现了两个主要功能：

- 自定义控制台输出，更美观、直观。
- 当前端口占用，自动 port + 1 。

这部分实现就是 `scripts/server` 下的文件们实现的。

另外，现在脚本执行命令就可以写为：

```sh
"scripts": {
  "start": "cross-env NODE_ENV=development node scripts/server",
},
```

## devtool 配置变化

为了使用错误日志遮罩插件 [error-overlay-webpack-plugin](https://github.com/smooth-code/error-overlay-webpack-plugin)，开环境下的 devtool 设为了 `cheap-module-source-map`，生产环境下原来是 `'none'`，现在应该改为 `false`。

## postcss 配置变化

如下：

```js
{
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        require('postcss-flexbugs-fixes'),
        isProduction && [
          'postcss-preset-env',
          {
            autoprefixer: {
              grid: true,
              flexbox: 'no-2009',
            },
            stage: 3,
          },
        ],
      ].filter(Boolean),
    },
  },
},
```

## 图片和字体文件处理

之前使用 `file-loader` ，但是 `webpack5` 现在已默认内置资源模块，根据官方配置，现在可以改为以下配置方式，不再需要安装额外插件：

```js
module.exports = {
  output: {
    // ...
    assetModuleFilename: 'images/[name].[contenthash:8].[ext]',
  },
  // other...
  module: {
    rules: [
      // other...
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024,
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2?)$/,
        type: 'asset/resource',
      },
    ]
  },
  plugins: [//...],
}
```

## public 下资源复制问题

之前版本中 `html-webpack-plugin` 这个插件是不会自动打包 `index.hmtl` 文件的，但是这个版本它会在打包的时候（生产环境下会压缩）将 `index.html` 输出到 `build` 中，那我们使用 `copy-webpack-plugin` 插件时，需要将 `index.html` 忽视：

```js
new CopyPlugin({
  patterns: [
    {
      context: paths.appPublic,
      from: '*',
      to: paths.appBuild,
      toType: 'dir',
      globOptions: {
        dot: true,
        gitignore: true,
        ignore: ['**/index.html'],
      },
    },
  ],
}),
```

## 使用默认缓存

之前我们通过使用插件 `hard-source-webpack-plugin` 实现缓存，大大加快二次编译速度，但是我实际在使用过程中，该插件还是会造成一些问题，控制台一堆报红。

万幸的是 `webpack5` 现在默认支持缓存，我们只需要以下配置即可：

```js
module.exports = {
  //...
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  //...
};
```

## css 代码压缩

之前使用的是 `optimize-css-assets-webpack-plugin` 来对 css 文件进行压缩，现在推荐使用 [css-minimizer-webpack-plugin](https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/#root)。

</details>

<hr>
# 其它实用插件

一. 如果你要开启 css module，想要通过 `className={styles['xxxxx]}` 能得到提示（比如 `xxxxx`），那你可能需要这个插件：[typescript-plugin-css-modules](https://github.com/mrmckeb/typescript-plugin-css-modules)。

使用该插件时，`.vscode/settings.json` 中必须有以下配置：

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

然后 `tsconfig.json` 中添加以下配置：

```json
"jsx": "react",
"plugins": [{ "name": "typescript-plugin-css-modules" }]
```
