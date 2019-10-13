exports = module.exports = function(IDPFactory, authenticate) {
  
  function federate(req, res, next) {
    var provider = req.query.provider;
    
    // TODO: Past `host` as option
    IDPFactory.create(provider)
      .then(function(idp) {
        var options = {};
        options.state = {
          //provider: config,
          state: req.query.state
        }
        
        // TODO: Add a `context` option, used to pass the database ID of this IdP,
        //       which can be serialized into the state for faster resumption when
        //       the IdP redirects back.
        
        // FIXME: Remove the array index here, once passport.initialize is no longer needed
        authenticate(idp, options)[1](req, res, next);
      })
      .catch(function(err) {
        console.log('IDP ERROR');
        console.log(err)
        
        next(err);
      });
  }


  return [
    federate
  ];
};

exports['@require'] = [
  '../idpfactory',
  'http://i.bixbyjs.org/http/middleware/authenticate'
];
