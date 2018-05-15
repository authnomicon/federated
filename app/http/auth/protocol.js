exports = module.exports = function(IoC, oauth2, oauth, logger) {
  var Factory = require('fluidfactory')
    , providers = require('../../../lib/idp/providers');
  
  
  var factory = new Factory();
  
  return Promise.resolve(factory)
    .then(function(factory) {
      var components = IoC.components('http://schemas.authnomicon.org/js/http/federation/sso/ProtocolProvider');
      
      return Promise.all(components.map(function(comp) { return comp.create(); } ))
        .then(function(providers) {
          providers.forEach(function(provider, i) {
            logger.info('Loaded HTTP single sign-on protocol: ' + components[i].a['@protocol']);
            factory.use(provider);
          });
          
          factory.use(oauth2);
          factory.use(oauth);
        })
        .then(function() {
          return factory;
        });
    })
    .then(function(factory) {
      return function(options) {
        options.protocol = options.protocol || providers.getProtocol(options.identifier);
        return factory.create(options);
      };
    });
};

exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  '../oauth2/auth/protocol',
  '../oauth/auth/protocol',
  'http://i.bixbyjs.org/Logger'
];
