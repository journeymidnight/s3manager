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
  app.use('/api', proxy(endpoint, {
    forwardPath: (req) => {
      return url.parse(req.url).path;
    },
  }));

  app.use(devMiddleware);
  app.use(hotMiddleware);

  app.use((req, res) => {
    const html = fs.readFileSync(`${__dirname}/../index.html`).toString();
    res.set('Content-Type', 'text/html');
    res.send(html.replace('<!-- MODULE -->', `<script src="/dist/${module}.js"></script>`));
  });

  return app;
}

createApp('console').listen(9001);
createApp('boss').listen(9002);
createApp('devops').listen(9003);
