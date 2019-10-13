import { expect } from 'chai';
import * as NodeHttpAdapter from '@pollyjs/adapter-node-http';
import { Polly, setupMocha } from '@pollyjs/core';
import * as FSPersister from '@pollyjs/persister-fs';

import { createAuth } from './../src/auth';

Polly.register(FSPersister);
Polly.register(NodeHttpAdapter);

describe('auth', () => {
  const language = 'LTest';

  setupMocha({
    adapters: ['node-http'],
    persister: 'fs',
  });

  // tslint:disable-next-line:only-arrow-functions
  it('should validate with no token', function(done) {
    // Arrange
    const auth = createAuth(language);

    // Act
    auth(null, 'foo', (err, data) => {
      if (err) {
        return done(err);
      }

      // Assert
      expect(data.address).to.equal('guest');
      expect(data.access).to.equal('foo');
      done();
    });
  });

  it('should return err for invalid token', function(done) {
    // Arrange
    const auth = createAuth(language);
    const { server } = this.polly;
    server
      .post('https://auth.artcompiler.com/validate')
      .intercept((_, res) => res.sendStatus(401));

    // Act
    auth('fake-token', 'foo', (err, data) => {
      if (!err) {
        return done(new Error('expected an error'));
      }

      // Assert
      expect(err.message).to.equal('Unauthorized');
      done();
    });
  });

  it('should data for valid token', function(done) {
    // Arrange
    const auth = createAuth(language);
    const { server } = this.polly;
    server
      .post('https://auth.artcompiler.com/validate')
      .intercept((_, res) =>
        res.status(200).json({ address: '1.2.3.4', access: 'foo' })
      );
    server
      .post('https://auth.artcompiler.com/count')
      .intercept((_, res) => res.sendStatus(200));

    // Act
    auth('fake-token', 'foo', (err, data) => {
      if (err) {
        return done(err);
      }

      // Assert
      expect(data.address).to.equal('1.2.3.4');
      expect(data.access).to.equal('foo');
      done();
    });
  });

  it('should cache data', function(done) {
    // Arrange
    const auth = createAuth(language);
    const { server } = this.polly;
    server
      .post('https://auth.artcompiler.com/validate')
      .intercept(
        (_, res) => res.status(200).json({ address: '1.2.3.4', access: 'foo' }),
        { times: 1 }
      );
    server
      .post('https://auth.artcompiler.com/count')
      .intercept((_, res) => res.sendStatus(200))
      .times(2);

    // Act
    auth('fake-token', 'foo', (err, data) => {
      if (err) {
        return done(err);
      }

      // Assert
      expect(data.address).to.equal('1.2.3.4');
      expect(data.access).to.equal('foo');

      auth('fake-token', 'foo', (err, data) => {
        if (err) {
          return done(err);
        }

        // Assert
        expect(data.address).to.equal('1.2.3.4');
        expect(data.access).to.equal('foo');
        done();
      });
    });
  });
});
