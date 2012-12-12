var utils   = require('../utilities') 
  , events  = require('events')

var pineapple = {};

pineapple.events = events;

pineapple.Base = utils.inherit(events.EventEmitter, function Base() {
  events.EventEmitter.call(this); // Bug

  this.hooks      = [];
  this._hookIndex = 0;
});

pineapple.Base.prototype.use = function(func) {
  if (typeof func === 'function') {
    this.hooks.push(func);
  }

  return this;
};

pineapple.Base.prototype.callHooks = function() {
  var hook, i

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

module.exports = pineapple;