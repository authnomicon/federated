exports = module.exports = function(authenticator) {
  
  return function createProvider(provider, cb) {
    var strategies = authenticator._strategies
      , names = Object.keys(strategies);
    
    if (names.indexOf(provider) !== -1) {
      return cb(null, provider);
    }
    
    // TODO: Error, provider not found.
  };
};

exports['@singleton'] = true;
exports['@require'] = [
  'http://i.bixbyjs.org/http/Authenticator'
];
