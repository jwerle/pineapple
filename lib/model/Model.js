var ModelError  = require('./ModelError').ModelError

/**
  @namespace model
**/
var model = {};

model.Model = function Model(name, schema, options) {
  var self = this

  if (! name) {
    throw new ModelError("A model needs a name.");
  }

  if (! schema || typeof schema !== 'object') {
    throw new ModelError("A model needs a valid schema object.");
  }

  this.name     = name;
  this.schema   = schema;
  this.options  = options || {};
  this.statics  = {
    getExposed : function(){
      return self.exposed;
    }
  };
  this.model    = null;
  this.exposed  = [];

  this.toExposed = function() {
    var exposed = {}, i, json = this.toJSON()
      , key, value

    if (this.exposed.length) {
      for (i = 0; i < this.exposed.length; i++) {
        key           = this.exposed[i];
        value         = pineapple.utils.valueFromPath(key, json);
        exposed[key]  = value;
      }

      return exposed;
    }
    else {
      return this.toJSON();
    }
  }
};

model.Model.prototype.create = function() {
  var func, Model, self = this

  this.schema = new mongoose.Schema(this.schema, this.options);

  this.schema.virtual('exposed').get(function(){
    return self.exposed;
  });

  for (func in this) {
    if (typeof this[func] === 'function' && this.hasOwnProperty(func) && !this.constructor.prototype[func]) {
      this.schema.methods[func] = this[func];
    }
  }

  for (func in this.statics) {
    if (typeof this.statics[func] === 'function') {
      this.schema.statics[func] = this.statics[func];
    }
  }

  this.model = Model = mongoose.model(this.name, this.schema);

  return Model;
};

model.Model.prototype.static = function(name, func) {
  if (typeof func === 'function') {
    this.statics[name] = func;
  }
  else {
    throw new ModelError(name + " is not a function.");
  }

  return this;
};

model.Model.prototype.expose = function(properties) {
  this.exposed = this.exposed.concat(properties);

  return this;
};

model.Model.prototype.validateWith = function(property, rules, errorMessage) {
  var validator, i

  errorMessage  = errorMessage || "Invalid " + property;

  if (! property || !this.schema.paths[property]) {
    throw new ModelError(".validate() requires a valid property to validate.")
  }

  if (typeof rules === 'object') {
    for (i = 0; i < rules.length; i++) {
      validator = pineapple.model.validators.get(rules[i])

      if (! validator) {
        throw new ModelError("Invalid validator ["+ rules[i] + "]");
      }

      try {
        this.schema.path(property).validate(validator, errorMessage);
      }
      catch (err) {
        throw new ModelError(err.message);
      }
    }
  }
  else if (typeof rules === 'string'){
    validator = pineapple.model.validators.get(rules)

    try {
      this.schema.path(property).validate(validator, errorMessage);
    }
    catch (err) {
      throw new ModelError(err.message);
    }
  }
  else {
    throw new ModelError(".validate() requires a valid rule array of string.");
  }

  return this;
};

module.exports = model;