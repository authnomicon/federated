var defer = typeof setImmediate === 'function'
  ? setImmediate
  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)); };

exports = module.exports = function(sloFactory) {
  
  function federate(req, res, next) {
    var methods = req.authInfo.methods || [];
    if (methods.length !== 1) { return next(); }
    
    var method = methods[0];
    if (method.type !== 'federated') { return next(); }
    
    sloFactory.create(method.provider, method.protocol)
      .then(function(provider) {
        process.nextTick(function() {
          provider.logout(method, res, next);
        });
      }, function(err) {
        defer(next, err);
      });
  }


  return [
    federate
  ];
};

// Module annotations.
exports['@implements'] = 'module:@authnomicon/federated.SessionTerminationHandler';
exports['@require'] = [];
exports['@require'] = [
  'module:@authnomicon/federated.SLOProviderFactory',
];
