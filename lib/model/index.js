module.exports = pineapple.loader.load(__dirname).model;
module.exports.get = function(name, prevent_creation) {
  var ns, model
    , Model = pineapple.utils.valueFromPath(name, pineapple.models)

  if (! Model) throw new Error("Model " + name + " is not defined");

  if (name.split('.').length > 1 && (ns = name.substr(0, name.lastIndexOf('.')))) 
    name.ns = ns;

  model = new Model(pineapple.models);
  return prevent_creation? model : model.create();
};
module.exports.getSchema = function(name) {
  return this.get(name).schema;
}

module.exports.define = function(Model){
  var name = Model.name
  if (!name) throw new Error("A model needs a name for pineapple.model.define()");
  return pineapple.utils.inherit(pineapple.model.Model, Model);
};