function StateStore(store) {
  this._store = store;
}

StateStore.prototype.store = function(req, state, meta, cb) {
  // FIXME: Rename `name` to `type`
  // TODO: Make a serializer for the provider, which should be in the token type somehow
  var data = {
    name: 'oauth2-redirect',
    provider: state.provider.identifier,
    clientID: meta.clientID,
    parent: state.state
  };
  
  this._store.save(req, data, function(err, h) {
    if (err) { return cb(err); }
    return cb(null, h);
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
