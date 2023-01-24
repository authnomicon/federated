/* global describe, it, expect */

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../com/oauth/http/handlers/callback');
var utils = require('../../../utils');


describe('oauth/http/handlers/callback', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    
    describe('federating with provider', function() {
      var actions = new Object();
      actions.dispatch = sinon.spy(function(name, err, req, res, next) {
        next();
      });
      
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp)
      
      function authenticate(idp, options) {
        return function(req, res, next) {
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
        var handler = factory(actions, idpFactory, { authenticate: authenticateSpy }, stateSpy);
        
        chai.express.use(handler)
          .request(function(req, res) {
            request = req;
            request.params = { hostname: 'twitter.com' };
            request.query = { oauth_token: 'XXXXXXXX' };
            request.session = {};
            request.session.state = {};
            request.session.state['oauth_twitter.com_XXXXXXXX'] = { provider: 'http://sp.example.com' };
            
            res.resumeState = sinon.spy(function(cb) {
              if (request.state.returnTo) {
                return this.redirect(request.state.returnTo);
              }
              
              process.nextTick(cb);
            });
            
            response = res;
          })
          .finish(function() {
            done();
          })
          .listen();
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
      
      it('should dispatch action', function() {
        expect(actions.dispatch).to.be.calledOnce;
        expect(actions.dispatch).to.be.calledWith('login', null, request, response);
      });
      
      it('should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('/');
      });
    }); // federating with provider
    
  });
  
});
