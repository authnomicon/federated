exports = module.exports = function(callbackHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.get('/:hostname', callbackHandler);
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/oauth/callback';
exports['@require'] = [ './handlers/callback' ];
