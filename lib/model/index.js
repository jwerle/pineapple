module.exports = pineapple.loader.load(__dirname).model;
module.exports.get = function(name, prevent_creation) {
  var Model, model

  Model = pineapple.utils.valueFromPath(name, pineapple.models);

  
  if (! Model) {
    return false;
  }

  model = new Model(pineapple.models);

  console.log(model)

  return prevent_creation? model : model.create();
};

module.exports.define = function(Model){
  var name = Model.name

  if (!name) {
    throw new Error("A model needs a name for pineapple.model.define()");
  }

  return pineapple.models[name] = pineapple.utils.inherit(pineapple.model.Model, Model);
};