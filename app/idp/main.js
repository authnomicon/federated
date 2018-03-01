exports = module.exports = function(resolver) {
  var api = {};
  
  api.resolve = function(provider, cb) {
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
