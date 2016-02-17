var RegClient = require('npm-registry-client'),
    client = new RegClient({}),
    fs = require('fs'),
    path = require('path');

module.exports = function (npm_user, npm_pass, npm_email, npm_registry, npm_scope, quotes) {
  var registry = npm_registry || 'https://registry.npmjs.org',
      scope = npm_scope,

  client.adduser(registry, {
    auth: {
      username: npm_user,
      password: npm_pass,
      email: npm_email
    }
  }, function (err, data, raw, res) {
    if(err) {
      console.log(err);
    }
    else {
      fs.readFile(path.join(process.env.HOME, '.npmrc'), 'utf-8', function(err, contents) {
        if(err) {
          contents = ''
        }
        // Convert the file contents into an array
        var lines = contents.split('\n')

        var scopeWrite = lines.findIndex(function (element, index, array) {
          if( element.indexOf(scope + ':registry=' + registry) !== -1) {
            // If an entry for the scope is found, replace it
            element = scope + ':registry=' + registry
            return true
          }
        })
        // If no entry for the scope is found, add one
        if (scopeWrite == -1) {
          lines.push(scope + ':registry=' + registry)
        }

        var authWrite = lines.findIndex(function (element, index, array) {
          if( element.indexOf(registry.slice(registry.search(/\:\/\//, '') + 1) + '/:_authToken=') !== -1) {
            // If an entry for the auth token is found, replace it
            array[index] = element.replace(/authToken\=.*/, 'authToken=' + (quotes ? '"' : '') + data.token + (quotes ? '"' : ''))
            return true
          }
        })
        // If no entry for the auth token is found, add one
        if (authWrite == -1) {
          lines.push(registry.slice(registry.search(/\:\/\//, '') + 1) + '/:_authToken=' + (quotes ? '"' : '') + data.token + (quotes ? '"' : ''))
        }

        // Sew everything together and write to NPMRC
        fs.writeFile(path.join(process.env.HOME, '.npmrc'), lines.join('\n'));
      })
    }
  });
}
