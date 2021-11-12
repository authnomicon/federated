exports = module.exports = function() {
  var StateStore = require('../../../lib/openidconnect/statestore');
  
  return new StateStore();
};

exports['@implements'] = 'http://i.authnomicon.org/federated/openidconnect/http/StateStore';
exports['@singleton'] = true;
exports['@require'] = [];
