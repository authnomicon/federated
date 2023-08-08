var defer = typeof setImmediate === 'function'
  ? setImmediate
  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)); };

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
        //.      actually, a query param should override that state, as done here.  TODO: implement that state
        // TODO: Add support for passing state into this endpoint which gets merged into
        //.      state when handling callback.
        
        if (req.query.prompt) { options.prompt = req.query.prompt; }
        if (req.query.login_hint) { options.loginHint = req.query.login_hint; }
        
        defer(authenticator.authenticate(idp, options), req, res, next);
      }, function(err) {
        defer(next, err);
      });
  }


  return [
    require('flowstate')({ store: store }),
    federate
  ];
};

exports['@require'] = [
  'module:@authnomicon/federated.IDProviderFactory',
  'module:passport.Authenticator',
  'module:flowstate.Store'
];
