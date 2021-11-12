/* global describe, it, expect */

var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../com/oauth/http/requesttokenstore');
var RequestTokenStore = require('../../../lib/oauth/requesttokenstore');


describe('oauth/http/requesttokenstore', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/federated/oauth/http/RequestTokenStore');
    expect(factory['@singleton']).to.equal(true);
  });
  
  it('should construct RequestTokenStore', function() {
    var RequestTokenStoreSpy = sinon.spy(RequestTokenStore);
    var factory = $require('../../../com/oauth/http/requesttokenstore', {
      '../../../lib/oauth/requesttokenstore': RequestTokenStoreSpy
    });
    
    var store = factory();
    expect(RequestTokenStoreSpy).to.have.been.calledOnce;
    expect(RequestTokenStoreSpy).to.have.been.calledWithNew;
    expect(store).to.be.an.instanceOf(RequestTokenStore);
  });
  
  
  describe('RequestTokenStore', function() {
    var store = new RequestTokenStore();
    
    describe('#get', function() {
      
      it('should get token secret', function(done) {
        var req = new Object();
        req.query = {
          oauth_token: 'hh5s93j4hdidpola',
        };
        req.state = {
          tokenSecret: 'hdhd0244k9j7ao03'
        };
      
        store.get(req, 'hh5s93j4hdidpola', function(err, tokenSecret) {
          if (err) { return done(err); }
          expect(tokenSecret).to.equal('hdhd0244k9j7ao03')
          done();
        });
      }); // should get token secret
      
      it('should error when state middleware is not in use', function(done) {
        var req = new Object();
        
        store.get(req, 'hh5s93j4hdidpola', function(err, tokenSecret, info) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('OAuth requires state support. Did you forget to use `flowstate` middleware?');
          expect(tokenSecret).to.be.undefined;
          expect(info).to.be.undefined;
          done();
        });
      }); // should error when state middleware is not in use
      
    }); // #get
    
    describe('#set', function() {
      
      it('should push state and yield handle', function(done) {
        var req = new Object();
        req.state = new Object();
        req.pushState = sinon.stub().yieldsAsync(null, 'oauth:photos.example.net:hh5s93j4hdidpola');
        
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
      }); // should push state and yield handle
      
      it('should push state with provider and yield handle', function(done) {
        var req = new Object();
        req.state = new Object();
        req.pushState = sinon.stub().yieldsAsync(null, 'oauth:photos.example.net:hh5s93j4hdidpola');
      
        var state = { provider: 'https://photos.example.net' };
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
            provider: 'https://photos.example.net',
            tokenSecret: 'hdhd0244k9j7ao03'
          }, 'http://printer.example.com/request_token_ready',
          { handle: 'oauth:photos.example.net:hh5s93j4hdidpola' });
          
          expect(handle).to.equal('oauth:photos.example.net:hh5s93j4hdidpola');
          done();
        });
      }); // should push state with provider and yield handle
      
      it('should yeild error when pushing state fails', function(done) {
        var req = new Object();
        req.state = new Object();
        req.pushState = sinon.stub().yieldsAsync(new Error('something went wrong'));
      
        var state = {};
        var meta = {
          requestTokenURL: 'https://photos.example.net/request_token',
          accessTokenURL: 'https://photos.example.net/access_token',
          userAuthorizationURL: 'http://photos.example.net/authorize',
          consumerKey: 'dpf43f3p2l4k3l03',
          callbackURL: 'http://printer.example.com/request_token_ready'
        }
        
        store.set(req, 'hh5s93j4hdidpola', 'hdhd0244k9j7ao03', state, meta, function(err, handle) {
          expect(req.pushState).to.have.been.calledOnceWith({
            tokenSecret: 'hdhd0244k9j7ao03'
          }, 'http://printer.example.com/request_token_ready',
          { handle: 'oauth:photos.example.net:hh5s93j4hdidpola' });
          
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('something went wrong');
          expect(handle).to.be.undefined;
          done();
        });
      }); // should yeild error when pushing state fails
      
    }); // #set
  });
  
});
