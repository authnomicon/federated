exports = module.exports = function(initiateHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.get('/', initiateHandler);
  
  return router;
};

exports['@implements'] = [
  'http://i.bixbyjs.org/http/Service',
  'http://schemas.authnomicon.org/js/http/sso/InitiationService'
];
exports['@path'] = '/federate';
exports['@require'] = [ './initiate' ];
