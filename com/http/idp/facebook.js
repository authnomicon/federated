exports = module.exports = function(store, vault) {
  var FacebookStrategy = require('passport-facebook');
  
  
  return new Promise(function(resolve, reject) {
    
    vault.get('graph.facebook.com', function(err, cred) {
      if (err) { return reject(err); }
      
      var strategy = new FacebookStrategy({
          clientID: cred.username,
          clientSecret: cred.password,
          callbackURL: '/oauth2/redirect/www.facebook.com',
          store: store
        },
        function(accessToken, refreshToken, profile, cb) {
          // TODO: consider this stuff
          //if (profile && profile.provider) {
          //  delete profile.provider;
          //}
          
          // Token = Token || require('oauth2-token');
          //var info = { issuer: issuer };
          //info.protocol = 'oauth2';
          //info.credentials = [ Token.parse(params) ];
    
    
          return cb(null, profile);
        });
        
      return resolve(strategy);
    });
  });
};

exports['@implements'] = 'http://i.authnomicon.org/federated/http/IDProvider';
exports['@provider'] = 'https://www.facebook.com';
exports['@require'] = [
  'http://i.authnomicon.org/federated/oauth2/http/StateStore',
  'http://i.bixbyjs.org/security/credentials/PasswordVault'
];
