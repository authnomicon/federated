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
        
        req.federatedUser = { id: '248289761001' };
      })
      .next(function(err, req, res) {
        expect(req.login).to.have.been.calledOnceWith({ id: '248289761001' });
        done();
      })
      .listen();
  }); // should login when directory is externalized
  
});
