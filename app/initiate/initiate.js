exports = module.exports = function(createProtocol, authenticate, idp) {
  
  function federate(req, res, next) {
    var provider = req.query.provider;
    idp.resolve(provider, function(err, config) {
      if (err) { return next(err); }
      
      var protocol = createProtocol(config);
      console.log('PROTOCOL IS:');
      console.log(protocol)
      
      // FIXME: Remove the array index here, once passport.initialize is no longer needed
      authenticate(protocol)[1](req, res, next);
      //authenticate(strategy)(req, res, next);
    });
  }


  return [
    federate
  ];
};

exports['@require'] = [
  '../protocol/create',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://schemas.authnomicon.org/js/federation/idp',
];
