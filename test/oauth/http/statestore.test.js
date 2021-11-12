/* global describe, it, expect */

var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../com/oauth/http/statestore');
var RequestTokenStore = require('../../../lib/oauth/statestore');


describe('oauth/http/requesttokenstore', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/federated/oauth/http/RequestTokenStore');
    expect(factory['@singleton']).to.equal(true);
  });
  
  it('should construct RequestTokenStore', function() {
    var RequestTokenStoreSpy = sinon.spy(RequestTokenStore);
    var factory = $require('../../../com/oauth/http/statestore', {
      '../../../lib/oauth/statestore': RequestTokenStoreSpy
    });
    
    var store = factory();
    expect(RequestTokenStoreSpy).to.have.been.calledOnce;
    expect(RequestTokenStoreSpy).to.have.been.calledWithNew;
    expect(store).to.be.an.instanceOf(RequestTokenStore);
  });
  
  
  describe('RequestTokenStore', function() {
    var store = new RequestTokenStore();
    
    describe('#get', function() {
      
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
      
      it('should push state and yield handle', function(done) {
        var req = new Object();
        req.state = new Object();
        req.pushState = sinon.stub().yieldsAsync(null, 'oauth:photos.example.net:hh5s93j4hdidpola');
      
        //var state = { provider: 'https://photos.example.net' };
        var state = {};
        var meta = {
          requestTokenURL: 'https://photos.example.net/request_token',
          accessTokenURL: 'https://photos.example.net/access_token',
          userAuthorizationURL: 'http://photos.example.net/authorize',
          consumerKey: 'dpf43f3p2l4k3l03',
          callbackURL: 'http://printer.example.com/request_token_ready'
        }
        
        store.set(req, 'hh5s93j4hdidpola', 'hdhd0244k9j7ao03', state, meta, function(err, handle) {
          if (err) { return done(err); }
          
          expect(req.pushState).to.have.been.calledOnceWith({
            tokenSecret: 'hdhd0244k9j7ao03'
          }, 'http://printer.example.com/request_token_ready',
          { handle: 'oauth:photos.example.net:hh5s93j4hdidpola' });
          
          expect(handle).to.equal('oauth:photos.example.net:hh5s93j4hdidpola');
          done();
        });
      }); // setting token secret
      
      // FIXME: Re-enable this test
      describe.skip('setting token secret with provider', function() {
        var _store = new Object();
        _store.save = sinon.spy(function(req, state, options, cb) {
          process.nextTick(function() {
            cb(null, 'XXXXXXXX');
          })
        });
        
        var store = new RequestTokenStore(_store);
        
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
      
      // FIXME: Re-enable this test
      describe.skip('failing to set token secret', function() {
        var _store = new Object();
        _store.save = sinon.spy(function(req, state, options, cb) {
          process.nextTick(function() {
            cb(new Error('something went wrong'));
          })
        });
        
        var store = new RequestTokenStore(_store);
        
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
