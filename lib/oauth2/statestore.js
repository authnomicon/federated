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
  
  process.nextTick(function() {
    if (!req.state) { return cb(new Error('OAuth 2.0 requires state support. Did you forget to use `flowstate` middleware?')); }
  
  
    // TODO: validate that state was bound to this URL (ie, is not new)
  
    // Protection against mix-up attacks.
    // https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics#section-4.4
    // NOTE: flowstate is already providing countermeasures here when distinct redirect URIs are
    // being used.
    // https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics#section-4.4.2.2
  
    // TODO: Implement support for https://datatracker.ietf.org/doc/html/draft-ietf-oauth-iss-auth-resp
    // this should be native in passport-oauth2, wiht an `issuer` parameter, like OIDC
    
    req.state.complete();
    return cb(null, true);
  });
};


module.exports = StateStore;
