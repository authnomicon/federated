// Module dependencies.
var express = require('express');

exports = module.exports = function(redirectHandler) {
  var router = express.Router();
  router.get('/', redirectHandler);
  
  return router;
};

// Module annotations.
exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/openidconnect/logout/redirect';
exports['@require'] = [ './handlers/redirect' ];
