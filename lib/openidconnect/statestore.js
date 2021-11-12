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

StateStore.prototype.verify = function(req, state, cb) {
  // TODO: Make this an error, similar to CSRF
  // TODO: Ensure that this check is strict enough, and req.state isn't being auto-populated
  //       should put some checks in the redirect handler
  if (!req.state) { return cb(null, false, { message: 'Unable to verify authorization request state.' }); }
  
  var ctx = {};
  if (req.state.nonce) { ctx.nonce = req.state.nonce; }
  
  req.state.complete();
  return cb(null, ctx);
};

module.exports = StateStore;
