/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/http/oauth2/statestore');
var StateStore = require('../../../lib/oauth2/statestore');


describe('http/oauth2/statestore', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/federated/oauth2/http/StateStore');
    expect(factory['@singleton']).to.equal(true);
  });
  
  describe('creating with defaults', function() {
    var StateStoreSpy = sinon.spy(StateStore);
    
    var factory = $require('../../../app/http/oauth2/statestore',
      { '../../../lib/oauth2/statestore': StateStoreSpy });
    var store = factory();
    
    it('should construct store', function() {
      expect(StateStoreSpy).to.have.been.calledOnce;
      expect(StateStoreSpy).to.have.been.calledWithNew;
    });
  
    it('should return store', function() {
      expect(store).to.be.an.instanceOf(StateStore);
    });
  });
  
});
