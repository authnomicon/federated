exports = module.exports = function(IDPFactory, authenticate, state) {
  var utils = require('../../../lib/utils');
  
  
  function federate(req, res, next) {
    var provider = (req.state && req.state.provider) || req.query.provider
      , protocol = (req.state && req.state.protocol) || req.query.protocol
      , options = utils.merge({}, req.state);
      
    delete options.provider;
    delete options.protocol;  
    // TODO: Test cases for deleting these properties, once they are settled
    delete options.returnTo;
    // TODO: delete options.state? or whatever parent is
    
    
      // TODO: Bind provider into the URL to avoid attacks
      // or into the state store key, check how pkce store works...
    
    // TODO: Past `host` as option
    IDPFactory.create(provider, protocol, options)
      .then(function(idp) {
        var state = utils.merge({}, options);
        state.provider = provider;
        
        // WIP: Make sure state store is correctly pushing and verifying state with latest changes
        
        utils.dispatch(
          authenticate(idp, {
            state: state
          })
        )(null, req, res, next);
      })
      .catch(function(err) {
        console.log(err)
        
        next(err);
      });
  }


  return [
    state(),
    federate
  ];
};

exports['@require'] = [
  '../idpfactory',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/state'
];
