/*
   L0 compiler service.
   @flow weak
*/
const langID = "0";
// SHARED START
const express = require('express');
const compiler = require("./lib/compile.js");
const app = module.exports = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./src/routes');
const {createAuth} = require('./src/auth.js');

const PORT = process.env.PORT || `L${compiler.langID}`;
const auth = createAuth(compiler);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false, limit: 100000000 }));
app.use(bodyParser.text({limit: '50mb'}));
app.use(bodyParser.raw({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb' }));
app.use(express.static(__dirname + '/pub'));
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.sendStatus(500);
});
app.get('/', routes.lang(compiler));
app.get('/version', routes.version(compiler));
app.get('/compile', routes.auth(auth, 'compile'), routes.compile(compiler));

if (!module.parent) {
  process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
  });
  app.listen(PORT, () => console.log(`Node app is running at localhost: ${PORT}`));
}
// SHARED STOP
