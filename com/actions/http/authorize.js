exports = module.exports = function(vault) {


  function go(req, res, next) {
    var token = req.authInfo.token;
    
    vault.store(token, req.state.provider, req.user, function(err) {
      if (err) { return next(err); }
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
