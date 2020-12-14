exports = module.exports = function(IDPFactory, authenticate, state) {
  var utils = require('../../../../lib/utils');
  var merge = require('utils-merge')
    , dispatch = require('../../../../lib/dispatch')


  function federate(req, res, next) {
    console.log('OAUTH2 REDIRECT');
    //console.log(req.session);
    //console.log(req.state);
    //return
    
    
    var provider = req.state.provider
      , protocol = req.state.protocol || 'oauth2'
      , options = merge({}, req.state);
    
    delete options.provider;
    delete options.protocol;  
    delete options.returnTo;
    // TODO: delete options.state? or whatever parent is
    delete options.state;
    
    // TODO: Past `host` as option
    // TODO: Pass `idpID` as option, if available in state
    // TODO: Pass `clientID` as option, if available
    IDPFactory.create(provider, protocol, options)
      .then(function(idp) {
        console.log('CREATED IDP!');
        
        // FIXME: Remove the array index here, once passport.initialize is no longer needed
        utils.dispatch(authenticate(idp, { assignProperty: 'federatedUser' }))(null, req, res, next);
        
        //authenticate(idp, { assignProperty: 'federatedUser' })[1](req, res, next);
      })
      .catch(function(err) {
        next(err);
      });
  }
  
  function establishSession(req, res, next) {
    console.log('ESTABLISHING SESSION!');
    console.log(req.federatedUser)
    //return
    
    //res.redirect('/')
    
    
    req.login(req.federatedUser, function(err) {
      if (err) { return next(err); }
      //return next();
      
      return res.resumeState();
    });
  }
  
  function defBe() {
    res.redirect('/');
  }
  
  // TODO: Put error handing in here
  function errorHandler(err, req, res, next) {
    console.log('OAUTH2-AUTHORIZE ERROR');
    next(err);
  }
  
  
  
  return [
    state(),
    federate,
    establishSession,
    defBe
  ];
  
  // FIXME: Putting an invalid state name here causes an error that isn't descriptive
  /*
  return ceremony('oauth2/redirect',
    authenticate([ 'state', 'anonymous' ]),
    federate, // TODO: move all this into a common "federate" state...?
    postProcess,
    errorHandler,
  { through: 'login', required: true });
  */
  
};

exports['@require'] = [
  '../../idpfactory',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/state'
];
