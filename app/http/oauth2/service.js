exports = module.exports = function(redirectHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.get('/', redirectHandler);
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/oauth2/redirect';
exports['@require'] = [ './handlers/redirect' ];
