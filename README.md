## Making an artcompiler

### Steps include

* Get, build and start the Graffiticode host app (https://github.com/graffiticode/graffiticode).
* Clone and initialize the starter artcompiler (L0) as a new language (e.g. L0).
  * `$ git clone git@github.com:graffiticode/L0.git`
  * `$ cd L0`
  * `$ npm install`
* Start your compiler as a local service to make sure that all is well.
  * `$ cd ../L0`
  * `$ make`
* Make sure everything is good.
  * Visit your local GC server (e.g. http://localhost:3000/lang?id=0) to test.
  * Make sure the terminal window that GC is running in has the environment variable LOCAL_COMPILER=true.
  * Paste into the code view: `"hello, world!"..`.
  * See "hello, world!" in the form view.
* Design a language that allows you to say things that are interesting and beautiful.
* Edit ./src/lexicon.js to define a vocabulary for that language.
* Edit ./src/compiler.js to translate the ASTs produced from GC into object code that expresses the output of that language.
* Edit ./src/viewer.js to render that object code in an interesting and beautiful way.
* Test your changes.
  * `$ make`
  * Edit the code in the code view.
* Repeat to taste.

### Development mode

This command will restart the dev server when changes to `src/`, `index.js`, or `package.json` are detected.

```bash
$ npm run watch
```

### Notes
All language compilers run locally are expected to be at the port where `5` is subbed in for `L` in the language code.  `L0` becomes port `50` which can create issues if your machine only allows root access to ports less than 1000.  This bash code forwards traffic from port `50` to `5050` so that the compiler can be run on port `5050` instead.
```bash
$ echo "
rdr pass inet proto tcp from any to any port 50 -> 127.0.0.1 port 5050
" | sudo pfctl -ef -
$ port=5050 make # run in compiler (L0 in this example) directory
```
