'use strict';

const path = require('path');
const webpackConfig = require('./webpack.config');
const coverageDir = 'test/coverage';

const instrumentationConfig = {
    test: /\.js/,
    exclude: /node_modules|\.test\.js$/,
    enforce: 'post',
    use: {
        loader: 'istanbul-instrumenter-loader',
        options: {
            esModules: true
        }
    }
};

webpackConfig.mode = 'development';
webpackConfig.module.rules.push(instrumentationConfig);

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: [
            'jasmine-jquery',
            'jasmine'
        ],
        reporters: [
            'dots',
            'coverage-istanbul'
        ],
        port: 9876,
        colors: true,
        logLevel: config.LOG_ERROR,
        autoWatch: true,
        browsers: ['ChromeHeadless'],
        singleRun: true,

        files: [
            'src/**/!(.test).js',
            // 'src/components/**/*.test.js',
            'src/**/*.html',
        ],

        exclude: [
            'src/*.js'
        ],

        preprocessors: {
            'src/**/!(.test).js': ['babel', 'webpack'],
            'src/**/**.test.js': ['webpack']
        },

        coverageIstanbulReporter: {
            reports: [ 'html', 'text-summary', 'lcov', 'json' ],
            dir: coverageDir,
            fixWebpackSourcePaths: true,
            'report-config': {
                html: { outdir: 'html' },
            }
        },

        webpack: webpackConfig
    });
};
