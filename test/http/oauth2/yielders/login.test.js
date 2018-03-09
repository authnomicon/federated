/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/oauth2/yielders/login');


describe('http/oauth2/yielders/login', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.equal('http://i.bixbyjs.org/http/state/yielder');
    expect(factory['@resume']).to.be.equal('login');
    expect(factory['@result']).to.be.equal('oauth2-redirect');
    expect(factory['@singleton']).to.equal(undefined);
  });
  
});
