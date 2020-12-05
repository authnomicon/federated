exports = module.exports = function(IDPFactory, authenticate, state) {
  
  function federate(req, res, next) {
    var provider = req.state.provider || req.query.provider
      , protocol = req.query.protocol;
    
    // TODO: Past `host` as option
    IDPFactory.create(provider, protocol, req.state)
      .then(function(idp) {
        var state = {
          provider: provider,
          returnTo: req.header('referer')
        }
        if (req.query.state) { state.state = req.query.state; }
        
        // TODO: Add a `context` option, used to pass the database ID of this IdP,
        //       which can be serialized into the state for faster resumption when
        //       the IdP redirects back.
        
        var options = {
          state: state
        };
        
        // FIXME: Remove the array index here, once passport.initialize is no longer needed
        authenticate(idp, options)[1](req, res, next);
      })
      .catch(function(err) {
        next(err);
      });
  }


  return [
    // FIXME: make it possible to just add state without handlers, like normal middleware
    state(
      federate
    )
  ];
};

exports['@require'] = [
  '../idpfactory',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/state'
];
