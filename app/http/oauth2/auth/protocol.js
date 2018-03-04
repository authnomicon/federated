exports = module.exports = function(verify, store) {
  var clone = require('clone')
    , providers = require('../../../../lib/oauth2/providers');
  
  
  return {
    canCreate: function(options) {
      if (options.protocol == 'oauth2') { return true; }
      return false;
    },
    
    create: function(options) {
      var provider = options.identifier
        , opts = clone(options)
        , pkg = providers.getPackage(provider)
        , mod, Strategy;
      
      mod = require(pkg);
      Strategy = mod.Strategy;
      
      delete opts.protocol;
      delete opts.identifier;
      opts.store = store;
      
      return new Strategy(opts, verify(provider));
    }
  };
};

exports['@protocol'] = 'oauth2';
exports['@singleton'] = true;
exports['@require'] = [
  './middleware/verify',
  '../state/store'
];
