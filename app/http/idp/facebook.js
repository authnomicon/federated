exports = module.exports = function(keyring) {
  var FacebookStrategy = require('passport-facebook');
  
  
  return new Promise(function(resolve, reject) {
    
    keyring.get('graph.facebook.com', function(err, cred) {
      if (err) { return reject(err); }
    
      var strategy = new FacebookStrategy({
          clientID: cred.username,
          clientSecret: cred.password,
          callbackURL: '/oauth2/redirect',
        },
        function(accessToken, refreshToken, profile, cb) {
    
          return cb(null, profile);
        });
        
      return resolve(strategy);
    });
  });
};

exports['@implements'] = 'http://i.authnomicon.org/federation/IIDProvider';
exports['@provider'] = 'https://www.facebook.com';
exports['@require'] = [
  'http://i.bixbyjs.org/security/Keyring'
];
