exports = module.exports = function(store, vault) {
  var TwitterStrategy = require('passport-twitter');
  
  
  return new Promise(function(resolve, reject) {
    
    vault.get('api.twitter.com', function(err, cred) {
      if (err) { return reject(err); }
    
      var strategy = new TwitterStrategy({
          consumerKey: cred.username,
          consumerSecret: cred.password,
          callbackURL: '/oauth/callback/twitter.com',
          requestTokenStore: store
        },
        function(token, tokenSecret, profile, cb) {
          // TODO: Delete provider property?
          //if (profile && profile.provider) {
          //  delete profile.provider;
          //}
    
          return cb(null, profile);
        });
        
      return resolve(strategy);
    });
  });
};

exports['@implements'] = 'http://i.authnomicon.org/federated/http/IDProvider';
exports['@provider'] = 'https://twitter.com';
exports['@require'] = [
  'http://i.authnomicon.org/federated/oauth/http/RequestTokenStore',
  'http://i.bixbyjs.org/security/credentials/PasswordVault'
];
