import { AuthError } from '@graffiticode/graffiticode-compiler-framework';
import { createAuth } from './auth';
import { compile, langID } from './compile';

const language = `L${langID}`;
const auth = createAuth(language);

export const compiler = {
  language,
  auth(token: string) {
    return new Promise((resolve, reject) => {
      auth(token, 'compile', (err, authInfo) => {
        if (err) {
          reject(new AuthError(err.message));
        } else {
          resolve(authInfo);
        }
      });
    });
  },
  // tslint:disable-next-line:no-any
  compile(code: any, data: any, config: any) {
    return new Promise((resolve, reject) => {
      compile(code, data, config, (err, result) => {
        if (err instanceof Error || (Array.isArray(err) && err.length > 0)) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
};
