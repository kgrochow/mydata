/* eslint no-var: 0 */
var path = require('path');
var webpack = require('webpack');
var nib = require('nib');
var stylusLoader = require('stylus-loader');

module.exports = {
    devtool: 'source-map',
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        path: path.join(__dirname, './build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.styl$/,
                use: [
                    'style-loader',
                    'css-loader?camelCase&modules&importLoaders=1&localIdentName=[local]---[hash:base64:5]',
                    'stylus-loader'
                ]
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader',
                query: {
                    limit: 8192
                }
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    mimetype: 'application/font-woff'
                }
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new stylusLoader.OptionsPlugin({
            default: {
                // nib - CSS3 extensions for Stylus
                use: [nib()],
                // no need to have a '@import "nib"' in the stylesheet
                import: ['~nib/lib/nib/index.styl']
            }
        })
    ],
    resolve: {
        extensions: ['.js', '.json', '.jsx']
    },
    // https://webpack.github.io/docs/webpack-dev-server.html#additional-configuration-options
    devServer: {
        disableHostCheck: true,
        noInfo: false,
        lazy: false,
        // https://webpack.github.io/docs/node.js-api.html#compiler
        watchOptions: {
            poll: true // use polling instead of native watchers
        }
    }
};
