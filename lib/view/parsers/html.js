module.exports.render = function(buffer, callback) {
  if (typeof callback === 'function') {
    callback.call(this, buffer.toString());
  }

  return this;
};

module.exports.configure = function(view, callback) {
  
  if (typeof callback === 'function') {
    callback(view)
  }

  return this;
}

module.exports.responseConfiguration = function(response) {
  var type = 'text/html';

  response.contentType = type;

  return this;
};