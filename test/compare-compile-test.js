import React from "react";
import renderer from "react-test-renderer";
import './viewer-setup';
import '../src/viewer';
import snapshotDiff from 'snapshot-diff';
import vm from 'vm';

const {expect} = require('chai');
const jsonDiff = require('json-diff');
const path = require('path');
const request = require('request');
const url = require('url');
const LANG_ID = 0;
const TIMEOUT_DURATION = 5000;
global.config = require("../config.json");
const LOCAL_GATEWAY = global.config.test.app_dev;
const REMOTE_GATEWAY = global.config.test.app_prod;
const LocalViewer = window.gcexports.viewer.Viewer;
window.gcexports.dispatcher = {register: () => {}};
let RemoteViewer;
getTests(function (err, testData) {
  describe('compiles', function() {
    this.timeout(TIMEOUT_DURATION);
    function checkGateway(host, resume) {
      request.head(host, function (err, res) {
        if (err) {
          if (err.code === 'ECONNREFUSED') {
            err = new Error(`unable to connect to gateway: ${err.message}`);
          }
          return resume(err);
        }
        if (!res || res.statusCode !== 200) {
          return resume(new Error(`gateway did not return 200: ${res.statusCode}`));
        }
        resume();
      });
    }
    before('Check local', function(done) {
      checkGateway(LOCAL_GATEWAY, done);
    });
    before('Check remote gateway', function (done) {
      checkGateway(REMOTE_GATEWAY, done);
    });
    before('Get remote viewer', function(done) {
      const hostUrl = new url.URL(REMOTE_GATEWAY);
      hostUrl.pathname = '/L0/viewer.js';

       request(hostUrl.toString(), function(err, res, body) {
        if (err) {
          return done(err);
        }
        if (res.statusCode !== 200) {
          done(new Error(`Remote viewer.js ${res.statusCode}`));
        }
        try {
          vm.runInThisContext(body);
          RemoteViewer = window.gcexports.viewer.Viewer;
        } catch (e) {
          console.log("ERROR with remote viewer code: " + body);
        }
        done();
      });
    });
    function getCompile(host, id, resume) {
      const hostUrl = new url.URL(host);
      hostUrl.searchParams.set('id', id);
      hostUrl.searchParams.set('refresh', 'true');
      hostUrl.searchParams.set('dontSave', 'true');
      hostUrl.pathname = '/data';
      request(hostUrl.toString(), function(err, res, body) {
        if (err) {
          return resume(err);
        }
        if (res.statusCode !== 200) {
          resume(new Error(`compile ${host} returned ${res.statusCode}`));
        }
        try {
          body = JSON.parse(body);
        } catch (e) {
          console.log("ERROR not JSON: " + body);
        }
        resume(null, body);
      });
    }
    function getLocalAndRemoteCompile(id, resume) {
      getCompile(LOCAL_GATEWAY, id, function(err, local) {
        if (err) {
          return resume(err);
        }
        getCompile(REMOTE_GATEWAY, id, function(err, remote) {
          if (err) {
            return resume(err);
          }
          resume(null, local, remote);
        });
      });
    }
    describe('compiling ' + (testData && testData.length || 0) + ' tests', function () {
      testData && testData.forEach(function (data, i) {
        it((i + 1) + ": " + data, function (done) {
          getLocalAndRemoteCompile(data, function (err, local, remote) {
            if (err) {
              done(err);
            } else {
              try {
                let compileDiff = jsonDiff.diffString(remote, local);
                if (compileDiff) {
                  console.log(compileDiff);
                }
                expect(compileDiff).to.be.equal('');

                const localTree = renderer.create(
                  <LocalViewer id="graff-view" className="viewer" obj={remote} />
                ).toJSON();

                const remoteTree = renderer.create(
                  <RemoteViewer id="graff-view" className="viewer" obj={remote} />
                ).toJSON();

                let viewerDiff = snapshotDiff(localTree, remoteTree, {
                  colors: true,
                  aAnnotation: 'remote',
                  bAnnotation: 'local',
                  contextLines: 1
                });
                if (viewerDiff.indexOf('Compared values have no visual difference') < 0  ) {
                  console.log(viewerDiff);
                }
                expect(viewerDiff).to.include('Compared values have no visual difference.');

                done();
              } catch (e) {
                console.log("ERROR " + e);
                expect(false).to.be.true();
                done();
              }
            }
          });
        });
      });
    });
  });
  run();
});
function getTests(resume) {
  console.log("Getting tests...");
  let mark = process.argv.indexOf('--bugs') > 0 && -1 || 1;
  const hostUrl = new url.URL(LOCAL_GATEWAY);
  hostUrl.searchParams.set('table', 'items');
  hostUrl.searchParams.set('where', 'langid=' + LANG_ID + ' and mark=' + mark);
  hostUrl.searchParams.set('fields', ['itemid']);
  hostUrl.pathname = '/items';
  request(hostUrl.toString(), function(err, res, body) {
    if (err) {
      return resume(err);
    }
    if (res.statusCode !== 200) {
      resume(new Error(`compile returned ${res.statusCode}`));
    }
    let data = [];
    let tests = JSON.parse(body);
    if (process.argv.indexOf('--smoke') > 0) {
      tests = shuffle(tests).slice(0, 1);
    } else {
      // Uncommment and use slice to narrow the test cases run with 'make test'.
      // tests = tests.slice(200, 250);
    }
    tests.forEach(d => {
      data.push(d.itemid);
    });
    resume(null, data);
  });
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
