/* global describe, it, expect */

var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../com/oauth/http/requesttokenstore');
var RequestTokenStore = require('../../../lib/oauth/requesttokenstore');


describe('oauth/http/requesttokenstore', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
    expect(factory['@implements']).to.equal('module:passport-oauth1.RequestTokenStore');
  });
  
  it('should construct RequestTokenStore', function() {
    var RequestTokenStoreSpy = sinon.spy(RequestTokenStore);
    var factory = $require('../../../com/oauth/http/requesttokenstore', {
      '../../../lib/oauth/requesttokenstore': RequestTokenStoreSpy
    });
    
    var store = factory();
    expect(RequestTokenStoreSpy).to.have.been.calledOnce;
    expect(RequestTokenStoreSpy).to.have.been.calledWithNew;
    expect(store).to.be.an.instanceOf(RequestTokenStore);
  });
  
});
