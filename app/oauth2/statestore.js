exports = module.exports = function(s) {
  var StateStore = require('../../lib/oauth2/statestore');
  
  
  var store = new StateStore(s);
  return store;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/http/StateStore';
exports['@singleton'] = true;
exports['@require'] = [
  'http://i.bixbyjs.org/http/workflow/StateStore'
];
