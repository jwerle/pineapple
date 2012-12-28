var ModelError  = require('./ModelError').ModelError

/**
  @namespace model
**/
var model = {};

model.Model = function Model(name, schema, options) {
  var self = this

  name    = name    || this.name    || this.constructor.name;
  schema  = schema  || this.schema  || {};
  options = options || this.options || {};

  if (! name) {
    throw new ModelError("A model needs a name.");
  }

  this.name           = name;
  this.schema         = schema;
  this.options        = options;
  this.excluded       = [];
  this.addedFields    = []
  this.model          = null;
  this.exposed        = [];

  // Work around for toExpose method calls
  if (this.options._id === false) {
    this.hide('_id');
  }

  this.toExposed = function(exposed, excluded) {
    var clean = {}, json = this.toJSON()
      , key, value, i

    exposed = exposed || this.exposed;

    if (exposed.length) {
      for (i = 0; i < exposed.length; i++) {
        key = exposed[i];

        if (typeof self.options === 'object') {
          if (self.options[key] === false) {
            continue;
          }
        }

        value = pineapple.utils.valueFromPath(key, json);

        if (value) {
          clean = pineapple.utils.setValueFromPath(key, value, json);
        }
      }

      excluded = (typeof excluded === 'object' && excluded.length ?
                  self.excluded.concat(excluded) :
                  self.excluded);

      for (i = 0; i < excluded.length; i++) {
        if (excluded[i] in clean) {
          delete clean[excluded[i]];
        }
      }

      return clean;
    }
    else {
      return this.toJSON();
    }
  }

  /**
    Default static methods for a Model
  **/
  this.statics  = {
    getExposed : function(){
      var exposed = self.exposed

      exposed.toString = function(regex) {
        regex = regex || ' ';
        
        return this.join(regex);
      }

      return exposed;
    },

    first : function(callback) {
      return this.findOne(function(err, user){
        if (typeof callback === 'function') {
          callback.call(this, err, user);
        }
      })
    }
  };
};

model.Model.prototype.field = function(definition) {
  if (typeof definition === 'object') {
    this.addedFields.push(definition);
  }

  return this;
};

model.Model.prototype.create = function() {
  var func, Model, self = this, i

  this.schema = new mongoose.Schema(this.schema, this.options);

  for (i = 0; i < this.addedFields.length; i++) {
    this.schema.add(this.addedFields[i]);
  }

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
  var args = pineapple.utils.makeArray(arguments)
    , func

  if (typeof func === 'function') {
    this.statics[name] = func;
  }
  else if (typeof name === 'function') {
    while (func = args.shift()) {
      if (typeof func === 'function') {
        if (func.name.length) {
          this.statics[func.name] = func;
        }
      }
    }
  }
  else if (typeof name === 'object') {
    for (func in name) {
      if (typeof name[func] === 'function') {
        this.statics[func] = name[func];
      }
    }
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

model.Model.prototype.hide = function(hidee, recursive) {
  this.excluded           = this.excluded.concat(hidee);
  this.excludedRecursive  = true;

  return this;
};

model.Model.prototype.inherits = function() {
  var models = pineapple.utils.makeArray(arguments)
    , model
    , Model
    , name
    
  for (model in models) {
    model = models[model];

    if (typeof model === 'function') {
      model = new model(pineapple.models);
    }
    else if (typeof model === 'string') {
      return this.inherits(pineapple.models.get(model, true));
    }
    
    if (typeof model === 'object') {
      name = this.name;
      pineapple.utils.object.merge(this, model)
      this.name = name;
    }
  }

  return this;
}

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