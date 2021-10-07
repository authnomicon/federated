exports = module.exports = function(federatedIDs, directory) {
  
  function login(req, res, next) {
    federatedIDs.find(req.federatedUser.id, req.state.provider, function(err, federatedID, user) {
      if (err) { return next(err); }
      
      if (federatedID) {
        // Load the user, already JIT'ed
        directory.read(user.id, function(err, user) {
          if (err) { return next(err); }
          
          req.login(user, function(err) {
            if (err) { return next(err); }
            return res.resumeState(next);
          });
        });
      } else {
        // JIT the user
        directory.create(req.federatedUser, function(err, user) {
          if (err) { return next(err); }
          
          federatedIDs.create(req.federatedUser.id, req.state.provider, user, function(err, federatedID) {
            if (err) { return next(err); }
            
            req.login(user, function(err) {
              if (err) { return next(err); }
              return res.resumeState(next);
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
  'http://i.authnomicon.org/credentials/FederatedIDService',
  'http://i.authnomicon.org/ds/UserDirectory'
];
