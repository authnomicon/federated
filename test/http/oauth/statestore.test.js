/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/http/oauth/statestore');
var StateStore = require('../../../lib/oauth/statestore');


describe('http/oauth/auth/state/store', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/sso/oauth/http/RequestTokenStore');
    expect(factory['@singleton']).to.equal(true);
  });
  
  
  describe('StateStore', function() {
    var store = new StateStore();
    
    describe('#store', function() {
      
    });
  });
  
});
