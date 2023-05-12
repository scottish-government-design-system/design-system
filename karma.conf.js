'use strict';

const webpackConfig = require('./webpack.config');
const coverageDir = 'test/coverage';

const instrumentationConfig = {
    test: /\.js/,
    exclude: /node_modules|\.test\.js$/,
    enforce: 'post',
    use: {
        loader: '@jsdevtools/coverage-istanbul-loader',
        options: {
            esModules: true
        }
    }
};

const testWebpackConfig = webpackConfig()[0];
testWebpackConfig.mode = 'production';
testWebpackConfig.module.rules.push(instrumentationConfig);
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
        autoWatch: true,
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

        webpack: testWebpackConfig
    });
};
