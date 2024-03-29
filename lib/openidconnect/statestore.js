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

/**
 * Store state.
 *
 * @public
 */
StateStore.prototype.store = function(req, ctx, state, meta, cb) {
  // TODO: Store PKCE verifier, etc
  
  // Add the protocol to state.  This is used on the subsequent request to the
  // redirect endpoint when the OP redirects the user back to the application.
  // When this request is handled, a strategy needs to be created to
  // authenticate the request.  Due to the fact that OpenID Connect is a layer
  // on top of OAuth 2.0, the same endpoint handles requests for both protocols.
  // Including the protocol in state allows the handler to create the correct
  // strategy and ensure that the necessary validations are performed.
  //
  // The value of "openidconnect" was chosen because that is the example value
  // illustrated by W3C Credential Management [FederatedCredential](1) interface.
  // No official registry of protocols exists.
  //
  // [1]: https://www.w3.org/TR/credential-management-1/#federatedcredential-interface
  state.protocol = 'openidconnect';
  if (ctx.nonce) { state.nonce = ctx.nonce; }
  if (ctx.maxAge) { state.maxAge = ctx.maxAge; }
  if (ctx.issued) { state.issued = ctx.issued; }
  
  req.pushState(state, meta.callbackURL, function(err, h) {
    if (err) { return cb(err); }
    return cb(null, h);
  });
};

/**
 * Verify state.
 *
 * @public
 */
StateStore.prototype.verify = function(req, state, cb) {
  process.nextTick(function() {
    if (!req.state) { return cb(new Error('OpenID Connect requires state support. Did you forget to use `flowstate` middleware?')); }
  
    // TODO: validate that state was bound to this URL (ie, is not new)
  
    var ctx = {};
    if (req.state.nonce) { ctx.nonce = req.state.nonce; }
    if (req.state.maxAge) { ctx.maxAge = req.state.maxAge; }
    if (req.state.issued) {
      ctx.issued = req.state.issued;
      if (typeof ctx.issued === 'string') {
        // convert issued to a Date object
        ctx.issued = new Date(ctx.issued);
      }
    }
  
    req.state.complete();
    return cb(null, ctx);
  });
};

module.exports = StateStore;
