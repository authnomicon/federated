exports = module.exports = function(resolver) {
  var api = {};
  
  // TODO: Add host/tenant argument
  api.createProvider = function(issuer) {
    return resolver.create(issuer);
  };
  
  api.resolve = function(provider, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    resolver.resolve(provider, function(err, config) {
      if (err) { return cb(err); }
      return cb(null, config);
    });
  };
  
  return api;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/federation/idp';
exports['@singleton'] = true;
exports['@require'] = [
  './resolver'
];
