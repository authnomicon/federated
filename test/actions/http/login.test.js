var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../com/actions/http/login');


describe('actions/http/login', function() {
  
  it('should return handler', function() {
    var store = new Object();
    var handler = factory(store);
    
    expect(handler).to.be.an('array');
  });
  
});
