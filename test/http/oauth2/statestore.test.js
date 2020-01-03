/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/http/oauth2/statestore');


describe('http/oauth2/statestore', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/sso/oauth2/http/StateStore');
    expect(factory['@singleton']).to.equal(true);
  });
  
});
