exports = module.exports = function(idpFactory, authenticate, state, session) {
  var utils = require('../../../lib/utils');
  
  
  function federate(req, res, next) {
    var provider = (req.state && req.state.provider) || req.query.provider
      , protocol = (req.state && req.state.protocol) || req.query.protocol
      , options = utils.merge({}, req.state);
      
      // TODO: consider switching to filter-obj for this.
      // https://github.com/sindresorhus/filter-obj
      // TODO: Test cases for this
    delete options.location;
    delete options.returnTo;
    delete options.resumeState;
    delete options.provider;
    delete options.protocol;
    
    // TODO: Past `host` as option, for multi-tenancy
    idpFactory.create(provider, protocol, options)
      .then(function(idp) {
        var state = utils.merge({}, options);
        state.provider = provider;
        
        // TODO: Pull this from state instead, not a query parameter
        /*
        if (req.query.action) {
          state.action = req.query.action.split(' ');
        }
        */
        
        // TODO: Remove utils.dispatch here
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
  '../../idp/http/factory',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/state',
  'http://i.bixbyjs.org/http/middleware/session'
];
