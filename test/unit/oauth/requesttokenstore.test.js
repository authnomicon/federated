/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var RequestTokenStore = require('../../../lib/oauth/requesttokenstore');


describe('oauth/RequestTokenStore', function() {
  
  var store = new RequestTokenStore();
  
  describe('#get', function() {
    
    it('should get token secret', function(done) {
      var req = new Object();
      req.state = {
        tokenSecret: 'hdhd0244k9j7ao03'
      };
    
      store.get(req, 'hh5s93j4hdidpola', function(err, tokenSecret) {
        if (err) { return done(err); }
        expect(tokenSecret).to.equal('hdhd0244k9j7ao03')
        done();
      });
    }); // should get token secret
    
    it('should error when flowstate middleware is not in use', function(done) {
      var req = new Object();
      
      store.get(req, 'hh5s93j4hdidpola', function(err, tokenSecret) {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('OAuth requires state support. Did you forget to use `flowstate` middleware?');
        expect(tokenSecret).to.be.undefined;
        done();
      });
    }); // should error when flowstate middleware is not in use
    
  }); // #get
  
  describe('#set', function() {
    
    it('should push state and yield handle', function(done) {
      var req = new Object();
      req.pushState = sinon.stub().yieldsAsync(null, 'oauth_hh5s93j4hdidpola');
      
      var state = {};
      var meta = {
        requestTokenURL: 'https://photos.example.net/request_token',
        accessTokenURL: 'https://photos.example.net/access_token',
        userAuthorizationURL: 'http://photos.example.net/authorize',
        consumerKey: 'dpf43f3p2l4k3l03',
        callbackURL: 'http://printer.example.com/request_token_ready'
      };
      
      store.set(req, 'hh5s93j4hdidpola', 'hdhd0244k9j7ao03', state, meta, function(err, handle) {
        if (err) { return done(err); }
        
        expect(req.pushState).to.have.been.calledOnceWith({
          tokenSecret: 'hdhd0244k9j7ao03'
        }, 'http://printer.example.com/request_token_ready',
        { handle: 'oauth_hh5s93j4hdidpola' });
        expect(handle).to.equal('oauth_hh5s93j4hdidpola');
        done();
      });
    }); // should push state and yield handle
    
    it('should push state with provider and yield handle', function(done) {
      var req = new Object();
      req.pushState = sinon.stub().yieldsAsync(null, 'oauth_hh5s93j4hdidpola');
    
      var state = { provider: 'https://photos.example.net' };
      var meta = {
        requestTokenURL: 'https://photos.example.net/request_token',
        accessTokenURL: 'https://photos.example.net/access_token',
        userAuthorizationURL: 'http://photos.example.net/authorize',
        consumerKey: 'dpf43f3p2l4k3l03',
        callbackURL: 'http://printer.example.com/request_token_ready'
      };
      
      store.set(req, 'hh5s93j4hdidpola', 'hdhd0244k9j7ao03', state, meta, function(err, handle) {
        if (err) { return done(err); }
        
        expect(req.pushState).to.have.been.calledOnceWith({
          provider: 'https://photos.example.net',
          tokenSecret: 'hdhd0244k9j7ao03'
        }, 'http://printer.example.com/request_token_ready',
        { handle: 'oauth_hh5s93j4hdidpola' });
        expect(handle).to.equal('oauth_hh5s93j4hdidpola');
        done();
      });
    }); // should push state with provider and yield handle
    
    it('should push state to provider-specific callback URL', function(done) {
      var req = new Object();
      req.pushState = sinon.stub().yieldsAsync(null, 'oauth_photos_hh5s93j4hdidpola');
      
      var state = {};
      var meta = {
        requestTokenURL: 'https://photos.example.net/request_token',
        accessTokenURL: 'https://photos.example.net/access_token',
        userAuthorizationURL: 'http://photos.example.net/authorize',
        consumerKey: 'dpf43f3p2l4k3l03',
        callbackURL: 'http://www.example.com/oauth/callback/photos'
      };
      
      store.set(req, 'hh5s93j4hdidpola', 'hdhd0244k9j7ao03', state, meta, function(err, handle) {
        if (err) { return done(err); }
        
        expect(req.pushState).to.have.been.calledOnceWith({
          tokenSecret: 'hdhd0244k9j7ao03'
        }, 'http://www.example.com/oauth/callback/photos',
        { handle: 'oauth_photos_hh5s93j4hdidpola' });
        expect(handle).to.equal('oauth_photos_hh5s93j4hdidpola');
        done();
      });
    }); // should push state to provider-specific callback URL
    
    it('should yeild error when pushing state fails', function(done) {
      var req = new Object();
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
        { handle: 'oauth_hh5s93j4hdidpola' });
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('something went wrong');
        expect(handle).to.be.undefined;
        done();
      });
    }); // should yeild error when pushing state fails
    
  }); // #set
  
  describe('#destroy', function() {
    
    it('should complete state', function(done) {
      var req = new Object();
      req.state = new Object();
      req.state.complete = sinon.spy();
    
      store.destroy(req, 'hh5s93j4hdidpola', function(err) {
        if (err) { return done(err); }
        expect(req.state.complete).to.have.been.calledOnce;
        done();
      });
    }); // should complete state
    
  }); // #destroy
  
});
