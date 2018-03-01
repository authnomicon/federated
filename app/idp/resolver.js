exports = module.exports = function(IoC, file, logger) {
  var Factory = require('fluidfactory');
  
  
  var factory = new Factory();
  
  function create(plugin) {
    return function(options) {
      if (plugin.canCreate(options)) {
        return plugin.create(options);
      }
    };
  }
  
  return Promise.resolve(factory)
    .then(function(factory) {
      var components = IoC.components('http://schemas.authnomicon.org/js/federation/idp/ResolverPlugIn');
  
      return Promise.all(components.map(function(comp) { return comp.create(); } ))
        .then(function(plugins) {
          plugins.forEach(function(plugin, i) {
            logger.info('Loaded IdP resolver plug-in: ' + components[i].a['@name']);
            factory.use(create(plugin));
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
          
          var resolver = factory.create(url);
          // TODO: hook up ready listener, and reject on error.
          
          resolver.once('ready', function() {
            resolve(resolver);
            // TODO: Remove error listener
          });
          
          //resolve(adapter);
        })
      });
    });
};

exports['@require'] = [
  '!container',
  './resolver/file',
  'http://i.bixbyjs.org/Logger'
];
