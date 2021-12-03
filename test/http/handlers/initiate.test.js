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
    
    it('should authenticate with provider and protocol from state', function(done) {
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp)
      var authenticateSpy = sinon.spy(authenticate);
      
      var handler = factory(idpFactory, authenticateSpy, state, session);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            provider: 'https://server.example.net',
            protocol: 'oauth2'
          };
          req.state = new Object();
          req.state.provider = 'https://server.example.com';
          req.state.protocol = 'openidconnect';
        })
        .finish(function() {
          expect(idpFactory.create).to.be.calledOnce;
          expect(idpFactory.create).to.be.calledWithExactly('https://server.example.com', 'openidconnect', {});
          
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
    }); // should authenticate with provider and protocol from state
    
    it('should authenticate with prompt option', function(done) {
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp)
      var authenticateSpy = sinon.spy(authenticate);
      
      var handler = factory(idpFactory, authenticateSpy, state, session);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            provider: 'https://server.example.com',
            prompt: 'select_account'
          };
        })
        .finish(function() {
          expect(idpFactory.create).to.be.calledOnce;
          expect(idpFactory.create).to.be.calledWithExactly('https://server.example.com', undefined, {});
          
          expect(authenticateSpy).to.be.calledOnce;
          expect(authenticateSpy).to.be.calledWithExactly(idp, {
            prompt: 'select_account',
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
    }); // should authenticate with prompt option
    
    it('should authenticate with login hint option', function(done) {
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp)
      var authenticateSpy = sinon.spy(authenticate);
      
      var handler = factory(idpFactory, authenticateSpy, state, session);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            provider: 'https://server.example.com',
            login_hint: 'janedoe@example.com'
          };
        })
        .finish(function() {
          expect(idpFactory.create).to.be.calledOnce;
          expect(idpFactory.create).to.be.calledWithExactly('https://server.example.com', undefined, {});
          
          expect(authenticateSpy).to.be.calledOnce;
          expect(authenticateSpy).to.be.calledWithExactly(idp, {
            loginHint: 'janedoe@example.com',
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
    }); // should authenticate with login hint option
    
    it('should authenticate without return to property managed by state middleware', function(done) {
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
          req.state = new Object();
          req.state.location = 'https://client.example.com/login/federated';
          req.state.returnTo = 'https://client.example.com/app';
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
    }); // should authenticate without return to property managed by state middleware
    
    it('should authenticate without resume state property managed by state middleware', function(done) {
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
          req.state = new Object();
          req.state.location = 'https://client.example.com/login/federated';
          req.state.resumeState = '00000000';
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
    }); // should authenticate without resume state property managed by state middleware
    
    it('should authenticate with parameters from state', function(done) {
      function authenticate(idp, options) {
        return function(req, res, next) {
          res.redirect('https://example.myshopify.com/authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz&redirect_uri=https%3A%2F%2Fclient.example.com%2Fcb');
        };
      }
      
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp)
      var authenticateSpy = sinon.spy(authenticate);
      
      var handler = factory(idpFactory, authenticateSpy, state, session);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {};
          req.state = new Object();
          req.state.provider = 'https://myshopify.com';
          req.state.shop = 'example';
        })
        .finish(function() {
          expect(idpFactory.create).to.be.calledOnce;
          expect(idpFactory.create).to.be.calledWithExactly('https://myshopify.com', undefined, { shop: 'example' });
          
          expect(authenticateSpy).to.be.calledOnce;
          expect(authenticateSpy).to.be.calledWithExactly(idp, {
            state: {
              provider: 'https://myshopify.com',
              shop: 'example'
            }
          });
          
          expect(this.statusCode).to.equal(302);
          expect(this.getHeader('Location')).to.equal('https://example.myshopify.com/authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz&redirect_uri=https%3A%2F%2Fclient.example.com%2Fcb');
          done();
        })
        .next(done)
        .listen();
    }); // should authenticate with parameters from state
    
    it('should next with error when identity provider fails to be created', function(done) {
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().rejects(new Error('something went wrong'))
      var authenticateSpy = sinon.spy(authenticate);
      
      var handler = factory(idpFactory, authenticateSpy, state, session);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            provider: 'https://server.example.com'
          };
        })
        .next(function(err, req, res) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('something went wrong');
          expect(authenticateSpy).to.not.be.called;
          done();
        })
        .listen();
    }); // should next with error when identity provider fails to be created
    
  }); // handler
  
});
