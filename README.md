![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-color-2-e1357499518266.png) ![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-color-2-e1357499518266.png) ![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-color-2-e1357499518266.png) ![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-color-2-e1357499518266.png) 
pineapple(1)
===============
[![Build Status](https://travis-ci.org/jwerle/pineapple.png?branch=master)](https://travis-ci.org/jwerle/pineapple)

A very simple, fun, and extendable RESTful API framework that includes routing and a model wrapper around MongoDB. 
Built for MVC idealist with the intentions of just stepping out of the way and helping you get your data.


---

![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)
![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)
![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)
![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)
![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)

# Table of Contents
* [Install](#install)
* [Examples](#examples)
* [Creating a new application](#creating-a-new-app)
* [Starting a Server](#starting-a-pineapple-server)
* [Starting a Console](#starting-a-pineapple-console)
* [Application Structure](#basic-app-structure)
* [Issues](#issues)
* [Community](#community)
* [License](#copyright-and-license)

![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)
![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)
![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)
![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)
![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)

---
[top](#pineapple1)


![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)Install
===
`pineapple` requires global installation for the CLI utilitiy. If you do not plan on using pineapple to manage a pineapple
application from the command line then using it as a local module is fine.
```sh
$ [sudo] npm install -g pineapple
```

---
[top](#pineapple1)


![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)Examples
===
* [app](https://github.com/jwerle/pineapple/tree/master/examples/app) The example found [here](#node)
* [myapp](https://github.com/jwerle/pineapple/tree/master/examples/myapp) The application that was generated [here](#creating-a-new-app)

---
[top](#pineapple1)


![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)Creating a new app
===
`pineapple gen <name>`

Creating a pineapple application can easily be achieved with `pineapple gen`
```sh
$ pineapple gen myapp
[pineapple] => Sweet! I've created a new Pineapple application here => /Users/werle/repos/myapp
```

---
[top](#pineapple1)


![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)Starting a pineapple server
===
`pineapple server`

Starting a pineapple server of a pineapple application is as simple as executing `pineapple server` from the directory of
the pineapple application.

## shell
```sh
$ pineapple [server|s]
Requiring app module /config/environment
Requiring app module /config/development
Requiring app module /config/application
Requiring app module /config/routes.js
Requiring app module /app/controllers
Requiring app module /app/models
[app] => Found the Paplfile file. => /Users/werle/repos/myapp/Paplfile
[server] => Listening on port 4000
```

## node
You could utilize the pineapple module and create your own server without using a skeleton pineapple application.
The contents of the `app.js` file below whose only dependency is `pineapple` demonstrates the process
of using pineapple in node with minimal requirements. Consider the following app structure:
```sh
├── app.js
└── node_modules
    └── pineapple (pineapple module)
```
You could then use pineapple to create a server, bind routes, and listen on a port to start the service.
```js
// it isn't needed to store pineapple in a variable as it is attached
// to the global object during its bootstrap
require('pineapple');

// define an app name 
var appName = "myService";

// server config
var serverConfig = {
  port   : 4000, 
  config : { 
    name : appName
  }
};

// Let pineapple no about your app name
pineapple.app.name = appName;

// we can create a server with minimal configuration
pineapple.api.create(serverConfig);

/**
 * In order for your server to work we will need some routes set up.
 * That can easily be achieved with pineapple's built in router.
 * 
 * The Router supports basic POST, GET, PUT, and DELETE protocols via
 * convenience methods:
 *  router.post(uri_path, [controller_path|callback]); // POST
 *  router.get(uri_path, [controller_path|callback]); // GET
 *  router.put(uri_path, [controller_path|callback]); // PUT
 *  router.del(uri_path, [controller_path|callback]); // DELETE
 *
 * If you need to set a custom method you can call .create() directly:
 *  router.create(CUSTOM_METHOD, uri_path, [controller_path|callback]);
 **/
// we need to create a router instance
var router = new pineapple.router.Router();

// lets get a "Hello world" going
router.get('/hello', function(request, response){
  // output some sanity
  pineapple.api.logger.success("Got the request, emitting response..");

  // response with a json response
  response.json(pineapple.server.OK, new pineapple.server.http.JSONResponse(pineapple.server.OK, {
    message  : "Hello world! I'm a pineapple api server."
  }));

  // Got the request now close the connection
  pineapple.api.logger.warn("Closing connection..");

  // close the connection
  pineapple.api.close();

  // warn pineapples departure
  pineapple.logger.warn("Exiting pineapple..");

  // exit..
  // you never really have to call .exit() directly..
  pineapple.exit();
});

// we need to bind the routes we just created to the server
pineapple.api.bindRoutes(router.routes);

// once all is said and done, we can finally start the server
// the .listen() method accept a port and a callback for arguments
pineapple.api.listen(serverConfig.port, function(){
  // tap into pineapples api logger
  pineapple.api.logger.info("Connected! =)");
});
```
From the command line you can then execute the `app.js` file with the `node` executable
which will output something like this:
```sh
$ node app.js
[server] => Connected! =)
```
From the browser or from a program like [cURL](http://curl.haxx.se/docs/manpage.html) you could hit the following url `http://localhost:4000/hello` while your app is running.
```sh
$ curl http://localhost:4000/hello
{"code":200,"status":true,"data":{"message":"Hello world! I'm a pineapple api server."}}
```

---
[top](#pineapple1)


![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)Check it!
===
```sh
$ curl http://localhost:4000
{"code":200,"status":true,"data":{"method":"GET","resource":"/","message":"pineapple.controllers.pineapple.Api.index() was called."}}
```

---
[top](#pineapple1)


![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)Starting a pineapple console
===
```
$ pineapple [console|c]
Requiring app module /config/environment
Requiring app module /config/development
Requiring app module /config/application
Requiring app module /config/routes.js
Requiring app module /app/controllers
Requiring app module /app/models
[app] => Found the Paplfile file. => /Users/werle/repos/myapp/Paplfile
[console] => Starting pineapple console..
[console] => SUCCESS Have fun!
Starting REPLConsole session with name pineapple with locale local
pineapple-local> [server] => Listening on port 4000
```


---
[top](#pineapple1)


![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)Basic app structure
===
```
myapp/
├── Capfile
├── Jakefile
├── Paplfile
├── Procfile
├── README.md
├── app
│   ├── controllers
│   │   ├── index.js
│   │   └── pineapple
│   │       ├── Api.js
│   │       └── index.js
│   └── models
│       └── index.js
├── config
│   ├── README.md
│   ├── application.json
│   ├── development.json
│   ├── environment.json
│   ├── production.json
│   └── routes.js
├── index.js
├── log
├── package.json
└── test
    └── app
        └── README.md

8 directories, 18 files
```

---
[top](#pineapple1)


![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)Issues?
===
Submit all bugs [here](https://github.com/jwerle/pineapple/issues/new)

---
[top](#pineapple1)


![pineapple](http://werle.io/wp-content/uploads/2013/01/pineapple-slice-e1357498911716.png)Community
===
Join the google group [here](https://groups.google.com/forum/?hl=en&fromgroups#!forum/pineapplejs)

---
[top](#pineapple1)


Copyright and license
---------------------

Copyright 2012

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

- - -
**pineapple(1)** copyright 2012
werle.io - joseph@werle.io
