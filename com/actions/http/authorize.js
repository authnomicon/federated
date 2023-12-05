/**
 * Create authorize action handler.
 *
 * Returns a handler that authorizes the application to operate on behalf of the
 * user.
 *
 * This action is executed upon federating with an external service.  In this
 * case, the external service is typically an authorization server implementing
 * a delegated authorization protocol such as OAuth 2.0.  The authorization
 * server issues the application delegation-specific credentials (typically
 * referred to as an access token), which allow the application to access the
 * external service on behalf of the user.
 *
 * This action stores the token issued by the service provider in a delegated
 * credential store.  The application is expected to load the credential from
 * the store when it accesses the service.
 */
exports = module.exports = function(store, authenticator) {

  function stashAuthInfo(req, res, next) {
    // Stash the info from the federated authorization response.  This is done
    // because the local user who initiated authorization will be authenticated
    // by authenticating the session.  This authentication will overwrite
    // `req.authInfo`, and a reference to it needs to be maintained for the
    // duration of request handling.
    req.federatedAuthInfo = req.authInfo;
    next();
  }

  function exec(req, res, next) {
    store.store(req.federatedAuthInfo.token, req.state.provider, req.user, function(err, cred) {
      if (err) { return next(err); }
      res.locals.credential = cred;
      return next();
    });
  }
  
  
  // TODO: Should probably authenticate completely based on 'state' here
  return [
    stashAuthInfo,
    // TODO: This should authenticate 'state'
    authenticator.authenticate('session'),
    exec
  ];
};

// Module annotations.
exports['@require'] = [
  'module:@authnomicon/federated.DelegatedCredentialStore',
  'module:passport.Authenticator'
];
