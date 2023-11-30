/**
 * Create authorize action.
 *
 */
exports = module.exports = function(store, authenticator) {

  function stashAuthInfo(req, res, next) {
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
  
  // TODO: Should probably authenticate completely based on 'state' here, and remove stashAuthInfo
  return [
    stashAuthInfo,
    // TODO: This should authenticate 'state'
    authenticator.authenticate('session'),
    exec
  ];
};

exports['@require'] = [
  'module:@authnomicon/federated.DelegatedCredentialStore',
  'module:passport.Authenticator'
];
