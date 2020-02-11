var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './scrolly.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'main.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [["@babel/env", {
                            "targets": {
                                'browsers': ['Chrome >=59']
                            },
                            "modules":false,
                            "loose":true
                        }]]
                    }
                }]
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};