var path      = require('path')
  , inherit   = require(PINEAPPLE_PATH + '/lib/utilities/inherit')

var Person
  , Joseph
  , Dominic
  , joe
  , dom

Tests.console.puts("Creating Person prototype.");

Person = function Person(name){
  this.name = name || "Anonymous";
};

Person.prototype.sayName = function(){
  Tests.console.trace(this.name + ' says: "My name is ' + this.name + '."');

  return this;
};

Tests.console.puts("Creating Joseph prototype inheriting from Person.");
Joseph = inherit(Person, function Joseph(){
  this.super(this, 'Joseph');
});

Joseph.prototype.dance = function(){
  return "This is me " + this.name + " Dancing!";
};

Tests.console.puts("Creating Dominic prototype inheriting from Person.");
Dominic = inherit(Person, function Dominic(){
  this.super(this, 'Dominic');
});

Dominic.prototype.run = function(){
  return "This is me " + this.name + " Running!";
};

Tests.console.puts("Instantiating Joseph prototype");
joe = new Joseph();

Tests.console.puts("Testing property name on joe instance of Joseph inherited from Person.");
if (! joe.name) {
  throw new Error("Object joe instance of Joseph missing property name.");
}

Tests.console.puts("Instantiating Dominic prototype");
dom = new Dominic();

Tests.console.puts("Testing property name on dom instance of Joseph inherited from Person.");
if (! dom.name) {
  throw new Error("Object dom instance of Joseph missing property name.");
}

Tests.console.puts("Executing sayName() on joe.");
joe.sayName();

Tests.console.puts("Executing sayName() on dom.");
dom.sayName();

Tests.console.puts("Executing dance() on joe.");
Tests.console.trace(joe.dance());

Tests.console.puts("Executing run() on dom.");
Tests.console.trace(dom.run());

Tests.success();