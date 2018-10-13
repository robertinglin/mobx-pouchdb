var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: './src/index.js',
    optimization: {
        minimize: false
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'mobx-pouchdb.js',
        library: 'pouch',
        libraryTarget: 'umd',
        globalObject: "(typeof window !== 'undefined' ? window : this)"
    },
    externals: ['mobx', 'pouchdb'],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    mode: 'production'
};