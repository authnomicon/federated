exports = module.exports = function(createProtocol, IDPFactory, /*idp,*/ authenticate, ceremony) {

  function federate(req, res, next) {
    console.log('FEDERATE!');
    console.log(req.query)
    console.log(req.state);
    
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
  
  function resume(req, res, next) {
    console.log('RESUME THINGS....');
    console.log(req.state);
    
    
    var url = req.state.returnTo;
    return res.redirect(url);
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
  
  function errorHandler(err, req, res, next) {
    console.log('OAUTH2-AUTHORIZE ERROR');
    next(err);
  }


  // FIXME: The following invalid, required state name causes an incorrect error in flowstate
  //ceremony.loadState({ name: 'sso/oauth2x', required: true }),
  
  /*
  return ceremony('oauth2/redirect',
    federate, // TODO: move all this into a common "federate" state...?
  { through: 'login', required: true });
  */
  
  
  return ceremony('oauth2/redirect',
    federate,
    resume
  );
  
  //return [
  //  federate
  //];
  
  // FIXME: Putting an invalid state name here causes an error that isn't descriptive
  /*
  return ceremony('oauth2/redirect',
    authenticate([ 'state', 'anonymous' ]),
    federate, // TODO: move all this into a common "federate" state...?
    postProcess,
    errorHandler,
  { through: 'login', required: true });
  */
  
};

exports['@require'] = [
  '../auth/protocol',
  '../../idpfactory',
  //'http://schemas.authnomicon.org/js/federation/idp',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/ceremony'
];
