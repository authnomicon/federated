exports = module.exports = function(actions, idpFactory, authenticate, state, session) {
  var utils = require('../../../../lib/utils');
  var merge = require('utils-merge');
  var toHandle = require('../../../../lib/oauth/state/handle');
  var dispatch = require('../../../../lib/dispatch');


  function getHandle(req) {
    return toHandle(req.query.oauth_token, req.params.hostname);
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
      
    idpFactory.create(provider, 'oauth', options)
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
    var action = req.state.action || 'login';
    actions.dispatch(action, null, req, res, next);
  }
  
  function redirect(req, res, next) {
    res.redirect('/');
  }
  
  
  return [
    session(),
    state({ getHandle: getHandle }),
    federate,
    execute,
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
