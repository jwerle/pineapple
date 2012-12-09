module.exports.get = function(validator){
  if (typeof this[validator] === 'function') {
    return this[validator]
  }
  else {
    return false;
  }
}