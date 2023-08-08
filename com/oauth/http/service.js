// Module dependencies.
var express = require('express');

/**
 * Create OAuth 1.0 callback service.
 *
 * Returns an HTTP service that implements the OAuth 1.0 [callback URL][1].
 *
 * When this endpoint is requested, the application is acting as an OAuth 1.0
 * consumer.  The application will have previously made an authorization request
 * to a service provider (SP).  Once the SP has authenticated the user and
 * obtained consent, the user's web browser will be redirected to this endpoint.
 *
 * The authorization request will typically be initiated using the federated
 * authentication service included in this package.  In that case, the
 * authorization process will be used as a form of delegated user
 * authentication.
 *
 * [1]: https://oauth.net/core/1.0a/#rfc.section.6.2.3
 */
exports = module.exports = function(callbackHandler) {
  var router = express.Router();
  router.get('/:slug?', callbackHandler);
  
  return router;
};

// Module annotations.
exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/oauth/callback';
exports['@require'] = [ './handlers/callback' ];
