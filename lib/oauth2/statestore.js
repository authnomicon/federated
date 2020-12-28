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
  console.log('VERIFY OAUTH2 STATE');
  console.log(handle);
  console.log(req.state);
  console.log(req.query)
  
  // https://tools.ietf.org/html/draft-bradley-oauth-jwt-encoded-state-06
  
  // TODO: Make this an error, similar to CSRF
  // TODO: Ensure that this check is strict enough, and req.state isn't being auto-populated
  //       should put some checks in the redirect handler
  if (!req.state) { return cb(null, false, { message: 'Unable to verify authorization request state.' }); }
  
  req.state.destroy(function(err) {
    if (err) { return cb(err); }
    return cb(null, true);
  });
}


module.exports = StateStore;
