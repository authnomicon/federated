exports = module.exports = function(callbackHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.get('/:host?', callbackHandler);
  
  return router;
};

exports['@implements'] = [
  'http://i.bixbyjs.org/http/Service',
  'http://schemas.authnomicon.org/js/http/oauth/CallbackService'
];
exports['@path'] = '/oauth/callback';
exports['@require'] = [ './handlers/callback' ];
