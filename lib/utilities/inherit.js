var utils = require('utilities')

var inherit

inherit = function() {
  var i
    , args = [].splice.call(arguments, 0)
    , Heir
    , Inherited

  if (args.length > 2) {
    Heir = args.pop();

    for (i = 0; i < args.length; i++) {
      Heir = inherit(args[i], Heir);
    }
  }
  else {
    Inherited                  = args.shift();
    Heir                       = args.shift();
    Heir                       = utils.mixin(Heir, Inherited);
    Heir.prototype             = Inherited.prototype;
    Heir.prototype.constructor = Heir;

    Heir.super = Heir.prototype.super = function() {
      var args = [].splice.call(arguments, 0)
        , heir = args.shift();

        
      if (typeof heir === 'object') {
        Inherited.apply(heir, args);
      }
      else {
        return Inherited.call(this);
      }
    };
  }

  return Heir;
};

module.exports = inherit;