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
      directory.read = sinon.spy();
    
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
          expect(err).to.be.undefined;
          
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
          expect(directory.read).to.not.have.been.called;
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
      idStore.add = sinon.spy();
      var directory = new Object();
      directory.create = sinon.spy();
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
          expect(err).to.be.undefined;
          
          expect(idStore.find).to.have.been.calledOnceWith(
            {
              id: '248289761001',
              displayName: 'Jane Doe'
            },
            'https://server.example.com'
          );
          expect(directory.read).to.have.been.calledOnceWith('703887');
          expect(directory.create).to.not.have.been.called;
          expect(idStore.add).to.not.have.been.called;
          expect(req.login).to.have.been.calledOnceWith({
            id: '703887',
            displayName: 'Jane Doe'
          });
          done();
        })
        .listen();
    }); // should login previously provisioned user
    
    it('should next with error when user fails to be found based on federated identifier', function(done) {
      var idStore = new Object();
      idStore.find = sinon.stub().yieldsAsync(new Error('something went wrong'));
      idStore.add = sinon.spy()
      var directory = new Object();
      directory.create = sinon.spy()
      directory.read = sinon.spy();
    
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
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('something went wrong');
          
          expect(idStore.find).to.have.been.calledOnceWith(
            {
              id: '248289761001',
              displayName: 'Jane Doe'
            },
            'https://server.example.com'
          );
          expect(idStore.add).to.not.have.been.called;
          expect(directory.create).to.not.have.been.called;
          expect(directory.read).to.not.have.been.called;
          expect(req.login).to.not.have.been.called;
          
          done();
        })
        .listen();
    }); // should next with error when user fails to be found based on federated identifier
    
    it('should next with error when account fails to be created in directory', function(done) {
      var idStore = new Object();
      idStore.find = sinon.stub().yieldsAsync(null);
      idStore.add = sinon.spy()
      var directory = new Object();
      directory.create = sinon.stub().yieldsAsync(new Error('something went wrong'));
      directory.read = sinon.spy();
    
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
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('something went wrong');
          
          expect(idStore.find).to.have.been.calledOnceWith(
            {
              id: '248289761001',
              displayName: 'Jane Doe'
            },
            'https://server.example.com'
          );
          expect(idStore.add).to.not.have.been.called;
          expect(directory.create).to.have.been.calledOnceWith(
            {
              id: '248289761001',
              displayName: 'Jane Doe'
            }
          );
          expect(directory.read).to.not.have.been.called;
          expect(req.login).to.not.have.been.called;
          
          done();
        })
        .listen();
    }); // should next with error when account fails to be created in directory
    
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
          expect(err).to.be.undefined;
          
          expect(req.login).to.have.been.calledOnceWith({
            id: '248289761001',
            displayName: 'Jane Doe'
          });
          done();
        })
        .listen();
    }); // should login locally when identifier store is not available
    
    it('should login locally when directory is not available', function(done) {
      var idStore = new Object();
      idStore.find = sinon.spy();
      idStore.add = sinon.spy();
      
      var handler = factory(idStore);
  
      chai.express.use(handler)
        .request(function(req, res) {
          req.login = sinon.stub().yieldsAsync(null);
        
          req.federatedUser = {
            id: '248289761001',
            displayName: 'Jane Doe'
          };
        })
        .next(function(err, req, res) {
          expect(err).to.be.undefined;
          
          expect(idStore.find).to.not.have.been.called;
          expect(idStore.add).to.not.have.been.called;
          expect(req.login).to.have.been.calledOnceWith({
            id: '248289761001',
            displayName: 'Jane Doe'
          });
          done();
        })
        .listen();
    }); // should login locally when directory is not available
    
  }); // handler
  
});
