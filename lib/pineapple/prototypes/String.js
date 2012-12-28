String.prototype.toProperCase = function() {
  return this.charAt(0).toUpperCase() + this.substr(1);
}

module.exports = String.prototype;