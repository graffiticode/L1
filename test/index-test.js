const request = require('supertest');
const {app} = require('./../app');
describe('index', () => {
  it('GET /', (done) => {
    request(app)
      .get('/')
      .expect(200, 'Hello, L0!', done);
  });
  
  it('GET /version', (done) => {
    request(app)
      .get('/version')
      .expect(200, 'v1.0.0', done);
  });

  it('PUT /compile', (done) => {
    const body = {
      src: {},
      data: {},
    };
    const encodedBody = JSON.stringify(body);
    request(app)
      .post('/compile')
      .set('Content-type', 'application/json')
      .send(encodedBody)
      .expect(200, 'null', done);
  });
});
