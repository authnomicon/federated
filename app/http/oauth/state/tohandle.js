exports = module.exports = function() {
  var MAGIC = 'oauth';
  
  return function(host, token) {
    return [ MAGIC, host, token ].join('_');
  };
};
