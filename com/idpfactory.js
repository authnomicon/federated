var LocalIDProviderFactory = require('../lib/localidpfactory');
var OpenIDConnectStrategy = require('passport-openidconnect');
var url = require('url');

exports = module.exports = function(store) {
  
  // TODO: User more flexible service discovery to aid here, rather than hard-coding environment
  // variables
  
  var idp = new OpenIDConnectStrategy({
    issuer: process.env.OPENID_ISSUER,
    authorizationURL: url.resolve(process.env.OPENID_ISSUER, process.env.OPENID_AUTHORIZATION_URL),
    tokenURL: url.resolve(process.env.OPENID_ISSUER, process.env.OPENID_TOKEN_URL),
    userProfileURL: url.resolve(process.env.OPENID_ISSUER, process.env.OPENID_USERINFO_URL),
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.OPENID_REDIRECT_URL,
    passReqToCallback: true,
    store: store
  },
  function(req, issuer, profile, context, idToken, accessToken, refreshToken, cb) {
    //var info = { type: 'federated' };
    //info.provider = issuer;
    //info.protocol = 'openidconnect';
    //info.idToken = idToken;
    
    //return cb(null, profile, info);
    return cb(null, profile);
  });
  
  
  
  return new LocalIDProviderFactory(idp);
};

exports['@singleton'] = true;
exports['@implements'] = 'module:@authnomicon/federated.IDProviderFactory';
exports['@require'] = [
  'module:passport-openidconnect.StateStore'
];
