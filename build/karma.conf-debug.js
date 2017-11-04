/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

const isDocker = require('is-docker')();

module.exports = function (config) {

    var node_modules = "node_modules/";
    var dist = "dist/";
    var src = "src/";

    config.set({
        basePath: '../',

        frameworks: ['jasmine'],

        files: [
            // Polyfills for older browsers
            'node_modules/core-js/client/shim.min.js',

            // System.js for module loading
            'node_modules/systemjs/dist/system-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',

            // Reflect and Zone.js
            'node_modules/reflect-metadata/Reflect.js',
            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/long-stack-trace-zone.js',
            'node_modules/zone.js/dist/proxy.js',
            'node_modules/zone.js/dist/sync-test.js',
            'node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js',

            // RxJs.
            {pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false},
            {pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false},

            // Angular 2 itself and the testing library
            {pattern: 'node_modules/@angular/**/*.js', included: false, watched: false},
            {pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false},

            {pattern: 'build/karma-test-shim.js', included: true, watched: false},

            {pattern: dist + '**/*.js', included: false, watched: true},

            // Paths to support debugging with source maps in dev tools
            {pattern: src + '**/*.ts', included: false, watched: true},
            {pattern: dist + '**/*.js.map', included: false, watched: true},

        ],

        exclude: ['node_modules/**/*spec.js'],
        preprocessors: {
            'dist/**/!(*spec||*mock).js': ['coverage']
        },
        reporters: ['spec'],

        plugins: [
            require('karma-jasmine'),
            require('karma-spec-reporter'),
            require('karma-coverage'),
            require('karma-chrome-launcher'),
            require('karma-remap-istanbul')
        ],

        customLaunchers: {
            ChromeDebug: {
                base: 'Chrome',
                flags: [
                    '--remote-debugging-port=9222',
                ],
                debug: true
            }
        },
        coverageReporter: {
            dir: 'reports/coverage/',
            reporters: [
                {type: 'text-summary'}
            ]
        },

        remapIstanbulReporter: {
            reports: {
                lcovonly: 'coverage/lcov.info',
                html:
                    'coverage/report'
            }
        },

        port: 9876,
        colors:
            true,
        logLevel:
        config.LOG_INFO,
        autoWatch:
            true,
        browsers:
            ['ChromeDebug'],
        singleRun:
            false
    });
};
