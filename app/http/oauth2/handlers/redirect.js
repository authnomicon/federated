exports = module.exports = function(IDPFactory, authenticate, state) {
  var utils = require('../../../../lib/utils');
  var merge = require('utils-merge')
    , dispatch = require('../../../../lib/dispatch')


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
    IDPFactory.create(provider, 'oauth2', options)
      .then(function(idp) {
        // FIXME: Remove the array index here, once passport.initialize is no longer needed
        utils.dispatch(
          authenticate(idp, { assignProperty: 'federatedUser' })
        )(null, req, res, next);
      })
      .catch(function(err) {
        next(err);
      });
  }
  
  // TODO: Need some account linking/provisioning service here
  
  function establishSession(req, res, next) {
    req.login(req.federatedUser, function(err) {
      if (err) { return next(err); }
      // TODO: Pass next to resumeState, for default behavior
      return res.resumeState();
    });
  }
  
  function redirect() {
    res.redirect('/');
  }
  
  // FIXME: If passport session serialization isn't set up, this isn't being called.  Why?
  //        ^ its not in the middleware stack returned below, duh!
  // TODO: Put error handing in here
  function errorHandler(err, req, res, next) {
    console.log('OAUTH2-AUTHORIZE ERROR');
    next(err);
  }
  
  
  
  return [
    state(),
    federate,
    establishSession,
    redirect
  ];
  
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
  'http://i.bixbyjs.org/http/middleware/state'
];
