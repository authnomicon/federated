exports = module.exports = function(idpFactory, authenticate, state, session) {
  var utils = require('../../../lib/utils');
  
  
  function federate(req, res, next) {
    var provider = (req.state && req.state.provider) || req.query.provider
      , protocol = (req.state && req.state.protocol) || req.query.protocol
      , options = utils.merge({}, req.state);
      
    delete options.provider;
    delete options.protocol;
    
    // TODO: Past `host` as option, for multi-tenancy
    idpFactory.create(provider, protocol, options)
      .then(function(idp) {
        var state = utils.merge({}, options);
        state.provider = provider;
        
        utils.dispatch(
          authenticate(idp, {
            state: state
          })
        )(null, req, res, next);
      }, function(err) {
        next(err);
      });
  }


  return [
    session(),
    state(),
    federate
  ];
};

exports['@require'] = [
  '../idpfactory',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/state',
  'http://i.bixbyjs.org/http/middleware/session'
];
