var uri = require('url');


function StateStore() {
}

StateStore.prototype.store = function(req, state, meta, cb) {
  state.location = meta.callbackURL;
  
  // Mimics functionality of flowstate res.pushState();
  req.state.push(state);
  
  req.state.save(function(err) {
    if (err) { return cb(err); }
    return cb(null, req.state.handle);
  });
}

StateStore.prototype.verify = function(req, handle, cb) {
  // https://tools.ietf.org/html/draft-bradley-oauth-jwt-encoded-state-06
  
  // TODO: Make this an error, similar to CSRF
  // TODO: Ensure that this check is strict enough, and req.state isn't being auto-populated
  //       should put some checks in the redirect handler
  if (!req.state) { return cb(null, false, { message: 'Unable to verify authorization request state.' }); }
  
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
}


module.exports = StateStore;
