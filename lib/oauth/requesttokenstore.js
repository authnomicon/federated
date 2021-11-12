var uri = require('url')
  , handleFor = require('./state/handle');


function RequestTokenStore() {
}

RequestTokenStore.prototype.get = function(req, token, cb) {
  if (!req.state) { return cb(new Error('OAuth requires state support. Did you forget to use `flowstate` middleware?')); }
  
  return cb(null, req.state.tokenSecret);
};

RequestTokenStore.prototype.set = function(req, token, tokenSecret, state, meta, cb) {
  var url = uri.parse(state.provider || meta.userAuthorizationURL);
  var h = handleFor(token, url.hostname);
  
  state.tokenSecret = tokenSecret;
  
  req.pushState(state, meta.callbackURL, { handle: h }, function(err, h) {
    if (err) { return cb(err); }
    return cb(null, h);
  });
};

RequestTokenStore.prototype.destroy = function(req, token, cb) {
  req.state.complete();
  cb();
};


module.exports = RequestTokenStore;
