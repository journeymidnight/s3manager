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
  const endpoint = process.env[`${module}_endpoint`.toUpperCase()] || 'http://localhost:8080';

  const app = new Express();
  app.use(logger('dev'));
  app.use('/asset', Express.static(path.resolve(__dirname, '../asset')));
  app.use('/p', proxy(endpoint, {
    forwardPath: (req) => {
      return `/p${url.parse(req.url).path}`;
    },
  }));

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

function createConsole() {
  const endpoint = process.env['console_endpoint'.toUpperCase()] || 'http://localhost:8080';

  const app = new Express();
  app.use(logger('dev'));
  app.use('/asset', Express.static(path.resolve(__dirname, '../asset')));
  app.use('/p', proxy(endpoint, {
    forwardPath: (req) => {
      return `/p${url.parse(req.url).path}`;
    },
  }));

  app.use(devMiddleware);
  app.use(hotMiddleware);

  const allPaths = [
    { path: '/lcs/', packageName: 'lcs' },
    { path: '/los/', packageName: 'los' },
    { path: '/g/', packageName: 'global', isDefault: true },
  ];

  allPaths.forEach((item) => {
    app.get(item.path, (req, res) => {
      const html = fs
        .readFileSync(`${__dirname}/../index.html`)
        .toString()
        .replace('<!-- JS_MODULE -->', `<script src="/dist/vendor.js"></script><script src="/dist/${item.packageName}.js"></script>`)
        .replace('<!-- CSS_MODULE -->', `<link href="/dist/${item.packageName}.css" rel="stylesheet">`);

      res.set('Content-Type', 'text/html');
      res.send(html);
    });
  });

  app.get('/', (req, res) => {
    const defaultPath = allPaths.filter((item) => {
      return item.isDefault === true;
    })[0];
    res.redirect(defaultPath.path);
  });

  return app;
}

createApp('boss').listen(9013);
createConsole().listen(9014);
