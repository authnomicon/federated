exports = module.exports = function(IoC, common, file, logger) {
  //var Switch = require('../../lib/switch');



  //return;

  var Factory = require('fluidfactory');
  
  
  var factory = new Factory()
    , modules = IoC.components('http://schemas.authnomicon.org/js/federation/idp/ProviderFactory');
  
  return Promise.all(modules.map(function(m) { return m.create(); }))
    .then(function(impls) {
      console.log('### SETUP IDP PROVIDER FACTORY');
      
      impls.forEach(function(impl, i) {
        logger.info('Loaded IdP resolver provider: ' + components[i].a['@name']);
        //factory.use(create(provider));
      });
      
      factory.use(common);
    })
    .then(function() {
      return factory;
    });
  
  
  
  return;
  
  // TODO: remove below here.
  
  function create(provider) {
    return function(options) {
      if (provider.canCreate(options)) {
        return provider.create(options);
      }
    };
  }
  
  return Promise.resolve(factory)
    .then(function(factory) {
      var components = IoC.components('http://schemas.authnomicon.org/js/federation/idp/ResolverProvider');
  
      return Promise.all(components.map(function(comp) { return comp.create(); } ))
        .then(function(providers) {
          providers.forEach(function(provider, i) {
            logger.info('Loaded IdP resolver provider: ' + components[i].a['@name']);
            factory.use(create(provider));
          });
          
          factory.use(create(file));
        })
        .then(function() {
          return factory;
        });
    })
    .then(function(factory) {
      return new Promise(function(resolve, reject) {
        // TODO: put service discovery into here
        process.nextTick(function() {
          var url = 'file:///Users/jaredhanson/Projects/modulate/idd/etc/federation.toml';
          
          resolve(factory.create(url));
        })
      });
    })
    .then(function(resolver) {
      if (!resolver.initializing) { return resolver; }
      
      return new Promise(function(resolve, reject) {
        resolver.once('ready', function() {
          resolve(resolver);
          // TODO: Remove error listener
        });
        
        //resolve(adapter);
      });
    });
};

exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  './resolver/default',
  './resolver/file',
  'http://i.bixbyjs.org/Logger'
];
