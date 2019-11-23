exports = module.exports = function(IDPFactory, authenticate, ceremony) {

  function federate(req, res, next) {
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
  
  // TODO: Remove this, its in flowstate now.
  function resume(req, res, next) {
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


  /*
  return ceremony('oauth2/redirect',
    federate, // TODO: move all this into a common "federate" state...?
  { through: 'login', required: true });
  */
  
  
  //return ceremony('oauth2/redirect',
  return ceremony(
    federate,
    //resume
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
  '../../idpfactory',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/ceremony'
];
