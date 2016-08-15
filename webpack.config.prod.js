var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var devConfig = require('./webpack.config.dev.js');
var _ = require('lodash');

function generateConfig(module) {
  var config = _.clone(devConfig, true);
  config.devtool = undefined;
  config.entry = {
    main: './' + module + '/index.js',
    vendor: [
      'axios',
      'bootstrap',
      'c3',
      'd3',
      'history',
      'i18next',
      'i18next-xhr-backend',
      'jquery',
      'lodash',
      'mixpanel-browser',
      'moment',
      'okay',
      'promise',
      'react',
      'react-c3-component',
      'react-dom',
      'react-i18next',
      'react-redux',
      'react-router',
      'react-router-redux',
      'react-select',
      'react-time',
      'redux',
      'redux-form',
      'redux-logger',
      'redux-thunk',
      'store',
      'superagent'
    ]
  };
  config.output = {
    path: __dirname + '/dist/' + module,
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  config.plugins = [
    new ExtractTextPlugin('main.[hash].css'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.v1.20160815.js'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ];

  return config;
}

module.exports = [
  generateConfig('boss'),
  generateConfig('console'),
];
