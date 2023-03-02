exports = module.exports = function(store) {

  function go(req, res, next) {
    var token = req.authInfo.token;
    
    store.store(token, req.state.provider, req.user, function(err, cred) {
      if (err) { return next(err); }
      res.locals.credential = cred;
      return next();
    });
  }

  return [
    go
  ];
};

exports['@require'] = [
  'http://i.bixbyjs.org/security/credentials/DelegatedTokenVault'
];
