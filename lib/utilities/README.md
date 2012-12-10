pineapple(1)
===========

Utilities
---------
```js
/**
 *  Pineapple utilitiy object
 * 
 * @public
 * @object
 * */
pineapple.utils = {};

```
  - [pineapple.utils.loader.Loader](#loader)
  - [pineapple.utils.inherit](#inherit)
  - [pineapple.utils.noop](#noop)
  - [pineapple.utils.returnMe](#returnme)
  - [pineapple.utils.makeArray](#makearray)
  - [pineapple.utils.valueFromPath](#valuefrompath)
  - [pineapple.utils.parseStringVariables](#parsestringvariables)
  

_____
## [Loader](https://github.com/moovatom/pineapple/blob/master/lib/utilities/Loader.js#L17) 
##### ```function(directory, extensions, excluded)```
Loader Prototype.
  - ```directory``` {String} The directory to load
  - ```extensions``` {Array} The extensions to match when parsing a directory. **Default** is ```.js```
  - ```excluded``` {Array} Excluded directory or file names **Default** is ```index```

#### API
### *static* Loader.load ```function(directory, extensions, excluded)```
See **Loader#load**

Go to the [code](https://github.com/moovatom/pineapple/blob/master/lib/utilities/Loader.js#L23)

##### Example
-----
```js
var lib = pineapple.loader.Loader.load('../lib', ['.js'], ['index']).lib;
```

_____

### Loader#load 
##### ```function(directory, extensions, excluded)```
Recursively requires a directory tree in an object.
####### Arguments
  - ```directory``` {String} The directory to load
  - ```extensions``` {Array} The extensions to match when parsing a directory. **Default** is ```.js```
  - ```excluded``` {Array} Excluded directory or file names

Go to the [code](https://github.com/moovatom/pineapple/blob/master/lib/utilities/Loader.js#L27)

##### Example
-----
```js
/**
  * Current file app/plugins/index.js
  * Current file app/plugins/OpenGraph.js
  * Current file app/plugins/Redis.js
  * Current file app/plugins/TwitterLib.js
  *
  * Current file is index.js
  *
  **/

var loader = new pineapple.loader.Loader(__dirname) // Default extensions are .js and default exclusion is index

var plugins = loader.load().plugins;
console.log(plugins)
/** 
  * >>> {
  *       OpenGraph : {
  *         connect : [Function]
  *       },
  *
  *       Reddis : [Function],
  *
  *       TwitterLib : [Object]
  *     }
  *
  **/

```
[Top](#pineapple1)
_____

## [inherit](https://github.com/moovatom/pineapple/blob/master/lib/utilities/inherit.js#L5) 
##### ```function([, Constructor || Object] , Heir)```
Inherits any number of Constructors or objects into a heir consructor or object. All inherit objects gain a method ```.super(this)``` which is a wrapper around ```this.constructor```
 - ```[, Constructor || Object ]``` {Mixed} Any number of constructor functions or objects.
 - ```Heir``` {Mixed} A heir constructor or object

##### Example
-----
```js
var inherit = pineapple.utils.inherit
  , Person
  , Joseph
  , Dominic
  , joe
  , dom

Person = function Person(name){
  this.name = name || "Anonymous";
};

Person.prototype.sayName = function(){
  console.log(this.name + ' says: "My name is ' + this.name + '."');

  return this;
};

Joseph = inherit(Person, function Joseph(){
  this.super(this, 'Joseph');
});

Joseph.prototype.dance = function(){
  return "This is me " + this.name + " Dancing!";
};

Dominic = inherit(Person, function Dominic(){
  this.super(this, 'Dominic');
});

Dominic.prototype.run = function(){
  return "This is me " + this.name + " Running!";
};

joe = new Joseph();
dom = new Dominic();

joe.sayName(); // Joseph says: "My name is Joseph."
dom.sayName(); // Dominic says: "My name is Dominic."
```
[Top](#pineapple1)
_____

## [noop](https://github.com/moovatom/pineapple/blob/master/lib/utilities/index.js#L7) 
##### ```function()```
A no operation function. Returns nothing. Does nothing. Noop.

[Top](#pineapple1)
_____

## [returnMe](https://github.com/moovatom/pineapple/blob/master/lib/utilities/index.js#L8) 
##### ```function()```
Returns the scope repreentation of ```this```

[Top](#pineapple1)
_____

## [makeArray](https://github.com/moovatom/pineapple/blob/master/lib/utilities/index.js#L9) 
##### ```function(Heir)```
Turns an object into an array. This is ideal for the ```arguments``` object.
 - ```object``` {Object} The object to make an array.

##### Example
-----
```js
var args = pineapple.utils.makeArray(arguments);
console.log(args.pop) // [Function]
```

[Top](#pineapple1)
_____

## [valueFromPath](https://github.com/moovatom/pineapple/blob/master/lib/utilities/index.js#L23) 
##### ```function(path, object)```
Returns a value on an object based on a string path
 - ```path``` {String} The path to the value.
 - ```object``` {Object} The object who holds the value.

[Top](#pineapple1)
_____

## [parseStringVariables](https://github.com/moovatom/pineapple/blob/master/lib/utilities/index.js#L27) 
##### ```function(string, variables)```
Returns a value on an object based on a string path
 - ```string``` {String} The string who holds variables to be parsed.
 - ```variables``` {Object} The key to value variable object whos values are desired in the string

[Top](#pineapple1)
_____


Copyright and license
---------------------

Copyright 2012

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

- - -
pineapple(1) copyright 2012
moovatom - joseph.werle@gmail.com