exports = module.exports = function(actions, schemeFactory, authenticate, state) {
  var utils = require('../../../../lib/utils');
  var merge = require('utils-merge');
  var handleFor = require('../../../../lib/oauth/state/handle');
  var dispatch = require('../../../../lib/dispatch');


  function getHandle(req) {
    return handleFor(req.query.oauth_token, req.params.hostname);
  }


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
      
    schemeFactory.create(provider, 'oauth', options)
      .then(function(scheme) {
        // TODO: Remove utils.dispatch here
        utils.dispatch(
          authenticate(scheme, { assignProperty: 'federatedUser' })
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
  
  
  return [
    state({ mutationMethods: [ 'GET' ], getHandle: getHandle }),
    federate,
    execute,
    resume,
    redirect
  ];
};

exports['@require'] = [
  '../../../actions/http/router',
  'module:@authnomicon/federated.IDSchemeFactory',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/state'
];
