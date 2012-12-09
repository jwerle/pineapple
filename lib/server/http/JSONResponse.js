var http = {};

http.JSONResponse = function JSONResponse(code, vars, data) {
  code = pineapple.objects.http.codes[code];

  if (! code) {
    throw new pineapple.server.ServerError("Invalid HTTP code.");
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
};

module.exports = http;