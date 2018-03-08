exports = module.exports = function(s) {
  var StateStore = require('../../../../lib/oauth2/statestore');
  
  
  var store = new StateStore(s);
  return store;
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/state/Store'
];
