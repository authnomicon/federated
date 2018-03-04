exports = module.exports = function(IoC, oauth2, logger) {
  var Factory = require('fluidfactory')
    , providers = require('../../../lib/idp/providers');
  
  
  var factory = new Factory();
  
  function create(protocol) {
    return function(options) {
      if (protocol.canCreate(options)) {
        return protocol.create(options);
      }
    };
  }
  
  return Promise.resolve(factory)
    .then(function(factory) {
      var components = IoC.components('http://schemas.authnomicon.org/js/http/auth/FederationProtocol');
      
      return Promise.all(components.map(function(comp) { return comp.create(); } ))
        .then(function(plugins) {
          plugins.forEach(function(plugin, i) {
            logger.info('Loaded HTTP federation protocol: ' + components[i].a['@protocol']);
            factory.use(create(plugin));
          });
          
          factory.use(create(oauth2));
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

exports['@require'] = [
  '!container',
  '../oauth2/auth/protocol',
  'http://i.bixbyjs.org/Logger'
];
