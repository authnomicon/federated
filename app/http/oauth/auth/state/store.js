exports = module.exports = function(toHandle, store) {
  var StateStore = require('../../../../../lib/oauth/statestore');
  
  return new StateStore(store, toHandle);
};

exports['@singleton'] = true;
exports['@require'] = [
  './tohandle',
  'http://i.bixbyjs.org/http/state/Store'
];
