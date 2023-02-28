exports = module.exports = function(idpFactory, authenticator, store) {
  
  function federate(req, res, next) {
    var provider = req.query.provider
      , protocol = req.query.protocol;
    
    idpFactory.create(provider, protocol)
      .then(function(idp) {
        var options = {
          state: { provider: provider }
        };
        // TODO: This should be set based on the explicit logout state of the session, not a query param
        if (req.query.prompt) { options.prompt = req.query.prompt; }
        if (req.query.login_hint) { options.loginHint = req.query.login_hint; }
        
        authenticator.authenticate(idp, options)(req, res, next);
      }, function(err) {
        next(err);
      });
  }


  return [
    require('flowstate')({ store: store }),
    federate
  ];
};

exports['@require'] = [
  'module:@authnomicon/federated.IDPFactory',
  'module:@authnomicon/session.Authenticator',
  'module:flowstate.Store'
];
