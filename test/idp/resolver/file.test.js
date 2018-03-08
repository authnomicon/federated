/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/idp/resolver/file');


describe('idp/resolver/file', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal(undefined);
    expect(factory['@name']).to.equal('file');
    expect(factory['@singleton']).to.equal(true);
  });
  
});
