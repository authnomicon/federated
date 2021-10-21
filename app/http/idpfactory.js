exports = module.exports = function(IoC) {
  
  
  return IoC.create('http://i.authnomicon.org/federated/http/IDProviderFactory')
    .catch(function(err) {
      
      return {
        create: function(provider) {
          var mods = IoC.components('http://i.authnomicon.org/federated/http/IDProvider')
            , mod, i, len;
          for (i = 0, len = mods.length; i < len; ++i) {
            mod = mods[i];
            if (mod.a['@provider'] == provider) {
              return mod.create();
            }
          }
          
          return Promise.reject(new Error('Unsupported identity provider: ' + provider));
        }
      };
    });
};

exports['@singleton'] = true;
exports['@require'] = [
  '!container',
];
