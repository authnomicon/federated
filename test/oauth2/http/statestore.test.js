/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../com/oauth2/http/statestore');
var StateStore = require('../../../lib/oauth2/statestore');


describe('oauth2/http/statestore', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/federated/oauth2/http/StateStore');
  });
  
  it('should construct StateStore', function() {
    var StateStoreSpy = sinon.spy(StateStore);
    var factory = $require('../../../com/oauth2/http/statestore', {
      '../../../lib/oauth2/statestore': StateStoreSpy
    });
    
    var store = factory();
    expect(StateStoreSpy).to.have.been.calledOnce;
    expect(StateStoreSpy).to.have.been.calledWithNew;
    expect(store).to.be.an.instanceOf(StateStore);
  });
  
  
  describe('StateStore', function() {
    var store = new StateStore();
  
    describe('#store', function() {
      
      it('should push state and yield handle', function(done) {
        var req = new Object();
        req.state = new Object();
        req.pushState = sinon.stub().yieldsAsync(null, 'xyz');
        
        var state = { provider: 'https://server.example.com' };
        var meta = {
          authorizationURL: 'https://server.example.com/authorize',
          tokenURL: 'https://server.example.com/token',
          clientID: 's6BhdRkqt3',
          callbackURL: 'https://client.example.com/cb'
        }
        
        store.store(req, state, meta, function(err, handle) {
          if (err) { return done(err); }
          
          expect(req.pushState).to.have.been.calledOnceWith({
            provider: 'https://server.example.com'
          }, 'https://client.example.com/cb');
          
          expect(handle).to.equal('xyz');
          done();
        });
      }); // should push state and yield handle
      
      it('should yeild error when pushing state fails', function(done) {
        var req = new Object();
        req.state = new Object();
        req.pushState = sinon.stub().yieldsAsync(new Error('something went wrong'));
      
        var state = { provider: 'https://server.example.com' };
        var meta = {
          authorizationURL: 'https://server.example.com/authorize',
          tokenURL: 'https://server.example.com/token',
          clientID: 's6BhdRkqt3',
          callbackURL: 'https://client.example.com/cb'
        }
        
        store.store(req, state, meta, function(err, handle) {
          expect(req.pushState).to.have.been.calledOnceWith({
            provider: 'https://server.example.com'
          }, 'https://client.example.com/cb');
          
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('something went wrong');
          expect(handle).to.be.undefined;
          done();
        });
      }); // should yeild error when pushing state fails
      
    }); // #store
    
    describe('#verify', function() {
      
      it('should verify state', function(done) {
        var req = new Object();
        req.params = {
          hostname: 'server.example.com'
        };
        req.query = {
          code: 'SplxlOBeZQQYbYS6WxSbIA',
          state: 'xyz'
        };
        req.state = new Object();
        req.state.provider = 'https://server.example.com';
        req.state.complete = sinon.spy();
        
        store.verify(req, 'xyz', function(err, ok, state) {
          if (err) { return done(err); }
          
          expect(req.state.complete).to.have.been.calledOnce;
          
          expect(ok).to.be.true;
          expect(state).to.be.undefined;
          done();
        });
      }); // should verify state
      
      it('failing to verify state due to lack of state', function(done) {
        var req = new Object();
      
        store.verify(req, 'xyz', function(err, ok, info) {
          if (err) { return done(err); }
          
          expect(ok).to.be.false;
          expect(info).to.deep.equal({
            message: 'Unable to verify authorization request state.'
          });
          
          done();
        });
      }); // failing to verify state due to lack of state
      
      describe('failing to verify state due to mix-up attack', function() {
        var req = new Object();
        req.params = {
          hostname: 'server.example.net'
        };
        req.query = {
          code: 'SplxlOBeZQQYbYS6WxSbIA',
          state: 'xyz'
        };
        req.state = {
          location: 'https://client.example.com/cb',
          provider: 'https://server.example.com'
        };
      
        var ok, info;
      
        before(function(done) {
          store.verify(req, 'xyz', function(err, rv, i) {
            if (err) { return done(err); }
            ok = rv;
            info = i;
            done();
          });
        });
      
        it('should fail', function() {
          expect(ok).to.be.false;
          expect(info).to.deep.equal({
            message: 'Authorization response received from incorrect authorization server.'
          });
        });
      }); // failing to verify state due to mix-up attack
      
    }); // #verify
  
  }); // StateStore
  
});
