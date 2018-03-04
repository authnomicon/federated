exports = module.exports = function(toHandle, s) {
  var StateStore = require('../../../../lib/oauth/statestore');
  
  
  var store = new StateStore(s, toHandle);
  return store;
};

exports['@require'] = [
  './tohandle',
  'http://i.bixbyjs.org/http/workflow/StateStore'
];
