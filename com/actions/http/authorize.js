exports = module.exports = function(store) {

  function exec(req, res, next) {
    var token = req.authInfo.token;
    
    store.store(token, req.state.provider, req.user, function(err, cred) {
      if (err) { return next(err); }
      res.locals.credential = cred;
      return next();
    });
  }
  
  
  return [
    exec
  ];
};

exports['@require'] = [
  'module:@authnomicon/federated.DelegatedCredentialStore'
];
