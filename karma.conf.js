'use strict';

const webpackConfig = require('./webpack.config');
const coverageDir = 'test/coverage';

const testWebpackConfig = webpackConfig()[0];
testWebpackConfig.mode = 'production';
delete testWebpackConfig.entry;
delete testWebpackConfig.output;

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: [
            'jasmine-jquery',
            'jasmine',
            'viewport',
            'webpack'
        ],
        reporters: [
            'dots',
            'coverage-istanbul'
        ],
        port: 9876,
        colors: true,
        logLevel: config.LOG_ERROR,
        autoWatch: false,
        browsers: ['ChromeHeadless'],
        singleRun: true,

        files: [
            'src/**/!(.test).js',
            'src/**/*.html',
        ],

        exclude: [
            'src/all.js'
        ],

        preprocessors: {
            'src/**/!(.test).js': ['webpack'],
            'src/**/**.test.js': ['webpack']
        },

        coverageIstanbulReporter: {
            reports: [ 'html', 'text-summary', 'lcov', 'json' ],
            dir: coverageDir,
            fixWebpackSourcePaths: true,
            'report-config': {
                html: { outdir: 'html' },
            },
            thresholds: {
                global: {
                    statements: 80,
                    lines: 80,
                    branches: 90,
                    functions: 80
                },
            }
        },

        webpack: testWebpackConfig
    });
};
