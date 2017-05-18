exports = module.exports = function(createProvider, authenticator) {
  
  function initialize(req, res, next) {
    req.locals = req.locals || {};
    next();
  }
  
  function loadProvider(req, res, next) {
    var opts = {
      host: req.params.host
    };
    
    createProvider(opts, function(err, provider) {
      if (err) { return next(err); }
      req.locals.provider = provider;
      next();
    });
  }
  
  function authenticate(req, res, next) {
    authenticator.authenticate(req.locals.provider)(req, res, next);
  }


  return [
    initialize,
    loadProvider,
    authenticate,
  ];
  
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/sso/createProvider',
  'http://i.bixbyjs.org/http/Authenticator'
];
