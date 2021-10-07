exports = module.exports = function(actions, IDPFactory, authenticate, state, session) {
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
    delete options.returnTo;
    // TODO: delete options.state? or whatever parent is
    //delete options.state;
    
    // TODO: Past `host` as option
    // TODO: Pass `idpID` as option, if available in state
    // TODO: Pass `clientID` as option, if available
      
    IDPFactory.create(provider, 'oauth', options)
      .then(function(idp) {
        utils.dispatch(
          authenticate(idp, { assignProperty: 'federatedUser' })
        )(null, req, res, next);
      })
      .catch(function(err) {
        next(err);
      });
  }
  
  function establishSession(req, res, next) {
    console.log('DO ACTION');
    //req.state;
    console.log(req.state);
    //console.log(req.federatedUser);
    //console.log(req.authInfo);
    //return;
    
    
    var action = req.state.action || 'login';
    actions.dispatch(action, null, req, res, next);
  }
  
  function go(req, res, next) {
    res.redirect('/');
  }
  
  return [
    session(),
    state({ getHandle: getHandle }),
    federate,
    establishSession,
    go
  ];

  /*
  return ceremony('oauth/callback',
    authenticate([ 'state', 'anonymous' ]),
    federate,
    postProcess,
  { through: 'login', required: true, getHandle: getHandle });
  */
  
};

exports['@require'] = [
  '../../../http/actions',
  '../../../http/idpfactory',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/state',
  'http://i.bixbyjs.org/http/middleware/session'
];
