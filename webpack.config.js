var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
    optimization: {
        minimizer: [new UglifyJsPlugin({
            parallel: true,
            cache: true,
            uglifyOptions: {
                warnings: false,
                parse: {},
                compress: {
                    sequences: true,
                    dead_code: true,
                    conditionals: true,
                    booleans: true,
                    unused: true,
                    if_return: true,
                    join_vars: true,
                    passes: 5
                },
                mangle: true,
                mangle_props: true
            }
        })]
    },
    externals: {
        'rxjs': 'rxjs',
        'rxjs/operators': 'rxjs/operators'
    }
};
