/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');


afterEach(function() {
  sinon.restore();
});


describe('@authnomicon/sso', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('org.authnomicon/federated');
      
      expect(json.assembly.components).to.have.length(8);
      expect(json.assembly.components).to.include('http/service');
      expect(json.assembly.components).to.include('oauth/http/service');
      expect(json.assembly.components).to.include('oauth/http/statestore');
      expect(json.assembly.components).to.include('oauth2/http/service');
      expect(json.assembly.components).to.include('oauth2/http/statestore');
      expect(json.assembly.components).to.include('idp/http/facebook');
      expect(json.assembly.components).to.include('idp/http/twitter');
    });
  });
  
  it('should throw if required', function() {
    expect(function() {
      var pkg = require('..');
    }).to.throw(Error).with.property('code', 'MODULE_NOT_FOUND');
  });
  
});
