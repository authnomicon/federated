exports = module.exports = function(initiateHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.get('/', initiateHandler);
  
  return router;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/federation/InitiationService';
exports['@require'] = [
  './initiate/initiate'
];
