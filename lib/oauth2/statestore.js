function StateStore(store) {
  this._store = store;
}

StateStore.prototype.store = function(req, meta, cb) {
  // FIXME: Rename `name` to `type`
  // TODO: Make a serializer for the provider, which should be in the token type somehow
  var state = {
    name: 'oauth2-redirect',
    provider: meta.state.provider.identifier,
    clientID: meta.clientID,
    prev: meta.state.state
    //up: meta.state.state
  };
  // TODO: Rename state.up to state.state
  
  //var ps = (req.query && req.query.state) || (req.body && req.body.state);
  //if (ps) { state.up = ps; }
  
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
    
    return cb(null, true, state);
  }
  
  if (req.state) {
    loaded(null, req.state);
  } else {
    this._store.load(req, h, loaded);
  }
}


module.exports = StateStore;
