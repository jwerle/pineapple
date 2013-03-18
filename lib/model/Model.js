// deps
var ModelError  = require('./ModelError').ModelError


/**
  * @namespace model
  */
var model = {};


/**
  * Creates a new instance of a Model
  *
  * @constructor Model
  *
  * @param {String} name - A model name
  * @param {Object} schema - A Mongoose schema
  * @param {Object} options - An object of options to pass to the Schema constructor
  */
model.Model = function Model(name, schema, options) {
  var self = this

  name    = name    || this.name    || this.constructor.name;
  schema  = schema  || this.schema  || {};
  options = options || this.options || {};
  // if no name is provided throw an error
  if (! name) throw new ModelError("A model needs a name.");

  this.name      = name;
  this.schema    = new mongoose.Schema(schema, options);
  this.options   = options;
  this.fields    = {};
  this.model     = null;
  this.ns        = false;
};


// Map the schema methods to the Model prototype
// These are meant to alias methods to the schema object only
['add', 'pre', 'post', 'set', 'get', 'virtual'].map(function(method){
  model.Model.prototype[method] = function() {
    this.schema[method].apply(this.schema, arguments);
    return this;
  };
});


/**
  * Calls the super class if defined and apply overrides
  * if available
  *
  * @public
  * @function Model#define
  * @param {Object} overrides - An optional object to apply overrides to the super class
  * @return {Object} - A reference to this
  */
model.Model.prototype.define = function(overrides) {
  // if the super function was defined call the super class
  if (this.super instanceof Function) this.super(pineapple.utils.object.merge(this, overrides || {}));
  // lets also extend some properties defined by default
  pineapple.utils.object.merge(this, overrides || {});
  // maintain chaining
  return this;
};


/**
  * Sets the schema strict option
  *
  * @public
  * @function Model#strict
  * @param {Boolean} strict - The value of the strict option for the model schema
  * @return {Object} - A reference to this
  */
model.Model.prototype.strict = function(value) {
  return this.opt('strict', value || false);
};


/**
  * Sets a schema option
  *
  * @public
  * @function Model#opt
  * @param {String} opt - The name of the option to set
  * @return {Mixed} - The value of the option being set
  * @return {Object} - A reference to this
  */
model.Model.prototype.opt = function(opt, value) {
  this.options = (this.options instanceof Object)? this.options : {}; // initialize just in case it isn't set up
  this.options[opt] = value;
  return this;
};


/**
  * Defines a field for the model schema
  *
  * @public
  * @function Model#field
  * @param {Object} definition - An object containing one or more field schemas
  * @return {Object} - A reference to this
  */
model.Model.prototype.field = function(definition) {
  // perform a fresh copy deep merge on the fields for already existing properties
  this.fields = pineapple.utils.object.merge(pineapple.utils.object.merge({}, typeof this.fields !== 'object'? {} : this.fields), definition);
  // maintain chaining
  return this;
};


/**
  * Creates a new method for the instance of the model
  * registered with Mongoose
  *
  * @public
  * @function Model#method
  * @alias Model#public
  * @param {Function} func - A function with a valid name
  * @return {Object} - A reference to this
  */
model.Model.prototype.method = model.Model.prototype.public = function(func) {
  // make sure the function isn't anonymous
  (!func.name) && !function(){ throw new Error("Model#method needs a function with a name."); }();
  // add it to the schema methods
  this.schema.methods[func.name] = func;
  // maintain chaining
  return this
};


/**
  * Defines an embedded document
  *
  * @public
  * @function Model#embeds
  * @param {Object} definition - An object containing one or more field schemas for an embedded document
  * @return {Object} - A reference to this
  */
model.Model.prototype.embeds = function(definition) {
  var Super = model.Model, Model, m, field, tree
  // enumerate over each field
  for (field in definition) {
    // If the field data type is not a function, continue on with the loop
    if (typeof definition[field] !== 'function') continue;
    // Inherit the base Model
    Model = pineapple.utils.inherit(Super, definition[field]);
    // instantiate the model
    m = new Model(pineapple.models);
    // create the model, but prevent it from being registered with Mongoose
    tree = m.create(false).schema.tree;
    // we do not want this showing up,
    // so we need to delete the id property
    delete tree.id;
    // reset back to the definition object
    definition[field] = tree;
  }
  // define the field with the Model#field method
  return this.field(definition);
};


/**
  * Defines an array of for multiple embedded documents
  *
  * @public
  * @function Model#embedsMany
  * @param {Object} definition - An object containing one or more field schemas for an embedded document
  * @return {Object} - A reference to this
  */
model.Model.prototype.embedsMany = function(definition) {
  var Model, m, field, Super = model.Model
  // enumerate over each field
  for (field in definition) {
    // If the field data type is not a function, continue on with the loop
    if (typeof definition[field] === 'function') {
      // Inherit the base Model
      Model = pineapple.utils.inherit(Super, definition[field]);
      // instantiate the model
      m = new Model(pineapple.models);
      // reset as an embedded document in an array for Mongoose
      definition[field] = [m.create().schema];
    }
    else if (typeof definition[field] === 'object' 
          && typeof definition[field].type === 'function') {
      // Inherit the base Model
      Model = pineapple.utils.inherit(Super, definition[field].type);
      // instantiate the model
      m = new Model(pineapple.models);
      // reset as an embedded document in an array for Mongoose
      definition[field].type = [m.create().schema]
    }
  }
  // define the field with the Model#field method
  return this.field(definition);
};


// default static methods
model.Model.prototype.statics = {
  first : function(callback) { return this.findOne(callback); }
};

/**
  * Creates and registers all fields with the schema, also registers with Mongoose
  * unless the 'preventModel' flag is set to 'true'
  *
  * @public
  * @function Model#create
  * @param {Boolean} preventModel - A Boolean to determine whether to prevent model registration with Mongoose
  * @return {Object} - A reference to this
  */
model.Model.prototype.create = function(preventModel) {
  var func, Model = null, self = this, i, field, name
  // attach a namespace to the name of the model if provided
  name = this.ns && this.ns.length? this.ns + '.' + this.name : this.name;
  // find fixed properties and set the setter func
  for (field in this.fields) {
    if (typeof this.fields[field] === 'object') {
      if (this.fields[field].fixed === true) {
        (function(field){
          this.fields[field].set = function(value){ 
            return (!this[field])? value : this[field];
          };
        }).call(this, field);
      }
    }
  }
  // add all the fields to the schema
  this.schema.add(this.fields);
  // enumerate over all static methods define
  for (func in this.statics) {
    // make sure all properties attached to the static object
    // are actually functions, else continue with the loop
    if (typeof this.statics[func] !== 'function') continue;
    // attach the function to the schema static functions  
    this.schema.statics[func] = this.statics[func];
  }

  // if we are not trying to prevent the model from
  // being register with Mongoose then do it now
  if (preventModel !== true) 
    this.model = Model = mongoose.model(name, this.schema);
  // return the newly registered Model or null if it was prevented
  return Model;
};


/**
  * Creates a static method for the Mongoose model instance
  *
  * @public
  * @function Model#static
  * @note If a function is only given, a name must be provided for the defined closure
  * @param {Mixed} name - A name of a given function or a function
  * @param {Function} func - A given function who's name is provided by the name argument
  * @return {Object} - A reference to this
  */
model.Model.prototype.static = function(name, func) {
  // capture the arguments into a valid array
  var args = pineapple.utils.makeArray(arguments)
  // merge in prototyped statics object and create a new one
  // bound to the instance
  this.statics = pineapple.utils.object.clone(this.statics);
  // if name is provided and function is provided
  // then define it directly
  if (typeof name === 'string' && typeof func === 'function') {
    // assign it to the statics object
    this.statics[name] = func;
    // maintain chaining
    return this;
  }
  // if a function is used in the place of the name
  // argument then assume an array of functions and
  // iterate over each and call Model#static on each
  if (typeof name === 'function') {
    while (func = args.shift()) {
      // if the current argument is not a function continue the loop
      if (typeof func !== 'function') continue;
      // if the function is anonymous omit and continue the loop
      if (!func.name.length) continue;
      // define the static method
      this.static(func.name, func);
    }
    // maintain chaining
    return this;
  }
  // if an object is used in the place of the name
  // argument then assume it is a map of functions
  if (typeof name === 'object') {
    // enumerate over each
    for (func in name) {
      // if the current is not a function, omit and continue
      if (typeof name[func] !== 'function') continue;
      // define with the Model#static method
      this.static(func, name[func]);
    }
    // maintain chaining
    return this;
  }
  
  // If we ended up here, that is bad and throw an Error
  throw new ModelError(name + " is not a function.");
};


/**
  * Makes current instance inherit a given model
  *
  * @public
  * @function Model#inherits
  * @param {Mixed} [, model] - Any number of models that the current instance should inherit. Accepts
  *   a valid string path that is compatible with pineapple.model.get() or an instance of Model
  * @return {Object} - A reference to this
  */
model.Model.prototype.inherits = function() {
  var model, Model, name, models
  // capture arguments into an array and store
  // in the models variable
  models = pineapple.utils.makeArray(arguments);
  for (model in models) {
    // cache the model in a variable
    model = models[model];
    // if the model is a function, instantiate it
    if (typeof model === 'function') {
      model = new model(pineapple.models);
    }
    // if the model is a string, grab it with pineapple.model.get()
    if (typeof model === 'string') {
      model = pineapple.model.get(model, true);
      // make the current instance inherit the model
      this.inherits(model);
      // continue with the loop
      continue;
    }
    // if the model provided is not an object, continue with the loop
    if (typeof model !== 'object') continue;
    // directly set these properties for controlled inheritance
    this.schema   = pineapple.utils.object.merge(this.schema, model.schema);
    this.options  = pineapple.utils.object.merge(this.options, model.options);
    this.fields   = pineapple.utils.object.merge(model.fields || {});
    this.statics  = pineapple.utils.object.merge(this.statics, model.statics);
  }
  // maintain chaining
  return this;
};


// exports namespace
module.exports = model;