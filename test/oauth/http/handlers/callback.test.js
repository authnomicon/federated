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
    
    it('should federate with provider and resume', function(done) {
      var actions = new Object();
      actions.dispatch = sinon.stub().yieldsAsync(null);
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp);
      var authenticateSpy = sinon.spy(authenticate);
      var store = new Object();
      store.get = sinon.stub().yieldsAsync(null, {
        location: 'https://www.example.com/oauth/callback',
        provider: 'http://sp.example.com',
        returnTo: '/app'
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
          expect(this.getHeader('Location')).to.equal('/app');
          
          done();
        })
        .listen();
    }); // should federate with provider and resume
    
    it('should federate with provider and execute action', function(done) {
      var actions = new Object();
      actions.dispatch = sinon.stub().yieldsAsync(null);
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp);
      var authenticateSpy = sinon.spy(authenticate);
      var store = new Object();
      store.get = sinon.stub().yieldsAsync(null, {
        location: 'https://www.example.com/oauth/callback',
        provider: 'http://sp.example.com',
        action: 'authorize'
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
          expect(actions.dispatch).to.be.calledOnceWith('authorize');
          expect(store.destroy).to.be.calledOnceWith(this.req, 'oauth_twitter.com_XXXXXXXX');
          
          expect(this.statusCode).to.equal(302);
          expect(this.getHeader('Location')).to.equal('/');
          
          done();
        })
        .listen();
    }); // should federate with provider and execute action
    
    it('should federate with provider and execute multiple actions', function(done) {
      var actions = new Object();
      actions.dispatch = sinon.stub().yieldsAsync(null);
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp);
      var authenticateSpy = sinon.spy(authenticate);
      var store = new Object();
      store.get = sinon.stub().yieldsAsync(null, {
        location: 'https://www.example.com/oauth/callback',
        provider: 'http://sp.example.com',
        action: [ 'login', 'authorize' ]
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
          expect(actions.dispatch).to.be.calledTwice;
          expect(actions.dispatch.firstCall).to.be.calledWith('login');
          expect(actions.dispatch.secondCall).to.be.calledWith('authorize');
          expect(store.destroy).to.be.calledOnceWith(this.req, 'oauth_twitter.com_XXXXXXXX');
          
          expect(this.statusCode).to.equal(302);
          expect(this.getHeader('Location')).to.equal('/');
          
          done();
        })
        .listen();
    }); // should federate with provider and execute multiple actions
    
    it('should next with error when identity provider fails to be created', function(done) {
      var actions = new Object();
      actions.dispatch = sinon.stub().yieldsAsync(null);
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().rejects(new Error('something went wrong'));
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
        .next(function(err, req, res) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('something went wrong');
          
          expect(authenticateSpy).to.not.be.called;
          expect(actions.dispatch).to.not.be.called;
          expect(store.destroy).to.not.be.called;
          
          done();
        })
        .listen();
    }); // should next with error when identity provider fails to be created
    
    it('should next with error when action fails', function(done) {
      var actions = new Object();
      actions.dispatch = sinon.stub().yieldsAsync(new Error('something went wrong'));
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
        .next(function(err, req, res) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('something went wrong');
          
          expect(store.destroy).to.not.be.called;
          
          done();
        })
        .listen();
    }); // should next with error when action fails
    
  }); // handler
  
});
