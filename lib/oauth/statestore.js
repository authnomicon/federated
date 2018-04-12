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

CeremonyStateStore.prototype.set = function(req, token, tokenSecret, state, meta, cb) {
  var url = uri.parse(meta.userAuthorizationURL);
  var h = this._toHandle(url.hostname, token);
  
  var data = {
    name: 'oauth-callback',
    provider: state.provider.identifier,
    consumerKey: meta.consumerKey,
    parent: state.state,
    tokenSecret: tokenSecret
  };
  
  this._store.save(req, data, { h: h }, function(err, h) {
    if (err) { return cb(err); }
    return cb(null);
  });
}

CeremonyStateStore.prototype.destroy = function(req, token, meta, cb) {
  req.state.destroy(cb);
}


module.exports = CeremonyStateStore;
