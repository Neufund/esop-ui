const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
import Config from './src/config.js'

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'main.js'
    },
    plugins: [
        // Copy our app's index.html to the build folder.
        new CopyWebpackPlugin([
            {from: './public/index.html', to: "index.html"},
            {from: './public/favicon.ico', to: "favicon.ico"}
        ]),
        new webpack.NamedModulesPlugin()
    ],
    resolve: {
      alias: {
          'truffle-artifacts': Config.truffleArtifacts
      }
    },
    node: {
        __filename: true
    },
    devServer: {
        proxy: {
            "/api": {
                target: "http://localhost:8444",
                pathRewrite: {"^/api": ""}
            },
            "/pdfrender": {
                target: "https://neufund.net/pdfrender/api/document",
                pathRewrite: {"^/pdfrender": ""}
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {loader: "sass-loader"}
                ]
            },
            {test: /\.json$/, use: 'json-loader'},
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            {
                test: /\.(jpg|png)$/,
                loader: 'url-loader',
                options: {
                    limit: 25000
                }
            },
            {
                test: /\.(ttf|svg|eot|otf)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[hash].[ext]'
                }
            }
        ]
    }
};