module.exports = {
  presets: [
    // [
    //   '@babel/preset-env',
    //   {
    //     modules: false,
    //   },
    // ],
    '@babel/preset-env',
    // '@babel/preset-react',
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: {
          version: 3,
          proposals: true,
        },
      },
    ],
  ],
};
