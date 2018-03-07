exports = module.exports = function(toHandle, protocolFactory, idp, flow, authenticate) {

  function getHandle(req) {
    return toHandle(req.params.host, req.query.oauth_token);
  }


  function federate(req, res, next) {
    var provider = req.state.provider;
    // TODO: Past `host` as option
    // TODO: Pass `idpID` as option, if available in state
    // TODO: Pass `clientID` as option, if available
    idp.resolve(provider, function(err, config) {
      if (err) { return next(err); }
      
      var protocol = protocolFactory.create(config);
      // FIXME: Remove the array index here, once passport.initialize is no longer needed
      authenticate(protocol, { assignProperty: 'federatedUser' })[1](req, res, next);
    });
  }

  function postProcess(req, res, next) {
    // Fake provision a user
    var user = { id: '5001' };
    user.displayName = 'Federated ' + req.federatedUser.displayName;
    
    req.user = user;
    next();
    
    return;
    
    // TODO Abstract this out into something common, shared between protocls
    // https://en.wikipedia.org/wiki/Federated_identity
    
    if (!req.user) {
      // TODO: Local account provisioning w/ initial linked account
    } else {
      // TODO: Account linking, storing access and refresh tokens, etc.
    }
    next();
  }


  return flow('oauth-callback',
    authenticate([ 'state', 'anonymous' ]),
    federate,
    postProcess,
  { through: 'login', required: true, getHandle: getHandle });
  
};

exports['@require'] = [
  '../state/tohandle',
  '../auth/protocol',
  'http://schemas.authnomicon.org/js/federation/idp',
  'http://i.bixbyjs.org/http/middleware/state/flow',
  'http://i.bixbyjs.org/http/middleware/authenticate'
];
