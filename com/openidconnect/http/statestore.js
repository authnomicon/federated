var StateStore = require('../../../lib/openidconnect/statestore');

exports = module.exports = function() {
  return new StateStore();
};

exports['@singleton'] = true;
exports['@implements'] = 'module:passport-openidconnect.StateStore';
