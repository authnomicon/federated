/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var RequestTokenStore = require('../../../lib/oauth/requesttokenstore');


describe('oauth/RequestTokenStore', function() {
  
  var store = new RequestTokenStore();
  
  describe('#get', function() {
    
    it('should get token secret', function(done) {
      var req = new Object();
      req.state = {
        tokenSecret: 'hdhd0244k9j7ao03'
      };
    
      store.get(req, 'hh5s93j4hdidpola', function(err, tokenSecret) {
        if (err) { return done(err); }
        expect(tokenSecret).to.equal('hdhd0244k9j7ao03')
        done();
      });
    }); // should get token secret
    
    it('should error when flowstate middleware is not in use', function(done) {
      var req = new Object();
      
      store.get(req, 'hh5s93j4hdidpola', function(err, tokenSecret) {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('OAuth requires state support. Did you forget to use `flowstate` middleware?');
        expect(tokenSecret).to.be.undefined;
        done();
      });
    }); // should error when flowstate middleware is not in use
    
  }); // #get
  
});
