exports = module.exports = function(authenticator) {
  
  return function createProvider(options, cb) {
    if (typeof options == 'string') {
      options = { provider: options };
    }
    
    console.log('CREAT PROVIDER!');
    console.log(options);
    
    var strategies = authenticator._strategies
      , names = Object.keys(strategies)
      , strategy, name, i, len;
    
    if (options.provider) {
      if (names.indexOf(options.provider) !== -1) {
        return cb(null, options.provider);
      }
    } else if (options.protocol == 'oauth2') {
      for (i = 0, len = names.length; i < len; ++i) {
        name = names[i];
        strategy = strategies[name];
      
        if (!strategy._oauth2) { continue; }
        if (strategy._oauth2._authorizeUrl == options.authorizationURL &&
            strategy._oauth2._clientId == options.clientID) {
          return cb(null, name);
        }
      }
    
      return cb(new Error('Unable to identify OAuth 2.0 authorization server: ' + options.authorizationURL));
    }
    
    
    // TODO: Error, provider not found.
  };
};

exports['@singleton'] = true;
exports['@require'] = [
  'http://i.bixbyjs.org/http/Authenticator'
];
