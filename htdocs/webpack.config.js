const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

// 엔트리 포인트를 동적으로 생성하는 함수
function getEntries() {
  const entries = glob.sync('./a_sys_mng/JS/*.js').reduce((acc, file) => {
    const name = path.basename(file, path.extname(file));
    acc[name] = [path.resolve(__dirname, file), 'webpack-hot-middleware/client'];
    return acc;
  }, {});
  return entries;
}

module.exports = (env, argv) => {
  return {
    mode: 'development',
    entry: getEntries(),
    output: {
      path: path.resolve(__dirname, 'a_sys_mng/JS'),
      filename: '[name].bundle.js',
      publicPath: '/a_sys_mng/JS/',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      function () {
        this.hooks.done.tap('DonePlugin', (stats) => {
          console.log('Webpack build finished.');
          if (stats.hasErrors()) {
            console.error('Build errors:', stats.compilation.errors);
          }
        });
      },
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'a_sys_mng'),
        publicPath: '/a_sys_mng',
      },
      compress: true,
      port: 9000,
      devMiddleware: {
        publicPath: '/a_sys_mng/JS/',
      },
      hot: true,
      proxy: [
        {
          context: ['/api'],
          target: 'http://localhost:3000',
          secure: false,
        },
      ],
    },
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000,
    },
    performance: {
      hints: false,
    },
  };
};
