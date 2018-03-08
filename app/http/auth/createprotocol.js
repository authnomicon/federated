exports = module.exports = function(IoC, oauth2, oauth, logger) {
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
        .then(function(protocols) {
          protocols.forEach(function(protocol, i) {
            logger.info('Loaded HTTP federation protocol: ' + components[i].a['@protocol']);
            factory.use(create(protocol));
          });
          
          factory.use(create(oauth2));
          factory.use(create(oauth));
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
