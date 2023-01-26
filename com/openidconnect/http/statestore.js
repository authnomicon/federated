exports = module.exports = function() {
  var StateStore = require('../../../lib/openidconnect/statestore');
  
  return new StateStore();
};

exports['@implements'] = 'module:passport-openidconnect.StateStore';
exports['@singleton'] = true;
exports['@require'] = [];
