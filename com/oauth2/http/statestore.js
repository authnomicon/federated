exports = module.exports = function() {
  var StateStore = require('../../../lib/oauth2/statestore');
  
  return new StateStore();
};

exports['@implements'] = 'http://i.authnomicon.org/federated/oauth2/http/StateStore';
exports['@singleton'] = true;
exports['@require'] = [];
