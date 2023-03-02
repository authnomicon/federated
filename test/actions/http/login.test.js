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
  
  it('should login when directory is externalized', function(done) {
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
  }); // should login when directory is externalized
  
  it('should provision user', function(done) {
    var mapper = new Object();
    mapper.get = sinon.stub().yieldsAsync(null);
    mapper.create = sinon.stub().yieldsAsync(null);
    var directory = new Object();
    directory.create = sinon.stub().yieldsAsync(null, {
      id: '703887',
      displayName: 'Jane Doe'
    });
    
    var handler = factory(mapper, directory);
  
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
        expect(mapper.get).to.have.been.calledOnceWith(
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
        expect(mapper.create).to.have.been.calledOnceWith('248289761001', 'https://server.example.com', {
          id: '703887',
          displayName: 'Jane Doe'
        });
        expect(req.login).to.have.been.calledOnceWith({
          id: '703887',
          displayName: 'Jane Doe'
        });
        done();
      })
      .listen();
  }); // should provision user
  
});
