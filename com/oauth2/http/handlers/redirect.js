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
exports = module.exports = function(actions, idpFactory, authenticator, store) {
  var merge = require('utils-merge');


  function federate(req, res, next) {
    var provider = req.state.provider
      , protocol = req.state.protocol || 'oauth2';
    
    idpFactory.create(provider, protocol)
      .then(function(idp) {
        authenticator.authenticate(idp, { assignProperty: 'federatedUser' })(req, res, next);
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
    //state({ mutationMethods: [ 'GET', 'POST' ]}),
    require('flowstate')({ mutationMethods: [ 'GET', 'POST' ], store: store }),
    federate,
    execute,
    resume,
    redirect
  ];
};

exports['@require'] = [
  '../../../actions/http/router',
  'module:@authnomicon/federated.IDPFactory',
  'module:@authnomicon/session.Authenticator',
  'module:flowstate.Store'
];
