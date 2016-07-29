var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var devConfig = require('./webpack.config.dev.js');
var _ = require('lodash');

function generateConfig(module) {
  var config = _.clone(devConfig, true);
  config.devtool = undefined;
  config.entry = './' + module + '/index.js';
  config.output = {
    path: __dirname + '/dist/' + module,
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  config.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
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
