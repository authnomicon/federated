exports = module.exports = function() {
  var uri = require('url')
    , template = require('url-template');
  
  
  var MAGIC = 'oauth';
  var HOST_CALLBACK_TEMPLATE = template.parse('/oauth/callback/{host}');
  
  return function(token, host, callbackURL) {
    var h = [ MAGIC, token ]
      , url, callbackPath, hostCallbackPath;
    if (callbackURL) {
      url = uri.parse(callbackURL);
      callbackPath = url.pathname;
      hostCallbackPath = HOST_CALLBACK_TEMPLATE.expand({ host: host });
      
      if (callbackPath == hostCallbackPath) {
        h = [ MAGIC, host, token ];
      }
    }
    return h.join('_');
  };
};

exports['@singleton'] = true;
