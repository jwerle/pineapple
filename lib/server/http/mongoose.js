/**
  @namespace adapters
**/
var adapters = {};

adapters.mongoose = {
  connect   : function() {
    return mongoose.connect.apply(mongoose, arguments);
  }
};

module.exports = adapters.mongoose;