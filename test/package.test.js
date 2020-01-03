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
      expect(json.assembly.namespace).to.equal('org.authnomicon/federate');
      
      expect(json.assembly.components).to.have.length(7);
      expect(json.assembly.components).to.include('http/service');
      expect(json.assembly.components).to.include('http/oauth/service');
      expect(json.assembly.components).to.include('http/oauth/statestore');
      expect(json.assembly.components).to.include('http/oauth2/service');
      expect(json.assembly.components).to.include('http/oauth2/statestore');
      expect(json.assembly.components).to.include('http/idp/facebook');
      expect(json.assembly.components).to.include('http/idp/twitter');
    });
  });
  
  it('should throw if required', function() {
    expect(function() {
      var pkg = require('..');
    }).to.throw(Error).with.property('code', 'MODULE_NOT_FOUND');
  });
  
});
