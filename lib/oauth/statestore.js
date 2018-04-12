var uri = require('url');


function CeremonyStateStore(store, toHandle) {
  this._store = store;
  this._toHandle = toHandle;
}

CeremonyStateStore.prototype.get = function(req, token, meta, cb) {
  // TODO: Make this an error, similar to CSRF
  if (!req.state) { return cb(null, false); }
  
  return cb(null, req.state.tokenSecret);
}

CeremonyStateStore.prototype.set = function(req, token, tokenSecret, meta, cb) {
  var url = uri.parse(meta.userAuthorizationURL);
  var h = this._toHandle(url.hostname, token);
  
  var state = {
    name: 'oauth-callback',
    provider: meta.state.provider.identifier,
    consumerKey: meta.consumerKey,
    parent: meta.state.state,
    tokenSecret: tokenSecret
  };
  // TODO: Rename state.up to state.state
  
  //var ps = (req.query && req.query.state) || (req.body && req.body.state);
  //if (ps) { state.prev = ps; }
  
  this._store.save(req, state, { h: h }, function(err, h) {
    if (err) { return cb(err); }
    return cb(null);
  });
}

CeremonyStateStore.prototype.destroy = function(req, token, meta, cb) {
  req.state.destroy(cb);
}


module.exports = CeremonyStateStore;
