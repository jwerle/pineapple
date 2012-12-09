var database = {};

database.DatabaseError = pineapple.utils.inherit(Error, function DatabaseError(message) {
  this.name     = "DatabaseError";
  this.message  = message;
});

module.exports = database;