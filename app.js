const {AuthError} = require('@graffiticode/graffiticode-compiler-framework');
const {createAuth} = require('./lib/auth');
const {compile, langID} = require('./lib/compile');

const auth = createAuth({langID});

exports.compiler = {
  language: `L${langID}`,
  auth(token) {
    return new Promise((resolve, reject) => {
      auth(token, 'compile', (err, authInfo) => {
        if (err) {
          reject(new AuthError(err.message));
        } else {
          resolve(authInfo);
        }
      });
    })
  },
  compile(code, data, config) {
    return new Promise((resolve, reject) => {
      compile(code, data, config, (err, result) => {
        if (err instanceof Error
            || (Array.isArray(err)
            && err.length > 0)) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
};
