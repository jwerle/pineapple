pineapple(1)
===============
[![Build Status](https://travis-ci.org/jwerle/pineapple.png?branch=master)](https://travis-ci.org/jwerle/pineapple)

A very simple and extendable RESTful API framework. Includes routing and a model wrapper around MongoDB. 
It currently wraps Restify and Mongoose with an interface.

### Install
```
$ sudo npm install -g pineapple
```

### Creating a new app
```
$ pineapple gen myapp
Requiring app module /package.json
[pineapple] => New Pineapple application created at /Users/werle/tmp/myapp
```

### Starting pineapple
```
$ pineapple server
Requiring app module /config/environment
Requiring app module /config/development
Requiring app module /config/application
Requiring app module /package.json
Requiring app module /config/routes.js
Requiring app module /app/controllers
Requiring app module /app/models
Pineapple API Server started. Listening on port 4000
```

### Check it!
```
$ curl http://localhost:4000
{"code":200,"status":true,"data":{"method":"GET","resource":"/","message":"pineapple.controllers.pineapple.Api.index() was called."}}
```


### Basic app structure
```
├── Capfile
├── Jakefile
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
├── log
├── package.json
└── tests
    └── app
        └── README.md
```


### Command line API
```
pineapple           - If executed from an application directory it will read your files and show you a usage prompt.
pineapple update    - Installs all the necessary dependents for the Pineapple API Service.
pineapple test      - <namespace> <suite> Execute test suites.
pineapple server    - <command> Execute server commands
pineapple help      - Display this message
pineapple git       - <command> <args> Execute git commands on your current pineapple repository
pineapple gen       - Generates a new pineapple api application.
pineapple daemon    - Creates a daemon process for a Pineapple application.
pineapple console   - [-f] Start a console with your Pineapple application
pineapple app       - Display package information for the application.
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
