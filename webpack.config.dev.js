var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',

  entry: {
    console: './console/index.js',
    devops: './devops/index.js',
    boss: './boss/index.js',
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
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.scss$/, loader: 'style!css!sass' },
      { test: /\.jsx*$/, loader: 'babel!eslint',
        includes: [
          /devops/,
          /console/,
          /boss/,
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
};
