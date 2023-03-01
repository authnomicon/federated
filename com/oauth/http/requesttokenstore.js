var RequestTokenStore = require('../../../lib/oauth/requesttokenstore');

exports = module.exports = function() {
  return new RequestTokenStore();
};

exports['@singleton'] = true;
exports['@implements'] = 'module:passport-oauth1.RequestTokenStore';
