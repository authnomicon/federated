/**
 * OAuth 2.0 redirection service.
 *
 * This component provides an HTTP service that implements the OAuth 2.0
 * [redirection endpoint][1].
 *
 * When this endpoint is requested, the application is acting as an OAuth 2.0
 * client.  The application will have previously made an authorization request
 * to an authorization server (AS).  Once the AS has completed any interaction
 * with the user, the user's web browser will be redirected to this endpoint
 * with an authorization response.  This endpoint will process the response.
 *
 * The authorization request will typically be made using the federated
 * authentication service included in this package (see
 * `federated/http/service`).  In this situation, the authorization response
 * will be used as a form of delegated user authentication.
 *
 * [1]: https://tools.ietf.org/html/rfc6749#section-3.1.2
 *
 * @param {Function|Function[]} redirectHandler - Redirect handler.
 * @returns {Function}
 */
exports = module.exports = function(redirectHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.get('/', redirectHandler);
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/oauth2/redirect';
exports['@require'] = [ './handlers/redirect' ];
