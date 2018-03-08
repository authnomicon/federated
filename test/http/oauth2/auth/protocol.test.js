/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/oauth2/auth/protocol');


describe('http/oauth2/auth/protocol', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@protocol']).to.equal('oauth2');
    expect(factory['@singleton']).to.equal(true);
  });
  
});
