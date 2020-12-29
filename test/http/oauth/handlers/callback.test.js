/* global describe, it, expect */

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/oauth/handlers/callback');
var utils = require('../../../utils');


describe('http/oauth/handlers/callback', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    
    /*
    function ceremony(stack) {
      var stack = Array.prototype.slice.call(arguments, 0), options;
      if (typeof stack[stack.length - 1] == 'object' && !Array.isArray(stack[stack.length - 1])) {
        options = stack.pop();
      }
      options = options || {};
      
      return function(req, res, next) {
        var h = options.getHandle(req);
        req.state = req.session.state[h];
        utils.dispatch(stack)(null, req, res, next);
      };
    }
    
    function authenticate(idp, options) {
      // TODO: Get rid of authenticate array notation
      return [null, function(req, res, next) {
        req.login = function(user, cb) {
          process.nextTick(function() {
            req.session.user = user;
            cb();
          });
        };
        
        req[options.assignProperty] = { id: '248289761001', displayName: 'Jane Doe' };
        req.authInfo = { idp: idp };
        next();
      }];
    }
    
    var IDPFactory = {
      create: function(){}
    }
    
    
    describe('signing on', function() {
      var request, response
        , idp;
      
      before(function() {
        idp = new Object();
        sinon.stub(IDPFactory, 'create').resolves(idp);
      });
      
      before(function(done) {
        var handler = factory(IDPFactory, authenticate, ceremony);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            request.query = { oauth_token: 'XXXXXXXX', oauth_verifier: 'VVVVVVVV' };
            request.session = {};
            request.session.state = {};
            request.session.state['oauth_XXXXXXXX'] = { provider: 'http://server.example.com' };
          })
          .res(function(res) {
            response = res;
          })
          .next(function(err) {
            done(err);
          })
          .dispatch();
      });
      
      it('should authenticate with IDP', function() {
        expect(IDPFactory.create).to.have.been.calledWith('http://server.example.com');
        expect(request.federatedUser).to.deep.equal({
          id: '248289761001',
          displayName: 'Jane Doe'
        });
        expect(request.authInfo).to.deep.equal({
          idp: idp
        });
      });
      
      it('should establish session', function() {
        expect(request.session.user).to.deep.equal({
          id: '248289761001',
          displayName: 'Jane Doe'
        });
      });
      
      it('should respond', function() {
        expect(response.statusCode).to.equal(200);
      });
    }); // signing on
    */
    
    describe('federating with provider', function() {
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp)
      
      function authenticate(idp, options) {
        return function(req, res, next) {
          req.login = function(user, cb) {
            process.nextTick(function() {
              req.session.user = user;
              cb();
            });
          };
          
          req.federatedUser = { id: '248289761001', displayName: 'Jane Doe' };
          next();
        };
      }
      
      function state(options) {
        return function(req, res, next) {
          var h = options.getHandle(req);
          req.state = req.session.state[h];
          next();
        };
      }
      
      var authenticateSpy = sinon.spy(authenticate);
      var stateSpy = sinon.spy(state);
      
      
      var request, response;
      
      before(function(done) {
        var handler = factory(idpFactory, authenticateSpy, stateSpy);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            request.query = { oauth_token: 'XXXXXXXX' };
            request.session = {};
            request.session.state = {};
            request.session.state['oauth_XXXXXXXX'] = { provider: 'http://sp.example.com' };
          })
          .res(function(res) {
            response = res;
            
            res.resumeState = sinon.spy(function(cb) {
              if (request.state.returnTo) {
                return this.redirect(request.state.returnTo);
              }
              
              process.nextTick(cb);
            });
          })
          .end(function() {
            done();
          })
          .dispatch();
      });
      
      it('should setup middleware', function() {
        expect(stateSpy).to.be.calledOnce;
      });
      
      it('should create identity provider', function() {
        expect(idpFactory.create).to.be.calledOnce;
        expect(idpFactory.create).to.be.calledWithExactly('http://sp.example.com', 'oauth', {});
      });
      
      it('should authenticate with identity provider', function() {
        expect(authenticateSpy).to.be.calledOnce;
        expect(authenticateSpy).to.be.calledWithExactly(idp, { assignProperty: 'federatedUser' });
      });
      
      it('should establish session', function() {
        expect(request.session.user).to.deep.equal({
          id: '248289761001',
          displayName: 'Jane Doe'
        });
      });
      
      it('should resume state', function() {
        expect(response.resumeState).to.be.calledOnceWith();
      });
      
      it('should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('/');
      });
    }); // federating with provider
    
  });
  
});
