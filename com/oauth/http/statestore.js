exports = module.exports = function(/*store*/) {
  var StateStore = require('../../../lib/oauth/statestore')
    , toHandle = require('../../../lib/oauth/state/handle')
  
  //return new StateStore(store, toHandle);
  return new StateStore();
};

exports['@implements'] = 'http://i.authnomicon.org/federated/oauth/http/RequestTokenStore';
exports['@singleton'] = true;
exports['@require'] = [
  //'http://i.bixbyjs.org/http/StateStore'
];
