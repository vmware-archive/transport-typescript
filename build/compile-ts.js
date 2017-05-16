/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

var gulp = require('gulp-help')(require('gulp'));
var replace = require('gulp-replace');
var sourcemaps = require("gulp-sourcemaps");
var ts = require("gulp-typescript");
var mergeStream = require('merge-stream');

var typings = ["src/typings.d.ts"];

module.exports = function(tsSources, options, destination) {
    // always include typings to the sources;
    // this function is always called after the "triage" task so the tmp typings file exists
    var allSources = typings.concat(tsSources);

    var tsConfig = {
        typescript: require('typescript'),
        baseUrl: "src/"
    };
    if (options.module) {
        tsConfig.module = options.module;
    }
    var tsProject = ts.createProject("tsconfig.json", tsConfig);

    var prod = process.env.NODE_ENV==="prod";

    var stream = gulp.src(allSources, {base: "src/"})

    if (!prod) {
        stream = stream.pipe(sourcemaps.init());
    }

    stream = stream.pipe(ts(tsProject));
    if (!prod) {
        stream = stream.pipe(sourcemaps.write(".", {sourceRoot: "/src"}));
    }

    if (!options.internal && prod) {
        // Merge the two output streams, so this task is finished when the IO of both operations are done.
        return mergeStream([
            stream.js,
            stream.dts
        ]);
    } else {
        return stream;
    }
};