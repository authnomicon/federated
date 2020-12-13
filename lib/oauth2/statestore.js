function StateStore(store) {
  // TODO: Can remove store argument here, since we operate on req (which has the state store)
  this._store = store;
}

StateStore.prototype.store = function(req, state, meta, cb) {
  req.state.complete();
  
  state.clientID = meta.clientID;
  state.location = meta.callbackURL;
  
  // Mimics functionality of flowstate res.pushState();
  req.state.push(state);
  
  req.state.save(function(err) {
    if (err) { return cb(err); }
    return cb(null, req.state.handle);
  });
}

StateStore.prototype.verify = function(req, h, meta, cb) {
  // https://tools.ietf.org/html/draft-bradley-oauth-jwt-encoded-state-06
  
  // TODO: Make this an error, similar to CSRF
  if (!req.state) { return cb(null, false); }
  
  req.state.destroy(function(err) {
    if (err) { return cb(err); }
    return cb(null, true);
  });
}


module.exports = StateStore;
