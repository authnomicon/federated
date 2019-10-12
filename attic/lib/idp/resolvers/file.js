var EventEmitter = require('events');
var decisions = require('decisions');
var clone = require('clone');
var util = require('util');


function FileResolver(file) {
  EventEmitter.call(this);
  this.initializing = true;
  
  var settings = decisions.createSettings();
  settings.load(file);
  this._settings = settings.toObject();
  
  var self = this;
  process.nextTick(function() {
    self.initializing = false;
    self.emit('ready');
  });
}

util.inherits(FileResolver, EventEmitter);

FileResolver.prototype.resolve = function(identifier, options, cb) {
  if (typeof options == 'function') {
    cb = options;
    options = undefined;
  }
  
  var self = this;
  process.nextTick(function() {
    var providers = self._settings.provider || []
      , provider, i, len;
    for (i = 0, len = providers.length; i < len; ++i) {
      provider = providers[i];
      if (provider.identifier === identifier) { return cb(null, clone(provider)); }
    }
    return cb(new Error('Unknown identity provider: ' + identifier));
  });
};


module.exports = FileResolver;
