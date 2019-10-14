exports = module.exports = function(store) {
  var StateStore = require('../../../../../lib/oauth/statestore')
    , toHandle = require('../../../../../lib/oauth/state/handle')
  
  return new StateStore(store, toHandle);
};

exports['@singleton'] = true;
exports['@require'] = [
  'http://i.bixbyjs.org/http/state/Store'
];
