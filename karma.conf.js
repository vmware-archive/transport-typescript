/*
 * Copyright 2017-2020 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * test by redt
 */

module.exports = function (config) {
    config.set({
        basePath: './',
        frameworks: ['jasmine', 'karma-typescript'],
        files: [
            {pattern: "src/**/*.ts"}
        ],
        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },
        reporters: ["kjhtml", "spec", "karma-typescript"],
        exclude: [
            'node_modules/**/*spec.js',
            'node_modules/**/*.d.ts',
            'proxyTestApp/**/*.ts',
            'chatClientApp/**/*.ts'
        ],
        client: {
            clearContext: false, // leave Jasmine Spec Runner output visible in browser
            jasmine: {
                random: false
            }
        },
        specReporter: {
            suppressSkipped: true
        },
        plugins: [
            require('karma-jasmine'),
            require('karma-spec-reporter'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('karma-typescript'),
            require('karma-chrome-launcher'),
            //require('karma-remap-istanbul')
        ],
        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.json", // this will get rid of all compiler error messages
            compilerOptions: {
                module: 'commonjs'
            },
            reports: {
                "text-summary": "",
                "html": "coverage/",
                "cobertura": {
                    "directory": "coverage",
                    "subdirectory": "cobertura",
                    "filename": "coverage.xml"
                }
            },
            exclude: ['proxyTestApp/**/*.ts','chatClientApp/**/*.ts', './node_modules/**/*.d.ts']
        },
        customLaunchers: {
            ChromeDocker: {
                base: 'ChromeHeadless',
                flags: [
                    '--no-sandbox',
                ],
                debug: false
            }
        },

        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG

        logLevel: config.LOG_INFO,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['ChromeDocker'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        browserNoActivityTimeout: 10000
    });
};

