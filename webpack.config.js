const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = (env) => {
  const dest = (env !== undefined)&&(env.mode === 'dev') ? 'dev': 'dist';
  
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
      rules: []
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: path.resolve(__dirname, './src/images/placeholders/'), to: path.resolve(__dirname, './'+dest+'/images/placeholders/') },
        ],
      }),
    ]
  

  };
};