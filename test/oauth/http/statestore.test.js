/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/oauth/http/statestore');
var StateStore = require('../../../lib/oauth/statestore');


describe('oauth/http/requesttokenstore', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/federated/oauth/http/RequestTokenStore');
    expect(factory['@singleton']).to.equal(true);
  });
  
  describe('creating with defaults', function() {
    var StateStoreSpy = sinon.spy(StateStore);
    var factory = $require('../../../app/oauth/http/statestore',
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
    
    describe('#get', function() {
      var store = new StateStore();
      
      describe('getting token secret', function() {
        var req = new Object();
        req.params = {
          hostname: 'sp.example.com'
        };
        req.query = {
          oauth_token: 'hh5s93j4hdidpola',
        };
        req.state = {
          location: 'https://client.example.com/cb',
          provider: 'https://server.example.com',
          tokenSecret: 'hdhd0244k9j7ao03'
        };
      
        var tokenSecret;
      
        before(function(done) {
          store.get(req, 'hh5s93j4hdidpola', function(err, ts) {
            if (err) { return done(err); }
            tokenSecret = ts;
            done();
          });
        });
      
        it('should yield token secret', function() {
          expect(tokenSecret).to.equal('hdhd0244k9j7ao03')
        });
      }); // getting token secret
      
      describe('failing to get token secret due to lack of state', function() {
        var req = new Object();
      
        var tokenSecret, info;
      
        before(function(done) {
          store.get(req, 'hh5s93j4hdidpola', function(err, ts, i) {
            if (err) { return done(err); }
            tokenSecret = ts;
            info = i;
            done();
          });
        });
      
        it('should fail', function() {
          expect(tokenSecret).to.be.false;
          expect(info).to.deep.equal({
            message: 'Unable to obtain request token secret.'
          });
        });
      }); // failing to get token secret due to lack of state
      
    }); // #get
    
    describe('#set', function() {
      
      describe('setting token secret', function() {
        var _store = new Object();
        _store.save = sinon.spy(function(req, state, options, cb) {
          process.nextTick(function() {
            cb(null, 'XXXXXXXX');
          })
        });
        
        var store = new StateStore(_store);
        
        var req = new Object();
        req.state = new Object();
        req.state.push = sinon.spy();
      
        before(function(done) {
          var state = {};
          var meta = {
            requestTokenURL: 'https://sp.example.com/request_token',
            accessTokenURL: 'https://sp.example.com/access_token',
            userAuthorizationURL: 'http://sp.example.com/authorize',
            consumerKey: 'dpf43f3p2l4k3l03',
            callbackURL: 'http://client.example.com/request_token_ready'
          }
          
          store.set(req, 'hh5s93j4hdidpola', 'hdhd0244k9j7ao03', state, meta, function(err, h) {
            if (err) { return done(err); }
            done();
          });
        });
      
        it('should push state for callback endpoint', function() {
          expect(req.state.push).to.have.been.calledOnceWith({
            location: 'http://client.example.com/request_token_ready',
            tokenSecret: 'hdhd0244k9j7ao03'
          });
        });
      
        it('should save state with handle', function() {
          expect(_store.save).to.have.been.calledOnceWith(req, req.state, { handle: 'oauth:sp.example.com:hh5s93j4hdidpola' });
        });
      }); // setting token secret
      
      describe('setting token secret with provider', function() {
        var _store = new Object();
        _store.save = sinon.spy(function(req, state, options, cb) {
          process.nextTick(function() {
            cb(null, 'XXXXXXXX');
          })
        });
        
        var store = new StateStore(_store);
        
        var req = new Object();
        req.state = new Object();
        req.state.push = sinon.spy();
      
        before(function(done) {
          var state = { provider: 'http://sp.example.com' };
          var meta = {
            requestTokenURL: 'https://api.example.com/request_token',
            accessTokenURL: 'https://api.example.com/access_token',
            userAuthorizationURL: 'http://api.example.com/authorize',
            consumerKey: 'dpf43f3p2l4k3l03',
            callbackURL: 'http://client.example.com/request_token_ready'
          }
          
          store.set(req, 'hh5s93j4hdidpola', 'hdhd0244k9j7ao03', state, meta, function(err) {
            if (err) { return done(err); }
            done();
          });
        });
      
        it('should push state for callback endpoint', function() {
          expect(req.state.push).to.have.been.calledOnceWith({
            location: 'http://client.example.com/request_token_ready',
            provider: 'http://sp.example.com',
            tokenSecret: 'hdhd0244k9j7ao03'
          });
        });
      
        it('should save state with handle', function() {
          expect(_store.save).to.have.been.calledOnceWith(req, req.state, { handle: 'oauth:sp.example.com:hh5s93j4hdidpola' });
        });
      }); // setting token secret with provider
      
      describe('failing to set token secret', function() {
        var _store = new Object();
        _store.save = sinon.spy(function(req, state, options, cb) {
          process.nextTick(function() {
            cb(new Error('something went wrong'));
          })
        });
        
        var store = new StateStore(_store);
        
        var req = new Object();
        req.state = new Object();
        req.state.push = sinon.spy();
      
        var error;
      
        before(function(done) {
          var state = {};
          var meta = {
            requestTokenURL: 'https://sp.example.com/request_token',
            accessTokenURL: 'https://sp.example.com/access_token',
            userAuthorizationURL: 'http://sp.example.com/authorize',
            consumerKey: 'dpf43f3p2l4k3l03',
            callbackURL: 'http://client.example.com/request_token_ready'
          }
          
          store.set(req, 'hh5s93j4hdidpola', 'hdhd0244k9j7ao03', state, meta, function(err) {
            error = err;
            done();
          });
        });
      
        it('should push state for callback endpoint', function() {
          expect(req.state.push).to.have.been.calledOnceWith({
            location: 'http://client.example.com/request_token_ready',
            tokenSecret: 'hdhd0244k9j7ao03'
          });
        });
      
        it('should yield error', function() {
          expect(error).to.be.an.instanceOf(Error);
          expect(error.message).to.equal('something went wrong');
        });
      }); // failing to set token secret
      
    }); // #set
  });
  
});
