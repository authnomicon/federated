/**
 * Create a new state store.
 *
 * @classdesc This state store adapts @{link https://www.passportjs.org/packages/passport-openidconnect/ passport-openidconnect}
 * to use @{link https://github.com/jaredhanson/flowstate flowstate}
 * capabilities when maintaing state between redirects to the OpenID provider
 * (OP) and the relying party (RP) application.
 *
 * @public
 * @class
 */
function StateStore() {
}

StateStore.prototype.store = function(req, ctx, state, meta, cb) {
  // TODO: Set state.protocol to `openidconnect`?
  // TODO: Store PKCE verifier, etc
  
  state.protocol = 'openidconnect';
  if (ctx.nonce) { state.nonce = ctx.nonce; }
  
  req.pushState(state, meta.callbackURL, function(err, h) {
    if (err) { return cb(err); }
    return cb(null, h);
  });
};

StateStore.prototype.verify = function(req, state, cb) {
  if (!req.state) { return cb(new Error('OpenID Connect requires state support. Did you forget to use `flowstate` middleware?')); }
  
  var ctx = {};
  if (req.state.nonce) { ctx.nonce = req.state.nonce; }
  
  req.state.complete();
  return cb(null, ctx);
};

module.exports = StateStore;
