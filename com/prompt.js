var url = require('url');

exports = module.exports = function() {
  
  return function(req, res, next) {
    var q = {};
    if (res.locals.provider) { q.provider = res.locals.provider; }
    if (res.locals.loginHint) { q.login_hint = res.locals.loginHint; }
    
    return res.redirect(url.format({
      pathname: '/login/federated',
      query: q
    }));
  };
};

exports['@implements'] = 'module:@authnomicon/prompts.RequestHandler';
exports['@name'] = 'federated';
