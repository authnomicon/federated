exports = module.exports = function(createProvider, idp, initialize, parse, authenticate) {
  
  function beginFederate(req, res, next) {
    console.log('BEGIN FEDERATE');
    console.log(req.query);
    console.log(req.params);
    
    var provider = req.query.provider;
    idp.resolve(provider, function(err, config) {
      console.log(err);
      console.log(config);
      
      var Strategy = require('passport-google-oauth20').Strategy;
      
      var strategy = new Strategy(config, function noop(){});
      console.log(strategy);
      
      // FIXME: Remove the array index here, once passport.initialize is no longer needed
      authenticate(strategy)[1](req, res, next);
      //authenticate(strategy)(req, res, next);
    });
    
    return
    
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
  'http://schemas.authnomicon.org/js/federation/idp',
  'http://i.bixbyjs.org/http/middleware/initialize',
  'http://i.bixbyjs.org/http/middleware/parse',
  'http://i.bixbyjs.org/http/middleware/authenticate'
  //'http://i.bixbyjs.org/http/Authenticator'
];
