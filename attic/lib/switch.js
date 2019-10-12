var utils = require('./utils');

// TODO: use zoning from bixby-sd???
function Switch() {
  this._services = [];
}

Switch.prototype.use = function(protocol, module) {
  if (typeof protocol != 'string') {
    module = protocol;
    protocol = undefined;
  }
  
  this._services.push({ module: module, protocol: protocol });
};

// TODO: pass domain/tenant here
Switch.prototype.resolve = function(issuer, cb) {
  var services = this._services;
  
  var self = this;
    
  (function iter(i) {
    var resolver = services[i]
      , error;
    if (!resolver) {
      // TODO: Better error code
      error = new Error('resolve ENOTFOUND ' + issuer);
      error.code = 'ENOTFOUND';
      return cb(error);
    }
    
    // // TODO: Check protocol match
    //if (!utils.withinZone(name, resolver.zone)) { return riter(j - 1); }
    
    resolver.module.resolve(issuer, function(err, records) {
      console.log('RESOLVED!');
      console.log(records);
      
      //if (err) { return riter(j - 1); }
      //return cb(null, records);
    });
  })(0);
};

module.exports = Switch;
