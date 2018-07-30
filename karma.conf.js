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
        reporters: ["spec", "karma-typescript"],
        exclude: [
            'node_modules/**/*spec.js',
            'proxyTestApp/**/*.ts'
            //'src/ng/bifrost.module.ts'
        ],
        plugins: [
            require('karma-jasmine'),
            require('karma-spec-reporter'),
            require('karma-coverage'),
            require('karma-typescript'),
            require('karma-chrome-launcher'),
            //require('karma-remap-istanbul')
        ],
        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.json", // this will get rid of all compiler error messages
            reports: {
                "text-summary": "",
                "html": "coverage/"
            },
            exclude: ['proxyTestApp/**/*.ts']
        },

        customLaunchers: {
            ChromeHeadless: {
                base: 'Chrome',
                flags: [
                    '--headless',
                    '--disable-gpu',
                    '--remote-debugging-port=9222',
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
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
        browsers: ['ChromeHeadless'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};
  