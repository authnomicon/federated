var dispatch = require('../dispatch');

function Router() {
  this._actions = {};
}

Router.prototype.use = function(name, handler) {
  // TODO: array-flatten handler argument
  this._actions[name] = handler;
}

Router.prototype.dispatch = function(name, err, req, res, next) {
  var stack = this._actions[name];
  if (!stack) { return next(new Error('Unknown action: ' + name)); }
  
  dispatch(stack)(err, req, res, next);
}


module.exports = Router;
