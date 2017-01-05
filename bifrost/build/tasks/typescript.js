/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var gulp = require('gulp');
var tslint = require('gulp-tslint');
var typescriptCompile = require('./../compile-ts');
var runSequence = require('run-sequence');
var absoluteRequires = require("../absolute-requires");
var renameFolder = require("../rename-folder");

/**
 * bifröst sources.
 */
var bifrostSources = [
    'src/bifrost/**/*.ts',
    '!src/bifrost/**/*.spec.ts',
    '!src/bifrost/**/*.mock.ts'
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
var testsSources = ['src/bifrost/**/*.spec.ts', 'src/bifrost/**/*.mock.ts'];

gulp.task('typescript:tests', function () {
    return typescriptCompile(testsSources, {
        inlineTemplates: false,
        internal: true
    })
    .pipe(absoluteRequires({
        pattern: /\.\.?\/.*(mock|spec)/,
        rename: {
            "bifrost": "tests"
        }
    }))
    // The requires remaining are all actual clarity classes
    .pipe(absoluteRequires({}))
    .pipe(renameFolder({"bifrost": "tests"}))
    .pipe(gulp.dest("dist"));
});




gulp.task('typescript', function (callback) {
    return runSequence(
        'tslint',
        ['typescript:bifrost', 'typescript:tests'],
        callback
    );
});

