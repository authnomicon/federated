var uri = require('url');

var MAGIC = 'oauth';
  
exports.fromCallbackURL = function(token, callbackURL) {
  var url = uri.parse(callbackURL);
  var comps = url.pathname.split('/');
  var slug = comps.length > 2
           ? comps[comps.length - 1]
           : undefined;
  
  return exports.fromSlug(token, slug);
};

exports.fromSlug = function(token, slug) {
  return [ MAGIC, slug, token ].filter(function(e) { return e !== undefined; }).join('_');
};
