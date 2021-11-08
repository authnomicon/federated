var uri = require('url')
  , _toHandle = require('./state/handle');


function CeremonyStateStore(store, toHandle) {
  this._store = store;
  this._toHandle = toHandle || _toHandle;
}

CeremonyStateStore.prototype.get = function(req, token, cb) {
  if (!req.state) { return cb(null, false, { message: 'Unable to obtain request token secret.' }); }
  
  return cb(null, req.state.tokenSecret);
}

CeremonyStateStore.prototype.set = function(req, token, tokenSecret, state, meta, cb) {
  var url = uri.parse(state.provider || meta.userAuthorizationURL);
  var h = this._toHandle(token, url.hostname);
  
  state.tokenSecret = tokenSecret;
  
  req.pushState(state, meta.callbackURL, { handle: h }, function(err, h) {
    if (err) { return cb(err); }
    return cb(null, h);
  });
}

CeremonyStateStore.prototype.destroy = function(req, token, meta, cb) {
  req.state.destroy(cb);
}


module.exports = CeremonyStateStore;
