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


/**
 * Sample application
 */
var appSources = ['src/app/**/*.ts'];

gulp.task('typescript:app', function () {
    return typescriptCompile(appSources, {
        inlineTemplates: false,
        internal: true
    })
    .pipe(absoluteRequires({
        parentOnly: true
    }))
    .pipe(gulp.dest("dist"));
});

/**
 * Watches for changes in ts files (or files that will be inlined in typescript)
 * to retrigger typescript compilation.
 */
var clarityHtmlFiles = ["src/bifrost/**/*.html"];
gulp.task('typescript:bifrost:watch', function () {
    gulp.watch(bifrostSources.concat(clarityHtmlFiles), function () {
        return runSequence('tslint:clarity:no-error', 'typescript:bifrost');
    });
});


gulp.task('typescript:tests:watch', function () {
    gulp.watch(testsSources, function () {
        return runSequence('tslint:tests:no-error', 'typescript:tests');
    });
});

gulp.task('typescript:app:watch', function () {
    gulp.watch(appSources, function () {
        return runSequence('tslint:app:no-error', 'typescript:app');
    });
});

gulp.task('typescript', function (callback) {
    return runSequence(
        'tslint',
        ['typescript:bifrost', 'typescript:app', 'typescript:tests'],
        callback
    );
});

gulp.task('typescript:watch', [
    'typescript:bifrost:watch',
    'typescript:app:watch',
    'typescript:tests:watch'
], function () {});
