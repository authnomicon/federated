exports = module.exports = function(store, keyring) {
  var FacebookStrategy = require('passport-facebook');
  
  
  return new Promise(function(resolve, reject) {
    
    keyring.get('graph.facebook.com', function(err, cred) {
      if (err) { return reject(err); }
      
      var strategy = new FacebookStrategy({
          clientID: cred.username,
          clientSecret: cred.password,
          callbackURL: '/oauth2/redirect/www.facebook.com',
          store: store
        },
        function(accessToken, refreshToken, profile, cb) {
    
          return cb(null, profile);
        });
        
      return resolve(strategy);
    });
  });
};

exports['@implements'] = 'http://i.authnomicon.org/sso/http/IDProvider';
exports['@provider'] = 'https://www.facebook.com';
exports['@require'] = [
  'http://i.authnomicon.org/federated/oauth2/http/StateStore',
  'http://i.bixbyjs.org/security/Keyring'
];
