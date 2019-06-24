// JSDOM setup
const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};
copyProps(window, global);

// Enzyme setup
const { configure } = require('enzyme'); // note: must require enzyme after putting JSDOM props on global with React14
const Adapter = require('enzyme-adapter-react-16');

configure({ adapter: new Adapter() });

// this is needed for viewer and can't be done in the test file since it needs to be there before Viewer is required
window.gcexports = {};
