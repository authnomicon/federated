exports = module.exports = function(container) {
  return container.create('./createprovider/used');
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/sso/createProvider';
exports['@singleton'] = true;
exports['@require'] = [ '!container' ];
