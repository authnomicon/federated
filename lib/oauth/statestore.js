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
  state.consumerKey = meta.consumerKey;
  state.tokenSecret = tokenSecret;
  state.recipient = meta.callbackURL;

  var url = uri.parse(meta.userAuthorizationURL);
  // FIXME: Handle isn't getting the hostname properly...
  var h = this._toHandle(token, url.hostname, meta.callbackURL);
  
  this._store.save(req, state, { h: h }, function(err, h) {
    if (err) { return cb(err); }
    return cb(null);
  });
}

CeremonyStateStore.prototype.destroy = function(req, token, meta, cb) {
  req.state.destroy(cb);
}


module.exports = CeremonyStateStore;
