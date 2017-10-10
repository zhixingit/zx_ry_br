"use strict";
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require("webpack");


const types = ['vibration', 'displacement', 'crack', 'strain', 'cableforce', 'corrosion', 'verticality', 'deflection', 'temperature_humidity'];
const dashboard = [
    'webpack-hot-middleware/client?reload=true',
    "./dashboard/index.js",
];

let entry = Object.assign({
    "vendor": [
        'webpack-hot-middleware/client?reload=true',
        './resource/common.less',
    ],
    "dashboard": dashboard,
    "trafficmonitor": [
        'webpack-hot-middleware/client?reload=true',
        './analytics/trafficmonitor/index.js',
    ],
    "alarmanalytic": [
        'webpack-hot-middleware/client?reload=true',
        './analytics/alarmanalytic/index.js',
    ],
    "fft": [
        'webpack-hot-middleware/client?reload=true',
        './analytics/fft/index.js',
    ],
    "correlation": [
        'webpack-hot-middleware/client?reload=true',
        './analytics/correlation/index.js',
    ],
    "specialdetail": [
        'webpack-hot-middleware/client?reload=true',
        './analytics/specialdetail/index.js',
    ],
    "trafficloaday": [
        'webpack-hot-middleware/client?reload=true',
        './analytics/trafficloaday/index.js',
    ],
    "alarm": [
        'webpack-hot-middleware/client?reload=true',
        './statistics/alarm/index.js',
    ],
    "specialevent": [
        'webpack-hot-middleware/client?reload=true',
        './statistics/specialevent/index.js',
    ],
    "history": [
        'webpack-hot-middleware/client?reload=true',
        './history/index.js',
    ],

}, initMonitorEntry());

function initMonitorEntry() {
    let entries = {};

    for (let type of types) {
        entries[type] = [
            'webpack-hot-middleware/client?reload=true',
            "./monitor/index.js",
            `./monitor/${type}/index.js`
        ];
    }
    return entries;
}

let plugins = [
    new HtmlWebpackPlugin({
        template: "./dashboard/html.js",
        filename: "./dashboard/index.html",
        chunks: ["vendor", "dashboard"],
    }),
    new HtmlWebpackPlugin({
        template: './analytics/trafficmonitor/html.js',
        filename: './analytics/trafficmonitor/index.html',
        chunks: ['vendor', 'trafficmonitor'],
    }),
    new HtmlWebpackPlugin({
        template: './analytics/alarmanalytic/html.js',
        filename: './analytics/alarmanalytic/index.html',
        chunks: ['vendor', 'alarmanalytic'],
    }),
    new HtmlWebpackPlugin({
        template: './analytics/fft/html.js',
        filename: './analytics/fft/index.html',
        chunks: ['vendor', 'fft'],
    }),
    new HtmlWebpackPlugin({
        template: './analytics/correlation/html.js',
        filename: './analytics/correlation/index.html',
        chunks: ['vendor', 'correlation'],
    }),
    new HtmlWebpackPlugin({
        template: './analytics/specialdetail/html.js',
        filename: './analytics/specialdetail/index.html',
        chunks: ['vendor', 'specialdetail'],
    }),
    new HtmlWebpackPlugin({
        template: './analytics/trafficloaday/html.js',
        filename: './analytics/trafficloaday/index.html',
        chunks: ['vendor', 'trafficloaday'],
    }),
    new HtmlWebpackPlugin({
        template: './statistics/alarm/html.js',
        filename: './statistics/alarm/index.html',
        chunks: ['vendor', 'alarm'],
    }),
    new HtmlWebpackPlugin({
        template: './statistics/specialevent/html.js',
        filename: './statistics/specialevent/index.html',
        chunks: ['vendor', 'specialevent'],
    }),
    new HtmlWebpackPlugin({
        template: './history/html.js',
        filename: './history/index.html',
        chunks: ['vendor', 'history'],
    }),
  // new webpack.ProvidePlugin({
  //     $: 'jquery',
  //     jQuery: 'jquery',
  //     'window.jQuery': 'jquery',
  //     'window.$': 'jquery',
  // }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: '[name]/common.js',
        minChunks: 4,
    }),
    new ExtractTextPlugin('resource/[name].css'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin()
].concat(initHtmlWebpackPluginConfig());

function initHtmlWebpackPluginConfig() {
    let plugins = [];

    for (let type of types)
    {
        plugins.push(new HtmlWebpackPlugin({
            template: `./monitor/${type}/html.js`,
            filename: `./monitor/${type}/index.html`,
            chunks: ["vendor", `${type}`]
        }));
    }
    return plugins;
}


module.exports = {
    context: path.resolve("./src"),
    entry: entry,
    output: {
        path: path.resolve("./public"),
        filename: "[name].min.js",
        sourceMapFilename: '[file].map',
        publicPath: '/',

    },
    module: {
        loaders: [{
            test: /\.ejs$/,
            loader: "ejs-loader",
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                "presets": ["es2015"],
            },
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(["css"]),
            exclude: "lib",
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract(["css", "less"]),
            exclude: "lib",
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url?limit=8192&name=resource/image/[name].[ext]',
            exclude: "lib",
        }, {
            test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
            loader: 'file?name=resource/font/[name].[ext]',
            exclude: "lib",
        }],
    },
    plugins: plugins,
    extensions: [".js", ".ejs", ".less", ".css"],
    devtool: 'source-map',
};
