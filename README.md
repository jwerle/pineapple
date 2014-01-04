pineapple
===============

http://pineapple.werle.io/

[![Build Status](https://travis-ci.org/jwerle/pineapple.png?branch=master)](https://travis-ci.org/jwerle/pineapple)


A MVC based, yet arguably liberal RESTful API framework. 
Includes routing, controllers, models, utilities, and a MongoDB interface.

# NO LONGER SUPPORTED

---

# Table of Contents
* [Install](#install)
* [Documentation](https://github.com/jwerle/pineapple/wiki)
* [Change Log](https://github.com/jwerle/pineapple/blob/master/CHANGELOG.md)
* [Creating a new application](#creating-a-new-app)
* [Starting a Server](#starting-a-pineapple-server)
* [Starting a Console](#starting-a-pineapple-console)
* [Application Structure](#basic-app-structure)
* [Issues](#issues)
* [Community](#community)
* [License](#copyright-and-license)

---
[top](#pineapple)


## Install
===
`pineapple` requires global installation for the CLI utilitiy. If you do not plan on using pineapple to manage a pineapple
application from the command line then using it as a local module is fine.
```sh
$ [sudo] npm install -g pineapple
```

---
[top](#pineapple)


## Creating a new app
===
`pineapple gen <name>`

Creating a pineapple application can easily be achieved with `pineapple gen`
```sh
$ pineapple gen myapp
[pineapple] => Going to grab all of those dependencies now..
[pineapple] => This may take a while..
[pineapple] => Sweet! I've created a new Pineapple application here => /Users/werle/myapp
```

---
[top](#pineapple)


## Starting a pineapple server
===
`pineapple server`

Starting a pineapple server of a pineapple application is as simple as executing `pineapple server` from the directory of
the pineapple application.

## shell
```sh
$ pineapple server
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
  var request  = this.request
    , response = this.response
    
  // output some sanity
  pineapple.api.logger.success("Got the request, emitting response..");

  // response with a json response
  this.json({
    message  : "Hello world! I'm a pineapple api server."
  });

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
pineapple.api.listen(4000, function(){
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
[top](#pineapple)


## Starting a pineapple console
===
```
$ pineapple console
...

everybit-local> pineapple.models
{ User: { [Function: User] super: [Function] },
  Profile: { [Function: Profile] super: [Function] },
  CreditCard: { [Function: CreditCard] super: [Function] },
  Video: { [Function: Video] super: [Function] },
  Version: { [Function: Version] super: [Function] },
  Media: { [Function: Media] super: [Function] },
  Image: { [Function: Image] super: [Function] },
  Blurb: { [Function: Blurb] super: [Function] },
  Audio: { [Function: Audio] super: [Function] },
  user: 
   { User: { [Function: User] super: [Function] },
     Profile: { [Function: Profile] super: [Function] },
     CreditCard: { [Function: CreditCard] super: [Function] } },
  media: 
   { Video: { [Function: Video] super: [Function] },
     Version: { [Function: Version] super: [Function] },
     Media: { [Function: Media] super: [Function] },
     Image: { [Function: Image] super: [Function] },
     Blurb: { [Function: Blurb] super: [Function] },
     Audio: { [Function: Audio] super: [Function] } },
  getSchema: [Function] }
everybit-local> 
```


---
[top](#pineapple)


## Basic app structure
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
│   │   ├── Application.js
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
├── package.json
└── test
    └── app
        └── README.md
```

---
[top](#pineapple)


## Issues?
===
Submit all bugs [here](https://github.com/jwerle/pineapple/issues/new)

---
[top](#pineapple)


## Community
===
Join the google group [here](https://groups.google.com/forum/?hl=en&fromgroups#!forum/pineapplejs)

IRC? Hang out with us at #papl

---
[top](#pineapple)


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
**pineapple** copyright 2012
werle.io - joseph@werle.io
