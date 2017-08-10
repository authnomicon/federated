exports = module.exports = function(createProvider, authenticator, initialize, loadState, authenticate, completeTask, failTask) {

  function completeAuthentication(req, res, next) {
    console.log('LOAD IDP');
    console.log(req.state)
    
    var opts = {
      protocol: 'oauth2',
      authorizationURL: req.state.authorizationURL,
      clientID: req.state.clientID
    }
    
    createProvider(opts, function(err, provider) {
      if (err) { return next(err); }
      
      // authenticator.authenticate('https://clef.io', { session: false, failWithError: true })(req, res, next);
      authenticator.authenticate(provider, { session: false, failWithError: true })(req, res, next);
    });
  }
  
  function stashAccount(req, res, next) {
    console.log('AUTHENTICATED USER!');
    console.log(req.user)
    return;
    
    
    req.locals.account = req.user;
    delete req.user;
    next();
  }

  function postProcess(req, res, next) {
    // TODO Abstract this out into something common, shared between protocls
    // https://en.wikipedia.org/wiki/Federated_identity
    
    if (!req.user) {
      // TODO: Local account provisioning w/ initial linked account
    } else {
      // TODO: Account linking, storing access and refresh tokens, etc.
    }
    next();
  }


  return [
    initialize(),
    // FIXME: The following invalid, required state name causes an incorrect error in flowstate
    //ceremony.loadState({ name: 'sso/oauth2x', required: true }),
    loadState('oauth2-redirect', { required: true }),
    completeAuthentication,
    stashAccount,
    authenticate([ 'state', 'anonymous' ]),
    postProcess,
    completeTask('oauth2-redirect'),
    failTask('oauth2-redirect')
  ];
  
};

exports['@require'] = [
  '../createprovider',
  'http://i.bixbyjs.org/http/Authenticator',
  'http://i.bixbyjs.org/http/middleware/initialize',
  'http://i.bixbyjs.org/http/middleware/loadState',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/completeTask',
  'http://i.bixbyjs.org/http/middleware/failTask'
];
