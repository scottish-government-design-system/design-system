const path = require('path');

module.exports = (env) => {
  const dest = (env !== undefined)&&(env.mode === 'dev') ? 'dev/scripts': 'dist/scripts';
  
  return {
    mode: (env !== undefined)&&(env.mode === 'dev') ? 'development': 'production',
    entry: {
      'pattern-library.js': [
        path.resolve(__dirname, './src/all.js')
      ]
    },

    output: {
      path: path.resolve(__dirname, dest),
      filename: '[name]'
    },

    module: {
      rules: []
    }
  };
};