var defer = typeof setImmediate === 'function'
  ? setImmediate
  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)); };

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
exports = module.exports = function(router, idpFactory, authenticator, store) {
  
  function federate(req, res, next) {
    var provider = req.state.provider
      , protocol = req.state.protocol || 'oauth2';
    
    idpFactory.create(provider, protocol)
      .then(function(idp) {
        defer(authenticator.authenticate(idp, { assignProperty: 'federatedUser' }), req, res, next);
      }, function(err) {
        defer(next, err);
      });
  }
  
  function execute(req, res, next) {
    var actions = req.state.action || [ 'login' ];
    if (!Array.isArray(actions)) {
      actions = [ actions ];
    }
    
    var i = 0;
    (function iter(err) {
      if (err) { return next(err); }
      
      var action = actions[i++];
      if (!action) { return next(); }
      router.dispatch(action, null, req, res, iter);
    })();
  }
  
  function resume(req, res, next) {
    res.resumeState(next);
  }
  
  function redirect(req, res, next) {
    res.redirect('/');
  }
  
  
  return [
    require('flowstate')({ store: store }),
    federate,
    execute,
    resume,
    redirect
  ];
};

exports['@require'] = [
  '../../../actions/http/router',
  'module:@authnomicon/federated.IDProviderFactory',
  'module:passport.Authenticator',
  'module:flowstate.Store'
];
