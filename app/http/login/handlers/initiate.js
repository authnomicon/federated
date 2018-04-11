exports = module.exports = function(ns, parse, UIS, client) {
  
  // https://docs.google.com/presentation/d/1I0pYw5xbxI8w0UuMBmj1q55mixhvV3vFHYgA6Y76Trc/edit#slide=id.gb08776a72_1_22
  
  // http://ux.stackexchange.com/questions/78805/why-is-google-using-a-new-2-step-gmail-sign-in-process
  // http://ux.stackexchange.com/questions/21836/why-do-sites-split-password-and-username-retrieval-into-two-separate-operati
  // https://productforums.google.com/forum/m/#!category-topic/gmail/oAsE-6wmaSU
  
  function logIt(req, res, next) {
    console.log('INITIATE ID LOGIN');
    console.log(req.body);
    next();
  }
  
  // WebFinger:
  //   acct:paulej@packetizer.com
  // Hostmeta:
  //   acct:paulej@packetizer.com
  function resolve(req, res, next) {
    var identifier = req.body.identifier;
    
    ns.resolveServices(identifier, function(err, services) {
      console.log('RESOLVED SERVICES!');
      console.log(err);
      console.log(services);
      
    });
    
    /*
    UIS.resolveServices(req.body.id, function(err, r) {
      console.log('GOT SERVICES:');
      console.log(err);
      console.log(r);
      
    });
    */
  }
  
  function challenge(req, res, next) {
    console.log('CHALLENGE IT!');

    /*
    var opts = {
      connection: 'sms',
      send: 'code',
      phone_number: '+555555555'
    }
    */
    
    /*
    var opts = {
      connection: 'email',
      send: 'code',
      email: 'jaredhanson@gmail.com'
    }
    */
    
    /* Auth0 - http://schemas.modulate.io/js/opt/auth0/auth/Client
    var opts = {
      connection: 'email',
      send: 'link',
      email: 'jaredhanson@gmail.com'
    }
    
    client.passwordlessStart(opts, function(err, x) {
      console.log(err);
      console.log(x);
    })
    */
  }
  
  
  return [
    parse('application/x-www-form-urlencoded'),
    logIt,
    resolve
  ];
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/ns',
  'http://i.bixbyjs.org/http/middleware/parse'
  //'http://i.bixbyjs.org/uis',
  //'http://schemas.modulate.io/js/opt/auth0/auth/Client'
];
