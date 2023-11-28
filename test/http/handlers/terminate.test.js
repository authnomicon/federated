var chai = require('chai');
var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../com/http/handlers/initiate');


describe('http/handlers/terminate', function() {
  
  it('should create handler', function() {
    var sloFactory = new Object();
    var handler = factory(sloFactory);
    
    expect(handler).to.be.an('array');
  });
  
});
