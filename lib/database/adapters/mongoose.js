var EventEmitter = require('events').EventEmitter;

/**
  @namespace adapters
**/
var adapters = {};

adapters.mongoose = {
  init      : function(db) {
    mongoose.connection.on('error', function(error){
      db.emit('connection.error', error);
    })
  },

  connect   : function() {
    var self = this

    return mongoose.connect.apply(mongoose, arguments);
  }
};

EventEmitter.call(adapters.mongoose)

module.exports = adapters.mongoose;