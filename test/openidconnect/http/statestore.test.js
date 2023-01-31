/* global describe, it, expect */

var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../com/openidconnect/http/statestore');
var StateStore = require('../../../lib/openidconnect/statestore');


describe('openidconnect/http/statestore', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('module:passport-openidconnect.StateStore');
    expect(factory['@singleton']).to.equal(true);
  });
  
  it('should construct StateStore', function() {
    var StateStoreSpy = sinon.spy(StateStore);
    var factory = $require('../../../com/openidconnect/http/statestore', {
      '../../../lib/openidconnect/statestore': StateStoreSpy
    });
    
    var store = factory();
    expect(StateStoreSpy).to.have.been.calledOnce;
    expect(StateStoreSpy).to.have.been.calledWithNew;
    expect(store).to.be.an.instanceOf(StateStore);
  });
  
  
  describe('StateStore', function() {
    var store = new StateStore();
    
    describe('#store', function() {
      
    }); // #store
    
    describe('#verify', function() {
      
      
      
      it('should error when state middleware is not in use', function(done) {
        var req = new Object();
      
        store.verify(req, 'af0ifjsldkj', function(err, ctx, info) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('OpenID Connect requires state support. Did you forget to use `flowstate` middleware?');
          expect(ctx).to.be.undefined;
          expect(info).to.be.undefined;
          done();
        });
      }); // should error when state middleware is not in use
      
    }); // #verify
    
  }); // StateStore
  
});
