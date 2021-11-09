const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = (env) => {
  const dest = (env !== undefined)&&(env.mode === 'dev') ? 'dev/assets': 'dist';
  const copySrc = []; 
  const wpPlugins = [];

  if ((env !== undefined) && (env.mode === 'dev')) {
    copySrc.push({ from: path.resolve(__dirname, './node_modules/svgxuse/svgxuse.min.js'), to: path.resolve(__dirname, './'+dest+'/scripts//') });
    copySrc.push({ from: path.resolve(__dirname, './src/images/placeholders/'), to: path.resolve(__dirname, './'+dest+'/images/placeholders/') });
  }

  if (copySrc.length) {
    wpPlugins.push(
      // Copy static assets from source to specified environment
      new CopyPlugin({
        patterns: copySrc,
      })
    )
  }

  return {
    mode: (env !== undefined)&&(env.mode === 'dev') ? 'development': 'production',
    entry: {
      'pattern-library.js': [
        path.resolve(__dirname, './src/all.js')
      ]
    },

    output: {
      path: path.resolve(__dirname, dest+'/scripts'),
      filename: '[name]'
    },

    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        }
      ]
    },
    plugins: wpPlugins,
    devtool: (env !== undefined)&&(env.mode === 'dev') ? 'eval-source-map': ''
  

  };
};