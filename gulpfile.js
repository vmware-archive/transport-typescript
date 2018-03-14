/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

var gulp = require('gulp-help')(require('gulp'));
var env = require('gulp-env');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');
var util = require('gulp-util');
var webpack_stream = require('webpack-stream');
var webpack_config = require('./webpack.config.js');

requireDir('./build/tasks', { recurse: true });

gulp.task('build', function (callback) {
    return runSequence(
        'clean',
        ['typescript'],
        callback
    );
});

gulp.task("test", function (callback) {
    return runSequence(
        'clean',
        'karma',
        callback
    );
});

gulp.task("test:debug", function (callback) {
    return runSequence(
        'clean',
        'karma:debug',
        callback
    );
});

gulp.task("npm:prepare", function (callback) {
    env.set({ NODE_ENV: "prod" }); // The build is in production mode
    return runSequence(
        'build',
        'webpack',
        'npm:publish',
        callback
    );
});

gulp.task('webpack', function () {
    var bifrostSources = [
        'dist/**/*.js',
        'dist/**/*.ts',
        'dist/**/*.js.map',
        '!src/**/*.spec.ts',
        '!src/**/*.mock.ts'
    ];
    gulp.src(bifrostSources)
        .pipe(gulp.dest("tmp"));

    return webpack_stream(webpack_config)
        .pipe(gulp.dest('./dist'));
});