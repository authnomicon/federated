exports = module.exports = function(redirectHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.get('/cb', redirectHandler);
  
  return router;
};

exports['@implements'] = [
  'http://i.bixbyjs.org/http/Service',
  'http://schemas.authnomicon.org/js/http/oauth2/RedirectionService'
];
exports['@path'] = '/oauth2';
exports['@require'] = [ './handlers/redirect' ];
