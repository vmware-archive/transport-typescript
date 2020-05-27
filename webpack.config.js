const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: './src',
    plugins: [
        new CleanWebpackPlugin()
    ],
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
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [
                    path.resolve(__dirname, 'src')
                ]
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'transport.umd.min.js',
        library: 'transport',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    externals: {
        'rxjs': 'rxjs',
        'rxjs/operators': 'rxjs/operators'
    }
};

