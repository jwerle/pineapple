var http = {};

http.JSONResponse = function JSONResponse(code, vars, data) {
  var self = this, cons

  code = pineapple.objects.http.codes[code];

  if (! code) {
    throw new pineapple.server.ServerError("Invalid HTTP code.");
  }

  if (typeof vars === 'object') {
    if (vars.type) {
      if (typeof (cons = pineapple.utils.valueFromPath(vars.type, global)) === 'function') {
        cons.call(this);

        pineapple.utils.object.merge(this, cons.prototype);
      }

      delete vars.type;
    }
  }

  this.code    = code.code;
  this.status  = code.status;
  
  if (code.message) {
    this.message  = pineapple.utils.parseStringVariables(code.message, vars || {});
  }

  if (code.method) {
    this.method = pineapple.utils.parseStringVariables(code.method, vars || {});
  }

  if (code.resource) {
    this.resource = pineapple.utils.parseStringVariables(code.resource, vars || {});
  }

  if (this.code === pineapple.server.OK) {
    this.data     = data || vars || {};
  }

  if (typeof self.data === 'object' && typeof self.data.data === 'object') {
    self = pineapple.utils.object.merge(this, this.data.data);

    delete this.data;
  }

  return self
};

module.exports = http;