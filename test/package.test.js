/* global describe, it */

var expect = require('chai').expect;
var pkg = require('..');


describe('@authnomicon/sso', function() {
  
  it('should export manifest', function() {
    expect(pkg).to.be.an('object');
    expect(pkg['createprovider']).to.be.a('function');
  });
  
  describe('createprovider', function() {
    var createprovider = pkg['createprovider'];
    
    it('should be annotated', function() {
      expect(createprovider['@implements']).to.equal('http://schemas.authnomicon.org/js/sso/createProvider');
      expect(createprovider['@singleton']).to.equal(true);
    });
  });
  
});
