var LocalIDProviderFactory = require('../../../lib/localidpfactory');

exports = module.exports = function(C, scheme) {
  
  // TODO: Register the provider and protocol with the scheme, so it can be validated?
  
  return new LocalIDProviderFactory(scheme);
  
  // TODO: Old code, remove once not needed
  // WIP: build "selectors" into electrolyte, so that app can override without this pattern
  /*
  return IoC.create('http://i.authnomicon.org/federated/http/IDProviderFactory')
    .catch(function(err) {
      
      return {
        create: function(provider) {
          var mods = IoC.components('http://i.authnomicon.org/federated/http/IDProvider')
            , mod, i, len;
          for (i = 0, len = mods.length; i < len; ++i) {
            mod = mods[i];
            if (mod.a['@provider'] == provider) {
              return mod.create();
            }
          }
          
          return Promise.reject(new Error('Unsupported identity provider: ' + provider));
        }
      };
    });
  */
};

exports['@singleton'] = true;
exports['@implements'] = 'module:@authnomicon/federated.IDProviderFactory';
exports['@require'] = [
  '!container',
  'module:@authnomicon/session.InitiationScheme'
];
