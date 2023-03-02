var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../com/actions/http/authorize');


describe('actions/http/authorize', function() {
  
  it('should return handler', function() {
    var store = new Object();
    var handler = factory(store);
    
    expect(handler).to.be.an('array');
  });
  
  describe('handler', function() {
    
    it('should store token', function(done) {
      var store = new Object();
      store.store = sinon.stub().yieldsAsync(null, { id: 'crd_1' });
      
      var handler = factory(store);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.user = { id: '248289761001' };
          req.state = {};
          req.state.provider = 'https://server.example.com';
          req.authInfo = {};
          req.authInfo.token = {
            type: 'bearer',
            token: 'mF_9.B5f-4.1JqM'
          };
        })
        .next(function(err, req, res) {
          expect(store.store).to.be.calledOnceWith(
            {
              type: 'bearer',
              token: 'mF_9.B5f-4.1JqM'
            },
            'https://server.example.com',
            { id: '248289761001' }
          );
          
          expect(res.locals.credential).to.deep.equal({ id: 'crd_1'});
          done();
        })
        .listen();
    }); // should store token
    
  }); // handler
  
});
