var handle = require('./state/handle');


function RequestTokenStore() {
}

RequestTokenStore.prototype.get = function(req, token, cb) {
  process.nextTick(function() {
    if (!req.state) { return cb(new Error('OAuth requires state support. Did you forget to use `flowstate` middleware?')); }
  
    // TODO: validate that state was bound to this URL (ie, is not new)
  
    return cb(null, req.state.tokenSecret);
  });
};

RequestTokenStore.prototype.set = function(req, token, tokenSecret, state, meta, cb) {
  var h = handle.fromCallbackURL(token, meta.callbackURL);
  state.tokenSecret = tokenSecret;
  
  req.pushState(state, meta.callbackURL, { handle: h }, function(err, h) {
    if (err) { return cb(err); }
    return cb(null, h);
  });
};

RequestTokenStore.prototype.destroy = function(req, token, cb) {
  process.nextTick(function() {
    req.state.complete();
    cb();
  });
};


module.exports = RequestTokenStore;
