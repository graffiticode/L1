const request = require('supertest');

const {createApp} = require('./../src/app.js');

describe('app', () => {
  let app;
  beforeEach('Create app', () => {
    const auth = (token, scope, resume) => resume(null, {access: scope});
    const compiler = {
      langID: '42',
      version: 'v1.2.3',
      compile: (code, data, resume) => resume(null, 4),
    };
    app = createApp(auth, compiler);
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
});
