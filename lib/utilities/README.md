pineapple(1)
===========

Utilities
---------
```js
/**
 *  Pineapple utilitiy object
 * 
 * Extends Mde's utility object. 
 *  See here - https://github.com/mde/utilities
 * 
 * @public
 * @object
 * */
pineapple.utils = {};

```
_____
## [Loader](https://github.com/moovatom/pineapple/blob/master/lib/utilities/Loader.js#L17) 
##### ```function(directory, extensions, excluded)```
Loader Prototype.
  - ```directory``` {String} The directory to load
  - ```extensions``` {Array} The extensions to match when parsing a directory. **Default** is ```.js```
  - ```excluded``` {Array} Excluded directory or file names

#### API
### *static* Loader.load ```function(directory, extensions, excluded)```
See **Loader#load**

Go to the [code](https://github.com/moovatom/pineapple/blob/master/lib/utilities/Loader.js#L23)
_____

### Loader#load 
##### ```function(directory, extensions, excluded)```
Recursively requires a directory tree in an object.
####### Arguments
  - ```directory``` {String} The directory to load
  - ```extensions``` {Array} The extensions to match when parsing a directory. **Default** is ```.js```
  - ```excluded``` {Array} Excluded directory or file names

Go to the [code](https://github.com/moovatom/pineapple/blob/master/lib/utilities/Loader.js#L27)
_____

## [inherit](https://github.com/moovatom/pineapple/blob/master/lib/utilities/inherit.js#L5) 
##### ```function([, Constructor || Object] , Heir)```
Inherits any number of Constructors or objects into a heir consructor or object.
 - ```[, Constructor || Object ]``` {Mixed} Any number of constructor functions or objects.
 - ```Heir``` {Mixed} A heir constructor or object

_____

## [noop](https://github.com/moovatom/pineapple/blob/master/lib/utilities/index.js#L7) 
##### ```function()```
A no operation function. Returns nothing. Does nothing. Noop.

_____

## [returnMe](https://github.com/moovatom/pineapple/blob/master/lib/utilities/index.js#L8) 
##### ```function()```
Returns the scope repreentation of ```this```

_____

## [makeArray](https://github.com/moovatom/pineapple/blob/master/lib/utilities/index.js#L9) 
##### ```function(Heir)```
Turns an object into an array. This is ideal for the ```arguments``` object.
 - ```object``` {Object} The object to make an array.

_____
