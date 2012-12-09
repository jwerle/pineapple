var path    = require('path')
  , model   = pineapple.model

Tests.console.puts("Creating PersonModel");

var PersonModel = new model.Model('Person', {
  name : {
    first : String,
    last  : String
  },

  age       : Number,
  location  : String
});

Tests.console.puts("Creating method sayName on PersonModel.");
PersonModel.sayName = function(){
  return ["My name is", this.name.first, this.name.last].join(' ');
};

Tests.console.puts("Creating static method whoAmI().");
PersonModel.static('whoAmI', function(){
  return "I am a static method and belong to the PersonModel Schema.";
});

Tests.console.puts("Creating Person model from PersonModel.");
var Person  = PersonModel.create();

Tests.console.puts("Calling static method whoAmI on PersonModel.");
Tests.console.trace( Person.whoAmI() );

Tests.console.puts("Instantiating Person model.")
var joe = new Person({name : { first : 'Joseph', last: 'Werle'}});

Tests.console.puts("Calling sayName() on model joe instance of model Person schama of PersonModel");
Tests.console.trace( joe.sayName() );

Tests.success();