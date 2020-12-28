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

StateStore.prototype.verify = function(req, h, meta, cb) {
  console.log('VERIFY OAUTH2 STATE');
  console.log(h);
  console.log(meta);
  
  // https://tools.ietf.org/html/draft-bradley-oauth-jwt-encoded-state-06
  
  // TODO: Make this an error, similar to CSRF
  if (!req.state) { return cb(null, false); }
  
  req.state.destroy(function(err) {
    if (err) { return cb(err); }
    return cb(null, true);
  });
}


module.exports = StateStore;
