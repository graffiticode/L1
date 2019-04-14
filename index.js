/*
   L0 compiler service.
   @flow weak
*/
const langID = "0";
// SHARED START
const https = require("https");
const express = require('express')
const compiler = require("./lib/compile.js");
const app = module.exports = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.set('port', (process.env.PORT || "5" + langID));
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
app.get('/', function(req, res) {
  res.send("Hello, L" + langID + "!");
});
app.get("/version", function(req, res) {
  res.send(compiler.version || "v0.0.0");
});
app.get("/compile", handleValidateCompile, handleCompile);

function handleValidateCompile(req, res, next) {
  const body = JSON.parse(req.body);
  let auth = body.auth;
  validate(auth, function (err, data) {
    if (err) {
      res.status(401).send(err);
      return;
    }
    if (data.access.indexOf('compile') === -1) {
      res.sendStatus(401).send('not authorized to compile');
      return;
    }
    next();
  });
}
function handleCompile(req, res) {
  const body = JSON.parse(req.body);
  let code = body.src;
  let data = body.data;
  data.REFRESH = body.refresh; // Stowaway flag.
  compiler.compile(code, data, function (err, val) {
    if (err && err.length) {
      res.status(500).json({error: err});
      return;
    }
    res.status(200).json(val);
  });
}
function postAuth(path, data, resume) {
  let encodedData = JSON.stringify(data);
  var options = {
    host: "auth.artcompiler.com",
    port: "443",
    path: path,
    method: "POST",
    headers: {
      'Content-Type': 'text/plain',
      'Content-Length': Buffer.byteLength(encodedData),
    },
  };
  var req = https.request(options);
  req.on("response", (res) => {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    }).on('end', function () {
      try {
        resume(null, JSON.parse(data));
      } catch (e) {
        console.log("ERROR " + data);
        console.log(e.stack);
      }
    }).on("error", function () {
      console.log("error() status=" + res.statusCode + " data=" + data);
    });
  });
  req.end(encodedData);
  req.on('error', function(err) {
    console.log("ERROR " + err);
    resume(err);
  });
}
function count(token, count) {
  postAuth("/count", {
    jwt: token,
    lang: "L" + langID,
    count: count,
  }, () => {});
}
const validated = {};
function validate(token, resume) {
  if (token === undefined) {
    resume(null, {
      address: "guest",
      access: "compile",
    });
  } else if (validated[token]) {
    resume(null, validated[token]);
    count(token, 1);
  } else {
    postAuth("/validate", {
      jwt: token,
      lang: "L" + langID,
    }, (err, data) => {
      validated[token] = data;
      resume(err, data);
      count(token, 1);
    });
  }
}

if (!module.parent) {
  process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
  });
  app.listen(app.get('port'), function () {
    global.port = app.get('port');
    console.log("Node app is running at localhost:" + app.get('port'))
    if (process.argv.includes("test")) {
      test();
    }
  });
}
// SHARED STOP
