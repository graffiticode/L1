const {expect} = require('chai');
const {compiler} = require('./../app');
describe('app', () => {
  it('global.config.unused should be true', () => {
    expect(global.config.unused).to.equal(true);
  });
  it('should export compiler', () => {
    expect(compiler).to.be.have.property('language');
    expect(compiler).to.be.have.property('auth');
    expect(compiler).to.be.have.property('compile');
  });
});
