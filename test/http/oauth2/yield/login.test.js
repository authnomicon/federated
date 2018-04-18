/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/oauth2/yield/login');


describe('http/oauth2/yield/login', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.equal('http://i.bixbyjs.org/http/ceremony/Yield');
    expect(factory['@state']).to.be.equal('login');
    expect(factory['@result']).to.be.equal('oauth2/redirect');
    expect(factory['@singleton']).to.equal(undefined);
  });
  
});
