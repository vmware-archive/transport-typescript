/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

import buble from 'rollup-plugin-buble';

export default {
    entry: 'tmp/bridge/index.js',
    dest: 'dist/npm/vmw-bifrost/bridge/vmw-bifrost-bridge.umd.js',
    format: 'umd',
    moduleName: 'ng.vmw-bifrost-bridge',
    external: [
        '@angular/core',
        '@angular/common',
        '@angular/platform-browser',
        'rxjs'
    ],
    globals: {
        '@angular/core' : 'ng.core',
        '@angular/common' : 'ng.common',
        '@angular/platform-browser' : 'ng.platformBrowser',
        'rxjs' : 'rxjs'
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