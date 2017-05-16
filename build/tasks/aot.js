/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

var gulp = require('gulp-help')(require('gulp'));
var runSequence = require('run-sequence');
var del = require("del");
var os = require('os');

gulp.task("aot:copy", function() {
    var bifrostSources = [
        'src/**/*.ts',
        'src/**/*.html',
        '!src/**/*.spec.ts',
        '!src/**/*.mock.ts'
    ];

    gulp.src(bifrostSources)
        .pipe(gulp.dest("tmp"));
});


gulp.task('aot:build', function (cb) {
    var exec = require('child_process').exec;

    var cmd = os.platform() === 'win32' ?
        'node_modules\\.bin\\ngc' : './node_modules/.bin/ngc';

    cmd += ' -p tsconfig.es2015.json'; // use config for aot to compile

    exec(cmd, function (err, stdout, stderr) {
        if (stdout !== '') {
            console.log(stdout);
        }

        if (stderr !== '') {
            console.log(stderr);
        }

        cb(err);
    });
});

gulp.task("aot:umd:all", function(cb){
    var exec = require('child_process').exec;

    var cmd = os.platform() === 'win32' ?
        'node_modules\\.bin\\rollup' : './node_modules/.bin/rollup';

    cmd += ' -c build/rollup-all.config.js'; // use config for rollup

    exec(cmd, function (err, stdout, stderr) {
        if (stdout !== '') {
            console.log(stdout);
        }

        if (stderr !== '') {
            console.log(stderr);
        }

        cb(err);
    });
});

gulp.task("aot:umd:bus", function(cb){
    var exec = require('child_process').exec;

    var cmd = os.platform() === 'win32' ?
        'node_modules\\.bin\\rollup' : './node_modules/.bin/rollup';

    cmd += ' -c build/rollup-bus.config.js'; // use config for rollup

    exec(cmd, function (err, stdout, stderr) {
        if (stdout !== '') {
            console.log(stdout);
        }

        if (stderr !== '') {
            console.log(stderr);
        }

        cb(err);
    });
});

gulp.task("aot:umd:bridge", function(cb){
    var exec = require('child_process').exec;

    var cmd = os.platform() === 'win32' ?
        'node_modules\\.bin\\rollup' : './node_modules/.bin/rollup';

    cmd += ' -c build/rollup-bridge.config.js'; // use config for rollup

    exec(cmd, function (err, stdout, stderr) {
        if (stdout !== '') {
            console.log(stdout);
        }

        if (stderr !== '') {
            console.log(stderr);
        }

        cb(err);
    });
});

gulp.task("aot", function(callback){
    return runSequence(
        'aot:copy',
        'aot:build',
        'aot:umd:bus',
        'aot:umd:bridge',
        'aot:umd:all',
        callback
    );
});
