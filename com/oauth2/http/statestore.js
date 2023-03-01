var StateStore = require('../../../lib/oauth2/statestore');

exports = module.exports = function() {
  return new StateStore();
};

exports['@singleton'] = true;
exports['@implements'] = 'module:passport-oauth2.StateStore';
