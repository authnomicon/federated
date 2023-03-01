var chai = require('chai');
var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../../com/oauth2/http/handlers/redirect');


describe('oauth2/http/handlers/redirect', function() {
  
  it('should return handler', function() {
    var flowstateSpy = sinon.spy();
    var factory = $require('../../../../com/oauth2/http/handlers/redirect', {
      'flowstate': flowstateSpy
    });
    
    var idpFactory = new Object();
    var authenticator = new Object();
    var store = new Object();
    var handler = factory(undefined, idpFactory, authenticator, store);
    
    expect(handler).to.be.an('array');
    expect(flowstateSpy).to.be.calledOnce;
    expect(flowstateSpy).to.be.calledWith({ mutationMethods: [ 'GET', 'POST' ], store: store });
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
        location: 'https://www.example.com/oauth2/redirect',
        provider: 'https://server.example.com'
      });
      store.destroy = sinon.stub().yieldsAsync();
      
      
      var handler = factory(actions, idpFactory, { authenticate: authenticateSpy }, store);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.connection = { encrypted: true };
          req.method = 'GET';
          req.url = '/oauth2/redirect';
          req.headers.host = 'www.example.com';
          req.query = { code: 'SplxlOBeZQQYbYS6WxSbIA', state: 'xyz' };
        })
        .finish(function() {
          expect(store.get).to.be.calledOnceWith(this.req, 'xyz');
          expect(idpFactory.create).to.be.calledOnceWithExactly('https://server.example.com', 'oauth2');
          expect(authenticateSpy).to.be.calledOnceWithExactly(idp, { assignProperty: 'federatedUser' });
          expect(store.destroy).to.be.calledOnceWith(this.req, 'xyz');
          
          expect(this.statusCode).to.equal(302);
          expect(this.getHeader('Location')).to.equal('/');
          
          done();
        })
        .listen();
    }); // should federate with provider
    
    it('should federate with provider and resume', function(done) {
      var actions = new Object();
      actions.dispatch = sinon.stub().yieldsAsync(null);
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp);
      var authenticateSpy = sinon.spy(authenticate);
      var store = new Object();
      store.get = sinon.stub().yieldsAsync(null, {
        location: 'https://www.example.com/oauth2/redirect',
        provider: 'https://server.example.com',
        returnTo: '/app'
      });
      store.destroy = sinon.stub().yieldsAsync();
      
      var handler = factory(actions, idpFactory, { authenticate: authenticateSpy }, store);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.connection = { encrypted: true };
          req.method = 'GET';
          req.url = '/oauth2/redirect';
          req.headers.host = 'www.example.com';
          req.query = { code: 'SplxlOBeZQQYbYS6WxSbIA', state: 'xyz' };
        })
        .finish(function() {
          expect(store.get).to.be.calledOnceWith(this.req, 'xyz');
          expect(idpFactory.create).to.be.calledOnceWithExactly('https://server.example.com', 'oauth2');
          expect(authenticateSpy).to.be.calledOnceWithExactly(idp, { assignProperty: 'federatedUser' });
          expect(store.destroy).to.be.calledOnceWith(this.req, 'xyz');
          
          expect(this.statusCode).to.equal(302);
          expect(this.getHeader('Location')).to.equal('/app');
          
          done();
        })
        .listen();
    }); // should federate with provider and resume
    
    /*
    describe('error due to unsupported identity provider', function() {
      var error, request, response;
      
      before(function() {
        sinon.stub(IDPFactory, 'create').rejects(new Error('Unsupported identity provider'));
      });
      
      before(function(done) {
        var handler = factory(IDPFactory, authenticate, ceremony);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            request.state = { provider: 'http://server.example.com' };
            request.session = {};
          })
          .res(function(res) {
            response = res;
          })
          .next(function(err) {
            error = err;
            done();
          })
          .dispatch();
      });
      
      it('should not authenticate', function() {
        expect(request.federatedUser).to.be.undefined;
        expect(request.authInfo).to.be.undefined;
      });
      
      it('should not establish session', function() {
        expect(request.session.user).to.be.undefined;
      });
      
      it('should error', function() {
        expect(error).to.be.an.instanceof(Error);
        expect(error.message).to.equal('Unsupported identity provider');
      });
    }); // error due to unsupported identity provider
    */
    
  });
  
});
