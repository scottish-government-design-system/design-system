const path = require('path');

module.exports = {
  mode: 'development',

  entry: {
    'pattern-library.js': [
      path.resolve(__dirname, './src/all.js')
    ]
  },

  output: {
    path: path.resolve(__dirname, 'dist/scripts'),
    filename: '[name]'
  },

  module: {
    rules: []
  }
};
