import Express from 'express';
import path from 'path';
import logger from 'morgan';
import proxy from 'express-http-proxy';
import fs from 'fs';
import url from 'url';

import webpack from 'webpack';
import config from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const compiler = webpack(config);
const devMiddleware = webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
});
const hotMiddleware = webpackHotMiddleware(compiler);

function createApp(module) {
  const endpoint = process.env[`${module}_endpoint`.toUpperCase()] || 'http://localhost:9003';
  const yigiam_endpoint = 'http://123.59.229.3:8888';

  const app = new Express();
  app.use(logger('dev'));
  app.use('/asset', Express.static(path.resolve(__dirname, '../asset')));
  app.use('/p', proxy(endpoint, {
    forwardPath: (req) => {
      return `/p${url.parse(req.url).path}`;
    }}));
  app.use('/iamapi', proxy(yigiam_endpoint, {
    forwardPath: (req) => {
      return "/iamapi";
    }}));
  app.use('/losapi', proxy(yigiam_endpoint, {
    forwardPath: (req) => {
      return "/losapi";
    }}));
  app.use('/env', proxy(yigiam_endpoint, {
    forwardPath: (req) => {
      return "/env";
    }}));

  app.use(devMiddleware);
  app.use(hotMiddleware);

  app.use((req, res) => {
    const html = fs
      .readFileSync(`${__dirname}/../index.html`)
      .toString()
      .replace('<!-- JS_MODULE -->', `<script src="/dist/vendor.js"></script><script src="/dist/${module}.js"></script>`)
      .replace('<!-- CSS_MODULE -->', `<link href="/dist/${module}.css" rel="stylesheet">`);

    res.set('Content-Type', 'text/html');
    res.send(html);
  });

  return app;
}

createApp('boss').listen(9013);
