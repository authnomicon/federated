exports = module.exports = function() {
  var RequestTokenStore = require('../../../lib/oauth/statestore');
  
  return new RequestTokenStore();
};

exports['@implements'] = 'http://i.authnomicon.org/federated/oauth/http/RequestTokenStore';
exports['@singleton'] = true;
exports['@require'] = [];
