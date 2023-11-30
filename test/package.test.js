/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var pkg = require('..');


describe('@authnomicon/federated', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('org.authnomicon/federated');
      
      expect(json.assembly.components).to.have.length(10);
      expect(json.assembly.components).to.include('http/service');
      expect(json.assembly.components).to.include('oauth/http/service');
      expect(json.assembly.components).to.include('oauth/http/requesttokenstore');
      expect(json.assembly.components).to.include('oauth2/http/service');
      expect(json.assembly.components).to.include('oauth2/http/statestore');
    });
  });
  
  it('should export constructors', function() {
    expect(pkg.openidconnect).to.be.an('object');
    expect(pkg.openidconnect.RPInitiatedLogoutService).to.be.an('function');
  });
  
});

afterEach(function() {
  sinon.restore();
});
