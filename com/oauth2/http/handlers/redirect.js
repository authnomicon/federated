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
exports = module.exports = function(actions, idpFactory, authenticate, state, session) {
  var utils = require('../../../../lib/utils');
  var merge = require('utils-merge')
    , dispatch = require('../../../../lib/dispatch')


  function federate(req, res, next) {
    var provider = req.state.provider
      , options = merge({}, req.state);
    
    delete options.provider;
    // TODO: Test cases for deleting these properties, once they are settled
    //delete options.returnTo;
    // TODO: delete options.state? or whatever parent is
    //delete options.state;
    
    // TODO: Past `host` as option
    // TODO: Pass `idpID` as option, if available in state
    // TODO: Pass `clientID` as option, if available
    idpFactory.create(provider, 'oauth2', options)
      .then(function(idp) {
        // TODO: Remove utils.dispatch here
        utils.dispatch(
          authenticate(idp, { assignProperty: 'federatedUser' })
        )(null, req, res, next);
      })
      .catch(function(err) {
        next(err);
      });
  }
  
  function execute(req, res, next) {
    var acts = req.state.action || [ 'login' ];
    if (!Array.isArray(acts)) {
      acts = [ acts ];
    }
    
    var i = 0;
    (function iter(err) {
      if (err) { return next(err); }
      
      var act = acts[i++];
      if (!act) { return next(); }
      actions.dispatch(act, null, req, res, iter);
    })();
  }
  
  function resume(req, res, next) {
    res.resumeState(next);
  }
  
  function redirect(req, res, next) {
    res.redirect('/');
  }
  
  // FIXME: If passport session serialization isn't set up, this isn't being called.  Why?
  //        ^ its not in the middleware stack returned below, duh!
  // TODO: Put error handing in here
  function errorHandler(err, req, res, next) {
    next(err);
  }
  
  
  return [
    session(),
    state({ mutationMethods: [ 'GET', 'POST' ]}),
    federate,
    execute,
    resume,
    redirect
  ];
};

exports['@require'] = [
  '../../../actions/http/router',
  '../../../idp/http/factory',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/state',
  'http://i.bixbyjs.org/http/middleware/session'
];
