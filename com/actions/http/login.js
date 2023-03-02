exports = module.exports = function(federatedIDs, directory) {
  
  // TODO: Rename "Federated ID server" to iss-sub service, following.
  // https://www.ietf.org/archive/id/draft-ietf-secevent-subject-identifiers-14.html#name-issuer-and-subject-identifi
  
  
  function login(req, res, next) {
    if (!federatedIDs) {
      // user isn't federated from an external domain
      req.login(req.federatedUser, function(err) {
        if (err) { return next(err); }
        return next();
      });
      return;
    }
    
    
    // TODO: Decouple this component more, so directory isn't needed.  Should be
    //. federatedIDs.findOrCreate()...
    
    federatedIDs.get(req.federatedUser, req.state.provider, function(err, user) {
      if (err) { return next(err); }
      
      if (user) {
        // Load the user, already JIT'ed
        directory.read(user.id, function(err, user) {
          if (err) { return next(err); }
          
          req.login(user, function(err) {
            if (err) { return next(err); }
            return next();
          });
        });
      } else {
        // JIT the user
        directory.create(req.federatedUser, function(err, user) {
          if (err) { return next(err); }
          
          federatedIDs.set(req.federatedUser, req.state.provider, user, function(err, federatedID) {
            if (err) { return next(err); }
            
            req.login(user, function(err) {
              if (err) { return next(err); }
              return next();
            });
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
