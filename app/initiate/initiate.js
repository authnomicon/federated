exports = module.exports = function(createProvider, initialize, parse, authenticator) {
  
  function beginFederate(req, res, next) {
    var identifier = req.query.provider;
    
    createProvider(identifier, function(err, provider) {
      if (err) { return next(err); }
      
      // TODO: Parse scope and other query options as normalized
      authenticator.authenticate(provider)(req, res, next);
    });
  }


  return [
    initialize(),
    parse('application/x-www-form-urlencoded'),
    beginFederate
  ];
};

exports['@require'] = [
  '../createprovider',
  'http://i.bixbyjs.org/http/middleware/initialize',
  'http://i.bixbyjs.org/http/middleware/parse',
  //'http://i.bixbyjs.org/http/Authenticator'
];
