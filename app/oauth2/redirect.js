exports = module.exports = function(createProvider, authenticator, initialize, loadState, authenticate, completeTask, failTask) {

  function loadIdentityProvider(req, res, next) {
    createProvider(req.state, function(err, provider) {
      if (err) { return next(err); }
      req.locals.provider = provider;
      next();
    });
  }
  
  function authenticateAuthorizationResponse(req, res, next) {
    authenticator.authenticate('https://clef.io', { session: false, failWithError: true })(req, res, next);
    
    //authenticator.authenticate(req.locals.provider, { session: false, failWithError: true })(req, res, next);
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
    function(req, res, next) {
      console.log('OAUTH 2.0 REDIRECT!');
      console.log(req.query);
      console.log(req.body);
    },
    
    initialize(),
    // FIXME: The following invalid, required state name causes an incorrect error in flowstate
    //ceremony.loadState({ name: 'sso/oauth2x', required: true }),
    loadState('federate-oauth2', { required: true }),
    loadIdentityProvider,
    authenticateAuthorizationResponse,
    stashAccount,
    authenticate([ 'state', 'anonymous' ]),
    postProcess,
    completeTask('federate-oauth2'),
    failTask('federate-oauth2')
  ];
  
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/sso/oauth2/createProvider',
  'http://i.bixbyjs.org/http/Authenticator',
  'http://i.bixbyjs.org/http/middleware/initialize',
  'http://i.bixbyjs.org/http/middleware/loadState',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/completeTask',
  'http://i.bixbyjs.org/http/middleware/failTask'
];
