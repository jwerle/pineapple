var fs = require('fs')

var view = {};

view.ViewError = pineapple.utils.inherit(Error, function ViewError(message){
  this.name    = "ViewError";
  this.message = message;
});

view.PATH = pineapple.ABSOLUTE_PATH + '/app/views';

view.View = pineapple.utils.inherit(pineapple.Base, function View(name, type, path) {
  this.super(this);

  this.name = name;
  this.type = type;
  this.path = [(path || view.PATH), '/', name, '.', type].join('');
  this.blob = null;

  if (typeof pineapple.view.parsers[type] === 'object') {
    this.parser = pineapple.view.parsers[type]
  }
  else {
    throw new view.ViewError("Invalid view type. No parser module found.");
  }
});

view.View.prototype.render = function(callback) {
  var buffer = this.loadBuffer()

  if (typeof this.parser.render === 'function') {
    this.parser.render  (buffer, callback);
  }

  return this;
};

view.View.prototype.loadBuffer = function() {
  var buffer
  
  buffer = fs.readFileSync(this.path);

  return buffer;
};

view.View.prototype.configure = function(callback) {
  var self = this
  callback = callback || function(){}
  
  if (typeof callback === 'function') {
    if (typeof this.parser.configure === 'function') {
      this.parser.configure(this, function(){
        self.next.apply(self, arguments)
        callback.apply(self, arguments)
      });
    }
  }

  return this;
};

module.exports = view;