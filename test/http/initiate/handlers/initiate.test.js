/* global describe, it, expect */

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/initiate/handlers/initiate');


describe('http/initiate/handlers/initiate', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe.skip('handler', function() {
    var idp = {
      resolve: function(){}
    }
    
    
    describe('initiating sso', function() {
      var request, response;
      
      before(function() {
        sinon.stub(idp, 'resolve').yields(null, { id: '1234-5678', authorizeURL: 'https://id.example.com/authorize' });
      });
      
      after(function() {
        idp.resolve.restore();
      });
      
      before(function(done) {
        var handler = factory(null, idp);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            req.query = {
              provider: 'https://id.example.com'
            };
          })
          .res(function(res) {
            response = res;
          })
          .end(function(res) {
            done();
          })
          .dispatch();
      });
      
      it('should set state', function() {
        expect(request.state).to.deep.equal({
          failureCount: 1
        });
      });
      
      it('should set locals', function() {
        expect(response.locals).to.deep.equal({
          message: 'Invalid username or password',
          failureCount: 1
        });
      });
      
      it('should prompt', function() {
        expect(response.statusCode).to.equal(200);
      });
    }); // handling an unauthorized error
    
  }); // handler
  
});
