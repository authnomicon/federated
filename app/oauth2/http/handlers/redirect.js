/**
 * OAuth 2.0 redirection handler.
 *
 * This component provides an HTTP handler that implements the OAuth 2.0
 * [redirection endpoint][1].  The user is redirected to this endpoint by the
 * authorization server, after it has completed any interaction with the user.
 *
 * [1]: https://tools.ietf.org/html/rfc6749#section-3.1.2
 *
 * @returns {Function}
 */
exports = module.exports = function(IDPFactory, authenticate, state) {
  var utils = require('../../../../lib/utils');
  var merge = require('utils-merge')
    , dispatch = require('../../../../lib/dispatch')


  function federate(req, res, next) {
    var provider = req.state.provider
      , options = merge({}, req.state);
    
    console.log('COMPLETEING OAUTH 2');
    console.log(req.state);
    console.log(provider);
    console.log(options);
    
    delete options.provider;
    // TODO: Test cases for deleting these properties, once they are settled
    delete options.returnTo;
    // TODO: delete options.state? or whatever parent is
    //delete options.state;
    
    
    // TODO: Move this into handler
    // TODO: need to complete the state (if it was strictly for this endpoint)
    //req.state.complete();
    
    // TODO: Past `host` as option
    // TODO: Pass `idpID` as option, if available in state
    // TODO: Pass `clientID` as option, if available
    IDPFactory.create(provider, 'oauth2', options)
      .then(function(idp) {
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
      return res.resumeState(next);
    });
  }
  
  function go(req, res, next) {
    res.redirect('/');
  }
  
  // FIXME: If passport session serialization isn't set up, this isn't being called.  Why?
  //        ^ its not in the middleware stack returned below, duh!
  // TODO: Put error handing in here
  function errorHandler(err, req, res, next) {
    console.log('OAUTH2-AUTHORIZE ERROR');
    next(err);
  }
  
  
  function stateLoad() {
    console.log('SPECIAL STATE LOAD!');
  }
  
  
  // TODO: Make it possible to pass in the state store here...
  // This implies passing it to oauth2/StateStore as well, and not depending on
  // req._store / req.state.save??? (Maybe?)   Perhaps it could allow us to depend
  // on it in both oauth1 and 2
  return [
    function(req, res, next) {
      console.log('LOADING STATE FOR REDIRECT.,,,,');
      console.log(req.query);
      next();
    },
    state({ xget: stateLoad }),
    federate,
    establishSession,
    go
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
  '../../../http/idpfactory',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/state'
];
