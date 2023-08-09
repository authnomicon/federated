/**
 * Create login action handler.
 *
 * Returns an HTTP handler that logs in a federated user.
 *
 * This handler is invoked when handling a redirect back from a federated
 * identity provider (IdP), which typically implements a standard protocol such
 * as [OpenID Connect][1] or [SAML][2].
 *
 * This handler operates in one of two modes:
 *   1. Just-in-time (JIT) provisioning
 *   2. Local authentication
 *
 * During JIT provisioning, when the federated user is not previously known, a
 * user account will be automatically created in the directory.  The federated
 * identifier will then be associated with the newly created account.  When the
 * user subsequently returns to the application, they will be logged into their
 * account.  JIT provisioning mode is enabled when the application has access to
 * the directory and federated identifier store.
 *
 * Local authentication mode is useful when applications are restricted from
 * accessing their own domain's directory.  In this scenario, directory access
 * is centralized behind an authentication server (AS) (also referred to as an
 * IdP).  Applications then delegate authentication to the AS.  Typically, the
 * AS will implement a protocol such as OpenID Connect or SAML, which is capable
 * of federating across domains.  In this case, however, authentication is
 * occuring within a single domain.
 *
 * During local authentication, the user is directly logged in based on their
 * federated identifier.  Due to the fact that that authentication is occuring
 * within the domain, this identifer is assumed to be equivalent to the local
 * identifier.  Due to that, no intermediate mapping layer is needed to
 * translate an external identifier to a local identifier.  Local authentication
 * mode is enabled when the application does not have access to the directory or
 * federated identifier store.
 *
 * [1]: https://openid.net/connect/
 * [2]: http://saml.xml.org/saml-specifications
 *
 * @returns {Function[]}
 */
exports = module.exports = function(idStore, directory) {
  
  // https://www.ietf.org/archive/id/draft-ietf-secevent-subject-identifiers-14.html#name-issuer-and-subject-identifi
  
  function exec(req, res, next) {
    if (!directory || !idStore) {
      // TODO: Ensure that the provider is trusted for local login.
      
      // Authentication was delegated to an authentication server that is
      // authoritative over the application's domain.  In this case, the user
      // information is not coming from an external system so there is no need
      // to map identifiers or provision accounts.
      //
      // This situation is typical when direct access to the directory has been
      // restricted from the application and limited to an authentication
      // server, where access to personally identifiable information (PII) can
      // be centrally managed and audited.
      req.login(req.federatedUser, function(err) {
        if (err) { return next(err); }
        return next();
      });
    } else {
      idStore.find(req.federatedUser, req.state.provider, function(err, user) {
        if (err) { return next(err); }
      
        if (!user) {
          // JIT the user
          directory.create(req.federatedUser, function(err, user) {
            if (err) { return next(err); }
          
            idStore.add(req.federatedUser, req.state.provider, user, function(err) {
              if (err) { return next(err); }
            
              req.login(user, function(err) {
                if (err) { return next(err); }
                return next();
              });
            });
          });
        } else {
          // Load the user, already JIT'ed
          directory.read(user.id, function(err, user) {
            if (err) { return next(err); }
            // TODO: Handle undefined user
          
            req.login(user, function(err) {
              if (err) { return next(err); }
              return next();
            });
          });
        }
      });
    }
  }
  
  
  return [
    exec
  ];
};

exports['@require'] = [
  'module:@authnomicon/federated.IDStore?',
  'module:@authnomicon/core.Directory?'
];
