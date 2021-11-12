var uri = require('url');


function StateStore() {
}

StateStore.prototype.store = function(req, ctx, state, meta, cb) {
  // TODO: Set state.protocol to `openidconnect`?
  // TODO: Store PKCE verifier, etc
  
  if (ctx.nonce) { state.nonce = ctx.nonce; }
  
  req.pushState(state, meta.callbackURL, function(err, h) {
    if (err) { return cb(err); }
    return cb(null, h);
  });
};

StateStore.prototype.verify = function(req, handle, cb) {
  // TODO: Make this an error, similar to CSRF
  // TODO: Ensure that this check is strict enough, and req.state isn't being auto-populated
  //       should put some checks in the redirect handler
  if (!req.state) { return cb(null, false, { message: 'Unable to verify authorization request state.' }); }
  
  // TODO: This can be simpliefied to check for stuff native to the OIDC protocol
  var url = uri.parse(req.state.provider);
  if (url.hostname !== req.params.hostname) {
    return cb(null, false, { message: 'Authorization response received from incorrect authorization server.' });
  }
  
  // TODO: Implement something like https://tools.ietf.org/html/draft-meyerzuselhausen-oauth-iss-auth-resp-02
  // if req.params.hostname is not available
  
  req.state.destroy(function(err) {
    if (err) { return cb(err); }
    return cb(null, true);
  });
};

module.exports = StateStore;
