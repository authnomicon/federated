exports = module.exports = function(idpFactory, authenticator, store) {
  var filterObj = require('filter-obj')
    , merge = require('utils-merge');
  
  
  function federate(req, res, next) {
    var provider = (req.state && req.state.provider) || req.query.provider
      , protocol = (req.state && req.state.protocol) || req.query.protocol;
    
    var options = (req.state && filterObj(req.state, function(k) {
      return [
        'location',
        'returnTo',
        'resumeState',
        'provider',
        'protocol'
      ].indexOf(k) === -1;
    })) || {};
    
    
    // TODO: Past `host` as option, for multi-tenancy
    idpFactory.create(provider, protocol, options)
      .then(function(idp) {
        var opts = {
          state: merge({ provider: provider }, options)
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
  'module:@authnomicon/federated.IDPSchemeFactory',
  'module:@authnomicon/session.Authenticator',
  'module:flowstate.Store'
];
