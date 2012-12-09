pineapple(1)
===============
A very simple and extendable RESTful API framework. Includes routing and a model wrapper around MongoDB. 
It currently wraps Restify and Mongoose with an interface.

### Install
```
$ git clone git@github.com:moovatom/pineapple.git; cd pineapple; sudo ./scripts/install
```

### Configuration
```js
/** config/environment.js
 * Environment - Default confgiuration
 * 
 * Access it at pineapple.config
 * */
{
  "server" : {
    "port"     : 4000,
    "adapter"  : "restify",
    "config"   : {
      "name"      : "Pineapple",
      "version"   : "1.0.0"
    }  
  },

  "database" : {
    "host"      : "localhost",
    "adapter"   : "mongoose"
  },

  "env" : "development"
}

/** 
 * Development|Production|Other
 * 
 * Your environment is specified in the
 * environment config with the "env" property
 * */
// config/development.js
{
  "database" : {
    "database" : "pineapple_development"
  }
}

// config/production.js
{
  "database" : {
    "database" : "pineapple_production"
  }
}

```

### Routes
```js
const API_VERSION = parseInt(pineapple.config.server.config.version);

var router = new pineapple.router.Router()

router.useMethods(['GET', 'POST', 'PUT', 'DEL']);
router.setDefaultAction('index');

router.create('GET', '/', 'pineapple.Api.index');
router.get('/:resource', 'pineapple.Api'); // defaults to pineapple.Api.index
```

### Usage
```
$ pineapple server
Pineapple API Server started. Listening on port 4000
```

```
$ curl -i -L http://localhost:4000/
{"code":200,"status":true,"data":{"method":"GET","resource":"/"}}
```

```
$ curl -i -L http://localhost:4000/video
{"code":200,"status":true,"data":{"method":"GET","resource":"/video","message":"pineapple.controllers.pineapple.Api.index() was called."}}
```

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
pineapple(1) copyright 2012
moovatom - joseph.werle@gmail.com