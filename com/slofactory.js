var RPInitiatedService = require('../lib/openidconnect/logout/rpinitiated');
var url = require('url');


function SLOServiceFactory() {
}

SLOServiceFactory.prototype.create = function(provider, protocol) {
  console.log('CREATE SLO SERVICE');
  console.log(provider);
  console.log(protocol);
  
  var svc = new RPInitiatedService({
    logoutURL: url.resolve(process.env.OPENID_ISSUER, process.env.OPENID_END_SESSION_URL),
    clientID: process.env.CLIENT_ID,
    callbackURL: process.env.OPENID_POST_LOGOUT_REDIRECT_URL,
  });
  
  
  return Promise.resolve(svc);
  
}

// TODO: Can remove this once "app/" override/selection is in place for multiple components with
// same interface.

exports = module.exports = function() {
  
  // TODO: Register the provider and protocol with the scheme, so it can be validated?
  
  return new SLOServiceFactory();
};

exports['@singleton'] = true;
exports['@implements'] = 'module:@authnomicon/federated.SLOProviderFactory';
