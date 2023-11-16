var defer = typeof setImmediate === 'function'
  ? setImmediate
  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)); };

exports = module.exports = function(sloFactory) {
  
  function federate(req, res, next) {
    console.log('FEDERATED SESSION TERMINATION!!!');
    console.log(req.authInfo);
    
    var methods = req.authInfo.methods || [];
    if (methods.length !== 1) { return next(); }
    
    var method = methods[0];
    if (method.type !== 'federated') { return next(); }
    
    console.log('TERMINATE THIS: ');
    console.log(method);
    
    sloFactory.create(method.provider, method.protocol)
      .then(function(provider) {
        console.log('GOT PROVIDER!');
        console.log(provider);
        
        process.nextTick(function() {
          provider.logout(method, res, next);
        });
      }, function(err) {
        console.log(err);
        
        defer(next, err);
      });
    
    
    
    //return next();
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
