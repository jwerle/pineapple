pineapple(1)
===============
A very simple and extendable RESTful API framework. Includes routing and a model wrapper around MongoDB. 
It currently wraps Restify and Mongoose with an interface.

### Install
```
$ git clone git@github.com:moovatom/pineapple.git; cd pineapple; sudo ./scripts/install
```

### Usage
```
$ pineapple server
Pineapple API Server started. Listening on port 4000
```

### Configuration
```js
/**
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
// development
{
  "database" : {
    "database" : "pineapple_development"
  }
}

// production
{
  "database" : {
    "database" : "pineapple_production"
  }
}

```

### Routes
```js
// Catch all for '/user'
router.all('/user', 'user.User');
// OR
router.create('*', '/user', 'user.User');

// Get user by uuid with a GET request
router.get('/user/:uuid', 'user.User.get');
// OR
router.create('GET', '/user/:uuid', 'user.User.get');

// Basic CRUD methods which wrap router.create(method, path, bound);
router.post('/user', 'user.User.create');
router.get('/user/:uuid', 'user.User.get');
router.put('/user/:uuid', 'user.User.update');
router.del('/user/:uuid', 'user.User.delete');
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