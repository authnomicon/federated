exports = module.exports = function(store) {
  var StateStore = require('../../../lib/oauth2/statestore');
  
  return new StateStore(store);
};

exports['@implements'] = 'http://i.authnomicon.org/federation/http/oauth2/StateStore';
exports['@singleton'] = true;
exports['@require'] = [
  'http://i.bixbyjs.org/http/state/Store'
];
