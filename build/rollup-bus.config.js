/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

import buble from 'rollup-plugin-buble';

export default {
    entry: 'tmp/bus/index.js',
    dest: 'dist/npm/vmw-bifrost/bus/vmw-bifrost-bus.umd.js',
    format: 'umd',
    moduleName: 'ng.vmw-bifrost-bus',
    external: [
        '@angular/core',
        '@angular/common',
        '@angular/platform-browser',
        'rxjs',
        'rxjs/add/operator/merge'
    ],
    globals: {
        '@angular/core' : 'ng.core',
        '@angular/common' : 'ng.common',
        '@angular/platform-browser' : 'ng.platformBrowser',
        'rxjs' : 'rxjs',
        'rxjs/add/operator/merge' : 'rxjs.merge'
    },
    plugins: [
        buble()
    ],
    onwarn: function (message) {
        // Suppress ignore-able warning messages. See: https://github.com/rollup/rollup/issues/794
        if (/The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten./.test(message)) {
            return;
        }
        console.error(message);
    }
};
