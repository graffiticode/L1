const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');
exports.createApp = (auth, compiler) => {
  const app = express();
  app.use(morgan('dev'));
  app.use(bodyParser.json({type: 'application/json', limit: '50mb'}));
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(500);
  });
  app.use(express.static(path.resolve(__dirname, './pub')));
  app.get('/', routes.root(compiler));
  app.get('/version', routes.version(compiler));
  app.get('/:path', routes.lang(compiler));
  app.post('/compile', routes.compile(compiler));
  return app;
};
