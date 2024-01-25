/* global describe, it, expect */

var expect = require('chai').expect;
var factory = require('../com/service');


describe('service', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.deep.equal('http://i.bixbyjs.org/http/Service');
    expect(factory['@path']).to.equal('/login/federated');
  });
  
  it('should create service', function() {
    function initiateHandler() {};
  
    var service = factory(initiateHandler);
    
    expect(service).to.be.a('function');
    expect(service.length).to.equal(3);
  });
  
});
