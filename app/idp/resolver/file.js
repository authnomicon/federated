exports = module.exports = function() {
  var uri = require('url')
    , FileResolver = require('../../../lib/idp/resolvers/file');
  
  
  return {
    canCreate: function(options) {
      if (typeof options == 'string') {
        options = { url: options };
      }
      
      var url = options.url;
      if (!url) { return false; }
      
      url = uri.parse(url);
      if (url.protocol == 'file:') { return true; }
      return false;
    },
    
    create: function(options) {
      if (typeof options == 'string') {
        options = { url: options };
      }
      
      var url = uri.parse(options.url);
      return new FileResolver(url.pathname);
    }
  };
};

exports['@name'] = 'file';
exports['@require'] = [];
