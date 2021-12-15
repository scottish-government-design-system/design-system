const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = (env, argv = {}) => {
  const dest = argv.mode === 'development' ? 'dev/assets' : 'dist';
  const copySrc = [];

  const baseConfig = {
    entry: {
      'pattern-library': path.resolve(__dirname, './src/all.js')
    },
    output: {
      path: path.resolve(__dirname, dest + '/scripts'),
      filename: '[name].js'
    },
    plugins: [],
    devtool: argv.mode === 'development' ? 'eval-source-map' : '',
    module: {
      rules: []
    }
  };

  if (argv.mode === 'development') {
    copySrc.push({ from: path.resolve(__dirname, './node_modules/svgxuse/svgxuse.min.js'), to: path.resolve(__dirname, `./${dest}/scripts/`) });
    copySrc.push({ from: path.resolve(__dirname, './fractal/images/'), to: path.resolve(__dirname, `./${dest}/images/`) });
  }

  if (copySrc.length) {
    baseConfig.plugins.push(
      // Copy static assets from source to specified environment
      new CopyPlugin({
        patterns: copySrc,
      })
    );
  }

  return [
    // first output: for modern browsers
    baseConfig,

    // second output: for ES5 browsers
    Object.assign(baseConfig, {
      output: {
        path: path.resolve(__dirname, dest + '/scripts'),
        filename: '[name].es5.js'
      },
      module: {
        rules: baseConfig.module.rules.concat([{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        }])
      }
    })
  ];
};
