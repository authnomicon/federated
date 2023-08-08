// Module dependencies.
var express = require('express');

/**
 * Create federated authentication service.
 *
 * Returns an HTTP service that initiates authentication with a federated
 * identity provider (IdP).
 *
 * Authentication occurs via a protocol such as [OpenID Connect][1], in which
 * the user's web browser is redirected to the IdP.  After any interaction with
 * the user, the IdP then redirects the user back to the application, with an
 * assertion regarding the authentication that was performed.  This package
 * includes support for OpenID Connect, [OAuth 2.0][2], and [OAuth 1.0][3].
 * Support for other protocols, such as [SAML][4], can be obtained by installing
 * other packages.
 *
 * "Authentication" is a bit of a misnomer in this context, as authentication is
 * performed by the IdP, rather than the application.  In other words,
 * authentication is delegated to the IdP.  The application authenticates an
 * assertion issued by the IdP, and relies on the claims within to establish the
 * authentication context.
 *
 * It should be noted that this service is responsible only for initiating
 * authentication, by redirecting to the IdP.  The redirect from the IdP back to
 * the application will be handled by a protocol-specific service.
 *
 * By default, this service will be mounted under the path `/login/federated`.
 * This name was chosen for consistency with the terminology of [Credential
 * Management][5], in particular the [`FederatedCredential`][6] interface.
 * Note, however, that the association extends no further - any use of
 * Credential Management APIs in client-side JavaScript is not implied and
 * left to the application.
 *
 * [1]: https://openid.net/connect/
 * [2]: https://tools.ietf.org/html/rfc6749
 * [3]: https://oauth.net/1/
 * [4]: http://saml.xml.org/saml-specifications
 * [5]: https://www.w3.org/TR/credential-management-1/
 * [6]: https://www.w3.org/TR/credential-management-1/#federated
 *
 * @param {Function|Function[]} initiateHandler - Initiate handler.
 * @returns {Function}
 */
exports = module.exports = function(initiateHandler) {
  var router = express.Router();
  router.get('/', initiateHandler);
  
  return router;
};

// Module annotations.
exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/login/federated';
exports['@require'] = [
  './handlers/initiate'
];
