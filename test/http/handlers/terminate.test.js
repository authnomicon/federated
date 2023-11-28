var chai = require('chai');
var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../com/http/handlers/terminate');


describe('http/handlers/terminate', function() {
  
  it('should create handler', function() {
    var sloFactory = new Object();
    var handler = factory(sloFactory);
    
    expect(handler).to.be.an('array');
  });
  
  describe('handler', function() {
    
    it('should terminate session at provider', function(done) {
      var provider = new Object();
      provider.logout = sinon.spy(function(ctx, res, next) {
        res.redirect('https://server.example.com/logout');
      })
      var sloFactory = new Object();
      sloFactory.create = sinon.stub().resolves(provider);
      
      var handler = factory(sloFactory);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.authInfo = {
            methods: [ {
              type: 'federated',
              provider: 'https://server.example.com',
              protocol: 'openidconnect',
              idToken: 'eyJhbGci'
            } ]
          };
        })
        .finish(function() {
          expect(sloFactory.create).to.be.calledOnceWithExactly('https://server.example.com', 'openidconnect');
          expect(provider.logout).to.have.been.calledOnce;
          expect(provider.logout.getCall(0).args[0]).to.deep.equal({
            type: 'federated',
            provider: 'https://server.example.com',
            protocol: 'openidconnect',
            idToken: 'eyJhbGci'
          });
          expect(provider.logout.getCall(0).args[1]).to.equal(this);
          
          expect(this).to.have.status(302);
          expect(this.getHeader('Location')).to.equal('https://server.example.com/logout');
          done();
        })
        .listen();
    }); // should terminate session at provider
    
    it('should not handle request when non-federated authentication method has been used', function(done) {
      var provider = new Object();
      provider.logout = sinon.spy(function(ctx, res, next) {
        res.redirect('https://server.example.com/logout');
      })
      var sloFactory = new Object();
      sloFactory.create = sinon.stub().resolves(provider);
      
      var handler = factory(sloFactory);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.authInfo = {
            methods: [ {
              type: 'password'
            } ]
          };
        })
        .next(function(err) {
          expect(err).to.be.undefined;
          done();
        })
        .listen();
    }); // should not handle request when non-federated authentication method has been used
    
    it('should not handle request when more than one authentication method has been used', function(done) {
      var provider = new Object();
      provider.logout = sinon.spy(function(ctx, res, next) {
        res.redirect('https://server.example.com/logout');
      })
      var sloFactory = new Object();
      sloFactory.create = sinon.stub().resolves(provider);
      
      var handler = factory(sloFactory);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.authInfo = {
            methods: [ {
              type: 'federated',
              provider: 'https://server.example.com',
              protocol: 'openidconnect',
              idToken: 'eyJhbGci'
            }, {
              type: 'password'
            } ]
          };
        })
        .next(function(err) {
          expect(err).to.be.undefined;
          done();
        })
        .listen();
    }); // should not handle request when more than one authentication method has been used
    
    it('should not handle request when authentication method is unknown', function(done) {
      var provider = new Object();
      provider.logout = sinon.spy(function(ctx, res, next) {
        res.redirect('https://server.example.com/logout');
      })
      var sloFactory = new Object();
      sloFactory.create = sinon.stub().resolves(provider);
      
      var handler = factory(sloFactory);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.authInfo = {};
        })
        .next(function(err) {
          expect(err).to.be.undefined;
          done();
        })
        .listen();
    }); // should not handle request when authentication method is unknown
    
    it('should not handle request when authentication context is unknown', function(done) {
      var provider = new Object();
      provider.logout = sinon.spy(function(ctx, res, next) {
        res.redirect('https://server.example.com/logout');
      })
      var sloFactory = new Object();
      sloFactory.create = sinon.stub().resolves(provider);
      
      var handler = factory(sloFactory);
      
      chai.express.use(handler)
        .request(function(req, res) {
        })
        .next(function(err) {
          expect(err).to.be.undefined;
          done();
        })
        .listen();
    }); // should not handle request when authentication context is unknown
    
    it('should next with error when provider fails to be created', function(done) {
      var sloFactory = new Object();
      sloFactory.create = sinon.stub().rejects(new Error('something went wrong'));
      
      var handler = factory(sloFactory);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.authInfo = {
            methods: [ {
              type: 'federated',
              provider: 'https://server.example.com',
              protocol: 'openidconnect',
              idToken: 'eyJhbGci'
            } ]
          };
        })
        .next(function(err) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('something went wrong');
          done();
        })
        .listen();
    }); // should next with error when provider fails to be created
    
  }); // handler
  
});
