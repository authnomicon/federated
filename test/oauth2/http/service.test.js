/* global describe, it, expect */

var expect = require('chai').expect;
var factory = require('../../../com/oauth2/http/service');


describe('oauth2/http/service', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/http/Service');
    expect(factory['@path']).to.equal('/oauth2/redirect');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should construct service', function() {
    function redirectHandler() {};
  
    var service = factory(redirectHandler);
    
    expect(service).to.be.a('function');
    expect(service.length).to.equal(3);
  });
  
});
