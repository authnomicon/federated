var defer = typeof setImmediate === 'function'
  ? setImmediate
  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)); };

/**
 * Create federated session termination handler.
 *
 * Returns a handler that sends a logout request to the application's identity
 * provider.
 *
 * The implementation of this handler assumes that the application is delegating
 * authentication to a single, centralized identity provider (IDP).  The IDP
 * itself is responsible for verifying credentials and may be facilitating
 * single sign-on (SSO) to a suite of related applications.  As such, the
 * authentication context must consist of a single, federated authentication
 * method.  If this assumption holds, a logout request will be sent to the IDP.
 *
 * If the assumption does not hold, the handler will pass request processing to
 * the subsequent handler in the chain.  The subsquent handler will, presumably,
 * terminate the application's login session but leave the session at the IDP
 * unterminated (as well as, by association, any sessions at related
 * applications established via SSO).
 *
 * An application can override this component with its own implementation if
 * different behavior is desired.
 *
 * Note that this handler is not mounted by a service within this package.
 * Instead, it is expected to be mounted to by a service in an external package
 * (for example, `@authnomicon/logout`).  This allows federated session
 * management functionality to be implemented separately from local session
 * management, while still terminating a complete logical session using a single
 * endpoint.
 */
exports = module.exports = function(sloFactory) {
  
  function federate(req, res, next) {
    var methods = (req.authInfo && req.authInfo.methods) || [];
    if (methods.length !== 1) { return next(); }
    var method = methods[0];
    if (method.type !== 'federated') { return next(); }
    
    sloFactory.create(method.provider, method.protocol)
      .then(function(provider) {
        process.nextTick(function() {
          provider.logout(method, res, next);
        });
      }, function(err) {
        defer(next, err);
      });
  }


  return [
    federate
  ];
};

// Module annotations.
exports['@implements'] = 'module:@authnomicon/federated.SessionTerminationHandler';
exports['@require'] = [];
exports['@require'] = [
  'module:@authnomicon/federated.SLOProviderFactory',
];
