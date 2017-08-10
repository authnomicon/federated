function StateStore(store) {
  this._store = store;
}

StateStore.prototype.store = function(req, meta, cb) {
  var state = {
    name: 'oauth2-redirect',
    authorizationURL: meta.authorizationURL,
    clientID: meta.clientID
  };
  var ps = (req.query && req.query.state) || (req.body && req.body.state);
  if (ps) { state.up = ps; }
  
  this._store.save(req, state, function(err, h) {
    if (err) { return cb(err); }
    return cb(null, h);
  });
}

StateStore.prototype.verify = function(req, h, meta, cb) {
  // https://tools.ietf.org/html/draft-bradley-oauth-jwt-encoded-state-06
  
  function loaded(err, state) {
    if (err) { return cb(err); }
    if (!state) { return cb(null, false); }
    
    // TODO: Destroy the state??
    
    if (state.name !== 'oauth2-redirect') {
      return cb(null, false);
    }
    if (state.authorizationURL !== meta.authorizationURL) {
      return cb(null, false);
    }
    if (state.clientID !== meta.clientID) {
      return cb(null, false);
    }
    return cb(null, true, state);
  }
  
  if (req.state) {
    loaded(null, req.state);
  } else {
    this._store.load(req, h, loaded);
  }
}


module.exports = StateStore;
