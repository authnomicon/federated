exports = module.exports = function() {
  var clone = require('clone');
  
  
  return {
    canCreate: function(options) {
      if (options.protocol == 'oauth2') { return true; }
      return false;
    },
    
    create: function(options) {
      var issuer = options.identifier
        , pkg = options.package
        , opts = clone(options)
        , mod, Strategy;
      delete opts.identifier;
      delete opts.protocol;
      delete opts.package;
      
      mod = require(pkg);
      Strategy = mod.Strategy;
      
      return new Strategy(opts, function noop(){});
    }
  };
};

exports['@protocol'] = 'oauth2';
exports['@require'] = [];
