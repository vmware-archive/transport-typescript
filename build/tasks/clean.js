/*
 * Copyright 2017 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

var gulp = require('gulp-help')(require('gulp'));
var del = require("del");

/**
 * Removes all build artifacts
 */
gulp.task("clean", function () {
    return del([
        "aot-compiled",
        "dist",
        "tmp"
    ]);
});

/**
 * Deletes the tmp folder
 */
gulp.task("clean:tmp", function () {
    return del([
        "tmp"
    ]);
});
