/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/http/oauth/service');


describe('http/oauth/service', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.deep.equal([
      'http://i.bixbyjs.org/http/Service',
      'http://schemas.authnomicon.org/js/http/oauth/CallbackService'
    ]);
    expect(factory['@path']).to.equal('/oauth/callback');
    expect(factory['@singleton']).to.be.undefined;
  });
  
});
