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
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/federated/oauth/http/RequestTokenStore');
    expect(factory['@singleton']).to.equal(true);
  });
  
  describe('creating with defaults', function() {
    var StateStoreSpy = sinon.spy(StateStore);
    var factory = $require('../../../app/http/oauth/statestore',
      { '../../../lib/oauth/statestore': StateStoreSpy });
    
    var stateStore = new Object();
    var store = factory(stateStore);
    
    it('should construct store', function() {
      expect(StateStoreSpy).to.have.been.calledOnce;
      expect(StateStoreSpy).to.have.been.calledWithNew;
      expect(StateStoreSpy).to.have.been.calledWith(stateStore);
    });
  
    it('should return store', function() {
      expect(store).to.be.an.instanceOf(StateStore);
    });
  }); // creating with defaults
  
  describe('StateStore', function() {
    var store = new StateStore();
    
    describe('#store', function() {
      
    });
  });
  
});
