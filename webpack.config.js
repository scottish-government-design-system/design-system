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
      'pattern-library': path.resolve(__dirname, './src/all.ts')
    },
    output: {
      path: path.resolve(__dirname, dest + '/scripts'),
      filename: '[name].js'
    },
    plugins: [],
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        // All files with a '.ts' or '.tsx' extension will be handled by 'babel-loader'.
        { test: /\.tsx?$/, loader: "babel-loader" },
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        { test: /\.js$/, loader: "source-map-loader" },
      ]
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

  return [
    // first output: for modern browsers
    configModern,

    // second output: for ES5 browsers
    configES5
  ];
};
