exports = module.exports = function(authenticator) {
  
  return function createProvider(options, cb) {
    var strategies = authenticator._strategies
      , names = Object.keys(strategies);
    
    if (names.indexOf(options.host) !== -1) {
      return cb(null, options.host);
    }
  };
};

exports['@singleton'] = true;
exports['@require'] = [
  'http://i.bixbyjs.org/http/Authenticator'
];
