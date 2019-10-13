exports = module.exports = function() {
  
  function transition(req, res, next) {
    console.log('YEILD OAUTH2 TO LOGIN');
    return next();
  }
  
  function errorHandler(err, req, res, next) {
    console.log('YEILD ERROR OAUTH2 TO LOGIN');
    return next(err);
  }
  
  
  return [
    transition,
    errorHandler
  ];
  
};

exports['@implements'] = 'http://i.bixbyjs.org/http/ceremony/Yield';
exports['@result'] = 'oauth2/redirect';
exports['@state'] = 'login';
exports['@require'] = [];
