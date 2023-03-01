var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../com/oauth2/http/handlers/redirect');
var utils = require('../../../utils');


describe('oauth2/http/handlers/redirect', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    
    describe('federating with provider', function() {
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp)
      
      var actions = new Object();
      actions.dispatch = sinon.stub().yieldsAsync(null);
      
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
      
      // TODO: review this
      var store = new Object();
      store.get = function(req, state, cb) {
        return cb(null, {
          location: 'https://www.example.com/oauth2/redirect',
          provider: 'https://server.example.com'
        });
      }
      
      store.destroy = function(req, handle, cb) {
        return cb();
      };
      
      /*
      function state() {
        return function(req, res, next) {
          req.state = new Object();
          req.state.provider = 'https://server.example.com';
          next();
        };
      }
      */
      
      var authenticateSpy = sinon.spy(authenticate);
      //var stateSpy = sinon.spy(state);
      
      
      var request, response;
      
      before(function(done) {
        var handler = factory(actions, idpFactory, { authenticate: authenticateSpy }, store);
        
        chai.express.use(handler)
          .request(function(req, res) {
            request = req;
            req.connection = { encrypted: true };
            req.method = 'POST';
            req.url = '/oauth2/redirect';
            req.headers.host = 'www.example.com';
            req.query = { state: 'foo' };
            req.session = {};
            
            response = res;
            
            res.resumeState = sinon.spy(function(cb) {
              if (request.state.returnTo) {
                return this.redirect(request.state.returnTo);
              }
              
              process.nextTick(cb);
            });
          })
          .finish(function() {
            done();
          })
          .listen();
      });
      
      it('should setup middleware', function() {
        //expect(stateSpy).to.be.calledOnce;
      });
      
      it('should create identity provider', function() {
        expect(idpFactory.create).to.be.calledOnce;
        expect(idpFactory.create).to.be.calledWithExactly('https://server.example.com', 'oauth2');
      });
      
      it('should authenticate with identity provider', function() {
        expect(authenticateSpy).to.be.calledOnce;
        expect(authenticateSpy).to.be.calledWithExactly(idp, { assignProperty: 'federatedUser' });
      });
      
      // TODO: Asser that actions is called correctly
      /*
      it('should establish session', function() {
        expect(request.session.user).to.deep.equal({
          id: '248289761001',
          displayName: 'Jane Doe'
        });
      });
      */
      
      /*
      it('should resume state', function() {
        expect(response.resumeState).to.be.calledOnceWith();
      });
      */
      
      it('should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('/');
      });
    }); // federating with provider
    
    describe('federating with provider and returning to location', function() {
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp)
      
      var actions = new Object();
      actions.dispatch = sinon.stub().yieldsAsync(null);
      
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
      
      // TODO: review this
      var store = new Object();
      store.get = function(req, state, cb) {
        return cb(null, {
          location: 'https://www.example.com/oauth2/redirect',
          provider: 'https://server.example.com',
          returnTo: '/home'
        });
      }
      
      store.destroy = function(req, handle, cb) {
        return cb();
      };
      
      /*
      function state() {
        return function(req, res, next) {
          req.state = new Object();
          req.state.provider = 'https://server.example.com';
          req.state.returnTo = '/home';
          next();
        };
      }
      */
      
      var authenticateSpy = sinon.spy(authenticate);
      //var stateSpy = sinon.spy(state);
      
      
      var request, response;
      
      before(function(done) {
        var handler = factory(actions, idpFactory, { authenticate: authenticateSpy }, store);
        
        chai.express.use(handler)
          .request(function(req, res) {
            request = req;
            req.connection = { encrypted: true };
            req.session = {};
            req.url = '/oauth2/redirect';
            req.headers.host = 'www.example.com';
            req.query = { state: 'foo' };
            
            response = res;
            
            res.resumeState = sinon.spy(function(cb) {
              if (request.state.returnTo) {
                return this.redirect(request.state.returnTo);
              }
              
              process.nextTick(cb);
            });
          })
          .finish(function() {
            done();
          })
          .listen();
      });
      
      it('should setup middleware', function() {
        //expect(stateSpy).to.be.calledOnce;
      });
      
      /*
      it('should create identity provider', function() {
        expect(idpFactory.create).to.be.calledOnce;
        expect(idpFactory.create).to.be.calledWithExactly('https://server.example.com', 'oauth2', {});
      });
      */
      
      it('should authenticate with identity provider', function() {
        expect(authenticateSpy).to.be.calledOnce;
        expect(authenticateSpy).to.be.calledWithExactly(idp, { assignProperty: 'federatedUser' });
      });
      
      /*
      it('should establish session', function() {
        expect(request.session.user).to.deep.equal({
          id: '248289761001',
          displayName: 'Jane Doe'
        });
      });
      */
      
      /*
      it('should resume state', function() {
        expect(response.resumeState).to.be.calledOnceWith();
      });
      */
      
      it('should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('/home');
      });
    }); // federating with provider and returning to location
    
    describe('federating with provider and parameters in state', function() {
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp)
      
      var actions = new Object();
      actions.dispatch = sinon.stub().yieldsAsync(null);
      
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
      
      // TODO: review this
      var store = new Object();
      store.get = function(req, state, cb) {
        return cb(null, {
          location: 'https://www.example.com/oauth2/redirect',
          provider: 'https://myshopify.com',
          shop: 'example',
          returnTo: '/home'
        });
      }
      
      store.destroy = function(req, handle, cb) {
        return cb();
      };
      
      /*
      function state() {
        return function(req, res, next) {
          req.state = new Object();
          req.state.provider = 'https://myshopify.com';
          req.state.shop = 'example';
          req.state.returnTo = '/home';
          next();
        };
      }
      */
      
      var authenticateSpy = sinon.spy(authenticate);
      //var stateSpy = sinon.spy(state);
      
      
      var request, response;
      
      before(function(done) {
        var handler = factory(actions, idpFactory, { authenticate: authenticateSpy }, store);
        
        chai.express.use(handler)
          .request(function(req, res) {
            request = req;
            req.connection = { encrypted: true };
            req.session = {};
            req.url = '/oauth2/redirect';
            req.headers.host = 'www.example.com';
            req.query = { state: 'foo' };
            
            response = res;
            
            res.resumeState = sinon.spy(function() {
              if (request.state.returnTo) {
                return this.redirect(request.state.returnTo);
              }
              
              process.nextTick(cb);
            });
          })
          .finish(function() {
            done();
          })
          .listen();
      });
      
      it('should setup middleware', function() {
        //expect(stateSpy).to.be.calledOnce;
      });
      
      /*
      it('should create identity provider', function() {
        expect(idpFactory.create).to.be.calledOnce;
        expect(idpFactory.create).to.be.calledWithExactly('https://myshopify.com', 'oauth2', { shop: 'example' });
      });
      */
      
      it('should authenticate with identity provider', function() {
        expect(authenticateSpy).to.be.calledOnce;
        expect(authenticateSpy).to.be.calledWithExactly(idp, { assignProperty: 'federatedUser' });
      });
      
      /*
      it('should establish session', function() {
        expect(request.session.user).to.deep.equal({
          id: '248289761001',
          displayName: 'Jane Doe'
        });
      });
      */
      
      /*
      it('should resume state', function() {
        expect(response.resumeState).to.be.calledOnceWith();
      });
      */
      
      it('should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('/home');
      });
    }); // federating with provider and parameters in state
    
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
