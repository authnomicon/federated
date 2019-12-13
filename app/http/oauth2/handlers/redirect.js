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
  
  function establishSession(req, res, next) {
    req.login(req.federatedUser, function(err) {
      if (err) { return next(err); }
      return next();
    });
  }
  
  // TODO: Put error handing in here
  function errorHandler(err, req, res, next) {
    console.log('OAUTH2-AUTHORIZE ERROR');
    next(err);
  }
  
  
  return ceremony(
    federate,
    [ establishSession ]
  );
  
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
