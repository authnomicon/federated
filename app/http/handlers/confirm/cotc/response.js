// TODO: Maybe rename "associate".
// Is there an XHR way that accomplishes same as iframes?
// no because CORS headers are easily faked?
// or yes because this iframe is needed when the password is posted back to the host domain
// XHR is needed to pass password to AS

exports = module.exports = function(initialize, parse, csrfProtection, completeActivity, failActivity, Tokens, directory) {
  var path = require('path');
  
  
  function obtainVerifier(req, res, next) {
    res.locals.verifier = req.body.verifier;
    next();
  }
  
  function respond(req, res) {
    // TODO: Default behavior for when this didn't have a parent state (shouldn't happen...)
    
    res.send('TODO')
  }
  
  
  return [
    initialize(),
    parse('application/x-www-form-urlencoded'),
    csrfProtection(),
    obtainVerifier,
    completeActivity('co/challenge/pkco'),
    failActivity('co/challenge/pkco'),
    respond
  ];
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/initialize',
  'http://i.bixbyjs.org/http/middleware/parse',
  'http://i.bixbyjs.org/http/middleware/csrfProtection',
  'http://i.bixbyjs.org/http/middleware/completeTask',
  'http://i.bixbyjs.org/http/middleware/failTask',
  'http://i.bixbyjs.org/tokens',
  'http://i.bixbyjs.org/ds/Directory'
];
