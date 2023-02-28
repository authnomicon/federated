var LocalIDPFactory = require('../lib/localidpfactory');

exports = module.exports = function(scheme) {
  
  // TODO: Register the provider and protocol with the scheme, so it can be validated?
  
  return new LocalIDPFactory(scheme);
  
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
exports['@implements'] = 'module:@authnomicon/federated.IDPFactory';
exports['@require'] = [
  'module:@authnomicon/session.InitiationScheme'
];
