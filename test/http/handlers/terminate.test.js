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
    
  }); // handler
  
});
