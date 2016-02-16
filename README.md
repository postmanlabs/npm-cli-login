# npm-cli-login

Allows you to log in to NPM without STDIN, STDOUT. Use in places like CI build systems.
Also creates entries in the ``` ~/.npmrc ``` file for authentication.

### Installation
``` npm install -g npm-cli-login```

Use -g flag to use npm-cli-login via the CLI

### Usage

##### CLI

``` npm-cli-login ``` expects the following environment variables to be set before you can use it to authenticate:

- NPM_USER: NPM username
- NPM_PASS: NPM password
- NPM_EMAIL: NPM email
- NPM_REGISTRY: (optional) Private NPM registry to log in to (If not set, public NPM is used, https://registry.npmjs.org)
- NPM_SCOPE: (optional) Private NPM scope

Once the required ones are set, you can just run the following to log in: ``` npm-cli-login ```

You can also export variables and run it all in one line:

``` NPM_USER=testUser NPM_PASS=testPass NPM_EMAIL=test@example.com npm-cli-login ```

##### Programmatic

To use the package programmtically, just require the module and pass in your NPM auth details as arguments:

``` require('npm-cli-login')(username, password, email [, registry, scope]) ```

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
    scope = '@myScope'

npmLogin(username, password, email, registry, scope)
```
