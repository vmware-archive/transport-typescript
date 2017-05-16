/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

var gulp = require('gulp-help')(require('gulp'));
var tslint = require('gulp-tslint');
var typescriptCompile = require('./../compile-ts');
var runSequence = require('run-sequence');
var absoluteRequires = require("../absolute-requires");
var renameFolder = require("../rename-folder");

/**
 * bifröst sources.
 */
var bifrostSources = [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.mock.ts'
];

gulp.task('typescript:bifrost', function () {
    return typescriptCompile(bifrostSources, {
        inlineTemplates: true
    })
    .pipe(gulp.dest("dist"));
});

/**
 * Tests
 */
var testsSources = ['src/**/*.spec.ts', 'src/**/*.mock.ts'];

gulp.task('typescript:tests', function () {
    return typescriptCompile(testsSources, {
        inlineTemplates: false,
        internal: true
    })
    .pipe(absoluteRequires({
        pattern: /\.\.?\/.*(mock|spec)/,
        rename: {
            "vmw-bifrost": "tests"
        }
    }))
    // The requires remaining are all actual bifröst classes
    .pipe(absoluteRequires({}))
    .pipe(gulp.dest("dist/tests"));
});




gulp.task('typescript', function (callback) {
    return runSequence(
        'tslint',
        ['typescript:bifrost', 'typescript:tests'],
        callback
    );
});

