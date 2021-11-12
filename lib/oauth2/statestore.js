var uri = require('url');


function StateStore() {
}

StateStore.prototype.store = function(req, state, meta, cb) {
  // TODO: Store PKCE verifier, if available
  
  req.pushState(state, meta.callbackURL, function(err, h) {
    if (err) { return cb(err); }
    return cb(null, h);
  });
};

StateStore.prototype.verify = function(req, state, cb) {
  // https://tools.ietf.org/html/draft-bradley-oauth-jwt-encoded-state-06
  
  if (!req.state) { return cb(new Error('OAuth 2.0 requires state support. Did you forget to use `flowstate` middleware?')); }
  
  if (!req.params.hostname) {
    return cb(null, false, { message: 'OAuth 2.0 authorization response received on indistinct redirect URI.' });
  }
  
  // Protection against mix-up attacks.
  // https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics#section-4.4
  var url = uri.parse(req.state.provider);
  if (url.hostname !== req.params.hostname) {
    return cb(null, false, { message: 'OAuth 2.0 authorization response received from incorrect authorization server.' });
  }
  
  // TODO: Implement support for https://datatracker.ietf.org/doc/html/draft-ietf-oauth-iss-auth-resp
  
  req.state.complete();
  return cb(null, true);
};


module.exports = StateStore;
