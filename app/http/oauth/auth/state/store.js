exports = module.exports = function(toHandle, s) {
  var StateStore = require('../../../../../lib/oauth/statestore');
  
  
  var store = new StateStore(s, toHandle);
  return store;
};

exports['@singleton'] = true;
exports['@require'] = [
  './tohandle',
  'http://i.bixbyjs.org/http/state/Store'
];
