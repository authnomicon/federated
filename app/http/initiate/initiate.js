exports = module.exports = function(createProtocol, idp, authenticate) {
  
  function federate(req, res, next) {
    var provider = req.query.provider;
    // TODO: Past `host` as option
    idp.resolve(provider, function(err, config) {
      if (err) { return next(err); }
      
      var protocol = createProtocol(config);
      
      var options = {};
      options.state = {
        provider: config,
        state: req.query.state
      }
      // TODO: Add a `context` option, used to pass the database ID of this IdP,
      //       which can be serialized into the state for faster resumption when
      //       the IdP redirects back.
      
      // FIXME: Remove the array index here, once passport.initialize is no longer needed
      authenticate(protocol, options)[1](req, res, next);
      //authenticate(strategy)(req, res, next);
    });
  }


  return [
    federate
  ];
};

exports['@require'] = [
  '../../protocol/create',
  'http://schemas.authnomicon.org/js/federation/idp',
  'http://i.bixbyjs.org/http/middleware/authenticate'
];
