var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../com/idpfactory');
var LocalIDPFactory = require('../lib/localidpfactory');


describe('idpfactory', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
    expect(factory['@implements']).to.equal('module:@authnomicon/federated.IDPFactory');
  });
  
  it('should construct LocalIDPFactory', function() {
    var LocalIDPFactorySpy = sinon.spy(LocalIDPFactory);
    var factory = $require('../com/idpfactory', {
      '../lib/localidpfactory': LocalIDPFactorySpy
    });
    
    var scheme = new Object();
    var idpFactory = factory(scheme);
    
    expect(LocalIDPFactorySpy).to.have.been.calledOnce;
    expect(LocalIDPFactorySpy).to.have.been.calledWithNew;
    expect(LocalIDPFactorySpy).to.have.been.calledWith(scheme);
    expect(idpFactory).to.be.an.instanceOf(LocalIDPFactory);
  });
  
});
