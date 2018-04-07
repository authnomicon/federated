exports = module.exports = function(initiateHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.post('/', initiateHandler);
  
  return router;
};

exports['@implements'] = [
  'http://i.bixbyjs.org/http/Service',
  'http://schemas.authnomicon.org/js/http/login/IdentifierFirstService'
];
exports['@path'] = '/login';
exports['@require'] = [
  './handlers/initiate'
];
