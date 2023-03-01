var chai = require('chai');
var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../../com/oauth/http/handlers/callback');
var utils = require('../../../utils');


describe('oauth/http/handlers/callback', function() {
  
  it('should return handler', function() {
    var flowstateSpy = sinon.spy();
    var factory = $require('../../../../com/oauth/http/handlers/callback', {
      'flowstate': flowstateSpy
    });
    
    var idpFactory = new Object();
    var authenticator = new Object();
    var store = new Object();
    var handler = factory(undefined, idpFactory, authenticator, store);
    
    expect(handler).to.be.an('array');
    expect(flowstateSpy).to.be.calledOnce;
    expect(flowstateSpy.firstCall.args[0].mutationMethods).to.deep.equal([ 'GET' ]);
    expect(flowstateSpy.firstCall.args[0].store).to.equal(store);
  });
  
  describe('handler', function() {
    
    function authenticate(idp, options) {
      return function(req, res, next) {
        next();
      };
    }
    
    it('should federate with provider', function(done) {
      var actions = new Object();
      actions.dispatch = sinon.stub().yieldsAsync(null);
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp);
      var authenticateSpy = sinon.spy(authenticate);
      var store = new Object();
      store.get = sinon.stub().yieldsAsync(null, {
        location: 'https://www.example.com/oauth/callback',
        provider: 'http://sp.example.com'
      });
      store.destroy = sinon.stub().yieldsAsync();
      
      
      var handler = factory(actions, idpFactory, { authenticate: authenticateSpy }, store);
    
      chai.express.use(handler)
        .request(function(req, res) {
          req.connection = { encrypted: true };
          req.method = 'GET';
          req.url = '/oauth/callback';
          req.headers.host = 'www.example.com';
          req.params = { hostname: 'twitter.com' };
          req.query = { oauth_token: 'XXXXXXXX' };
          req.session = {};
          req.session.state = {};
          req.session.state['oauth_twitter.com_XXXXXXXX'] = { provider: 'http://sp.example.com' };
        
          res.resumeState = sinon.spy(function(cb) {
            if (request.state.returnTo) {
              return this.redirect(request.state.returnTo);
            }
          
            process.nextTick(cb);
          });
        })
        .finish(function() {
          expect(store.get).to.be.calledOnceWith(this.req, 'oauth_twitter.com_XXXXXXXX');
          expect(idpFactory.create).to.be.calledOnceWithExactly('http://sp.example.com', 'oauth');
          expect(authenticateSpy).to.be.calledOnceWithExactly(idp, { assignProperty: 'federatedUser' });
          expect(actions.dispatch).to.be.calledOnceWith('login');
          expect(store.destroy).to.be.calledOnceWith(this.req, 'oauth_twitter.com_XXXXXXXX');
          
          expect(this.statusCode).to.equal(302);
          expect(this.getHeader('Location')).to.equal('/');
          
          done();
        })
        .listen();
    }); // should federate with provider
    
  }); // handler
  
});
