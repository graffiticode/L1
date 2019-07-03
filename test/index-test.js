const request = require('supertest');
const express = require('express');
const app = express();

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
      .expect(200, 'null', done);
  });
});
