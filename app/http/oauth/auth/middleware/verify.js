exports = module.exports = function(Token) {
  //Token = Token || require('oauth2-token');
  
  
  return function(issuer) {
    return function verify(token, tokenSecret, params, profile, cb) {
      console.log('OAUTH 1.0 VERIFY');
      console.log(token)
      console.log(tokenSecret)
      console.log(params)
      console.log(profile)
      
      
      
      /*
      if (profile && profile.provider) {
        delete profile.provider;
      }
    
      var info = { issuer: issuer };
      info.protocol = 'oauth2';
      info.credentials = [ Token.parse(params) ];
    
      cb(null, profile, info);
      */
    };
  };
};
