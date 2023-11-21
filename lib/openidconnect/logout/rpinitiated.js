var url = require('url')
  , merge = require('utils-merge');


function RPInitiatedService(options) {
  options = options || {};
  
  this._logoutURL = options.logoutURL;
  this._clientID = options.clientID;
  this._callbackURL = options.callbackURL;
}

RPInitiatedService.prototype.logout = function(ctx, res, next) {
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
  
  // FIXME: this is adding a return_to parameter, which it should not
  //res.redirect(location);
  
  // TODO: make sure returnTo isn't being set here, so we can go back to the splash
  // page rather than the page that logout was clicked from
  res.req.pushState({}, this._callbackURL);
  res.redirect(location);
}


module.exports = RPInitiatedService;
