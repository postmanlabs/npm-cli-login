# npm-cli-login [![Build Status](https://travis-ci.org/postmanlabs/npm-cli-login.svg?branch=master)](https://travis-ci.org/postmanlabs/npm-cli-login)

Allows you to log in to NPM without STDIN, STDOUT. Use in places like CI build systems.
Also creates/modifies entries in the ~/.npmrc file for authentication.

### Installation

    npm install -g npm-cli-login

Use -g flag to use npm-cli-login via the CLI

### Usage

##### CLI

```npm-cli-login``` expects the following environment variables to be set before you can use it to authenticate:

- `NPM_USER`: NPM username
- `NPM_PASS`: NPM password
- `NPM_EMAIL`: NPM email
- `NPM_REGISTRY`: (optional) Private NPM registry to log in to (If not set, public NPM is used, https://registry.npmjs.org)
- `NPM_SCOPE`: (optional) Private NPM scope

Once the required ones are set, you can just run the following to log in:

    npm-cli-login

You can also export variables and run it all in one line:

```NPM_USER=testUser NPM_PASS=testPass NPM_EMAIL=test@example.com npm-cli-login```

There is also support for command line arguments:

- ```-u```: NPM Username
- ```-p```: NPM Password
- ```-e```: NPM Email
- ```-r```: NPM Registry
- ```-s```: NPM Scope
- ```--quotes```: Set to ```false``` by default. Specifies wheather your auth token requires quotes. This might required when your auth token has special characters, like ```=```, ```?``` etc.

For example: ```npm-cli-login -u testUser -p testPass -e test@example.com```

Or: ```npm-cli-login -u testUser -p testPass -e test@example.com -r https://private.npm.com -s @privateNPM --quotes```

Do note that at least one of the two ways must be configured, that is, you must either provide the required fields (username, password and email) using the environment variables or the command line arguments (or both)

##### Programmatic

To use the package programmatically, just require the module and pass in your NPM auth details as arguments:

    var npmLogin = require('npm-cli-login');
    npmLogin(username, password, email [, registry, scope, quotes]);

##### Example

Logging in to the NPM registry:

```
var npmLogin = require('npm-cli-login'),
    username = 'testUser',
    password = 'testPass',
    email = 'test@example.com'

npmLogin(username, password, email)
```

Logging in to private NPM registries:

```
var npmLogin = require('npm-cli-login'),
    username = 'testUser',
    password = 'testPass',
    email = 'test@example.com',
    registry = 'https://npm.example.com',
    scope = '@myScope',
    quotes = false

npmLogin(username, password, email, registry, scope)
```
