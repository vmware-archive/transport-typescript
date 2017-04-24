/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

var gulp = require('gulp-help')(require('gulp'));
var rename = require('gulp-rename');
var preprocess = require('gulp-preprocess');
var util = require('gulp-util');


// All packages share the same version number.
var VERSION = util.env.version;
var npmFolder = "dist/npm/";

/**
 * Preparing the bifrost package
 */

/**
 * The deliverables for bifrost are:
 *   - the compiled js files in es5 with es2015 module format
 *   - the umd JS bundle
 *   - the minified JS bundle (in register format)
 *   - the Typescript declaration files for our components
 */
gulp.task("npm:angular:bundles", function () {
    gulp.src([
        "dist/bundles/vmw-bifrost.min.js",
        "dist/bundles/vmw-bifrost.umd.js",
        'tmp/**/*.metadata.json',
        'tmp/**/*.d.ts',
        'tmp/**/*.js',
        'tmp/**/*.js.map'
    ]).pipe(gulp.dest(npmFolder + "/vmw-bifrost"));
});

/**
 * We insert the version number in the correct package.json
 * and copy it to the root of our package.
 */
gulp.task("npm:angular:package", function () {
    return gulp.src("build/npm/vmw-bifrost.json")
        .pipe(preprocess({context: {VERSION: VERSION}, extension: "js"}))
        .pipe(rename("package.json"))
        .pipe(gulp.dest(npmFolder + "/vmw-bifrost"));
});

gulp.task("npm:angular", ["npm:angular:bundles", "npm:angular:package"], function () {});

gulp.task("npm:all", ["npm:angular"], function () {});