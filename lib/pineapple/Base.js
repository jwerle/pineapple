var utils   = require('../utilities') 
  , events  = require('events')

var pineapple = {};

pineapple.events = events;

pineapple.Base = function Base() {
  events.EventEmitter.call(this); // Bug

  this.hooks      = [];
  this._hookIndex = 0;
};

pineapple.Base.prototype = new events.EventEmitter();
pineapple.Base.prototype.constructor = pineapple.Base;
pineapple.Base.prototype.use = function(func) {
  this.hooks = (Array.isArray(this.hooks))? this.hooks : [];
  this._hookIndex = this._hookIndex || 0;
  if (typeof func === 'function') {
    this.hooks.push(func);
  }

  return this;
};

pineapple.Base.prototype.callHooks = function() {
  var hook, i
  this.hooks = (Array.isArray(this.hooks))? this.hooks : [];
  this._hookIndex = this._hookIndex || 0;
  for (i = 0; i < this.hooks.length; i++) {
    hook = this.hooks[i];

    if (typeof hook === 'function') {
      hook.apply(this, arguments);
    }
  }

  return this;
};

pineapple.Base.prototype.next = function() {
  var next, self, args
  this.hooks = (Array.isArray(this.hooks))? this.hooks : [];
  this._hookIndex = this._hookIndex || 0;
  args = arguments;
  self = this;
  next = function() {
    var a = [].concat(args).concat(next);

    if (self._hookIndex < self.hooks.length) {
      self.hooks[self._hookIndex++].apply(self, a)
    }
  }

  next();

  return this;
};

pineapple.Base.Error = utils.inherit(Error, function BaseError(message){
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name     = 'BaseError';
  this.message  = message || null;

  this.toString = function() {
    return Error.prototype.toString.call(this)
  }
});

pineapple.Base.Error.prototype = Error.prototype;
pineapple.Base.Error.prototype.constructor = pineapple.Base.Error;

module.exports = pineapple;