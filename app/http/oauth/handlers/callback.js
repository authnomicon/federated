exports = module.exports = function(IDPFactory, /*idp,*/ authenticate, state) {
  var utils = require('../../../../lib/utils');
  var merge = require('utils-merge');
  var toHandle = require('../../../../lib/oauth/state/handle');
  var dispatch = require('../../../../lib/dispatch');


  function getHandle(req) {
    return toHandle(req.query.oauth_token, req.params.host, req.originalUrl);
  }


  function federate(req, res, next) {
    var provider = req.state.provider
      , options = merge({}, req.state);
    
    // TODO: Past `host` as option
    // TODO: Pass `idpID` as option, if available in state
    // TODO: Pass `clientID` as option, if available
    IDPFactory.create(provider)
      .then(function(idp) {
        // FIXME: Remove the array index here, once passport.initialize is no longer needed
        //authenticate(idp, { assignProperty: 'federatedUser' })[1](req, res, next);
        
        utils.dispatch(authenticate(idp, { assignProperty: 'federatedUser' }))(null, req, res, next);
      })
      .catch(function(err) {
        next(err);
      });
  }
  
  function establishSession(req, res, next) {
    req.login(req.federatedUser, function(err) {
      if (err) { return next(err); }
      return res.resumeState(next);
    });
  }
  
  function go(req, res, next) {
    res.redirect('/');
  }
  
  return [
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
  '../../idpfactory',
  //'http://schemas.authnomicon.org/js/federation/idp',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/state'
];
