pineapple(1)
===============

# Extensions Specification
This document provides the high level specification for defining an extension with pineapple. All extensions are Architect plugins and
therefore conform to [architects plugin definition](https://github.com/c9/architect)

## Creating an extension
```sh
$ pineapple ext create <name>
```
This command should invoke the creation process of an extension. It should create a boilerplate file structure for
a new pineapple extension with the following tree:
```sh
├── PaplFile
├── config.js
├── configure.js
├── index.js
├── install.js
├── package.json
├── plugins/
└── remove.js
```

## Installing an extension
```sh
$ pineapple install <name>|<githubrepo>|<gitrepo> [-g]
```
OR
```sh
$ pineapple ext install <name>|<githubrepo>|<gitrepo> [-g]
```
This command should invoke the install process of an extension. It could read from a Pineapple registry (coming soon?), a Github repository, pr a git repository. It must be a registered Pineapple extension or a github repository. If a global (-g) flag is provided, then it will install this extension as a global pineapple extension. If not, then it will install it to your local pineapple extension directory. The extensions install() method if provided will be invoked if defined in install.js within the extensions directory.

## Configuring an extension
```sh
$ pineapple ext confingure <name> [, <args>]
```
This command should invoke an extensions configure() method if provided by configure.js within an extensions directory. This is an optional interface implementation. Not all extensions are required to have this interface method defined.

## Removing an extensions
```sh
$ pineapple remove <name> [-g]
```
OR
```sh
$ pineapple ext remove <name> [-g]
```
This command should invoke an extensions remove method if defined in remove.js within an extensions directory. Pineapple will remove the extension from the local pineapple application if no global (-g) flag is provided, otherwise it will remove it globaly.