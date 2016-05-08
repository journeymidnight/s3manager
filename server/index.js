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

const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:10001';

function createApp(module) {
  const app = new Express();
  app.use(logger('dev'));
  app.use('/asset', Express.static(path.resolve(__dirname, '../asset')));
  app.use('/api', proxy(API_ENDPOINT, {
    forwardPath: (req) => {
      return url.parse(req.url).path;
    },
  }));

  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));

  app.use((req, res) => {
    const html = fs.readFileSync(`${__dirname}/../index.html`).toString();
    res.set('Content-Type', 'text/html');
    res.send(html.replace('MODULE', module));
  });

  return app;
}

createApp('console').listen(9002);
createApp('boss').listen(9003);
