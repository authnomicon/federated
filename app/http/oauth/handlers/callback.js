exports = module.exports = function(IDPFactory, /*idp,*/ authenticate, ceremony) {
  var toHandle = require('../../../../lib/oauth/state/handle');


  function getHandle(req) {
    return toHandle(req.query.oauth_token, req.params.host, req.originalUrl);
  }


  function federate(req, res, next) {
    console.log('!!! OAUTH1 CALLBACK!');
    console.log(req.state);
    //return;
    
    var provider = req.state.provider;
    
    // TODO: Past `host` as option
    // TODO: Pass `idpID` as option, if available in state
    // TODO: Pass `clientID` as option, if available
    IDPFactory.create(provider)
      .then(function(idp) {
        // FIXME: Remove the array index here, once passport.initialize is no longer needed
        authenticate(idp, { assignProperty: 'federatedUser' })[1](req, res, next);
      })
      .catch(function(err) {
        next(err);
      });
  }


  function old_federate(req, res, next) {
    var provider = req.state.provider;
    // TODO: Past `host` as option
    // TODO: Pass `idpID` as option, if available in state
    // TODO: Pass `clientID` as option, if available
    idp.resolve(provider, function(err, config) {
      if (err) { return next(err); }
      
      var protocol = createProtocol(config);
      // FIXME: Remove the array index here, once passport.initialize is no longer needed
      authenticate(protocol, { assignProperty: 'federatedUser' })[1](req, res, next);
    });
  }

  function postProcess(req, res, next) {
    // Fake provision a user
    var user = { id: '5001' };
    user.displayName = 'Federated ' + req.federatedUser.displayName;
    
    req.user = user;
    next();
    
    return;
    
    // TODO Abstract this out into something common, shared between protocls
    // https://en.wikipedia.org/wiki/Federated_identity
    
    if (!req.user) {
      // TODO: Local account provisioning w/ initial linked account
    } else {
      // TODO: Account linking, storing access and refresh tokens, etc.
    }
    next();
  }


  return ceremony('oauth/callback',
    federate,
    //resume
  { getHandle: getHandle });

  /*
  return ceremony('oauth/callback',
    authenticate([ 'state', 'anonymous' ]),
    federate,
    postProcess,
  { through: 'login', required: true, getHandle: getHandle });
  */
  
};

exports['@require'] = [
  '../../idpfactory',
  //'http://schemas.authnomicon.org/js/federation/idp',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/ceremony'
];
