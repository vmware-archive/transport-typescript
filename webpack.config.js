var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var webpackRxjsExternals = require('webpack-rxjs-externals');

module.exports = {
    entry: './dist',
    mode: 'production',
    output: {
        filename: 'bifrost.umd.min.js',
        // export to AMD, CommonJS, or window
        libraryTarget: 'umd',
        // the name exported to window
        library: 'bifrost'
    },
    plugins: [
        new UglifyJSPlugin()
    ],
    externals: [
        webpackRxjsExternals()
    ]
};
