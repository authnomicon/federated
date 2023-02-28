exports = module.exports = function(idpFactory, authenticator, store) {
  var filterObj = require('filter-obj')
    , merge = require('utils-merge');
  
  
  function federate(req, res, next) {
    var provider = req.query.provider
      , protocol = req.query.protocol;
    
    idpFactory.create(provider, protocol)
      .then(function(idp) {
        var opts = {
          state: { provider: provider }
        };
        if (req.query.prompt) { opts.prompt = req.query.prompt; }
        if (req.query.login_hint) { opts.loginHint = req.query.login_hint; }
        
        
        // TODO: Pull this from state instead, not a query parameter
        /*
        if (req.query.action) {
          state.action = req.query.action.split(' ');
        }
        */
        
        authenticator.authenticate(idp, opts)(req, res, next);
      }, function(err) {
        next(err);
      });
  }


  return [
    require('flowstate')({ store: store }),
    federate
  ];
};

exports['@require'] = [
  'module:@authnomicon/federated.IDPFactory',
  'module:@authnomicon/session.Authenticator',
  'module:flowstate.Store'
];
