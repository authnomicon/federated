/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/oauth/auth/protocol');


describe('http/oauth/auth/protocol', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@protocol']).to.equal('oauth');
    expect(factory['@singleton']).to.equal(true);
  });
  
});
