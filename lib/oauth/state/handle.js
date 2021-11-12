var MAGIC = 'oauth';
  
module.exports = function(token, host) {
  return [ MAGIC, host, token ].join('_');
};
