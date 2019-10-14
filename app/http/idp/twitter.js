exports = module.exports = function(store, keyring) {
  var TwitterStrategy = require('passport-twitter');
  
  
  return new Promise(function(resolve, reject) {
    
    keyring.get('api.twitter.com', function(err, cred) {
      if (err) { return reject(err); }
    
      var strategy = new TwitterStrategy({
          consumerKey: cred.username,
          consumerSecret: cred.password,
          callbackURL: '/oauth/callback',
          requestTokenStore: store
        },
        function(token, tokenSecret, profile, cb) {
    
          return cb(null, profile);
        });
        
      return resolve(strategy);
    });
  });
};

exports['@implements'] = 'http://i.authnomicon.org/federation/IIDProvider';
exports['@provider'] = 'https://twitter.com';
exports['@require'] = [
  '../oauth/auth/state/store',
  'http://i.bixbyjs.org/security/Keyring'
];
