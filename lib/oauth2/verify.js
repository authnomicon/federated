exports = module.exports = function() {
  
  return function verify(accessToken, refreshToken, params, profile, cb) {
    // TODO: Remove provider from profile
    // TODO: Indicate issuer in some normalized way.
    
    cb(null, profile);
  };
};
