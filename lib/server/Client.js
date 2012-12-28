/**
  @namespace server
**/
var server = {};

server.Client = function Client(name, adapter, options) {
  name           = name || pineapple.app.name;
  options        = options || {}
  options.client = pineapple.utils.object.merge(options.client || {}, {
    headers : {
      'x-apikey' : options.apikey || false
    }
  });

  this.username = options.username || false;
  this.password = options.password || false;
  this.apikey   = options.apikey   || false;
  this.api      = new pineapple.server.Server(name, adapter, pineapple.server.adapters.get(adapter));
  this.client   = this.api.adapter.client.create(options);
};

server.Client.prototype.method = function(name, func) {
  var args = pineapple.utils.makeArray(arguments)
    , func, self = this

  if (typeof func === 'function') {
    this[name] = function(){ return func.apply(self.client, arguments) };
  }
  else if (typeof name === 'function') {
    while (func = args.shift()) {
      if (typeof func === 'function') {
        if (func.name.length) {
          this[func.name] = (function(func){ return function(){ return func.apply(self.client, arguments) } })(func);
        }
      }
    }
  }
  else if (typeof name === 'object') {
    for (func in name) {
      if (typeof name[func] === 'function') {
        this[func] = function(){ return name[func].apply(self.client, arguments) }
      }
    }
  }
  else {
    throw new Error(name + " is not a function.");
  }

  return this;
};

server.Client.prototype.auth = function(type) {
  switch (type) {
    default : case 'user' :
      this.client.basicAuth(this.username, this.password);
    break;

    case 'apikey' :
      this.client.headers['x-apikey'] = this.apikey;
    break;
  }

  return this;  
}

server.Client.prototype.generateUserAgent = function() {
  "Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405"

  var appName, appVersion
    , deviceName, deviceVersion
    , engineName, engineVersion

  appName = pineapple.app.name
  appVersion = pineapple.package.version

  return [appName + '/' + appVersion, '(Pineapple-Server/' + pineapple.VERSION +')'].join(' ');
}

module.exports = server;