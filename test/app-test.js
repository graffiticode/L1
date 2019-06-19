const request = require('supertest');

const app = require('./../index.js');

describe('app', () => {
  beforeEach('Create app', () => {
    const auth = (token, scope, resume) => resume(null, {access: scope});
    const compiler = {
      langID: '42',
      version: 'v1.2.3',
      compile: (code, data, config, resume) => resume(null, 4),
    };
  });

  it('GET /', (done) => {
    request(app)
      .get('/')
      .expect(200, 'Hello, L42!', done);
  });
  
  it('GET /version', (done) => {
    request(app)
      .get('/version')
      .expect(200, 'v1.2.3', done);
  });

  it('GET /compile', (done) => {
    const body = {
      src: {},
      data: {},
    };
    const encodedBody = JSON.stringify(body);
    request(app)
      .get('/compile')
      .set('Content-type', 'text/plain')
      .send(encodedBody)
      .expect(200, '4', done);
  });

  it('POST /compile', (done) => {
    const body = {
      src: {},
      data: {},
    };
    const encodedBody = JSON.stringify(body);
    request(app)
      .post('/compile')
      .set('Content-type', 'text/plain')
      .send(encodedBody)
      .expect(200, '4', done);
  });
});
