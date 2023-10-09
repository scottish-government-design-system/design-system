const path = require('path');
const v8 = require('v8');

const structuredClone = obj => {
  return v8.deserialize(v8.serialize(obj));
};

module.exports = () => {
  const dest = 'dist';

  const baseConfig = {
    mode: 'production',
    entry: {
      'design-system': path.resolve(__dirname, './src/all.js')
    },
    output: {
      path: path.resolve(__dirname, dest + '/scripts'),
      filename: '[name].js'
    },
    plugins: [],
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
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }])
    }
  });

  return [
    // first output: for modern browsers
    configModern,

    // second output: for ES5 browsers
    configES5
  ];
};
