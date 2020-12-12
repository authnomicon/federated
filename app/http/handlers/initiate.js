exports = module.exports = function(IDPFactory, authenticate, state) {
  var merge = require('utils-merge');
  
  
  function federate(req, res, next) {
    var provider = req.state.provider || req.query.provider
      , protocol = req.query.protocol
      , options = merge({}, req.state);
      
    delete options.provider;
    delete options.protocol;  
    delete options.returnTo;
    // TODO: delete options.state? or whatever parent is
    
    
      // TODO: Bind provider into the URL to avoid attacks
      // or into the state store key, check how pkce store works...
    
    // TODO: Past `host` as option
    IDPFactory.create(provider, protocol, options)
      .then(function(idp) {
        var state = merge({}, req.state);
        state.provider = provider;
        state.protocol = protocol;
        
        // NOTE: fixes other demo
        //state.returnTo = req.header('referer');
        
        // TODO: Handle return to better here, same as FIXME comment below
        
        /*
        var state = {
          provider: provider,
          returnTo: req.header('referer')
        }
        */
        
        // FIXME: relate to parent state more, since internal state store is doing equiv of req.state.push
        if (req.query.state) { state.state = req.query.state; }
        
        // TODO: Add a `context` option, used to pass the database ID of this IdP,
        //       which can be serialized into the state for faster resumption when
        //       the IdP redirects back.
        
        var options = {
          state: state
        };
        
        console.log('INIT AUTH WITH!');
        console.log(state)
        
        //return;
        
        
        // FIXME: Remove the array index here, once passport.initialize is no longer needed
        authenticate(idp, options)[1](req, res, next);
      })
      .catch(function(err) {
        next(err);
      });
  }


  return [
    // FIXME: make it possible to just add state without handlers, like normal middleware
    state(),
    federate
  ];
};

exports['@require'] = [
  '../idpfactory',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/state'
];
