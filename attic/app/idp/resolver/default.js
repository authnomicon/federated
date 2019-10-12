exports = module.exports = function() {
  
  
  var registry = {
    'https://accounts.google.com': { protocol: 'oauth2' }
  }
  
  // module: 'passport-google-oauth20', 
  
  return function createDefault(issuer) {
    console.log('CREATE FOR ISSUER< FORCE GOOGLE FOR DEV');
    console.log(issuer);
    
    var meta = registry[issuer];
    console.log(meta);
    
    if (!issuer) { throw new Error('Unsupported IdP: ' + issuer); }
    
    //var Strategy = require(meta.module);
    //console.log(Strategy);
    
  }
};

exports['@require'] = [];
