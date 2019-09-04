const path = require('path');

module.exports = {
  mode: 'development',

  entry: {
    'pattern-library.js': [
      path.resolve(__dirname, 'src/scripts/accordion.js'),
      path.resolve(__dirname, 'src/scripts/notification-banner.js'),
      path.resolve(__dirname, 'src/scripts/side-navigation.js'),
      path.resolve(__dirname, 'src/scripts/site-navigation.js'),
      path.resolve(__dirname, 'src/scripts/site-search.js')
    ]
  },

  output: {
    path: path.resolve(__dirname, 'dist/scripts'),
    filename: '[name]'
  }
};
