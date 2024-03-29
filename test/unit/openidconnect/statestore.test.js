/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var StateStore = require('../../../lib/openidconnect/statestore');


describe('openidconnect/StateStore', function() {
  
  var store = new StateStore();
  
  describe('#store', function() {
    
    it('should push state and yield handle', function(done) {
      var req = new Object();
      req.pushState = sinon.stub().yieldsAsync(null, 'af0ifjsldkj');
    
      var ctx = {};
      var state = {};
      var meta = {
        issuer: 'https://server.example.com',
        authorizationURL: 'https://server.example.com/authorize',
        tokenURL: 'https://server.example.com/token',
        clientID: 's6BhdRkqt3',
        callbackURL: 'https://client.example.com/cb'
      };
    
      store.store(req, ctx, state, meta, function(err, handle) {
        if (err) { return done(err); }
      
        expect(req.pushState).to.have.been.calledOnceWith({
          protocol: 'openidconnect'
        }, 'https://client.example.com/cb');
        expect(handle).to.equal('af0ifjsldkj');
        done();
      });
    }); // should push state and yield handle
    
    it('should push state with provider and yield handle', function(done) {
      var req = new Object();
      req.pushState = sinon.stub().yieldsAsync(null, 'af0ifjsldkj');
    
      var ctx = {};
      var state = { provider: 'https://server.example.com' };
      var meta = {
        issuer: 'https://server.example.com',
        authorizationURL: 'https://server.example.com/authorize',
        tokenURL: 'https://server.example.com/token',
        clientID: 's6BhdRkqt3',
        callbackURL: 'https://client.example.com/cb'
      };
    
      store.store(req, ctx, state, meta, function(err, handle) {
        if (err) { return done(err); }
      
        expect(req.pushState).to.have.been.calledOnceWith({
          provider: 'https://server.example.com',
          protocol: 'openidconnect'
        }, 'https://client.example.com/cb');
        expect(handle).to.equal('af0ifjsldkj');
        done();
      });
    }); // should push state with provider and yield handle
    
    it('should push state with nonce and yield handle', function(done) {
      var req = new Object();
      req.pushState = sinon.stub().yieldsAsync(null, 'af0ifjsldkj');
    
      var ctx = { nonce: 'n-0S6_WzA2Mj' };
      var state = { provider: 'https://server.example.com' };
      var meta = {
        issuer: 'https://server.example.com',
        authorizationURL: 'https://server.example.com/authorize',
        tokenURL: 'https://server.example.com/token',
        clientID: 's6BhdRkqt3',
        callbackURL: 'https://client.example.com/cb'
      };
    
      store.store(req, ctx, state, meta, function(err, handle) {
        if (err) { return done(err); }
      
        expect(req.pushState).to.have.been.calledOnceWith({
          provider: 'https://server.example.com',
          protocol: 'openidconnect',
          nonce: 'n-0S6_WzA2Mj'
        }, 'https://client.example.com/cb');
        expect(handle).to.equal('af0ifjsldkj');
        done();
      });
    }); // should push state with nonce and yield handle
    
    it('should push state with max age and yield handle', function(done) {
      var req = new Object();
      req.pushState = sinon.stub().yieldsAsync(null, 'af0ifjsldkj');
    
      var ctx = { maxAge: 86400, issued: new Date('2011-07-21T20:42:50.000Z') };
      var state = { provider: 'https://server.example.com' };
      var meta = {
        issuer: 'https://server.example.com',
        authorizationURL: 'https://server.example.com/authorize',
        tokenURL: 'https://server.example.com/token',
        clientID: 's6BhdRkqt3',
        callbackURL: 'https://client.example.com/cb'
      };
    
      store.store(req, ctx, state, meta, function(err, handle) {
        if (err) { return done(err); }
      
        expect(req.pushState).to.have.been.calledOnceWith({
          provider: 'https://server.example.com',
          protocol: 'openidconnect',
          maxAge: 86400,
          issued: new Date('2011-07-21T20:42:50.000Z')
        }, 'https://client.example.com/cb');
        expect(handle).to.equal('af0ifjsldkj');
        done();
      });
    }); // should push state with max age and yield handle
    
    it('should yeild error when pushing state fails', function(done) {
      var req = new Object();
      req.pushState = sinon.stub().yieldsAsync(new Error('something went wrong'));
    
      var ctx = {};
      var state = {};
      var meta = {
        issuer: 'https://server.example.com',
        authorizationURL: 'https://server.example.com/authorize',
        tokenURL: 'https://server.example.com/token',
        clientID: 's6BhdRkqt3',
        callbackURL: 'https://client.example.com/cb'
      };
    
      store.store(req, ctx, state, meta, function(err, handle) {
        expect(req.pushState).to.have.been.calledOnceWith({
          protocol: 'openidconnect'
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
      req.state = new Object();
      req.state.complete = sinon.spy();
      
      store.verify(req, 'af0ifjsldkj', function(err, ctx) {
        if (err) { return done(err); }
        
        expect(req.state.complete).to.have.been.calledOnce;
        expect(ctx).to.deep.equal({});
        done();
      });
    }); // should verify state
    
    it('should verify state with nonce', function(done) {
      var req = new Object();
      req.state = new Object();
      req.state.complete = sinon.spy();
      req.state.nonce = 'n-0S6_WzA2Mj';
      
      store.verify(req, 'af0ifjsldkj', function(err, ctx) {
        if (err) { return done(err); }
        
        expect(req.state.complete).to.have.been.calledOnce;
        
        expect(ctx).to.deep.equal({
          nonce: 'n-0S6_WzA2Mj'
        });
        done();
      });
    }); // should verify state with nonce
    
    it('should verify state with max age', function(done) {
      var req = new Object();
      req.state = new Object();
      req.state.complete = sinon.spy();
      req.state.nonce = 'n-0S6_WzA2Mj';
      req.state.maxAge = 86400;
      req.state.issued = new Date('2011-07-21T20:42:50.000Z');
      
      store.verify(req, 'af0ifjsldkj', function(err, ctx) {
        if (err) { return done(err); }
        
        expect(req.state.complete).to.have.been.calledOnce;
        
        expect(ctx).to.deep.equal({
          nonce: 'n-0S6_WzA2Mj',
          maxAge: 86400,
          issued: new Date('2011-07-21T20:42:50.000Z')
        });
        done();
      });
    }); // should verify state with max age
    
    it('should verify state with max age', function(done) {
      var req = new Object();
      req.state = new Object();
      req.state.complete = sinon.spy();
      req.state.nonce = 'n-0S6_WzA2Mj';
      req.state.maxAge = 86400;
      req.state.issued = new Date('2011-07-21T20:42:50.000Z');
      
      store.verify(req, 'af0ifjsldkj', function(err, ctx) {
        if (err) { return done(err); }
        
        expect(req.state.complete).to.have.been.calledOnce;
        
        expect(ctx).to.deep.equal({
          nonce: 'n-0S6_WzA2Mj',
          maxAge: 86400,
          issued: new Date('2011-07-21T20:42:50.000Z')
        });
        done();
      });
    }); // should verify state with max age
    
    it('should verify state with max age where issued is a string', function(done) {
      var req = new Object();
      req.state = new Object();
      req.state.complete = sinon.spy();
      req.state.nonce = 'n-0S6_WzA2Mj';
      req.state.maxAge = 86400;
      req.state.issued = '2011-07-21T20:42:50.000Z';
      
      store.verify(req, 'af0ifjsldkj', function(err, ctx) {
        if (err) { return done(err); }
        
        expect(req.state.complete).to.have.been.calledOnce;
        
        expect(ctx).to.deep.equal({
          nonce: 'n-0S6_WzA2Mj',
          maxAge: 86400,
          issued: new Date('2011-07-21T20:42:50.000Z')
        });
        done();
      });
    }); // should verify state with max age where issued is a string
    
    it('should yield error when state middleware is not in use', function(done) {
      var req = new Object();
    
      store.verify(req, 'af0ifjsldkj', function(err, ctx, state) {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('OpenID Connect requires state support. Did you forget to use `flowstate` middleware?');
        expect(ctx).to.be.undefined;
        expect(state).to.be.undefined;
        done();
      });
    }); // should yield error when state middleware is not in use
    
  }); // #verify
  
});
