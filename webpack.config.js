const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const isDevEnv = function (env) {
  return (env !== undefined) && (env.mode === 'dev');
};

module.exports = (env) => {
  const dest = isDevEnv(env) ? 'dev/assets' : 'dist';
  const copySrc = [];

  const baseConfig = {
    mode: isDevEnv(env) ? 'development' : 'production',
    entry: {
      'pattern-library': path.resolve(__dirname, './src/all.js')
    },
    output: {
      path: path.resolve(__dirname, dest + '/scripts'),
      filename: '[name].js'
    },
    plugins: [],
    devtool: isDevEnv(env) ? 'eval-source-map' : '',
    module: {
      rules: []
    }
  };

  if (isDevEnv(env)) {
    copySrc.push({ from: path.resolve(__dirname, './node_modules/svgxuse/svgxuse.min.js'), to: path.resolve(__dirname, `./${dest}/scripts/`) });
    copySrc.push({ from: path.resolve(__dirname, './fractal/images/'), to: path.resolve(__dirname, `./${dest}/images/`) });
    copySrc.push({ from: path.resolve(__dirname, './dist/images/'), to: path.resolve(__dirname, `./${dest}/images/`) });
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
    {
      ...baseConfig,
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
    }
  ];
};
