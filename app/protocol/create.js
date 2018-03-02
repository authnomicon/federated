exports = module.exports = function(IoC, oauth2, logger) {
  var Factory = require('fluidfactory')
    , merge = require('utils-merge')
    , providers = require('../../lib/idp/registry');
  
  
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
      var components = IoC.components('http://schemas.authnomicon.org/js/http/federation/Protocol');
      
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
        var xopts;
        if (!options.protocol) {
          xopts = providers[options.identifier];
          merge(options, xopts);
        }
        
        return factory.create(options);
      };
    });
};

exports['@require'] = [
  '!container',
  '../oauth2/protocol',
  'http://i.bixbyjs.org/Logger'
];
