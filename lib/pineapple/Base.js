var utils   = require('../utilities') 
  , events  = require('events')

var pineapple = {};

pineapple.events = events;

pineapple.Base = utils.inherit(events.EventEmitter, function Base() {
  events.EventEmitter.call(this); // Bug

  this.hooks = [];
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

module.exports = pineapple;