const path = require('path');

module.exports = {
  mode: 'development',

  entry: {
    'pattern-library.js': [
      path.resolve(__dirname, './src/scss/components/accordion/accordion.js'),
      path.resolve(__dirname, './src/scss/components/notification-banner/notification-banner.js'),
      path.resolve(__dirname, './src/scss/components/side-navigation/side-navigation.js'),
      path.resolve(__dirname, './src/scss/components/site-navigation/site-navigation.js'),
      path.resolve(__dirname, './src/scss/components/site-search/site-search.js')
    ]
  },

  output: {
    path: path.resolve(__dirname, 'dist/scripts'),
    filename: '[name]'
  }
};
