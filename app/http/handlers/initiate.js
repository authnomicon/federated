exports = module.exports = function(createProvider, initialize, parse, authenticator) {
  
  function authenticate(req, res, next) {
    var provider = req.query.provider;
    
    
    createProvider(provider, function(err, strategy) {
      if (err) { return next(err); }
      
      // TODO: Parse scope and other query options as normalized
      authenticator.authenticate(strategy)(req, res, next);
    });
  }


  return [
    initialize(),
    parse('application/x-www-form-urlencoded'),
    authenticate
  ];
};

exports['@require'] = [
  '../../createprovider',
  'http://i.bixbyjs.org/http/middleware/initialize',
  'http://i.bixbyjs.org/http/middleware/parse',
  'http://i.bixbyjs.org/http/Authenticator'
];
