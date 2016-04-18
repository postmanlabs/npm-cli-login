# npm-cli-login [![Build Status](https://travis-ci.org/postmanlabs/npm-cli-login.svg?branch=master)](https://travis-ci.org/postmanlabs/npm-cli-login)

Allows you to log in to NPM without STDIN, STDOUT. Use in places like CI build systems.
Also creates/modifies entries in the ~/.npmrc file for authentication.

### Installation

    npm install npm-cli-login

Using the -g flag isn't necessary when you run via NPM
(NPM automatically passes the project scope to all commands)

### Usage

##### CLI

The CLI provides two ways to authenticate:

###### Environment Variables

`npm-cli-login` expects the following environment variables to be set before you can use it to authenticate:

- `NPM_USER`: NPM username
- `NPM_PASS`: NPM password
- `NPM_EMAIL`: NPM email
- `NPM_REGISTRY`: (optional) Private NPM registry to log in to (Default: https://registry.npmjs.org)
- `NPM_SCOPE`: (optional) Private NPM scope
- `NPM_RC_PATH`: (optional) Path to a custom .npmrc file you want to update (Default: `~/`)  (Do note this is the path of the file, not the file itself)

Once the required ones are set, you can just run the following to log in:

    npm-cli-login

You can also export variables and run it all in one line:

    NPM_USER=testUser NPM_PASS=testPass NPM_EMAIL=test@example.com npm-cli-login

###### Command Line Arguments
There is also support for command line arguments:

- `-u`: NPM Username
- `-p`: NPM Password
- `-e`: NPM Email
- `-r`: NPM Registry
- `-s`: NPM Scope
- `--quotes`: Set to `false` by default. Specifies whether your auth token requires quotes. This might required when your auth token has special characters, like `=`, `?` etc.
- `--config-path`: Set to `~/` by default. Can be used to configure a custom .npmrc file to edit (Do note this is the path of the file, not the file itself)

For example: ```npm-cli-login -u testUser -p testPass -e test@example.com```

Or: ```npm-cli-login -u testUser -p testPass -e test@example.com -r https://private.npm.com -s @privateNPM --quotes --config-path="./custom/path/"```

Do note that if you installed `npm-cli-login` globally, the Config file may not work.
The best way around it is to install `npm-cli-login` locally and use NPM scripts to run it. The project scope is automatically passed. More information [here](https://docs.npmjs.com/misc/scripts)

###### Environment variables
When using this method, the CLI expects the following environment variables to be set::

- `NPM_USER`: NPM username
- `NPM_PASS`: NPM password
- `NPM_EMAIL`: NPM email
- `NPM_REGISTRY`: (optional) Private NPM registry to log in to (Default: public NPM, https://registry.npmjs.org)
- `NPM_SCOPE`: (optional) Private NPM scope (Default: false)
- `NPM_CONFIG_PATH`: (optional) Path to a custom .npmrc file you want to modify (Default: `~/`)

Once the required ones are set, you can just run the following to log in:

    npm-cli-login

You can also export variables and run it all in one line:

```NPM_USER=testUser NPM_PASS=testPass NPM_EMAIL=test@example.com npm-cli-login```

###### Note
Do note that at least one of the three ways must be configured, that is, you must either provide the required fields (username, password and email) using the environment variables or the command line arguments or the configuration file (or all three). The three ways have the following precedence:
1. Command Line Arguments (highest)
2. Configuration File
3. Environment Variables (lowest)

##### Programmatic API

To use the package programmatically, just require the module and pass in your NPM auth details as arguments:

    var npmLogin = require('npm-cli-login');
    npmLogin(username, password, email [, registry, scope, quotes, configPath]);

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
    quotes = false,
    configPath: './custom/path/'

npmLogin(username, password, email, registry, scope, configPath)
```
