exports = module.exports = function(store) {
  
  // TODO: ensure that this state is being destroyed on this request
  
  function resume(req, res, next) {
    res.resumeState(next);
  }
  
  function redirect(req, res, next) {
    res.redirect('/');
  }
  
  
  return [
    require('flowstate')({ store: store }),
    resume,
    redirect
  ];
};

// Module annotations.
exports['@require'] = [
  'module:flowstate.Store'
];
