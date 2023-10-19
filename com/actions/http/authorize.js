exports = module.exports = function(store, authenticator) {

  function stashAuthInfo(req, res, next) {
    res.locals.token = req.authInfo.token;
    next();
  }

  function exec(req, res, next) {
    // var token = req.authInfo.token;
    var token = res.locals.token;
    
    store.store(token, req.state.provider, req.user, function(err, cred) {
      if (err) { return next(err); }
      res.locals.credential = cred;
      return next();
    });
  }
  
  // TODO: Should probably authenticate completely based on 'state' here, and remove stashAuthInfo
  return [
    stashAuthInfo,
    authenticator.authenticate('session'),
    exec
  ];
};

exports['@require'] = [
  'module:@authnomicon/federated.DelegatedCredentialStore',
  'module:passport.Authenticator'
];
