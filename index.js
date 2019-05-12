/*
   L0 compiler service.
   @flow weak
*/

// SHARED START
const compiler = require("./lib/compile.js");
const {createApp} = require('./src/app.js');
const {createAuth} = require('./src/auth.js');

const PORT = process.env.PORT || `5${compiler.langID}`;

const auth = createAuth(compiler);
const app = module.exports = createApp(auth, compiler);

if (!module.parent) {
  process.on('uncaughtException', (err) => console.log('Caught exception: ' + err));
  app.listen(PORT, () => console.log(`Node app is running at localhost: ${PORT}`));
}
// SHARED STOP
