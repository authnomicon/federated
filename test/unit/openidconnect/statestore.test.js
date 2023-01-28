/* global describe, it, expect */

var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../com/openidconnect/http/statestore');
var StateStore = require('../../../lib/openidconnect/statestore');


describe('openidconnect/StateStore', function() {
  
  var store = new StateStore();
  
  describe('#store', function() {
    
    it('should push state and yield handle', function(done) {
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
      }
    
      store.store(req, ctx, state, meta, function(err, handle) {
        if (err) { return done(err); }
      
        expect(req.pushState).to.have.been.calledOnceWith({
          provider: 'https://server.example.com',
          protocol: 'openidconnect'
        }, 'https://client.example.com/cb');
      
        expect(handle).to.equal('af0ifjsldkj');
        done();
      });
    }); // should push state and yield handle
    
  });
  
});
