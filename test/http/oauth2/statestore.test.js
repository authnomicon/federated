/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/http/oauth2/statestore');
var StateStore = require('../../../lib/oauth2/statestore');


describe('http/oauth2/statestore', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/federated/oauth2/http/StateStore');
  });
  
  describe('creating with defaults', function() {
    var StateStoreSpy = sinon.spy(StateStore);
    var factory = $require('../../../app/http/oauth2/statestore',
      { '../../../lib/oauth2/statestore': StateStoreSpy });
    
    var store = factory();
    
    it('should construct store', function() {
      expect(StateStoreSpy).to.have.been.calledOnce;
      expect(StateStoreSpy).to.have.been.calledWithNew;
    });
  
    it('should return store', function() {
      expect(store).to.be.an.instanceOf(StateStore);
    });
  }); // creating with defaults
  
  
  describe('StateStore', function() {
    var store = new StateStore();
  
    describe('#store', function() {
      
      
      describe.only('with something', function() {
        var req = new Object();
        req.state = new Object();
        req.state.push = sinon.spy();
        req.state.save = sinon.stub(function(cb) {
          process.nextTick(function() {
            req.state.handle = 'xyz';
            cb();
          })
        });
      
        var handle;
      
        before(function(done) {
          var state = { provider: 'https://server.example.com' };
          var meta = {
            authorizationURL: 'https://server.example.com/authorize',
            tokenURL: 'https://server.example.com/token',
            clientID: 's6BhdRkqt3',
            callbackURL: 'https://client.example.com/cb'
          }
          
          store.store(req, state, meta, function(err, h) {
            if (err) { return done(err); }
            handle = h;
            done();
          })
        });
      
        it('should do something', function() {
          expect(handle).to.equal('xyz');
        });
        
      });
      
      
    });
  
  }); // StateStore
  
});
