/* global describe, it, expect */

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../com/http/handlers/initiate');


describe('http/handlers/initiate', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  
  function authenticate(idp, options) {
    return function(req, res, next) {
      res.redirect('https://server.example.com/authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz&redirect_uri=https%3A%2F%2Fclient.example.com%2Fcb');
    };
  }
  
  function state() {
    return function(req, res, next) {
      next();
    };
  }
  
  function session() {
    return function(req, res, next) {
      next();
    };
  }
  
  it('should create handler', function() {
    var idpFactory = new Object();
    var stateSpy = sinon.spy(state);
    var sessionSpy = sinon.spy(session);
    
    var handler = factory(idpFactory, authenticate, stateSpy, sessionSpy);
    
    expect(sessionSpy).to.be.calledOnce;
    expect(stateSpy).to.be.calledOnce;
    expect(sessionSpy).to.be.calledBefore(stateSpy);
  });
  
  describe('handler', function() {
    
    it('should authenticate with provider', function(done) {
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp)
      var authenticateSpy = sinon.spy(authenticate);
      
      var handler = factory(idpFactory, authenticateSpy, state, session);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            provider: 'https://server.example.com'
          };
        })
        .finish(function() {
          expect(idpFactory.create).to.be.calledOnce;
          expect(idpFactory.create).to.be.calledWithExactly('https://server.example.com', undefined, {});
          
          expect(authenticateSpy).to.be.calledOnce;
          expect(authenticateSpy).to.be.calledWithExactly(idp, {
            state: {
              provider: 'https://server.example.com'
            }
          });
          
          expect(this.statusCode).to.equal(302);
          expect(this.getHeader('Location')).to.equal('https://server.example.com/authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz&redirect_uri=https%3A%2F%2Fclient.example.com%2Fcb');
          done();
        })
        .next(done)
        .listen();
    }); // should authenticate with provider
    
    it('should authenticate with provider and protocol', function(done) {
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp);
      var authenticateSpy = sinon.spy(authenticate);
      
      var handler = factory(idpFactory, authenticateSpy, state, session);
        
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            provider: 'https://server.example.com',
            protocol: 'oauth2'
          };
        })
        .finish(function() {
          expect(idpFactory.create).to.be.calledOnce;
          expect(idpFactory.create).to.be.calledWithExactly('https://server.example.com', 'oauth2', {});
          
          expect(authenticateSpy).to.be.calledOnce;
          expect(authenticateSpy).to.be.calledWithExactly(idp, {
            state: {
              provider: 'https://server.example.com'
            }
          });
          
          expect(this.statusCode).to.equal(302);
          expect(this.getHeader('Location')).to.equal('https://server.example.com/authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz&redirect_uri=https%3A%2F%2Fclient.example.com%2Fcb');
          done();
        })
        .next(done)
        .listen();
    }); // should authenticate with provider and protocol
    
    it('should authenticate with provider from state', function(done) {
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp)
      var authenticateSpy = sinon.spy(authenticate);
      
      var handler = factory(idpFactory, authenticateSpy, state, session);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            provider: 'https://server.example.net'
          };
          req.state = new Object();
          req.state.provider = 'https://server.example.com';
        })
        .finish(function() {
          expect(idpFactory.create).to.be.calledOnce;
          expect(idpFactory.create).to.be.calledWithExactly('https://server.example.com', undefined, {});
          
          expect(authenticateSpy).to.be.calledOnce;
          expect(authenticateSpy).to.be.calledWithExactly(idp, {
            state: {
              provider: 'https://server.example.com'
            }
          });
          
          expect(this.statusCode).to.equal(302);
          expect(this.getHeader('Location')).to.equal('https://server.example.com/authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz&redirect_uri=https%3A%2F%2Fclient.example.com%2Fcb');
          done();
        })
        .next(done)
        .listen();
    }); // should authenticate with provider from state
    
    describe('federating with provider and protocol from state', function() {
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp)
      
      function authenticate(idp, options) {
        return function(req, res, next) {
          res.redirect('https://server.example.net/authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz&redirect_uri=https%3A%2F%2Fclient.example.com%2Fcb');
        };
      }
      
      function state() {
        return function(req, res, next) {
          req.state = new Object();
          req.state.provider = 'https://server.example.net';
          req.state.protocol = 'openidconnect';
          next();
        };
      }
      
      function session() {
        return function(req, res, next) {
          next();
        };
      }
      
      var authenticateSpy = sinon.spy(authenticate);
      var stateSpy = sinon.spy(state);
      var sessionSpy = sinon.spy(session);
      
      
      var request, response;
      
      before(function(done) {
        var handler = factory(idpFactory, authenticateSpy, stateSpy, sessionSpy);
        
        chai.express.use(handler)
          .request(function(req, res) {
            request = req;
            req.query = {
              provider: 'https://server.example.com',
              protocol: 'oauth2'
            };
            
            response = res;
          })
          .finish(function() {
            done();
          })
          .listen();
      });
      
      it('should setup middleware', function() {
        expect(sessionSpy).to.be.calledOnce;
        expect(stateSpy).to.be.calledOnce;
      });
      
      it('should create identity provider', function() {
        expect(idpFactory.create).to.be.calledOnce;
        expect(idpFactory.create).to.be.calledWithExactly('https://server.example.net', 'openidconnect', {});
      });
      
      it('should authenticate with identity provider', function() {
        expect(authenticateSpy).to.be.calledOnce;
        expect(authenticateSpy).to.be.calledWithExactly(idp, {
          state: {
            provider: 'https://server.example.net'
          }
        });
      });
      
      it('should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://server.example.net/authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz&redirect_uri=https%3A%2F%2Fclient.example.com%2Fcb');
      });
    }); // federating with provider and protocol from state
    
    describe('federating with provider and parameters in state', function() {
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp)
      
      function authenticate(idp, options) {
        return function(req, res, next) {
          res.redirect('https://example.myshopify.com/authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz&redirect_uri=https%3A%2F%2Fclient.example.com%2Fcb');
        };
      }
      
      function state() {
        return function(req, res, next) {
          req.state = new Object();
          req.state.provider = 'https://myshopify.com';
          req.state.shop = 'example';
          next();
        };
      }
      
      function session() {
        return function(req, res, next) {
          next();
        };
      }
      
      var authenticateSpy = sinon.spy(authenticate);
      var stateSpy = sinon.spy(state);
      var sessionSpy = sinon.spy(session);
      
      
      var request, response;
      
      before(function(done) {
        var handler = factory(idpFactory, authenticateSpy, stateSpy, sessionSpy);
        
        chai.express.use(handler)
          .request(function(req, res) {
            request = req;
            req.query = {};
            
            response = res;
          })
          .finish(function() {
            done();
          })
          .listen();
      });
      
      it('should setup middleware', function() {
        expect(sessionSpy).to.be.calledOnce;
        expect(stateSpy).to.be.calledOnce;
      });
      
      it('should create identity provider', function() {
        expect(idpFactory.create).to.be.calledOnce;
        expect(idpFactory.create).to.be.calledWithExactly('https://myshopify.com', undefined, { shop: 'example' });
      });
      
      it('should authenticate with identity provider', function() {
        expect(authenticateSpy).to.be.calledOnce;
        expect(authenticateSpy).to.be.calledWithExactly(idp, {
          state: {
            provider: 'https://myshopify.com',
            shop: 'example'
          }
        });
      });
      
      it('should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://example.myshopify.com/authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz&redirect_uri=https%3A%2F%2Fclient.example.com%2Fcb');
      });
    }); // federating with provider and parameters in state
    
  });
  
});
