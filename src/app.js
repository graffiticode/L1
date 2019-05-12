const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const {createAuth} = require('./auth.js');
const routes = require('./routes');

exports.createApp = function createApp(auth, compiler) {
  const app = express();

  app.use(morgan('dev'));

  app.use(bodyParser.urlencoded({ extended: false, limit: 100000000 }));
  app.use(bodyParser.text({limit: '50mb'}));
  app.use(bodyParser.raw({limit: '50mb'}));
  app.use(bodyParser.json({limit: '50mb' }));

  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(500);
  });

  app.use(express.static(path.resolve(__dirname, './../pub')));

  app.get('/', routes.lang(compiler));
  app.get('/version', routes.version(compiler));
  app.get('/compile', routes.auth(auth, 'compile'), routes.compile(compiler));

  return app;
}