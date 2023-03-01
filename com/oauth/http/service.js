// Module dependencies.
var express = require('express');

exports = module.exports = function(callbackHandler) {
  var router = express.Router();
  router.get('/:slug', callbackHandler);
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/oauth/callback';
exports['@require'] = [ './handlers/callback' ];
