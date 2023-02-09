var StateStore = require('../../../lib/openidconnect/statestore');

exports = module.exports = function() {
  return new StateStore();
};

exports['@implements'] = 'module:passport-openidconnect.StateStore';
exports['@singleton'] = true;
