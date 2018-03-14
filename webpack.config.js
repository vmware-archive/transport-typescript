var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './dist',
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
    externals: {
        'rxjs' : 'rxjs',
        'rxjs/Observable' : 'rxjs/Observable',
        'rxjs/Subscription' : 'rxjs/Subscription',
        'rxjs/ReplaySubject' : 'rxjs/ReplaySubject',
        'rxjs/Subject' : 'rxjs/Subject',
        'rxjs/add/operator/merge' : 'rxjs.merge',
        'rxjs/add/operator/map' : 'rxjs.map',
        'rxjs/add/operator/filter' : 'rxjs.filter',
    }
  };