// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
          browsers: [
            "last 5 versions",
            "ie >= 11"
          ]
        },
      },
    ],
  ],
};
