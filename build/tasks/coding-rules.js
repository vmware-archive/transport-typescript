/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

var gulp = require('gulp-help')(require('gulp'));
var tslint = require('gulp-tslint');
var format = require('gulp-clang-format');
var clangFormat = require('clang-format');

var bifrostSources = [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.mock.ts'
];

gulp.task('tslint:bifrost', function(){
    return gulp.src(bifrostSources)
        .pipe(tslint({
            configuration: 'build/tslint.json'
        }))
        .pipe(tslint.report('verbose'));
});

gulp.task('tslint:bifrost:no-error', function(){
    return gulp.src(bifrostSources)
        .pipe(tslint({
            configuration: 'build/tslint.json'
        }))
        .pipe(tslint.report('verbose', {
            emitError: false
        }));
});

var testsSources = ['src/**/*.spec.ts', 'src/**/*.mock.ts'];

gulp.task('tslint:tests', function(){
    return gulp.src(testsSources)
        .pipe(tslint({
            configuration: 'build/tslint.json'
        }))
        .pipe(tslint.report('verbose'));
});

gulp.task('tslint:tests:no-error', function(){
    return gulp.src(testsSources)
        .pipe(tslint({
            configuration: 'build/tslint.json'
        }))
        .pipe(tslint.report('verbose', {
            emitError: false
        }));
});


gulp.task("tslint", ["tslint:bifrost", "tslint:tests"], function(){});

/**
 Warns if the typescript formatting is valid or not
 */
gulp.task('check-format', function() {
    return gulp.src('src/**/*.ts')
        .pipe(format.checkFormat('file', clangFormat));
});

/**
 Formats the typescript file according to the .clang-format file
 */
gulp.task('format', function() {
    return gulp.src('src/**/*.ts')
        .pipe(format.format('file', clangFormat))
        .pipe(gulp.dest('formatted'));
});
