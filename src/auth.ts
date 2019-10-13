import * as https from 'https';
import * as request from 'request';
import * as url from 'url';

const agent = new https.Agent({ keepAlive: true });

function postAuth(path, data, resume) {
  const uri = new url.URL('https://auth.artcompiler.com');
  uri.pathname = path;

  const options = {
    uri,
    body: data,
    json: true,
    agent,
  };

  request.post(options, (err, res, body) => {
    if (err) {
      return resume(err);
    }
    if (res.statusCode !== 200) {
      return resume(new Error(body));
    }
    resume(null, body);
  });
}

function count(language: string, token: string, count: number) {
  const data = {
    jwt: token,
    lang: language,
    count,
  };
  postAuth('/count', data, err => {
    if (err) {
      console.error(`Auth count error: ${err.message}`);
    }
  });
}

export function createAuth(language: string) {
  const validatedCache = new Map();
  return (token, scope, resume) => {
    if (!token) {
      return resume(null, {
        address: 'guest',
        access: scope,
      });
    }
    if (validatedCache.has(token)) {
      count(language, token, 1);
      return resume(null, validatedCache.get(token));
    }
    const validateData = {
      jwt: token,
      lang: language,
    };
    postAuth('/validate', validateData, (err, authInfo) => {
      if (err) {
        resume(err, null);
      } else {
        validatedCache.set(token, authInfo);
        count(language, token, 1);
        resume(null, authInfo);
      }
    });
  };
}
