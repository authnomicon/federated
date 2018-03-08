exports = module.exports = function() {
  var MAGIC = 'oauth';
  
  return function(host, token) {
    //return [ MAGIC, host, token ].join('_');
    return [ MAGIC, token ].join('_');
  };
};

exports['@singleton'] = true;
