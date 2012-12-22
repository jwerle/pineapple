var EventEmitter  = require('events').EventEmitter
  , DatabaseError = require('./DatabaseError').DatabaseError

/**
  @namespace database
**/
var database =  {};

database.Database = pineapple.utils.inherit(EventEmitter, function Database(name, type, adapter){
  var self = this;

  this.name     = name;
  this.type     = type;
  this.adapter  = adapter;
  this.logger   = new pineapple.logger.Logger('db', pineapple.ABSOLUTE_PATH + '/log/db');

  this.adapter.init(this);

});

database.Database.prototype.connect = function(){
  var self = this
   this.on('connection.error', function(error){
    self.logger.fail(new DatabaseError(error.toString()).toString());
  });

  this.adapter.connect.apply(this.adapter, arguments);

  return this;
}

module.exports = database;