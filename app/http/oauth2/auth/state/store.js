exports = module.exports = function(store) {
  var StateStore = require('../../../../../lib/oauth2/statestore');
  
  return new StateStore(store);
};

exports['@singleton'] = true;
exports['@require'] = [
  'http://i.bixbyjs.org/http/state/Store'
];
