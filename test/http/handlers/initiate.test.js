var chai = require('chai');
var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../com/http/handlers/initiate');


describe('http/handlers/initiate', function() {
  
  it('should return handler', function() {
    var flowstateSpy = sinon.spy();
    var factory = $require('../../../com/http/handlers/initiate', {
      'flowstate': flowstateSpy
    });
    
    var idpFactory = new Object();
    var authenticator = new Object();
    var store = new Object();
    var handler = factory(idpFactory, authenticator, store);
    
    expect(handler).to.be.an('array');
    expect(flowstateSpy).to.be.calledOnce;
    expect(flowstateSpy).to.be.calledWith({ store: store });
  });
  
  describe('handler', function() {
    
    function authenticate(idp, options) {
      return function(req, res, next) {
        res.redirect('https://server.example.com/authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz&redirect_uri=https%3A%2F%2Fclient.example.com%2Fcb');
      };
    }
    
    it('should authenticate with provider', function(done) {
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp);
      var authenticateSpy = sinon.spy(authenticate);
      var store = new Object();
      
      var handler = factory(idpFactory, { authenticate: authenticateSpy }, store);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.connection = {};
          req.query = {
            provider: 'https://server.example.com'
          };
        })
        .finish(function() {
          expect(idpFactory.create).to.be.calledOnce;
          expect(idpFactory.create).to.be.calledWithExactly('https://server.example.com', undefined);
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
      var store = new Object();
      
      var handler = factory(idpFactory, { authenticate: authenticateSpy }, store);
        
      chai.express.use(handler)
        .request(function(req, res) {
          req.connection = {};
          req.query = {
            provider: 'https://server.example.com',
            protocol: 'oauth2'
          };
        })
        .finish(function() {
          expect(idpFactory.create).to.be.calledOnce;
          expect(idpFactory.create).to.be.calledWithExactly('https://server.example.com', 'oauth2');
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
    
    it('should authenticate with login hint option', function(done) {
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp);
      var authenticateSpy = sinon.spy(authenticate);
      var store = new Object();
      
      var handler = factory(idpFactory, { authenticate: authenticateSpy }, store);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.connection = {};
          req.query = {
            provider: 'https://server.example.com',
            login_hint: 'janedoe@example.com'
          };
        })
        .finish(function() {
          expect(idpFactory.create).to.be.calledOnce;
          expect(idpFactory.create).to.be.calledWithExactly('https://server.example.com', undefined);
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
    
    it('should next with error when identity provider fails to be created', function(done) {
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().rejects(new Error('something went wrong'));
      var authenticateSpy = sinon.spy(authenticate);
      var store = new Object();
      
      var handler = factory(idpFactory, { authenticate: authenticateSpy }, store);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.connection = {};
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
