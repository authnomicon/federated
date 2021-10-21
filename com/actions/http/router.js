exports = module.exports = function(C) {
  var actions = require('../../../lib/actions');
  
  
  var router = new actions.Router();
  
  return Promise.resolve(router)
    .then(function(router) {
      return new Promise(function(resolve, reject) {
        var components = C.components('http://i.authnomicon.org/federated/actions/http/Handler');
      
        (function iter(i) {
          var component = components[i];
          if (!component) {
            return resolve(router);
          }
        
          component.create()
            .then(function(handler) {
              logger.info('Loaded federated action handler: ' + component.a['@action']);
              router.use(component.a['@action'], handler);
              iter(i + 1);
            }, function(err) {
              // TODO: Print the package name in the error, so it can be found
              // TODO: Make the error have the stack of dependencies.
              if (err.code == 'IMPLEMENTATION_NOT_FOUND') {
                logger.notice(err.message + ' while loading component ' + component.id);
                return iter(i + 1);
              }
            
              reject(err);
            })
        })(0);
      });
    })
    .then(function(router) {

      // load built-in actions
      return C.create('./login')
        .then(function(handler) {
          // TODO: Only use it if login handler wasn't supplied as plugin by app above
          
          router.use('login', handler);
        }, function(err) {
          // TODO: error handling and rethrow if not IMPLEMENTATION_NOT_FOUND
        })
        .then(function(handler) {
          return router;
        });
    });
};

exports['@singleton'] = true;
exports['@require'] = [
  '!container',
];
