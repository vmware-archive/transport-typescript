/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

var gulp = require('gulp-help')(require('gulp'));
var Builder = require("systemjs-builder");
var zip = require('gulp-zip');

/**
 * Bundles the compiled js files into bifrost.min.js
 */
gulp.task("bundle:bifrost:js", ["typescript:bifrost"], function() {
    var buildOpts = { minify: true, mangle: false, normalize: true };

    var builder = new Builder("dist/");
    builder.config({
        meta: {
            "@angular/*"    : { build: false },
            "rxjs*"          : { build: false }
        },
        packages: {
            'vmw-bifrost': { main: 'index.js', defaultExtension: 'js' }
        }
    });

    return builder.bundle("vmw-bifrost/**/*.js", "dist/bundles/vmw-bifrost.min.js", buildOpts)
        .catch(function(err) {
            console.error(err);
            process.exit(1);
        });
});

/**
 * Compresses our deliverables and definition files for third-party devs.
 */
gulp.task("bundle:zip", ["bundle:bifrost:js"], function() {
    return gulp.src([
        "dist/bundles/vmw-bifrost.min.js",
        "tmp/definitions/**/*.d.ts"
    ])
        .pipe(zip('vmw-bifrost.dev.zip'))
        .pipe(gulp.dest("dist/bundles/"));
});

/**
 * Bundles all js files into a single minified one, then puts it in the bundles/ folder.
 * Also creates a zip with our css and js deliverables and our definition files
 * for third-party devs, then adds it to the bundles/ folder.
 */
gulp.task("bundle", ["bundle:bifrost:js", "bundle:zip"], function(){});

/**
 * Watches for changes in the transpiled js files to rebundle them
 */
gulp.task("bundle:watch", function () {

    var bifrostSources = [
        "src/**/*.ts",
        "!src/**/*.spec.ts",
        "!src/**/*.mock.ts",
        "src/**/*.html",
        "src/**/*.scss",
    ];
    gulp.watch(bifrostSources, ["bundle:bifrost:js"]);
});
