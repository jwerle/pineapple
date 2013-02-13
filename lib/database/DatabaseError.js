var database = {};

database.DatabaseError = pineapple.utils.inherit(Error, function DatabaseError(message) {
  Error.call(this);
  this.name     = "DatabaseError";
  this.message  = message;
  Error.captureStackTrace(this);
});

module.exports = database;