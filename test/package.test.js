/* global describe, it */

var expect = require('chai').expect;


describe('@authnomicon/sso', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('org.authnomicon/sso');
      
      expect(json.assembly.components).to.have.length(5);
      expect(json.assembly.components).to.include('http/service');
      expect(json.assembly.components).to.include('http/oauth/service');
      expect(json.assembly.components).to.include('http/oauth2/service');
      expect(json.assembly.components).to.include('http/oauth2/yield/login');
      expect(json.assembly.components).to.include('idp/main');
    });
  });
  
  it('should throw if required', function() {
    expect(function() {
      var pkg = require('..');
    }).to.throw(Error).with.property('code', 'MODULE_NOT_FOUND');
  });
  
});
