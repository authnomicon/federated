// TODO: Maybe rename "associate".
// Is there an XHR way that accomplishes same as iframes?
// no because CORS headers are easily faked?
// or yes because this iframe is needed when the password is posted back to the host domain
// XHR is needed to pass password to AS

exports = module.exports = function(csrfProtection) {
  var path = require('path')
    , ejs = require('ejs');
  
  
    // TODO: Validate request: state
    //if (!req.query.id_token_hint) { return next(new SkipSessionInitiationError()); }
  
  function respond(req, res, next) {
    res.locals.targetOrigin = 'http://localhost:3001';
    res.locals.id = req.query.id;
    res.locals.state = req.query.state;
    res.locals.csrfToken = req.csrfToken();
    
    var filename = path.join(__dirname, '../../../../../www/confirm/cotc/iframe.html.ejs');
    ejs.renderFile(filename, res.locals, function(err, html) {
      if (err) { return next(err); }
      return res.send(html);
    });
  }
  
  
  return [
    csrfProtection(),
    respond
  ];
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/csrfProtection'
];
