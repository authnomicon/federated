exports = module.exports = function(idStore, directory) {
  
  // https://www.ietf.org/archive/id/draft-ietf-secevent-subject-identifiers-14.html#name-issuer-and-subject-identifi
  
  function exec(req, res, next) {
    if (!idStore) {
      // user isn't federated from an external domain
      req.login(req.federatedUser, function(err) {
        if (err) { return next(err); }
        return next();
      });
    } else {
      idStore.find(req.federatedUser, req.state.provider, function(err, user) {
        if (err) { return next(err); }
      
        if (!user) {
          // JIT the user
          directory.create(req.federatedUser, function(err, user) {
            if (err) { return next(err); }
          
            idStore.add(req.federatedUser, req.state.provider, user, function(err) {
              if (err) { return next(err); }
            
              req.login(user, function(err) {
                if (err) { return next(err); }
                return next();
              });
            });
          });
        } else {
          // Load the user, already JIT'ed
          directory.read(user.id, function(err, user) {
            if (err) { return next(err); }
          
            req.login(user, function(err) {
              if (err) { return next(err); }
              return next();
            });
          });
        }
      });
    }
  }
  
  
  return [
    exec
  ];
};

exports['@require'] = [
  'module:@authnomicon/federated.IDStore?',
  'module:@authnomicon/core.Directory?'
];
