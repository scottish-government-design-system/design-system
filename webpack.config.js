const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const v8 = require('v8');

const structuredClone = obj => {
  return v8.deserialize(v8.serialize(obj));
};

module.exports = (env, argv = {}) => {
  const dest = argv.mode === 'development' ? 'dev/assets' : 'dist';
  const copySrc = [];

  if (argv.mode === 'development') {
    copySrc.push({ from: path.resolve(__dirname, './node_modules/svgxuse/svgxuse.min.js'), to: path.resolve(__dirname, `./${dest}/scripts/`) });
    copySrc.push({ from: path.resolve(__dirname, './fractal/images/'), to: path.resolve(__dirname, `./${dest}/images/`) });
  }

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

  const configModern = structuredClone(baseConfig);
  const configES5 = Object.assign(structuredClone(baseConfig), {
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
  });

  if (copySrc.length) {
    // Copy static assets from source to specified environment
    configModern.plugins.push(
      new CopyPlugin({
        patterns: copySrc,
      })
    );

    configES5.plugins.push(
      new CopyPlugin({
        patterns: copySrc,
      })
    );
  }

  return [
    // first output: for modern browsers
    configModern,

    // second output: for ES5 browsers
    configES5
  ];
};
