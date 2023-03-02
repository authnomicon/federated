exports = module.exports = function(idMapper, directory) {
  
  // TODO: Rename "Federated ID server" to iss-sub service, following.
  // https://www.ietf.org/archive/id/draft-ietf-secevent-subject-identifiers-14.html#name-issuer-and-subject-identifi
  
  
  function login(req, res, next) {
    if (!idMapper) {
      // user isn't federated from an external domain
      req.login(req.federatedUser, function(err) {
        if (err) { return next(err); }
        return next();
      });
      return;
    }
    
    idMapper.get(req.federatedUser, req.state.provider, function(err, user) {
      if (err) { return next(err); }
      
      if (!user) {
        // JIT the user
        directory.create(req.federatedUser, function(err, user) {
          if (err) { return next(err); }
          
          idMapper.set(req.federatedUser, req.state.provider, user, function(err) {
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
  
  
  return [
    login
  ];
};

exports['@require'] = [
  'module:@authnomicon/federated.IDMapper?',
  'module:@authnomicon/core.Directory?'
];
