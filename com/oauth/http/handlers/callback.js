exports = module.exports = function(router, idpFactory, authenticator, store) {
  var handleFor = require('../../../../lib/oauth/state/handle');


  function getHandle(req) {
    return handleFor(req.query.oauth_token, req.params.hostname);
  }


  function federate(req, res, next) {
    var provider = req.state.provider;
    
    idpFactory.create(provider, 'oauth')
      .then(function(idp) {
        authenticator.authenticate(idp, { assignProperty: 'federatedUser' })(req, res, next);
      })
      .catch(function(err) {
        next(err);
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
