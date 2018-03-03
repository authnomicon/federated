exports = module.exports = function(Token) {
  Token = Token || require('oauth2-token');
  
  
  return function(issuer) {
    return function verify(accessToken, refreshToken, params, profile, cb) {
      if (profile && profile.provider) {
        delete profile.provider;
      }
    
      var info = { issuer: issuer };
      info.protocol = 'oauth2';
      info.credentials = [ Token.parse(params) ];
    
      cb(null, profile, info);
    };
  };
};
