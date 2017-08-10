exports = module.exports = function(IoC) {
  // TODO: Introspect the container for someething implementing interface, and return
  //       if possible, otherwise fallback to internals.
  
  return IoC.create('./internals/createprovider');
};

exports['@singleton'] = true;
exports['@require'] = [ '!container' ];
