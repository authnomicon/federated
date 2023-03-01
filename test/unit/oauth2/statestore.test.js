/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var StateStore = require('../../../lib/oauth2/statestore');


describe('oauth2/StateStore', function() {
  
  var store = new StateStore();
  
  describe('#store', function() {
    
    it('should push state and yield handle', function(done) {
      var req = new Object();
      req.pushState = sinon.stub().yieldsAsync(null, 'xyz');
      
      var state = {};
      var meta = {
        authorizationURL: 'https://server.example.com/authorize',
        tokenURL: 'https://server.example.com/token',
        clientID: 's6BhdRkqt3',
        callbackURL: 'https://client.example.com/cb'
      };
      
      store.store(req, state, meta, function(err, handle) {
        if (err) { return done(err); }
        
        expect(req.pushState).to.have.been.calledOnceWith({}, 'https://client.example.com/cb');
        expect(handle).to.equal('xyz');
        done();
      });
    }); // should push state and yield handle
    
    it('should push state with provider and yield handle', function(done) {
      var req = new Object();
      req.pushState = sinon.stub().yieldsAsync(null, 'xyz');
      
      var state = { provider: 'https://server.example.com' };
      var meta = {
        authorizationURL: 'https://server.example.com/authorize',
        tokenURL: 'https://server.example.com/token',
        clientID: 's6BhdRkqt3',
        callbackURL: 'https://client.example.com/cb'
      };
      
      store.store(req, state, meta, function(err, handle) {
        if (err) { return done(err); }
        
        expect(req.pushState).to.have.been.calledOnceWith({
          provider: 'https://server.example.com'
        }, 'https://client.example.com/cb');
        expect(handle).to.equal('xyz');
        done();
      });
    }); // should push state with provider and yield handle
    
    it('should yeild error when pushing state fails', function(done) {
      var req = new Object();
      req.pushState = sinon.stub().yieldsAsync(new Error('something went wrong'));
    
      var state = {};
      var meta = {
        authorizationURL: 'https://server.example.com/authorize',
        tokenURL: 'https://server.example.com/token',
        clientID: 's6BhdRkqt3',
        callbackURL: 'https://client.example.com/cb'
      };
      
      store.store(req, state, meta, function(err, handle) {
        expect(req.pushState).to.have.been.calledOnceWith({}, 'https://client.example.com/cb');
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('something went wrong');
        expect(handle).to.be.undefined;
        done();
      });
    }); // should yeild error when pushing state fails
    
  }); // #store
  
});
