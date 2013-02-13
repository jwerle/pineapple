var EventEmitter  = require('events').EventEmitter
  , DatabaseError = require('./DatabaseError').DatabaseError

/**
  * @namespace database
  */
var database =  {};

/**
  * Constructs a new Database instance
  * 
  * @constructor Database
  * @param {String} name - Database name
  * @param {String} type - The database type
  * @param {Object} adapter - The database adapter
  */
database.Database = function Database(name, type, adapter){
  var self = this;
  EventEmitter.call(this);
  this.name     = name;
  this.type     = type;
  this.adapter  = adapter;
  this.logger   = new pineapple.logger.Logger('db', pineapple.ABSOLUTE_PATH + '/log/db');
  this.adapter.init(this);
};

database.Database.prototype = new EventEmitter();
database.Database.prototype.constructor = database.Database;

/**
  * Connects to the given database with the adapter
  *
  * @return {Object} - Returns a reference to this
  */
database.Database.prototype.connect = function(){
  var self = this
  this.on('connection.error', function(error){
    self.logger.fail(new DatabaseError(error.toString()).toString());
  });

  this.adapter.connect.apply(this.adapter, arguments);
  return this;
}

// exports the namespace
module.exports = database;