const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');
const {createAuth} = require('./lib/auth.js');
const {createApp} = require('./app.js');
const compiler = require("./lib/compile.js");
const PORT = process.env.PORT || `5${compiler.langID}`;
const auth = createAuth(compiler);
const app = module.exports = createApp(auth, compiler);
global.config = require("./config.json");
if (!module.parent) {
  process.on('uncaughtException', (err) => console.log('Caught exception: ' + err));
  app.listen(PORT, () => console.log(`Node app is running at localhost: ${PORT}`));
}
