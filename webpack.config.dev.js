var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'eval-cheap-module-source-map',

  entry: {
    lcs: './lcs/index.js',
    los: './los/index.js',
    global: './global/index.js',
    boss: './boss/index.js',
    'browser-detection': './browser-detection.js',
    vendor: [
      'axios',
      'bootstrap',
      'c3',
      'd3',
      'history',
      'i18next',
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
  },

  output: {
    path: __dirname + '/dist/',
    filename: '[name].js',
    publicPath: '/dist/',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  module: {
    loaders: [
      { test: /\.json$/i, loader: 'json' },
      { test: /\.html$/i, loader: 'html' },
      { test: /\.(woff|woff2)(?:\?.*|)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      { test: /\.ttf(?:\?.*|)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      { test: /\.eot(?:\?.*|)?$/, loader: 'file'},
      { test: /\.svg(?:\?.*|)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
      { test: /\.(jpe?g|png|gif)(?:\?.*|)$/i, loader: 'file' },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css') },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!sass') },
      { test: /\.jsx*$/, loader: 'babel!eslint',
        includes: [
          /lcs/,
          /los/,
          /global/,
          /boss/,
          /console-common/,
          /shared/,
        ],
        exclude: [
          /(node_modules)/,
          /(venders)/,
        ],
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
};
