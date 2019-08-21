/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

var gulp = require('gulp-help')(require('gulp'));
var path = require("path");
var Server = require('karma').Server;
var configFile = path.resolve('karma.conf.js');
var configFileDebug = path.resolve('karma.conf-debug.js');

gulp.task('karma', function (done) {
    new Server({
        configFile: configFile,
        reporters: ["kjhtml", "spec", "karma-typescript"],
    }, function(errCode) {
        done(errCode);
    }).start();
});

gulp.task('karma:debug', function (done) {
    new Server({
        configFile: configFileDebug,
        reporters: ['spec']
    }, function(errCode) {
        // Ignore possible errors, the log should be enough when using :verbose
        done(errCode);
    }).start();
});
