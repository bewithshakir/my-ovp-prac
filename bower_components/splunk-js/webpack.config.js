var webpack = require('webpack');

module.exports = {
    entry: ['./splunk.js'],
    output: {
        // path: __dirname + 'dist/',
        filename: 'splunk.dist.js',
        library: 'splunk',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                },
                exclude: /libs/
            }
        ]
    },
    stats: {
        colors: true
    }
};
