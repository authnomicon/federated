/* global describe, it, expect */

var expect = require('chai').expect;
var factory = require('../../../com/oauth/http/service');


describe('oauth/http/service', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/http/Service');
    expect(factory['@path']).to.equal('/oauth/callback');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should construct service', function() {
    function callbackHandler() {};
  
    var service = factory(callbackHandler);
    
    expect(service).to.be.a('function');
    expect(service.length).to.equal(3);
  });
  
});
