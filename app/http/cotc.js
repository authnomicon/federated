exports = module.exports = function(challengeHandler, responseHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.get('/', challengeHandler);
  router.post('/', responseHandler);
  
  return router;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/federate/http/COTCService';
exports['@require'] = [
  './handlers/confirm/cotc/challenge',
  './handlers/confirm/cotc/response'
];
