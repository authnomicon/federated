exports = module.exports = function(IDPFactory, federatedIDs, users, authenticate, state, session) {
  var utils = require('../../../../lib/utils');
  var merge = require('utils-merge');
  var toHandle = require('../../../../lib/oauth/state/handle');
  var dispatch = require('../../../../lib/dispatch');


  function getHandle(req) {
    return toHandle(req.query.oauth_token, req.params.hostname);
  }


  function federate(req, res, next) {
    var provider = req.state.provider
      , options = merge({}, req.state);
    
    delete options.provider;
    // TODO: Test cases for deleting these properties, once they are settled
    delete options.returnTo;
    // TODO: delete options.state? or whatever parent is
    //delete options.state;
    
    // TODO: Past `host` as option
    // TODO: Pass `idpID` as option, if available in state
    // TODO: Pass `clientID` as option, if available
      
    IDPFactory.create(provider, 'oauth', options)
      .then(function(idp) {
        utils.dispatch(
          authenticate(idp, { assignProperty: 'federatedUser' })
        )(null, req, res, next);
      })
      .catch(function(err) {
        next(err);
      });
  }
  
  function establishSession(req, res, next) {
    console.log('DO ACTION');
    //console.log(req.user);
    //console.log(req.federatedUser);
    //console.log(req.authInfo);
    //return;
    
    federatedIDs.find(req.federatedUser.id, req.state.provider, function(err, federatedID, user) {
      console.log('FOUND FEDERATED ID');
      console.log(err);
      console.log(federatedID);
      
      if (err) { return next(err); }
      
      if (federatedID) {
        // Load the user, already JIT'ed
        
        console.log('LOAD USER:');
        console.log(user);
        
        
        users.read(user.id, function(err, user) {
          if (err) { return next(err); }
          console.log(user);
          req.login(user, function(err) {
            if (err) { return next(err); }
            return res.resumeState(next);
          });
        });
      } else {
        // JIT the user
        users.create(req.federatedUser, function(err, user) {
          if (err) { return next(err); }
          console.log(user);
          
          federatedIDs.create(req.federatedUser.id, req.state.provider, user, function(err, federatedID) {
            if (err) { return next(err); }
            console.log(federatedID);
            
            req.login(user, function(err) {
              if (err) { return next(err); }
              return res.resumeState(next);
            });
          });
        });
      }
    });
  }
  
  function go(req, res, next) {
    res.redirect('/');
  }
  
  return [
    session(),
    state({ getHandle: getHandle }),
    federate,
    establishSession,
    go
  ];

  /*
  return ceremony('oauth/callback',
    authenticate([ 'state', 'anonymous' ]),
    federate,
    postProcess,
  { through: 'login', required: true, getHandle: getHandle });
  */
  
};

exports['@require'] = [
  '../../../http/idpfactory',
  'http://i.authnomicon.org/credentials/FederatedIDService',
  'http://i.authnomicon.org/ds/UserDirectory',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/state',
  'http://i.bixbyjs.org/http/middleware/session'
];
