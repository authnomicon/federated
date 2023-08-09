var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../com/actions/http/login');


describe('actions/http/login', function() {
  
  it('should return handler', function() {
    var store = new Object();
    var handler = factory();
    
    expect(handler).to.be.an('array');
  });
  
  describe('handler', function() {
  
    it('should provision user and login', function(done) {
      var idStore = new Object();
      idStore.find = sinon.stub().yieldsAsync(null);
      idStore.add = sinon.stub().yieldsAsync(null);
      var directory = new Object();
      directory.create = sinon.stub().yieldsAsync(null, {
        id: '703887',
        displayName: 'Jane Doe'
      });
    
      var handler = factory(idStore, directory);
  
      chai.express.use(handler)
        .request(function(req, res) {
          req.login = sinon.stub().yieldsAsync(null);
        
          req.federatedUser = {
            id: '248289761001',
            displayName: 'Jane Doe'
          };
          req.state = {
            provider: 'https://server.example.com'
          };
        })
        .next(function(err, req, res) {
          expect(idStore.find).to.have.been.calledOnceWith(
            {
              id: '248289761001',
              displayName: 'Jane Doe'
            },
            'https://server.example.com'
          );
          expect(directory.create).to.have.been.calledOnceWith(
            {
              id: '248289761001',
              displayName: 'Jane Doe'
            }
          );
          expect(idStore.add).to.have.been.calledOnceWith(
            {
              id: '248289761001',
              displayName: 'Jane Doe'
            },
            'https://server.example.com',
            {
              id: '703887',
              displayName: 'Jane Doe'
            }
          );
          expect(req.login).to.have.been.calledOnceWith({
            id: '703887',
            displayName: 'Jane Doe'
          });
          done();
        })
        .listen();
    }); // should provision user and login
  
    it('should login previously provisioned user', function(done) {
      var idStore = new Object();
      idStore.find = sinon.stub().yieldsAsync(null, {
        id: '703887'
      });
      var directory = new Object();
      directory.read = sinon.stub().yieldsAsync(null, {
        id: '703887',
        displayName: 'Jane Doe'
      });
    
      var handler = factory(idStore, directory);
  
      chai.express.use(handler)
        .request(function(req, res) {
          req.login = sinon.stub().yieldsAsync(null);
        
          req.federatedUser = {
            id: '248289761001',
            displayName: 'Jane Doe'
          };
          req.state = {
            provider: 'https://server.example.com'
          };
        })
        .next(function(err, req, res) {
          expect(idStore.find).to.have.been.calledOnceWith(
            {
              id: '248289761001',
              displayName: 'Jane Doe'
            },
            'https://server.example.com'
          );
          expect(directory.read).to.have.been.calledOnceWith('703887');
          expect(req.login).to.have.been.calledOnceWith({
            id: '703887',
            displayName: 'Jane Doe'
          });
          done();
        })
        .listen();
    }); // should login previously provisioned user
    
    it('should login locally when identifier store is not available', function(done) {
      var handler = factory();
  
      chai.express.use(handler)
        .request(function(req, res) {
          req.login = sinon.stub().yieldsAsync(null);
        
          req.federatedUser = {
            id: '248289761001',
            displayName: 'Jane Doe'
          };
        })
        .next(function(err, req, res) {
          expect(req.login).to.have.been.calledOnceWith({
            id: '248289761001',
            displayName: 'Jane Doe'
          });
          done();
        })
        .listen();
    }); // should login locally when identifier store is not available
    
  }); // handler
  
});
