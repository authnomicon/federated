exports = module.exports = function(protocolFactory, idp, loadState, authenticate, completeTask, failTask) {

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


  // FIXME: The following invalid, required state name causes an incorrect error in flowstate
  //ceremony.loadState({ name: 'sso/oauth2x', required: true }),
  return [
    loadState('oauth2-redirect', { required: true }),
    authenticate([ 'state', 'anonymous' ]),
    federate,
    postProcess,
    completeTask('oauth2-redirect', { through: 'login' }),
    failTask('oauth2-redirect')
  ];
  
};

exports['@require'] = [
  '../auth/protocol',
  'http://schemas.authnomicon.org/js/federation/idp',
  'http://i.bixbyjs.org/http/middleware/loadState',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/completeTask',
  'http://i.bixbyjs.org/http/middleware/failTask'
];
