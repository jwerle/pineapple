module.exports.get = function(adapter){
  var adapters = this.adapters || this;

  if (typeof adapters[adapter] === 'object' || typeof adapters[adapter] === 'function') {
    return adapters[adapter]
  }
  else {
    return false;
  }
}