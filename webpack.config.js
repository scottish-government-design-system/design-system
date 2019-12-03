const path = require('path');

module.exports = {
  mode: 'development',

  entry: {
    'pattern-library.js': [
      // path.resolve(__dirname, './src/components/accordion/accordion.js'),
      // path.resolve(__dirname, './src/components/notification-banner/notification-banner.js'),
      // path.resolve(__dirname, './src/components/side-navigation/side-navigation.js'),
      // path.resolve(__dirname, './src/components/site-navigation/site-navigation.js'),
      // path.resolve(__dirname, './src/components/site-search/site-search.js')
      path.resolve(__dirname, './src/all.js')
    ]
  },

  output: {
    path: path.resolve(__dirname, 'dist/scripts'),
    filename: '[name]'
  }
};
