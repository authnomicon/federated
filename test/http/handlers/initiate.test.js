/* global describe, it, expect */

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/http/handlers/initiate');


describe.only('http/handlers/initiate', function() {
  
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
      
      function authenticate(idp, options) {
        return function(req, res, next) {
          res.redirect('https://server.example.com/authorize?response_type=code&client_id=s6BhdRkqt3&redirect_uri=https%3A%2F%2Fclient.example.com%2Fcb&state=XXXXXXXX');
        };
      }
      
      function state() {
        return function(req, res, next) {
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
            req.query = {
              provider: 'https://server.example.com'
            };
          })
          .res(function(res) {
            response = res;
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
        expect(idpFactory.create).to.be.calledWithExactly('https://server.example.com', undefined, {});
      });
      
      it('should authenticate with identity provider', function() {
        expect(authenticateSpy).to.be.calledOnce;
        expect(authenticateSpy).to.be.calledWithExactly(idp, {
          state: {
            provider: 'https://server.example.com'
          }
        });
      });
      
      it('should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://server.example.com/authorize?response_type=code&client_id=s6BhdRkqt3&redirect_uri=https%3A%2F%2Fclient.example.com%2Fcb&state=XXXXXXXX');
      });
    }); // federating with provider
    
    describe('federating with provider and protocol', function() {
      var idp = new Object();
      var idpFactory = new Object();
      idpFactory.create = sinon.stub().resolves(idp)
      
      function authenticate(idp, options) {
        return function(req, res, next) {
          res.redirect('https://server.example.com/authorize?response_type=code&client_id=s6BhdRkqt3&redirect_uri=https%3A%2F%2Fclient.example.com%2Fcb&state=XXXXXXXX');
        };
      }
      
      function state() {
        return function(req, res, next) {
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
            req.query = {
              provider: 'https://server.example.com',
              protocol: 'oauth2'
            };
          })
          .res(function(res) {
            response = res;
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
        expect(idpFactory.create).to.be.calledWithExactly('https://server.example.com', 'oauth2', {});
      });
      
      it('should authenticate with identity provider', function() {
        expect(authenticateSpy).to.be.calledOnce;
        expect(authenticateSpy).to.be.calledWithExactly(idp, {
          state: {
            provider: 'https://server.example.com'
          }
        });
      });
      
      it('should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://server.example.com/authorize?response_type=code&client_id=s6BhdRkqt3&redirect_uri=https%3A%2F%2Fclient.example.com%2Fcb&state=XXXXXXXX');
      });
    }); // federating with provider and protocol
    
    
  });
  
});
