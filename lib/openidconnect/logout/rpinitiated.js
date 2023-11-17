var url = require('url')
  , merge = require('utils-merge');


function RPInitiatedService(options) {
  options = options || {};
  
  this._logoutURL = options.logoutURL;
  this._clientID = options.clientID;
  this._callbackURL = options.callbackURL;
}

RPInitiatedService.prototype.logout = function(ctx, res, next) {
  console.log('RPInitiatedService#logout');
  console.log(this);
  console.log(ctx);
  
  
  var params = {};
  
  var clientID = this._clientID;
  if (clientID) {
    params.client_id = clientID;
  }
  var logoutHint = ctx.logoutHint;
  if (logoutHint) {
    params.logout_hint = logoutHint;
  }
  var callbackURL = this._callbackURL;
  if (callbackURL) {
    params.post_logout_redirect_uri = callbackURL;
  }
  
  
  var parsed = url.parse(this._logoutURL, true);
  merge(parsed.query, params);
  delete parsed.search;
  var location = url.format(parsed);
  
  console.log('REDIRECT TO: ' + location);
  // FIXME: this is adding a return_to parameter, which it should not
  //res.redirect(location);
  
  res.req.pushState({ foox: 'barx' }, this._callbackURL);
  res.redirect(location);
}


module.exports = RPInitiatedService;
