var handle = require('../../../../lib/oauth/state/handle');

var defer = typeof setImmediate === 'function'
  ? setImmediate
  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)); };

exports = module.exports = function(router, idpFactory, authenticator, store) {
  
  function federate(req, res, next) {
    var provider = req.state.provider;
    
    idpFactory.create(provider, 'oauth')
      .then(function(idp) {
        defer(authenticator.authenticate(idp, { assignProperty: 'federatedUser' }), req, res, next);
      })
      .catch(function(err) {
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
  
  
  function getHandle(req) {
    return handle.fromSlug(req.query.oauth_token, req.params.slug);
  }
  
  return [
    require('flowstate')({ mutationMethods: [ 'GET' ], getHandle: getHandle, store: store }),
    federate,
    execute,
    resume,
    redirect
  ];
};

exports['@require'] = [
  '../../../actions/http/router',
  'module:@authnomicon/federated.IDProviderFactory',
  'module:@authnomicon/session.Authenticator',
  'module:flowstate.Store'
];
